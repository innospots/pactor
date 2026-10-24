import type { DslSourceRef } from '@pactor-app/core';
import type { ExpressionScope } from '@pactor-app/expression';

import type { HttpAdapter, HttpRequestConfig } from '../context/adapters.js';
import type { ServiceRegistry } from '../context/context.js';
import { resolveDeep, type LocalizationMode } from '../utils/resolve.js';

export interface DslSourceResolverDeps {
  services: ServiceRegistry;
  http: HttpAdapter;
  /** 加载前取当前表达式作用域（params 求值用） */
  getScope: () => ExpressionScope;
  /** 本地化协议模式（缺省 'client'），透传给 params / request 求值 */
  localizationMode?: LocalizationMode;
  /**
   * 当前语言代码（G25 注入点，runtime 不依赖 app/i18n 包）：纳入缓存键，
   * 语言上下文不同的解析器互不命中；缺省维持旧键形（仅引用原文）
   */
  locale?: string;
}

/**
 * 缓存 key：按固定字段序拼接引用原文（避免字段顺序差异导致重复请求）；
 * locale 给出时前置语言上下文（G25），缺省维持旧键形（仅引用原文）。
 */
export function dslSourceKey(ref: DslSourceRef, locale?: string): string {
  const source = ref.source;
  const base =
    source.type === 'service'
      ? `service:${source.service}:${JSON.stringify(source.params ?? {})}`
      : `http:${(source.request.method ?? 'GET').toUpperCase()}:${source.request.url}:${JSON.stringify(source.request.params ?? {})}:${JSON.stringify(source.request.headers ?? {})}`;
  return locale ? `${locale}|${base}` : base;
}

/**
 * DslSourceResolver（spec: dsl-renderer 动态引用解析）：
 * 按 `source.type` 分派——service 经 ServiceRegistry、http 经 HttpAdapter；
 * `params` 表达式按**首次解析时**作用域求值一次（不做联动重载）。
 * 结果按引用原文缓存于页面运行时生命周期（Promise 级去重：并发渲染
 * 同一引用共享一次请求；失败同样缓存，随运行时销毁清理）；
 * 注入 `locale` 时缓存键前置语言上下文，跨语言互不命中。
 */
export class DslSourceResolver {
  private readonly cache = new Map<string, Promise<unknown>>();

  constructor(private readonly deps: DslSourceResolverDeps) {}

  resolve(ref: DslSourceRef): Promise<unknown> {
    const key = dslSourceKey(ref, this.deps.locale);
    let cached = this.cache.get(key);
    if (cached === undefined) {
      cached = this.load(ref);
      this.cache.set(key, cached);
    }
    return cached;
  }

  private async load(ref: DslSourceRef): Promise<unknown> {
    const scope = this.deps.getScope();
    const resolveOptions = { localizationMode: this.deps.localizationMode };
    const source = ref.source;
    if (source.type === 'service') {
      const handler = this.deps.services.get(source.service);
      if (!handler) {
        throw new Error(
          `[@pactor-app/runtime] service not registered: "${source.service}"`,
        );
      }
      const params = resolveDeep(source.params ?? {}, scope, resolveOptions) as Record<
        string,
        unknown
      >;
      return handler(params);
    }
    const request = resolveDeep(
      source.request,
      scope,
      resolveOptions,
    ) as HttpRequestConfig;
    return this.deps.http.request(request);
  }
}
