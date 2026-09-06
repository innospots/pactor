# Delta: dsl-renderer

## MODIFIED Requirements

### Requirement: 动态引用渲染边界（DslSourceBoundary）

Renderer MUST 对 `children` / 命名组件位置的 `DslSourceRef` 渲染内部边界组件（非 DSL 组件类型）——包括 children **数组中混排的引用元素**（逐元素独立边界）：解析中渲染 `placeholder` 子树（缺省为空）；成功后按位置语义渲染结果（children 位置为 DslNode[] 逐个渲染、命名组件位置为 DslNode 子树）；失败时输出告警并渲染空，MUST NOT 抛错击穿渲染层。数组混排时各引用项独立解析，渲染顺序与声明顺序一致，互不影响。

#### Scenario: 解析中渲染占位

- **WHEN** 引用声明了 `placeholder` 且解析尚未完成
- **THEN** 该位置渲染 placeholder 子树

#### Scenario: 成功后渲染远端子树

- **WHEN** service 引用返回合法 DslNode 数组
- **THEN** 该位置按序渲染返回的节点，且节点内表达式以引用处作用域求值

#### Scenario: 失败降级为空

- **WHEN** 引用请求失败或返回内容未通过 Schema 校验
- **THEN** 渲染为空并输出告警，页面其余部分正常渲染

#### Scenario: children 数组混排渲染

- **WHEN** 节点 children 为 `[内联节点A, 引用X, 内联节点B]`，X 解析成功
- **THEN** A、X 的远端子树、B 按声明顺序渲染

#### Scenario: 混排数组中单个引用失败不影响其他元素

- **WHEN** 混排数组中引用 X 解析失败、引用 Y 与内联节点正常
- **THEN** X 位置渲染空并告警，Y 与内联节点正常渲染

### Requirement: children 递归渲染

节点的 `children` MUST 按声明顺序递归渲染；`children` 为整体 `DslSourceRef` 或数组中含引用元素时按"动态引用渲染边界"语义异步解析渲染。

#### Scenario: 嵌套 children 顺序渲染

- **WHEN** 节点含两个 children
- **THEN** 两者按声明顺序出现在父组件中

#### Scenario: children 为动态引用

- **WHEN** 节点 `children` 为 `{ source: { type: 'service', service: 'dsl.items' } }`
- **THEN** 该位置异步加载并渲染远端返回的子树

#### Scenario: children 数组混排节点与引用

- **WHEN** 节点 `children` 数组同时含内联节点与引用元素
- **THEN** 内联节点同步渲染，引用元素异步解析渲染，整体顺序与声明一致
