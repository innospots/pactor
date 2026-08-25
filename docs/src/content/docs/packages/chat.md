---
title: pactor-chat
description: Chat——AI Message Rendering Protocol（消息模型 / Streaming reducer / Safe Registry / capability 动作）与 Chat Runtime 视图（ChatView / MessageBubble / PartRenderer / Composer / chat 布局）
---

`pactor-chat` 是 V1 最后一个模块，核心是"协议 + Runtime"而非单个组件：消息模型与 `ConversationStore`、Streaming 事件与纯 reducer、LLM DSL 的 Safe Registry 白名单、Capability → Permission → Confirmation → Execute 的 AI Action 链，以及独立的 React 视图族。model / store / events / reducer / safe-registry / capability 零 React，可纯 Node 测试。

```bash
pnpm add pactor-chat pactor-runtime pactor-markdown react
```

`react >= 18` 为 peer dependency。视图层零 antd 依赖（2026-08-12 polish-chat-view 起）：图标用 lucide-react，皮肤经 `pactor-chat/styles.css` 提供（技术选型参考 [DeepTutor web](https://github.com/HKUDS/DeepTutor/tree/main/web)）。

## 组合结构

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
| `removeMessagesFrom(id)` | 不可变截断该消息及之后全部消息（编辑重发 / 重新生成的基础） |
| `clear()` | 清空会话 |
| `subscribe(listener)` | 订阅变更，返回退订函数 |

全部更新不可变（新数组引用），兼容 `useSyncExternalStore`；对未知 messageId 的更新宽容（告警不抛错）。`ChatMessage` 支持 `attachments?: ChatAttachment[]`（`id` / `name` / `mimeType` / `size?` / `url?`）——包内只持有引用，上传与存储由调用方负责。

## Streaming：事件、reducer 与 Transport

事件类型对齐设计文档第 69 节（`dsl.patch` V1 不实现）：`message.start` / `text.delta`（`format: 'markdown'` 建 markdown part）/ `thinking.delta` / `tool.start` / `tool.result` / `dsl.start` / `dsl.complete` / `message.end` / `message.error`。

`applyChatEvent(store, event)` 为纯函数 reducer：delta 向目标 part 追加（无 part 则创建）、`dsl.start` 建立占位 part、`dsl.complete` 写入 schema 并置 ready、`message.end` 置 completed（收尾未 ready 的内容 part）、`message.error` 置 error 并附 error part。对乱序宽容——delta 先于 `message.start` 自动建 assistant 占位；未知事件忽略并 `console.warn`，不抛错。

```ts
interface ChatTransport {
  send(input: { text: string; conversationId?: string }): AsyncIterable<ChatEvent>;
}
```

`runChatTurn(store, transport, input, options?)` 先 append user 消息（completed）与 assistant 占位（pending），再 for-await 逐事件 reduce；transport 抛错收敛为 `message.error`，流正常结束但未收到 `message.end` 时兜底 completed。`options.signal`（AbortSignal）abort 时停止消费事件流，assistant 消息以 `cancelled` 收尾并正常返回（不抛错）。真实 SSE / WebSocket 客户端由业务实现；`createManualDriver()`（`push` / `complete` / `fail`）供测试与手动驱动。

`runRegenerateTurn(store, transport, options?)` 实现"重新生成"：定位末条 user 消息 → `removeMessagesFrom` 截断其后消息 → 以同文本重跑 turn（不重复追加 user 消息），支持 `signal` 取消，无 user 消息时告警返回。

`tool.start` 事件可携带 `args`，供活动轨迹渲染参数摘要。活动轨迹的推导层为零 React 纯函数：`detectStreamingMode(message)` 返回 `reasoning | tool | responding | null`；`pairToolTraces(parts)` 把 tool-call 与 tool-result 按 name + 出现顺序配对为 `ToolTraceEntry`（名称 / 参数 / 状态 / part 下标）。

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

- **`<ChatView store transport? onSend? safeRegistry? capabilities? permission? confirm? conversationId? user? params? greeting? subtitle? suggestions?>`**：`useSyncExternalStore` 订阅消息列表 + Composer。发送时 `onSend` 回调先行，注入 `transport` 时同时驱动一轮 turn（通常二选一）。流式中 Composer 按钮变为停止按钮（点击 abort 当前 turn）；消息区贴底自动跟随，上翻释放、回底恢复，释放期间显示"回到底部"浮动按钮。空会话渲染空状态：问候语（`--pactor-chat-font-display` 衬线展示字体）+ 可选副标题 + `suggestions` 起始建议（字符串或 `{ label, prompt? }`，点击即发送；空数组 / 未传不渲染建议区）。Composer 扩展 props（`attachments` / `onAttachmentsChange` / `onAttachFiles` / `onAttachmentClick` / `toolbarStart` / `toolbarEnd` / `onMentionTrigger` / `onPlusMenu`）原样透传给内建 Composer，语义见下方 `<Composer>`。
- **`<MessageBubble>`**：user 右侧圆角气泡、assistant 左侧通栏排版、system 居中弱提示，parts 按序逐个渲染。
- **`<ActivityTrace>`**：assistant 消息顶部的活动轨迹——流式状态头（动画图标 + 呼吸文案 + 秒级计时，结束定格）+ tool-call / tool-result 配对轨迹条目（单行：名称 + 参数摘要 + 状态图标，展开显示参数与结果/错误）。折叠状态机：流式展开 → 进入答案阶段自动折叠 → 用户手动操作后 pin（按消息记忆）。
- **`<PartRenderer>`**：text → 文本段落；markdown → pactor-markdown 安全渲染器（streaming 期间经 `useSmoothStreamText` 打字机揭示）；dsl → runtime 渲染（Safe Registry + chat 作用域）；tool-call / tool-result → 移交 ActivityTrace 配对渲染；thinking → 自绘折叠卡（markdown 正文，流式展开 + 进行中指示，答案阶段自动折叠，支持 pin）；error → 自绘警示条（附重试入口）；status → 弱提示。
- **`<MessageActions>`**：hover 显现的消息操作条——复制（写入剪贴板并反馈已复制）、末条 completed assistant 重新生成（接入 `runRegenerateTurn`）、user 消息内联编辑重发（确认 → 截断 + 重跑，取消不改 store）、error 消息重试。
- **`<Composer>`**：自适应高度 textarea（上限 200px）；Enter 发送、Shift+Enter 换行；IME 合成进行中 Enter 不发送；空文本不发送；发送按钮状态机（disabled / ready / streaming 停止，同元素切换）。扩展点：`attachments` + `onAttachmentsChange` 受控附件（图片缩略图 / 文档卡片 + 移除），粘贴 / 拖拽 / 文件选择产出 `File[]` 经 `onAttachFiles` 交给调用方（包内不上传），点击卡片经 `onAttachmentClick` 通知；`toolbarStart` / `toolbarEnd` 渲染槽；词边界 `@` 触发 `onMentionTrigger(query, anchorRect)`，"+" 按钮触发 `onPlusMenu(anchorRect)`（未传回调不渲染入口，弹层由调用方渲染）。

:::note
数据由调用方经接口注入：包内不发起网络请求、不读取外部数据源。greeting / suggestions / attachments 等为受控 props，文件上传、提及列表、附件预览由调用方实现后经回调回写。`examples/chat` 提供内存级参考实现（data URL 伪上传、工具栏 chip）。
:::

### 流式交互 hooks

- **`useSmoothStreamText(content, isStreaming, options?)`**：rAF 打字机平滑——streaming 期间按 backlog 自适应速率逐帧揭示文本（每帧 `max(2, backlog/5)`，封顶 120 字符），流停止立即对齐全文，内容回缩立即回退，`enabled: false` 直通。
- **`useChatAutoScroll({ messageCount, lastContentLength, isStreaming })`**：返回 `{ containerRef, isFollowing, scrollToBottom }`；跟随期间钉底，上翻超 80px 释放、回底 40px 内恢复。滚动容器需 `overflow-anchor: none`（styles.css 已内置）。

## 皮肤

视图颜色全部经 `--pactor-chat-*` CSS 变量表达，样式表 `pactor-chat/styles.css`（使用前必须引入）：

```ts
import 'pactor-chat/styles.css';
```

换肤契约与 pactor-ui-radix 一致：覆盖 CSS 变量 / `<html data-pactor-theme="dark">` 启用内置暗色 / 直接覆盖 `.pactor-chat-*` class。主要变量：`--pactor-chat-bg/fg/muted/muted-fg/card/border/primary/primary-fg/danger/success`、`--pactor-chat-user-bubble-bg/border`、`--pactor-chat-code-bg`、`--pactor-chat-radius`、`--pactor-chat-font-display`（衬线展示字体栈，用于空状态问候与布局标题）。动画（呼吸文案、发送按钮 streaming 光环、状态图标脉冲）为纯 CSS keyframes。

## chat 布局注册

`registerChatLayout(layoutRegistry)` 注册 `chat` 布局（header 标题区 + ChatView 区，V1 无会话历史侧栏）；注册后 `resolveLayout(registry, 'chat')` 命中，可与其他布局一样经 DSL `layout` 字段使用。
