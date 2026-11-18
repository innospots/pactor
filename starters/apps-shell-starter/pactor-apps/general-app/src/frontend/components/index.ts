"use client";

/**
 * 页面 DSL 的自定义组件注册表。
 *
 * 独立运行（src/frontend/App.tsx）与模块打包（module/client.ts）共用同一份，
 * 避免两处清单漂移；接入 Shell 后由 client-registry 静态注册。
 */
import { CatalogTree } from "./settings/catalog-tree";
import { DictionaryEditor } from "./settings/dictionary-editor";
import { PermissionGrantPanel } from "./settings/permission-grant-panel";
import { FilterSelect } from "./shared/filter-select";
import {
  WorkbenchAssistant,
  WorkbenchEntry,
  WorkbenchHero,
} from "./workbench/workbench-home";

export const pactorComponents: Record<string, unknown> = {
  CatalogTree,
  DictionaryEditor,
  PermissionGrantPanel,
  FilterSelect,
  WorkbenchHero,
  WorkbenchEntry,
  WorkbenchAssistant,
};
