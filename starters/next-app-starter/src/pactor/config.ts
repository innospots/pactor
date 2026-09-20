/**
 * 入口配置（design/dynamic-page.md）：开发者在此配置一个或多个
 * 返回 sitemap 对象的接口 URL。多源时 pages / menus / layouts 按键合并
 * （id / path 冲突后源覆盖前源并告警），app / user / permissions / auth
 * 取第一个源。
 *
 * 跨域：外部接口走项目内代理前缀（next.config.ts 的 rewrites）——
 * 配置 EXTERNAL_API_BASE 后，把源写成 `${apiProxyPrefix}/sitemap` 即可。
 */
export const sitemapSources: string[] = ["/api/sitemap"];

/** 外部接口代理前缀（与 next.config.ts 的 rewrites 对应） */
export const apiProxyPrefix = "/api-external";

/** 懒加载页面端点（pages[].pageDsl 缺省时按 id 获取） */
export const pageEndpoint = (pageId: string): string => `/api/pages/${pageId}`;
