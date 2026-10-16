import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { cn } from '../../lib/utils.js';
import { Icon } from '@pactor-app/ui/components';
import type { ComposerContextItem, ComposerContextSource } from './index.js';

/** 行内提及块的命令式句柄（工具栏按钮等外部入口向输入区插入块） */
export interface MentionInputHandle {
  /** 在光标处插入提及块（光标不在输入区时追加到末尾） */
  insertChip: (item: ComposerContextItem, source: ComposerContextSource) => void;
  focus: () => void;
}

export interface MentionInputProps {
  /** 受控文本（提及块序列化为 trigger + label，如 "@小助手"） */
  value: string;
  placeholder?: string;
  disabled?: boolean;
  /** 触发符数据源：输入 trigger 字符（词边界）时光标处弹出候选菜单 */
  sources: ComposerContextSource[];
  /** 受控提及块列表（与输入区行内块保持同步） */
  chips: ComposerContextItem[];
  /** 块变更事件（插入 / 退格整体删除），传出输入区当前的块列表 */
  onChipsChange?: (chips: ComposerContextItem[]) => void;
  /** 文本变更事件，传出序列化文本 */
  onChange?: (text: string) => void;
  /** 发送事件（Enter；Shift+Enter 换行；菜单打开时 Enter 为选中候选） */
  onSubmit?: (text: string) => void;
  className?: string;
  style?: CSSProperties;
}

/** 提及菜单状态：触发源 + 实时过滤词 + 光标锚点 */
interface MentionMenuState {
  source: ComposerContextSource;
  query: string;
  /** 光标锚点（fixed 定位）；jsdom 等无布局环境为 0 */
  left: number;
  top: number;
  activeIndex: number;
}

/** 行内块后跟随的占位空白（光标落点；序列化时还原为普通空格） */
const NBSP = '\u00A0';

const CHIP_ATTR = 'data-mention-chip';

/** 触发符正则转义 */
function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isChipElement(node: Node | null | undefined): node is HTMLElement {
  return node instanceof HTMLElement && node.hasAttribute(CHIP_ATTR);
}

/** 序列化输入区内容：文本节点原样（NBSP 还原为空格），提及块 → trigger + label，块级换行 → \n */
function serializeNode(node: Node): string {
  let out = '';
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      out += (child.textContent ?? '').replace(/\u00A0/g, ' ');
    } else if (isChipElement(child)) {
      out += `${child.dataset['trigger'] ?? ''}${child.dataset['label'] ?? ''}`;
    } else if (child instanceof HTMLBRElement) {
      out += '\n';
    } else if (child instanceof HTMLElement) {
      const inner = serializeNode(child).replace(/\n$/, '');
      out += (out === '' || out.endsWith('\n') ? '' : '\n') + inner + '\n';
    }
  });
  return out;
}

/** 收集输入区当前的提及块（DOM 顺序） */
function collectChips(field: HTMLElement): ComposerContextItem[] {
  return Array.from(field.querySelectorAll(`[${CHIP_ATTR}]`)).map((el) => ({
    id: (el as HTMLElement).dataset['id'] ?? '',
    label: (el as HTMLElement).dataset['label'] ?? '',
    trigger: (el as HTMLElement).dataset['trigger'] ?? '',
  }));
}

/** 检测光标前的活跃提及（trigger + query 紧贴光标），未命中返回 null */
function detectActiveMention(
  field: HTMLElement,
  sources: ComposerContextSource[],
): {
  source: ComposerContextSource;
  query: string;
  node: Text;
  triggerStart: number;
  caretOffset: number;
} | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) {
    return null;
  }
  const anchor = selection.anchorNode;
  if (!anchor || anchor.nodeType !== Node.TEXT_NODE || !field.contains(anchor)) {
    return null;
  }
  const caretOffset = selection.anchorOffset;
  const beforeCaret = (anchor.textContent ?? '').slice(0, caretOffset);
  for (const source of sources) {
    const trigger = source.trigger;
    const match = new RegExp(
      `(?:^|\\s)${escapeRegExp(trigger)}([^\\s${escapeRegExp(trigger)}]*)$`,
    ).exec(beforeCaret);
    if (match) {
      const query = match[1] ?? '';
      return {
        source,
        query,
        node: anchor as Text,
        triggerStart: caretOffset - query.length - trigger.length,
        caretOffset,
      };
    }
  }
  return null;
}

