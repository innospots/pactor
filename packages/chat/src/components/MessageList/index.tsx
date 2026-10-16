import { useEffect, useRef, type CSSProperties } from 'react';

import { cn } from '../../lib/utils.js';
import { ChatMessage, type ChatMessageProps } from '../ChatMessage/index.js';

/** 消息条目（ChatMessage props + 可选 id，onAction 随事件传出） */
export interface MessageListItem extends ChatMessageProps {
  id?: string;
}

export interface MessageListProps {
  /** 消息列表（可含表达式解析后的数组） */
  messages?: MessageListItem[];
  /** 消息变化后自动滚动到底部，默认 true */
  autoScroll?: boolean;
  /** 消息操作事件，传出 { id, action }（Renderer 绑定 events.onAction） */
  onAction?: (event: { id?: string; action: string }) => void;
  /** artifacts 段（「已生成 n 个产物」）点击事件，传出 { id } */
  onOpenArtifacts?: (event: { id?: string }) => void;
  /** 通用：根节点 class（与内置样式合并；高度由外层或 style 约束） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * MessageList 适配器（shadcn kit）：连续消息流容器——
 * 逐条渲染 ChatMessage，消息变化自动滚到底部（autoScroll 可关）；
 * 高度由外层容器约束（组件本身只提供滚动语义）。
 */
export function MessageList({ messages = [], autoScroll = true, onAction, onOpenArtifacts, className, style }: MessageListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoScroll) return;
    const el = listRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, autoScroll]);

  return (
    <div
      ref={listRef}
      data-slot="message-list"
      className={cn('flex w-full flex-col gap-4 overflow-y-auto', className)}
      style={style}
    >
      {messages.map((message, index) => (
        <ChatMessage
          key={message.id ?? index}
          {...message}
          onAction={(action) => onAction?.({ id: message.id, action })}
          onOpenArtifacts={onOpenArtifacts ? () => onOpenArtifacts({ id: message.id }) : undefined}
        />
      ))}
    </div>
  );
}
