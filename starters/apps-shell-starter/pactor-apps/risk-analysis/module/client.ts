// 由 `pactor module init` 生成：模块 client 入口。
// Shell 装配器生成 client-registry.ts 时静态 import "<pkg>/client"，
// 要求此处具名导出 extensions（components / actions 注册表）。

// 模块自带样式：esbuild 会把这里引入的 CSS 抽成 client/index.css，
// 并在 manifest 中写入 styles，Shell 据此自动 import "<pkg>/styles.css"。
// 主题变量（app/theme.css）由 Shell 统一加载，模块内不再引入。
import "../src/pactor/components/risk-shell.css";
import "../src/pactor/components/risk-analysis.css";

export const extensions = {
  components: {},
  actions: {},
};
