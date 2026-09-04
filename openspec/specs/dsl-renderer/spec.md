# Spec: dsl-renderer

React Renderer：把 DslNode 树渲染为 React 元素——Registry 查找、表达式 props、when 条件、events 绑定、子作用域（`@pactor-app/runtime`）。

### Requirement: 基于 Registry 的组件解析

Renderer SHALL 通过 RuntimeContext 的 ComponentRegistry 解析 `node.type` 对应组件。未注册类型 MUST 渲染 `UnsupportedComponent` 占位（展示类型名），MUST NOT 抛错或渲染空白。Renderer 实现中 MUST NOT 出现按类型名硬编码的组件分支。

#### Scenario: 渲染已注册组件

- **WHEN** Registry 注册了 `Button`，渲染 `{ type: 'Button', props: { text: '保存' } }`
- **THEN** 页面中出现 Button 组件且收到 `text: '保存'`

#### Scenario: 未注册组件占位

- **WHEN** 渲染 `{ type: 'Ghost' }` 且未注册
- **THEN** 渲染 UnsupportedComponent 占位，内容包含 `Ghost`

### Requirement: props 深度表达式解析

Renderer SHALL 递归解析 props：字符串经表达式模板求值（整体单表达式保留原始类型），对象/数组递归处理，非字符串原样保留。求值作用域 MUST 包含当前 state / data 及局部作用域。

#### Scenario: 表达式 props 求值

- **WHEN** state.count 为 42，渲染 props `{ text: '共 ${state.count} 条', count: '${state.count}' }`
- **THEN** 组件收到 `text: '共 42 条'`（string）与 `count: 42`（number）

#### Scenario: state 变化触发重渲染

- **WHEN** 渲染后通过 setState 动作修改被表达式引用的 state
- **THEN** 组件以新的 props 重新渲染

### Requirement: when 条件渲染

节点配置 `when` 且求值为 false 时 MUST 渲染 null（不渲染该节点及其子树）。

#### Scenario: when 为 false 不渲染

- **WHEN** 节点 `when: "${state.visible}"` 且 state.visible 为 false
- **THEN** 该组件不出现在渲染结果中

### Requirement: 节点权限处理

Renderer 在渲染节点前 SHALL 检查 `node.permission`：无权限时按 `denied` 策略处理——`hidden`（默认）MUST 渲染 null；`disabled` MUST 向组件注入 `disabled: true`（优先于 DSL props 中的同名字段）；`readonly` MUST 注入 `readOnly: true`。默认 PermissionAdapter MUST 放行所有权限码。

#### Scenario: 无权限默认隐藏

- **WHEN** 节点配置 `permission: 'customer:edit'`，PermissionAdapter 对该权限码返回 false，且未指定 denied 策略
- **THEN** 该节点渲染为 null，不渲染其子树

#### Scenario: denied 为 disabled 注入禁用态

- **WHEN** 节点配置 `permission: { code: 'customer:edit', denied: 'disabled' }` 且无权限，DSL props 中同时存在 `disabled: false`
- **THEN** 组件正常渲染且收到 `disabled: true`（覆盖 DSL props）

#### Scenario: denied 为 readonly 注入只读态

- **WHEN** 节点配置 `permission: { code: 'customer:edit', denied: 'readonly' }` 且无权限
- **THEN** 组件正常渲染且收到 `readOnly: true`

### Requirement: events 绑定

`events` 中的每个事件 MUST 绑定为组件的同名 prop（如 `onClick`），触发时按 Action 引擎执行对应动作，事件对象 MUST 放入 `event` 作用域供动作参数表达式使用。

#### Scenario: 点击触发动作并携带 event

- **WHEN** 节点配置 `events.onClick: { action: 'setState', params: { last: '${event.type}' } }`，组件触发 onClick 并传入 `{ type: 'click' }`
- **THEN** state.last 为 `'click'`

### Requirement: 子作用域扩展

Renderer SHALL 支持组件在渲染 children 时注入局部作用域（如 Table 注入 `row` / `rowIndex`，Repeat 注入 `item`）。局部作用域 MUST 覆盖同名全局键，且仅作用于该子树。

#### Scenario: 行作用域注入

- **WHEN** 注册组件以 `renderChildren(children, { row: record, rowIndex: 0 })` 渲染子节点，子节点 props 引用 `${row.name}`
- **THEN** 子组件收到该行 record 的 name

### Requirement: children 递归渲染

节点的 `children` MUST 按声明顺序递归渲染。

#### Scenario: 嵌套 children 顺序渲染

- **WHEN** 节点含两个 children
- **THEN** 两者按声明顺序出现在父组件中

### Requirement: 命名组件引用（component 字段）

Renderer SHALL 支持引用节点（DslNode 的 `component` 字段，与 `type` 二选一）：按 key 从 RuntimeContext `pageComponents`（PageDsl `components`）取 DslNode 子树并以引用处作用域渲染（`${row}` 等局部作用域原样可用）；引用处 `props` / `events` MUST 覆盖定义处同名字段，`when` / `permission` 引用处优先。key 未定义时 MUST 渲染 Unsupported 占位而不抛错；直接/间接循环引用 MUST 经引用链守卫，命中时不渲染并告警。

#### Scenario: 按 key 引用页面级组件

- **WHEN** PageDsl `components.searchForm` 定义 Form 子树，body 中 `{ component: 'searchForm' }`
- **THEN** 该位置渲染 searchForm 子树，表达式以引用处作用域求值

#### Scenario: 循环引用守卫

- **WHEN** `components.a` 引用 `b`、`b` 引用 `a`
- **THEN** 渲染不崩溃，循环命中处不渲染并输出告警
