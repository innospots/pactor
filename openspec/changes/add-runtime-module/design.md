# Design: add-runtime-module

## Context

pactor-core / pactor-schema / pactor-expression 已提供协议类型、Schema 校验和受控表达式。本变更实现 `pactor-runtime`：把 PageDsl 运行起来的引擎层 + React Renderer。对应设计文档第 15（Runtime Context）、17（Action Engine）、18（Service Registry）、19（DataSource）、20（生命周期）、21（条件/循环/Scope）、89（页面加载链路）节。

约束：

- Registry 模式：Component / Action / Service 均通过 Registry（复用 pactor-core `Registry<T>`）。
- 表达式一律经 pactor-expression 求值，禁止 eval。
- 动作能力边界：`navigate` / `message` / `confirm` / `overlay.*` 依赖上层模块，本包只定义适配接口，不实现。
- React >= 18 为 peer dependency；非 React 部分（context/state/datasource/action）必须可脱离 React 单独测试。

## Goals / Non-Goals

**Goals:**

- RuntimeContext 组装 + StateStore（框架无关）。
- DataSource 运行时：static / service / http，autoLoad，loading/error/data，refresh。
- Action 引擎 + 8 个 UI 无关内置动作。
- React Renderer：表达式 props、when、events、子作用域、UnsupportedComponent。
- PageRuntime 完整链路 + 生命周期编排。
- 非 React 部分零 React 依赖，可纯 Node 测试。

**Non-Goals:**

- 不实现具体组件（pactor-components）、权限实现（pactor-permission）、路由（pactor-router）、Overlay（pactor-interaction）。
- 不实现 `computed` / `resource` 类型 DataSource、分页、缓存、重试、取消（留待 pactor-resource 或后续迭代）。
- 不做 Fragment、Chat、SSR。

## Decisions

### D1: StateStore 手写最小实现，不引 Zustand

- 设计文档第 8 节允许"内部 Store 或 Zustand"。StateStore 需求很小（get/set/reset/subscribe + 按路径读取），手写约百行、零依赖。
- React 侧通过 `useSyncExternalStore` 订阅，避免额外状态库。
- API：`getState()` / `get(path)` / `set(patch | path, value)` / `reset()` / `subscribe(listener)`。`get` 支持 `'a.b.c'` 路径；`set` 支持对象合并或 `set('a.b', v)` 路径写入。

### D2: RuntimeContext 为普通对象 + React Context 透传

- `RuntimeContext` 是普通 TS 对象（设计文档第 15 节结构）：`app` / `page` / `state` / `data` / `route` / `user` / `services` / `components` / `actions` / `permission` / `capabilities`。
- 非 React 代码直接持有该对象；Renderer 通过 React Context 获取。`createRuntimeContext(options)` 工厂创建。
- **作用域组装**：求值时把 context 拍平成表达式作用域 `{ state, data, form, route, user, params, ... }` + 局部作用域（`row` / `rowIndex` / `event` / `item`）。局部作用域覆盖同名全局键。
- `permission`、`route.navigate` 等为**适配接口**（`PermissionAdapter` / `RouterAdapter`），默认空实现（permission 默认放行、navigate 默认 no-op 并告警），由 pactor-permission / pactor-router 提供真实现。

### D3: DataSource 运行时按类型分派，状态独立订阅

- 每个 DataSource 实例维护 `{ loading, error, data }`，DataStore 提供 `get(name)` / `getData(name)` / `getStatus(name)` / `subscribe` / `refresh(name)` / `reload(name)`。
- `static`：直接取 `value`；`service`：经 ServiceRegistry 调用 `service` 名（如 `customer.list`）；`http`：经 `HttpAdapter`（默认基于全局 fetch 的适配器，可替换，便于测试与统一认证）。
- params 在每次加载前用当前作用域求值（`${state.keyword}` 等）。
- `autoLoad: true` 在 PageRuntime 初始化阶段触发。
- 错误不抛出到渲染层：写入 `error` 状态，组件自行展示（对应第 80 节错误处理规范的运行时部分）。

### D4: Action 引擎：Registry + 编排，condition/permission 前置拦截

