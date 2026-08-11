# Design: add-chat-module

## Context

最后一个 V1 模块（设计文档第 56–76、81.4–81.5、98 节）。可复用：pactor-markdown（MarkdownRenderer）、pactor-runtime（Renderer/PageRuntime/动作引擎/CapabilityRegistry 槽位）、pactor-permission（PermissionAdapter）、pactor-interaction（confirm 桥）。核心是"协议 + Runtime"而非单个组件（第 56 节）。

约束：

- LLM 生成的 DSL 必须走独立 Safe Registry（第 81.4 节）；AI Action 必须经 Capability → Permission → Confirmation → Service 链（第 81.5 节）。
- thinking 与正文分离（第 72 节）；Streaming 第一版预留（第 69 节）。
- Store/reducer/Safe Registry/capability 动作零 React，可纯 Node 测试；React 视图独立。

## Goals / Non-Goals

**Goals:**

- 消息模型 + ConversationStore（状态机 + 订阅）。
- Streaming 事件模型 + 纯 reducer + ChatTransport 接口 + 手动 driver。
- Safe Registry 白名单包装；capability 动作（权限+确认）；chat 作用域。
- ChatView 组件族 + chat 布局注册。
- 测试与文档。

**Non-Goals:**

- 附件/语音/多会话持久化/历史侧栏/feedback/审批组件；chart 独立 part（dsl 表达）；真实 SSE fetch 客户端（只定义 Transport，业务自行实现或后续补）。
- Chat 与页面 DSL 的 AI Context Bridge（第 76 节）——V2 评估。

## Decisions

### D1: 消息模型与 ConversationStore

```ts
type ChatRole = 'user' | 'assistant' | 'system';
type MessageStatus = 'pending' | 'streaming' | 'completed' | 'error' | 'cancelled';
type PartStatus = 'pending' | 'streaming' | 'ready' | 'error';
type ChatPart =
  | { type: 'text'; content: string; status?: PartStatus }
  | { type: 'markdown'; content: string; status?: PartStatus }
  | { type: 'dsl'; schema: DslNode; status?: PartStatus }
  | { type: 'thinking'; content: string; status?: PartStatus }
  | { type: 'tool-call'; name: string; title?: string; status: 'waiting'|'running'|'success'|'failed' }
  | { type: 'tool-result'; name: string; status: 'success'|'failed'; result?: unknown; error?: string }
  | { type: 'error'; message: string }
  | { type: 'status'; text: string };
interface ChatMessage { id: string; role: ChatRole; status: MessageStatus; parts: ChatPart[]; createdAt?: number }
```

`ConversationStore`：messages 数组；`appendMessage` / `updateMessage(id, patch)` / `appendPart(messageId, part)` / `updatePart(messageId, partIndex|partId, patch)` / `setStatus` / `clear` / `subscribe`。不可变更新（返回新数组引用，兼容 useSyncExternalStore）。

### D2: Streaming reducer + Transport

- 事件类型对齐第 69 节：`message.start | text.delta | thinking.delta | tool.start | tool.result | dsl.start | dsl.complete | message.end | message.error`（dsl.patch V1 不实现，dsl.start 建立占位 part）。
- `applyChatEvent(store, event)` 纯函数 reducer：text.delta 向目标 part 追加 content（无 part 则创建）；dsl.complete 把 part 置为 ready 并写 schema；message.end → completed；message.error → error part + error 状态。
- `ChatTransport = { send(input: { text: string; conversationId?: string }): AsyncIterable<ChatEvent> }`；`runChatTurn(store, transport, input, driverHelpers)`：先 append user 消息 + assistant 占位（pending），再 for-await 事件 reduce。测试用 `createManualDriver()`（代码控制推送事件）。

### D3: Safe Registry

`createSafeRegistry(source: Registry<unknown>, allowed: string[])`：包装 get/has——仅 allowed 且 source 有才命中；list() 返回交集。未命中时渲染层显示"该组件不允许在 Chat 中使用"占位（复用 runtime UnsupportedComponent 语义即可，chat 提供自定义 fallback 文案）。

### D4: capability 动作

`registerCapabilityAction(actions, { capabilities, permission, confirm? })` 注册 `capability`：
1. params.name 查 CapabilityRegistry，未注册 → `{ ok: false }` 受控失败。
2. capability 声明 `permission` 时经 PermissionAdapter 检查，拒绝 → `{ ok: false }`。
3. capability 声明 `risk: 'high'` 且有 confirm → 先确认，取消 → `{ ok: true, skipped: true }`（取消语义）。
4. 执行 capability.execute(params.params, ctx) → data 为返回值。
- `CapabilityRegistry` 用 core Registry<CapabilityHandler>；`CapabilityHandler = { permission?, risk?, execute(params, ctx) }`。

### D5: Chat 作用域与 DSL part 渲染

- DSL part 经 runtime Renderer 渲染，ComponentRegistry 用 Safe Registry；作用域注入 `{ conversation: { id }, message: { id }, user, params }`（chat 上下文组装，禁止浏览器全局——沿用表达式引擎约束）。
- Chat DSL 中的动作经 runtime 动作引擎执行（Safe Registry 只挡组件；动作侧由 capability 白名单兜底——AI DSL 建议只配置 capability 动作，文档注明）。

### D6: React 视图

- `<ChatView store transport? onSend? safeRegistry scope?>`：消息列表（useSyncExternalStore 订阅）+ Composer（受控输入 + 发送，Enter 发送/Shift+Enter 换行）。
- `<MessageBubble message>`：按 role 分左右；parts 逐个 `<PartRenderer>`。
- `<PartRenderer>`：text → 段落；markdown → MarkdownRenderer；dsl → runtime 渲染（Safe Registry + chat scope）；tool-call/tool-result → antd Collapse 状态卡（第 71 节）；thinking → 折叠（第 72 节 collapsed 默认）；error → antd Alert；status → 弱提示文本。
- `registerChatLayout(layoutRegistry)`：chat 布局 = header（title）+ ChatView 区（无会话历史侧栏，V1）。

### D7: 依赖与结构

dependencies：`pactor-core`、`pactor-runtime`、`pactor-markdown`、`pactor-permission`（workspace:*）；peer：`react >=18`、`antd >=5`；devDeps：antd + react 测试栈。源码：`model.ts`、`store.ts`、`events.ts`（类型+reducer）、`transport.ts`、`safe-registry.ts`、`capability-action.ts`、`view/`（ChatView/MessageBubble/PartRenderer/Composer/ChatLayout）、`index.ts`。

## Risks / Trade-offs

- [Streaming reducer 事件组合繁多，边界 case 多（delta 先于 start、partId 缺失）] → reducer 对乱序/缺失宽容（自动建 part、未知事件忽略并告警），测试锁定。
- [capability 的 confirm 依赖 interaction 的 UiBridge，组合顺序需在 app 层保证] → confirm 为可选注入，缺失时高风险 capability 受控拒绝并注明。
- [ChatView 样式无主题体系] → 语义 class（pactor-chat-*）+ 极简内联布局，主题留 pactor-theme。

## Migration Plan

无（全新包）。顺序：model/store → events/reducer → safe-registry/capability → 视图 → 布局注册 → 端到端 → 文档。

## Open Questions

- 真实 SSE/WebSocket Transport 实现：后续按服务端协议补 `createSseTransport(url)`。
- AI Context Bridge（第 76 节，Chat 感知当前页面状态）：V2。
