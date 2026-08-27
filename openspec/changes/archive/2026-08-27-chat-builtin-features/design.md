# Design: chat-builtin-features

## Context

examples/chat 的 App.tsx 证明：用 pactor-chat 搭一套可用对话系统，宿主要手写 Header（标题编辑/导出/主题/清空）、ModelSelector（模型 chip + Popover）、PlusMenu / MentionListbox / ContextPickerModal（锚定弹层）等通用组件，真正业务化的只有数据。这些组件存在的根本原因是包只提供了函数型扩展点（`onPlusMenu(anchorRect)` / `onMentionTrigger(query, anchorRect)` / toolbar 槽），弹层交互 DSL 表达不了，于是每个宿主都重写一遍。

约束（既有契约，不可破坏）：

- pactor-chat 对 pactor-ui **零运行时依赖**（ChatLayout.tsx:26-28 注释明确）——内建弹层不能 import pactor-ui
- DSL props 只承载可序列化数据，函数/实例经 ChatServicesProvider 注入（chat-workspace.tsx:19-22）
- 组件样式自持：新 UI 的样式进 packages/chat/styles.css，用语义令牌
- 现有槽位/回调路径原样保留（无 BREAKING）

## Goals / Non-Goals

**Goals:**

- 模型选择、header 操作组（导出/主题/清空/标题编辑）、+/＠ 上下文弹层成为包内建能力，DSL props 即可开启
- 上下文候选数据支持声明式来源：静态数组或 `{ service, params? }` 引用
- 选中模型与上下文 chips 进入 `ChatInput`，transport 能拿到完整输入
- examples/chat 删除全部宿主槽位组件，验证"DSL + 服务注入"即可装配对话系统

**Non-Goals:**

- 不做声明式 transport（SSE 工厂）——独立 change
- 不做 runtime ServiceRegistry 与 chat 的直接集成（createPactorApplication 吸收 chat 场景）——本 change 只定义服务桥接口，app 侧接线留待后续
- 内建弹层不做虚拟滚动、拼音搜索等增强；候选项量级按百级设计
- 主题切换只写 `data-pactor-theme`，不做多套主题令牌管理

## Decisions

### D1: 服务桥 `callService` 进 ChatServices

`contexts[].source` 为 `{ service: 'agents', params? }` 时，包内需要把"服务名"解析成数据。新增可选服务：

```ts
interface ChatServices {
  // ...既有字段
  /** 声明式数据源解析出口：contexts 的 service 引用经此调用（宿主桥到 ServiceRegistry 或自有实现） */
  callService?: (name: string, params?: Record<string, unknown>) => Promise<unknown>;
}
```

**为什么不是 props 预求值**：DSL 表达式 `${...}` 求值在渲染前，service 调用是异步且需要运行时上下文的；让表达式直接调服务会污染表达式作用域契约。**为什么不直接给 Chat 组件访问 ServiceRegistry**：chat 包不依赖 runtime 包，且纯 React 场景没有 ServiceRegistry——桥接口两边都能实现（examples 桥到本地 mock 函数表；未来 pactor-app 桥到共享 ServiceRegistry，一行接线）。

未配置 `callService` 而 contexts 引用 service 时：弹层渲染内联错误提示（非抛错），与 Safe Registry 的受控降级同款取向。

### D2: ChatInput 扩展 model / contexts

```ts
interface ChatInput {
  text: string;
  conversationId?: string;
  model?: string;                 // 当前选中模型 value
  contexts?: ChatContextItem[];   // 当前生效的上下文 chips
}
```

可选字段，transport 实现方自行消费；mock/旧实现不受影响的纯加字段。发送后 chips 清空（附件同款语义：一轮一清）。

### D3: 内建弹层 = 包内迷你锚定弹层

实现 `AnchoredPopover`（内部组件，不导出）：`position: fixed` 按 anchorRect 定位（上方优先、空间不足翻转到下），Escape / 外部点击关闭，焦点返回触发源。不依赖 pactor-ui（守零依赖契约），样式进 styles.css 用语义令牌，视觉对齐 shadcn 皮肤（圆角/边框/阴影令牌已存在）。

模型 chip 同样用 AnchoredPopover（不引入 pactor-ui Popover）。

### D4: 内建 header 操作组为开关 + 并行事件

```ts
interface ChatProps {
  /** 内建 header 操作组：按数组顺序渲染；缺省不渲染任何操作按钮 */
  headerActions?: ('export' | 'theme' | 'clear')[];
  /** 标题可编辑（点击进入编辑，Enter/blur 提交）；缺省 false */
  editableTitle?: boolean;
  onExport?: ...; onThemeChange?: ...; onClear?: ...; onTitleChange?: ...;
}
```

- **默认行为总在包内执行**：export = store 消息序列化 Markdown 并触发下载；theme = 切换 `document.documentElement` 的 `data-pactor-theme`；clear = `store.clear()`。事件为**并行通知**（与 onSend 同款语义），不做拦截器——要完全不同行为的宿主用既有 `header` 槽整体替换，不需要"半拦截"的复杂契约
- 事件经 ChatDslAdapter 折算进 event 作用域（`event.title` / `event.theme` 等），DSL 侧 `events.onClear → message` 即可加 toast
- 操作组渲染在内建 header 的 headerExtra 槽位**之前**，与 headerExtra 共存

### D5: 受控/非受控规则

- **model**：`model` + `onModelChange` 提供即受控（DSL 侧 `model: ${state.model}` + setState 闭环）；只给 `models` 时包内非受控（缺省 `models[0]`，state 自持）。`models` 缺省不渲染模型 chip
- **chips**：包内受控状态（选中追加、点 x 移除、发送后清空），`onContextsChange` 并行通知；不提供外部受控 props（V1 不需要——宿主持久化场景经通知自行落库）
- **入口渲染条件**：`contexts` 中存在 `trigger: '+'` 项才渲染 "+" 按钮；存在 `trigger: '@'` 项才启用 @ 检测。**调用方回调优先**：`onPlusMenu` / `onMentionTrigger` 提供时接管对应入口（内建弹层不渲染），现有宿主自定义路径零影响
- **chip 去重**：同 `trigger` 同 `id` 的项重复选中时忽略（chip 载荷只带 trigger 不带 source 标识，trigger+id 是 chips 数组上可判定的最简键）

### D6: ChatInput.contexts 的载荷形态

`ChatContextItem = { id, label, trigger, data? }`——`label` 用于 chip 展示与发送文本注入；`data` 为 source 项的原始数据（如 agentId），transport 可结构化消费。Composer 发送文本 = 输入框文本；chips 不拼接进 text（避免污染用户原文），只进 `contexts` 字段。

## Risks / Trade-offs

- [服务桥解析失败/慢（网络）] → 弹层内 loading 与内联错误态；结果按 `source` 键做会话级缓存（同一弹层会话不重复请求）
- [内建弹层与 pactor-ui 视觉漂移] → 样式只用语义令牌（`--popover`/`--border`/`--radius` 等），与 shadcn 皮肤同源；视觉验收走 playwright 截图对比现有示例
- [theme 操作写 documentElement 与宿主自管理冲突] → 宿主把 `theme` 从 headerActions 剔除即可完全自管；事件通知让宿主可同步自身状态
- [功能增多导致 Chat props 膨胀] → 接受：每个特性独立缺省关闭，零配置时 DOM 与现状逐字节一致（面板同款"零渲染承诺"）

## Migration Plan

纯新增：无迁移步骤。examples/chat 的改造即回归验证——删除宿主组件后行为应与现状等价（导出/清空/主题/模型/+/＠ 全部可用）。
