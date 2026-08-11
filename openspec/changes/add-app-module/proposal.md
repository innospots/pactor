# Proposal: add-app-module

## Why

前面八个模块各自独立可用，但业务工程不该逐个组装——设计文档第 86 节定义了一站式入口：`npm install pactor-app` 后 `createPactorApplication({ appId, api }).mount('#root')`，业务代码可以非常薄。本变更落地 `pactor-app`：把 bootstrap 加载 → 权限 → 菜单 → 布局 → 动态路由 → DSL 页面加载 → PageRuntime → Overlay/交互层全部串联的组合层（第 88 节完整启动流程）。

## What Changes

- 新增 `pactor-app` 包（`packages/app`），dependencies 为全部既有 pactor 包（workspace:*）；peerDependencies：`react >=18`、`react-dom >=18`、`react-router-dom >=6`、`antd >=5`。
- **`createPactorApplication(options)`**：
  - options：`appId`、`api`（`baseURL` 走 HttpDslResourceLoader，或注入自定义 `DslResourceLoader`——本地/测试用 StaticDslLoader）、`layout`（覆盖 bootstrap 布局类型）、`components` / `actions` / `services` / `capabilities`（业务扩展，第 87 节）、`authTokenProvider?`（注入 HTTP 头）。
  - 启动编排：loadBootstrap → PermissionStore.setPermissions → MenuRegistry(bootstrap.menus) → resolveLayout → 共享 registries（内置组件 + 业务组件、内置动作 + 交互动作 + 业务动作、服务）→ 创建 RouterAdapter/HttpAdapter/PermissionAdapter。
  - 返回 app 实例：`mount(selector)`（createRoot 渲染）、`unmount()`、`registerComponent` / `registerAction` / `registerService` / `registerCapability`（第 87 节扩展 API）。
- **React 组合层**（Application 组件）：
  - react-router `<Routes><Route path="*" /></Routes>` + pactor-router 的 DynamicDslRoute：命中 → 加载 pageId（loading 态）→ createPageRuntime → PageRuntimeView；未命中 404、无权限 403。
  - 布局包裹：bootstrap/options 的 layout type 经 LayoutRegistry 解析；admin 布局传 brand/registry/bridge/route。
  - 交互层：InteractionProvider + OverlayHost（resolvePage 接 loader）；ErrorBoundary 包裹页面渲染（渲染错误显示受控错误页而非白屏）。
  - PageRuntime 创建时注入：共享 components/actions/services registries、permission adapter、router adapter、http adapter、route context（params/query）。
- 端到端测试：StaticDslLoader 提供 bootstrap + 页面 DSL，验证完整链路（菜单渲染 → 导航 → 页面渲染 → 表达式 → 事件动作 → overlay）。
- 文档站新增 pactor-app 模块页。

## Capabilities

### New Capabilities

- `application-bootstrap`: createPactorApplication 启动编排、共享 registries/adapters 组装、扩展注册 API、mount/unmount。
- `application-shell`: React 组合——动态路由 + 布局 + 页面加载（loading/error）+ ErrorBoundary + Overlay/Provider 集成。

### Modified Capabilities

（无。）

## Impact

- **新增代码**：`packages/app`；不修改既有包。
- **V1 范围裁剪**：登录流程与 `auth.login` 动作（仅提供 authTokenProvider 注入）、Theme、i18n、telemetry/audit（第 82/97 节）、灰度多租户。
- **API 命名**：设计文档示例中的 `createDslApplication` 随框架定名改为 `createPactorApplication`（文档站示例同步更新；设计文档示例后续统一替换）。
- **后续模块**：pactor-markdown / pactor-chat。
