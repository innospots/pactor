import { useI18n } from '@pactor-app/runtime';
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react';

import { cn } from '../../lib/utils.js';
import { Icon } from '@pactor-app/ui/components';

/** 会话条目 */
export interface ConversationItemData {
  id: string;
  title: string;
  /** 补充说明（最近一条消息摘要等） */
  description?: string;
  /** 时间文本（已格式化） */
  time?: string;
  /** 更新时间（ISO 字符串，用于日期分组；缺省时按 older 归组） */
  updatedAt?: string;
  /** 置顶（置顶项排在最前，独立分组） */
  pinned?: boolean;
  /** 运行中（行内展示脉冲指示点） */
  running?: boolean;
  /** 已归档（展示在最后的归档分组） */
  archived?: boolean;
}

/** 归档 / 删除的 Undo 窗口动作类型 */
export type ConversationPendingAction = 'archive' | 'delete';

export interface ConversationListProps {
  /** 会话列表（可含表达式解析后的数组） */
  items?: ConversationItemData[];
  /** 受控：当前会话 id；提供时切换仅经 onSelect 上报 */
  activeId?: string;
  /** 是否展示搜索框（按 title / description 过滤），默认 false */
  searchable?: boolean;
  /**
   * 日期分组（置顶 / 今天 / 昨天 / 过去 7 天 / 更早 / 已归档），
   * 缺省 false（保持现有平铺顺序）
   */
  groupByDate?: boolean;
  /** 选择事件，传出会话 id（Renderer 绑定 events.onSelect） */
  onSelect?: (id: string) => void;
  /** 删除事件，传出会话 id；提供时行悬浮展示删除按钮 */
  onDelete?: (id: string) => void;
  /** 重命名事件（Enter / 失焦提交、Esc 取消），传出 id 与新标题 */
  onRename?: (id: string, title: string) => void;
  /** 置顶切换事件，传出 id 与目标状态 */
  onPin?: (id: string, pinned: boolean) => void;
  /** 归档事件（Undo 窗口结束后触发） */
  onArchive?: (id: string) => void;
  /** 取消归档事件（条目 archived 为 true 时展示入口） */
  onUnarchive?: (id: string) => void;
  /**
   * 归档 / 删除的 Undo 窗口时长（毫秒）；显式传入（含 0）才启用延迟执行，
   * 缺省时 `onDelete` 保持历史同步语义、归档按 5000 处理
   */
  undoMs?: number;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

type GroupKey = 'pinned' | 'today' | 'yesterday' | 'previous7Days' | 'older' | 'archived';

const GROUP_ORDER: readonly GroupKey[] = [
  'pinned',
  'today',
  'yesterday',
  'previous7Days',
  'older',
  'archived',
];

const GROUP_LABEL_KEYS: Record<GroupKey, string> = {
  pinned: 'pactor.chat.conversation.group.pinned',
  today: 'pactor.chat.conversation.group.today',
  yesterday: 'pactor.chat.conversation.group.yesterday',
  previous7Days: 'pactor.chat.conversation.group.previous7Days',
  older: 'pactor.chat.conversation.group.older',
  archived: 'pactor.chat.conversation.group.archived',
};

/** 本地时区日期的零点时间戳 */
function startOfLocalDay(value: Date): number {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
}

/** 按 updatedAt 计算日期分组（无有效日期回退 older） */
function resolveGroup(item: ConversationItemData, now: Date): GroupKey {
  if (item.archived) return 'archived';
  if (item.pinned) return 'pinned';
  if (!item.updatedAt) return 'older';
  const date = new Date(item.updatedAt);
  if (Number.isNaN(date.getTime())) return 'older';
  const today = startOfLocalDay(now);
  const day = startOfLocalDay(date);
  if (day >= today) return 'today';
  if (day === today - 86_400_000) return 'yesterday';
  if (day >= today - 6 * 86_400_000) return 'previous7Days';
  return 'older';
}

/**
 * ConversationList 适配器（shadcn kit）：历史会话列表——
 * 可选搜索过滤、激活态（受控 / 非受控）、悬浮删除；
 * 会话的存储与加载由调用方负责。
 *
 * 管理能力（全部 opt-in，不传时行为与旧版一致）：
 * - `groupByDate` 按置顶 / 今天 / 昨天 / 过去 7 天 / 更早 / 已归档分组；
 * - `onPin` / `onRename` / `onArchive` / `onUnarchive` 行内操作；
 * - 归档 / 删除先隐藏，Undo 窗口（`undoMs`）结束后才触发回调；
 * - 键盘 ↑/↓/Home/End 在行间移动，Enter / Space 选择，
 *   激活项标记 `aria-current="page"`（roving tabindex）。
 */
export function ConversationList({
  items = [],
  activeId,
  searchable,
  groupByDate = false,
  onSelect,
  onDelete,
  onRename,
  onPin,
  onArchive,
  onUnarchive,
  undoMs,
  className,
  style,
}: ConversationListProps) {
  const { t } = useI18n();
  const [innerActive, setInnerActive] = useState<string>();
  const [keyword, setKeyword] = useState('');
  const active = activeId ?? innerActive;
  const listRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  // 重命名：Enter / 失焦提交，Esc 取消
  const [editing, setEditing] = useState<{ id: string; value: string } | null>(null);
  const editCommitRef = useRef(false);

  // 归档 / 删除的延迟执行（Undo 窗口）
  const [pending, setPending] = useState<{
    id: string;
    title: string;
    action: ConversationPendingAction;
  } | null>(null);
  const [hiddenIds, setHiddenIds] = useState<readonly string[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef(pending);
  pendingRef.current = pending;

  const callbacksRef = useRef({ onArchive, onDelete });
  callbacksRef.current = { onArchive, onDelete };

  const clearTimer = (): void => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const commitPending = (): void => {
    const current = pendingRef.current;
    clearTimer();
    if (!current) return;
    setPending(null);
    setHiddenIds((ids) => ids.filter((id) => id !== current.id));
    if (current.action === 'archive') {
      callbacksRef.current.onArchive?.(current.id);
    } else {
      callbacksRef.current.onDelete?.(current.id);
    }
  };

  const commitPendingRef = useRef(commitPending);
  commitPendingRef.current = commitPending;

  useEffect(() => clearTimer, []);

  const scheduleRemoval = (
    item: ConversationItemData,
    action: ConversationPendingAction,
  ): void => {
    // 新的归档 / 删除会先把上一条决议落地，保证事件顺序可预期
    commitPendingRef.current();
    // 存量语义：未显式配置 undoMs 时 onDelete 仍同步回调；归档是新能力，
    // 按 5000ms Undo 窗口处理
    if (action === 'delete' && undoMs === undefined) {
      callbacksRef.current.onDelete?.(item.id);
      return;
    }
    const entry = { id: item.id, title: item.title, action };
    setPending(entry);
    pendingRef.current = entry;
    setHiddenIds((ids) => (ids.includes(item.id) ? ids : [...ids, item.id]));
    const delay = undoMs ?? 5000;
    if (delay <= 0) {
      // 0 = 立即执行
      commitPendingRef.current();
      return;
    }
    timerRef.current = setTimeout(() => commitPendingRef.current(), delay);
  };

  const undoRemoval = (): void => {
    const current = pendingRef.current;
    clearTimer();
    if (!current) return;
    setPending(null);
    setHiddenIds((ids) => ids.filter((id) => id !== current.id));
    // 撤销后不需要再回调宿主；恢复后的行保持在原列表位置
  };

  const filtered = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    return items.filter((item) => {
      if (hiddenIds.includes(item.id)) return false;
      if (!query) return true;
      return (
        item.title.toLowerCase().includes(query) ||
        (item.description ?? '').toLowerCase().includes(query)
      );
    });
  }, [items, keyword, hiddenIds]);

