# Spec: chat-streaming

## Purpose

Chat Streaming 事件模型与 reducer（`@pactor-app/chat`，设计文档第 69 节）。


## Requirements

### Requirement: SSE 事件模型

SHALL 定义事件联合类型：`message.start` / `text.delta` / `thinking.delta` / `tool.start` / `tool.result` / `dsl.start` / `dsl.complete` / `message.end` / `message.error`，事件携带 `messageId` 及对应负载（delta/schema/name/result 等）。

#### Scenario: 事件类型构造

- **WHEN** 构造第 69 节示例的 text.delta 与 dsl.complete 事件
- **THEN** TypeScript 编译通过

### Requirement: applyChatEvent reducer

`applyChatEvent(store, event)` SHALL 为纯函数：message.start 建立 assistant 占位（streaming）；text.delta 向目标 text/markdown part 追加（无则创建，part streaming）；thinking.delta 同理（thinking part）；tool.start/tool.result 建立或更新 tool part 状态；dsl.start 建立占位 dsl part；dsl.complete 写入 schema 并置 ready；message.end 置 completed；message.error 置 error 并附 error part。对乱序（delta 先于 start）与未知事件 MUST 宽容（自动建占位/忽略并告警），不抛错。

#### Scenario: 流式文本追加

- **WHEN** message.start 后连续两个 text.delta（"根据当前" + "数据"）
- **THEN** 目标 part content 为"根据当前数据"，message.end 后消息 status 为 completed 且 part 为 ready

#### Scenario: dsl.complete

- **WHEN** dsl.start 后 dsl.complete 携带 schema
- **THEN** 该 dsl part schema 可渲染且 status 为 ready

#### Scenario: 乱序宽容

- **WHEN** 未收到 message.start 直接收到 text.delta
- **THEN** 自动建立消息占位，不抛错

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

### Requirement: 重新生成轮次

SHALL 提供 `runRegenerateTurn(store, transport, options?)`：定位 store 中最后一条 user 消息，移除其后全部消息，以该消息文本重新驱动一轮 turn 且 MUST NOT 追加新的 user 消息。`options` SHALL 支持 `signal?: AbortSignal`（abort 时 assistant 消息以 cancelled 收尾并正常返回）。store 中无 user 消息时 SHALL 告警并正常返回（不抛错）。`runChatTurn` SHALL 支持 `options.skipUserMessage` 以支撑该语义。

#### Scenario: 重新生成

- **WHEN** 会话含 user 消息与 completed assistant 消息，执行 runRegenerateTurn 且 driver 推送 message.start / text.delta / message.end
- **THEN** 原 assistant 消息被移除，新 assistant 消息 completed，user 消息数不变

#### Scenario: 无 user 消息

- **WHEN** store 为空时执行 runRegenerateTurn
- **THEN** 告警并正常返回，store 不变

#### Scenario: abort 取消

- **WHEN** runRegenerateTurn 的 turn 进行中触发 abort
- **THEN** 新 assistant 消息状态为 cancelled，正常返回

### Requirement: tool.start 携带调用参数

`tool.start` 事件 MAY 携带 `args?: unknown`（工具调用参数，仅增量可选字段，不改变既有事件联合的其他成员）；reducer SHALL 将其存入对应 tool-call part 的 `args` 字段——无论该 part 是新建还是已存在（更新既有 part 时同样写入）。

#### Scenario: tool.start 携带 args

- **WHEN** reducer 收到携带 `args` 的 `tool.start` 事件
- **THEN** 目标 tool-call part 的 `args` 等于事件携带的参数

#### Scenario: tool.start 未携带 args

- **WHEN** reducer 收到未携带 `args` 的 `tool.start` 事件
- **THEN** 目标 tool-call part 正常建立 / 更新，`args` 缺省，行为与既有一致