/** 块的缺省图标：item.icon > source.icon > 按 trigger 兜底 */
function chipIcon(item: ComposerContextItem, source: ComposerContextSource): string {
  return item.icon ?? source.icon ?? (source.trigger === '@' ? 'user' : 'file-text');
}

/**
 * MentionInput：支持行内提及块的对话输入区（contenteditable）。
 *
 * - 输入 trigger 字符（'@' 等 sources 声明的触发符，词边界）时在光标
 *   位置弹出候选菜单；继续输入实时过滤，↑/↓ 移动候选，Enter 选中，
 *   Esc / 点击菜单外关闭
 * - 选中后把 trigger + 已输入文字替换为行内块（图标 + 文字、浅色背景、
 *   圆角，contenteditable=false 原子块）；退格删除时整体删除
 * - 值模型：对外仍是受控纯文本（块序列化为 trigger+label）+ 受控块列表
 *   （onChipsChange）；value 清空（如发送后）时输入区同步清空
 */
export const MentionInput = forwardRef<MentionInputHandle, MentionInputProps>(
  function MentionInput(
    {
      value,
      placeholder,
      disabled,
      sources,
      chips,
      onChipsChange,
      onChange,
      onSubmit,
      className,
      style,
    },
    ref,
  ) {
    const fieldRef = useRef<HTMLDivElement>(null);
    const [menu, setMenu] = useState<MentionMenuState | null>(null);
    const [empty, setEmpty] = useState(true);
    // 程序化 DOM 变更（受控清空等）期间抑制 chips 外发，避免与调用方的
    // 发送闭环竞争（发送动作读取 state 之前 chips 不能被清空）
    const suppressSyncRef = useRef(false);
    const composingRef = useRef(false);

    const emitChips = (): void => {
      if (suppressSyncRef.current || !fieldRef.current) {
        return;
      }
      onChipsChange?.(collectChips(fieldRef.current));
    };

    const serialize = (): string =>
      fieldRef.current ? serializeNode(fieldRef.current).replace(/\n$/, '') : '';

    /** 构建提及块元素（图标 + 文字、浅色背景、圆角、原子块） */
    const buildChipElement = (
      item: ComposerContextItem,
      source: ComposerContextSource,
    ): HTMLElement => {
      const chip = document.createElement('span');
      chip.setAttribute(CHIP_ATTR, '');
      chip.dataset['id'] = item.id;
      chip.dataset['label'] = item.label;
      chip.dataset['trigger'] = item.trigger ?? source.trigger;
      chip.contentEditable = 'false';
      chip.className =
        'mx-0.5 inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 align-middle text-xs text-foreground';
      const iconMarkup = renderToStaticMarkup(
        <Icon name={chipIcon(item, source)} size={12} />,
      );
      const label = document.createElement('span');
      label.textContent = item.label;
      chip.innerHTML = iconMarkup;
      chip.appendChild(label);
      return chip;
    };

    /** 插入提及块；replace 提供时替换其中的 trigger+query 文本 */
    const insertChipElement = (
      item: ComposerContextItem,
      source: ComposerContextSource,
      replace?: { node: Text; start: number; end: number },
    ): void => {
      const field = fieldRef.current;
      if (!field) {
        return;
      }
      const chip = buildChipElement(item, source);
      let caretNode: Text;
      if (replace) {
        const { node, start, end } = replace;
        const text = node.textContent ?? '';
        node.textContent = text.slice(0, start);
        caretNode = document.createTextNode(`${NBSP}${text.slice(end)}`);
        node.after(chip, caretNode);
      } else {
        // 光标处插入（光标不在输入区时追加到末尾）
        caretNode = document.createTextNode(NBSP);
        const selection = window.getSelection();
        if (
          selection &&
          selection.rangeCount > 0 &&
          selection.anchorNode !== null &&
          field.contains(selection.anchorNode)
        ) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(caretNode);
          range.insertNode(chip);
        } else {
          field.append(chip, caretNode);
        }
      }
      // 光标落到块后的空位
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.setStart(caretNode, 1);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setEmpty(false);
      onChange?.(serialize());
      emitChips();
    };

    useImperativeHandle(ref, () => ({
      insertChip: (item, source) => {
        fieldRef.current?.focus();
        insertChipElement(item, source);
      },
      focus: () => fieldRef.current?.focus(),
    }));

    // 受控清空：value 为空时输入区同步清空（发送后闭环）
    useEffect(() => {
      const field = fieldRef.current;
      if (field && value === '' && serializeNode(field).trim() !== '') {
        suppressSyncRef.current = true;
        field.innerHTML = '';
        setEmpty(true);
        setMenu(null);
        suppressSyncRef.current = false;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    // 受控块列表外部变更（如发送后清空）：移除不在列表中的行内块
    useEffect(() => {
      const field = fieldRef.current;
      if (!field) {
        return;
      }
      const keep = new Set(chips.map((chip) => `${chip.trigger}:${chip.id}`));
      const stale = Array.from(field.querySelectorAll(`[${CHIP_ATTR}]`)).filter(
        (el) =>
          !keep.has(
            `${(el as HTMLElement).dataset['trigger']}:${(el as HTMLElement).dataset['id']}`,
          ),
      );
      if (stale.length > 0) {
        suppressSyncRef.current = true;
        stale.forEach((el) => el.remove());
        suppressSyncRef.current = false;
        setEmpty(serializeNode(field).trim() === '');
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chips]);

    const closeMenu = (): void => setMenu(null);

    const filteredItems = (state: MentionMenuState): ComposerContextItem[] =>
      state.query
        ? state.source.items.filter((item) => item.label.includes(state.query))
        : state.source.items;

    const refreshMenu = (): void => {
      const field = fieldRef.current;
      if (!field) {
        return;
      }
      const active = detectActiveMention(field, sources);
      if (!active) {
        setMenu(null);
        return;
      }
      const range = document.createRange();
      range.setStart(active.node, active.triggerStart);
      range.setEnd(active.node, active.caretOffset);
      // jsdom 等无布局环境 Range 无量测能力，回退到输入区位置
      const rect =
        typeof range.getBoundingClientRect === 'function'
          ? range.getBoundingClientRect()
          : field.getBoundingClientRect();
      setMenu((prev) => ({
        source: active.source,
        query: active.query,
        left: rect.left,
        top: rect.top,
        // 过滤结果变化后候选下标钳制在有效范围内（DSL 每次渲染产出新
        // props 对象，source 按 trigger 比较而非引用）
        activeIndex: Math.min(
          prev?.source.trigger === active.source.trigger ? prev.activeIndex : 0,
          Math.max(filteredItems({ source: active.source, query: active.query, left: 0, top: 0, activeIndex: 0 }).length - 1, 0),
        ),
      }));
    };

    const selectMenuItem = (item: ComposerContextItem): void => {
      const field = fieldRef.current;
      if (!field || !menu) {
        return;
      }
      // 选中时重新检测（期间 query 可能继续输入，偏移以当下为准）；
      // DSL 场景每次渲染产出新 props 对象，source 按 trigger 比较而非引用
      const active = detectActiveMention(field, sources);
      insertChipElement(
        { ...item, trigger: item.trigger ?? menu.source.trigger },
        menu.source,
        active && active.source.trigger === menu.source.trigger
          ? { node: active.node, start: active.triggerStart, end: active.caretOffset }
          : undefined,
      );
      setMenu(null);
    };

    const handleInput = (): void => {
      const field = fieldRef.current;
      if (!field) {
        return;
      }
      // 清空残留 <br>，保证 placeholder 与空态判定稳定
      if ((field.textContent ?? '') === '' && field.querySelector(`[${CHIP_ATTR}]`) === null) {
        field.innerHTML = '';
      }
      setEmpty(serializeNode(field).trim() === '');
      onChange?.(serialize());
      refreshMenu();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
      if (menu) {
        const items = filteredItems(menu);
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          if (items.length > 0) {
            const delta = event.key === 'ArrowDown' ? 1 : -1;
            setMenu({
              ...menu,
              activeIndex: (menu.activeIndex + delta + items.length) % items.length,
            });
          }
          return;
        }
        if (event.key === 'Enter' && !composingRef.current && !event.nativeEvent.isComposing) {
          event.preventDefault();
          const item = items[Math.min(menu.activeIndex, items.length - 1)];
          if (item) {
            selectMenuItem(item);
          } else {
            closeMenu();
          }
          return;
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          closeMenu();
          return;
        }
      }
      if (
        event.key === 'Enter' &&
        !event.shiftKey &&
        !composingRef.current &&
        !event.nativeEvent.isComposing
      ) {
        event.preventDefault();
        const text = serialize();
        if (text.trim() !== '' && !disabled) {
          onSubmit?.(text);
        }
        return;
      }
      // 退格删除行内块：光标紧贴块后时整体删除（跨浏览器兜底，
      // Chrome 对 contenteditable=false 原子块原生支持整体删除）
      if (event.key === 'Backspace') {
        const selection = window.getSelection();
        const field = fieldRef.current;
        if (!selection || !selection.isCollapsed || !field) {
          return;
        }
        let chip: HTMLElement | null = null;
        const anchor = selection.anchorNode;
        if (anchor === field && selection.anchorOffset > 0) {
          const before = field.childNodes[selection.anchorOffset - 1];
          if (isChipElement(before)) {
            chip = before;
          }
        } else if (anchor?.nodeType === Node.TEXT_NODE && selection.anchorOffset === 0) {
          if (isChipElement(anchor.previousSibling)) {
            chip = anchor.previousSibling;
          }
        }
        if (chip) {
          event.preventDefault();
          chip.remove();
          onChange?.(serialize());
          emitChips();
          setEmpty(serializeNode(field).trim() === '');
        }
      }
    };

    const menuItems = menu ? filteredItems(menu) : [];
    const activeIndex = Math.min(menu?.activeIndex ?? 0, Math.max(menuItems.length - 1, 0));

    return (
      <div className="relative">
        <div
          ref={fieldRef}
          data-slot="mention-input"
          role="textbox"
          aria-multiline="true"
          aria-placeholder={placeholder}
          contentEditable={!disabled}
          suppressContentEditableWarning
          className={cn(
            'min-h-[60px] w-full px-4 pt-3 pb-1 text-sm whitespace-pre-wrap break-words outline-none',
            className,
          )}
          style={style}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => {
            composingRef.current = true;
          }}
          onCompositionEnd={() => {
            composingRef.current = false;
          }}
          onPaste={(event) => {
            // 仅接受纯文本，避免富文本污染行内结构
            event.preventDefault();
            const text = event.clipboardData?.getData('text/plain') ?? '';
            if (text) {
              document.execCommand('insertText', false, text);
            }
          }}
        />
        {empty && placeholder !== undefined ? (
          <span className="pointer-events-none absolute top-3 left-4 text-sm text-muted-foreground">
            {placeholder}
          </span>
        ) : null}
        {menu ? (
          <>
            {/* 点击菜单外关闭（mousedown 抢先于输入区 blur） */}
            <div
              className="fixed inset-0 z-40"
              onMouseDown={(event) => {
                event.preventDefault();
                closeMenu();
              }}
            />
            <div
              data-slot="mention-menu"
              role="listbox"
              className="scrollbar-subtle fixed z-50 max-h-72 w-64 overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
              style={{
                left: menu.left,
                bottom:
                  typeof window === 'undefined'
                    ? undefined
                    : window.innerHeight - menu.top + 6,
              }}
            >
              <div className="px-2 py-1 text-xs text-muted-foreground">{menu.source.label}</div>
              {menuItems.length === 0 ? (
                <div className="px-2 py-2 text-xs text-muted-foreground">无匹配项</div>
              ) : (
                menuItems.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={index === activeIndex}
                    className={cn(
                      'flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm',
                      index === activeIndex ? 'bg-accent' : 'hover:bg-accent',
                    )}
                    onMouseDown={(event) => {
                      // 抢先于输入区 blur，选中不丢失光标上下文
                      event.preventDefault();
                      selectMenuItem(item);
                    }}
                  >
                    <Icon name={chipIcon(item, menu.source)} size="sm" />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  </button>
                ))
              )}
            </div>
          </>
        ) : null}
      </div>
    );
  },
);