  const groups = useMemo(() => {
    if (!groupByDate) {
      // 平铺模式：有置顶数据时置顶在前、归档在后，其余保持传入顺序
      const pinned = filtered.filter((item) => item.pinned && !item.archived);
      const archived = filtered.filter((item) => item.archived);
      const rest = filtered.filter((item) => !item.pinned && !item.archived);
      return pinned.length > 0 || archived.length > 0
        ? [
            ...(pinned.length > 0 ? [{ key: 'pinned' as const, items: pinned }] : []),
            ...(rest.length > 0 ? [{ key: 'older' as const, items: rest }] : []),
            ...(archived.length > 0 ? [{ key: 'archived' as const, items: archived }] : []),
          ]
        : [{ key: 'older' as const, items: filtered }];
    }
    const now = new Date();
    const buckets = new Map<GroupKey, ConversationItemData[]>();
    for (const item of filtered) {
      const key = resolveGroup(item, now);
      const bucket = buckets.get(key);
      if (bucket) bucket.push(item);
      else buckets.set(key, [item]);
    }
    return GROUP_ORDER.filter((key) => buckets.has(key)).map((key) => ({
      key,
      items: buckets.get(key)!,
    }));
  }, [filtered, groupByDate]);

  const select = (id: string): void => {
    if (activeId === undefined) {
      setInnerActive(id);
    }
    onSelect?.(id);
  };

