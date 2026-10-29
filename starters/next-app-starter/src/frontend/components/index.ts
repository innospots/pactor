"use client";

/**
 * 页面 DSL 的自定义组件注册表。
 * 这里只登记 starter 保留的通用管理、数据运营、工作台和系统管理组件。
 */
import { ProfilePage } from "./auth/profile-page";
import { NavigationShell } from "./layout/navigation-shell";
import { AuditLogs } from "./settings/audit-logs";
import { CatalogTree } from "./settings/catalog-tree";
import { DictionaryManagement } from "./settings/dictionary-management";
import { PermissionGrantPanel } from "./settings/permission-grant-panel";
import { SystemSettings } from "./settings/system-settings";
import { ThemeSettings } from "./settings/theme-settings";
import { FilterSelect } from "./shared/filter-select";
import { WorkbenchHome } from "./workbench/workbench-home";

export const pactorComponents: Record<string, unknown> = {
  NavigationShell,
  WorkbenchHome,
  ProfilePage,
  SystemSettings,
  DictionaryManagement,
  AuditLogs,
  ThemeSettings,
  CatalogTree,
  PermissionGrantPanel,
  FilterSelect,
};
