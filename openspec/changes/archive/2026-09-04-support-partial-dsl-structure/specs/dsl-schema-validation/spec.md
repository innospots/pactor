# Delta: dsl-schema-validation

## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: body 与根级 children 共存告警

校验器 MUST 支持对同时声明 `body` 与根级 `children` 的文档输出 warning 级提示（告知 `children` 将被忽略），该提示 MUST NOT 导致校验失败。

#### Scenario: 共存时给出 warning

- **WHEN** 文档同时声明 `body` 与根级 `children`
- **THEN** 校验通过（无错误），且 warning 列表包含"children 将被忽略"的提示项
