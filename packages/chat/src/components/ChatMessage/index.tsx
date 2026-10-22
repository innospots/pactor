import { useI18n } from '@pactor-app/runtime';
import type { CSSProperties } from 'react';

import { cn } from '../../lib/utils.js';
import { Icon } from '@pactor-app/ui/components';
import { Markdown } from '@pactor-app/ui/components';
import { Tooltip } from '@pactor-app/ui/components';
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
  /** 产物计数段：展示「已生成 n 个产物」，提供 onOpenArtifacts 时可点击（打开产物栏） */
  | { type: 'artifacts'; count: number }
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
  /** 是否展示发送方行，默认 false（消息列表不展示 Sender） */
  showSender?: boolean;
  /** 操作列表（completed / error 时展示；有图标时仅图标 + Tooltip 呈现） */
  actions?: ChatMessageActionItem[];
  /** 操作事件，传出 action name（Renderer 绑定 events.onAction） */
  onAction?: (name: string) => void;
  /** artifacts 段（「已生成 n 个产物」）点击事件；提供时该段才可点击 */
  onOpenArtifacts?: () => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

function PartView({
  part,
  role,
  onOpenArtifacts,
}: {
  part: ChatMessagePart;
  role: 'user' | 'assistant' | 'system';
  onOpenArtifacts?: () => void;
}) {
  const { t } = useI18n();
  // system 消息（参考 @pactor-app/chat MessageBubble）：居中弱提示——
  // 无气泡、无底色，仅 12px 浅色文字居中
  if (role === 'system' && (part.type === 'text' || part.type === 'markdown')) {
    return (
      <div
        data-slot="chat-message-system-part"
        className="w-full text-center text-xs text-muted-foreground"
      >
        {part.type === 'markdown' ? (
          <Markdown content={part.content} />
        ) : (
          part.content
        )}
      </div>
    );
  }
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
          <Markdown content={part.content} />
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
        <div data-slot="chat-message-status" className="flex w-fit items-center gap-1.5 text-muted-foreground">
          <Icon name="clock" size="sm" />
          {part.text}
        </div>
      );
    case 'artifacts': {
      const artifactsClass =
        'flex w-fit items-center gap-1.5 text-muted-foreground';
      const label = t('pactor.chat.artifact.generated', { count: part.count });
      // 提供 onOpenArtifacts 时可点击（ChatPage 接线为打开产物栏）
      return onOpenArtifacts ? (
        <button
          type="button"
          data-slot="chat-message-artifacts"
          className={cn(artifactsClass, 'cursor-pointer hover:text-foreground')}
          onClick={onOpenArtifacts}
        >
          <Icon name="package" size="sm" />
          {label}
          <Icon name="chevron-right" size={12} />
        </button>
      ) : (
        <div data-slot="chat-message-artifacts" className={artifactsClass}>
          <Icon name="package" size="sm" />
          {label}
        </div>
      );
    }
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

/** 内建动作名的缺省图标（action.icon 未提供时按 name 兜底） */
const ACTION_ICON_BY_NAME: Record<string, string> = {
  copy: 'copy',
  retry: 'rotate-ccw',
  regenerate: 'refresh-ccw',
  edit: 'pencil',
  like: 'thumbs-up',
  dislike: 'thumbs-down',
  share: 'share',
  delete: 'trash',
};

/**
 * ChatMessage 适配器（shadcn kit）：会话消息组合件——
 * user 右侧气泡；assistant 左侧通栏（Sender + 有序 parts）；system
 * 居中弱提示（无气泡、12px 浅色文字，参考 @pactor-app/chat
 * MessageBubble 的 system 约定）。parts 渲染（text / markdown /
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
  showSender = false,
  actions = [],
  onAction,
  onOpenArtifacts,
  className,
  style,
}: ChatMessageProps) {
  const { t } = useI18n();
  const isUser = role === 'user';
  const isSystem = role === 'system';
  const senderName = isUser
    ? t('pactor.chat.message.user')
    : (agent?.name ?? t('pactor.chat.message.assistant'));

  return (
    <div
      data-slot="chat-message"
      data-role={role}
      data-status={status}
      className={cn(
        'flex w-full flex-col gap-1.5',
        isUser && 'items-end',
        // system 居中弱提示（参考 @pactor-app/chat MessageBubble）
        isSystem && 'items-center text-muted-foreground',
        className,
      )}
      style={style}
    >
      {showSender ? (
        <Sender
          name={senderName}
          avatarText={isUser ? undefined : (agent?.icon ? undefined : senderName.slice(0, 1))}
          time={time}
          align={isUser ? 'end' : 'start'}
        />
      ) : null}
      <div className={cn('flex min-w-0 w-full max-w-full flex-col gap-2', isUser && 'items-end', isSystem && 'items-center')}>
        {parts.map((part, index) => (
          <PartView key={index} part={part} role={role} onOpenArtifacts={onOpenArtifacts} />
        ))}
        {status === 'streaming' ? <StreamingText content="" streaming /> : null}
      </div>
      {actions.length > 0 && (status === 'completed' || status === 'error') ? (
        <div data-slot="chat-message-actions" className="flex items-center gap-1 mt-2">
          {actions.map((action) => {
            const label = action.label ?? action.name;
            const iconName = action.icon ?? ACTION_ICON_BY_NAME[action.name];
            // 有图标（显式 icon 或内建名映射）时仅图标 + Tooltip 呈现
            if (iconName) {
              return (
                <Tooltip key={action.name} content={label} side="top">
                  <button
                    type="button"
                    data-slot="chat-message-action"
                    data-action={action.name}
                    aria-label={label}
                    className="flex cursor-pointer items-center rounded-sm p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                    onClick={() => onAction?.(action.name)}
                  >
                    <Icon name={iconName} size="sm" />
                  </button>
                </Tooltip>
              );
            }
            return (
              <button
                key={action.name}
                type="button"
                data-slot="chat-message-action"
                data-action={action.name}
                className="flex items-center cursor-pointer gap-1 rounded-sm px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                onClick={() => onAction?.(action.name)}
              >
                {label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
