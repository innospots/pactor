"use client";

import { AppShell, PactorShellHost } from "@pactor-app/shell/client";

import { moduleExtensions } from "@generated/pactor/client-registry";

/**
 * 工作区外壳：sitemap 模式（菜单/布局由 Pactor DSL 布局链承担）。
 *
 * 业务组件由各模块的 client entry 注册（extensions.components），
 * Shell 不再内建业务组件；这里只负责把装配产物交给 PactorShellHost。
 */
export function WorkspaceShell() {
  return (
    <AppShell
      menu={{ mode: "sitemap" }}
      layout={{ variant: "side-fixed" }}
      renderSubApp={() => <PactorShellHost extensions={moduleExtensions} />}
    />
  );
}
