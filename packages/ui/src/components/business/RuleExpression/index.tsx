import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';

import { cn } from '../../../lib/utils.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RuleExpressionOption {
  label: string;
  value: string;
}

/** 组件值：expression 为表达式串（其中字段使用选项的 value），expressionLabel 为 label 组成的串，sourceField 为所有选中特征字段的 value 数组 */
export interface RuleExpressionValue {
  expression: string;
  expressionLabel: string;
  sourceField: string[];
}

type TextToken = { type: 'text'; text: string };
type FieldToken = { type: 'field'; label: string; value: string };
type Token = FieldToken | TextToken;

export interface RuleExpressionProps {
  /** 特征字段候选（label 用于匹配与展示，value 写入 sourceField） */
  options?: RuleExpressionOption[];
  value?: RuleExpressionValue | string | null;
  onChange?: (value: RuleExpressionValue) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** 输入串末尾的“词”（中文/字母/数字/下划线），用于候选匹配 */
function trailingWord(text: string): string {
  const m = text.match(/[\w一-龥]+$/u);
  return m ? m[0] : '';
}

/** input 末尾属于 label 的最长后缀长度（选中时整段替换，支持 label 含分隔符） */
function labelSuffixLength(input: string, label: string): number {
  for (let len = Math.min(input.length, label.length); len > 0; len--) {
    const suffix = input.slice(input.length - len);
    if (label.includes(suffix)) return len;
  }
  return 0;
}

/**
 * 序列化为表达式串：字段与文本（操作符）之间用空格分隔。
 * 中间的文本 token 去除首尾空白、两侧各补一个空格；
 * 末尾的文本 token（正在输入的片段）原样拼接，保留用户输入的空格。
 * @param fieldKey 字段 token 取 value（接口用）还是 label（展示用）
 */
function serialize(tokens: Token[], fieldKey: 'value' | 'label' = 'value'): string {
  let out = '';
  tokens.forEach((t, i) => {
    if (t.type === 'field') {
      if (out && !out.endsWith(' ')) out += ' ';
      out += t[fieldKey];
    } else {
      if (i === tokens.length - 1) {
        out += t.text;
        return;
      }
      const text = t.text.trim();
      if (!text) return;
      if (out && !out.endsWith(' ')) out += ' ';
      out += `${text} `;
    }
  });
  return out;
}

// ─── 由外部 value 重建内部状态的种子 ──────────────────────────────────────────

function seedTokens(
  value: RuleExpressionValue | string | null | undefined,
  options: RuleExpressionOption[],
): Token[] {
  if (!value) return [];
  if (typeof value === 'string') {
    return value ? [{ type: 'text', text: value }] : [];
  }
  const fields = (value.sourceField || []).map((v) => ({
    type: 'field' as const,
    value: String(v),
    label: options.find((o) => o.value === String(v))?.label ?? String(v),
  }));
  // 按 sourceField 顺序在 expression 中定位各字段 value（expression 中存的是 value），
  // value 之间的部分（操作符等）保留为文本 token，保证编辑时完整还原
  const tokens: Token[] = [];
  let rest = value.expression ?? '';
  for (const field of fields) {
    const idx = rest.indexOf(field.value);
    if (idx === -1) {
      // value 未出现在 expression 中（候选变更等），直接追加 chip
      tokens.push(field);
      continue;
    }
    const before = rest.slice(0, idx);
    if (before) tokens.push({ type: 'text', text: before });
    tokens.push(field);
    rest = rest.slice(idx + field.value.length);
  }
  if (rest) tokens.push({ type: 'text', text: rest });
  return tokens;
}

// ─── DOM 操作 ─────────────────────────────────────────────────────────────────

const X_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

function buildChip(field: FieldToken, disabled?: boolean): HTMLSpanElement {
  const chip = document.createElement('span');
  chip.contentEditable = 'false';
  chip.dataset.value = field.value;
  chip.dataset.label = field.label;
  chip.className =
    'mx-0.5 inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 align-middle text-xs font-medium';
  const label = document.createElement('span');
  label.textContent = field.label;
  chip.appendChild(label);
  if (!disabled) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.remove = 'true';
    btn.setAttribute('aria-label', `remove-${field.value}`);
    btn.className = 'cursor-pointer opacity-60 hover:opacity-100';
    btn.innerHTML = X_SVG;
    chip.appendChild(btn);
  }
  return chip;
}

/** 把编辑器 DOM 解析回 token 序列（相邻文本合并；回车产生的 div/br 还原为换行） */
function parseEditor(root: HTMLElement): Token[] {
  const tokens: Token[] = [];
  const pushText = (text: string) => {
    if (!text) return;
    const last = tokens[tokens.length - 1];
    if (last?.type === 'text') last.text += text;
    else tokens.push({ type: 'text', text });
  };
  const walk = (node: ChildNode) => {
    if (node.nodeType === Node.TEXT_NODE) {
      pushText(node.textContent ?? '');
      return;
    }
    if (!(node instanceof HTMLElement)) return;
    if (node.dataset.value != null) {
      tokens.push({
        type: 'field',
        value: node.dataset.value,
        label: node.dataset.label ?? node.dataset.value,
      });
      return;
    }
    if (node.tagName === 'BR') {
      pushText('\n');
      return;
    }
    node.childNodes.forEach(walk);
    if (node.tagName === 'DIV' || node.tagName === 'P') pushText('\n');
  };
  root.childNodes.forEach(walk);
  return tokens;
}

