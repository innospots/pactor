"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SitemapApp } from "pactor-app";

import { apiBaseUrl, pageEndpoint, sitemapSources } from "./config";
import { pactorActions } from "./actions";
import { pactorComponents } from "./components";

/**
 * 动态页面应用（design/dynamic-page.md）：框架 SitemapApp + 宿主接线。
 * 路由解析 / 访问守卫 / DSL 布局（PageOutlet + SitemapMenu）/ 页面加载 /
 * session.context 桥 / 缺省动作（app.reload / service.call）全部由
 * @pactor-app/app 内置；此处只提供：sitemap 源、宿主路由
 * （pathname / navigate）、HTTP 钩子，以及页面 DSL 依赖的运行时支撑层——
 * 自定义组件（components/）与调试台自定义动作（actions.ts）。
 * 页面数据全部走 http 数据源（/api/d/*），经转发层
 *（app/api/d/[...parts]/route.ts）原样转发到 serverBaseUrl（见 config.ts）；
 * 没有服务层接口时转发层返回空数据，页面按空态渲染。
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

export function PactorApp() {
  return (
    <Suspense fallback={null}>
      <PactorAppInner />
    </Suspense>
  );
}

function PactorAppInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  return (
    <SitemapApp
      sources={sitemapSources}
      baseUrl={apiBaseUrl}
      pathname={pathname}
      query={Object.fromEntries(searchParams.entries())}
      navigate={(to) => router.push(to)}
      components={pactorComponents}
      actions={pactorActions}
      pageEndpoint={pageEndpoint}
    />
  );
}
