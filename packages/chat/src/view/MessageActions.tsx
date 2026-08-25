import { Check, Copy, Pencil, RotateCcw } from 'lucide-react';
import { useState } from 'react';

import type { ChatMessage } from '../model.js';

/**
 * MessageActions（spec: chat-message-actions / 消息操作条）：
 * 消息 hover 显现的操作条——复制（text/markdown part 拼接写入剪贴板，
 * 已复制反馈）+ 末条 completed assistant 重新生成 + user 消息编辑 +
 * error assistant 重试。
 *
 * 接口边界（D0）：组件只做展示与回调触发，turn 驱动由调用方
 * （ChatView）注入；无回调时对应入口不渲染。
 */
export interface MessageActionsProps {
  message: ChatMessage;
  /** 末条已完成 assistant：提供 onRegenerate 时出示重新生成入口 */
  showRegenerate?: boolean;
  /** 重新生成回调（未提供时不渲染入口） */
  onRegenerate?: () => void;
  /** user 消息编辑入口回调（未提供时不渲染入口） */
  onEdit?: () => void;
  /** error 消息重试回调（未提供时不渲染入口） */
  onRetry?: () => void;
  /** error 消息：重试入口常显（不依赖 hover） */
  forceVisible?: boolean;
}

/** 收集消息的可复制文本（text / markdown part 按序拼接） */
export function collectMessageText(message: ChatMessage): string {
  return message.parts
    .filter(
      (part): part is Extract<ChatMessage['parts'][number], { content: string }> =>
        part.type === 'text' || part.type === 'markdown',
    )
    .map((part) => part.content)
    .join('\n');
}

export function MessageActions({
  message,
  showRegenerate = false,
  onRegenerate,
  onEdit,
  onRetry,
  forceVisible = false,
}: MessageActionsProps) {
  const [copied, setCopied] = useState(false);

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(collectMessageText(message));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 剪贴板不可用（非安全上下文等）：静默忽略
    }
  };

  const showCopy = message.role === 'assistant' && message.status === 'completed';
  const showRegenerateButton =
    showRegenerate && onRegenerate !== undefined;
  const showEditButton = message.role === 'user' && onEdit !== undefined;
  const showRetryButton =
    message.role === 'assistant' && message.status === 'error' && onRetry !== undefined;

  if (!showCopy && !showRegenerateButton && !showEditButton && !showRetryButton) {
    return null;
  }

  return (
    <div
      className={`pactor-chat-message__actions${
        forceVisible ? ' pactor-chat-message__actions--visible' : ''
      }`}
    >
      {showCopy && (
        <button
          type="button"
          className="pactor-chat-icon-button"
          title={copied ? '已复制' : '复制'}
          aria-label={copied ? '已复制' : '复制'}
          onClick={() => void copy()}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      )}
      {showRegenerateButton && (
        <button
          type="button"
          className="pactor-chat-icon-button"
          title="重新生成"
          aria-label="重新生成"
          onClick={onRegenerate}
        >
          <RotateCcw size={14} />
        </button>
      )}
      {showRetryButton && (
        <button
          type="button"
          className="pactor-chat-icon-button"
          title="重试"
          aria-label="重试"
          onClick={onRetry}
        >
          <RotateCcw size={14} />
        </button>
      )}
      {showEditButton && (
        <button
          type="button"
          className="pactor-chat-icon-button"
          title="编辑"
          aria-label="编辑"
          onClick={onEdit}
        >
          <Pencil size={14} />
        </button>
      )}
    </div>
  );
}
