// 模块 client 入口：Shell 装配器生成 client-registry.ts 时静态 import
// "<pkg>/client"，要求此处具名导出 extensions（components / actions）。
//
// 页面/布局 DSL 使用 ModuleSidebar（独立运行时的二级导航），由 PactorApp 注册；
// 接入 Shell 后外壳布局优先，该组件不参与渲染。
// 样式由 esbuild 抽成 client/index.css，Shell 通过 "<pkg>/styles.css" 引入。
import "../src/frontend/components/app-shell.css";
import "../src/frontend/components/data-analysis.css";

// ModuleSidebar 只用于独立运行的布局（由 src/frontend/App.tsx 注册）；
// 接入 Shell 后由外壳布局接管，模块不再注册同名组件，避免多模块重名告警。
export const extensions = {
  components: {},
  actions: {},
};
