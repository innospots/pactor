## MODIFIED Requirements

### Requirement: RuntimeContext 组装

模块 SHALL 提供 `createRuntimeContext(options)` 工厂，创建符合设计文档第 15 节结构的 RuntimeContext：`app`、`page`、`state`（StateStore）、`data`（DataStore）、`route`、`user`、`services`（ServiceRegistry）、`components`（ComponentRegistry）、`actions`（ActionRegistry）、`permission`、`capabilities`、`locale`、`i18n`。

#### Scenario: 创建默认上下文

- **WHEN** 调用方以最少的 options（如 page meta）创建上下文
- **THEN** 返回包含全部标准字段的 RuntimeContext，registries 为空 Registry 实例，adapters 为默认空实现，`locale` 为默认语言（如 `'zh-CN'`），`i18n` 为默认空实现

#### Scenario: 注入自定义 Registry 与 Adapter

- **WHEN** 调用方传入自定义 components/actions/services registry 或 permission/router/http adapter
- **THEN** 上下文使用注入的实例

#### Scenario: 注入 i18n 配置

- **WHEN** 调用方传入 `locale` 与 `messages` 创建上下文
- **THEN** 上下文 `locale` 为传入值，`i18n.t()` 可根据 messages 翻译
