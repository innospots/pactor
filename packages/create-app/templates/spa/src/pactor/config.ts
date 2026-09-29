/**
 * 入口配置（design/dynamic-page.md）：开发者在此配置一个或多个
 * 返回 sitemap 对象的接口 URL。多源时 pages / menus / layouts 按键合并
 * （id / path 冲突后源覆盖前源并告警），app / user / permissions / auth
 * 取第一个源。
 *
 * 本模板不自带后端：接口复用 next-app-starter 的 mock API
 * （apiBaseUrl 指向其 dev server，已开通 CORS）。sources 只写相对路径，
 * 由 apiBaseUrl 补全为外部绝对地址，浏览器直连，无需项目内代理。
 */
export const sitemapSources: string[] = ["/api/sitemap"];

/** 外部接口基准地址（SitemapApp baseUrl）：相对接口路径以此为基准补全 */
export const apiBaseUrl = "http://localhost:9011";
