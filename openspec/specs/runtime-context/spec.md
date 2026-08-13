# Spec: runtime-context

RuntimeContext 组装、StateStore、表达式作用域构建与 Service Registry（`pactor-runtime` 的非 React 基础层）。

### Requirement: RuntimeContext 组装

模块 SHALL 提供 `createRuntimeContext(options)` 工厂，创建符合设计文档第 15 节结构的 RuntimeContext：`app`、`page`、`state`（StateStore）、`data`（DataStore）、`route`、`user`、`services`（ServiceRegistry）、`components`（ComponentRegistry）、`actions`（ActionRegistry）、`permission`、`capabilities`、`locale`、`i18n`。

#### Scenario: 创建默认上下文

- **WHEN** 调用方以最少的 options（如 page meta）创建上下文
- **THEN** 返回包含全部标准字段的 RuntimeContext，registries 为空 Registry 实例，adapters 为默认空实现，`locale` 为默认语言（如 `'zh-CN'`），`i18n` 为默认空实现

#### Scenario: 注入自定义 Registry 与 Adapter

- **WHEN** 调用方传入自定义 components/actions/services registry 或 permission/router/http adapter
- **THEN** 上下文使用注入的实例

#### Scenario: 注入 i18n 配置

- **WHEN** 调用方传入 `locale` 与 `messages` 创建上下文
- **THEN** 上下文 `locale` 为传入值，`i18n.t()` 可根据 messages 翻译

### Requirement: StateStore

StateStore SHALL 提供 `getState()`、`get(path)`（支持 `'a.b.c'` 点路径）、`set(patch)`（对象合并）与 `set(path, value)`（路径写入）、`reset()`（恢复初始值）、`subscribe(listener)`（返回退订函数）。MUST 不依赖 React。

#### Scenario: 路径读取与写入

- **WHEN** 初始 state 为 `{ user: { name: 'Alice' } }`，调用 `set('user.name', 'Bob')`
- **THEN** `get('user.name')` 返回 `'Bob'`，`getState().user.name` 为 `'Bob'`

#### Scenario: 对象合并

- **WHEN** state 为 `{ a: 1, b: 2 }`，调用 `set({ b: 3 })`
- **THEN** `getState()` 为 `{ a: 1, b: 3 }`

#### Scenario: 订阅与退订

- **WHEN** 订阅后调用 `set`，listener 被调用；退订后再次 `set`
- **THEN** 退订后 listener 不再被调用

#### Scenario: reset 恢复初始值

- **WHEN** 修改 state 后调用 `reset()`
- **THEN** `getState()` 恢复为创建时的初始值

### Requirement: 表达式作用域构建

模块 SHALL 提供把 RuntimeContext + 局部作用域组装为表达式求值作用域的能力：`state` 取自 StateStore 当前值，`data` 取自 DataStore 各数据源当前数据，另含 `route`、`user`、`app`、`page`、`params` 等；局部作用域（如 `row`、`rowIndex`、`event`、`item`）MUST 覆盖同名全局键。

#### Scenario: 作用域包含 state 与 data 当前值

- **WHEN** state 为 `{ keyword: 'x' }` 且数据源 `users` 已加载数据，构建作用域
- **THEN** 作用域中 `state.keyword === 'x'`，`data.users` 为已加载数据

#### Scenario: 局部作用域覆盖全局

- **WHEN** 以局部作用域 `{ row: {...}, state: 局部值 }` 构建作用域
- **THEN** 结果中 `row` 存在，且局部 `state` 覆盖全局 `state`

### Requirement: Service Registry 与适配接口

模块 SHALL 基于 pactor-core `Registry<T>` 提供 ServiceRegistry（service 名为键，如 `customer.list`），并定义 `PermissionAdapter`（`check(permission): boolean`）、`RouterAdapter`（`navigate(to)`）、`HttpAdapter`（`request(config): Promise<unknown>`）接口。默认 PermissionAdapter MUST 放行，默认 RouterAdapter MUST 为 no-op。

#### Scenario: 注册并解析服务

- **WHEN** 注册 `customer.list` 服务函数后通过 ServiceRegistry 获取
- **THEN** 返回该服务函数

#### Scenario: 默认权限适配器放行

- **WHEN** 使用默认 PermissionAdapter 检查任意权限码
- **THEN** 返回 `true`
