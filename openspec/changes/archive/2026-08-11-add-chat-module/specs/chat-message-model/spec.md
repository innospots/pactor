# Spec: chat-message-model

Chat 消息模型与 ConversationStore（`pactor-chat`，设计文档第 58/59/70 节）。

## ADDED Requirements

### Requirement: 消息与 Part 类型

SHALL 定义 `ChatMessage`（`id` / `role: user|assistant|system` / `status` / `parts` / `createdAt?`）与 Part 联合类型：`text`、`markdown`、`dsl`（schema 为 DslNode）、`thinking`、`tool-call`（name/title/status: waiting|running|success|failed）、`tool-result`（name/status: success|failed/result?/error?）、`error`、`status`。消息状态机：`pending | streaming | completed | error | cancelled`；Part 状态：`pending | streaming | ready | error`。

#### Scenario: 类型完备

- **WHEN** 构造含各 Part 类型与状态的消息
- **THEN** TypeScript 编译通过

### Requirement: ConversationStore

SHALL 提供 `ConversationStore`（零 React）：`appendMessage` / `updateMessage(id, patch)` / `appendPart(messageId, part)` / `updatePart(messageId, partRef, patch)` / `setStatus(id, status)` / `clear` / `subscribe(listener)`（退订）。更新 MUST 不可变（返回新引用），以兼容 useSyncExternalStore。

#### Scenario: 追加与更新

- **WHEN** appendMessage 后 updateMessage 修改 status，再 appendPart
- **THEN** getMessages() 反映全部变更，原数组引用已变化

#### Scenario: 订阅通知

- **WHEN** 订阅后执行任意变更，退订后再变更
- **THEN** 退订前每次变更均通知，退订后不再通知
