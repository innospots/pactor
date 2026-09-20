/**
 * 入口配置（design/dynamic-page.md）：开发者在此配置一个或多个
 * 返回 sitemap 对象的接口 URL。多源时 pages / menus / layouts 按键合并
 * （id / path 冲突后源覆盖前源并告警），app / user / permissions / auth
 * 取第一个源。
 *
 * 外部接口（跨域）：sources / pageEndpoint 只写相对路径，由 apiBaseUrl
 * 补全为外部绝对地址；经 httpHooks 改写进项目内代理前缀（apiProxyPrefix），
 * 由 next.config.ts 的 rewrites 转发，跨域变同源。
 */
export const sitemapSources: string[] = ["/api/sitemap"];

/** 外部接口基准地址（SitemapApp baseUrl）：相对接口路径以此为基准补全 */
export const apiBaseUrl = "http://11.11.3.109:9011";

/** 外部接口代理前缀（与 next.config.ts 的 rewrites 对应） */
export const apiProxyPrefix = "/api-external";

/** 懒加载页面端点（pages[].pageDsl 缺省时按 id 获取） */
export const pageEndpoint = (pageId: string): string => `/api/pages/${pageId}`;
