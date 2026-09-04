# Delta: dsl-core-protocol

## MODIFIED Requirements

### Requirement: DSL 文档结构类型

模块 SHALL 定义 Page DSL、Fragment DSL、Application DSL 的根结构类型。Page DSL MUST 包含 `dsl` 版本字段、`page` 元信息（`id`、`title`、`name`、`description`、`type`），并支持可选的 `requires`、`meta`（页面扩展元数据，自由键值）、`state`、`dataSources`、`actions`（页面级命名动作定义）、`components`（页面级命名组件子树，供 `component` 引用节点复用）、`lifecycle`、`body`、`children` 字段。

`body`（单个 DslNode）与根级 `children`（DslNode 数组）为 UI 树的两种等价声明形态：`body` 存在时 MUST 优先使用 `body`；`body` 缺失且 `children` 存在时 MUST 以根级 `children` 作为 UI 树（隐式片段根，无需任何包装节点）；两者均缺失时按空树处理。

模块 SHALL 导出 `resolveRootNodes(pageDsl)` 工具函数作为读取 UI 树根节点列表的官方入口：返回 `[body]`（body 存在时）或 `children ?? []`。

#### Scenario: 完整 Page DSL 类型检查

- **WHEN** 开发者声明包含 `dsl`、`requires`、`page`、`meta`、`state`、`dataSources`、`lifecycle`、`body` 的完整 Page DSL 对象
- **THEN** TypeScript 编译通过

#### Scenario: 缺少 dsl 版本字段被拒绝

- **WHEN** 开发者声明缺少 `dsl` 字段的 Page DSL 对象
- **THEN** TypeScript 编译报错

#### Scenario: 根级 children 形态类型检查

- **WHEN** 开发者声明不含 `body`、仅含根级 `children: DslNode[]` 的 Page DSL 对象
- **THEN** TypeScript 编译通过

#### Scenario: resolveRootNodes 优先级

- **WHEN** 文档同时含 `body` 与根级 `children`
- **THEN** `resolveRootNodes` 返回 `[body]`，根级 `children` 被忽略

#### Scenario: resolveRootNodes 空树

- **WHEN** 文档既无 `body` 也无根级 `children`
- **THEN** `resolveRootNodes` 返回空数组
