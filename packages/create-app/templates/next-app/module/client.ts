// 模块 client 入口：Shell 装配时静态 import "<pkg>/client" 加载 extensions。
// 全局样式由 pactor.module.json tailwind.input 预编译进 client/index.css，勿在此 import globals.css（esbuild 无法解析 tailwindcss 包）。
import "./module.css";
import { pactorComponents } from "../src/frontend/components";

export const extensions = {
  components: pactorComponents,
  actions: {},
};
