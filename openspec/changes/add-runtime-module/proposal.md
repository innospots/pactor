# Proposal: add-runtime-module

## Why

基础模块（pactor-core / pactor-schema / pactor-expression）已落地。按依赖关系（附录 A：core ← schema ← expression ← runtime），下一步是 `pactor-runtime`——框架的核心引擎层（设计文档第 3.2 节"Runtime 是框架核心"）。它把 DSL 文档变成可运行的页面：组装 RuntimeContext、管理状态与数据源、执行事件与动作、驱动 React 渲染。没有它，上层所有模块（resource/router/permission/layout/interaction/components/chat）都没有运行载体。

## What Changes

- 新增 `pactor-runtime` 包（`packages/runtime`），依赖 core / schema / expression，React >= 18 作为 peer dependency。
- **RuntimeContext**：按设计文档第 15 节组装统一上下文（app / page / state / data / route / user / services / components / actions / permission 等）。
- **StateStore**：框架无关的最小状态容器（get / set / reset / subscribe），支持表达式路径读取。
- **DataSource 运行时**：支持 `static` / `service` / `http` 类型（`computed` / `resource` 留待后续），autoLoad、loading / error / data 状态、参数表达式解析、refresh/reload；Service Registry 接入业务服务；HTTP 通过可替换的 fetch adapter。
- **Action 引擎**：ActionRegistry + Action 编排执行；内置 UI 无关标准动作：`setState`、`resetState`、`reload`、`request`、`sequence`、`parallel`、`if`、`delay`；Action 支持 condition 条件执行与 permission 拦截钩子；`navigate` / `message` / `confirm` / `overlay.*` 通过上下文适配接口留給上层模块注册。
- **生命周期**：onInit / onLoad / onReady / onShow / onHide / onDestroy 编排。
- **React Renderer**：`renderNode` 基于 ComponentRegistry；props 深度表达式解析；`when` 条件渲染；`events` 绑定到 Action 引擎（自动建立 event 作用域）；未注册组件渲染 `UnsupportedComponent` 占位；支持子作用域扩展（row / rowIndex / item 等，供 Table、Repeat 类组件使用）。
- **PageRuntime**：把 PageDsl → 校验（pactor-schema）→ 创建 RuntimeContext → 初始化 state → 初始化 dataSources（autoLoad）→ 执行生命周期 → 渲染 body 的完整链路（设计文档第 89 节）。
- 单元测试 + React 组件测试（Vitest + Testing Library + jsdom）。

## Capabilities

### New Capabilities

- `runtime-context`: RuntimeContext 组装、StateStore、作用域链、Service Registry。
- `datasource-runtime`: DataSource 加载与状态管理（static / service / http、autoLoad、loading/error/data、refresh）。
- `action-engine`: Action Registry 与编排执行、内置标准动作、condition / permission 拦截。
- `dsl-renderer`: React Renderer——props 表达式解析、when 条件、events 绑定、子作用域、UnsupportedComponent。
- `page-runtime`: PageDsl 完整运行链路与生命周期编排。

### Modified Capabilities

（无。）

## Impact

- **新增代码**：`packages/runtime`。
- **新依赖**：peerDependencies `react >= 18`；devDependencies `react`、`react-dom`、`@testing-library/react`、`jsdom`、`@types/react(-dom)`。无新增运行时依赖。
- **设计文档**：无变更；实现严格对齐第 15/17/19/20/21/89 节。
- **后续模块**：pactor-components（注册 Level 1 组件）、pactor-permission（实现权限钩子）、pactor-router（实现 navigate）、pactor-interaction（overlay 动作）均建立在本模块的上下文与适配接口之上。
