import type { SitemapGuard } from "pactor-app";

/** sitemap 源：服务端从 yaml/ 读取布局与页面 DSL（按请求 locale 本地化）后返回 */
export const sitemapSources: string[] = ["/api/sitemap"];

/**
 * 独立运行不检查用户状态：放行全部路径。
 * 接入 Shell 后由 Shell 的会话与权限守卫接管。
 */
export const allowAllGuard: SitemapGuard = () => ({ allow: true });

/** 数据接口与页面同源，相对路径由浏览器解析 */
export const apiBaseUrl = "";
