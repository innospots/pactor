/**
 * 入口配置（design/dynamic-page.md）：开发者在此配置一个或多个
 * 返回 sitemap 对象的接口 URL。多源时 pages / menus / layouts 按键合并
 * （id / path 冲突后源覆盖前源并告警），app / user / permissions / auth
 * 取第一个源。
 *
 * 外部接口：sources 只写相对路径，由 apiBaseUrl 补全为外部绝对地址；
 * 服务端已开通 CORS（cookie 会话见 src/server/cors.ts），浏览器直连，
 * 无需项目内代理。
 */
export const sitemapSources: string[] = ["/api/sitemap"];

/**
 * 懒加载页面端点（SitemapApp pageEndpoint）。
 * 框架缺省为 /api/pages/{id}；本仓库服务端路由在 app/api/public/pages/[id]，
 * 需显式覆盖，否则客户端仍会请求框架缺省路径。
 */
export const pageEndpoint = (pageId: string) =>
  `/api/public/pages/${pageId}`;

/**
 * 客户端接口基准地址（SitemapApp baseUrl）。
 * 数据接口全部同源经转发层（app/api/d/[...parts]）调用，故为空字符串
 * （相对路径由浏览器按同源解析）。
 */
export const apiBaseUrl = "";

/**
 * 服务端接口基准地址（转发层的目标地址，仅服务端路由使用）。
 * 由 next.config.js 的 API_BASE_URLS 按构建环境（APP_ENV：
 * build / build:dev / build:test → production / development / test）
 * 解析并内联；缺省回退本地开发占位（不存在 → 转发层回退空数据）。
 * 所有需要服务端接口地址的位置统一从这里导入。
 */
export const serverBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:9011/backend";
