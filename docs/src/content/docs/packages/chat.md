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
import { createShadcnComponentRegistry } from 'pactor-ui/components';
import {
  ChatView,
  ConversationStore,
  createManualDriver,
  createSafeRegistry,
} from 'pactor-chat';

const store = new ConversationStore();
// Safe Registry：LLM 生成的 DSL 只渲染白名单内的组件
const safeRegistry = createSafeRegistry(createShadcnComponentRegistry(), [
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

换肤契约与 pactor-ui 一致：覆盖 CSS 变量 / `<html data-pactor-theme="dark">` 启用内置暗色 / 直接覆盖 `.pactor-chat-*` class。主要变量：`--pactor-chat-bg/fg/muted/muted-fg/card/border/primary/primary-fg/danger/success`、`--pactor-chat-user-bubble-bg/border`、`--pactor-chat-code-bg`、`--pactor-chat-radius`、`--pactor-chat-font-display`（衬线展示字体栈，用于空状态问候与布局标题）。动画（呼吸文案、发送按钮 streaming 光环、状态图标脉冲）为纯 CSS keyframes。

## chat 布局注册

`registerChatLayout(layoutRegistry)` 注册 `chat` 布局（header 标题区 + ChatView 区，V1 无会话历史侧栏）；注册后 `resolveLayout(registry, 'chat')` 命中，可与其他布局一样经 DSL `layout` 字段使用。

## Chat：一等 DSL 组件

`Chat` 是与 Button / Input 同级的 DSL 组件（spec: chat-dsl-component）：`registerChatComponent(registry)` 注册一次（已存在同名类型时不覆盖），页面 DSL 以 `{ type: 'Chat', props, events }` 声明完整聊天工作区（AppShell 侧栏 + header + ChatView）。服务注入与组件声明解耦：宿主在根部用 `ChatServicesProvider` 注入一次 `ChatServices`（与 `ChatWorkspaceServices` 同型，`transport` 必填），`Chat` 就近从 context 读取；未注入时渲染受控「未配置聊天服务」提示并 `console.warn`，不抛错。

```tsx
import { Registry } from 'pactor-core';
import { createPageRuntime } from 'pactor-runtime';
import { ChatServicesProvider, registerChatComponent } from 'pactor-chat';
import chatPageDsl from './chat.page.yaml';

const components = new Registry<unknown>('ComponentRegistry');
registerChatComponent(components);
const runtime = createPageRuntime(chatPageDsl, { components });

<ChatServicesProvider value={{ transport, safeRegistry, ... }}>
  {runtime.render()}
</ChatServicesProvider>;
```

```yaml
dsl: '1.0'
page: { id: chat, title: 聊天页 }
state: { activeMenu: new }
body:
  type: Chat
  props:
    title: 助手工作区          # showHeader: false 可关闭 header
    greeting: 你好
    activeMenuKey: ${state.activeMenu}
    menu:
      - { key: new, label: 新建对话, icon: plus }
      - { key: s1, label: 本月报表分析, icon: history, group: 历史会话 }
  events:
    onMenuSelect:              # event 作用域：event.key / event.item
      - action: setState
        params: { activeMenu: ${event.key} }
    onSend:                    # event 作用域：event.text（与 transport turn 并行）
      - action: setState
        params: { lastSent: ${event.text} }
```

- **菜单**：`menu: ChatMenuItem[]`（`key / label / icon? / badge? / disabled? / group?`）驱动内建侧栏（AppShell 承载，移动端为抽屉）；`icon` 字符串名映射内置 lucide 子集（plus / chat / history / settings / star / search / user / folder），未知名渲染占位圆点；`group` 渲染分组标题行；`activeMenuKey` 为受控 prop，典型闭环是 `${state.x}` 绑定 + `onMenuSelect` 调 `setState`；disabled 项不触发 `onMenuSelect`。
- **Header 三层**：`title` 标量 → `headerExtra?: DslNode | ReactNode`（标题右侧槽）→ `header?: DslNode | ReactNode`（整体替换）；`showHeader: false` 关闭。DslNode 槽仅页面运行时可渲染；纯 React 场景传 ReactNode，误传 DslNode 时告警并跳过。
- **侧栏槽**：`sidebar?: DslNode | ReactNode` 提供时整体替代内建菜单侧栏。
- **React 直连**：`<ChatServicesProvider>` + `<Chat>` 可直接作为 React 组件使用（`onSend?(text)` / `onMenuSelect?(key, item)` 为普通函数 props）。`createChatWorkspace` 保留为兼容路径，内部与 `Chat` 共用同一组合（`ChatComposition`），行为不变。

完整装配参考 `examples/chat`。

### 产出物面板（Inspector）

`Chat` 支持右侧产出物预览面板（spec: chat-artifact-panel），承载 LLM/Agent 的结果物（报告、代码、页面片段），可关闭/隐藏：

- **模型**：`ChatArtifact { id, kind: 'markdown' | 'code' | 'text' | 'dsl', title, content, language?, meta? }`；`ArtifactStore`（`get/subscribe/open/update/close`，ConversationStore 同模式，可经 services `artifactStore` 注入）。
- **受控配置**：`artifact` / `panelOpen` 可绑 `${state.x}`；`events.onPanelClose` 在关闭按钮/遮罩点击时触发（典型接法 setState panelOpen=false）；`inspector?: DslNode | ReactNode` 槽整体替代面板内建渲染。
- **内建渲染器**按 kind 分发：`markdown` 走 pactor-markdown 安全渲染、`code` 只读代码块（language 角标）、`text` 预格式文本、`dsl` 经 Safe Registry 守卫 + renderChildren 活预览（拦截/失败降级不抛错）。
- **LLM → 面板联动**：`ChatPart` 新增 `artifact` part，消息流内联渲染"产出物卡片"（含"在面板中打开"按钮）；part 就绪时触发 `events.onArtifact`（event 作用域含 `artifact`），DSL 侧典型接法 `setState artifact=${event.artifact}, panelOpen=true`——框架不擅自开面板。
- **布局**：桌面固定宽右栏（`--pactor-chat-inspector-width`，缺省 320px）；窄屏（<768px）退化为右侧覆盖抽屉（遮罩点击关闭）。未配置面板时零渲染。

```yaml
state: { panelOpen: false }
body:
  type: Chat
  props:
    artifact: ${state.artifact}
    panelOpen: ${state.panelOpen}
  events:
    onArtifact:    # artifact part 就绪 → 开面板
      - action: setState
        params: { artifact: ${event.artifact}, panelOpen: true }
    onPanelClose:
      - action: setState
        params: { panelOpen: false }
```

### ChatShell：菜单外壳

`ChatShell`（随 `registerChatComponent` 一并注册，React 同名组件亦可直接用）是**不含聊天与路由逻辑**的外壳：AppShell + 内建菜单侧栏（与 `Chat` 同款 `menu` / `activeMenuKey` / `onMenuSelect`，图标白名单一致）+ `content: DslNode | ReactNode` 主区槽 + `sidebar` 替代槽。用于"菜单切换到非对话页"的工作区应用：DSL 场景 content 槽内放 `when` 条件子树（onMenuSelect → setState 闭环）；路由场景 content 传路由出口（onMenuSelect → 导航）。嵌入的 `Chat` 不传 `menu` 即为无侧栏形态；会话状态经共享 `services.store` 跨页面切换存活。路由化多页装配参考 `examples/chat`（HashRouter + MenuRegistry + DynamicDslRoute，刷新按 URL 还原页面）。

## AppShell 应用外壳

`<AppShell sidebar brand? locationKey? className?>` 是更外层的应用外壳（与 ChatLayout 组合而非替代）：侧栏插槽 + 主区。桌面（≥768px）侧栏与主区 flex 同行；移动端（<768px）侧栏变为覆盖抽屉（遮罩 + 顶栏菜单按钮 + `brand` 品牌区），断点由 CSS 媒体查询表达（`--pactor-chat-sidebar-width` 等令牌可覆盖），JS 只管开合。关闭语义：Escape / 遮罩点击 / `locationKey` 变化（路由或会话切换时传入变化的 key，渲染期比较关闭）；移动端关闭时侧栏容器 `inert`。侧栏内容（如会话列表）在导航后调用 `useSidebarDrawer()?.close()` 关抽屉（壳外返回 null）。示例见 `examples/chat`。

## DSL 页面：createChatWorkspace

聊天页可以与其他 pactor 页面一样以 `*.page.yaml` 声明、经 `createPageRuntime` 渲染。函数 / 实例无法从 DSL 产生，故运行时服务（`transport` 必填；`store` / `storeFactory`、`safeRegistry`、`capabilities`、`permission`、`confirm`、`user`、附件回调、`onMentionTrigger` / `onPlusMenu`、`toolbarStart` / `toolbarEnd` ReactNode 槽、`headerExtra` 可选）一律由宿主经 `createChatWorkspace(services)` 工厂闭包注入，返回的 `ChatWorkspace` 组件注册进页面运行时组件注册表（`options.components`）。

组件 props 全部为 DSL 可表达的标量 / 数组：`title?`（工作区头部标题，与 `headerExtra` 任一存在即渲染头部）/ `greeting?` / `subtitle?` / `suggestions?` / `conversationId?` / `params?`；另支持两个 DslNode 槽——`sidebar?`（提供时以 AppShell 包裹工作区）与 `toolbarEnd?`——renderer 对内嵌 DslNode prop 跳过提前求值，组件内经 `useRenderer().renderChildren` 渲染（Table `columns[].cell` 同款机制），仅页面运行时上下文内有效。

组件自持 `ConversationStore`（外部 `store` > `storeFactory` > 默认构造，ref 保持——重渲染不重建）与附件受控状态（`onAttachFiles` 回传的附件追加、发送后清空）。完整装配参考 `examples/chat`（`chat.page.yaml` + `App.tsx` 宿主装配）。
