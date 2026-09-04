# Delta: dsl-renderer

## ADDED Requirements

### Requirement: 动态 DSL 引用解析（DslSourceResolver）

RuntimeContext SHALL 提供 `dslSources` 解析器：按 `DslSourceRef.source.type` 分派——`service` 经 ServiceRegistry 调用、`http` 经 HttpAdapter 请求；`params` 中的表达式字符串按**首次解析时**的作用域求值一次（不做联动重载）。解析结果 MUST 按引用原文（`source` 字段）缓存于页面运行时生命周期内：同一引用的多次渲染只请求一次；Promise 级去重（并发渲染同一引用共享一次请求）。加载到的内容 MUST 先经 Schema 校验（节点/节点数组），校验失败按解析失败处理。

#### Scenario: 同一引用只请求一次

- **WHEN** 页面两处渲染同一个 service 引用
- **THEN** 服务仅被调用一次，两处共享结果

#### Scenario: 表达式参数按首次作用域求值

- **WHEN** 引用 `params` 含 `${route.params.id}`，页面加载后 state 再变化
- **THEN** 请求参数保持首次求值结果，不自动重拉

### Requirement: 动态引用渲染边界（DslSourceBoundary）

Renderer MUST 对 `children` / 命名组件位置的 `DslSourceRef` 渲染内部边界组件（非 DSL 组件类型）：解析中渲染 `placeholder` 子树（缺省为空）；成功后按位置语义渲染结果（children 位置为 DslNode[] 逐个渲染、命名组件位置为 DslNode 子树）；失败时输出告警并渲染空，MUST NOT 抛错击穿渲染层。

#### Scenario: 解析中渲染占位

- **WHEN** 引用声明了 `placeholder` 且解析尚未完成
- **THEN** 该位置渲染 placeholder 子树

#### Scenario: 成功后渲染远端子树

- **WHEN** service 引用返回合法 DslNode 数组
- **THEN** 该位置按序渲染返回的节点，且节点内表达式以引用处作用域求值

#### Scenario: 失败降级为空

- **WHEN** 引用请求失败或返回内容未通过 Schema 校验
- **THEN** 渲染为空并输出告警，页面其余部分正常渲染

## MODIFIED Requirements

### Requirement: children 递归渲染

节点的 `children` MUST 按声明顺序递归渲染；`children` 为 `DslSourceRef` 时按"动态引用渲染边界"语义异步解析渲染。

#### Scenario: 嵌套 children 顺序渲染

- **WHEN** 节点含两个 children
- **THEN** 两者按声明顺序出现在父组件中

#### Scenario: children 为动态引用

- **WHEN** 节点 `children` 为 `{ source: { type: 'service', service: 'dsl.items' } }`
- **THEN** 该位置异步加载并渲染远端返回的子树

### Requirement: 命名组件引用（component 字段）

Renderer SHALL 支持引用节点（DslNode 的 `component` 字段，与 `type` 二选一）：按 key 从 RuntimeContext `pageComponents`（PageDsl `components`）取子树并以引用处作用域渲染（`${row}` 等局部作用域原样可用）；定义值可为 `DslNode`（同步渲染）或 `DslSourceRef`（按"动态引用渲染边界"语义惰性解析，缓存于页面运行时）。引用处 `props` / `events` MUST 覆盖定义处同名字段，`when` / `permission` 引用处优先（动态形态下覆盖在解析成功后的子树上生效）。key 未定义时 MUST 渲染 Unsupported 占位而不抛错；直接/间接循环引用 MUST 经引用链守卫，命中时不渲染并告警。

#### Scenario: 按 key 引用页面级组件

- **WHEN** PageDsl `components.searchForm` 定义 Form 子树，body 中 `{ component: 'searchForm' }`
- **THEN** 该位置渲染 searchForm 子树，表达式以引用处作用域求值

#### Scenario: 引用动态加载的命名组件

- **WHEN** `components.detail` 为 `{ source: { type: 'http', request: { url: '/api/dsl/detail' } } }`，body 中 `{ component: 'detail' }`
- **THEN** 首次渲染触发加载，成功后渲染远端子树

#### Scenario: 循环引用守卫

- **WHEN** `components.a` 引用 `b`、`b` 引用 `a`
- **THEN** 渲染不崩溃，循环命中处不渲染并输出告警
