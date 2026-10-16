# Delta: chat-view

## MODIFIED Requirements

### Requirement: 视图层复用 ui 展示组件

ChatView 的输入区、消息气泡展示块与空态 SHALL 组合 chat 展示组件（Composer、ChatMessage、Bubble、Sender、Thinking、ToolCall、StreamingText、Welcome、Suggestion，归属 `@pactor-app/chat` 的 `src/components/`，见 chat-ui-components）实现；`packages/chat` 的视图层 MUST NOT 保留与展示组件重复的第二份实现（第二份 Composer / EmptyState / 消息气泡展示 markup）。运行时职责（ConversationStore 订阅、transport 驱动、PartRenderer 渲染 dsl/artifact part、ActivityTrace、MessageActions、chrome DSL 桥接）SHALL 保留在视图层，展示组件 MUST 保持纯展示（不引入 store/transport 依赖）。

#### Scenario: 无重复展示实现

- **WHEN** 检索 `packages/chat/src` 中独立于 `src/components/` 展示组件的 Composer / EmptyState 展示实现与消息气泡展示 markup
- **THEN** 无残留；输入区、空态与消息气泡展示均经展示组件渲染

#### Scenario: 运行时行为不回归

- **WHEN** 经 ChatServicesProvider 注入 mock transport，渲染 ChatView 并发送消息、触发流式 delta、停止生成
- **THEN** 对话 turn、流式渲染、onStop 中断与消息动作（copy/regenerate/retry/edit）行为与重构前一致

#### Scenario: chrome DSL 路径不回归

- **WHEN** 经 registerChatComponent 以 DSL 渲染 Chat 并覆盖 composer / empty-state chrome 槽
- **THEN** chrome DSL 渲染与无 renderer 回退路径均正常，DSL 字段契约不变
