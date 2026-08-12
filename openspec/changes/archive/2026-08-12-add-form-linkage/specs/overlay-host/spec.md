# Spec Delta: overlay-host

## ADDED Requirements

### Requirement: overlay 内容响应式

OverlayHost 渲染的 DSL content 中绑定 state / data 的表达式（如 `options: ${state.xxx}`）MUST 随 store 变化重渲染（OverlayHost 订阅 StateStore / DataStore，与页面 Renderer 的订阅语义一致）。双 kit 行为 MUST 一致。

#### Scenario: state 变化驱动 overlay 内容更新

- **WHEN** overlay 已打开且其 content 含 `${state.label}` 绑定，随后 setState 修改 label
- **THEN** overlay 内渲染内容更新为新值，无需关闭重开

#### Scenario: 双 kit 一致

- **WHEN** 同一 overlay DSL 分别以 antd 与 Radix kit 渲染并触发 state 变化
- **THEN** 两者 overlay 内容均更新
