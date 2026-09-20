import type { DslResourceLoader, PageResource } from '@pactor-app/resource';

import type { SitemapResource } from './types.js';

export interface SitemapLoaderOptions {
  /** 懒加载页面端点（pages[].pageDsl 缺省时按 id 获取），缺省 /api/pages/{id} */
  pageEndpoint?: (pageId: string) => string;
  /** fetch 实现（缺省全局 fetch） */
  fetcher?: typeof fetch;
  /** 会话服务名（注入每个页面的 dataSource），缺省 'session.context' */
  sessionService?: string;
}

const defaultPageEndpoint = (pageId: string): string => `/api/pages/${pageId}`;

/**
 * SitemapDslLoader（design/dynamic-page.md 落地影响 #1）：
 * 内联 pageDsl 直接命中；缺省项经页面端点懒加载。
 * 缓存键 id@version——同一版本只取一次。
 * 每个页面注入 session dataSource（${data.session.*}），页面自行声明
 * 同名 dataSource 时以页面为准。
 */
export function createSitemapLoader(
  sitemap: SitemapResource,
  options: SitemapLoaderOptions = {},
): DslResourceLoader {
  const pageEndpoint = options.pageEndpoint ?? defaultPageEndpoint;
  const sessionService = options.sessionService ?? 'session.context';
  const pageById = new Map(sitemap.pages.map((p) => [p.id, p]));
  const cache = new Map<string, PageResource>();

  return {
    async loadPage(pageId) {
      const entry = pageById.get(pageId);
      const version = entry?.version ?? 1;
      const cacheKey = `${pageId}@${version}`;
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
        const fetcher = options.fetcher ?? fetch;
        const res = await fetcher(pageEndpoint(pageId), { cache: 'no-store' });
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
