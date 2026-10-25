"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useMemo } from "react";
import { SitemapApp } from "pactor-app";

import { apiBaseUrl, sitemapSources } from "./config";
import {
  PageAccessDenied,
  PageAccessGateLoading,
  PageAccessPending,
  usePageAccessGate,
} from "./page-access";

/**
 * 动态页面应用（design/dynamic-page.md）：框架 SitemapApp + 宿主接线。
 * 路由解析 / 访问守卫 / DSL 布局（PageOutlet + SitemapMenu）/ 页面加载 /
 * session.context 桥 / 缺省动作（app.reload / service.call）全部由
 * @pactor-app/app 内置；此处只提供：sitemap 源、宿主路由
 * （pathname / navigate）与 HTTP 钩子。
 *
 * 页面访问校验（grantGroup）：页面切换 / 首次打开前先经
 * POST /api/page-access/verify 校验（Next 服务端转发平台
 * /api/public/page-access/verify，服务端解析 pageKey / grantGroup）。
 * 校验通过前 SitemapApp 仍停留在上一个已放行路径——URL 变化但内容区
 * 不闪切；被拒展示 403（含平台返回的 reason），匿名访问受保护页面
 * 由服务端给 redirectTo 跳登录页。
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
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const router = useRouter();
  const replace = useCallback((to: string) => router.replace(to), [router]);
  const navigate = useCallback((to: string) => router.push(to), [router]);

  const { committed, status, retry } = usePageAccessGate(
    pathname,
    search,
    replace,
  );

  // SitemapApp 只消费已放行页面的 query；切换期间保持旧页面参数
  const committedQuery = useMemo(
    () => Object.fromEntries(new URLSearchParams(committed?.search ?? "")),
    [committed?.search],
  );

  const denied = status.status === "denied";
  const redirecting = denied && status.redirectTo !== undefined;

  // 首次打开：校验通过前不挂载 SitemapApp（避免未授权页面被解析 / 请求 DSL）
  if (committed === null) {
    if (denied && !redirecting) {
      return (
        <PageAccessDenied
          reason={status.reason}
          onRetry={retry}
          onHome={() => router.replace("/")}
        />
      );
    }
    return (
      <PageAccessGateLoading
        text={redirecting ? "正在跳转登录页…" : "正在校验页面访问权限…"}
      />
    );
  }

  const backToCommitted = () => {
    replace(
      `${committed.pathname}${committed.search === "" ? "" : `?${committed.search}`}`,
    );
  };

  return (
    <>
      {/*
       * 校验 / 拦截期间保持 SitemapApp 挂载（仅隐藏）：布局 state 与
       * 已加载页面不因一次页面切换丢失。
       */}
      <div style={{ display: denied ? "none" : "contents" }}>
        <SitemapApp
          sources={sitemapSources}
          baseUrl={apiBaseUrl}
          pathname={committed.pathname}
          query={committedQuery}
          navigate={navigate}
        />
      </div>
      {status.status === "checking" ? <PageAccessPending /> : null}
      {redirecting ? <PageAccessGateLoading text="正在跳转登录页…" /> : null}
      {denied && !redirecting ? (
        <PageAccessDenied
          reason={status.reason}
          onRetry={retry}
          onBack={backToCommitted}
          onHome={() => router.replace("/")}
        />
      ) : null}
    </>
  );
}
