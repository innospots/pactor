# Delta: dsl-schema-validation

## ADDED Requirements

### Requirement: DslSourceRef Schema 与引用位置校验

模块 SHALL 提供 `DslSourceRef` 的 JSON Schema：`source` 必填且为二选一形态（`{ type: 'service', service: 非空字符串, params? }` 或 `{ type: 'http', request: { url: 非空字符串, method?, params?, headers? } }`），`placeholder` 为可选 DslNode。下列位置 MUST 接受该引用形态：

- 组件节点的 `children`（`DslNode[]` 或 `DslSourceRef` 二选一）
- Page DSL 根级 `children`（`DslNode[]` 或 `DslSourceRef` 二选一）
- Page DSL `components` 的值（`DslNode` 或 `DslSourceRef` 二选一）

模块 SHALL 导出 `validateDslNode(value)` 与 `validateDslNodes(value)` 便利函数，返回与 `validatePageDsl` 相同的结构化错误列表，供运行时校验远端加载的 DSL 内容。

#### Scenario: 节点 children 为引用形态通过校验

- **WHEN** 组件节点 `children` 为 `{ source: { type: 'service', service: 'dsl.menus' } }`
- **THEN** 校验通过

#### Scenario: 引用形态缺少必填字段不通过

- **WHEN** 引用为 `{ source: { type: 'http' } }`（缺 `request.url`）
- **THEN** 校验失败，错误路径定位到对应字段

#### Scenario: components 值为引用形态通过校验

- **WHEN** `components.detail` 为 `{ source: { type: 'http', request: { url: '/api/dsl/detail' } } }`
- **THEN** 校验通过

#### Scenario: validateDslNode 校验远端内容

- **WHEN** 对远端返回的非法节点对象（缺 `type`）调用 `validateDslNode`
- **THEN** 返回含 `/type` 路径的结构化错误

## MODIFIED Requirements

### Requirement: DslNode 递归 Schema

模块 SHALL 提供 DslNode 的 JSON Schema，支持 `children` 递归嵌套（`DslNode[]` 或 `DslSourceRef`）、`events`（Action 配置或其数组）、`permission`、`when`、`props` 任意属性。

#### Scenario: 深层嵌套节点校验

- **WHEN** 校验包含多层嵌套 children 且带 events/when/permission 的 body 节点树
- **THEN** 校验通过

#### Scenario: 节点缺少 type 不通过

- **WHEN** 校验 children 中某个缺少 `type` 字段的节点
- **THEN** 校验失败，错误路径定位到该节点

#### Scenario: 节点 children 为引用形态

- **WHEN** 某节点 `children` 为合法 `DslSourceRef`
- **THEN** 校验通过
