# Spec: chat-message-actions

消息操作与轮次恢复（`@pactor-app/chat`）：复制、重新生成、编辑重发、错误重试。

### Requirement: 重新生成

chat 包 SHALL 提供 `runRegenerateTurn(store, transport, options?)`：定位最后一条 user 消息，移除其后的全部消息（含原 assistant 回复），以该 user 消息文本重新驱动一轮 turn（MUST NOT 追加新的 user 消息）。`options` SHALL 支持 `signal?: AbortSignal`。仅当存在 user 消息且当前无进行中 turn 时可触发；末条 assistant 消息完成态且注入了 transport 时，其操作条 SHALL 提供重新生成入口（仅提供 onSend 而无 transport 时无法保证"不追加 user 消息"契约，MUST NOT 渲染该入口）。错误重试入口同理依赖 transport。

#### Scenario: 重新生成末轮

- **WHEN** 对已完成会话点击重新生成
- **THEN** 原 assistant 回复被移除，同一 user 文本重跑 turn，产生新的 assistant 消息，store 中 user 消息数不变

#### Scenario: abort 取消重新生成

- **WHEN** 重新生成的 turn 进行中触发 abort
- **THEN** 新 assistant 消息以 cancelled 收尾，runRegenerateTurn 正常返回

### Requirement: 用户消息编辑重发

user 消息操作条 SHALL 提供编辑入口：点击后气泡替换为内联编辑框（预填原文本）；确认后 SHALL 移除该消息及其后全部消息，以新文本驱动一轮新 turn；取消编辑 MUST 不改变 store。

#### Scenario: 编辑并重发

- **WHEN** 编辑一条中间 user 消息并确认
- **THEN** 该消息及之后的消息被移除，新文本作为 user 消息追加并驱动新 turn

#### Scenario: 取消编辑

- **WHEN** 进入编辑态后取消
- **THEN** 消息列表保持不变

### Requirement: 错误重试

error 状态的 assistant 消息 SHALL 在错误警示区提供重试按钮，点击 SHALL 执行与重新生成等价的流程（以最后一条 user 消息重跑 turn）。

#### Scenario: 失败后重试

- **WHEN** assistant 消息为 error 状态且点击重试
- **THEN** 移除 error 消息并重跑该轮 turn
