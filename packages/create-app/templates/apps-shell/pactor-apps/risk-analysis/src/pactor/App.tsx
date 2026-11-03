"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback } from "react";
import { SitemapApp, createHttpHooks } from "pactor-app";

import { allowAllGuard, apiBaseUrl, sitemapSources } from "./config";

/** HTTP 钩子模块级常量：内联创建会让 SitemapApp 的页面/布局工厂随渲染重建 */
const pactorHttpHooks = createHttpHooks();

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

  // navigate 引用稳定化：内联箭头每次渲染新引用会让布局工厂随导航重建
  const navigate = useCallback((to: string) => router.push(to), [router]);

  return (
    <SitemapApp
      sources={sitemapSources}
      baseUrl={apiBaseUrl}
      pathname={pathname}
      query={Object.fromEntries(searchParams.entries())}
      navigate={navigate}
      guard={allowAllGuard}
      httpAdapter={pactorHttpHooks}
    />
  );
}
