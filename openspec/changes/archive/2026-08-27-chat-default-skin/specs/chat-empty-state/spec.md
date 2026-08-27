# Spec Delta: chat-empty-state

## MODIFIED Requirements

### Requirement: 空状态问候

当会话无任何消息时，ChatView SHALL 渲染空状态区替代空白消息列表：含问候语（使用 `--pactor-chat-font-display` 衬线展示字体栈）与可选副标题。问候语文本 SHALL 可通过 prop 覆盖，并提供默认值。

空态下 ChatView SHALL 以居中组布局渲染（设计决策 D1）：问候语/副标题/建议与 Composer 组成同一垂直居中列（Composer 不钉底，列宽沿用 `--pactor-chat-content-width`）；首条消息进入后恢复消息列表 + 底部 Composer 的既有布局。空态居中容器 SHALL 支持内容溢出时滚动（极矮视口不裁切）。

#### Scenario: 空会话渲染问候

- **WHEN** store 中无任何消息
- **THEN** 消息区显示问候语而非空白区域

#### Scenario: 空态居中组

- **WHEN** 会话为空且配置了 greeting / suggestions
- **THEN** 问候语、建议与 Composer 在同一垂直居中列内相邻渲染，Composer 位于问候组正下方

#### Scenario: 有消息后隐藏

- **WHEN** 首条消息进入 store
- **THEN** 空状态区消失，正常渲染消息列表，Composer 恢复钉底布局