- `ActionHandler = (action: ActionConfig, ctx: ActionContext) => Promise<ActionResult>`；`ActionResult = { ok: boolean; data?: unknown; error?: Error }`。
- 执行流程：解析 `condition`（表达式，false 则跳过并返回 `{ ok: true, skipped: true }`）→ 检查 `permission`（经 PermissionAdapter，拒绝则返回 `{ ok: false }`）→ 查 ActionRegistry 执行。未注册动作返回受控失败，不抛到 UI。
- 内置动作：
  - `setState`（params 合并进 state，值支持表达式）
  - `resetState`
  - `reload`（params.dataSource 指定数据源名，缺省 reload 全部 autoLoad 源）
  - `request`（经 HttpAdapter 发请求，结果写入 params.target 指定的 state 路径）
  - `sequence`（params.actions 数组，串行，任一失败则中断）
  - `parallel`（params.actions 数组，Promise.all 并行）
  - `if`（params.condition / then / else）
  - `delay`（params.ms）
- `events` 挂载的 Action 数组默认串行执行。

### D5: React Renderer：函数式递归渲染 + 深度 props 解析

- `renderNode(node, scope)`：查 ComponentRegistry → 无则渲染 `UnsupportedComponent`（显示类型名，dev 友好）；`when` 为 false 返回 null。
- **深度 props 解析**：props 对象递归遍历，字符串经 pactor-expression `resolveTemplate`；数组/对象递归；非字符串原样保留。key 为 `on*` 且值是字符串时不按表达式处理（避免误解析事件回调——DSL 事件统一走 `events` 字段，props 里的 `on*` 保留给组件内部约定，本版本直接原样传递）。
- **events 绑定**：`events.onClick` → `props.onClick = (event) => dispatch(actions, { event })`，事件对象放入 `event` 作用域。Action 数组串行。
- **子作用域**：注册组件时可声明 `withScope`，渲染 children 时注入额外作用域（如 Table 行渲染注入 `row` / `rowIndex`）。Renderer 提供 `renderChildren(children, extraScope)` 经 React Context 传给组件。
- React 订阅：`useRuntimeState(path?)` / `useDataSource(name)` hooks 基于 `useSyncExternalStore`，保证表达式引用的 state/data 变化时重渲染。简化策略：Renderer 根节点订阅整个 StateStore/DataStore，任一变化重渲染整棵 DSL 树（V1 页面规模下可接受；精细化订阅留待性能优化，见第 96 节）。

### D6: PageRuntime 编排

`createPageRuntime(pageDsl, options)`：
1. `validatePageDsl` 校验，失败抛 `PageRuntimeError`（含结构化错误列表）。
2. `createRuntimeContext`（含 page.meta、初始 state、registries、adapters）。
3. 初始化 DataSources，`autoLoad` 的触发加载。
4. 生命周期：onInit（同步创建后）→ onLoad（首次加载）→ onReady / onShow / onHide / onDestroy 由 PageRuntime 暴露方法供宿主（Router）调用。
5. 暴露 `render()`（返回 React 元素）与 React 组件 `<PageRuntimeView runtime={...} />`。

### D7: 包结构与依赖

- 目录 `packages/runtime`，包名 `pactor-runtime`。
- dependencies：`pactor-core` / `pactor-schema` / `pactor-expression`（workspace:*）；peerDependencies：`react >= 18`。
- devDependencies：react、react-dom、@types/react、@types/react-dom、@testing-library/react、jsdom。vitest 配置 `environment: 'jsdom'`（仅渲染测试需要，其余文件用 node 环境注释或默认）。
- 源码分层：`context/`（context、state、scope）、`datasource/`、`action/`、`renderer/`（React）、`page/`、`index.ts`。renderer 之外不 import react。

## Risks / Trade-offs

- [根节点整树重渲染在复杂页面可能有性能问题] → V1 接受；StateStore 的 subscribe 已支持按路径过滤的精细化演进（第 96 节性能设计留待后续）。
- [Adapter 接口设计需预判上层模块需求] → 接口保持最小（permission.check、router.navigate、http.request），上层落地时按需扩展，允许向后兼容地加字段。
- [深度 props 解析对大型 props 树有遍历开销] → 无表达式字符串快速路径（`hasExpression` 判断）；结果不做缓存（作用域随 state 变化，缓存易错）。
- [React 19 与 peer 范围] → peerDependencies 写 `>=18`，覆盖 18/19。

## Migration Plan

无（全新包）。落地顺序：context/state → datasource → action → renderer → page runtime，每层测试通过后进入下一层。

## Open Questions

- `Repeat` / 循环组件归 pactor-components（作为普通注册组件，依赖 Renderer 的子作用域机制），本包只保证机制可用。
- DataSource 的 cache / retry / cancel / pagination 在 pactor-resource 或本包后续迭代补齐，本版接口预留 `refresh(name)`。
