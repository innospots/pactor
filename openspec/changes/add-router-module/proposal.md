# Proposal: add-router-module

## Why

设计文档第 28–32 节定义了"Menu → Route → pageId → Page Runtime"的动态导航模型：菜单不绑定 React 组件，而是声明 `path` + `pageId`，由 Dynamic Router 把 URL 解析为 pageId 与 route context（params/query）。pactor-runtime 已预留 `RouterAdapter`（navigate）与 `route` 作用域（`${route.params.id}`），但还没有实现。本变更落地 `pactor-router`。

## What Changes

- 新增 `pactor-router` 包（`packages/router`）。
- **Menu Model 与 MenuRegistry**（第 30 节）：`MenuItem` 类型（group/page/link、hidden、activeMenu、order、children 等）；`MenuRegistry` 由菜单树构建，`findByPath(pathname)`（含路径参数模式匹配）、`findById`、`list()`（排序）。
- **PathMatcher**（第 31/32 节）：`/customers/:id/edit` 模式编译、params 提取、query 解析，构建 RouteContext `{ path, params, query, pageId?, menuId?, activeMenu? }`。
- **导航桥接**：`NavigationBridge` 接口（push/replace/getLocation/subscribe）+ `MemoryNavigation` 实现（无浏览器依赖，可测试）；`createRouterAdapter(bridge, registry)` 实现 pactor-runtime 的 `RouterAdapter`（navigate）。
- **React 绑定**（可选入口 `pactor-router/react`）：与 React Router 集成的 `<DynamicDslRoute>` 组件——`useLocation` → registry.findByPath → 未命中渲染 NotFound，命中渲染传入的页面组件（pageId + route context 经 props/render prop 传出）；React Router 版 NavigationBridge。
- 权限集成：复用 pactor-permission 的 `checkPagePermission` 做路由守卫辅助（未授权路由返回 403 语义）。
- 单元测试（React 绑定用 jsdom + Testing Library）。
- 文档站新增 pactor-router 模块页。

## Capabilities

### New Capabilities

- `menu-registry`: MenuItem 模型、菜单树注册、按路径/ID 查找（含隐藏页与 activeMenu）。
- `path-matcher`: 路径模式编译、params 提取、query 解析、RouteContext 构建。
- `dynamic-route`: NavigationBridge 抽象与 Memory 实现、runtime RouterAdapter 桥接、React Router 绑定与路由守卫。

### Modified Capabilities

（无。）

## Impact

- **新增代码**：`packages/router`。dependencies：`pactor-core`、`pactor-permission`（workspace:*）；peerDependencies：`react >=18`、`react-router-dom >=6`（仅 react 子入口需要）。
- **不修改**既有包；与 pactor-runtime 为结构化兼容（devDep 类型断言），与 pactor-resource 的串联（pageId → loadPage → PageRuntime）由后续 pactor-app 完成。
- **后续模块**：pactor-layout（消费菜单与当前路由）、pactor-app（组合 bootstrap → menu → router → loader → runtime）。
