"use client";

import { usePathname, useRouter } from "next/navigation";
import { Suspense, useCallback, useSyncExternalStore } from "react";
import { createHttpHooks, SitemapApp } from "pactor-app";
import { Login } from "@pactor-app/blocks";

import { LocaleSelector, useLocale } from "./locale";

import { apiBaseUrl, pageEndpoint, sitemapSources } from "./config";
import { pactorActions } from "./actions";
import { pactorComponents } from "./components";

/**
 * 动态页面应用（design/dynamic-page.md）：框架 SitemapApp + 宿主接线。
 * 路由解析 / 访问守卫 / DSL 布局（PageOutlet + SitemapMenu）/ 页面加载 /
 * session.context 桥 / 缺省动作（app.reload / service.call）全部由
 * @pactor-app/app 内置；此处只提供：sitemap 源、宿主路由
 * （pathname / navigate）、HTTP 钩子，以及页面 DSL 依赖的运行时支撑层——
 * 自定义组件（components/）与自定义动作（actions.ts）。
 * 页面数据全部走 http 数据源（/api/d/*），经转发层
 *（app/api/d/[...parts]/route.ts）原样转发到 serverBaseUrl（见 config.ts）；
 * 没有服务层接口时转发层返回空数据，页面按空态渲染。
 *
 * 业务区块组件（@pactor-app/blocks）不进 ui 内置注册表：login 页 DSL 的
 * `type: Login` 经 `components` prop 注册（样式由 app/layout.tsx 导入的
 * pactor-app/styles.css 聚合入口统一加载）。
 *
 * 登录 / 登出是普通 HTTP 调用，由 DSL 中的内置 request 动作直接表达
 *（见 src/server/yaml/ 的登录页 / 布局 DSL），无需客户端注册服务。
 *
 * 挂载在 app/layout.tsx（Next layout 跨导航常驻，切换导航只刷新内容区）。
 *
 * HTTP 钩子用框架默认实现 createHttpHooks：{ code, data, message } 拆包；
 * 后端包裹协议不同 / 需公共头注入时传 options，需要代理改写时传
 * proxyPrefix，或自行实现 PactorHttpHooks。
 */

const httpAdapter = createHttpHooks();

// 稳定引用（模块级）：SitemapApp 的 components / actions 参与工厂 memo，
// 内联对象会在每次渲染生成新身份 → 布局与页面运行时随导航整体重挂载
// （丢失布局常驻语义、侧栏折叠态重置，且首帧 session 未就绪时 Header
// 用户区更易撞上空数据）。提为常量后仅路由页面随导航重建。
const appComponents = { ...pactorComponents, Login };

// 免挂起查询参数：useSearchParams 在客户端导航时会触发 Suspense，
// 使外层 fallback=null 卸载整棵应用树。改从 location 同步读取，
// popstate 后经 useSyncExternalStore 通知更新。
function subscribeToUrl(callback: () => void): () => void {
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("popstate", callback);
  };
}

function useLocationSearch(): string {
  return useSyncExternalStore(
    subscribeToUrl,
    () => window.location.search,
    () => "",
  );
}

export function PactorApp() {
  return (
    <Suspense fallback={null}>
      <PactorAppInner />
    </Suspense>
  );
}

function PactorAppInner() {
  const pathname = usePathname();
  const search = useLocationSearch();
  const router = useRouter();
  const { locale, changeLocale } = useLocale();
  const query = Object.fromEntries(new URLSearchParams(search).entries());
  // navigate 参与 SitemapApp 内部工厂 memo：内联箭头每次渲染都是新身份
  // → 布局/页面工厂重建 → 布局随导航整体重挂载。useRouter 返回稳定引用，
  // navigate 随之稳定，布局跨导航常驻。
  const navigate = useCallback((to: string) => router.push(to), [router]);
  if (!locale) return null;
  return (
    <>
    <LocaleSelector locale={locale} onChange={changeLocale} />
    <SitemapApp
      key={locale}
      locale={locale}
      defaultLocale="zh-CN"
      sources={sitemapSources}
      baseUrl={apiBaseUrl}
      pathname={pathname}
      query={query}
      navigate={navigate}
      components={appComponents}
      actions={pactorActions}
      pageEndpoint={pageEndpoint}
      httpAdapter={httpAdapter}
    />
    </>
  );
}
