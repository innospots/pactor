# Proposal: add-embedded-page-view

## Why

`createPactorApplication` 目前只有一种使用形态：框架接管整个应用（自建 react-router 路由系统、按 bootstrap 菜单生成路由、mount 到根节点）。大量真实场景是**存量项目渐进接入**——老项目已有自己的路由（react-router / Next.js / 自建），只想在某个路由页面或某个区域里嵌入一个 DSL 渲染的页面/区块。当前只能裸用 `@pactor-app/runtime` 的 `DslRenderer`（没有布局、交互层、资源加载、i18n 的组装便利），接入成本高。

## What Changes

- `@pactor-app/app` 新增嵌入式入口 `PactorPage` 组件 + `createPactorPage(options)` 工厂：
  - `pageId`（经 loader 加载）或直接传 `page`（PageDsl 对象）
  - 复用应用级组装能力：registries、UI kit 预设、交互层（confirm / message / overlay）、i18n、services/actions/capabilities 扩展
  - **不创建路由、不注入宿主路由对象**：`route.params` / `route.query` 由调用方经 props 传入
- 跳转走声明式自然导航：新增 `Link` 组件（渲染 `<a href>`，可配 `target`）；`navigate` 动作在嵌入模式缺省退化为 `location.assign` 整页跳转——不感知宿主路由实现
- 现有 `createPactorApplication`（菜单驱动路由的整应用模式）**保持不变**，两种调用方式共享同一套组装内核
- 文档：新增嵌入式使用指南

## Capabilities

### New Capabilities

- `embedded-page-view`: 嵌入式页面视图（PactorPage / createPactorPage）的 API 契约、组装语义与宿主集成边界

### Modified Capabilities

- `application-bootstrap`: createPactorApplication 与嵌入式入口共享组装内核的关系说明（无行为变化）

## Impact

- `packages/app`：新增 `src/embedded.tsx`（PactorPage / createPactorPage）；`index.ts` 导出入口
- `packages/ui`：新增 `Link` 组件（原生锚点跳转）
- 为后续 router-agnostic（app 与 react-router-dom 解耦）铺路：嵌入模式天然不依赖路由
- `docs/src/content/docs/guides/getting-started.md` 或新增嵌入指南页
- 不涉及破坏性变更
