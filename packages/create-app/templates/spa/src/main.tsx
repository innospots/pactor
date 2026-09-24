import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// 默认 UI 为 @pactor-app/ui 内置实现，样式表导入为必需步骤
import "@pactor-app/ui/styles.css";

import { App } from "./pactor/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
