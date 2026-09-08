# Pactor

Dynamic Application Runtime — 基于 YAML/JSON DSL 的企业级 Server-Driven UI 与 AI-Native 前端运行时框架。

架构设计见 [框架设计规范](docs/src/content/docs/framework-design.md)，也可通过文档站浏览（`pnpm docs:dev`）。

## 命名约定

框架名为 **pactor**，npm 上使用 `@pactor-app/*` scope 发布各模块（如 `@pactor-app/core`、`@pactor-app/schema`、`@pactor-app/expression`），另有聚合安装包 `pactor-app`（meta package，依赖全部模块、入口转发 `@pactor-app/app`）。设计文档中的 `@company/dsl-*` 为文档占位命名。目录名保持简短（`packages/core`），与包名分离。

## 工程结构

```text
packages/
  core/        @pactor-app/core        DSL 核心协议类型 + 通用 Registry（零依赖）
  schema/      @pactor-app/schema      JSON Schema + Ajv 校验器
  expression/  @pactor-app/expression  受控表达式引擎（无 eval）
  runtime/     @pactor-app/runtime     Runtime 引擎 + React Renderer
  permission/  @pactor-app/permission  权限 Store + 四层守卫
  resource/    @pactor-app/resource    DSL 资源加载 + 缓存 + 版本控制
  router/      @pactor-app/router      菜单注册 + 动态路由 + 导航桥接
  ui/          @pactor-app/ui          内置默认 UI 实现（shadcn 风格：vendored shadcn/ui + 契约/交互核心/布局三层 + 预建样式表）
  app/         @pactor-app/app         一站式集成（createPactorApplication）
  pactor/      pactor-app          聚合安装包（meta）：依赖全部模块，入口转发 @pactor-app/app
examples/
  vite-starter/ example-vite-starter 最小上手示例（vite-plugin 工作流，端口 5499）
  admin/       example-admin      管理后台示例（StaticDslLoader + 内存 mock，端口 5199）
  chat/        example-chat       @pactor-app/chat 对话示例（mock AI 流式 transport，端口 5399）
docs/          pactor-docs        Astro Starlight 文档站
```

依赖方向严格单向：`core ← schema ← expression ← runtime ← {permission, resource, router, ui} ← app`。

## 常用命令

```bash
pnpm install        # 安装依赖
pnpm build          # 构建全部包（ESM + CJS + d.ts）与文档站
pnpm test           # 运行全部测试（含根级跨包冒烟测试）
pnpm typecheck      # 全部包 TypeScript 检查
pnpm docs:dev       # 启动文档站（Astro Starlight，端口 4334）
pnpm docs:build     # 构建文档站
```

## 启动示例

```bash
pnpm --filter example-vite-starter dev   # 最小上手示例（vite-plugin 工作流），http://localhost:5499
pnpm --filter example-admin dev          # 管理后台示例（含皮肤设置），http://localhost:5199
pnpm --filter example-chat dev           # @pactor-app/chat 对话示例，http://localhost:5399
```

> 示例引用 workspace 包的 dist 产物：改包代码后需先 `pnpm build`，示例才能看到效果。
> admin 示例演示账号：`admin` / `pactor123`。

> 注意：Astro 内容集合不会热收录**新增**的文档文件（修改已有文件会热更新）。
> 新增 `docs/src/content/docs/**` 页面后需重启 `pnpm docs:dev`，
> 否则侧边栏会报 `The slug "..." does not exist`。

## 特性

- **Server-Driven UI**：页面用 YAML/JSON DSL 描述，由浏览器 Runtime 动态渲染
- **AI-Native**：支持 Markdown + DSL 的 AI Chat 交互
- **国际化**：内置轻量 i18n 支持，DSL 可使用 `${t('key')}` 表达式
- **权限控制**：页面/菜单/组件/动作四层守卫
- **主题换肤**：CSS 变量令牌覆盖 + 内置暗色皮肤（`data-pactor-theme`）

## 环境要求

- Node.js >= 18
- pnpm >= 9
