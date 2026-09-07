# Spec: dsl-schema-validation

## Purpose

DSL Schema 与校验模块（`@pactor-app/schema`），提供 DSL 版本常量、Page DSL 根结构及 DslNode 的 JSON Schema 定义，以及基于 Ajv 的结构化校验器。


## Requirements

### Requirement: DSL 版本常量

模块 SHALL 导出当前 DSL Specification Version 常量（初始值 `"1.0"`），供校验器与上层 Runtime 比对 DSL 文档的 `dsl` 字段。

#### Scenario: 版本常量可用

- **WHEN** 调用方导入 DSL 版本常量
- **THEN** 得到语义化版本字符串 `"1.0"`

### Requirement: Page DSL 根结构 JSON Schema

模块 SHALL 提供覆盖设计文档第 10 节标准根结构的 JSON Schema：`dsl`（必填字符串）、`requires`（可选，含 `runtime` 与 `components` 版本声明）、`page`（必填，含 `id`/`title`/`type`）、`state`、`dataSources`、`lifecycle`、`body`（DslNode 递归结构）、`children`（可选，DslNode 数组，作为 `body` 缺失时的 UI 树替代形态，每项按 DslNode 递归 Schema 校验）。

#### Scenario: 合法 Page DSL 通过 Schema 校验

- **WHEN** 校验器校验一份包含全部标准字段的合法 Page DSL JSON
- **THEN** 校验通过，无错误

#### Scenario: 缺少必填字段不通过

- **WHEN** 校验器校验缺少 `dsl` 或 `page.id` 的文档
- **THEN** 校验失败，错误列表中包含指向对应字段路径的错误项

#### Scenario: 根级 children 形态通过校验

- **WHEN** 校验器校验不含 `body`、仅含根级 `children` 数组的 Page DSL 文档
- **THEN** 校验通过，无错误

#### Scenario: 根级 children 中非法节点被拒绝

- **WHEN** 根级 `children` 数组中某项缺少 `type` 字段
- **THEN** 校验失败，错误路径定位到该节点

### Requirement: body 与根级 children 共存告警

校验器 MUST 支持对同时声明 `body` 与根级 `children` 的文档输出 warning 级提示（告知 `children` 将被忽略），该提示 MUST NOT 导致校验失败。

#### Scenario: 共存时给出 warning

- **WHEN** 文档同时声明 `body` 与根级 `children`
- **THEN** 校验通过（无错误），且 warning 列表包含"children 将被忽略"的提示项

### Requirement: DslNode 递归 Schema

模块 SHALL 提供 DslNode 的 JSON Schema，支持 `children` 递归嵌套（`DslChildren`：内联数组——元素可为节点或引用混排，或整体 `DslSourceRef`）、`events`（Action 配置或其数组）、`permission`、`when`、`props` 任意属性。

#### Scenario: 深层嵌套节点校验

- **WHEN** 校验包含多层嵌套 children 且带 events/when/permission 的 body 节点树
- **THEN** 校验通过

#### Scenario: 节点缺少 type 不通过

- **WHEN** 校验 children 中某个缺少 `type` 字段的节点
- **THEN** 校验失败，错误路径定位到该节点

#### Scenario: 节点 children 为引用形态

- **WHEN** 某节点 `children` 为合法 `DslSourceRef`
- **THEN** 校验通过

#### Scenario: 节点 children 数组混排节点与引用

- **WHEN** 某节点 `children` 数组含内联节点与合法引用元素
- **THEN** 校验通过

### Requirement: 结构化校验错误

校验器 MUST 返回结构化错误列表，每项包含 `path`（字段路径）、`message`（人类可读描述）、`keyword`（Ajv 错误关键字），MUST NOT 直接向调用方暴露 Ajv 原始错误对象。校验通过时返回空错误列表。

#### Scenario: 错误结构化输出

- **WHEN** 校验一份存在多处错误的 DSL 文档
- **THEN** 返回包含全部错误的数组，每项均有 `path`、`message`、`keyword` 字段

### Requirement: requires 声明类型与版本声明支持

模块 SHALL 支持校验 DSL 文档中 `requires.runtime` 与 `requires.components` 的版本范围声明格式（semver range 字符串），格式非法时校验失败。

#### Scenario: 合法版本范围通过

- **WHEN** 文档声明 `requires: { runtime: ">=1.0.0" }`
- **THEN** 校验通过

#### Scenario: 非法版本声明类型被拒绝

- **WHEN** 文档的 `requires.runtime` 为非字符串类型
- **THEN** 校验失败

### Requirement: DslSourceRef Schema 与引用位置校验

模块 SHALL 提供 `DslSourceRef` 的 JSON Schema：`source` 必填且为二选一形态（`{ type: 'service', service: 非空字符串, params? }` 或 `{ type: 'http', request: { url: 非空字符串, method?, params?, headers? } }`），`placeholder` 为可选 DslNode。下列位置 MUST 接受该引用形态：

- 组件节点的 `children`（`DslChildren`：整体引用，或数组——**数组元素可为 DslNode 或 DslSourceRef 混排**）
- Page DSL 根级 `children`（同上）
- Page DSL `components` 的值（`DslNode` 或 `DslSourceRef` 二选一）

模块 SHALL 导出 `validateDslNode(value)` 与 `validateDslNodes(value)` 便利函数，返回与 `validatePageDsl` 相同的结构化错误列表，供运行时校验远端加载的 DSL 内容；`validateDslNodes` 的数组元素 MUST 接受节点或引用两种形态。

#### Scenario: 节点 children 为引用形态通过校验

- **WHEN** 组件节点 `children` 为 `{ source: { type: 'service', service: 'dsl.menus' } }`
- **THEN** 校验通过

#### Scenario: children 数组混排通过校验

- **WHEN** 节点或根级 `children` 数组中同时含内联节点与 `{ source: {...} }` 引用元素
- **THEN** 校验通过

#### Scenario: 混排数组中非法元素被拒绝

- **WHEN** children 数组中某元素既无 `type`/`component` 也无合法 `source`
- **THEN** 校验失败，错误路径定位到该元素

#### Scenario: 引用形态缺少必填字段不通过

- **WHEN** 引用为 `{ source: { type: 'http' } }`（缺 `request.url`）
- **THEN** 校验失败，错误路径定位到对应字段

#### Scenario: components 值为引用形态通过校验

- **WHEN** `components.detail` 为 `{ source: { type: 'http', request: { url: '/api/dsl/detail' } } }`
- **THEN** 校验通过

#### Scenario: validateDslNode 校验远端内容

- **WHEN** 对远端返回的非法节点对象（缺 `type`）调用 `validateDslNode`
- **THEN** 返回含 `/type` 路径的结构化错误
