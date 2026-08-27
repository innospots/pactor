import { Check, ChevronsUpDown, FileText, Paperclip, Plus, Send, Square, X } from 'lucide-react';
import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import type {
  ChatAttachment,
  ChatContextItem,
  ChatContextSource,
  ChatModelOption,
} from '../model.js';
import { AnchoredPopover } from './AnchoredPopover.js';
import {
  ContextSourceList,
  type CallChatService,
  type ContextSourceCache,
} from './context-sources.js';

/**
 * Composer（spec: chat-view / Composer + chat-composer-extensions）：
 * 自适应高度 textarea + 状态机发送按钮（disabled / ready / streaming
 * 停止，同一按钮元素切换，streaming 态带纯 CSS 光环）。
 *
 * - IME 守卫（D6）：compositionstart/end + keydown.isComposing 兜底，
 *   合成中 Enter 不发送
 * - 附件（D3）：受控 `attachments` + `onAttachmentsChange`；拖拽悬停态、
 *   粘贴与文件选择产出 `File[]` 经 `onAttachFiles` 交给调用方（包内
 *   不上传）；卡片点击经 `onAttachmentClick` 通知
 * - 扩展槽：`toolbarStart` / `toolbarEnd` 渲染槽；词边界 `@` 触发
 *   `onMentionTrigger(query, anchorRect)`；"+" 按钮触发
 *   `onPlusMenu(anchorRect)`（无回调不渲染入口）
 * - 内建特性（chat-builtin-features）：models 非空时工具栏右端渲染
 *   模型 chip（AnchoredPopover 列表，toolbarEnd 之前）；contexts 配置
 *   且未注入调用方回调时启用内建 @ 提及 / + 菜单弹层，选中项追加为
 *   输入区上方的上下文 chips（受控：contextChips + onContextChipsChange）
 */
export interface ComposerProps {
  /** 发送回调；输入框在回调后清空 */
  onSend?: (text: string) => void;
  /** 流式中为 true：按钮变为停止，点击触发 onStop */
  streaming?: boolean;
  /** 停止当前 turn */
  onStop?: () => void;
  placeholder?: string;
  disabled?: boolean;
  /** 受控附件列表（提供即渲染附件区；上传与存储由调用方负责） */
  attachments?: ChatAttachment[];
  /** 附件列表变更（卡片移除后回调新数组） */
  onAttachmentsChange?: (attachments: ChatAttachment[]) => void;
  /** 粘贴 / 拖拽 / 文件选择产出的原始文件，交给调用方处理 */
  onAttachFiles?: (files: File[]) => void;
  /** 附件卡片点击通知（预览等由调用方实现） */
  onAttachmentClick?: (attachment: ChatAttachment) => void;
  /** 工具栏左 / 右渲染槽 */
  toolbarStart?: ReactNode;
  toolbarEnd?: ReactNode;
  /** 词边界 `@` 输入触发：query 为 `@` 后文本，anchorRect 为弹层锚点 */
  onMentionTrigger?: (query: string, anchorRect: DOMRect) => void;
  /** "+" 按钮触发弹层入口 */
  onPlusMenu?: (anchorRect: DOMRect) => void;
  /**
   * 内建模型选择（spec: chat-model-selector）：非空时工具栏右端渲染
   * 内建模型 chip（位于 toolbarEnd 槽内容之前）；缺省 / 空数组不渲染
   */
  models?: ChatModelOption[];
  /** 当前选中模型 value（由 ChatView 经受控规则 D5 解析后传入） */
  model?: string;
  /** 弹层中选中模型时触发 */
  onModelChange?: (value: string) => void;
  /**
   * 内建上下文数据源（spec: chat-context-sources）：存在 `trigger: '@'`
   * 的 source 且未注入 onMentionTrigger 时启用内建提及弹层；存在
   * `trigger: '+'` 的 source 且未注入 onPlusMenu 时渲染内建 "+" 入口
   */
  contextSources?: ChatContextSource[];
  /** 上下文 chips（受控：由 ChatView 持有，渲染在输入区上方） */
  contextChips?: ChatContextItem[];
  /** chips 变更回调（选中追加 / 单独移除） */
  onContextChipsChange?: (chips: ChatContextItem[]) => void;
  /** service 引用解析出口（ChatServices.callService 透传） */
  callService?: CallChatService;
}

