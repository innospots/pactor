import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

import type { ChatMessage } from '../model.js';
import type { ChatRuntime, ChatScope } from '../scope.js';
import { PartRenderer } from './PartRenderer.js';

/**
 * MessageBubble：按 role 区分呈现（参考 DeepTutor web 消息区设计）——
 * user 右侧圆角气泡；assistant 左侧通栏排版 + hover 操作条（复制）；
 * system 居中弱提示。颜色经 `--pactor-chat-*` 变量表达。
 */
export interface MessageBubbleProps {
  message: ChatMessage;
  /** 透传给 dsl part 的渲染运行时与作用域 */
  runtime?: ChatRuntime;
  scope?: Omit<ChatScope, 'message'>;
  params?: Record<string, unknown>;
}

/** 收集消息的可复制文本（text / markdown part 按序拼接） */
function collectText(message: ChatMessage): string {
  return message.parts
    .filter(
      (part): part is Extract<ChatMessage['parts'][number], { content: string }> =>
        part.type === 'text' || part.type === 'markdown',
    )
    .map((part) => part.content)
    .join('\n');
}

/** assistant 消息的 hover 操作条 */
function MessageActions({ message }: { message: ChatMessage }) {
  const [copied, setCopied] = useState(false);

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(collectText(message));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 剪贴板不可用（非安全上下文等）：静默忽略
    }
  };

  return (
    <div className="pactor-chat-message__actions">
      <button
        type="button"
        className="pactor-chat-icon-button"
        title={copied ? '已复制' : '复制'}
        aria-label={copied ? '已复制' : '复制'}
        onClick={() => void copy()}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}

export function MessageBubble({ message, runtime, scope }: MessageBubbleProps) {
  const bubbleScope: ChatScope = {
    conversation: scope?.conversation ?? {},
    message: { id: message.id },
    params: scope?.params,
  };
  const streaming = message.status === 'streaming';
  return (
    <div
      className={`pactor-chat-message pactor-chat-message--${message.role}`}
      data-message-id={message.id}
      data-message-status={message.status}
    >
      <div className="pactor-chat-message__body">
        {message.parts.length === 0 && message.status === 'pending' ? (
          <span className="pactor-chat-message__pending">…</span>
        ) : (
          message.parts.map((part, index) => (
            <PartRenderer
              key={part.id ?? index}
              part={part}
              runtime={runtime}
              scope={bubbleScope}
              streaming={streaming}
            />
          ))
        )}
      </div>
      {message.role === 'assistant' && message.status === 'completed' && (
        <MessageActions message={message} />
      )}
    </div>
  );
}
