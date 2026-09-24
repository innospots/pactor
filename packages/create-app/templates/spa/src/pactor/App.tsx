import { SitemapApp } from "pactor-app";

import { apiBaseUrl, sitemapSources } from "./config";

/**
 * 动态页面应用（design/dynamic-page.md）——纯前端 SPA 模式：
 * 不传 pathname / navigate / query，框架内置浏览器路由
 * （History API 导航 + popstate 前进后退）。路由解析 / 访问守卫 /
 * DSL 布局（PageOutlet + SitemapMenu）/ 页面懒加载 / session.context 桥 /
 * 缺省动作（app.reload / service.call）全部由 @pactor-app/app 内置；
 * 此处只提供：sitemap 源、baseUrl（相对接口地址补全）与 HTTP 钩子。
 *
 * 登录 / 登出是普通 HTTP 调用，由 DSL 中的内置 request 动作直接表达
 * （见服务端下发的登录页 / 布局 DSL），无需客户端注册服务。
 * HTTP 钩子用框架默认实现 createHttpHooks：{ code, data, message } 拆包；
 * 后端包裹协议不同 / 需公共头注入时传 options，需要代理改写时传
 * proxyPrefix，或自行实现 PactorHttpHooks。
 */

export function App() {
  return (
    <SitemapApp
      sources={sitemapSources}
      baseUrl={apiBaseUrl}
    />
  );
}
