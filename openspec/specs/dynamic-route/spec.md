# Spec: dynamic-route

## Purpose

导航桥接与动态路由（`@pactor-app/router`）：NavigationBridge 抽象、runtime RouterAdapter 桥接、React Router 绑定与路由守卫。


## Requirements

### Requirement: NavigationBridge 抽象与 Memory 实现

SHALL 定义 `NavigationBridge`（`getLocation` / `push` / `replace` / `subscribe`）。`MemoryNavigation` MUST 为零依赖实现：维护当前 location（pathname + search），push 追加历史、replace 替换当前，subscribe 在变化时通知（返回退订函数），支持 back 语义的历史栈（V1 至少保证 push/replace 正确）。

#### Scenario: push 与通知

- **WHEN** 订阅后 push('/customers?tab=risk')
- **THEN** listener 收到新 location，getLocation() 返回该 pathname 与 search

#### Scenario: replace 与退订

- **WHEN** replace('/x') 后退订再 push('/y')
- **THEN** 退订后 listener 不再被调用

### Requirement: runtime RouterAdapter 桥接

`createRouterAdapter(bridge)` SHALL 返回结构化兼容 @pactor-app/runtime `RouterAdapter` 的对象：`navigate(to)` 调用 `bridge.push(to)`。

#### Scenario: DSL navigate 动作驱动路由

- **WHEN** 以该 adapter 注入 runtime 并执行 navigate 动作
- **THEN** MemoryNavigation 的 location 变为目标路径

### Requirement: React Router 绑定

子入口 `@pactor-app/router/react` SHALL 提供 `<DynamicDslRoute>` 组件与 `useReactRouterBridge()`：组件接受 `registry`、`render({ pageId, route })`、可选 `fallback`（未命中 404）、`forbidden`（无权限 403）、`permissionChecker`；useLocation 变化时重新解析。核心入口 MUST NOT import react 或 react-router-dom。

#### Scenario: 命中渲染页面

- **WHEN** 当前路径命中菜单 pageId 为 customer-list 的页
- **THEN** render 被以 `{ pageId: 'customer-list', route }` 调用并渲染其结果

#### Scenario: 未命中渲染 404

- **WHEN** 当前路径未注册
- **THEN** 渲染 fallback 内容

#### Scenario: 无权限渲染 403

- **WHEN** 命中页配置 permission 且 checker 判定无权限
- **THEN** 渲染 forbidden 内容，不调用 render

#### Scenario: 核心入口无 React 依赖

- **WHEN** 静态检查构建产物核心入口
- **THEN** 不含 react / react-router-dom 引用

### Requirement: 导航后 route 作用域可用

桥接后经 runtime 解析当前路由，DSL 中 `${route.params.id}` 与 `${route.query.tab}` MUST 可求值（与 runtime 的 route 上下文结构对齐）。

#### Scenario: route context 传入 runtime

- **WHEN** 路径为 `/customers/123?tab=risk` 并把 resolveRoute 结果注入 runtime context 的 route
- **THEN** 求值 `${route.params.id}` 为 '123'，`${route.query.tab}` 为 'risk'
