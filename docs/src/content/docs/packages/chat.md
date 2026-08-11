---
title: pactor-chat
description: Chat——AI Message Rendering Protocol（消息模型 / Streaming reducer / Safe Registry / capability 动作）与 Chat Runtime 视图（ChatView / MessageBubble / PartRenderer / Composer / chat 布局）
---

`pactor-chat` 是 V1 最后一个模块，核心是"协议 + Runtime"而非单个组件：消息模型与 `ConversationStore`、Streaming 事件与纯 reducer、LLM DSL 的 Safe Registry 白名单、Capability → Permission → Confirmation → Execute 的 AI Action 链，以及独立的 React 视图族。model / store / events / reducer / safe-registry / capability 零 React，可纯 Node 测试。

```bash
pnpm add pactor-chat pactor-runtime pactor-markdown antd react
```

`react >= 18`、`antd >= 5` 为 peer dependency（开发基准为 antd v6）。

## 组合结构

```tsx
import { createBuiltinComponentRegistry } from 'pactor-components';
import {
  ChatView,
  ConversationStore,
  createManualDriver,
  createSafeRegistry,
} from 'pactor-chat';

const store = new ConversationStore();
// Safe Registry：LLM 生成的 DSL 只渲染白名单内的组件
const safeRegistry = createSafeRegistry(createBuiltinComponentRegistry(), [
  'Statistic',
  'Card',
]);

// transport 由业务按服务端协议实现（SSE / WebSocket）；这里用手动 driver 演示
const driver = createManualDriver();

<ChatView
  store={store}
  transport={driver.transport}
  safeRegistry={safeRegistry}
  conversationId="conv-1"
/>;
```

## 消息模型与 ConversationStore（零 React）

消息由有序 Part 数组组成，thinking 与正文分离：

- **Part 联合类型**：`text` / `markdown` / `dsl`（schema 为 DslNode）/ `thinking` / `tool-call`（waiting \| running \| success \| failed）/ `tool-result` / `error` / `status`。
- **消息状态机**：`pending | streaming | completed | error | cancelled`；Part 状态：`pending | streaming | ready | error`。

| 方法 | 说明 |
| --- | --- |
| `appendMessage(message)` | 追加消息（id 重复告警并忽略） |
| `updateMessage(id, patch)` | 更新消息级字段 |
| `appendPart(messageId, part)` | 追加 part |
| `updatePart(messageId, partRef, patch)` | 更新 part；partRef 为数组下标或 part id |
| `setStatus(id, status)` | 设置消息状态 |
| `clear()` | 清空会话 |
| `subscribe(listener)` | 订阅变更，返回退订函数 |

全部更新不可变（新数组引用），兼容 `useSyncExternalStore`；对未知 messageId 的更新宽容（告警不抛错）。

## Streaming：事件、reducer 与 Transport

事件类型对齐设计文档第 69 节（`dsl.patch` V1 不实现）：`message.start` / `text.delta`（`format: 'markdown'` 建 markdown part）/ `thinking.delta` / `tool.start` / `tool.result` / `dsl.start` / `dsl.complete` / `message.end` / `message.error`。

`applyChatEvent(store, event)` 为纯函数 reducer：delta 向目标 part 追加（无 part 则创建）、`dsl.start` 建立占位 part、`dsl.complete` 写入 schema 并置 ready、`message.end` 置 completed（收尾未 ready 的内容 part）、`message.error` 置 error 并附 error part。对乱序宽容——delta 先于 `message.start` 自动建 assistant 占位；未知事件忽略并 `console.warn`，不抛错。

```ts
interface ChatTransport {
  send(input: { text: string; conversationId?: string }): AsyncIterable<ChatEvent>;
}
```

`runChatTurn(store, transport, input)` 先 append user 消息（completed）与 assistant 占位（pending），再 for-await 逐事件 reduce；transport 抛错收敛为 `message.error`，流正常结束但未收到 `message.end` 时兜底 completed。真实 SSE / WebSocket 客户端由业务实现；`createManualDriver()`（`push` / `complete` / `fail`）供测试与手动驱动。

## Safe Registry 与 capability 动作

- **`createSafeRegistry(source, allowed)`**：白名单过滤的组件注册表——`get` / `has` / `list` 取 `allowed ∩ source` 并实时代理 source。LLM 生成的 DSL MUST 经 Safe Registry 渲染：白名单外节点经 `guardChatDsl` 替换为受控"不允许"占位（`ChatDenied`），其 children 不渲染；props 内嵌的 DSL 子树（Table columns 等）由 runtime 的 UnsupportedComponent 兜底。
- **`registerCapabilityAction(actions, { capabilities, permission?, confirm? })`** 注册 `capability` 动作，执行链（每步失败均为受控返回）：
  1. `params.name` 查 CapabilityRegistry，未注册 → `{ ok: false }`
  2. capability 声明 `permission` 且 PermissionAdapter 拒绝 → `{ ok: false }`
  3. capability 声明 `risk: 'high'`：注入 confirm 时先确认，取消 → `{ ok: true, skipped: true }`；未注入 confirm → `{ ok: false }`
  4. `capability.execute(params.params, ctx)`，返回值作为动作 data

```yaml
type: Button
props: { text: 应用建议 }
events:
  onClick:
    action: capability
    params:
      name: strategy.applySuggestion
      params: { id: 7 }
```

:::note
Safe Registry 只挡组件；动作侧由 capability 白名单兜底——AI DSL 建议只配置 `capability` 动作。
:::

## Chat 作用域与 DSL part 渲染

DSL part 经 runtime Renderer 渲染：ComponentRegistry 为 Safe Registry；作用域在 runtime 全局作用域之上注入 `conversation`（`{ id }`）、`message`（`{ id }`）、`params`（`user` 经 RuntimeContext 注入）——沿用表达式引擎约束，不暴露浏览器全局对象。`${message.id}` 求值为当前消息 id。

`createChatRuntime({ safeRegistry, capabilities?, permission?, permissionStore?, confirm?, user? })` 一步组装渲染运行时（注册内置动作与 capability 动作；`permissionStore` 经 pactor-permission 构造权限适配器）；`<ChatView>` 注入 props 后内部自动组装。

## React 视图

- **`<ChatView store transport? onSend? safeRegistry? capabilities? permission? confirm? conversationId? user? params?>`**：`useSyncExternalStore` 订阅消息列表 + Composer。发送时 `onSend` 回调先行，注入 `transport` 时同时驱动一轮 turn（通常二选一）。
- **`<MessageBubble>`**：user 靠右、assistant 靠左、system 居中，parts 按序逐个渲染。
- **`<PartRenderer>`**：text → 文本段落；markdown → pactor-markdown 安全渲染器；dsl → runtime 渲染（Safe Registry + chat 作用域）；tool-call / tool-result → antd Collapse 状态卡；thinking → 默认折叠（与正文分离）；error → antd Alert；status → 弱提示。
- **`<Composer>`**：Enter 发送、Shift+Enter 换行；空文本不发送。

样式为语义 class（`pactor-chat-*`）+ 极简内联布局，主题留给 pactor-theme。

## chat 布局注册

`registerChatLayout(layoutRegistry)` 注册 `chat` 布局（header 标题区 + ChatView 区，V1 无会话历史侧栏）；注册后 `resolveLayout(registry, 'chat')` 命中，可与其他布局一样经 DSL `layout` 字段使用。
