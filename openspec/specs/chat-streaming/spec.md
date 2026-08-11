# Spec: chat-streaming

Chat Streaming 事件模型与 reducer（`pactor-chat`，设计文档第 69 节）。

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

SHALL 定义 `ChatTransport`（`send(input) → AsyncIterable<ChatEvent>`）与 `runChatTurn(store, transport, input)`：先 append user 消息与 assistant 占位，再逐事件 reduce。测试 SHALL 提供手动 driver（代码推送事件的 transport 实现）。

#### Scenario: 完整 turn

- **WHEN** driver 依次推送 message.start / text.delta / message.end，执行 runChatTurn
- **THEN** store 中含 user 消息与 completed 的 assistant 消息
