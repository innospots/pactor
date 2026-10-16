import { useMemo, useState, type CSSProperties } from 'react';

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
}

export interface ConversationListProps {
  /** 会话列表（可含表达式解析后的数组） */
  items?: ConversationItemData[];
  /** 受控：当前会话 id；提供时切换仅经 onSelect 上报 */
  activeId?: string;
  /** 是否展示搜索框（按 title / description 过滤），默认 false */
  searchable?: boolean;
  /** 选择事件，传出会话 id（Renderer 绑定 events.onSelect） */
  onSelect?: (id: string) => void;
  /** 删除事件，传出会话 id；提供时行悬浮展示删除按钮 */
  onDelete?: (id: string) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * ConversationList 适配器（shadcn kit）：历史会话列表——
 * 可选搜索过滤、激活态（受控 / 非受控）、悬浮删除；
 * 会话的存储与加载由调用方负责。
 */
export function ConversationList({ items = [], activeId, searchable, onSelect, onDelete, className, style }: ConversationListProps) {
  const [innerActive, setInnerActive] = useState<string>();
  const [keyword, setKeyword] = useState('');
  const active = activeId ?? innerActive;

  const filtered = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    if (!query) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        (item.description ?? '').toLowerCase().includes(query),
    );
  }, [items, keyword]);

  const select = (id: string) => {
    if (activeId === undefined) {
      setInnerActive(id);
    }
    onSelect?.(id);
  };

  return (
    <div data-slot="conversation-list" className={cn('flex w-full flex-col gap-1', className)} style={style}>
      {searchable ? (
        <div className="relative mb-1">
          <span className="absolute top-1/2 left-2 -translate-y-1/2 text-muted-foreground">
            <Icon name="search" size="sm" />
          </span>
          <input
            data-slot="conversation-list-search"
            value={keyword}
            placeholder="搜索会话"
            className="h-8 w-full rounded-md border border-border bg-background pr-2 pl-7 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>
      ) : null}
      {filtered.map((item) => (
        <div
          key={item.id}
          data-slot="conversation-list-item"
          data-active={item.id === active || undefined}
          className={cn(
            'group flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent',
            item.id === active && 'bg-accent',
          )}
          onClick={() => select(item.id)}
        >
          <div className="min-w-0 flex-1">
            <div className={cn('truncate text-sm', item.id === active && 'font-medium')}>{item.title}</div>
            {item.description ? (
              <div className="truncate text-xs text-muted-foreground">{item.description}</div>
            ) : null}
          </div>
          {item.time ? <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span> : null}
          {onDelete ? (
            <button
              type="button"
              data-slot="conversation-list-delete"
              aria-label={`删除 ${item.title}`}
              className="shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(item.id);
              }}
            >
              <Icon name="trash-2" size="sm" />
            </button>
          ) : null}
        </div>
      ))}
      {filtered.length === 0 ? (
        <div className="px-2 py-4 text-center text-sm text-muted-foreground">无匹配会话</div>
      ) : null}
    </div>
  );
}
