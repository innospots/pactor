# Spec Delta: chat-dsl-component

## ADDED Requirements

### Requirement: 消息操作配置

`Chat` SHALL 支持 `messageActions?: Array<BuiltinMessageAction | ChatMessageAction>` prop（DSL 可序列化数据；语义与默认行为见 chat-message-actions capability）与事件 `events.onMessageAction`（ActionConfig）：任意消息操作按钮（内建或自定义）点击时触发，event 作用域 SHALL 含 `action`（动作 id，内建动作为其内建名）与 `message`（对应消息数据）。

#### Scenario: DSL 配置操作条

- **WHEN** DSL 配置 `messageActions: ['copy', { id: 'quote', icon: 'quote', service: 'quoteMessage' }]`，hover 已完成的 assistant 消息
- **THEN** 操作条按配置渲染复制与引用两个按钮

#### Scenario: 点击触发事件

- **WHEN** DSL 配置 events.onMessageAction 为 setState 动作链，点击引用按钮
- **THEN** 动作以 event.action='quote'、event.message 为对应消息数据执行

#### Scenario: 内建动作亦通知

- **WHEN** 配置 events.onMessageAction，点击内建复制按钮
- **THEN** 事件以 event.action='copy' 触发，且复制默认行为照常执行
