import type { DslNode } from '@pactor-app/core';
import {
  isValidElement,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type DragEvent,
  type ReactNode,
} from 'react';

import { cn } from '../../lib/utils.js';
import { ChatInput, useOptionalRenderer } from '@pactor-app/ui/components';
import { Icon } from '@pactor-app/ui/components';
import { Attachment, type AttachmentItemData } from '../Attachment/index.js';
import { MentionInput, type MentionInputHandle } from './mention-input.js';

/** 模型选项（模型选择 chip 的候选） */
export interface ComposerModelOption {
  value: string;
  label: string;
}

/** 上下文条目（提及候选与行内提及块共用） */
export interface ComposerContextItem {
  id: string;
  label: string;
  /** 来源触发符，缺省继承 source */
  trigger?: string;
  /** 图标名（Icon 白名单；缺省按 source.icon 或触发符兜底） */
  icon?: string;
  /** 原始数据（随选中结果透传给调用方） */
  data?: unknown;
}

/**
 * 上下文数据源：trigger 为声明的触发字符（如 '@' / '+'）——
 * 输入该字符（词边界）时在光标位置弹出候选菜单（行内提及）；
 * trigger 为 '+' 时工具栏左端同时渲染 + 按钮弹层（选中在光标处插入行内块）
 */
export interface ComposerContextSource {
  trigger: string;
  label: string;
  items: ComposerContextItem[];
  /** 菜单项与提及块的缺省图标（Icon 白名单） */
  icon?: string;
}

