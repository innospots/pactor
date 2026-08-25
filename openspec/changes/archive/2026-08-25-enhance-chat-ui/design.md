# Design: enhance-chat-ui

## Context

`pactor-chat` 当前架构：零 React 核心（model / store / events / transport / safe-registry / capability-action）+ React 视图层（ChatView / MessageBubble / PartRenderer / Composer / ChatLayout），样式为单一 `styles.css` + `--pactor-chat-*` 令牌，暗色经 `[data-pactor-theme='dark']`。参照界面是与其调用方应用状态、协议深度耦合的业务组件；本变更只吸收其**功能模式与视觉语言**，不引用、不绑定其技术栈与代码。

约束：不新增运行时依赖；不引入组件库、样式/动画框架或任何框架专有 API（仅用 React + DOM 标准能力）；核心层保持零 React、Node 可测；现有公开 API 只做向后兼容扩展；**功能与数据一律以接口形式对外输出或由调用方注入**（见 D0）。

## Goals / Non-Goals

**Goals:**
- 空状态欢迎页（问候 + 起始建议）。
- 活动轨迹：流式状态头 + tool-call/tool-result 配对轨迹 + 自动折叠。
- 消息操作：复制 / 重新生成 / 编辑重发 / 错误重试。
- Composer：IME 守卫、四态发送按钮、附件引用卡片、工具栏与提及扩展槽。
- 视觉令牌刷新对齐参照界面的 Claude 风格语言。

**Non-Goals:**
- 会话持久化、多会话侧栏、消息分支树（参考实现的分支只取"编辑重发=截断重跑"语义）。
- 真实 SSE/WebSocket 客户端、语音输入、文件预览抽屉。
- 具体业务 picker（图书/题库/代理列表等）——只提供扩展点。
- i18n 框架接入（沿用包内现有中文文案约定，留待后续）。

## Decisions

### D0: 接口边界——数据由调用方注入，功能以接口输出
包内 MUST NOT 发起网络请求、读取外部数据源或依赖框架专有 API。所有新能力的数据需求通过三类导出接口满足：
- **类型**：`ChatAttachment`、`ChatSuggestion`、`ToolTraceEntry`、各组件 props 类型，全部从 `src/index.ts` 导出；
- **受控值 + 回调**：attachments、suggestions、greeting、onAttachFiles、onAttachmentClick、onMentionTrigger、onPlusMenu 等；
- **纯函数 / hooks**：`detectStreamingMode`、`pairToolTraces`、`runRegenerateTurn`、既有 hooks。
调用方可以用任意后端与数据源实现这些接口；examples/chat 提供内存级参考实现。

### D1: 功能按"视图组件 + 纯函数"拆分，不进核心协议层
新组件放 `src/view/`：`EmptyState`、`ActivityTrace`（内含 `StreamingStatus` / `TraceRow`）、`MessageActions`，Composer 原地重写。所有推导逻辑做成零 React 纯函数（可 Node 单测）：
- `detectStreamingMode(message): 'reasoning' | 'tool' | 'responding' | null`——按 parts 状态推导：thinking streaming → reasoning；存在 running tool → tool；text/markdown streaming → responding。
- `pairToolTraces(parts): ToolTraceEntry[]`——将 tool-call 与 tool-result 按 name + 出现顺序配对（事件模型无 call_id，取同名最早未配对的 running call），输出单行轨迹条目（名称、参数摘要、状态、起止时间）。

**替代方案**：扩展事件模型加 `callId`。否决——改动 SSE 协议面过大，且顺序配对对现有事件流已足够准确。

### D2: 编辑重发与重新生成 = store 截断 + 复用 turn 驱动
`ConversationStore` 新增 `removeMessagesFrom(messageId)`（不可变地移除该消息及之后全部消息）。由此：
- **重新生成**：`runRegenerateTurn(store, transport, opts?)` 取最后一条 user 消息的文本，截断其后消息，调用 `runChatTurn` 但跳过 user 消息追加（新增 `options.skipUserMessage`）。
- **编辑重发**：视图层把气泡换成内联 textarea，确认后 `removeMessagesFrom(userMessage.id)` 再以新文本走正常 `runChatTurn`。
- **错误重试**：error 消息卡片上的 Retry 等价于对末轮执行重新生成。