function setCaret(node: Node, offset: number) {
  const sel = window.getSelection();
  if (!sel) return;
  const range = document.createRange();
  range.setStart(node, offset);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

function setCaretToEnd(el: HTMLElement) {
  const sel = window.getSelection();
  if (!sel) return;
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * 规则表达式编辑器：contentEditable 富文本输入框，高度随内容增长。
 * 选中的字段渲染为 contentEditable=false 的整体 chip，
 * 光标可用鼠标点击或 ←/→ 在任意位置自由定位（chip 作为原子单位越过）；
 * 输入时按光标前的尾部词匹配特征字段 label 候选，↑/↓ 选择、回车选中；
 * chip 旁的退格/Delete 整体删除 chip；未匹配的输入保留为字符串。
 */
export function RuleExpression({
  options = [],
  value,
  onChange,
  placeholder,
  disabled,
  id,
  className,
}: RuleExpressionProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  /** 光标前的尾部词（驱动候选列表） */
  const [matchText, setMatchText] = useState('');
  // 记录最近一次向外部发出的值，用于区分外部 setValue/reset 与自己的输入
  const lastEmittedRef = useRef<string | null>(null);

  const matched = matchText
    ? options.filter((o) => o.label.toLowerCase().includes(matchText.toLowerCase()))
    : [];
  const showSuggestions = focused && !disabled && matched.length > 0;

  const emitTokens = (tokens: Token[]) => {
    const out: RuleExpressionValue = {
      expression: serialize(tokens),
      expressionLabel: serialize(tokens, 'label'),
      sourceField: tokens
        .filter((t): t is FieldToken => t.type === 'field')
        .map((t) => t.value),
    };
    lastEmittedRef.current = JSON.stringify(out);
    onChange?.(out);
  };

  /** 光标前的文本（用于候选匹配） */
  const caretBeforeText = (): string => {
    const ed = editorRef.current;
    const sel = window.getSelection();
    if (!ed || !sel || !sel.rangeCount) return '';
    const node = sel.anchorNode;
    if (!node || !ed.contains(node)) return '';
    if (node === ed) {
      const prev = ed.childNodes[sel.anchorOffset - 1];
      return prev?.nodeType === Node.TEXT_NODE ? (prev.textContent ?? '') : '';
    }
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent ?? '').slice(0, sel.anchorOffset);
    }
    return '';
  };

  const refreshSuggest = () => {
    setMatchText(trailingWord(caretBeforeText()));
  };

  /** DOM → tokens → 对外 emit + 刷新候选 */
  const syncFromDOM = () => {
    const ed = editorRef.current;
    if (!ed) return;
    emitTokens(parseEditor(ed));
    refreshSuggest();
  };

  /** 用 token 序列重建编辑器内容（仅在外部值变化时调用，打字期间 DOM 即真相） */
  const rebuild = (tokens: Token[]) => {
    const ed = editorRef.current;
    if (!ed) return;
    ed.textContent = '';
    for (const t of tokens) {
      if (t.type === 'field') ed.appendChild(buildChip(t, disabled));
      else ed.appendChild(document.createTextNode(t.text));
    }
  };

  // 外部值变化（AI 填充 / 表单重置）时重建内容；自己发出的值不回灌
  useLayoutEffect(() => {
    const sig = JSON.stringify(value ?? null);
    if (sig !== lastEmittedRef.current) {
      rebuild(seedTokens(value, options));
      lastEmittedRef.current = sig;
      setMatchText('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, options, disabled]);

  const selectOption = (opt: RuleExpressionOption) => {
    const ed = editorRef.current;
    const sel = window.getSelection();
    if (!ed || !sel || !sel.rangeCount) return;
    let node: Node | null = sel.anchorNode;
    let offset = sel.anchorOffset;
    if (!node || !ed.contains(node)) return;
    if (node === ed) {
      // 光标直接在编辑器上（子节点之间）：先造一个文本节点落位
      const tn = document.createTextNode('');
      ed.insertBefore(tn, ed.childNodes[offset] ?? null);
      node = tn;
      offset = 0;
    }
    if (node.nodeType !== Node.TEXT_NODE) return;
    // 注意：统一用 insertBefore/removeChild 经典 DOM API，
    // 不依赖 Element.after/before/remove（避免类型遮蔽与兼容问题）
    const textNode = node;
    // 光标处拆开：属于该 label 的尾部整段被 chip 替换，
    // 前面的文本留在原节点，光标后的文本移到 chip 之后
    const text = textNode.textContent ?? '';
    const before = text.slice(0, offset);
    const after = text.slice(offset);
    const replaceLen = Math.max(
      labelSuffixLength(before, opt.label),
      trailingWord(before).length,
    );
    textNode.textContent = before.slice(0, before.length - replaceLen);
    const afterNode = document.createTextNode(after);
    const chip = buildChip({ type: 'field', label: opt.label, value: opt.value }, disabled);
    ed.insertBefore(chip, textNode.nextSibling);
    ed.insertBefore(afterNode, chip.nextSibling);
    if (!textNode.textContent) ed.removeChild(textNode);
    // 不做 normalize()：它会移除空文本节点，毁掉光标落点；
    // 此处 chip 两侧本就是文本节点，无需合并（解析时相邻文本会合并）
    ed.focus();
    setCaret(afterNode, 0);
    setActiveIndex(0);
    syncFromDOM();
  };

  /** 删除一个 chip，光标落在其原位（前后文本合并处） */
  const removeChip = (chip: HTMLElement) => {
    const ed = editorRef.current;
    if (!ed) return;
    const prev = chip.previousSibling;
    const caretNode: Node =
      prev && prev.nodeType === Node.TEXT_NODE ? prev : document.createTextNode('');
    if (!caretNode.isConnected) ed.insertBefore(caretNode, chip);
    const caretPos = caretNode.textContent?.length ?? 0;
    ed.removeChild(chip);
    ed.normalize();
    ed.focus();
    if (caretNode.isConnected) setCaret(caretNode, caretPos);
    else setCaretToEnd(ed);
    syncFromDOM();
  };

  /** 退格/Delete 时若紧贴 chip，则整体删除（返回 true 表示已处理） */
  const tryRemoveAdjacentChip = (dir: 'before' | 'after'): boolean => {
    const ed = editorRef.current;
    const sel = window.getSelection();
    if (!ed || !sel || !sel.rangeCount || !sel.isCollapsed) return false;
    const node = sel.anchorNode;
    if (!node || !ed.contains(node)) return false;
    let target: ChildNode | null = null;
    if (node === ed) {
      target =
        dir === 'before'
          ? ed.childNodes[sel.anchorOffset - 1]
          : ed.childNodes[sel.anchorOffset];
    } else if (node.nodeType === Node.TEXT_NODE) {
      const len = node.textContent?.length ?? 0;
      const atEdge = dir === 'before' ? sel.anchorOffset === 0 : sel.anchorOffset === len;
      if (atEdge) {
        target = dir === 'before' ? node.previousSibling : node.nextSibling;
      }
    }
    if (target instanceof HTMLElement && target.dataset.value != null) {
      removeChip(target);
      return true;
    }
    return false;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown' && showSuggestions) {
      e.preventDefault();
      setActiveIndex((x) => (x + 1) % matched.length);
      return;
    }
    if (e.key === 'ArrowUp' && showSuggestions) {
      e.preventDefault();
      setActiveIndex((x) => (x - 1 + matched.length) % matched.length);
      return;
    }
    if (e.key === 'Enter') {
      if (showSuggestions) {
        // 有候选时回车选中；无候选时回车换行（高度随内容增长）
        e.preventDefault();
        selectOption(matched[Math.min(activeIndex, matched.length - 1)]);
      }
      return;
    }
    if (e.key === 'Backspace' && tryRemoveAdjacentChip('before')) {
      e.preventDefault();
      return;
    }
    if (e.key === 'Delete' && tryRemoveAdjacentChip('after')) {
      e.preventDefault();
    }
  };

  return (
    <div
      className={cn('relative', className)}
      onBlur={(e) => {
        // 焦点移出整个组件（含候选列表）时才关闭候选
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setFocused(false);
        }
      }}
    >
      <div
        ref={editorRef}
        id={id}
        contentEditable={!disabled}
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        className={cn(
          'min-h-9 w-full whitespace-pre-wrap break-words rounded-md border border-input bg-background px-3 py-2 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'empty:before:pointer-events-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]',
          disabled && 'cursor-not-allowed opacity-50',
        )}
        onFocus={() => {
          setFocused(true);
          refreshSuggest();
        }}
        onInput={syncFromDOM}
        onKeyDown={handleKeyDown}
        onKeyUp={refreshSuggest}
        onClick={(e) => {
          const btn = (e.target as HTMLElement).closest?.('[data-remove]');
          if (btn) {
            e.preventDefault();
            const chip = btn.closest('[data-value]');
            if (chip instanceof HTMLElement) removeChip(chip);
            return;
          }
          refreshSuggest();
        }}
      />

      {showSuggestions && (
        <ul
          role="list"
          className="absolute left-0 top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md"
          // 阻止 mousedown 默认行为：否则编辑器失焦、选区坍缩到点击处，
          // selectOption 因光标不在编辑器内而无法选中（表现为点击候选无反应）
          onMouseDown={(e) => e.preventDefault()}
        >
          {matched.map((opt, index) => (
            <li key={opt.value}>
              <button
                type="button"
                className={cn(
                  'w-full cursor-pointer rounded-sm px-2 py-1.5 text-left text-sm',
                  index === activeIndex && 'bg-accent',
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectOption(opt)}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
