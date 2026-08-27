import { useEffect, useState, type ReactNode } from 'react';

import type { ChatContextItem, ChatContextSource } from '../model.js';

/**
 * 上下文数据源解析与候选列表（spec: chat-context-sources，设计决策 D1/D5）：
 * 内部组件（不从 index.ts 导出），内建 @ 提及弹层与 + 菜单共用。
 *
 * - 静态 `items` 直用；`service` 引用经注入的 `callService(name, params)`
 *   异步解析，结果按 source 键（service 名 + params JSON）做会话级缓存
 *   （Map 存 promise，同一弹层会话不重复请求）
 * - `callService` 未注入而 source 引用 service 时渲染内联错误提示，
 *   不抛错、不击穿组件树（与 Safe Registry 的受控降级同款取向）
 */

/** callService 服务桥签名（与 ChatServices.callService 同型） */
export type CallChatService = (
  name: string,
  params?: Record<string, unknown>,
) => Promise<unknown>;

/** 会话级解析缓存：key = service 名 + params JSON，值为候选 promise */
export type ContextSourceCache = Map<string, Promise<ChatContextItem[]>>;

/** service 引用的缓存键（spec: chat-context-sources / 会话级缓存） */
function sourceCacheKey(source: ChatContextSource): string {
  return `${source.service ?? ''}:${JSON.stringify(source.params ?? {})}`;
}

/**
 * 解析 source 候选为 promise：静态 items 直用；service 引用经
 * callService 解析并缓存；callService 缺失时返回拒绝 promise
 * （调用方渲染内联错误提示）。
 */
function resolveSource(
  source: ChatContextSource,
  callService: CallChatService | undefined,
  cache: ContextSourceCache,
): Promise<ChatContextItem[]> {
  if (source.items) {
    return Promise.resolve(source.items);
  }
  if (!source.service) {
    return Promise.resolve([]);
  }
  const key = sourceCacheKey(source);
  let cached = cache.get(key);
  if (!cached) {
    cached = callService
      ? callService(source.service, source.params).then((value) =>
          Array.isArray(value) ? (value as ChatContextItem[]) : [],
        )
      : Promise.reject(
          new Error(
            `未注入 callService，无法解析服务 "${source.service}"`,
          ),
        );
    cache.set(key, cached);
  }
  return cached;
}

/** 单个 source 的解析状态 */
type SourceResolution =
  | { status: 'loading' }
  | { status: 'ready'; items: ChatContextItem[] }
  | { status: 'error'; message: string };

/** query 过滤：对候选 label 做大小写不敏感包含匹配 */
function matchesQuery(item: ChatContextItem, query: string): boolean {
  return item.label.toLowerCase().includes(query.toLowerCase());
}

export interface ContextSourceListProps {
  /** 已按 trigger 过滤的数据源 */
  sources: ChatContextSource[];
  /** 过滤词（+ 菜单传 '' 即不过滤） */
  query: string;
  /** 服务桥（services.callService 透传；缺失时 service 源渲染内联错误） */
  callService?: CallChatService;
  /** 会话级解析缓存（宿主组件 ref 持有，弹层重开不重复请求） */
  cache: ContextSourceCache;
  /** 选中候选项回调（携带来源 source，供 chips 去重与 trigger 标记） */
  onSelect: (item: ChatContextItem, source: ChatContextSource) => void;
}

/**
 * 内建上下文候选列表：多 source 时按来源分组（组头 = source.label）；
 * query 变化实时过滤；解析中显示 loading，失败显示内联错误。
 */
export function ContextSourceList({
  sources,
  query,
  callService,
  cache,
  onSelect,
}: ContextSourceListProps): ReactNode {
  const [resolutions, setResolutions] = useState<SourceResolution[]>([]);

  // 解析全部 source：静态 items 同步就绪，service 引用异步（缓存命中
  // 时 promise 已兑现，微任务内回填，无二次请求）
  useEffect(() => {
    let cancelled = false;
    const initial: SourceResolution[] = sources.map((source) =>
      source.items
        ? { status: 'ready', items: source.items }
        : { status: 'loading' },
    );
    setResolutions(initial);
    sources.forEach((source, index) => {
      if (source.items) {
        return;
      }
      resolveSource(source, callService, cache).then(
        (items) => {
          if (!cancelled) {
            setResolutions((prev) => {
              const next = [...prev];
              next[index] = { status: 'ready', items };
              return next;
            });
          }
        },
        (cause: unknown) => {
          if (!cancelled) {
            setResolutions((prev) => {
              const next = [...prev];
              next[index] = {
                status: 'error',
                message: cause instanceof Error ? cause.message : String(cause),
              };
              return next;
            });
          }
        },
      );
    });
    return () => {
      cancelled = true;
    };
  }, [sources, callService, cache]);

  let totalMatched = 0;
  const groups = sources.map((source, index) => {
    const resolution = resolutions[index] ?? { status: 'loading' as const };
    const items =
      resolution.status === 'ready'
        ? resolution.items.filter((item) => matchesQuery(item, query))
        : [];
    totalMatched += items.length;
    return { source, resolution, items };
  });

  return (
    <div className="pactor-chat-source-list">
      {groups.map(({ source, resolution, items }) => (
        <div key={`${source.trigger}:${source.label}`} className="pactor-chat-source-list__group">
          {sources.length > 1 && (
            <div className="pactor-chat-source-list__group-label">
              {source.label}
            </div>
          )}
          {resolution.status === 'loading' && (
            <div className="pactor-chat-source-list__hint">加载中…</div>
          )}
          {resolution.status === 'error' && (
            <div className="pactor-chat-source-list__error" role="alert">
              {resolution.message}
            </div>
          )}
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className="pactor-chat-popover__item"
              onClick={() => onSelect(item, source)}
            >
              {item.label}
            </button>
          ))}
        </div>
      ))}
      {totalMatched === 0 &&
        groups.every(({ resolution }) => resolution.status === 'ready') && (
          <div className="pactor-chat-source-list__hint">无匹配项</div>
        )}
    </div>
  );
}