**替代方案**：参考实现的分支树（parentMessageId + selectedBranches）。否决——复杂度远超收益，留作后续。

### D3: Composer 扩展用受控 props + 渲染槽，不内建业务 UI
- 附件：`attachments: ChatAttachment[]` + `onAttachmentsChange` 受控；组件内建拖拽悬停态与粘贴/文件选择，产出 `File[]` 经 `onAttachFiles(files)` 交给调用方上传，调用方回写 attachments。卡片渲染（图片缩略图/文档图标卡）由包内完成；点击经 `onAttachmentClick` 通知调用方（预览抽屉由调用方实现）。
- 工具栏：`toolbarStart` / `toolbarEnd: ReactNode` 槽位，调用方注入 capability/模型/知识库选择器 chip。
- 提及/菜单：`onMentionTrigger(query, anchorRect)` / `onPlusMenu(anchorRect)`——包内负责触发检测（`@` 词边界）与弹层定位容器，列表内容由调用方渲染。调用方不传则入口不出现。

**替代方案**：内建通用 picker 组件。否决——picker 内容天然绑定调用方数据源，内建只会变成空壳抽象。

### D4: 活动轨迹的折叠状态机
轨迹区：流式期间展开；`detectStreamingMode` 进入 `responding`（最终答案阶段）时自动折叠；用户手动展开/折叠后 pin，不再自动变更（每条消息独立记忆）。thinking part 同理：流式展开 + 转圈，答案阶段自动折叠，支持 pin。

### D5: 视觉刷新全部落在 `styles.css` 令牌层
新增/调整 `--pactor-chat-*` 令牌：圆角阶梯（bubble 16px / card 16px / composer 26px）、`--pactor-chat-font-display`（衬线展示字体栈，用于空状态问候与 chat 布局标题）、滚动区上下 mask 渐隐、6px 细滚动条、quiet 图标按钮（透明底、hover 增亮）。动画（呼吸文案、发送按钮 streaming 光环、mark 脉冲）用纯 CSS keyframes 实现。`[data-pactor-theme='dark']` 覆盖同步更新。

### D6: IME 守卫
Composer 监听 `compositionstart`/`compositionend`（与 `keydown.isComposing` 兜底），合成期间 Enter 不触发发送。

## Risks / Trade-offs

- [顺序配对在多轮同名并发 tool 调用下可能错配] → 事件流本身有序，配对取"最早未完结同名 call"在顺序流下正确；在 entry 上保留原始 part 下标便于将来升级 callId。
- [自动折叠与用户 pin 状态冲突导致跳动] → 状态机收敛为 `auto | pinned-open | pinned-closed` 三态，流结束一次性 settle，测试覆盖。
- [附件受控模型把上传复杂度推给调用方] → 明确文档约定 + examples/chat 提供 data-URL 伪上传示例；这是保持包零网络依赖的代价，可接受。
- [视觉令牌改动影响现有使用方自定义主题] → 只增不改令牌语义，旧令牌保留别名；styles.css 内部类名不变。

## Migration Plan

纯增量：`ChatView`/`Composer` 新 props 均可选，默认行为与现状一致（空状态仅在 `suggestions`/`greeting` 传入或默认开启时展示——见 Open Questions）。examples/chat 更新演示新能力。无需数据迁移。

## Open Questions

- 空状态是否默认开启（无 props 时显示默认问候），还是 opt-in（不传 `suggestions` 不渲染）？倾向：问候默认开启、suggestions 为空则不渲染建议区。
- 工具栏槽位在窄屏（<620px）下是否内建 icon-only 压缩？倾向：V1 只做 CSS flex-wrap，不做测量压缩。