export interface ComposerProps {
  /** 受控值（提供即受控） */
  value?: string;
  /** 占位提示 */
  placeholder?: string;
  /** 禁用输入与发送 */
  disabled?: boolean;
  /** 发送中（禁用发送钮，由调用方在完成后复位） */
  loading?: boolean;
  /** 流式生成中：发送钮切换为停止钮（不禁用、不阻断输入），点击经 onStop 传出 */
  streaming?: boolean;
  /** 停止当前生成（streaming 时点击停止钮） */
  onStop?: () => void;
  /** 最小行数，缺省 3 */
  rows?: number;
  /** 附件列表（展示在输入区上方） */
  attachments?: AttachmentItemData[];
  /** 附件移除事件，传出 id / 下标 */
  onRemoveAttachment?: (id: string | number) => void;
  /** 附件重试事件，传出 id / 下标 */
  onRetryAttachment?: (id: string | number) => void;
  /** 附件卡片点击事件（预览等由调用方实现），传出该附件项 */
  onAttachmentClick?: (attachment: AttachmentItemData) => void;
  /**
   * 附件选择入口（提供时工具栏左端渲染附件钮，并启用粘贴 / 拖拽文件）；
   * 上传与存储由调用方负责
   */
  onAttachFiles?: (files: File[]) => void;
  /** 输入事件，传出 string 值（行内提及块序列化为 trigger+label） */
  onChange?: (value: string) => void;
  /** 发送事件（点击发送钮或 Enter），传出当前文本 */
  onSubmit?: (value: string) => void;
  /** 模型选项（非空时工具栏右端渲染模型选择 chip，位于发送钮之前） */
  models?: ComposerModelOption[];
  /** 当前选中模型 value（未命中时展示 models[0]） */
  model?: string;
  /** 弹层中选中模型时触发，传出 value */
  onModelChange?: (value: string) => void;
  /**
   * 上下文数据源（行内提及）：配置后输入区切换为 contenteditable——
   * 输入触发符在光标位置弹出候选菜单（输入过滤 / ↑↓ 选择 / 回车选中），
   * 选中把触发符与已输入文字替换为行内提及块（图标 + 文字、浅色背景、
   * 圆角，退格整体删除）
   */
  contexts?: ComposerContextSource[];
  /** 行内提及块列表（受控，与输入区保持同步） */
  contextItems?: ComposerContextItem[];
  /** 提及块变更事件（插入 / 退格删除），传出输入区当前块列表；发送后的清空由调用方在 onSubmit 闭环里处理 */
  onContextItemsChange?: (items: ComposerContextItem[]) => void;
  /**
   * 调用方接管 '@' 提及触发（优先于内建行内提及）：提供时 contexts 中
   * trigger 为 '@' 的源不再启用内建菜单；输入区回退纯 textarea（无其他
   * 源时），词边界 '@' 输入经本回调传出 query（'@' 后文本）与锚点 rect
   */
  onMentionTrigger?: (query: string, anchorRect: DOMRect) => void;
  /**
   * 调用方接管 '+' 按钮弹层（优先于内建弹层）：提供时工具栏左端始终
   * 渲染 '+' 钮，点击经本回调传出锚点 rect，不再打开内建候选弹层
   */
  onPlusMenu?: (anchorRect: DOMRect) => void;
  /** 工具栏左端槽（渲染在内建 '+' / 附件钮之前；DslNode 或 React 元素） */
  toolbarStart?: DslNode | ReactNode;
  /** 工具栏右端槽（渲染在模型选择 chip 之后、发送钮之前；DslNode 或 React 元素） */
  toolbarEnd?: DslNode | ReactNode;
  /**
   * 隐藏工具栏行（缺省 false）：true 时工具栏行整体不渲染——内建
   * '+' / 附件钮、模型 chip、发送 / 停止钮与 toolbarStart / toolbarEnd
   * 槽一并抑制（footer 槽不受影响）；Enter 发送保留
   */
  hideToolbar?: boolean;
  /** footer 槽（渲染在输入框内工具栏下方，以分隔线相隔；DslNode 或 React 元素） */
  footer?: DslNode | ReactNode;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

const toolButtonClass =
  'flex cursor-pointer items-center rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground';

const popoverPanelClass =
  'absolute bottom-full left-0 z-50 mb-2 max-h-72 w-64 overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md';

const popoverItemClass =
  'flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent';

/** 词边界 '@' 提及检测：返回 '@' 后 query，未命中返回 null */
function detectMention(text: string, caret: number): string | null {
  const beforeCaret = text.slice(0, caret);
  const match = /(?:^|\s)@([^\s@]*)$/.exec(beforeCaret);
  return match ? match[1]! : null;
}

/**
 * Composer 适配器（shadcn kit）：会话输入组合件——
 * 附件区（Attachment）+ 输入区（ChatInput）。
 *
 * - 附件：受控 attachments 展示；提供 onAttachFiles 时工具栏左端渲染
 *   附件钮，并启用粘贴 / 拖拽文件入口（上传由调用方负责）
 * - 模型选择：models 非空时工具栏右端渲染模型 chip（发送钮之前），
 *   弹层选中经 onModelChange 传出
 * - 行内提及（MentionInput）：contexts 非空时输入区切换为
 *   contenteditable——输入触发符（'@' 等）在光标位置弹出候选菜单
 *   （输入过滤 / ↑↓ / 回车选中 / 点击选中），选中把触发符与已输入
 *   文字替换为行内提及块（图标 + 文字、浅色背景、圆角），退格整体
 *   删除；'+' 触发源额外在工具栏左端渲染 + 按钮弹层（选中在光标处
 *   插入行内块）；块列表受控（contextItems + onContextItemsChange）。
 *   注入 onMentionTrigger / onPlusMenu 时对应内建 '@' 提及 / '+' 弹层
 *   让位给调用方（回调优先，锚点 rect 随回调传出）
 * - 运行态：streaming 时发送钮切换为停止钮，点击经 onStop 传出
 * - 扩展槽：toolbarStart / toolbarEnd（工具栏左 / 右端，DslNode 或
 *   React 元素）；hideToolbar 时工具栏行（含发送 / 停止钮）整体不渲染，
 *   Enter 发送保留
 * - footer 槽渲染在输入框内工具栏下方（分隔线相隔）
 *
 * 上传 / transport 由调用方负责，本组件只做呈现与事件上报。
 */
export function Composer({
  value,
  placeholder,
  disabled,
  loading,
  streaming = false,
  onStop,
  rows,
  attachments = [],
  onRemoveAttachment,
  onRetryAttachment,
  onAttachmentClick,
  onAttachFiles,
  onChange,
  onSubmit,
  models,
  model,
  onModelChange,
  contexts,
  contextItems,
  onContextItemsChange,
  onMentionTrigger,
  onPlusMenu,
  toolbarStart,
  toolbarEnd,
  hideToolbar = false,
  footer,
  className,
  style,
}: ComposerProps) {
  const renderer = useOptionalRenderer();
  // 受控 / 非受控文本
  const textControlled = value !== undefined;
  const [innerText, setInnerText] = useState('');
  const text = textControlled ? value : innerText;

  const [dragOver, setDragOver] = useState(false);
  // 弹层状态：'+' 菜单 / 模型选择，同时至多一个（@ 提及菜单由 MentionInput 自持）
  const [plusOpen, setPlusOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mentionRef = useRef<MentionInputHandle>(null);

  const sources = (contexts ?? []).filter(
    // 调用方接管 '@' 提及时对应源不启用内建行内提及（回调优先）
    (source) => !(onMentionTrigger !== undefined && source.trigger === '@'),
  );
  // contexts 非空即行内提及模式（contenteditable 输入区）
  const rich = sources.length > 0;
  const plusSources = sources.filter((s) => s.trigger === '+');
  const plusEnabled = plusSources.length > 0 || onPlusMenu !== undefined;
  const modelEnabled = models !== undefined && models.length > 0;
  const currentModel = models?.find((m) => m.value === model) ?? models?.[0];

  const [innerChips, setInnerChips] = useState<ComposerContextItem[]>([]);
  // contextItems 未提供时块列表内部自持（非受控）：否则 MentionInput 的
  // 受控同步效应会以空列表把刚插入的行内块全部移除
  const chipsControlled = contextItems !== undefined;
  const chips = chipsControlled ? contextItems : innerChips;

  const handleChipsChange = (next: ComposerContextItem[]): void => {
    if (!chipsControlled) {
      setInnerChips(next);
    }
    onContextItemsChange?.(next);
  };

  const closePopovers = (): void => {
    setPlusOpen(false);
    setModelOpen(false);
  };

  const handleChange = (next: string): void => {
    if (!textControlled) {
      setInnerText(next);
    }
    onChange?.(next);
  };

  const handleSubmit = (submitted: string): void => {
    onSubmit?.(submitted);
    if (!textControlled) {
      setInnerText('');
    }
    closePopovers();
    // 提及块不在此清空：受控数据由调用方在 onSubmit 闭环里发送完成后清空
    // （此处同步清空会抢在 DSL 发送动作读取 state 之前执行）
  };

  const selectContext = (item: ComposerContextItem, source: ComposerContextSource): void => {
    if (rich) {
      // 行内提及模式：在光标处插入提及块（块列表经 onChipsChange 同步出去）
      mentionRef.current?.insertChip(item, source);
    } else {
      const chip: ComposerContextItem = { ...item, trigger: item.trigger ?? source.trigger };
      const duplicated = chips.some(
        (existing) => existing.id === chip.id && existing.trigger === chip.trigger,
      );
      if (!duplicated) {
        handleChipsChange([...chips, chip]);
      }
    }
    closePopovers();
  };

  const emitFiles = (files: File[]): void => {
    if (files.length > 0 && onAttachFiles) {
      onAttachFiles(files);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    if (!onAttachFiles) {
      return;
    }
    event.preventDefault();
    setDragOver(false);
    emitFiles(Array.from(event.dataTransfer?.files ?? []));
  };

  // 槽位渲染：React 元素直接渲染，DslNode 经 Renderer（无 Renderer 上下文不渲染）
  const renderSlot = (slot: DslNode | ReactNode): ReactNode =>
    isValidElement(slot) || typeof slot !== 'object' || slot === null
      ? slot
      : (renderer?.renderChildren([slot as DslNode]) ?? null);

  const builtinToolbarStart =
    plusEnabled || onAttachFiles ? (
      <>
        {plusEnabled ? (
          <button
            type="button"
            aria-label="添加上下文"
            title="添加上下文"
            className={toolButtonClass}
            onClick={(event) => {
              if (onPlusMenu) {
                // 调用方接管弹层（回调优先）：传出按钮锚点 rect
                onPlusMenu(event.currentTarget.getBoundingClientRect());
                return;
              }
              setPlusOpen((prev) => !prev);
              setModelOpen(false);
            }}
          >
            <Icon name="plus" size="sm" />
          </button>
        ) : null}
        {onAttachFiles ? (
          <button
            type="button"
            aria-label="添加附件"
            title="添加附件"
            className={toolButtonClass}
            onClick={() => fileInputRef.current?.click()}
          >
            <Icon name="paperclip" size="sm" />
          </button>
        ) : null}
      </>
    ) : undefined;

  const builtinToolbarEnd = modelEnabled ? (
    <button
      type="button"
      aria-label="选择模型"
      title="选择模型"
      className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
      onClick={() => {
        setModelOpen((prev) => !prev);
        setPlusOpen(false);
      }}
    >
      {currentModel?.label}
      <Icon name="chevrons-up-down" size={12} />
    </button>
  ) : undefined;

  const toolbarStartSlot =
    toolbarStart !== undefined && toolbarStart !== null ? (
      <>
        {renderSlot(toolbarStart)}
        {builtinToolbarStart}
      </>
    ) : (
      builtinToolbarStart
    );

  const toolbarEndSlot =
    toolbarEnd !== undefined && toolbarEnd !== null ? (
      <>
        {builtinToolbarEnd}
        {renderSlot(toolbarEnd)}
      </>
    ) : (
      builtinToolbarEnd
    );

  // 调用方接管 '@' 提及（纯 textarea 路径）：冒泡监听内建 textarea
  // 变更，词边界 '@' 命中即传出 query 与锚点 rect
  const handleBubbleChange = (event: ChangeEvent<HTMLDivElement>): void => {
    const target = event.target;
    if (!(target instanceof HTMLTextAreaElement)) {
      return;
    }
    const query = detectMention(
      target.value,
      target.selectionStart ?? target.value.length,
    );
    if (query !== null) {
      onMentionTrigger?.(query, target.getBoundingClientRect());
    }
  };

  const activePopover = plusOpen ? 'plus' : modelOpen ? 'model' : null;

  return (
    <div
      data-slot="composer"
      className={cn('relative flex w-full flex-col gap-2', className)}
      style={style}
      onDragOver={(event) => {
        if (onAttachFiles) {
          event.preventDefault();
          setDragOver(true);
        }
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onPaste={(event) => {
        const files = Array.from(event.clipboardData?.files ?? []);
        if (files.length > 0 && onAttachFiles) {
          event.preventDefault();
          emitFiles(files);
        }
      }}
      onChange={
        onMentionTrigger !== undefined && !rich ? handleBubbleChange : undefined
      }
    >
      {attachments.length > 0 ? (
        <Attachment
          items={attachments}
          onRemove={onRemoveAttachment}
          onRetry={onRetryAttachment}
          onClick={onAttachmentClick}
        />
      ) : null}
      <div className={cn(dragOver && 'rounded-xl ring-2 ring-ring/50')}>
        <ChatInput
          value={text}
          placeholder={placeholder}
          disabled={disabled || loading}
          streaming={streaming}
          onStop={onStop}
          rows={rows}
          hideSend={hideToolbar}
          toolbarStart={hideToolbar ? undefined : toolbarStartSlot}
          toolbarEnd={hideToolbar ? undefined : toolbarEndSlot}
          footer={footer}
          field={
            rich ? (
              <MentionInput
                ref={mentionRef}
                value={text}
                placeholder={placeholder}
                disabled={disabled || loading}
                sources={sources}
                chips={chips}
                onChipsChange={handleChipsChange}
                onChange={handleChange}
                onSubmit={handleSubmit}
              />
            ) : undefined
          }
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
      {onAttachFiles ? (
        <input
          ref={fileInputRef}
          type="file"
          multiple
          hidden
          onChange={(event) => {
            emitFiles(Array.from(event.target.files ?? []));
            // 允许重复选择同一文件
            event.target.value = '';
          }}
        />
      ) : null}
      {activePopover !== null ? (
        <>
          {/* 点击弹层外部关闭 */}
          <div className="fixed inset-0 z-40" onClick={closePopovers} />
          {activePopover === 'model' ? (
            <div data-slot="composer-model-popover" className={cn(popoverPanelClass, 'right-0 left-auto w-48')} role="listbox">
              {models!.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === currentModel?.value}
                  className={popoverItemClass}
                  onClick={() => {
                    onModelChange?.(option.value);
                    closePopovers();
                  }}
                >
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  {option.value === currentModel?.value ? <Icon name="check" size={14} /> : null}
                </button>
              ))}
            </div>
          ) : (
            <div data-slot="composer-context-popover" className={popoverPanelClass} role="listbox">
              {plusSources.map((source) =>
                source.items.length === 0 ? null : (
                  <div key={source.trigger}>
                    <div className="px-2 py-1 text-xs text-muted-foreground">{source.label}</div>
                    {source.items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={popoverItemClass}
                        onClick={() => selectContext(item, source)}
                      >
                        <Icon name={item.icon ?? source.icon ?? 'file-text'} size="sm" />
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      </button>
                    ))}
                  </div>
                ),
              )}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
