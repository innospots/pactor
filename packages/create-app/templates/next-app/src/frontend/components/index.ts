"use client";

/**
 * 页面 DSL 的自定义组件注册表。
 * 这里只登记 starter 保留的通用管理、数据运营、工作台和系统管理组件。
 */
import { NavigationShell } from "./layout/navigation-shell";
import { CatalogTree } from "./settings/catalog-tree";
import { DictionaryEditor } from "./settings/dictionary-editor";
import { PermissionGrantPanel } from "./settings/permission-grant-panel";
import { ThemeGallery, ThemeSettings } from "./settings/theme-settings";
import { FilterSelect } from "./shared/filter-select";
import { WorkbenchHome, WorkbenchHero, WorkbenchEntry, WorkbenchAssistant } from "./workbench/workbench-home";

export const pactorComponents: Record<string, unknown> = {
  NavigationShell,
  WorkbenchHome,
  WorkbenchHero,
  WorkbenchEntry,
  WorkbenchAssistant,
  DictionaryEditor,
  ThemeSettings,
  ThemeGallery,
  CatalogTree,
  PermissionGrantPanel,
  FilterSelect,
};
