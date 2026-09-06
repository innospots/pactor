# Spec Delta: chat-message-actions

## ADDED Requirements

### Requirement: 消息操作条声明式配置

chat 包 SHALL 支持可序列化 prop `messageActions?: Array<BuiltinMessageAction | ChatMessageAction>`（`BuiltinMessageAction = 'copy' | 'regenerate' | 'retry' | 'edit'`；`ChatMessageAction = { id, builtin?, label?, icon?, roles?, visibleWhen?, service? }`，字符串项等价于 `{ id: <name>, builtin: <name> }`），经 ChatView / ChatComposition / ChatWorkspace / Chat 逐层透传至操作条渲染。

未提供 `messageActions` 时 SHALL 按默认数组 `['copy', 'regenerate', 'retry', 'edit']` 渲染，行为与既有内建语义一致；提供数组时 SHALL 严格按数组顺序与内容渲染，未列出的内建动作 MUST NOT 出现。内建动作 SHALL 保留包内默认行为（复制写剪贴板、重新生成与重试的 turn 语义、编辑进内联编辑框），配置中的 `label` / `icon` / `roles` / `visibleWhen` 覆盖对应默认描述字段，未给字段沿用默认。内建动作的默认可见性：copy = assistant+completed；regenerate = assistant+completed 且仅末条且注入 transport；retry = assistant+error 且注入 transport；edit = user+completed。「regenerate 仅末条 assistant」与 transport 依赖为包内附加约束，MUST NOT 可经配置覆盖；执行前提不满足时按钮 MUST NOT 渲染。

#### Scenario: 缺省渲染与现状一致

- **WHEN** 未配置 messageActions，hover 末条已完成的 assistant 消息
- **THEN** 操作条含复制与重新生成按钮，行为与既有内建语义一致

#### Scenario: 数组即真相

- **WHEN** 配置 `messageActions: ['copy', { id: 'quote', icon: 'quote', service: 'quoteMessage' }]`，hover 已完成的 assistant 消息
- **THEN** 操作条仅含复制与引用两个按钮，不出现重新生成/编辑/重试

#### Scenario: 覆盖内建动作外观与可见性

- **WHEN** 配置 `{ builtin: 'edit', label: '修改并重发', roles: ['user', 'assistant'] }`
- **THEN** user 与 assistant 消息均显示该按钮（tooltip 为「修改并重发」），点击仍执行内建编辑行为

### Requirement: 自定义动作服务派发

无 `builtin` 的自定义动作被点击时：配置 `service` 时 SHALL 经 `ChatServices.callService(service, { actionId, message })` 派发；未注入 callService 时 SHALL console.warn 并跳过派发（MUST NOT 抛错）。内建与自定义动作点击时 SHALL 一并触发消息操作事件通知（见 chat-dsl-component 的 `events.onMessageAction`），事件为通知语义，不影响内建默认行为。

`visibleWhen` 取值 `'completed' | 'error' | 'always'`：`'completed'` 匹配非流式非错误的终态（含 cancelled）；`'error'` 匹配 error 状态；`'always'` 含 streaming（用于流式中需可见的自定义动作）。自定义动作缺省 `roles` 为 `['assistant']`、缺省 `visibleWhen` 为 `'completed'`。`icon` 为字符串图标名，经包内白名单映射渲染，未知名 SHALL 渲染占位图标（MUST NOT 抛错）。

#### Scenario: 自定义动作经服务派发

- **WHEN** 配置 `{ id: 'quote', service: 'quoteMessage' }` 且宿主注入 callService，点击该按钮
- **THEN** callService 以 ('quoteMessage', { actionId: 'quote', message }) 被调用，且 onMessageAction 事件以 action='quote' 触发

#### Scenario: 缺失 callService 受控降级

- **WHEN** 自定义动作配置 service 但未注入 callService，点击该按钮
- **THEN** console.warn，事件仍触发，不抛错

#### Scenario: 未知图标名占位

- **WHEN** 自定义动作 icon 为未知名称
- **THEN** 渲染占位图标，不抛错

#### Scenario: 流式中可见的自定义动作

- **WHEN** 自定义动作配置 `visibleWhen: 'always'`，assistant 消息 streaming 进行中
- **THEN** 该按钮可见可点击