  const startRename = (item: ConversationItemData): void => {
    editCommitRef.current = false;
    setEditing({ id: item.id, value: item.title });
  };

  const commitRename = (): void => {
    if (!editing || editCommitRef.current) return;
    editCommitRef.current = true;
    const next = editing.value.trim();
    if (next && next !== items.find((item) => item.id === editing.id)?.title) {
      onRename?.(editing.id, next);
    }
    setEditing(null);
  };

  const cancelRename = (): void => {
    editCommitRef.current = true;
    setEditing(null);
  };

  // roving tabindex：↑/↓/Home/End 在行间移动焦点
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (editing) return;
    const rows = Array.from(
      listRef.current?.querySelectorAll<HTMLElement>(
        '[data-slot="conversation-list-item-button"]',
      ) ?? [],
    );
    if (rows.length === 0) return;
    const index = rows.indexOf(event.currentTarget);
    if (index < 0) return;
    let target: number | null = null;
    if (event.key === 'ArrowDown') target = Math.min(index + 1, rows.length - 1);
    else if (event.key === 'ArrowUp') target = Math.max(index - 1, 0);
    else if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = rows.length - 1;
    if (target === null || target === index) return;
    event.preventDefault();
    rows[target]?.focus();
  };

  // 行内键盘选择：Enter / Space 与点击同语义
  const handleRowKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    id: string,
  ): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      select(id);
      return;
    }
    handleKeyDown(event);
  };

  return (
    <div
      ref={listRef}
      data-slot="conversation-list"
      role="list"
      aria-label={t('pactor.chat.conversation.listLabel')}
      className={cn('flex w-full flex-col gap-1', className)}
      style={style}
    >
      {searchable ? (
        <div className="relative mb-1">
          <span className="absolute top-1/2 left-2 -translate-y-1/2 text-muted-foreground">
            <Icon name="search" size="sm" />
          </span>
          <input
            data-slot="conversation-list-search"
            value={keyword}
            aria-label={t('pactor.chat.conversation.search')}
            placeholder={t('pactor.chat.conversation.search')}
            className="h-8 w-full rounded-md border border-border bg-background pr-2 pl-7 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>
      ) : null}
      {groups.map((group) => (
        <div
          key={group.key}
          data-slot="conversation-group"
          data-group={group.key}
          role="presentation"
          className="flex flex-col gap-1"
        >
          {groupByDate || group.key === 'pinned' || group.key === 'archived' ? (
            <div
              id={`${baseId}-${group.key}`}
              data-slot="conversation-group-label"
              className="px-2 pt-2 pb-0.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase"
            >
              {t(GROUP_LABEL_KEYS[group.key])}
            </div>
          ) : null}
          {group.items.map((item) => {
            const isActive = item.id === active;
            const isEditing = editing?.id === item.id;
            return (
              <div
                key={item.id}
                role="listitem"
                data-slot="conversation-list-item"
                data-active={isActive || undefined}
                className={cn(
                  'group relative flex cursor-pointer items-center rounded-md hover:bg-accent',
                  isActive && 'bg-accent',
                )}
                onClick={() => select(item.id)}
              >
                {isEditing && editing ? (
                  <input
                    autoFocus
                    data-slot="conversation-list-rename"
                    aria-label={t('pactor.chat.conversation.renamePlaceholder')}
                    value={editing.value}
                    className="mx-1 my-1 h-7 min-w-0 flex-1 rounded-sm border border-input bg-background px-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    onChange={(event) =>
                      setEditing({ id: item.id, value: event.target.value })
                    }
                    onBlur={commitRename}
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        commitRename();
                      } else if (event.key === 'Escape') {
                        event.preventDefault();
                        cancelRename();
                      }
                    }}
                  />
                ) : (
                  <div
                    data-slot="conversation-list-item-button"
                    role="button"
                    tabIndex={isActive || (!active && group.items[0]?.id === item.id) ? 0 : -1}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={item.title}
                    className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 py-1.5 pr-16 pl-2 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    onDoubleClick={() => {
                      if (onRename) startRename(item);
                    }}
                    onKeyDown={(event) => handleRowKeyDown(event, item.id)}
                  >
                    {item.running ? (
                      <span
                        data-slot="conversation-list-running"
                        className="relative flex size-2 shrink-0"
                        title={t('pactor.chat.conversation.running')}
                      >
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-info opacity-75 motion-reduce:animate-none" />
                        <span className="relative inline-flex size-2 rounded-full bg-info" />
                        <span className="sr-only">
                          {t('pactor.chat.conversation.running')}
                        </span>
                      </span>
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <div
                        className={cn(
                          'truncate text-sm',
                          isActive && 'font-medium',
                          item.archived && 'text-muted-foreground',
                        )}
                      >
                        {item.title}
                      </div>
                      {item.description ? (
                        <div className="truncate text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      ) : null}
                    </div>
                    {item.time ? (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {item.time}
                      </span>
                    ) : null}
                  </div>
                )}
                {!isEditing ? (
                  <div
                    data-slot="conversation-list-actions"
                    className="pointer-events-none absolute right-1 flex items-center gap-0.5 rounded-md bg-accent px-0.5 opacity-0 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100"
                  >
                    {onPin && !item.archived ? (
                      <button
                        type="button"
                        data-slot="conversation-list-pin"
                        aria-label={
                          item.pinned
                            ? t('pactor.chat.conversation.unpin')
                            : t('pactor.chat.conversation.pin')
                        }
                        aria-pressed={item.pinned === true}
                        className={cn(
                          'rounded-sm p-1 text-muted-foreground hover:text-foreground',
                          item.pinned && 'text-primary',
                        )}
                        onClick={(event) => {
                          event.stopPropagation();
                          onPin(item.id, !item.pinned);
                        }}
                      >
                        <Icon name={item.pinned ? 'pin-off' : 'pin'} size={14} />
                      </button>
                    ) : null}
                    {onRename && !item.archived ? (
                      <button
                        type="button"
                        data-slot="conversation-list-rename-trigger"
                        aria-label={t('pactor.chat.conversation.rename')}
                        className="rounded-sm p-1 text-muted-foreground hover:text-foreground"
                        onClick={(event) => {
                          event.stopPropagation();
                          startRename(item);
                        }}
                      >
                        <Icon name="pencil" size={14} />
                      </button>
                    ) : null}
                    {item.archived && onUnarchive ? (
                      <button
                        type="button"
                        data-slot="conversation-list-unarchive"
                        aria-label={t('pactor.chat.conversation.unarchive')}
                        className="rounded-sm p-1 text-muted-foreground hover:text-foreground"
                        onClick={(event) => {
                          event.stopPropagation();
                          onUnarchive(item.id);
                        }}
                      >
                        <Icon name="archive-restore" size={14} />
                      </button>
                    ) : null}
                    {onArchive && !item.archived ? (
                      <button
                        type="button"
                        data-slot="conversation-list-archive"
                        aria-label={t('pactor.chat.conversation.archive')}
                        className="rounded-sm p-1 text-muted-foreground hover:text-foreground"
                        onClick={(event) => {
                          event.stopPropagation();
                          scheduleRemoval(item, 'archive');
                        }}
                      >
                        <Icon name="archive" size={14} />
                      </button>
                    ) : null}
                    {onDelete ? (
                      <button
                        type="button"
                        data-slot="conversation-list-delete"
                        aria-label={t('pactor.chat.conversation.delete', {
                          title: item.title,
                        })}
                        className="rounded-sm p-1 text-muted-foreground hover:text-destructive"
                        onClick={(event) => {
                          event.stopPropagation();
                          scheduleRemoval(item, 'delete');
                        }}
                      >
                        <Icon name="trash-2" size={14} />
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ))}
      {filtered.length === 0 ? (
        <div className="px-2 py-4 text-center text-sm text-muted-foreground">
          {t('pactor.chat.conversation.empty')}
        </div>
      ) : null}
      <p className="sr-only" role="status" aria-live="polite">
        {pending
          ? pending.action === 'archive'
            ? t('pactor.chat.conversation.archived', { title: pending.title })
            : t('pactor.chat.conversation.deleted', { title: pending.title })
          : ''}
      </p>
      {pending ? (
        <div
          data-slot="conversation-list-undo"
          className="sticky bottom-0 flex items-center justify-between gap-2 rounded-md border border-border bg-popover px-2 py-1.5 text-xs text-popover-foreground shadow-sm"
        >
          <span className="min-w-0 truncate">
            {pending.action === 'archive'
              ? t('pactor.chat.conversation.archived', { title: pending.title })
              : t('pactor.chat.conversation.deleted', { title: pending.title })}
          </span>
          <button
            type="button"
            data-slot="conversation-list-undo-button"
            className="shrink-0 rounded-sm px-1.5 py-0.5 font-medium text-primary hover:bg-accent"
            onClick={undoRemoval}
          >
            {t('pactor.chat.conversation.undo')}
          </button>
        </div>
      ) : null}
    </div>
  );
}
