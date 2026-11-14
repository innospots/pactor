"use client";

import { AppShell, PactorShellHost } from "@pactor-app/shell/client";

import { moduleExtensions } from "@generated/pactor/client-registry";

/**
 * 工作区外壳：sitemap 模式（菜单/布局由 Pactor DSL 布局链承担），
 * 子应用为 Pactor DSL 模块（PactorShellHost）；皮肤入口经 DSL 布局的
 * `type: SkinSwitcher`（src/shell/layouts/shell.layout.yaml 的 sidebarFooter）。
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
