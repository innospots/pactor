/**
 * UI 模块 client 入口的通配类型声明。
 * 模块包发布的是构建产物（dist-module/client/index.js），不含 .d.ts；
 * 装配器生成的 client-registry.ts 以 "<pkg>/client" 形式引入各模块，此处统一兜底。
 */
declare module "*/client" {
  export const extensions: import("@/runtime/register-extensions").ModuleExtensionBundle;
}

/**
 * 模块 server 入口（dist-module/server/index.mjs）的通配类型声明。
 * 模块包不发布 .d.ts，装配器生成的 server-registry.ts 以 "<pkg>/server"
 * 引入 handlers，此处统一兜底。
 */
declare module "*/server" {
  export const handlers: import("@/server/modules/types").ModuleApiHandlers;
}
