# Delta: dsl-cli

## MODIFIED Requirements

### Requirement: inspect 命令

`pactor inspect <file>` SHALL 输出 DSL 摘要：page id/title/type、state 键、dataSources（type/service）、组件类型计数（递归 body 与根级 children；children 数组中的动态引用元素计入 `source(service|http)` 标记并跳过递归）、事件动作清单、permission 引用、表达式清单（收集的 `${...}`，含引用 params 内表达式）。

#### Scenario: 输出结构摘要

- **WHEN** inspect 含两个组件与一个 dataSource 的 page.yaml
- **THEN** 输出含 page id、组件类型与计数、dataSource 名、动作与表达式条目

#### Scenario: 混排 children 中的引用元素被标记

- **WHEN** inspect 的 DSL 含 children 数组混排内联节点与 `{ source: {...} }` 元素
- **THEN** 组件计数含 `source(service)` 或 `source(http)` 条目，内联元素照常统计
