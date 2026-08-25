import { FileText, Paperclip, Plus, Send, Square, X } from 'lucide-react';
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

import type { ChatAttachment } from '../model.js';

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
}: ComposerProps) {
  const [text, setText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const plusButtonRef = useRef<HTMLButtonElement>(null);
  // IME 合成状态（compositionstart/end；keydown.isComposing 兜底）
  const composingRef = useRef(false);

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
    if (onMentionTrigger) {
      const caret = event.target.selectionStart ?? value.length;
      const query = detectMention(value, caret);
      if (query !== null) {
        onMentionTrigger(query, event.target.getBoundingClientRect());
      }
    }
  };

  const showToolbar =
    toolbarStart !== undefined ||
    toolbarEnd !== undefined ||
    onPlusMenu !== undefined ||
    onAttachFiles !== undefined;

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
          {onPlusMenu && (
            <button
              ref={plusButtonRef}
              type="button"
              className="pactor-chat-icon-button"
              title="更多功能"
              aria-label="更多功能"
              onClick={() =>
                onPlusMenu(plusButtonRef.current!.getBoundingClientRect())
              }
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
    </div>
  );
}
