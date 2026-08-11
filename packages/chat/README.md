# pactor-chat

[Pactor](https://github.com/426-330/pactor) 的 Chat 包：AI Message Rendering Protocol（消息模型 / Streaming reducer / Safe Registry / capability 动作）与 Chat Runtime 视图（`<ChatView>` / `<MessageBubble>` / `<PartRenderer>` / `<Composer>` / chat 布局）。核心是"协议 + Runtime"而非单个组件；model / store / events / reducer / safe-registry / capability 零 React，可纯 Node 测试。

## 安装

```bash
npm install pactor-chat pactor-runtime pactor-markdown antd react
# 或
pnpm add pactor-chat pactor-runtime pactor-markdown antd react
```

`react >= 18`、`antd >= 5` 为 peer dependency（开发基准为 antd v6）。

## 示例

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

// 真实场景：transport 由业务按服务端协议实现（SSE / WebSocket）；
// 这里用手动 driver 演示
const driver = createManualDriver();

<ChatView
  store={store}
  transport={driver.transport}
  safeRegistry={safeRegistry}
  conversationId="conv-1"
/>;

// 服务端事件流（节选）：
driver.push({ type: 'message.start', messageId: 'm1' });
driver.push({ type: 'thinking.delta', messageId: 'm1', delta: '先查数据…' });
driver.push({ type: 'text.delta', messageId: 'm1', delta: '根据当前数据' });
driver.push({
  type: 'dsl.complete',
  messageId: 'm1',
  schema: { type: 'Statistic', props: { title: '总数', value: 42 } },
});
driver.push({ type: 'message.end', messageId: 'm1' });
driver.complete();
```

## API 一览

- **`ConversationStore`**（零 React）：`appendMessage` / `updateMessage(id, patch)` / `appendPart(messageId, part)` / `updatePart(messageId, partRef, patch)`（partRef 为下标或 part id）/ `setStatus` / `clear` / `subscribe(listener)`。全部更新不可变（新数组引用），兼容 `useSyncExternalStore`。
- **`applyChatEvent(store, event)`**（零 React）：Streaming 纯 reducer。事件：`message.start` / `text.delta`（`format: 'markdown'` 建 markdown part）/ `thinking.delta` / `tool.start` / `tool.result` / `dsl.start` / `dsl.complete` / `message.end` / `message.error`。对乱序宽容（delta 先于 start 自动建占位）、未知事件忽略并告警；`dsl.patch` V1 不实现。
- **`ChatTransport` / `runChatTurn(store, transport, input)`**：`send({ text, conversationId? }) → AsyncIterable<ChatEvent>`；turn 先 append user 消息 + assistant 占位再逐事件 reduce，transport 抛错收敛为 `message.error`。`createManualDriver()` 提供代码控制推送事件的 transport（`push` / `complete` / `fail`），测试与手动驱动共用。
- **`createSafeRegistry(source, allowed)`**：白名单过滤的组件注册表（get / has / list 取 `allowed ∩ source`，实时代理）。LLM 生成的 DSL 必须经 Safe Registry 渲染；白名单外节点渲染受控"不允许"占位（`guardChatDsl` + `ChatDenied`）。
- **`registerCapabilityAction(actions, { capabilities, permission?, confirm? })`**：注册 `capability` 动作，执行链 registry → permission → confirm（`risk: 'high'` 且注入 confirm 时；取消返回 `{ ok: true, skipped: true }`，未注入 confirm 受控拒绝）→ execute。DSL 侧：`{ action: 'capability', params: { name, params } }`。
- **`createChatRuntime({ safeRegistry, capabilities?, permission?, permissionStore?, confirm?, user? })`**：组装 Chat DSL 渲染运行时（Safe Registry + 内置动作 + capability 动作 + 权限适配器）；`buildChatScope({ conversation, message, params })` 组装 chat 作用域（`user` 经 RuntimeContext 注入）。
- **`<ChatView store transport? onSend? safeRegistry? capabilities? permission? confirm? conversationId? user? params?>`**：消息列表 + Composer。发送时 `onSend` 回调先行，注入 `transport` 时同时驱动一轮 turn。
- **`<MessageBubble>` / `<PartRenderer>` / `<Composer>`**：按 role 区分气泡；parts 按类型渲染（text / markdown / dsl / tool 状态卡 / thinking 默认折叠 / error / status）；Enter 发送、Shift+Enter 换行、空文本不发送。
- **`registerChatLayout(layoutRegistry)`**：注册 `chat` 布局（header 标题区 + ChatView 区，V1 无会话历史侧栏），`resolveLayout(registry, 'chat')` 命中。

## 安全约定

- LLM 生成的 DSL 只经 Safe Registry 渲染（白名单外组件一律受控占位，props 内嵌 DSL 子树由 runtime 的 UnsupportedComponent 兜底）。
- AI Action 必须经 Capability → Permission → Confirmation → Execute 链；AI DSL 建议只配置 `capability` 动作（Safe Registry 只挡组件，动作侧由 capability 白名单兜底）。
- Markdown 渲染复用 pactor-markdown 安全渲染器（不启用 raw HTML、URL 协议白名单）。

## 文档

完整文档见 <https://github.com/426-330/pactor/tree/main/docs>（`pnpm docs:dev` 本地启动文档站）。

## License

[MIT](../../LICENSE)
