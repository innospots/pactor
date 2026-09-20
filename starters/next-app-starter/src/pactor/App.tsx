"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SitemapApp } from "pactor-app";

import { apiBaseUrl, sitemapSources } from "./config";

/**
 * 动态页面应用（design/dynamic-page.md）：框架 SitemapApp + 宿主接线。
 * 路由解析 / 访问守卫 / DSL 布局（PageOutlet + SitemapMenu）/ 页面加载 /
 * session.context 桥 / 缺省动作（app.reload / service.call）全部由
 * @pactor-app/app 内置；此处只提供：sitemap 源、宿主路由
 * （pathname / navigate）与 HTTP 钩子。
 *
 * 登录 / 登出是普通 HTTP 调用，由 DSL 中的内置 request 动作直接表达
 * （见 src/server/sitemap.ts 下发的登录页 / 布局 DSL），无需客户端注册服务。
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
    />
  );
}
