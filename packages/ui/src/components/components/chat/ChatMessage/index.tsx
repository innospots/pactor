import type { CSSProperties } from 'react';

import { cn } from '../../../../lib/utils.js';
import { Icon } from '../../Icon/index.js';
import { Markdown } from '../../Markdown/index.js';
import { Bubble } from '../Bubble/index.js';
import { Sender } from '../Sender/index.js';
import { StreamingText } from '../StreamingText/index.js';
import { Thinking } from '../Thinking/index.js';
import { ToolCall } from '../ToolCall/index.js';

/** 消息正文段（与 @pactor-app/chat 的 ChatPart 结构对齐的子集；dsl / artifact 段由 chat 产品层承接） */
export type ChatMessagePart =
  | { type: 'text'; content: string }
  | { type: 'markdown'; content: string }
  | { type: 'thinking'; content: string; status?: 'thinking' | 'done' }
  | { type: 'tool-call'; name?: string; params?: unknown; status?: 'running' | 'done' | 'error'; result?: string }
  | { type: 'tool-result'; content: string }
  | { type: 'status'; text: string }
  | { type: 'error'; message: string };

/** 消息状态（对齐 chat 消息状态机） */
export type ChatMessageStatus = 'pending' | 'streaming' | 'completed' | 'error' | 'cancelled';

/** 助手身份 */
export interface ChatMessageAgent {
  name: string;
  /** 头像图标名（Icon 白名单） */
  icon?: string;
}

/** 消息操作项（onAction 传出 name） */
export interface ChatMessageActionItem {
  name: string;
  label?: string;
  icon?: string;
}

export interface ChatMessageProps {
  /** 角色，默认 assistant */
  role?: 'user' | 'assistant' | 'system';
  /** 有序正文段 */
  parts?: ChatMessagePart[];
  /** 状态，默认 completed；streaming 在末尾渲染光标 */
  status?: ChatMessageStatus;
  /** 助手身份（assistant 消息顶部展示） */
  agent?: ChatMessageAgent;
  /** 时间文本 */
  time?: string;
  /** 是否展示发送方行，默认 true */
  showSender?: boolean;
  /** 操作列表（completed / error 时展示） */
  actions?: ChatMessageActionItem[];
  /** 操作事件，传出 action name（Renderer 绑定 events.onAction） */
  onAction?: (name: string) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

function PartView({ part, role }: { part: ChatMessagePart; role: 'user' | 'assistant' | 'system' }) {
  switch (part.type) {
    case 'text':
      return (
        <Bubble align={role === 'user' ? 'end' : 'start'} variant={role === 'user' ? 'default' : 'muted'}>
          <span className="text-sm whitespace-pre-wrap">{part.content}</span>
        </Bubble>
      );
    case 'markdown':
      return (
        <Bubble align={role === 'user' ? 'end' : 'start'} variant={role === 'user' ? 'default' : 'ghost'}>
          <Markdown content={part.content} className="text-sm" />
        </Bubble>
      );
    case 'thinking':
      return <Thinking content={part.content} status={part.status ?? 'done'} />;
    case 'tool-call':
      return <ToolCall name={part.name} params={part.params} status={part.status ?? 'done'} result={part.result} />;
    case 'tool-result':
      return (
        <pre data-slot="chat-message-tool-result" className="overflow-x-auto rounded-md bg-muted p-2 text-xs whitespace-pre-wrap">
          {part.content}
        </pre>
      );
    case 'status':
      return (
        <div data-slot="chat-message-status" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon name="clock" size="sm" />
          {part.text}
        </div>
      );
    case 'error':
      return (
        <div data-slot="chat-message-error" className="flex items-center gap-1.5 text-sm text-destructive">
          <Icon name="circle-alert" size="sm" />
          {part.message}
        </div>
      );
    default:
      return null;
  }
}

/**
 * ChatMessage 适配器（shadcn kit）：会话消息组合件——
 * Sender（头像 / 名称 / 时间）+ 有序 parts 渲染（text / markdown /
 * thinking / tool-call / tool-result / status / error）+ streaming 光标 +
 * 操作行（onAction 传出 name）。props 驱动，不感知会话 store；
 * dsl / artifact 段与完整会话能力由 @pactor-app/chat 产品层承接。
 */
export function ChatMessage({
  role = 'assistant',
  parts = [],
  status = 'completed',
  agent,
  time,
  showSender = true,
  actions = [],
  onAction,
  className,
  style,
}: ChatMessageProps) {
  const isUser = role === 'user';
  const senderName = isUser ? '我' : (agent?.name ?? '助手');

  return (
    <div
      data-slot="chat-message"
      data-role={role}
      data-status={status}
      className={cn('flex w-full flex-col gap-1.5', isUser && 'items-end', className)}
      style={style}
    >
      {showSender && role !== 'system' ? (
        <Sender
          name={senderName}
          avatarText={isUser ? undefined : (agent?.icon ? undefined : senderName.slice(0, 1))}
          time={time}
          align={isUser ? 'end' : 'start'}
        />
      ) : null}
      <div className={cn('flex min-w-0 flex-col gap-2', isUser ? 'items-end' : 'w-full max-w-full')}>
        {parts.map((part, index) => (
          <PartView key={index} part={part} role={role} />
        ))}
        {status === 'streaming' ? <StreamingText content="" streaming /> : null}
      </div>
      {actions.length > 0 && (status === 'completed' || status === 'error') ? (
        <div data-slot="chat-message-actions" className="flex items-center gap-1">
          {actions.map((action) => (
            <button
              key={action.name}
              type="button"
              data-slot="chat-message-action"
              data-action={action.name}
              className="flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
              onClick={() => onAction?.(action.name)}
            >
              {action.icon ? <Icon name={action.icon} size="sm" /> : null}
              {action.label ?? action.name}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
