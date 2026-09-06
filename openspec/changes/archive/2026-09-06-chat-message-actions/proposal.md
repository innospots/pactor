# Proposal: chat-message-actions

## Why

消息气泡下方的操作条（复制/重新生成/重试/编辑）目前硬编码在 `MessageActions.tsx` 中：图标、顺序、可见性条件均不可配置，调用方无法隐藏某个按钮、调整外观或追加自定义动作（如引用回复、点赞点踩、转人工）。作为 DSL 驱动的聊天组件，`Chat` 节点需要像 `headerActions`、`models`、`contexts` 一样，以可序列化数据声明消息操作条。

## What Changes

- 新增声明式 prop `messageActions?: Array<BuiltinMessageAction | ChatMessageAction>`，逐层暴露于 `ChatView` / `ChatComposition` / `ChatWorkspace` / `Chat`（DSL 组件）。
- `MessageActions` 改为数据驱动渲染：不传配置时渲染现有 4 个内建按钮（完全向后兼容）；传入数组时严格按数组顺序与内容渲染，未列出的内建按钮不再出现。
- 内建动作（`copy` / `regenerate` / `retry` / `edit`）保留包内默认行为，允许经配置覆盖 `label` / `icon`，并可用 `roles` / `visibleWhen` 调整可见性条件。
- 自定义动作（无 `builtin`）为可序列化描述（`id` / `label` / `icon` / `roles` / `visibleWhen` / `service`），点击时经 `ChatServices.callService(service, { actionId, message })` 派发；DSL 场景同时触发 `events.onMessageAction`（event 作用域含 `action` 与 `message`）。
- 图标名走白名单映射（与菜单 `MENU_ICONS` 同模式），未知名渲染占位图标。
- examples/chat 演示一个自定义动作（如「引用回复」），验证 DSL 配置与服务注入闭环。

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `chat-message-actions`: 新增「消息操作条声明式配置」需求——`messageActions` 配置语义、内建动作覆盖规则、自定义动作服务派发、默认兼容行为。
- `chat-dsl-component`: `Chat` 组件新增 `messageActions` prop 与 `events.onMessageAction` 事件的声明。

## Impact

- `packages/chat`：`model.ts` 新增 `ChatMessageAction` / `BuiltinMessageAction` 类型；`view/MessageActions.tsx` 重构为数据驱动；`view/MessageBubble.tsx` / `view/ChatView.tsx` / `chat-composition.tsx` / `chat-workspace.tsx` / `Chat.tsx` 逐层透传；`ChatServices` 无需新增字段（复用 `callService`）。
- `examples/chat`：`chat.page.yaml` 增加 `messageActions` 演示配置；宿主注册示例服务。
- 向后兼容：未配置 `messageActions` 的现有调用方行为不变；无 BREAKING。
