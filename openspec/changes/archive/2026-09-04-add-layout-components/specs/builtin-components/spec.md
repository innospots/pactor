# Delta: builtin-components

## MODIFIED Requirements

### Requirement: 组件注册入口

模块 SHALL 提供 `registerBuiltinComponents(registry)` 与 `createBuiltinComponentRegistry()`，按 DSL 类型名注册全部 V1 组件：Page、Grid、Flex、Card、Button、Alert、Statistic、Tabs、Table、Form、Input、Select、Layout、Header、Sider、Content、Footer、Menu。

#### Scenario: 注册后全部类型可解析

- **WHEN** 调用 `createBuiltinComponentRegistry()` 后查询上述 18 个类型名
- **THEN** 每个 `has(type)` 均为 `true`

#### Scenario: 与 Renderer 端到端渲染

- **WHEN** 在 PageRuntime 中注册内置组件并渲染含 Button/Card 的 PageDsl body
- **THEN** 页面中出现对应 antd 组件
