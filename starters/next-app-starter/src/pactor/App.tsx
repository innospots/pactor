"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SitemapApp } from "pactor-app";

import { pageEndpoint, sitemapSources } from "./config";
import { httpHooks } from "./http";
import { demoActions, demoServices } from "./services";

/**
 * 动态页面应用（design/dynamic-page.md）：框架 SitemapApp + 宿主接线。
 * 路由解析 / 匿名守卫 / DSL 布局（PageOutlet + SitemapMenu）/ 页面加载 /
 * session.context 桥全部由 @pactor-app/app 内置；此处只提供：
 * sitemap 源、宿主路由（pathname / navigate）与业务服务 / 动作 / HTTP 钩子。
 *
 * 挂载在 app/layout.tsx（Next layout 跨导航常驻，切换导航只刷新内容区）。
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
      pathname={pathname}
      query={Object.fromEntries(searchParams.entries())}
      navigate={(to) => router.push(to)}
      pageEndpoint={pageEndpoint}
      services={demoServices}
      actions={demoActions}
      httpAdapter={httpHooks}
    />
  );
}
