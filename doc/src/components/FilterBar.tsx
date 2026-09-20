/**
 * 集合页筛选条（React 岛，design D7 渐进增强）。
 * - SSR 直出完整列表；水合后从 location.search 恢复筛选状态；
 * - 变更经 history.replaceState 写回 URL（刷新 / 返回 / 分享可恢复）；
 * - 过滤直接操作卡片 DOM（data-filter-item / data-search /
 *   data-updated / data-filter-<key>），无 JS 时完整列表保持可见。
 * URL 参数约定：q=搜索词、sort=name|updated、其余各筛选维度用定义中的 key。
 */
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import EmptyResults from './EmptyResults';

export interface FilterBarOption {
  value: string;
  label: string;
}

export interface FilterBarFilter {
  /** URL query 参数名（如 type / maturity） */
  key: string;
  label: string;
  options: FilterBarOption[];
}

const DEFAULT_SORT = 'name';

function getItems(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-filter-item]'));
}

export default function FilterBar({ filters = [] }: { filters?: FilterBarFilter[] }) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [active, setActive] = useState<Record<string, string>>({});
  const [isEmpty, setIsEmpty] = useState(false);
  /** 上次已应用的签名：初始化恢复后跳过重复的首次 effect */
  const appliedSig = useRef('');

  const apply = useCallback(
    (q: string, s: string, act: Record<string, string>) => {
      const items = getItems();
      let visible = 0;
      const qLower = q.trim().toLowerCase();
      for (const el of items) {
        const search = (el.getAttribute('data-search') ?? '').toLowerCase();
        const matchQuery = qLower === '' || search.includes(qLower);
        let matchFilters = true;
        for (const [key, value] of Object.entries(act)) {
          if (el.getAttribute(`data-filter-${key}`) !== value) {
            matchFilters = false;
            break;
          }
        }
        const show = matchQuery && matchFilters;
        el.hidden = !show;
        if (show) visible += 1;
      }

      // 排序：名称（中文locale）或最近更新（无 data-updated 的条目排最后）
      const parent = items[0]?.parentElement ?? null;
      if (parent) {
        const byName = (a: HTMLElement, b: HTMLElement) =>
          (a.getAttribute('data-search') ?? '').localeCompare(
            b.getAttribute('data-search') ?? '',
            'zh',
          );
        const byUpdated = (a: HTMLElement, b: HTMLElement) => {
          const ta = a.getAttribute('data-updated');
          const tb = b.getAttribute('data-updated');
          if (!ta && !tb) return 0;
          if (!ta) return 1;
          if (!tb) return -1;
          return tb.localeCompare(ta);
        };
        [...items]
          .sort(s === 'updated' ? byUpdated : byName)
          .forEach((el) => parent.appendChild(el));
      }

      document.querySelectorAll('[data-filter-count]').forEach((el) => {
        el.textContent = `共 ${visible} 条`;
      });

      const hasFilter =
        q.trim() !== '' || s !== DEFAULT_SORT || Object.keys(act).length > 0;
      setIsEmpty(visible === 0 && hasFilter);

      // URL 同步（D7）：仅保留非默认参数
      const url = new URL(window.location.href);
      const params = url.searchParams;
      params.delete('q');
      params.delete('sort');
      for (const f of filters) params.delete(f.key);
      if (q.trim() !== '') params.set('q', q.trim());
      if (s !== DEFAULT_SORT) params.set('sort', s);
      for (const [key, value] of Object.entries(act)) params.set(key, value);
      const qs = params.toString();
      window.history.replaceState(null, '', qs ? `${url.pathname}?${qs}` : url.pathname);
    },
    [filters],
  );

  // 初始化：水合后从 location.search 恢复筛选 / 搜索 / 排序
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') ?? '';
    const s = params.get('sort') === 'updated' ? 'updated' : DEFAULT_SORT;
    const act: Record<string, string> = {};
    for (const f of filters) {
      const v = params.get(f.key);
      if (v && f.options.some((o) => o.value === v)) act[f.key] = v;
    }
    appliedSig.current = JSON.stringify([q, s, act]);
    setQuery(q);
    setSort(s);
    setActive(act);
    apply(q, s, act);
  }, [filters, apply]);

  // 状态变更：过滤列表 + 同步 URL（与初始化签名相同则跳过）
  useEffect(() => {
    const sig = JSON.stringify([query, sort, active]);
    if (sig === appliedSig.current) return;
    appliedSig.current = sig;
    apply(query, sort, active);
  }, [query, sort, active, apply]);

  const clearFilters = () => {
    setQuery('');
    setSort(DEFAULT_SORT);
    setActive({});
  };

  const setFilter = (key: string, value: string) => {
    setActive((prev) => {
      const next = { ...prev };
      if (value) next[key] = value;
      else delete next[key];
      return next;
    });
  };

  const labelStyle: CSSProperties = { fontSize: 12, color: '#8a95a5' };
  const fieldStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  };

  return (
    <div className="filter-wrap" style={{ display: 'contents' }}>
      <div className="filter-bar" role="search">
        <input
          type="search"
          className="filter-search"
          placeholder="搜索名称或描述…"
          aria-label="搜索名称或描述"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {filters.map((f) => (
          <label key={f.key} style={fieldStyle}>
            <span style={labelStyle}>{f.label}</span>
            <select
              aria-label={f.label}
              value={active[f.key] ?? ''}
              onChange={(e) => setFilter(f.key, e.target.value)}
            >
              <option value="">全部</option>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        ))}
        <label style={{ ...fieldStyle, marginLeft: 'auto' }}>
          <span style={labelStyle}>排序</span>
          <select
            aria-label="排序"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="name">名称</option>
            <option value="updated">最近更新</option>
          </select>
        </label>
      </div>
      {isEmpty && <EmptyResults onClear={clearFilters} />}
    </div>
  );
}
