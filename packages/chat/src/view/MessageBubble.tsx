import type { CSSProperties } from 'react';

import type { ChatMessage } from '../model.js';
import type { ChatRuntime, ChatScope } from '../scope.js';
import { PartRenderer } from './PartRenderer.js';

/**
 * MessageBubble（设计决策 D6）：按 role 区分呈现——
 * user 靠右（深色气泡），assistant / system 靠左。
 */
export interface MessageBubbleProps {
  message: ChatMessage;
  /** 透传给 dsl part 的渲染运行时与作用域 */
  runtime?: ChatRuntime;
  scope?: Omit<ChatScope, 'message'>;
  params?: Record<string, unknown>;
}

const ROLE_STYLE: Record<ChatMessage['role'], CSSProperties> = {
  user: { alignSelf: 'flex-end', background: '#e6f4ff', color: 'inherit' },
  assistant: { alignSelf: 'flex-start', background: '#f5f5f5', color: 'inherit' },
  system: { alignSelf: 'center', background: 'transparent', color: '#8c8c8c' },
};

export function MessageBubble({ message, runtime, scope }: MessageBubbleProps) {
  const bubbleScope: ChatScope = {
    conversation: scope?.conversation ?? {},
    message: { id: message.id },
    params: scope?.params,
  };
  return (
    <div
      className={`pactor-chat-message pactor-chat-message--${message.role}`}
      data-message-id={message.id}
      data-message-status={message.status}
      style={{
        maxWidth: '80%',
        borderRadius: 8,
        padding: '8px 12px',
        ...ROLE_STYLE[message.role],
      }}
    >
      {message.parts.length === 0 && message.status === 'pending' ? (
        <span style={{ color: '#8c8c8c' }}>…</span>
      ) : (
        message.parts.map((part, index) => (
          <PartRenderer
            key={part.id ?? index}
            part={part}
            runtime={runtime}
            scope={bubbleScope}
          />
        ))
      )}
    </div>
  );
}
