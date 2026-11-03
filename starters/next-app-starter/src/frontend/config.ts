/**
 * 入口配置（design/dynamic-page.md）：开发者在此配置一个或多个
 * 返回 sitemap 对象的接口 URL。多源时 pages / menus / layouts 按键合并
 * （id / path 冲突后源覆盖前源并告警），app / user / permissions / auth
 * 取第一个源。
 *
 * 外部接口：sources 只写相对路径，由 apiBaseUrl 补全为外部绝对地址；
 * 服务端已开通 CORS（cookie 会话见 src/backend/cors.ts），浏览器直连，
 * 无需项目内代理。
 */
export const sitemapSources: string[] = ["/api/sitemap"];

/** Expand the primary navigation on hover or keyboard focus. */
export const navigationConfig = { expandRailOnHover: false };

/**
 * 页面访问校验端点（同源 Next 服务端路由）。
 * 服务端解析页面 DSL 的 pageKey / grantGroup 后转发平台
 * POST /api/public/page-access/verify（域 / 模块标识见 src/backend/pages/page-access.ts），
 * 浏览器不直接接触平台地址。
 */
export const pageAccessEndpoint = "/api/page-access/verify";

/**
 * 外部接口基准地址（SitemapApp baseUrl）。
 * 由 next.config.js 的 API_BASE_URLS 按 APP_ENV 解析，经 env 配置
 * 内联进客户端包；缺省回退本地开发地址。
 */
export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:9011";
