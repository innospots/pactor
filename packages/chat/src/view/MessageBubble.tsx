import { useRef, useState } from 'react';

import type { ChatArtifact } from '../artifact.js';
import type { ChatMessage } from '../model.js';
import type { ChatRuntime, ChatScope } from '../scope.js';
import { ActivityTrace } from './ActivityTrace.js';
import { collectMessageText, MessageActions } from './MessageActions.js';
import { PartRenderer } from './PartRenderer.js';

/**
 * MessageBubble：按 role 区分呈现（参考 DeepTutor web 消息区设计）——
 * user 右侧圆角气泡；assistant 左侧通栏排版：顶部活动轨迹区
 * （ActivityTrace：状态头 + thinking + 配对工具轨迹），正文 parts 按序
 * 渲染；hover 操作条（MessageActions：复制 / 重新生成 / 编辑 / 重试）；
 * system 居中弱提示。
 * 颜色经 `--pactor-chat-*` 变量表达。
 */
export interface MessageBubbleProps {
  message: ChatMessage;
  /** 透传给 dsl part 的渲染运行时与作用域 */
  runtime?: ChatRuntime;
  scope?: Omit<ChatScope, 'message'>;
  params?: Record<string, unknown>;
  /** 末条已完成 assistant 消息：提供 onRegenerate 时出示重新生成入口 */
  showRegenerate?: boolean;
  /** 重新生成回调（spec: chat-message-actions / 重新生成） */
  onRegenerate?: () => void;
  /** error 消息重试回调（spec: chat-message-actions / 错误重试） */
  onRetry?: () => void;
  /**
   * user 消息编辑重发回调（spec: chat-message-actions / 用户消息编辑重发）：
   * 提供时出示编辑入口；确认后以新文本回调（调用方负责截断 store 并重跑
   * turn）；取消编辑不触任何回调。
   */
  onEditResend?: (text: string) => void;
  /** artifact 卡片"在面板中打开"回调（透传 PartRenderer） */
  onOpenArtifact?: (artifact: ChatArtifact) => void;
}

/** user 消息的内联编辑框：预填原文本，确认回调新文本，取消静默关闭 */
function MessageEditForm({
  initialText,
  onConfirm,
  onCancel,
}: {
  initialText: string;
  onConfirm: (text: string) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState(initialText);

  const confirm = (): void => {
    const value = text.trim();
    if (!value) {
      return;
    }
    onConfirm(value);
  };

  return (
    <div className="pactor-chat-message__edit">
      <textarea
        className="pactor-chat-message__edit-input"
        aria-label="编辑消息"
        rows={3}
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            confirm();
          } else if (event.key === 'Escape') {
            onCancel();
          }
        }}
      />
      <div className="pactor-chat-message__edit-actions">
        <button
          type="button"
          className="pactor-chat-message__edit-button pactor-chat-message__edit-button--confirm"
          aria-label="确认发送"
          onClick={confirm}
        >
          发送
        </button>
        <button
          type="button"
          className="pactor-chat-message__edit-button"
          aria-label="取消"
          onClick={onCancel}
        >
          取消
        </button>
      </div>
    </div>
  );
}

export function MessageBubble({
  message,
  runtime,
  scope,
  showRegenerate = false,
  onRegenerate,
  onRetry,
  onEditResend,
  onOpenArtifact,
}: MessageBubbleProps) {
  const [editing, setEditing] = useState(false);
  const bubbleScope: ChatScope = {
    conversation: scope?.conversation ?? {},
    message: { id: message.id },
    params: scope?.params,
  };
  const streaming = message.status === 'streaming';
  // assistant 消息顶部渲染活动轨迹：流式 / 待响应期间的状态头
  // （结束后定格保留，wasLive 记忆），或含 thinking / tool part 时的
  // 配对轨迹与思考卡
  const live =
    message.status === 'pending' || message.status === 'streaming';
  const wasLiveRef = useRef(live);
  if (live) {
    wasLiveRef.current = true;
  }
  const showTrace =
    message.role === 'assistant' &&
    (wasLiveRef.current ||
      message.parts.some(
        (part) =>
          part.type === 'thinking' ||
          part.type === 'tool-call' ||
          part.type === 'tool-result',
      ));
  return (
    <div
      className={`pactor-chat-message pactor-chat-message--${message.role}`}
      data-message-id={message.id}
      data-message-status={message.status}
    >
      {editing ? (
        <MessageEditForm
          initialText={collectMessageText(message)}
          onConfirm={(text) => {
            setEditing(false);
            onEditResend?.(text);
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <div className="pactor-chat-message__body">
          {showTrace && <ActivityTrace message={message} />}
          {message.parts.length === 0 &&
          message.status === 'pending' &&
          message.role !== 'assistant' ? (
            <span className="pactor-chat-message__pending">…</span>
          ) : (
            message.parts.map((part, index) => (
              <PartRenderer
                key={part.id ?? index}
                part={part}
                runtime={runtime}
                scope={bubbleScope}
                streaming={streaming}
                onOpenArtifact={onOpenArtifact}
              />
            ))
          )}
        </div>
      )}
      {message.role === 'assistant' && message.status === 'completed' && (
        <MessageActions
          message={message}
          showRegenerate={showRegenerate}
          onRegenerate={onRegenerate}
        />
      )}
      {message.role === 'assistant' && message.status === 'error' && (
        <MessageActions message={message} onRetry={onRetry} forceVisible />
      )}
      {message.role === 'user' && !editing && onEditResend && (
        <MessageActions message={message} onEdit={() => setEditing(true)} />
      )}
    </div>
  );
}
