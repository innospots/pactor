"use client";

import { AppShell, PactorShellHost } from "@pactor-app/shell/client";

import { moduleExtensions } from "@generated/pactor/client-registry";

import { CatalogTree } from "./settings/catalog-tree";
import { DictionaryEditor } from "./settings/dictionary-editor";
import { PermissionGrantPanel } from "./settings/permission-grant-panel";
import { FilterSelect } from "./shared/filter-select";
import {
  WorkbenchAssistant,
  WorkbenchEntry,
  WorkbenchHero,
} from "./workbench/workbench-home";

/**
 * 工作区外壳：sitemap 模式（菜单/布局由 Pactor DSL 布局链承担），
 * 子应用为 Pactor DSL 模块（PactorShellHost）；布局与开箱页面来自
 * @pactor-app/shell 包内默认站点（assets/site 的 admin rail 布局），
 * 默认页面集合对齐 next-app-starter（工作台 / 数据概览 / 系统管理），
 * 其页面 DSL 依赖的宿主自定义组件在此注册（同名覆盖内建注册）。
 */
const hostComponents: Record<string, unknown> = {
  CatalogTree,
  DictionaryEditor,
  PermissionGrantPanel,
  FilterSelect,
  WorkbenchHero,
  WorkbenchEntry,
  WorkbenchAssistant,
};

export function WorkspaceShell() {
  return (
    <AppShell
      menu={{ mode: "sitemap" }}
      layout={{ variant: "side-fixed" }}
      renderSubApp={() => (
        <PactorShellHost extensions={moduleExtensions} components={hostComponents} />
      )}
    />
  );
}
