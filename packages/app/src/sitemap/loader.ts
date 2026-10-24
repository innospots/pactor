import type { DslResourceLoader, PageResource } from '@pactor-app/resource';
import { withLocaleParam } from '@pactor-app/resource';

import type { PactorHttpHooks } from '../assembly.js';

import { withHttpHooks } from './http.js';
import type { SitemapResource } from './types.js';
import { resolveUrl } from './url.js';

export interface SitemapLoaderOptions {
  /** 懒加载页面端点（pages[].pageDsl 缺省时按 id 获取），缺省 /api/pages/{id} */
  pageEndpoint?: (pageId: string) => string;
  /** fetch 实现（缺省全局 fetch） */
  fetcher?: typeof fetch;
  /** 会话服务名（注入每个页面的 dataSource），缺省 'session.context' */
  sessionService?: string;
  /** 接口基准地址：pageEndpoint 返回相对路径时以此为基准补全 */
  baseUrl?: string;
  /** HTTP 钩子：与页面运行时同一套 request / response 加工 */
  httpHooks?: PactorHttpHooks;
  /**
   * 当前语言代码：页面请求 URL 追加 `?locale=`（已有 locale 参数替换不追加），
   * 缓存键扩展为 `id@version@locale`；缺省不携带且维持旧键形 `id@version`
   */
  locale?: string;
}

const defaultPageEndpoint = (pageId: string): string => `/api/pages/${pageId}`;

/**
 * SitemapDslLoader（design/dynamic-page.md 落地影响 #1）：
 * 内联 pageDsl 直接命中；缺省项经页面端点懒加载。
 * 缓存键 id@version——同一版本只取一次；配置 locale 时扩展为
 * id@version@locale 且页面请求追加 `?locale=`（替换语义）。
 * 每个页面注入 session dataSource（${data.session.*}），页面自行声明
 * 同名 dataSource 时以页面为准。
 */
export function createSitemapLoader(
  sitemap: SitemapResource,
  options: SitemapLoaderOptions = {},
): DslResourceLoader {
  const pageEndpoint = options.pageEndpoint ?? defaultPageEndpoint;
  const sessionService = options.sessionService ?? 'session.context';
  const fetcher = withHttpHooks(options.fetcher ?? fetch, options.httpHooks);
  const pageById = new Map(sitemap.pages.map((p) => [p.id, p]));
  const cache = new Map<string, PageResource>();
  const locale = options.locale;

  return {
    async loadPage(pageId) {
      const entry = pageById.get(pageId);
      const version = entry?.version ?? 1;
      const cacheKey = `${pageId}@${version}${locale ? `@${locale}` : ''}`;
      const hit = cache.get(cacheKey);
      if (hit) {
        return hit;
      }
      let resource: PageResource;
      if (entry?.pageDsl !== undefined) {
        resource = {
          id: pageId,
          resourceType: 'page',
          version,
          dslVersion: entry.pageDsl.dsl ?? '1.0',
          schema: entry.pageDsl,
        };
      } else {
        const resolved = resolveUrl(pageEndpoint(pageId), options.baseUrl);
        const res = await fetcher(
          locale ? withLocaleParam(resolved, locale) : resolved,
          {
            cache: 'no-store',
            credentials: 'include',
          },
        );
        if (!res.ok) {
          throw new Error(
            `[@pactor-app/app] 页面 ${pageId} 加载失败：HTTP ${res.status}`,
          );
        }
        resource = (await res.json()) as PageResource;
      }
      if (typeof resource.schema === 'object' && resource.schema !== null) {
        const schema = resource.schema;
        schema.dataSources = {
          session: { type: 'service', service: sessionService, autoLoad: true },
          ...schema.dataSources,
        };
      }
      cache.set(cacheKey, resource);
      return resource;
    },
    async loadFragment(fragmentId) {
      throw new Error(`[@pactor-app/app] 未实现的 fragment 加载：${fragmentId}`);
    },
    async loadBootstrap() {
      return sitemap;
    },
  };
}
