// 模块 client 入口：Shell 装配器生成 client-registry.ts 时静态 import
// "<pkg>/client"，要求此处具名导出 extensions（components / actions 注册表）。
//
// 组件清单与独立运行共用 src/frontend/components 的 registry；
// 样式由 esbuild 抽成 client/index.css，Shell 通过 "<pkg>/styles.css" 引入。
import "../src/frontend/styles/starter-pages.css";

import { pactorComponents } from "../src/frontend/components";

export const extensions = {
  components: pactorComponents,
  actions: {},
};
