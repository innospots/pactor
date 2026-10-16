// 一站式入口（设计文档第 86–88 节）
export { createPactorApplication } from './application.js';
export type {
  AuthTokenProvider,
  PactorApplication,
  PactorApplicationOptions,
  PactorApplicationHandle,
  PactorAppSession,
  PactorRouterOptions,
} from './application.js';
export { ReactRouterBinding } from './application.js';

// 语言偏好持久化适配器（设计 D4）
export { createLocalStorageLocaleStorage } from './locale-storage.js';
export type { LocaleStorage } from './locale-storage.js';

// React 组合层（高级用法：不经 mount 自行嵌入时可用）
export { Application } from './app-shell.js';
export type { ApplicationProps } from './app-shell.js';
export { DslPageLoader } from './page-loader.js';
export type { DslPageLoaderProps } from './page-loader.js';
export { PageErrorBoundary } from './error-boundary.js';

// 组装内核（高级用法：HTTP 钩子 / 注册表合并）
export { createRuntimeHttpAdapter, wrapHttpAdapter } from './assembly.js';
export type { PactorHttpHooks } from './assembly.js';

// 嵌入式页面（spec: embedded-page-view）：存量项目局部嵌入，不接管路由
export { createPactorPage, PactorPage } from './embedded.js';
export type { PactorPageOptions, PactorPageProps } from './embedded.js';

// Sitemap 动态页面（design/dynamic-page.md）：配置 sitemap 源即成应用
export { defaultSitemapActions } from './sitemap/actions.js';
export { SitemapApp } from './sitemap/SitemapApp.js';
export type { SitemapAppProps } from './sitemap/SitemapApp.js';
export { fetchSitemap } from './sitemap/fetch.js';
export type { FetchSitemapOptions } from './sitemap/fetch.js';
export { createHttpHooks, withHttpHooks } from './sitemap/http.js';
export type { CreateHttpHooksOptions } from './sitemap/http.js';
export { createSitemapLoader } from './sitemap/loader.js';
export type { SitemapLoaderOptions } from './sitemap/loader.js';
export {
  mergeSitemapMenus,
  toSitemapNavItems,
} from './sitemap/merge.js';
export type { SitemapNavItem } from './sitemap/merge.js';
export {
  defaultSitemapGuard,
  resolveLayoutChain,
  resolveSitemapRoute,
} from './sitemap/route.js';
export type {
  SitemapGuard,
  SitemapGuardContext,
  SitemapGuardDecision,
  SitemapRouteResolution,
} from './sitemap/route.js';
export { createSitemapSessionServices } from './sitemap/session.js';
export type { SitemapSessionContext } from './sitemap/session.js';
export type {
  LayoutDsl,
  SitemapMenuItem,
  SitemapPageEntry,
  SitemapResource,
  SitemapRouteMatch,
} from './sitemap/types.js';
