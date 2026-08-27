# Spec Delta: chat-streaming

## MODIFIED Requirements

### Requirement: ChatTransport 接口与 turn 驱动

SHALL 定义 `ChatTransport`（`send(input) → AsyncIterable<ChatEvent>`）与 `runChatTurn(store, transport, input)`：先 append user 消息与 assistant 占位，再逐事件 reduce。测试 SHALL 提供手动 driver（代码推送事件的 transport 实现）。`RunChatTurnOptions` SHALL 支持 `signal?: AbortSignal`：abort 时停止消费事件流，assistant 消息以 `cancelled` 状态收尾并正常返回（不抛错）。

`ChatInput` SHALL 支持可选字段 `model?: string` 与 `contexts?: ChatContextItem[]`（`{ id, label, trigger?, data? }`）：由视图层在发送时注入当前选中模型与上下文 chips；`contexts` MUST NOT 拼接进 `text` 字段。字段为可选，既有 transport 实现无需修改。

#### Scenario: 完整 turn

- **WHEN** driver 依次推送 message.start / text.delta / message.end，执行 runChatTurn
- **THEN** store 中含 user 消息与 completed 的 assistant 消息

#### Scenario: abort 取消 turn

- **WHEN** turn 进行中 AbortSignal 触发 abort
- **THEN** 事件流停止消费，assistant 消息状态为 cancelled，runChatTurn 正常返回

#### Scenario: 输入携带模型与上下文

- **WHEN** 视图层以 `{ text, model: 'demo', contexts: [{ id: 'a1', label: '报表助手' }] }` 驱动 turn
- **THEN** transport.send 收到的 input 含 model 与 contexts，input.text 仅为用户文本
