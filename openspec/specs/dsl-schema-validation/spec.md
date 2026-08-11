# Spec: dsl-schema-validation

DSL Schema 与校验模块（`pactor-schema`），提供 DSL 版本常量、Page DSL 根结构及 DslNode 的 JSON Schema 定义，以及基于 Ajv 的结构化校验器。

### Requirement: DSL 版本常量

模块 SHALL 导出当前 DSL Specification Version 常量（初始值 `"1.0"`），供校验器与上层 Runtime 比对 DSL 文档的 `dsl` 字段。

#### Scenario: 版本常量可用

- **WHEN** 调用方导入 DSL 版本常量
- **THEN** 得到语义化版本字符串 `"1.0"`

### Requirement: Page DSL 根结构 JSON Schema

模块 SHALL 提供覆盖设计文档第 10 节标准根结构的 JSON Schema：`dsl`（必填字符串）、`requires`（可选，含 `runtime` 与 `components` 版本声明）、`page`（必填，含 `id`/`title`/`type`）、`state`、`dataSources`、`lifecycle`、`body`（DslNode 递归结构）。

#### Scenario: 合法 Page DSL 通过 Schema 校验

- **WHEN** 校验器校验一份包含全部标准字段的合法 Page DSL JSON
- **THEN** 校验通过，无错误

#### Scenario: 缺少必填字段不通过

- **WHEN** 校验器校验缺少 `dsl` 或 `page.id` 的文档
- **THEN** 校验失败，错误列表中包含指向对应字段路径的错误项

### Requirement: DslNode 递归 Schema

模块 SHALL 提供 DslNode 的 JSON Schema，支持 `children` 递归嵌套、`events`（Action 配置或其数组）、`permission`、`when`、`props` 任意属性。

#### Scenario: 深层嵌套节点校验

- **WHEN** 校验包含多层嵌套 children 且带 events/when/permission 的 body 节点树
- **THEN** 校验通过

#### Scenario: 节点缺少 type 不通过

- **WHEN** 校验 children 中某个缺少 `type` 字段的节点
- **THEN** 校验失败，错误路径定位到该节点

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
