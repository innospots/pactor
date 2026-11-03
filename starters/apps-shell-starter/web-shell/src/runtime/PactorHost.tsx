"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { createHttpHooks, SitemapApp } from "pactor-app";

import { moduleExtensions } from "@generated/pactor/client-registry";

import {
  createShellNavigate,
  runtimePageEndpoint,
  runtimeSitemapSource,
} from "./pactor-adapter";
import { mergeModuleActions, mergeModuleComponents } from "./register-extensions";

/**
 * HTTP 数据源钩子：拆分 { code, data, message } 包裹协议。
 * 模块页面 DSL 中的 dataSources（如 /api/modules/<moduleId>/risk-analysis/*）依赖它；
 * 模块级常量保证引用稳定，避免页面/布局工厂随渲染重建。
 */
const httpAdapter = createHttpHooks();

function PactorHostInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <SitemapApp
      sources={[runtimeSitemapSource]}
      baseUrl=""
      pathname={pathname}
      query={Object.fromEntries(searchParams.entries())}
      navigate={createShellNavigate(router)}
      components={mergeModuleComponents(moduleExtensions)}
      actions={mergeModuleActions(moduleExtensions)}
      httpAdapter={httpAdapter}
      pageEndpoint={runtimePageEndpoint}
    />
  );
}

export function PactorHost() {
  return (
    <Suspense fallback={null}>
      <PactorHostInner />
    </Suspense>
  );
}
