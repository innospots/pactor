# Delta: dsl-core-protocol

## ADDED Requirements

### Requirement: DslSourceRef 动态引用类型

模块 SHALL 定义 `DslSourceRef` 类型：`{ source, placeholder? }`，其中 `source` 为二选一形态——`{ type: 'service', service: string, params?: Record<string, unknown> }`（经 ServiceRegistry 调用）或 `{ type: 'http', request: { method?, url, params?, headers? } }`（经 HttpAdapter 请求）；`placeholder` 为可选 DslNode，解析期间渲染。`params` 中值可含表达式字符串（按首次解析时作用域求值一次）。

#### Scenario: service 形态类型检查

- **WHEN** 声明 `{ source: { type: 'service', service: 'dsl.detailSection' } }`
- **THEN** TypeScript 编译通过

#### Scenario: http 形态类型检查

- **WHEN** 声明 `{ source: { type: 'http', request: { url: '/api/dsl/banner' } }, placeholder: { type: 'Alert' } }`
- **THEN** TypeScript 编译通过

## MODIFIED Requirements

### Requirement: DslNode 核心节点类型

模块 SHALL 定义 `DslNode` 接口作为 UI DSL 树的基础节点，包含可选 `id`、必填 `type`、可选 `props`、可选 `children`（递归 `DslNode[]`，或 `DslSourceRef` 动态引用——远端加载 DslNode[] 子树）、可选 `events`（映射到单个或多个 Action 配置）、可选 `permission`、可选 `when` 条件配置。

#### Scenario: 构造合法 UI 树

- **WHEN** 开发者使用 `DslNode` 类型描述包含嵌套 children、events 与 when 条件的组件树
- **THEN** TypeScript 编译通过，且所有字段类型与设计文档第 11 节定义一致

#### Scenario: 缺少 type 字段的节点被拒绝

- **WHEN** 开发者构造缺少 `type` 字段的节点对象并赋值给 `DslNode`
- **THEN** TypeScript 编译报错

#### Scenario: children 为动态引用形态

- **WHEN** 节点的 `children` 赋值为 `{ source: { type: 'http', request: { url: '/api/dsl/list' } } }`
- **THEN** TypeScript 编译通过

### Requirement: DSL 文档结构类型

模块 SHALL 定义 Page DSL、Fragment DSL、Application DSL 的根结构类型。Page DSL MUST 包含 `dsl` 版本字段、`page` 元信息（`id`、`title`、`name`、`description`、`type`），并支持可选的 `requires`、`meta`（页面扩展元数据，自由键值）、`state`、`dataSources`、`actions`（页面级命名动作定义）、`components`（页面级命名组件子树，供 `component` 引用节点复用；值可为 `DslNode` 或 `DslSourceRef`——远端惰性加载子树）、`lifecycle`、`body`、`children` 字段。

`body`（单个 DslNode）与根级 `children`（DslNode 数组或 `DslSourceRef`）为 UI 树的声明形态：`body` 存在时 MUST 优先使用 `body`；`body` 缺失且 `children` 存在时 MUST 以根级 `children` 作为 UI 树（隐式片段根，无需任何包装节点，可为动态引用）；两者均缺失时按空树处理。

模块 SHALL 导出 `resolveRootNodes(pageDsl)` 工具函数作为读取静态 UI 树根节点列表的官方入口：返回 `[body]`（body 存在时）；根级 `children` 为数组时返回该数组；根级 `children` 为 `DslSourceRef` 或缺失时返回空数组（动态形态由渲染入口解析）。

#### Scenario: 完整 Page DSL 类型检查

- **WHEN** 开发者声明包含 `dsl`、`requires`、`page`、`meta`、`state`、`dataSources`、`lifecycle`、`body` 的完整 Page DSL 对象
- **THEN** TypeScript 编译通过

#### Scenario: 缺少 dsl 版本字段被拒绝

- **WHEN** 开发者声明缺少 `dsl` 字段的 Page DSL 对象
- **THEN** TypeScript 编译报错

#### Scenario: 根级 children 形态类型检查

- **WHEN** 开发者声明不含 `body`、仅含根级 `children: DslNode[]` 的 Page DSL 对象
- **THEN** TypeScript 编译通过

#### Scenario: 根级 children 与 components 值的动态引用形态

- **WHEN** 根级 `children` 为 `DslSourceRef`，或 `components.banner` 为 `DslSourceRef`
- **THEN** TypeScript 编译通过

#### Scenario: resolveRootNodes 优先级

- **WHEN** 文档同时含 `body` 与根级 `children`
- **THEN** `resolveRootNodes` 返回 `[body]`，根级 `children` 被忽略

#### Scenario: resolveRootNodes 空树与动态形态

- **WHEN** 文档既无 `body` 也无根级 `children`，或根级 `children` 为 `DslSourceRef`
- **THEN** `resolveRootNodes` 返回空数组
