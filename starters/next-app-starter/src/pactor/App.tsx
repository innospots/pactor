"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Suspense,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from "react";
import { createHttpHooks, SitemapApp } from "pactor-app";
import { Login } from "@pactor-app/blocks";

import { LocaleSelector, useLocale } from "./locale";

import { apiBaseUrl, sitemapSources } from "./config";
import { pactorComponents } from "./components";
import {
  PageAccessDenied,
  PageAccessGateLoading,
  PageAccessPending,
  usePageAccessGate,
} from "./page-access";
import { translate } from "./i18n/messages";

/**
 * 动态页面应用（design/dynamic-page.md）：框架 SitemapApp + 宿主接线。
 * 路由解析 / 访问守卫 / DSL 布局（PageOutlet + SitemapMenu）/ 页面加载 /
 * session.context 桥 / 缺省动作（app.reload / service.call）全部由
 * @pactor-app/app 内置；此处只提供：sitemap 源、宿主路由
 * （pathname / navigate）、HTTP 钩子，以及页面 DSL 依赖的运行时支撑层——
 * 自定义组件（components/）。
 *
 * 页面访问校验（grantGroup）：页面切换 / 首次打开前先经
 * POST /api/page-access/verify 校验（Next 服务端转发平台
 * /api/public/page-access/verify，服务端解析 pageKey / grantGroup）。
 * 校验通过前 SitemapApp 仍停留在上一个已放行路径——URL 变化但内容区
 * 不闪切；被拒展示 403（含平台返回的 reason），匿名访问受保护页面
 * 由服务端给 redirectTo 跳登录页。
 *
 * 业务区块组件（@pactor-app/blocks）不进 ui 内置注册表：login 页 DSL 的
 * `type: Login` 经 `components` prop 注册（样式由 app/layout.tsx 导入的
 * pactor-app/styles.css 聚合入口统一加载）。
 *
 * 登录 / 登出是普通 HTTP 调用，由 DSL 中的内置 request 动作直接表达
 * （见 src/server/sitemap.ts 下发的登录页 / 布局 DSL），无需客户端注册服务。
 *
 * 国际化：页面 / 布局文案由服务端按 `locale` 本地化后下发（`$i18n` 与
 * `src/server/i18n/locales/<locale>/app.yaml`），客户端不再传业务词条表；
 * `useLocale` 统一 Cookie / URL / 浏览器语言解析，右下角 `LocaleSelector`
 * 写入 `locale` Cookie。切换语言时以 `key={locale}` 重挂载 SitemapApp：
 * 框架暂不随 locale 重取 sitemap（阶段 B），换 key 让 sitemap、布局与页面
 * 携带新 `?locale=` 整体重拉（代价：侧栏折叠态等布局临时状态重置）。
 * 宿主自身视图（页面访问门禁）的文案走 src/pactor/i18n/messages.ts。
 *
 * 挂载在 app/layout.tsx（Next layout 跨导航常驻，切换导航只刷新内容区）。
 *
 * HTTP 钩子用框架默认实现 createHttpHooks：{ code, data, message } 拆包；
 * 后端包裹协议不同 / 需公共头注入时传 options，需要代理改写时传
 * proxyPrefix，或自行实现 PactorHttpHooks。
 */

const httpAdapter = createHttpHooks();

// 稳定引用（模块级）：SitemapApp 的 components 参与工厂 memo，
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
  const pathname = usePathname() ?? "/";
  const search = useLocationSearch();
  const router = useRouter();
  const replace = useCallback((to: string) => router.replace(to), [router]);
  // navigate 参与 SitemapApp 内部工厂 memo：内联箭头每次渲染都是新身份
  // → 布局/页面工厂重建 → 布局随导航整体重挂载。useRouter 返回稳定引用，
  // navigate 随之稳定，布局跨导航常驻。
  const navigate = useCallback((to: string) => router.push(to), [router]);

  // 当前语言（Cookie `locale` / URL `?locale=` / 浏览器语言；首帧 null →
  // SSR 与客户端首帧同为 null，水合完成后才渲染，规避 hydration mismatch）。
  const { locale, changeLocale } = useLocale();

  const { committed, status, retry } = usePageAccessGate(
    pathname,
    search,
    replace,
    locale,
  );

  // SitemapApp 只消费已放行页面的 query；切换期间保持旧页面参数
  const committedQuery = useMemo(
    () => Object.fromEntries(new URLSearchParams(committed?.search ?? "")),
    [committed?.search],
  );

  if (!locale) {
    return null;
  }

  const denied = status.status === "denied";
  const redirecting = denied && status.redirectTo !== undefined;

  // 首次打开：校验通过前不挂载 SitemapApp（避免未授权页面被解析 / 请求 DSL）
  if (committed === null) {
    if (denied && !redirecting) {
      return (
        <PageAccessDenied
          locale={locale}
          reason={status.reason}
          onRetry={retry}
          onHome={() => router.replace("/")}
        />
      );
    }
    return (
      <PageAccessGateLoading
        text={translate(locale, redirecting ? "gate.redirecting" : "gate.checking")}
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
      <LocaleSelector locale={locale} onChange={changeLocale} />
      {/*
       * 校验 / 拦截期间保持 SitemapApp 挂载（仅隐藏）：布局 state 与
       * 已加载页面不因一次页面切换丢失。
       */}
      <div style={{ display: denied ? "none" : "contents" }}>
        <SitemapApp
          key={locale}
          sources={sitemapSources}
          baseUrl={apiBaseUrl}
          pathname={committed.pathname}
          query={committedQuery}
          navigate={navigate}
          components={appComponents}
          httpAdapter={httpAdapter}
          locale={locale}
          defaultLocale="zh-CN"
        />
      </div>
      {status.status === "checking" ? <PageAccessPending locale={locale} /> : null}
      {redirecting ? (
        <PageAccessGateLoading text={translate(locale, "gate.redirecting")} />
      ) : null}
      {denied && !redirecting ? (
        <PageAccessDenied
          locale={locale}
          reason={status.reason}
          onRetry={retry}
          onBack={backToCommitted}
          onHome={() => router.replace("/")}
        />
      ) : null}
    </>
  );
}
