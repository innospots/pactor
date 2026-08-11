# Pactor

Dynamic Application Runtime — 基于 YAML/JSON DSL 的企业级 Server-Driven UI 与 AI-Native 前端运行时框架。

架构设计见 [框架设计规范](docs/src/content/docs/framework-design.md)，也可通过文档站浏览（`pnpm docs:dev`）。

## 命名约定

框架名为 **pactor**，不使用 npm scope，各模块包名统一 `pactor-` 前缀（如 `pactor-core`、`pactor-schema`、`pactor-expression`）。设计文档中的 `@company/dsl-*` 为文档占位命名。目录名保持简短（`packages/core`），与包名分离。

## 工程结构

```text
packages/
  core/        pactor-core        DSL 核心协议类型 + 通用 Registry（零依赖）
  schema/      pactor-schema      JSON Schema + Ajv 校验器
  expression/  pactor-expression  受控表达式引擎（无 eval）
  runtime/     pactor-runtime     Runtime 引擎 + React Renderer
  permission/  pactor-permission  权限 Store + 四层守卫
  resource/    pactor-resource    DSL 资源加载 + 缓存 + 版本控制
  router/      pactor-router      菜单注册 + 动态路由 + 导航桥接
  ui-antd/     pactor-ui-antd     antd UI kit（components + interaction + layout + antdUiKit）
  ui-radix/    pactor-ui-radix    Radix UI kit（与 antd 版契约一致 + radixUiKit + 样式表）
  app/         pactor-app         一站式集成（createPactorApplication）
examples/
  admin/       example-admin      管理后台示例（private，StaticDslLoader + 内存 mock，端口 5199）
docs/          pactor-docs        Astro Starlight 文档站
```

依赖方向严格单向：`core ← schema ← expression ← runtime ← {permission, resource, router, ui-antd} ← ui-radix ← app`。

## 常用命令

```bash
pnpm install        # 安装依赖
pnpm build          # 构建全部包（ESM + CJS + d.ts）与文档站
pnpm test           # 运行全部测试（含根级跨包冒烟测试）
pnpm typecheck      # 全部包 TypeScript 检查
pnpm docs:dev       # 启动文档站（Astro Starlight，端口 4334）
pnpm docs:build     # 构建文档站
```

> 注意：Astro 内容集合不会热收录**新增**的文档文件（修改已有文件会热更新）。
> 新增 `docs/src/content/docs/**` 页面后需重启 `pnpm docs:dev`，
> 否则侧边栏会报 `The slug "..." does not exist`。

## 环境要求

- Node.js >= 18
- pnpm >= 9
