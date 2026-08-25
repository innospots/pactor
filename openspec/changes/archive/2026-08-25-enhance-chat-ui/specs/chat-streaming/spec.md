# Delta: chat-streaming

## ADDED Requirements

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
