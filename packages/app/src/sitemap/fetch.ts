import type { PactorHttpHooks } from '../assembly.js';

import { withHttpHooks } from './http.js';
import type { SitemapResource } from './types.js';
import { resolveUrl } from './url.js';

export interface FetchSitemapOptions {
  /** fetch 实现（缺省全局 fetch；SSR / 测试可注入） */
  fetcher?: typeof fetch;
  /** 接口基准地址：sources 为相对路径时以此为基准补全 */
  baseUrl?: string;
  /** HTTP 钩子：与页面运行时同一套 request / response 加工 */
  httpHooks?: PactorHttpHooks;
}

/**
 * 拉取并合并多个 sitemap 源（design/dynamic-page.md）：
 * pages / menus / layouts 按键合并（id / path 冲突后源覆盖前源并告警），
 * app / user / permissions / auth 取第一个源。
 */
export async function fetchSitemap(
  sources: string[],
  options: FetchSitemapOptions = {},
): Promise<SitemapResource> {
  const fetcher = withHttpHooks(options.fetcher ?? fetch, options.httpHooks);
  const responses = await Promise.all(
    sources.map(async (url) => {
      const res = await fetcher(resolveUrl(url, options.baseUrl), {
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`[@pactor-app/app] sitemap 源 ${url} 请求失败：HTTP ${res.status}`);
      }
      return (await res.json()) as SitemapResource;
    }),
  );
  if (responses.length === 0) {
    throw new Error('[@pactor-app/app] sources 为空：请配置至少一个 sitemap 接口 URL');
  }
  const [first, ...rest] = responses;
  const merged: SitemapResource = {
    ...first,
    layouts: { ...first.layouts },
    pages: [...first.pages],
    menus: [...first.menus],
  };
  for (const source of rest) {
    mergeById(merged.pages, source.pages, 'pages');
    mergeById(merged.menus, source.menus, 'menus');
    for (const [name, layout] of Object.entries(source.layouts ?? {})) {
      if (merged.layouts[name] !== undefined) {
        console.warn(`[@pactor-app/app] sitemap layouts 键冲突：${name}，后源覆盖前源`);
      }
      merged.layouts[name] = layout;
    }
  }
  return merged;
}

function mergeById<T extends { id: string; path?: string }>(
  target: T[],
  incoming: T[],
  label: string,
): void {
  for (const item of incoming) {
    const index = target.findIndex(
      (t) => t.id === item.id || (item.path !== undefined && t.path === item.path),
    );
    if (index >= 0) {
      console.warn(`[@pactor-app/app] sitemap ${label} 冲突：${item.id}，后源覆盖前源`);
      target[index] = item;
    } else {
      target.push(item);
    }
  }
}
