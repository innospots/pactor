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
import { createBuiltinComponentRegistry } from 'pactor-ui-antd/components';
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

- **`ConversationStore`**（零 React）：`appendMessage` / `updateMessage(id, patch)` / `appendPart(messageId, part)` / `updatePart(messageId, partRef, patch)`（partRef 为下标或 part id）/ `setStatus` / `removeMessagesFrom(messageId)`（不可变截断该消息及之后全部消息，编辑重发/重新生成的基础）/ `clear` / `subscribe(listener)`。全部更新不可变（新数组引用），兼容 `useSyncExternalStore`。`ChatMessage` 支持 `attachments?: ChatAttachment[]`（`id`/`name`/`mimeType`/`size?`/`url?`，上传与存储由调用方负责）。
- **`applyChatEvent(store, event)`**（零 React）：Streaming 纯 reducer。事件：`message.start` / `text.delta`（`format: 'markdown'` 建 markdown part）/ `thinking.delta` / `tool.start`（可携带 `args`，供活动轨迹参数摘要）/ `tool.result` / `dsl.start` / `dsl.complete` / `message.end` / `message.error`。对乱序宽容（delta 先于 start 自动建占位）、未知事件忽略并告警；`dsl.patch` V1 不实现。
- **`ChatTransport` / `runChatTurn(store, transport, input)`**：`send({ text, conversationId? }) → AsyncIterable<ChatEvent>`；turn 先 append user 消息 + assistant 占位再逐事件 reduce，transport 抛错收敛为 `message.error`。`createManualDriver()` 提供代码控制推送事件的 transport（`push` / `complete` / `fail`），测试与手动驱动共用。
- **`runRegenerateTurn(store, transport, options?)`**（零 React）：定位末条 user 消息 → `removeMessagesFrom` 截断其后消息 → 以同文本重跑 turn（`options.skipUserMessage`，不重复追加 user 消息）；支持 `signal` 取消；无 user 消息时告警返回。消息操作条的"重新生成 / 错误重试"即接入此函数。
- **`detectStreamingMode(message)` / `pairToolTraces(parts)`**（零 React 纯函数）：活动轨迹的推导层——前者返回 `reasoning | tool | responding | null`；后者把 tool-call 与 tool-result 按 name + 出现顺序配对为 `ToolTraceEntry`（名称 / 参数 / 状态 / part 下标）。
- **`createSafeRegistry(source, allowed)`**：白名单过滤的组件注册表（get / has / list 取 `allowed ∩ source`，实时代理）。LLM 生成的 DSL 必须经 Safe Registry 渲染；白名单外节点渲染受控"不允许"占位（`guardChatDsl` + `ChatDenied`）。
- **`registerCapabilityAction(actions, { capabilities, permission?, confirm? })`**：注册 `capability` 动作，执行链 registry → permission → confirm（`risk: 'high'` 且注入 confirm 时；取消返回 `{ ok: true, skipped: true }`，未注入 confirm 受控拒绝）→ execute。DSL 侧：`{ action: 'capability', params: { name, params } }`。
- **`createChatRuntime({ safeRegistry, capabilities?, permission?, permissionStore?, confirm?, user? })`**：组装 Chat DSL 渲染运行时（Safe Registry + 内置动作 + capability 动作 + 权限适配器）；`buildChatScope({ conversation, message, params })` 组装 chat 作用域（`user` 经 RuntimeContext 注入）。
- **`<ChatView store transport? onSend? safeRegistry? capabilities? permission? confirm? conversationId? user? params? greeting? subtitle? suggestions?>`**：消息列表 + Composer。发送时 `onSend` 回调先行，注入 `transport` 时同时驱动一轮 turn。空会话渲染 `<EmptyState>`：问候语（`--pactor-chat-font-display` 衬线展示字体）+ 副标题 + `suggestions` 起始建议（字符串或 `{ label, prompt? }`，点击即发送，空数组不渲染建议区）。Composer 扩展 props（`attachments` / `onAttachmentsChange` / `onAttachFiles` / `onAttachmentClick` / `toolbarStart` / `toolbarEnd` / `onMentionTrigger` / `onPlusMenu`）原样透传给内建 Composer，语义见下方 `<Composer>`。
- **`<MessageBubble>` / `<PartRenderer>`**：按 role 区分气泡；parts 按类型渲染（text / markdown / dsl / thinking 折叠卡：流式展开 + 进行中指示、答案阶段自动折叠、支持 pin / error 附重试入口 / status）；tool-call / tool-result 移交 `<ActivityTrace>` 配对渲染。
- **`<ActivityTrace>`**：流式状态头（动画图标 + 呼吸文案 + 秒级计时，结束定格）+ 配对工具轨迹条目（单行：名称 + 参数摘要 + 状态图标，展开显示参数与结果/错误）；流式展开 → 答案阶段自动折叠 → 用户 pin 后不再自动变更（按消息记忆）。
- **`<MessageActions>`**：消息操作条（hover 显现）——复制（`collectMessageText` 汇总文本写入剪贴板）、末条 completed assistant 重新生成、user 消息气泡内联编辑重发（确认 → 截断 + 重跑，取消不改 store）、error 消息重试。
- **`<Composer>`**：自适应高度 textarea；IME 合成守卫（合成中 Enter 不发送）；发送按钮状态机（disabled / ready / streaming 停止，同元素切换 + 纯 CSS 光环）；受控附件 `attachments` + `onAttachmentsChange`（图片缩略图/文档卡片 + 移除），拖拽悬停态、粘贴与文件选择产出 `File[]` 经 `onAttachFiles` 交给调用方（包内不上传），点击卡片经 `onAttachmentClick` 通知；`toolbarStart` / `toolbarEnd` 渲染槽；词边界 `@` 触发 `onMentionTrigger(query, anchorRect)`，"+" 按钮触发 `onPlusMenu(anchorRect)`（未传回调不渲染入口，弹层由调用方实现）。
- **`registerChatLayout(layoutRegistry)`**：注册 `chat` 布局（header 标题区 + ChatView 区，V1 无会话历史侧栏），`resolveLayout(registry, 'chat')` 命中。

> **数据由调用方经接口注入**：包内不发起网络请求、不读取外部数据源。greeting / suggestions / attachments 等均为受控 props；文件上传、提及列表、预览等由调用方实现后经回调回写。`examples/chat` 提供内存级参考实现（data URL 伪上传、工具栏 chip、mention/+ 触发）。

## 安全约定

- LLM 生成的 DSL 只经 Safe Registry 渲染（白名单外组件一律受控占位，props 内嵌 DSL 子树由 runtime 的 UnsupportedComponent 兜底）。
- AI Action 必须经 Capability → Permission → Confirmation → Execute 链；AI DSL 建议只配置 `capability` 动作（Safe Registry 只挡组件，动作侧由 capability 白名单兜底）。
- Markdown 渲染复用 pactor-markdown 安全渲染器（不启用 raw HTML、URL 协议白名单）。

## 文档

完整文档见 <https://github.com/426-330/pactor/tree/main/docs>（`pnpm docs:dev` 本地启动文档站）。

## License

[MIT](../../LICENSE)
