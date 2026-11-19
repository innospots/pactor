import { Fragment, useEffect, useRef, type CSSProperties } from 'react';

import { useI18n } from '@pactor-app/runtime';

import { cn } from '../../lib/utils.js';
import { ChatMessage, type ChatMessageProps } from '../ChatMessage/index.js';

/** 消息条目（ChatMessage props + 可选 id / 时间戳，onAction 随事件传出） */
export interface MessageListItem extends ChatMessageProps {
  id?: string;
  /** 消息时间戳（毫秒）：用于日期分隔与 5 分钟分组；缺省不参与日期计算 */
  createdAt?: number;
}

export interface MessageListProps {
  /** 消息列表（可含表达式解析后的数组） */
  messages?: MessageListItem[];
  /** 消息变化后自动滚动到底部，默认 true */
  autoScroll?: boolean;
  /**
   * 同侧消息分组窗口（毫秒）：窗口内连续同角色消息视为一组，仅组首展示
   * 发送方行；缺省 5 分钟，0 关闭分组
   */
  groupWindowMs?: number;
  /** 跨天插入日期分隔（本地时区），默认 false */
  showDateDividers?: boolean;
  /** 未读分隔：在该消息 id 前插入「未读消息」分隔，缺省不渲染 */
  unreadFrom?: string;
  /** 滚动容器 aria-label（缺省 i18n「消息列表」） */
  ariaLabel?: string;
  /** 消息操作事件，传出 { id, action }（Renderer 绑定 events.onAction） */
  onAction?: (event: { id?: string; action: string }) => void;
  /** artifacts 段（「已生成 n 个产物」）点击事件，传出 { id } */
  onOpenArtifacts?: (event: { id?: string }) => void;
  /** 通用：根节点 class（与内置样式合并；高度由外层或 style 约束） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

const DEFAULT_GROUP_WINDOW_MS = 5 * 60_000;

/** 本地时区日 Key（用于日期分隔比较） */
function localDayKey(ts: number): string {
  const date = new Date(ts);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function isSameDay(a: number, b: number): boolean {
  return localDayKey(a) === localDayKey(b);
}

function startOfLocalDay(ts: number): number {
  const date = new Date(ts);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/**
 * MessageList 适配器（shadcn kit）：连续消息流容器——
 * 逐条渲染 ChatMessage，消息变化自动滚到底部（autoScroll 可关）；
 * 高度由外层容器约束（组件本身只提供滚动语义）。
 *
 * 会话流增强（全部 opt-in / 缺省兼容）：
 * - `groupWindowMs`（缺省 5 分钟）同角色连续消息归组，组首才展示发送方；
 * - `showDateDividers` 跨天日期分隔（宿主时区，无水合问题——纯客户端）；
 * - `unreadFrom` 未读分隔；
 * - `role="log"` + `aria-label` + `aria-busy`（流式中）+ 可聚焦滚动区。
 */
export function MessageList({
  messages = [],
  autoScroll = true,
  groupWindowMs = DEFAULT_GROUP_WINDOW_MS,
  showDateDividers = false,
  unreadFrom,
  ariaLabel,
  onAction,
  onOpenArtifacts,
  className,
  style,
}: MessageListProps) {
  const { t, locale } = useI18n();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoScroll) return;
    const el = listRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, autoScroll]);

  const isBusy = messages.some(
    (message) =>
      message.status === 'pending' || message.status === 'streaming',
  );

  const formatDate = (ts: number): string => {
    const today = startOfLocalDay(Date.now());
    const day = startOfLocalDay(ts);
    if (day === today) return t('pactor.chat.messageList.today');
    if (day === today - 86_400_000) {
      return t('pactor.chat.messageList.yesterday');
    }
    try {
      return new Intl.DateTimeFormat(locale || undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(ts));
    } catch {
      return new Date(ts).toLocaleDateString();
    }
  };

  const rows: Array<
    | { kind: 'date'; key: string; label: string }
    | { kind: 'unread'; key: string }
    | {
        kind: 'message';
        key: string;
        message: MessageListItem;
        groupStart: boolean;
      }
  > = [];

  messages.forEach((message, index) => {
    if (
      showDateDividers &&
      message.createdAt !== undefined &&
      (index === 0 ||
        messages[index - 1]?.createdAt === undefined ||
        !isSameDay(messages[index - 1]!.createdAt!, message.createdAt))
    ) {
      rows.push({
        kind: 'date',
        key: `date:${message.id ?? index}`,
        label: formatDate(message.createdAt),
      });
    }
    if (unreadFrom !== undefined && message.id === unreadFrom) {
      rows.push({ kind: 'unread', key: `unread:${message.id}` });
    }

    const previous = messages[index - 1];
    const groupStart =
      groupWindowMs <= 0 ||
      !previous ||
      previous.role !== message.role ||
      message.role === 'system' ||
      (previous.createdAt !== undefined &&
        message.createdAt !== undefined &&
        message.createdAt - previous.createdAt > groupWindowMs);

    rows.push({
      kind: 'message',
      key: message.id ?? `message:${index}`,
      message,
      groupStart,
    });
  });

  return (
    <div
      ref={listRef}
      data-slot="message-list"
      role="log"
      aria-label={ariaLabel ?? t('pactor.chat.messageList.label')}
      aria-busy={isBusy || undefined}
      tabIndex={0}
      className={cn('flex w-full flex-col gap-4 overflow-y-auto', className)}
      style={style}
    >
      {rows.map((row) => {
        if (row.kind === 'date') {
          return (
            <div
              key={row.key}
              data-slot="message-list-date"
              role="separator"
              className="flex items-center gap-2 py-1 text-xs text-muted-foreground"
            >
              <span className="h-px flex-1 bg-border" />
              <span className="shrink-0">{row.label}</span>
              <span className="h-px flex-1 bg-border" />
            </div>
          );
        }
        if (row.kind === 'unread') {
          return (
            <div
              key={row.key}
              data-slot="message-list-unread"
              role="separator"
              className="flex items-center gap-2 text-xs font-medium text-primary"
            >
              <span className="h-px flex-1 bg-primary/40" />
              <span className="shrink-0">
                {t('pactor.chat.messageList.unread')}
              </span>
              <span className="h-px flex-1 bg-primary/40" />
            </div>
          );
        }
        const { message, groupStart } = row;
        return (
          <Fragment key={row.key}>
            <div
              data-slot="message-list-group"
              data-group-start={groupStart || undefined}
              style={{ display: 'contents' }}
            >
              <ChatMessage
                {...message}
                showSender={Boolean(message.showSender) && groupStart}
                onAction={(action) =>
                  onAction?.({ id: message.id, action })
                }
                onOpenArtifacts={
                  onOpenArtifacts
                    ? () => onOpenArtifacts({ id: message.id })
                    : undefined
                }
              />
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
