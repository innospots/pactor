import type { SitemapGuard } from "pactor-app";

/** sitemap 源：服务端从 yaml/ 读取布局与页面 DSL 后返回 */
export const sitemapSources: string[] = ["/api/sitemap"];

/**
 * 本工程不检查用户状态：放行全部路径。
 * 缺省守卫会把非 public / 未命中路径重定向到不存在的 /login，这里关掉。
 */
export const allowAllGuard: SitemapGuard = () => ({ allow: true });

/** 数据接口与页面同源，相对路径由浏览器解析 */
export const apiBaseUrl = "";