/** 输入框高度上限（px），超出后内部滚动 */
const MAX_INPUT_HEIGHT = 200;

/** 附件大小的人性化展示 */
function formatSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** 词边界 `@` 提及检测：返回 `@` 后 query，未命中返回 null */
function detectMention(text: string, caret: number): string | null {
  const beforeCaret = text.slice(0, caret);
  const match = /(?:^|\s)@([^\s@]*)$/.exec(beforeCaret);
  return match ? match[1]! : null;
}

function collectDropFiles(event: { dataTransfer: DataTransfer | null }): File[] {
  return event.dataTransfer ? Array.from(event.dataTransfer.files) : [];
}

export function Composer({
  onSend,
  streaming = false,
  onStop,
  placeholder = '输入消息，Enter 发送，Shift+Enter 换行',
  disabled = false,
  attachments,
  onAttachmentsChange,
  onAttachFiles,
  onAttachmentClick,
  toolbarStart,
  toolbarEnd,
  onMentionTrigger,
  onPlusMenu,
  models,
  model,
  onModelChange,
  contextSources,
  contextChips,
  onContextChipsChange,
  callService,
}: ComposerProps) {
  const [text, setText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const plusButtonRef = useRef<HTMLButtonElement>(null);
  const modelChipRef = useRef<HTMLButtonElement>(null);
  // IME 合成状态（compositionstart/end；keydown.isComposing 兜底）
  const composingRef = useRef(false);

  // 内建模型 chip（spec: chat-model-selector）：models 非空才渲染；
  // 弹层锚点缺省 null 即关闭
  const modelChipEnabled = models !== undefined && models.length > 0;
  const [modelAnchor, setModelAnchor] = useState<DOMRect | null>(null);
  const currentModelOption = modelChipEnabled
    ? (models.find((option) => option.value === model) ?? models[0]!)
    : undefined;

  // 内建上下文（spec: chat-context-sources，决策 D5）：调用方回调优先——
  // 注入 onMentionTrigger / onPlusMenu 时对应内建入口 / 弹层完全不启用
  const mentionSources = useMemo(
    () => contextSources?.filter((source) => source.trigger === '@') ?? [],
    [contextSources],
  );
  const plusSources = useMemo(
    () => contextSources?.filter((source) => source.trigger === '+') ?? [],
    [contextSources],
  );
  const builtinMentionEnabled =
    onMentionTrigger === undefined && mentionSources.length > 0;
  const builtinPlusEnabled =
    onPlusMenu === undefined && plusSources.length > 0;
  const [mentionState, setMentionState] = useState<{
    query: string;
    anchorRect: DOMRect;
  } | null>(null);
  const [plusAnchor, setPlusAnchor] = useState<DOMRect | null>(null);
  // service 引用的会话级解析缓存（Map 存 promise）
  const sourceCacheRef = useRef<ContextSourceCache | null>(null);
  if (sourceCacheRef.current === null) {
    sourceCacheRef.current = new Map();
  }

  // 选中候选追加 chip（决策 D5：同 trigger 同 id 去重，重复选中忽略）
  const handleSelectContext = (
    item: ChatContextItem,
    source: ChatContextSource,
  ): void => {
    const chip: ChatContextItem = {
      ...item,
      trigger: item.trigger ?? source.trigger,
    };
    const chips = contextChips ?? [];
    const duplicated = chips.some(
      (existing) => existing.id === chip.id && existing.trigger === chip.trigger,
    );
    if (!duplicated) {
      onContextChipsChange?.([...chips, chip]);
    }
    setMentionState(null);
    setPlusAnchor(null);
  };

  // 自适应高度：内容变化时按 scrollHeight 增长，封顶 MAX_INPUT_HEIGHT
  useLayoutEffect(() => {
    const input = inputRef.current;
    if (input) {
      input.style.height = 'auto';
      input.style.height = `${Math.min(input.scrollHeight, MAX_INPUT_HEIGHT)}px`;
    }
  }, [text]);

  const send = (): void => {
    const value = text.trim();
    if (!value || disabled) {
      return;
    }
    onSend?.(value);
    setText('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const value = event.target.value;
    setText(value);
    if (onMentionTrigger || builtinMentionEnabled) {
      const caret = event.target.selectionStart ?? value.length;
      const query = detectMention(value, caret);
      if (onMentionTrigger) {
        // 调用方回调优先（spec: chat-composer-extensions / 提及触发）
        if (query !== null) {
          onMentionTrigger(query, event.target.getBoundingClientRect());
        }
      } else {
        // 内建提及弹层：命中即开（按 query 实时过滤），@ 语境消失即关
        setMentionState(
          query !== null
            ? { query, anchorRect: event.target.getBoundingClientRect() }
            : null,
        );
      }
    }
  };

  const showToolbar =
    toolbarStart !== undefined ||
    toolbarEnd !== undefined ||
    onPlusMenu !== undefined ||
    builtinPlusEnabled ||
    onAttachFiles !== undefined ||
    modelChipEnabled;

  return (
    <div
      className={`pactor-chat-composer${dragOver ? ' pactor-chat-composer--dragover' : ''}`}
      onDragOver={(event) => {
        event.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragOver(false);
        const files = collectDropFiles(event);
        if (files.length > 0 && onAttachFiles) {
          onAttachFiles(files);
        }
      }}
    >
      {attachments !== undefined && attachments.length > 0 && (
        <div className="pactor-chat-composer__attachments">
          {attachments.map((attachment) => {
            const isImage = attachment.mimeType.startsWith('image/');
            return (
              <div
                key={attachment.id}
                className="pactor-chat-composer__attachment"
                data-attachment-id={attachment.id}
                onClick={() => onAttachmentClick?.(attachment)}
              >
                {isImage && attachment.url ? (
                  <span className="pactor-chat-composer__attachment-thumb">
                    <img src={attachment.url} alt={attachment.name} />
                  </span>
                ) : (
                  <span className="pactor-chat-composer__attachment-info">
                    <FileText size={14} />
                    <span className="pactor-chat-composer__attachment-name">
                      {attachment.name}
                    </span>
                    {attachment.size !== undefined && (
                      <span className="pactor-chat-composer__attachment-size">
                        {formatSize(attachment.size)}
                      </span>
                    )}
                  </span>
                )}
                <button
                  type="button"
                  className="pactor-chat-icon-button pactor-chat-composer__attachment-remove"
                  title="移除附件"
                  aria-label="移除附件"
                  onClick={(event) => {
                    event.stopPropagation();
                    onAttachmentsChange?.(
                      attachments.filter((item) => item.id !== attachment.id),
                    );
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}
      {contextChips !== undefined && contextChips.length > 0 && (
        <div className="pactor-chat-composer__contexts">
          {contextChips.map((chip) => (
            <span
              key={`${chip.trigger ?? ''}:${chip.id}`}
              className="pactor-chat-context-chip"
              data-context-id={chip.id}
            >
              <span className="pactor-chat-context-chip__label">
                {chip.label}
              </span>
              <button
                type="button"
                className="pactor-chat-icon-button pactor-chat-context-chip__remove"
                title={`移除上下文 ${chip.label}`}
                aria-label={`移除上下文 ${chip.label}`}
                onClick={() =>
                  onContextChipsChange?.(
                    contextChips.filter(
                      (existing) =>
                        !(
                          existing.id === chip.id &&
                          existing.trigger === chip.trigger
                        ),
                    ),
                  )
                }
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="pactor-chat-composer__row">
        <textarea
          ref={inputRef}
          className="pactor-chat-composer__input"
          rows={1}
          value={text}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleChange}
          onCompositionStart={() => {
            composingRef.current = true;
          }}
          onCompositionEnd={() => {
            composingRef.current = false;
          }}
          onPaste={(event) => {
            const files = Array.from(event.clipboardData.files);
            if (files.length > 0 && onAttachFiles) {
              event.preventDefault();
              onAttachFiles(files);
            }
          }}
          onKeyDown={(event) => {
            // IME 合成中 Enter 仅结束合成，不发送
            if (event.nativeEvent.isComposing || composingRef.current) {
              return;
            }
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              send();
            }
          }}
        />
        {/* 发送 / 停止：同一按钮元素的状态切换 */}
        <button
          type="button"
          className={`pactor-chat-composer__button${streaming ? ' pactor-chat-composer__button--stop' : ''}`}
          title={streaming ? '停止生成' : '发送'}
          aria-label={streaming ? '停止生成' : '发送'}
          disabled={streaming ? false : disabled || !text.trim()}
          onClick={streaming ? onStop : send}
        >
          {streaming ? <Square size={14} fill="currentColor" /> : <Send size={14} />}
        </button>
      </div>
      {showToolbar && (
        <div className="pactor-chat-composer__toolbar">
          {toolbarStart}
          <span className="pactor-chat-composer__toolbar-spacer" />
          {(onPlusMenu || builtinPlusEnabled) && (
            <button
              ref={plusButtonRef}
              type="button"
              className="pactor-chat-icon-button"
              title="更多功能"
              aria-label="更多功能"
              onClick={() => {
                const rect = plusButtonRef.current!.getBoundingClientRect();
                if (onPlusMenu) {
                  // 调用方回调优先（spec: chat-context-sources / 回调优先）
                  onPlusMenu(rect);
                } else {
                  setPlusAnchor(rect);
                }
              }}
            >
              <Plus size={14} />
            </button>
          )}
          {onAttachFiles && (
            <button
              type="button"
              className="pactor-chat-icon-button"
              title="添加附件"
              aria-label="添加附件"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip size={14} />
            </button>
          )}
          {modelChipEnabled && currentModelOption && (
            <button
              ref={modelChipRef}
              type="button"
              className="pactor-chat-model-chip"
              title="选择模型"
              aria-label="选择模型"
              onClick={() =>
                setModelAnchor(
                  modelChipRef.current!.getBoundingClientRect(),
                )
              }
            >
              <span className="pactor-chat-model-chip__label">
                {currentModelOption.label}
              </span>
              <ChevronsUpDown size={12} />
            </button>
          )}
          {toolbarEnd}
        </div>
      )}
      {onAttachFiles && (
        <input
          ref={fileInputRef}
          type="file"
          multiple
          hidden
          onChange={(event) => {
            const files = event.target.files ? Array.from(event.target.files) : [];
            if (files.length > 0) {
              onAttachFiles(files);
            }
            // 允许重复选择同一文件
            event.target.value = '';
          }}
        />
      )}
      {modelChipEnabled && modelAnchor && (
        <AnchoredPopover
          anchorRect={modelAnchor}
          onClose={() => setModelAnchor(null)}
          role="listbox"
        >
          {models.map((option) => (
            <button
              key={option.value}
              type="button"
              className="pactor-chat-popover__item"
              role="option"
              aria-selected={option.value === currentModelOption?.value}
              onClick={() => {
                onModelChange?.(option.value);
                setModelAnchor(null);
              }}
            >
              <span className="pactor-chat-popover__item-label">
                {option.label}
              </span>
              {option.value === currentModelOption?.value && (
                <Check size={13} className="pactor-chat-popover__item-check" />
              )}
            </button>
          ))}
        </AnchoredPopover>
      )}
      {builtinMentionEnabled && mentionState && (
        <AnchoredPopover
          anchorRect={mentionState.anchorRect}
          onClose={() => setMentionState(null)}
          role="listbox"
        >
          <ContextSourceList
            sources={mentionSources}
            query={mentionState.query}
            callService={callService}
            cache={sourceCacheRef.current!}
            onSelect={handleSelectContext}
          />
        </AnchoredPopover>
      )}
      {builtinPlusEnabled && plusAnchor && (
        <AnchoredPopover
          anchorRect={plusAnchor}
          onClose={() => setPlusAnchor(null)}
          role="listbox"
        >
          <ContextSourceList
            sources={plusSources}
            query=""
            callService={callService}
            cache={sourceCacheRef.current!}
            onSelect={handleSelectContext}
          />
        </AnchoredPopover>
      )}
    </div>
  );
}
