# @pactor-app/chat

[Pactor](https://github.com/426-330/pactor) 的 Chat 包：AI Message Rendering Protocol（消息模型 / Streaming reducer / Safe Registry / capability 动作）与 Chat Runtime 视图（`<ChatView>` / `<MessageBubble>` / `<PartRenderer>` / `<Composer>` / chat 布局）。核心是"协议 + Runtime"而非单个组件；model / store / events / reducer / safe-registry / capability 零 React，可纯 Node 测试。

## 安装

```bash
npm install @pactor-app/chat @pactor-app/runtime @pactor-app/markdown react
# 或
pnpm add @pactor-app/chat @pactor-app/runtime @pactor-app/markdown react
```

`react >= 18` 为 peer dependency。

视图组件（ChatView / Chat / ChatShell 等）样式自持，使用前引入样式表并给宿主容器显式定高（组件填满父容器，`height: 100%`）：

```ts
import '@pactor-app/chat/styles.css';
```

## 示例

```tsx
import { createComponentRegistry } from '@pactor-app/ui/components';
import {
  ChatView,
  ConversationStore,
  createManualDriver,
  createSafeRegistry,
} from '@pactor-app/chat';

const store = new ConversationStore();
// Safe Registry：LLM 生成的 DSL 只渲染白名单内的组件
const safeRegistry = createSafeRegistry(createComponentRegistry(), [
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
- **`applyChatEvent(store, event)`**（零 React）：Streaming 纯 reducer。事件：`message.start` / `text.delta`（`format: 'markdown'` 建 markdown part）/ `thinking.delta` / `tool.start`（可携带 `args`，供活动轨迹参数摘要）/ `tool.result` / `dsl.start` / `dsl.complete` / `artifact`（一次性写入 ready 的产出物 part；partId 命中既有 part 时原地更新）/ `message.end` / `message.error`。对乱序宽容（delta 先于 start 自动建占位）、未知事件忽略并告警；`dsl.patch` V1 不实现。
- **`ChatTransport` / `runChatTurn(store, transport, input)`**：`send({ text, conversationId? }) → AsyncIterable<ChatEvent>`；turn 先 append user 消息 + assistant 占位再逐事件 reduce，transport 抛错收敛为 `message.error`。`createManualDriver()` 提供代码控制推送事件的 transport（`push` / `complete` / `fail`），测试与手动驱动共用。
- **`runRegenerateTurn(store, transport, options?)`**（零 React）：定位末条 user 消息 → `removeMessagesFrom` 截断其后消息 → 以同文本重跑 turn（`options.skipUserMessage`，不重复追加 user 消息）；支持 `signal` 取消；无 user 消息时告警返回。消息操作条的"重新生成 / 错误重试"即接入此函数。
- **`detectStreamingMode(message)` / `pairToolTraces(parts)`**（零 React 纯函数）：活动轨迹的推导层——前者返回 `reasoning | tool | responding | null`；后者把 tool-call 与 tool-result 按 name + 出现顺序配对为 `ToolTraceEntry`（名称 / 参数 / 状态 / part 下标）。
- **`createSafeRegistry(source, allowed)`**：白名单过滤的组件注册表（get / has / list 取 `allowed ∩ source`，实时代理）。LLM 生成的 DSL 必须经 Safe Registry 渲染；白名单外节点渲染受控"不允许"占位（`guardChatDsl` + `ChatDenied`）。
- **`registerCapabilityAction(actions, { capabilities, permission?, confirm? })`**：注册 `capability` 动作，执行链 registry → permission → confirm（`risk: 'high'` 且注入 confirm 时；取消返回 `{ ok: true, skipped: true }`，未注入 confirm 受控拒绝）→ execute。DSL 侧：`{ action: 'capability', params: { name, params } }`。
- **`createChatRuntime({ safeRegistry, capabilities?, permission?, permissionStore?, confirm?, user? })`**：组装 Chat DSL 渲染运行时（Safe Registry + 内置动作 + capability 动作 + 权限适配器）；`buildChatScope({ conversation, message, params })` 组装 chat 作用域（`user` 经 RuntimeContext 注入）。
- **`<ChatView store transport? onSend? safeRegistry? capabilities? permission? confirm? conversationId? user? params? greeting? subtitle? suggestions?>`**：消息列表 + Composer。发送时 `onSend` 回调先行，注入 `transport` 时同时驱动一轮 turn。空会话渲染 `<EmptyState>`：问候语（`--pactor-chat-font-display` 衬线展示字体）+ 副标题 + `suggestions` 起始建议（字符串或 `{ label, prompt? }`，点击即发送，空数组不渲染建议区）。Composer 扩展 props（`attachments` / `onAttachmentsChange` / `onAttachFiles` / `onAttachmentClick` / `toolbarStart` / `toolbarEnd` / `onMentionTrigger` / `onPlusMenu`）原样透传给内建 Composer，语义见下方 `<Composer>`。
- **`<MessageBubble>` / `<PartRenderer>`**：按 role 区分气泡；parts 按类型渲染（text / markdown / dsl / error 附重试入口 / status / artifact 产出物卡片）；thinking 折叠卡与 tool-call / tool-result 配对轨迹移交 `<ActivityTrace>`；assistant 终态消息底部展示时间戳（当天 HH:mm、非当天带日期，`formatMessageTime`；流式中与无 createdAt 的历史消息不展示，user / system 不展示）。
- **`<ActivityTrace>`**：流式状态头（动画图标 + 呼吸文案 + 秒级计时，结束定格）+ 配对工具轨迹条目（单行：名称 + 参数摘要 + 状态图标，展开显示参数与结果/错误）+ thinking 折叠卡（与工具列表为独立块）；状态头统一折叠/展开全部内容——流式展开 → 答案阶段自动折叠（单向闩锁：折叠一次后 mode 回跳不重新自动展开，防闪烁）→ 用户 pin 后不再自动变更（按消息记忆）。
- **`<ArtifactPanel artifact? artifacts? inspector? artifactViewers? onClose? onSelectArtifact?>`**：产出物预览面板——标题栏（可选目录列表钮 + 标题 + kind 角标 + 下载钮 + 关闭钮）+ 内容区。内建渲染 markdown / code / text / dsl（Safe Registry 活预览）+ 图片类文件（png / jpg / svg / webp 等，经 `fileType` 或 title 扩展名识别，svg 支持原始标记）；`artifactViewers` 按键（扩展名 / kind）对特定格式自定义预览，优先内建；多产物时 header 文件名处为切换下拉，左端目录钮展示产物目录列表（目录视图下返回钮隐藏、标题显示"产物目录"）；下载钮把当前产物存为本地文件（dsl 存 JSON，图片 URL fetch 失败降级新标签）；桌面固定宽右栏（默认宽 = `--pactor-chat-content-width`，宽度夹取 `--pactor-chat-inspector-min-width` 480px ~ host 宽 2/3），背景 `--pactor-chat-inspector-bg` 略深于聊天区，窄屏覆盖抽屉。
- **`ArtifactStore` / `collectArtifacts` / `mergeArtifacts`**（零 React）：产出物列表容器——`open` 按 id upsert 并激活、`list()`（引用稳定）/ `activate(id)` / `update(patch)`（补丁激活项）/ `close()`（只关面板，列表保留）/ `subscribe`；`collectArtifacts(messages)` 从消息流归集 ready 产出物（tabs / 目录列表默认数据源），`mergeArtifacts(stream, opened)` 合并归集与打开记录（store 补丁版本优先）。
- **`downloadArtifact` / `resolveArtifactFilename` / `buildArtifactBlob`**（产物下载）：文件名按 title（无扩展名补 fileType / kind 缺省）；文本类存 UTF-8 Blob，dsl 存格式化 JSON，svg 原始标记存 image/svg+xml，图片 http(s) URL fetch 取回（失败降级新标签打开）。
- **`<MessageActions>`**：消息操作条（hover 显现），数据驱动渲染——`actions` 缺省为 `['copy', 'regenerate', 'retry', 'edit']`：复制（`collectMessageText` 汇总文本写入剪贴板）、末条 completed assistant 重新生成、user 消息气泡内联编辑重发（确认 → 截断 + 重跑，取消不改 store）、error 消息重试。传入数组时严格按数组渲染（数组即真相），内建动作可按字段覆盖 label / icon / roles / visibleWhen，自定义动作经 `callService(service, { actionId, message })` 派发；图标名走 `MESSAGE_ACTION_ICONS` 白名单（未知名渲染占位图标）。详见下文「消息操作条：messageActions」。
- **`<Composer>`**：自适应高度 textarea；IME 合成守卫（合成中 Enter 不发送）；发送按钮状态机（disabled / ready / streaming 停止，同元素切换 + 纯 CSS 光环）；受控附件 `attachments` + `onAttachmentsChange`（图片缩略图/文档卡片 + 移除），拖拽悬停态、粘贴与文件选择产出 `File[]` 经 `onAttachFiles` 交给调用方（包内不上传），点击卡片经 `onAttachmentClick` 通知；`toolbarStart` / `toolbarEnd` 渲染槽；词边界 `@` 触发 `onMentionTrigger(query, anchorRect)`，"+" 按钮触发 `onPlusMenu(anchorRect)`（未传回调不渲染入口，弹层由调用方实现）。
- **`<AppShell sidebar brand? locationKey? className?>`**：应用外壳——侧栏插槽 + 主区。桌面（≥768px）侧栏与主区 flex 同行；移动端（<768px）侧栏退出文档流变为覆盖抽屉（遮罩 + 顶栏菜单按钮 + `brand` 品牌区），断点由 CSS 媒体查询表达，JS 只管开合。抽屉打开时 Escape / 遮罩点击关闭；`locationKey` 变化（路由 / 会话切换）渲染期自动关闭；移动端关闭时侧栏容器 `inert`。侧栏内容经 `useSidebarDrawer()` 取 `{ close }`（壳外返回 null），导航后可关闭抽屉。
- **`registerChatLayout(layoutRegistry)`**：注册 `chat` 布局（header 标题区 + ChatView 区，V1 无会话历史侧栏），`resolveLayout(registry, 'chat')` 命中。
- **`Chat` / `registerChatComponent(registry)`**：一等 DSL 聊天工作区组件，见下节。
- **`createChatComponentRegistry()`**：便捷工厂——创建含全部内置组件 + Chat / ChatShell 的组件注册表，直接作为 `createPactorApplication` 的 `componentRegistry` 选项。
- **`createChatWorkspace(services)`**：React 直连路径的工作区工厂（内部与 Chat 共用同一组合），见下文「DSL 页面：createChatWorkspace」。

## Chat：一等 DSL 组件

`Chat` 是与 Button / Input 同级的 DSL 组件：注册一次后，任意页面 DSL 里 `{ type: 'Chat', props, events }` 即可声明完整聊天工作区（AppShell 侧栏 + header + ChatView）。与 `createChatWorkspace` 的区别是**服务注入与组件声明解耦**——宿主在应用根部用 `ChatServicesProvider` 注入一次服务，`Chat` 组件就近从 context 读取；未注入时渲染受控「未配置聊天服务」提示并 `console.warn`，不抛错。

```tsx
import { Registry } from '@pactor-app/core';
import { createPageRuntime } from '@pactor-app/runtime';
import {
  ChatServicesProvider,
  registerChatComponent,
} from '@pactor-app/chat';
import chatPageDsl from './chat.page.yaml';

const components = new Registry<unknown>('ComponentRegistry');
registerChatComponent(components); // 已存在 Chat 类型时不覆盖
const runtime = createPageRuntime(chatPageDsl, { components });

// 服务（ChatServices，与 ChatWorkspaceServices 同型：transport 必填，
// store / safeRegistry / capabilities / confirm / 附件与弹层回调等可选）
// 在根部注入一次
<ChatServicesProvider value={{ transport, safeRegistry, ... }}>
  {runtime.render()}
</ChatServicesProvider>;
```

```yaml
# chat.page.yaml：菜单 / header / 问候建议均为 DSL 配置
dsl: '1.0'
page: { id: chat, title: 聊天页 }
state:
  activeMenu: new
body:
  type: Chat
  props:
    title: 助手工作区            # 内建 header 标题；showHeader: false 可关闭 header
    greeting: 你好
    suggestions:
      - { label: 今天天气怎么样, prompt: 今天天气怎么样 }
    activeMenuKey: ${state.activeMenu}   # 受控高亮，可绑 DSL state
    menu:                        # 内建侧栏（AppShell 承载，移动端为抽屉）
      - { key: new, label: 新建对话, icon: plus }
      - { key: s1, label: 本月报表分析, icon: history, group: 历史会话 }
  events:
    onMenuSelect:                # event 作用域：event.key / event.item
      - action: setState
        params: { activeMenu: ${event.key} }
    onSend:                      # event 作用域：event.text（与 transport turn 并行）
      - action: setState
        params: { lastSent: ${event.text} }
```

- **菜单**：`menu: ChatMenuItem[]`（`key / label / icon? / badge? / disabled? / group?`）驱动内建侧栏；`icon` 为字符串名，映射内置 lucide 子集（plus / chat / history / settings / star / search / user / folder），未知名渲染占位圆点不抛错；`group` 渲染分组标题行；`activeMenuKey` 为受控 prop，典型用法是 `${state.x}` 绑定 + `events.onMenuSelect` 调 `setState` 闭环；disabled 项不触发 `onMenuSelect`。
- **Header 三层**：`title` 标量 → `headerExtra?: DslNode | ReactNode`（标题右侧槽）→ `header?: DslNode | ReactNode`（整体替换内建 header）；`showHeader: false` 关闭。header 渲染为全宽容器（产物面板 host / with-header 包裹层）的直接子级，不随对话列限宽——产物面板调宽时保持通栏。DslNode 槽仅在页面运行时（DslRenderer）上下文内经 `useRenderer().renderChildren` 渲染；纯 React 场景传 ReactNode，误传 DslNode 时告警并跳过（不抛错）。
- **侧栏槽**：`sidebar?: DslNode | ReactNode` 提供时整体替代内建菜单侧栏（仍以 AppShell 承载）。
- **产出物面板**：`artifact` / `panelOpen` 受控 props（典型 `${state.x}` 绑定），事件 `onArtifact`（part 就绪）/ `onOpenArtifact`（卡片打开）/ `onPanelClose` / `onSelectArtifact`（tab / 目录列表切换，典型接法 `setState artifact=${event.artifact}`）；多产物清单由组合层自动从消息流归集，无需 DSL 接线；自定义预览经 `ChatServicesProvider` 注入 `artifactViewers`（函数不进 DSL）。详见上文 `<ArtifactPanel>` 与 `examples/chat/src/chat.page.yaml`。
- **React 直连**：`<ChatServicesProvider>` + `<Chat>` 同样可直接作为 React 组件使用（events 即普通函数 props：`onSend?(text)` / `onMenuSelect?(key, item)`）。`createChatWorkspace` 工厂保留为兼容路径，内部已改为 provider + 同一组合逻辑（`ChatComposition`），行为不变。

### 消息操作条：messageActions

消息气泡下方的操作条（复制 / 重新生成 / 重试 / 编辑）以可序列化 `messageActions` 数组完整声明（spec: chat-message-actions），`ChatView` / `ChatComposition` / `ChatWorkspace` / `Chat` 逐层透传：

```yaml
body:
  type: Chat
  props:
    # 数组即真相：顺序即渲染顺序，未列出的内建动作不出现；
    # 缺省（不配置）等价于 ['copy', 'regenerate', 'retry', 'edit']，与历史行为一致
    messageActions:
      - copy                                  # 字符串项等价于 { id: copy, builtin: copy }
      - retry
      - regenerate
      - { id: edit, builtin: edit, label: 修改并重发 }   # 内建动作按字段覆盖
      - { id: quote, label: 引用回复, icon: quote, service: quoteMessage }  # 自定义动作
  events:
    onMessageAction:          # 任意动作（含内建）点击触发；event 作用域含 action 与 message
      - action: message
        params: { text: 触发消息操作：${event.action} }
```

- **配置形状**：`Array<BuiltinMessageAction | ChatMessageAction>`；`ChatMessageAction = { id, builtin?, label?, icon?, roles?, visibleWhen?, service? }`（全部为 DSL 可表达数据）。`builtin` 指定时复用内建行为与默认描述（copy = assistant+completed；regenerate = assistant+completed 且仅末条且注入 transport；retry = assistant+error 且 transport；edit = user+completed），`label` / `icon` / `roles` / `visibleWhen` 按字段覆盖；「regenerate 仅末条 assistant」与 transport 依赖为不可覆盖的包内约束。
- **可见性**：`roles` 过滤角色后按 `visibleWhen` 匹配消息状态——`'completed'` 匹配非流式非错误终态（含 cancelled），`'error'` 匹配 error，`'always'` 含 streaming（自定义动作缺省 `roles: ['assistant']`、`visibleWhen: 'completed'`）。
- **自定义动作派发**：无 `builtin` 的动作点击时经 `ChatServices.callService(service, { actionId, message })` 派发（未注入 callService 时 console.warn 跳过，不抛错）；内建与自定义动作点击均并行触发 `onMessageAction(actionId, message)` 通知（DSL 侧为 `events.onMessageAction`，event 作用域含 `action` 与 `message`），内建默认行为不受影响。
- **图标**：`icon` 为字符串名，走 `MESSAGE_ACTION_ICONS` 白名单（copy / check / rotate-ccw / pencil / quote / thumbs-up / thumbs-down / share / bookmark），未知名渲染占位图标，不抛错。

完整参考见 `examples/chat`（`chat.page.yaml` 菜单 / state / events + `App.tsx` 宿主装配）。


## DSL 页面：createChatWorkspace

聊天页可以像其他 pactor 页面一样以 `*.page.yaml` 声明、经 `createPageRuntime` 渲染。表达式作用域只承载可序列化数据，函数 / 实例无法从 DSL 产生——因此运行时服务一律由宿主经工厂闭包注入，DSL 只携带标量配置：

```tsx
import { Registry } from '@pactor-app/core';
import { createPageRuntime } from '@pactor-app/runtime';
import { createChatWorkspace } from '@pactor-app/chat';
import chatPageDsl from './chat.page.yaml'; // 经 @pactor-app/vite-plugin 编译

// 宿主装配：全部运行时服务与交互回调经闭包注入（只创建一次，
// 组件身份稳定，内部 store 才不会重建）
const ChatWorkspace = createChatWorkspace({
  transport,                 // 必填：ChatTransport
  store,                     // 可选：外部自持 store（另有 storeFactory）
  safeRegistry, capabilities, confirm,
  onAttachFiles: (files) => upload(files), // 回传 ChatAttachment[]，发送后自动清空
  onMentionTrigger, onPlusMenu,
  toolbarStart: <ToolbarStart />,          // ReactNode 闭包槽
});

const components = new Registry<unknown>('ComponentRegistry');
components.register('ChatWorkspace', ChatWorkspace);
const runtime = createPageRuntime(chatPageDsl, { components });
runtime.render(); // 或 <PageRuntimeView runtime={runtime} />
```

```yaml
# chat.page.yaml：DSL 只声明页面与标量配置
dsl: '1.0'
page: { id: chat, title: 聊天页 }
body:
  type: ChatWorkspace
  props:
    title: 助手工作区        # 工作区头部标题（title 或 headerExtra 存在时渲染头部）
    greeting: 你好
    suggestions:
      - { label: 今天天气怎么样, prompt: 今天天气怎么样 }
```

- **DSL 安全 props**：`title?` / `greeting?` / `subtitle?` / `suggestions?` / `conversationId?` / `params?`——全部为标量 / 数组 / 普通对象；函数与实例一律不出现。
- **DslNode 槽**：`sidebar?: DslNode`（提供时以 AppShell 包裹）、`toolbarEnd?: DslNode`——renderer 对内嵌 DslNode prop 跳过提前求值，组件内经 `useRenderer().renderChildren` 渲染（Table `columns[].cell` 同款机制），仅页面运行时上下文内有效；纯 React 直连场景用服务的 `toolbarEnd` ReactNode 槽。
- **状态自持**：组件内部创建并持有 `ConversationStore`（外部 `store` > `storeFactory` > 默认构造，ref 保持——重渲染 / props 变化不重建）与附件受控状态（`onAttachFiles` 回传追加、发送后清空）。
- **React 直连 vs DSL 页面**：细粒度组装继续用 `<ChatView>`；整页 DSL 化用 `createChatWorkspace` + 页面运行时。完整参考见 `examples/chat`。

> **数据由调用方经接口注入**：包内不发起网络请求、不读取外部数据源。greeting / suggestions / attachments 等均为受控 props；文件上传、提及列表、预览等由调用方实现后经回调回写。`examples/chat` 提供内存级参考实现（data URL 伪上传、工具栏 chip、mention/+ 触发）。

## 安全约定

- LLM 生成的 DSL 只经 Safe Registry 渲染（白名单外组件一律受控占位，props 内嵌 DSL 子树由 runtime 的 UnsupportedComponent 兜底）。
- AI Action 必须经 Capability → Permission → Confirmation → Execute 链；AI DSL 建议只配置 `capability` 动作（Safe Registry 只挡组件，动作侧由 capability 白名单兜底）。
- Markdown 渲染复用 @pactor-app/markdown 安全渲染器（不启用 raw HTML、URL 协议白名单）。

## 文档

完整文档见 <https://github.com/426-330/pactor/tree/main/docs>（`pnpm docs:dev` 本地启动文档站）。

## License

[MIT](../../LICENSE)
