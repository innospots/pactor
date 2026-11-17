// 模块 client 入口：Shell 装配器生成 client-registry.ts 时静态 import
// "<pkg>/client"，要求此处具名导出 extensions（components / actions 注册表）。
//
// 组件随模块打包，页面 DSL 里的 type 名与这里注册的 key 对应；
// 样式由 esbuild 抽成 client/index.css，Shell 通过 "<pkg>/styles.css" 引入。
import "../src/pactor/styles/starter-pages.css";

import { CatalogTree } from "../src/pactor/components/settings/catalog-tree";
import { DictionaryEditor } from "../src/pactor/components/settings/dictionary-editor";
import { PermissionGrantPanel } from "../src/pactor/components/settings/permission-grant-panel";
import { FilterSelect } from "../src/pactor/components/shared/filter-select";
import {
  WorkbenchAssistant,
  WorkbenchEntry,
  WorkbenchHero,
} from "../src/pactor/components/workbench/workbench-home";

export const extensions = {
  components: {
    CatalogTree,
    DictionaryEditor,
    PermissionGrantPanel,
    FilterSelect,
    WorkbenchHero,
    WorkbenchEntry,
    WorkbenchAssistant,
  },
  actions: {},
};
