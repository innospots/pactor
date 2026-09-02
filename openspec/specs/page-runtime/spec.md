# Spec: page-runtime

PageRuntime：PageDsl 从校验到渲染的完整运行链路与生命周期编排（`@pactor/runtime`）。

### Requirement: PageDsl 加载校验

`createPageRuntime(pageDsl, options)` MUST 先经 @pactor/schema 校验；校验失败 MUST 抛出包含结构化错误列表的 `PageRuntimeError`，不进入后续初始化。

#### Scenario: 非法 DSL 抛 PageRuntimeError

- **WHEN** 以缺少 `page.id` 的 DSL 创建 PageRuntime
- **THEN** 抛出 PageRuntimeError，错误中包含 `/page/id` 路径信息

#### Scenario: 合法 DSL 创建成功

- **WHEN** 以合法 PageDsl 创建
- **THEN** 返回 PageRuntime 实例，可访问其 RuntimeContext

### Requirement: 初始化链路

创建 PageRuntime MUST 依次完成：创建 RuntimeContext（page meta + 初始 state + registries/adapters）→ 初始化 dataSources → 触发 autoLoad 数据源 → 执行 onInit 生命周期动作。

#### Scenario: 完整初始化

- **WHEN** PageDsl 含初始 state、`autoLoad: true` 的数据源与 onInit 动作
- **THEN** 创建后 state 已初始化、数据源已触发加载、onInit 动作已执行

### Requirement: 生命周期编排

PageRuntime SHALL 支持设计文档第 20 节的生命周期：`onInit`（创建后）、`onLoad`（首次加载）、`onReady` / `onShow` / `onHide` / `onDestroy`，并暴露相应方法供宿主（Router）触发；`onDestroy` MUST 清理订阅防止泄漏。

#### Scenario: 生命周期动作按序执行

- **WHEN** PageDsl 配置 onInit 与 onLoad 动作
- **THEN** 两者按 init → load 顺序各执行一次

#### Scenario: destroy 清理

- **WHEN** 调用 PageRuntime 的 destroy
- **THEN** 执行 onDestroy 动作，且内部订阅被清理

### Requirement: 渲染入口

PageRuntime SHALL 提供渲染入口（`render()` 或 `<PageRuntimeView />` 组件），把 `body` 子树交给 Renderer 渲染；未配置 `body` 时 MUST 渲染空内容而非报错。

#### Scenario: 渲染 body

- **WHEN** body 为含已注册组件的节点树
- **THEN** 渲染入口输出对应 React 树

#### Scenario: 无 body

- **WHEN** PageDsl 无 body 字段
- **THEN** 渲染为空，不抛错
