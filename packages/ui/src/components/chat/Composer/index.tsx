import type { DslNode } from '@pactor-app/core';
import {
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
  type ReactNode,
} from 'react';

import { cn } from '../../../lib/utils.js';
import { ChatInput } from '../../components/ChatInput/index.js';
import { Icon } from '../../components/Icon/index.js';
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
  /** 最小行数，缺省 3 */
  rows?: number;
  /** 附件列表（展示在输入区上方） */
  attachments?: AttachmentItemData[];
  /** 附件移除事件，传出 id / 下标 */
  onRemoveAttachment?: (id: string | number) => void;
  /** 附件重试事件，传出 id / 下标 */
  onRetryAttachment?: (id: string | number) => void;
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
 *   插入行内块）；块列表受控（contextItems + onContextItemsChange）
 * - footer 槽渲染在输入框内工具栏下方（分隔线相隔）
 *
 * 上传 / transport 由调用方负责，本组件只做呈现与事件上报。
 */
export function Composer({
  value,
  placeholder,
  disabled,
  loading,
  rows,
  attachments = [],
  onRemoveAttachment,
  onRetryAttachment,
  onAttachFiles,
  onChange,
  onSubmit,
  models,
  model,
  onModelChange,
  contexts,
  contextItems,
  onContextItemsChange,
  footer,
  className,
  style,
}: ComposerProps) {
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

  const sources = contexts ?? [];
  // contexts 非空即行内提及模式（contenteditable 输入区）
  const rich = sources.length > 0;
  const plusSources = sources.filter((s) => s.trigger === '+');
  const plusEnabled = plusSources.length > 0;
  const modelEnabled = models !== undefined && models.length > 0;
  const currentModel = models?.find((m) => m.value === model) ?? models?.[0];

  const chips = contextItems ?? [];

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
        onContextItemsChange?.([...chips, chip]);
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

  const toolbarStart =
    plusEnabled || onAttachFiles ? (
      <>
        {plusEnabled ? (
          <button
            type="button"
            aria-label="添加上下文"
            title="添加上下文"
            className={toolButtonClass}
            onClick={() => {
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

  const toolbarEnd = modelEnabled ? (
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
    >
      {attachments.length > 0 ? (
        <Attachment items={attachments} onRemove={onRemoveAttachment} onRetry={onRetryAttachment} />
      ) : null}
      <div className={cn(dragOver && 'rounded-xl ring-2 ring-ring/50')}>
        <ChatInput
          value={text}
          placeholder={placeholder}
          disabled={disabled || loading}
          rows={rows}
          toolbarStart={toolbarStart}
          toolbarEnd={toolbarEnd}
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
                onChipsChange={onContextItemsChange}
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
