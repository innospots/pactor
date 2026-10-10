/**
 * 集合页筛选条（React 岛，pactor Form / Field / Input / Select 渲染；design D7 渐进增强）。
 * - SSR 直出完整列表；水合后从 location.search 恢复筛选状态（经
 *   context.forms.setValues 回灌 Form 字段显示）；
 * - 值由 Form 托管：字段变更经 onValuesChange 同步到本组件状态，
 *   再由签名去重的 effect 执行过滤与 URL 同步（history.replaceState）；
 * - 过滤直接操作卡片 DOM（data-filter-item / data-search /
 *   data-updated / data-filter-<key>），无 JS 时完整列表保持可见。
 * URL 参数约定：q=搜索词、sort=name|updated、其余各筛选维度用定义中的 key。
 * Form 依赖 Renderer 上下文（useRenderer），本岛以最小 RuntimeContext +
 * DslRenderer（无 node、仅 children）包裹。
 */
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  createRuntimeContext,
  DslRenderer,
  registerBuiltinActions,
} from '@pactor-app/runtime';
import {
  createComponentRegistry,
  Field,
  Form,
  Input,
  Select,
} from '@pactor-app/ui/components';
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
  /** DslRenderer 的 useSyncExternalStore 不支持 SSR：水合后再渲染（渐进增强，无 JS 时筛选条不可见但完整列表直出） */
  const [mounted, setMounted] = useState(false);

  /** 最小运行时上下文：Form 的 useRenderer 依赖（forms 注册表 / state / i18n） */
  const context = useMemo(() => {
    const ctx = createRuntimeContext({ components: createComponentRegistry(), state: {} });
    registerBuiltinActions(ctx.actions);
    return ctx;
  }, []);

  /** 状态 → Form 字段（URL 恢复 / 清除筛选；setValues 不触发 onValuesChange，避免回环） */
  const pushToForm = useCallback(
    (values: Record<string, unknown>) => {
      context.forms.get('filter')?.setValues(values);
    },
    [context],
  );

  /** Form → 状态（字段变更实时同步，过滤与 URL 同步由下方 effect 执行） */
  const onFormChange = useCallback(
    (_changed: Record<string, unknown>, all: Record<string, unknown>) => {
      setQuery(typeof all['q'] === 'string' ? (all['q'] as string) : '');
      setSort(all['sort'] === 'updated' ? 'updated' : DEFAULT_SORT);
      setActive(() => {
        const next: Record<string, string> = {};
        for (const f of filters) {
          const v = all[f.key];
          if (typeof v === 'string' && v !== '') next[f.key] = v;
        }
        return next;
      });
    },
    [filters],
  );

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

  // 初始化：水合后从 location.search 恢复筛选 / 搜索 / 排序，
  // 并回灌 Form 字段显示（setValues 不触发 onValuesChange）。
  // 依赖 mounted：待 Form 挂载（forms 注册表就绪）后再回灌。
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
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
    pushToForm({
      q,
      sort: s,
      ...Object.fromEntries(filters.map((f) => [f.key, act[f.key]])),
    });
    apply(q, s, act);
  }, [mounted, filters, apply, pushToForm]);

  // 状态变更：过滤列表 + 同步 URL（与初始化签名相同则跳过）。
  // 同样受 mounted 门控：避免在水合前以空状态 apply 并清掉 URL 参数，
  // 使后续的 URL 恢复读到空值。
  useEffect(() => {
    if (!mounted) return;
    const sig = JSON.stringify([query, sort, active]);
    if (sig === appliedSig.current) return;
    appliedSig.current = sig;
    apply(query, sort, active);
  }, [mounted, query, sort, active, apply]);

  const clearFilters = () => {
    setQuery('');
    setSort(DEFAULT_SORT);
    setActive({});
    pushToForm({
      q: '',
      sort: DEFAULT_SORT,
      ...Object.fromEntries(filters.map((f) => [f.key, undefined])),
    });
  };

  const controlStyle: CSSProperties = { minWidth: 110 };

  return (
    <div className="filter-wrap" role="search">
      {mounted && (
        <DslRenderer context={context}>
          <Form name="filter" layout="inline" className="filter-bar" onValuesChange={onFormChange}>
            {/* 表单项必须放 Field 内（label 归 Field）；搜索框无 label 仅作控件容器 */}
            <Field>
              <Input
                name="q"
                size="small"
                className="w-40"
                placeholder="搜索名称或描述…"
              />
            </Field>
            {filters.map((f) => (
              <Field key={f.key} label={f.label}>
                <Select
                  name={f.key}
                  size="small"
                  placeholder="全部"
                  allowClear
                  options={f.options}
                  style={controlStyle}
                />
              </Field>
            ))}
            <Field label="排序">
              <Select
                name="sort"
                size="small"
                options={[
                  { value: 'name', label: '名称' },
                  { value: 'updated', label: '最近更新' },
                ]}
                style={controlStyle}
              />
            </Field>
          </Form>
        </DslRenderer>
      )}
      {isEmpty && <EmptyResults onClear={clearFilters} />}
    </div>
  );
}
