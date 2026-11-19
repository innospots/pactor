# tuffui 组件清单与 chat 组件借鉴评估

> 评估对象：<https://github.com/yurigdesigner/tuffui>（本地只读副本 `/tmp/tuffui-eval`，`registry.json` 共 **91 项**）
> 评估日期：2026-11-19
> 前置文档：[tuffui-library-benchmark.md](./tuffui-library-benchmark.md)（库模型与六项通用能力）、[tuffui-docs-benchmark.md](./tuffui-docs-benchmark.md)（文档站）
> 本文只做组件级评估与路线建议，**不改代码**；tuffui 源码全程只读，未执行其脚本或构建。

---

## 一、结论（TL;DR）

tuffui 的 91 项里，**真正值得 pactor 借的是「chat 会话层的交互模型」**，不是视觉，也不是它的技术栈：

| 优先级 | 组件 / 能力 | 为什么值得 |
| --- | --- | --- |
| **P0** | `conversation-list` 的会话管理（置顶 / 日期分组 / 重命名 / 归档删除 + Undo / running 指示 / 键盘 + `aria-current`） | pactor 现有 `ConversationList` 只有搜索和删除；这是 chat 产品每天都要用的缺口 |
| **P0** | `response-feedback`（点赞 / 点踩 → 原因 chips + 备注 → 致谢 + Undo） | pactor 的消息动作图标白名单里已有 thumbs-up/down，但没有反馈状态机 |
| **P0** | `agent-question`（选项卡片 + agent 推荐项与理由 + 多选 / 自由输入 / 交给 agent 决定 / Undo） | pactor 完全没有「agent 向用户提问」的卡片，agentic 流程缺口最大 |
| **P1** | `agent-composer` 的队列 / Ask-Plan-Act / 斜杠命令 / 上下文 token 托盘 / 拖拽规则 | pactor `Composer` 已有附件、模型、提及、工具栏槽，缺「边跑边排队」与模式 |
| **P1** | `chat-thread` 的 5 分钟分组 / 日期分隔 / 未读分隔 / Jump to latest + 新消息计数 / `role="log"` | pactor 有自动跟随与回到底部，但没有分组、日期、未读与计数 |
| **P1** | `source-list` 的脚注与来源面板（claims → sources 映射） | pactor `Citation` 只有行内 marker + hover card，没有答案后的来源清单 |
| **P1** | `tool-approval-queue` 二期（风险分组 / 多选批量 / resolved log + Undo / 结构化 payload） | 已有 POC；这是把审批从「能用」做到「可运营」的下一步 |
| **P2** | `message-branches`（版本切换 + 分支图）、`context-window-meter`、`model-picker` 子集、`tool-call-block` 结构化参数、artifact 版本历史 | 价值明确，但需要数据模型或产品决策配合 |

**不借的**：7 个 screens 是整页 demo 不是组件；observability / generative 类仪表盘与 pactor 定位无关；`chart-card` 与用户已完成的图表组件集重叠；tuffui 的 motion / Phosphor / Radix / shadcn CLI 技术栈不进入 pactor。tuffui **0 测试**，任何移植都必须由 pactor 自己的交互与 a11y 测试兜底。

---

## 二、范围与方法

- 枚举 `registry.json` 的 91 项，逐项读取 `docs.ts`（props / 类型 / 用法）与关键实现文件；只对 chat 相关与少数通用组件下钻源码。
- 「组件」与「screen」分开看：`screens` 分类的 7 项是整页组合 demo，不是可复用组件；本文只把它们当作「一个完整 chat 产品包含什么」的清单参考。
- 与 pactor 现状逐项对照：`packages/chat/src/components`（19 个 DSL 展示组件）、`packages/chat/src/view`（ChatView 产品层）、`packages/chat/src/approval.tsx`（审批 POC）。
- 成本为单人日估算，含实现、i18n、测试与文档；不含产品设计评审。

---

## 三、组件全景

### 3.1 分类统计

| 分类 | 数量 | 内容 |
| --- | ---: | --- |
| foundations | 24 | 按钮、选择控件、状态、输入、菜单、弹层、Toast、Tabs、折叠、头像、骨架、滑块、快捷键、Loader、空态、日期、拖拽区 |
| conversation | 15 | chat 会话层：thread / message / composer / list / feedback / branches / citations / attachments / model picker / context meter 等 |
| generative | 23 | agent 生成式 UI：图表、表格、表单、卡片、轮播、JSON、产物面板、确认卡等 |
| observability | 8 | run trace、eval、部署时间线、消息日志、热力图等 |
| tools | 5 | 审批队列、工具调用卡、文件 diff、终端输出、MCP 服务器 |
| usage | 4 | 上下文窗口、记忆、用量、限流 |
| planning | 2 | 后台 agent、checkpoint 时间线 |
| screens | 7 | 完整页面 demo（AI chat、coding agent、数据分析、预订、客服、agent 控制台、人工接管） |
| 非组件项 | 3 | `theme`、`motion-tokens`、`use-mock-run` |
| **合计** | **91** | |

### 3.2 7 个 screens 的组合参考价值

这些不是可借组件，但每个都演示了一个「完整产品」需要哪些会话层能力：

| screen | 组合了什么 | 对 pactor 的参考 |
| --- | --- | --- |
| `ai-chat` | 历史侧栏 + thread + tool calls + cited answer + feedback + follow-up chips + composer 上下文表 | 目标形态：pactor 的 ChatPage 已覆盖大半，缺口在 feedback / source list / 上下文表 |
| `coding-agent` | 计划与权限请求 + 文件变更 + 终端 + 实时预览 | 若 pactor 要做 coding agent，`file-changes` / `terminal-output` / `tool-approval-queue` 是场景组件 |
| `data-answer` | KPI 卡 + 图表 + 表格 + 追问 | 生成式 UI 组合；pactor 已有 Table / Statistic / 用户图表集 |
| `booking-assistant` | 比较选项 → 选时间 → 填表 → 确认 | `confirmation-card` / `slot-picker` / `form-card` 的场景组合 |
| `agent-console` | 后台运行 + trace + eval + 用量 + 限流 | observability，产品定位不匹配 |
| `support-widget` | 启动气泡 + 快捷回复 + 订单查询 + 转人工 + 评分 | 客服场景；`handoff-inbox` 配套 |
| `handoff-inbox` | 升级会话 / bot 已做什么 / 回复并交还 | 客服场景，暂不适用 |

---

## 四、pactor chat 现状基线

### 4.1 已有能力

| 层 | 已有 |
| --- | --- |
| 产品视图 | `ChatView`（消息流、composer dock、自动跟随 + 回到底部、活动轨迹、产物面板、消息操作、安全注册表、capability / permission、导出 Markdown） |
| DSL 组件（`@pactor-app/chat/components`） | AgentStatus / ArtifactPanel / Attachment / Bubble / ChatMessage / ChatPage / Citation / Composer / ConversationList / MessageList / Prompt / Sender / StepsPanel / StreamingText / Suggestion / Thinking / ToolCall / Welcome / WorkspaceSwitcher |
| 审批 | `ApprovalQueueController` + `createApprovalConfirm` + `<ApprovalQueue>`（POC：high risk、once / session / always、单请求、审计事件、播报） |
| 动效 / a11y | 统一动效令牌、reduced-motion 基线、Segmented 键盘与组级语义、IconButton 类型级 label |

### 4.2 tuffui ↔ pactor 对应表（chat 相关）

| tuffui | pactor 现状 | 差距判断 |
| --- | --- | --- |
| `chat-thread` | `MessageList` + `ChatView` 自动跟随 | 缺分组 / 日期分隔 / 未读 / 新消息计数；`role="log"` 未加 |
| `user-message` | `ChatMessage` + `MessageActions` 编辑重发 | 已有编辑、复制、状态；缺附件缩略图与发送状态细粒度 |
| `streaming-message` | `MessageBubble` + `StreamingText` + `Thinking` + `ActivityTrace` | 已有流式、推理折叠、错误重试；缺 citations 内联与 copy/retry 组合 |
| `agent-status` | `AgentStatus`（状态 + 文本 + 耗时） | 缺步骤列表 / 轮换 detail / Stop；`StepsPanel` 可组合 |
| `message-branches` | 无 | 缺分支切换；需要 store 版本模型 |
| `response-feedback` | 无内建流程 | 只有可配置 thumbs 图标，无原因 / 备注 / Undo |
| `agent-composer` | `Composer`（附件 / 模型 / 提及 / 工具栏槽 / streaming stop） | 缺队列、Ask-Plan-Act、斜杠命令、上下文 token 托盘、accept/size 规则 |
| `agent-question` | 无 | 缺选项卡片 / 推荐 / 多选 / 自由输入 / delegate |
| `conversation-list` | `ConversationList`（搜索 / 激活 / 删除） | 缺置顶、日期分组、重命名、归档删除 Undo、running、键盘 |
| `prompt-suggestions` | `Suggestion` + `Welcome` + `Prompt` | 已有 chips / 卡片；缺 refresh 与动画增删 |
| `attachment-preview` | `Attachment`（进度 / 重试 / 移除 / 点击） | 缺图片缩略图与放大查看（ui 已有 ImageViewer 可复用） |
| `source-list` | `Citation`（行内 marker + hover card） | 缺脚注列表 / 来源面板 / claims 映射 |
| `code-block` | ui `CodeBlock` | 已有，且更贴合 pactor 语义令牌 |
| `model-picker` | `Composer` 的模型 chip（label + value） | 缺搜索、provider 分组、能力徽章、价格 / 上下文对比 |
| `context-window-meter` | 无 | 缺 token 分段与压缩入口 |
| `tool-call-block` | `ToolCall`（名称 / 参数 / 状态 / 结果 / 耗时） | 缺结构化 payload、Retry、运行中计时；参数只接受字符串结果 |
| `tool-approval-queue` | `ApprovalQueue` POC | 缺风险分组、多选批量、resolved log + Undo、结构化 payload、medium risk |
| `artifact-panel` | `ArtifactPanel`（目录树 / viewer 注册 / 下载） | pactor 更完整；tuffui 的版本历史 + restore + source tab 可补 |
| `agent-avatar` | ui `Avatar` | 缺 agent 方形、presence、stacked group；低成本可补 |
| `voice-session` | 无 | 语音模式，非当前重点 |
| `file-changes` / `terminal-output` / `mcp-servers` | 无 | 仅当 pactor 做 coding agent 时优先 |
| `memory-panel` / `usage-summary` / `rate-limits` | 无 | 产品运营向，非组件层缺口 |

---

## 五、chat 组件逐项评估

### P0-1 会话管理：ConversationList（tuffui `registry/conversation-list`）

**tuffui 做法**

- 数据按 Pinned / Today / Yesterday / Previous 7 days / Older 分组（`conversation-list.tsx:63-72`）。
- 行内菜单：重命名（Enter / blur 保存，Esc 取消）、置顶、归档、删除（`docs.ts`；实现 `:215-283`）。
- 归档 / 删除先隐藏，显示「Undo」pill，`undoMs` 到期才真正调用 `onArchive` / `onDelete`（`:107-115`、`:283`）。
- 键盘 ↑/↓/Home/End 在行间移动，`aria-current="page"` 标记当前会话（`:140-149`、`:226`）；`running` 显示脉冲点（`:236`）。

**pactor 现状**

- `ConversationList` 仅 `items(id/title/description/time) + activeId + searchable + onSelect + onDelete`（`packages/chat/src/components/ConversationList/index.tsx:17-31`），无分组、置顶、重命名、归档、Undo、键盘。

**怎么落（全部可选，不改现有行为）**

- `ConversationItemData` 增加 `updatedAt?: string`（ISO，用于分组；缺省回退 `time` 或不分组）、`pinned?: boolean`、`running?: boolean`。
- 新增可选回调 `onRename` / `onPin` / `onArchive`；`onDelete` 语义不变。
- 新增 `undoMs`（缺省 5000）；`onArchive` / `onDelete` 在 Undo 窗口结束后触发，与 tuffui 一致。
- 行容器改为 `role="listbox"` 或保留列表语义时至少补 `aria-current` + roving tabindex；方向键移动与 Enter 打开。
- 分组文案走 i18n（`pactor.chat.conversation.group.pinned/today/...`），日期分组以宿主时区计算；SSR 水合差异用 `suppressHydrationWarning` 或延迟到挂载后再分组。

**成本**：1.5–2 人日。**风险**：低（纯展示层，存储仍由宿主负责）。
**验收**：分组正确；重命名 Enter/Esc；删除后 Undo 窗口内恢复；键盘可完成选择与菜单操作。

---

### P0-2 回答反馈：ResponseFeedback（tuffui `registry/response-feedback`）

**tuffui 做法**

- `Feedback = { rating: up | down | 1–5 | null; reasons: string[]; note: string; status: idle | open | sent }`（`docs.ts`；实现 `response-feedback.tsx:21-29`）。
- 点踩打开原因 chips（多选）+ 备注；提交后进入致谢，`undoMs` 内可 Undo（`:105-134`、`:398`）。
- `inline`：回答下方 thumbs；`detailed`：1–5 评分 + 原因常显（`:49-50`）。
- 原因按钮 `aria-pressed`，原因组 `role="group"`，致谢用 `role="status" aria-live="polite"`（`:174-198`、`:398`）。

**pactor 现状**

- `MessageActions` 的内建动作只有 copy / regenerate / retry / edit（`packages/chat/src/view/MessageActions.tsx:65-103`）；自定义动作可以配 `thumbs-up` / `thumbs-down` 图标，但没有原因、备注、提交与撤销流程。

**怎么落**

- 新增独立组件 `<ResponseFeedback>`，从 `@pactor-app/chat` root 导出；不改 `MessageActions` 默认动作。
- 需要内建动作时，扩展 `BuiltinMessageAction` 联合类型增加 `'feedback'`，但**不加入默认数组**（默认仍是四项），由宿主显式开启；`visibleWhen: 'completed'`、`roles: ['assistant']`。
- 受控 / 非受控双模式；`onRate` / `onSubmit` / `onUndo` 分离，便于宿主分别写分析事件与提交 API。
- 文案全部 i18n；原因列表可由宿主覆盖。
- 若走 DOM 内联在消息底部，注意每条消息独立状态、避免整列表重渲染（组件内部 state，父级仅收事件）。

**成本**：2–3 人日。**风险**：低；主要是产品是否要 1–5 详细模式，建议先只做 inline。
**验收**：点赞 / 点踩 / 原因 / 备注 / 提交 / Undo；键盘可操作；读屏播报提交结果。

---

### P0-3 Agent 提问卡：AgentQuestion（tuffui `registry/agent-question`）

**tuffui 做法**

- 数据：`question` + `options[{id,label,description?,icon?}]` + `multiple?` + `allowOther?` + `suggested?{optionId,reason}`（`docs.ts`）。
- agent 的推荐项高亮并写出理由（`agent-question.tsx:151-160`）；支持「让 agent 决定」（delegate）与回答后 Undo（`:233-272`、`:398-428`）。
- 键盘：方向键按网格实际列数移动焦点（`:121-133`），Enter / Space 由卡片按钮原生触发；单选 `radiogroup`、多选 `group`（`:166-168`）。
- 单选点击即提交；多选用 Send pill 提交；自由输入走「Something else…」卡片。

**pactor 现状**

- 无对应组件；`ChatPage` 的 `question-nav` 只是提问导航（滚动跳转），不是 agent 提问交互。

**怎么落**

- 新增 `<AgentQuestion>`（DSL 组件 + root React 组件），props 采用与 tuffui 类似的数据形状，但 `icon` 用 pactor `Icon` 白名单名而不是 Phosphor 组件。
- 状态机：`pending` / `answered` / `delegated`；`onSubmit(answer)` / `onDelegate()` / `onUndo()`；受控 `selected` / `onSelectedChange` 保留给多选。
- 接入 chat 事件：可新增 part 类型 `question`（`ChatMessagePart` 联合扩展，旧代码不受影响），由 `PartRenderer` 渲染；或先作为独立组件由宿主放置。
- 键盘与读屏按 tuffui 模型实现，但用 pactor 的 `FieldShell` 组级语义经验：`role="radiogroup"` + `aria-labelledby`，方向键 + roving tabindex。
- 建议同时提供 DSL 注册（`AgentQuestion`），让 LLM 生成的 DSL 能直接提问；类型名加入 `registerChatComponents`。

**成本**：2–3 人日（组件 + part 接入 + 测试）。**风险**：中低；需要确定 part 模型是否扩展。
**验收**：单选 / 多选 / 自由输入 / delegate / Undo；键盘与读屏；DSL 渲染。

---

### P1-4 Composer 增强（tuffui `registry/agent-composer`）

tuffui 在 composer 上做了五件事，pactor 可按价值排序逐项吸收：

| 能力 | tuffui 证据 | pactor 现状 | 建议 |
| --- | --- | --- | --- |
| 生成中排队 | `queue` / `onQueueChange`；streaming 时 Enter 入队，运行结束由宿主发下一条（`docs.ts`） | 只有 `streaming` + `onStop` | **优先**：新增可选 `queue` / `onQueueChange`；`streaming` 时 Enter 入队而非发送；队列展示在输入框上方，可移除 |
| Ask / Plan / Act 模式 | `mode` / `onModeChange` / `showModes`，默认 act（`agent-composer.tsx:32-35`、`:56-60`） | 无 | 可选：新增 `mode` 受控 + `onModeChange`；不提供时完全不渲染，不影响现有布局 |
| 斜杠命令 | `commands`，输入 `/` 开头弹出可过滤菜单（`docs.ts`） | 有 `contexts` 的触发符菜单（`@` / `+`），但没有命令语义 | 可复用现有 mention 菜单机制，新增 `commands` 数据源；先只做菜单与插入，不执行 |
| 上下文 token 托盘 | `context` / `onContextChange`，每项 token 数与合计（`docs.ts`） | `contextItems` 只有提及块，没有 token 数 | 扩展 `ComposerContextItem` 增加可选 `tokens?: number`；托盘与合计由宿主决定是否展示 |
| 拖拽 / 粘贴规则 | `drop-zone` 的 `accept` / `maxSize` / `maxFiles` / `onReject`（`registry/drop-zone/docs.ts`） | Composer 已支持粘贴与拖拽文件，但无类型 / 大小 / 数量规则，也无拒绝原因 | 新增可选 `accept` / `maxSize` / `maxFiles` / `onReject`；`checkFiles` 逻辑独立成纯函数，便于测试与复用 |

**成本**：排队 1–1.5、模式 0.5–1、命令 1–1.5、token 托盘 1–1.5、拖拽规则 0.5–1，合计 3.5–5 人日。**风险**：中；Composer 是高频组件，任何新增 props 必须缺省无行为变化。
**验收**：不发生 streaming 时行为与现状完全一致；队列、模式、命令、规则均有独立测试。

---

### P1-5 会话流：ChatThread 的分组 / 日期 / 未读 / 跳转（tuffui `registry/chat-thread`）

**tuffui 做法**

- 同侧、5 分钟内的连续消息共享 header（`chat-thread.tsx:55` 的 `GROUP_MS`、`:181-187` 的分组判断）；跨天插入日期分隔、`unreadFrom` 插入 Unread 分隔（`:193-194`）。
- 跟随底部时自动滚；用户上翻后显示 Jump to latest，带「· N new」计数（`:275-289`，文本在 `:283-285`）。
- 滚动容器 `role="log"`、`aria-label`、`aria-busy`（streaming）、`tabIndex={0}`（`:161-165`）。
- `bottomInset` 为浮动 composer 预留空间；`bare` 用于整页会话。

**pactor 现状**

- `MessageList` 只有整列自动滚（`packages/chat/src/components/MessageList/index.tsx:31-41`）；产品层 `ChatView` 用 `useChatAutoScroll` 做跟随 / 释放 / 回到底部（`packages/chat/src/hooks/use-chat-auto-scroll.ts`），回到底部按钮无新消息计数（`ChatView.tsx:442-448`）。
- 无分组、日期分隔、未读分隔；无 `role="log"`。

**怎么落**

- DSL 层 `MessageList` 增加可选 `groupWindowMs`（缺省 5 分钟）、`showDateDividers`、`unreadFrom`；关闭时输出与现状一致。
- 产品层 `ChatView` 的「回到底部」按钮增加 `N new` 计数：`useChatAutoScroll` 在释放跟随时记录当时的最后消息 id / 数量，恢复跟随时清零。
- 日期分隔与水合：以宿主时区计算，SSR 阶段可先不渲染日期分隔或使用 UTC 占位；避免水合不一致。
- 滚动容器补 `role="log"` + `aria-live="polite"`（或 `aria-label` + `aria-busy`），并确认不会与现有 `aria-live` 播报重复。

**成本**：1.5–2.5 人日。**风险**：中低；分组只影响展示，不改消息数据模型。
**验收**：连续同侧消息合并；跨天分隔；未读分隔；上翻后计数准确；回到最新后计数清零。

---

### P1-6 来源清单：SourceList（tuffui `registry/source-list`）

**tuffui 做法**

- `footnotes`：答案文本中的 `[1]` / `[2,3]` marker 渲染为可交互编号，hover 显示来源预览，文末编号来源列表（`source-list.tsx:26-36`、`:113-150`）。
- `panel`：按站点分组，展示每个来源支撑的 claims（`claims: {id,text,sourceIds}[]`）（`:177-251`）。

**pactor 现状**

- `Citation` 只做行内 marker + HoverCard（`packages/chat/src/components/Citation/index.tsx:35-66`）；没有答案后的来源清单，也没有 claims 映射。

**怎么落**

- 新增 `<SourceList>`：`variant="footnotes" | "panel"`；`data.sources` + 可选 `text`（含 `[n]`）或 `claims`。
- 复用 `Citation` 的 hover card；marker 解析用纯函数（输入文本 + sources，输出带 marker 的节点），便于测试。
- 若宿主已有 markdown 渲染，可只提供「来源面板」变体，marker 由宿主自己解析；避免两套 markdown 解析器。
- 文案 i18n；外链统一 `rel="noreferrer"`。

**成本**：1.5–2 人日。**风险**：低；主要是与现有 markdown / Citation 的边界。
**验收**：marker 点击 / hover；脚注编号与来源顺序一致；panel 按站点分组与 claims 映射正确。

---

### P1-7 审批队列二期（tuffui `registry/tool-approval-queue`）

已有 POC（`packages/chat/src/approval.tsx`：high risk、once/session/always、单请求、`onDecision` 审计、`role="status"` 播报）。tuffui 的差距：

| 能力 | tuffui 做法 | 建议 |
| --- | --- | --- |
| 风险分组 | `layout="grouped"` 按 high / medium / low 分组，high 在前（`tool-approval-queue.tsx:199-203`、`:76-84`） | 二期增加 `layout`；POC 只处理 high，可先保留 |
| 多选批量 | 行选择 + bulk bar，批量批准 / 拒绝，scope 固定 once（`:239-267`） | 增加 `selected` / `onSelectedChange` 与批量决议；批量只允许 once，避免误授权 |
| resolved log + Undo | 已决议项保留在下方，`onUndo` + `undoMs`（`:63-64`、`:195`） | 增加 resolved 区与 Undo；控制器记录最近决议，Undo 重新入队 |
| 结构化 payload | `shell` / `diff` / `email` / `json` 四种（`docs.ts`） | **不照抄四元 union**（前置文档已结论）；改为 `renderPayload?: (request) => ReactNode`，宿主渲染 shell / diff / email；内置 JSON 兜底 |
| 风险等级 | low / medium / high | `ApprovalRisk` 已有 low/medium/high 类型；开放 medium 进入队列需产品决策 |
| 键盘 | ↑/↓ 移动、Space 选择、Enter 打开（`docs.ts`） | 行选择与展开补齐键盘，沿用 pactor 的 roving tabindex 约定 |

**成本**：4–6 人日（含控制器扩展、UI、测试）。**风险**：中；批量与 Undo 会改变队列状态机，需先把 `ApprovalQueueController` 的状态迁移测试补全。
**验收**：批量批准只写 once；Undo 在窗口内恢复待审批；resolved log 可审计；键盘可完成选择与决议。

---

### P2-8 消息分支：MessageBranches（tuffui `registry/message-branches`）

**tuffui 做法**

- `versions[]`（original / regenerated / edited，含 `prompt` / `meta` / `turnsAfter`），`inline` 显示 `‹ 2 / 3 ›`，`map` 显示分支图；键盘 ←/→ 切换（`docs.ts`、`message-branches.tsx:25-53`）。
- `turnsBefore` 用于分支图 dots；`onIndexChange` 由宿主切换到对应分支。

**pactor 现状**

- 有 regenerate / edit-and-resend（`removeMessagesFrom` 截断），但没有版本存储；每次重新生成会覆盖旧答案。

**怎么落**

- 先做**纯展示组件** `<MessageBranches>`：宿主传入 `versions`（ReactNode）+ 受控 index；pactor 不改 `ConversationStore`。
- 若要产品化，需要二选一：
  1. 在 `ChatMessage` 上增加可选 `versions?: ChatMessageVersion[]`（消息内版本），store 只保留当前版本 + 历史；
  2. 独立 `BranchStore`，按 `messageId` 存版本列表，regenerate 时 append 而非覆盖。
- 推荐先做 1 的展示层 + 宿主自管版本，验证交互后再决定 store 语义；不要为了分支一次性改 `ConversationStore`。

**成本**：展示层 2–3 人日；store 版本模型 1–2 人日另计。**风险**：中高；涉及消息状态与重新生成语义。
**验收**：切换版本不丢消息；编辑提示与重新生成版本可区分；键盘可切换。

---

### P2-9 上下文窗口：ContextWindowMeter（tuffui `registry/context-window-meter`）

**tuffui 做法**

- `data.limit` + `segments[{label,tokens,pinned?,color?}]`；`card` 是 100 格（1% / 格）面板 + 图例，`inline` 是 20 格 composer footer（`docs.ts`）。
- `warnAt`（默认 0.8）后计数变橙并显示 Compact；`onCompact` 触发摘要 / 丢弃旧上下文（`docs.ts`）。

**pactor 现状**

- 无 token / 上下文使用展示；`Composer` 也没有 footer 用量入口（有 `footer` 槽可放）。

**怎么落**

- 纯展示组件，数据由宿主提供：`limit`、`segments`、`model?`；不内置 tokenizer。
- `variant="inline" | "card"`；`onCompact?` 仅作为按钮回调，压缩策略由宿主实现。
- 可作为 DSL 组件或仅 React 组件；建议先 React 组件，等宿主接入后再注册 DSL。
- 样式走语义令牌（warning 用 `--warning`），格子用 CSS grid，不引入图表库。

**成本**：1–1.5 人日。**风险**：低。
**验收**：分段总和与 limit 正确；warnAt 变色；Compact 回调。

---

### P2-10 模型选择：ModelPicker 子集（tuffui `registry/model-picker`）

**tuffui 做法**

- 搜索、按 provider 分组、速度 / 价格 / 上下文的分段条（价格与上下文对数刻度）、能力徽章（vision / tools / reasoning）、推荐项与理由、本对话成本换算、缺失能力警告（`docs.ts`；实现 796 行）。
- 面板 inline 渲染（非 portal），尺寸自适应容器。

**pactor 现状**

- `Composer` 只有 `models: { value,label }[]` + `model` / `onModelChange` 的简单 chip。

**怎么落**

- **不建议整组件照搬**：速度 / 价格 / 上下文三段对比是模型市场型产品的能力，pactor 是通用框架，数据未必齐全。
- 可增量扩展 `ComposerModelOption`：`description?`、`provider?`、`contextWindow?`、`capabilities?: ('vision'|'tools'|'reasoning')[]`、`price?`；先支持搜索 + provider 分组 + 能力徽章 + 推荐项。
- 若宿主需要完整对比，再提供独立 `<ModelPicker>`，pactor 只负责布局与键盘，数值与推荐逻辑由宿主给。
- 不引入 tuffui 的对数刻度视觉；用简单文本或进度条即可。

**成本**：子集 2–4 人日；完整对比 5+ 人日。**风险**：中；数据契约需要产品确认。
**验收**：搜索、分组、能力徽章、选择闭环；不提供扩展字段时与现状一致。

---

### P2-11 工具调用：ToolCallBlock 的结构化（tuffui `registry/tool-call-block`）

**tuffui 做法**

- `ToolCall = { id,name,args,status: pending|running|success|error,durationMs?,result?,error? }`（`docs.ts`）。
- running 时计时自动走；参数 / 结果折叠；错误显示 Retry；结果可以是字符串或对象（`docs.ts`）。

**pactor 现状**

- `ToolCall` 有 name / params / status / result(string) / durationMs / defaultExpanded（`packages/chat/src/components/ToolCall/index.tsx:10-27`）；参数对象 JSON 展示，结果只接受字符串；无 Retry、无运行中计时。

**怎么落**

- `result` 放宽为 `unknown`，内部用与 params 相同的 `renderValue`（字符串原样，对象 JSON）；这是向后兼容的类型放宽。
- 增加 `onRetry?`（error 时显示）与运行中计时（`status === 'running'` 时从 `startedAt` 或本地 mount 计时）；`pending` 状态可加。
- 结构化 payload 不放进 `ToolCall`；由审批队列的 `renderPayload` 或宿主自定义渲染承接，避免组件知道 shell / diff / email 领域。

**成本**：1.5–2 人日。**风险**：低。
**验收**：对象结果正常展示；error Retry；运行中计时；现有字符串结果不变。

---

### P2-12 小增量（低成本、可顺手做）

| 项 | tuffui 参考 | pactor 落点 | 成本 |
| --- | --- | --- | --- |
| 建议 chips 刷新 | `prompt-suggestions` 的 `onRefresh` / `refreshing`（`docs.ts`） | `Suggestion` 增加可选刷新按钮与 loading；不影响现有 chips | 0.5 人日 |
| 附件图片预览 | `attachment-preview` 的缩略图 + 放大（`docs.ts`） | `Attachment` 增加 `src?` + 点击交给宿主；ui 已有 `ImageViewer` | 0.5–1 人日 |
| Agent 状态步骤 / Stop | `agent-status` 的 `steps` / `onStop`（`docs.ts`） | `AgentStatus` 增加可选 `steps` 与 `onStop`；或继续用 `StepsPanel` 组合 | 0.5–1 人日 |
| Agent 头像 | `agent-avatar` 的 agent 方形 / presence / group（`docs.ts`） | ui `Avatar` 增加 `kind="agent"` / `status` / `AvatarGroup` | 1–1.5 人日 |
| Artifact 版本历史 | `artifact-panel` 的 versions / restore / source tab（`docs.ts`） | pactor `ArtifactPanel` 增版本切换与 restore；数据模型加 `versions` | 2–3 人日 |

---

### 暂不做 / 明确不借

| 项 | 原因 |
| --- | --- |
| 7 个 screens（ai-chat / coding-agent / data-answer / booking-assistant / agent-console / support-widget / handoff-inbox） | 整页 demo，不是组件；只作组合参考 |
| `voice-session` | 语音模式，需要音频栈与产品决策，非当前范围 |
| `run-trace` / `eval-results` / `eval-race` / `lap-timer` / `deploy-timeline` / `tool-call-graph` / `delivery-heatmap` / `message-log` | observability 仪表盘，与 pactor 组件库定位不匹配 |
| `inbox-cleanup` / `clause-playbook` / `renewal-rings` / `blast-radius` / `iso-bars` / `hex-density` / `match-field` / `radar-chart` / `mirror-strips` / `radial-dots` / `diverging-bars` / `dot-histogram` / `tick-gauge` / `chart-card` | 领域生成式图表；pactor 已有用户完成的 echarts 图表组件集，不重复建设 |
| `memory-panel` / `usage-summary` / `rate-limits` | 产品运营面板，数据源与权限模型未定 |
| `background-agents` / `checkpoint-timeline` | 需要后台运行与检查点存储模型，暂不具备 |
| `file-changes` / `terminal-output` / `mcp-servers` | 仅当 pactor 明确做 coding agent 时再评估；届时应作为独立场景包，不塞进通用 chat |
| tuffui 的 motion / Phosphor / Radix / shiki / shadcn CLI 技术栈 | 前置文档已结论：不引入；pactor 用现有 ui 原语 + CSS 动效令牌 |
| `ToolApprovalQueue` 的 `shell \| diff \| email \| json` 公开 union | 借交互模型，不借封闭 payload 形状；pactor 用宿主渲染 |

---

## 六、非 chat 组件评估

### 6.1 已有等价物（不必借）

| tuffui | pactor 已有 | 备注 |
| --- | --- | --- |
| `empty-state` | `Empty` | pactor 已有 Empty / EmptyHeader / EmptyTitle / EmptyDescription |
| `loading-skeleton` | `Skeleton` / `Spinner` | 可借 `SkeletonGroup` 的 status 播报思路，不必新增组件 |
| `action-menu` | `Menu` / `DropdownMenu` / `ContextMenu` | 键盘与 submenu 已覆盖；不复制 |
| `modal-sheet` | `Dialog` / `Drawer` / `Sheet` | 已覆盖 |
| `toast-stack` | `Notification` / `Message` / `Sonner` / `toast` | 已有；可借 `toast.promise` 的 API 形状（若尚无） |
| `select-field` | `Select` / `Combobox` / `Cascader` | 已覆盖 |
| `date-field` | `DatePicker` / `Calendar` / `TimePicker` | 已覆盖 |
| `range-slider` | `Slider` / `Progress` | 已覆盖 |
| `segmented-control` | `Segmented` | 已按前置文档补齐键盘与组级语义 |
| `progress-bar` | `Progress` / `Skeleton` | 已覆盖 |
| `status-pill` | `Status` / `Badge` / `Tag` | 已覆盖 |
| `rolling-number` | `Statistic` | 数字动画可作为 `Statistic` 的可选增强，不新增组件 |
| `code-block` | `CodeBlock` | 已覆盖 |
| `json-viewer` | `JSONViewer` | 已覆盖 |
| `data-table` | `Table` | 可借 `priority`（窄屏隐藏列）与 bulk bar 模式，不必新增 |
| `artifact-panel`（基础） | `ArtifactPanel` | pactor 更完整；只借版本历史 |
| `form-card` / `slot-picker` | `Form` / `DatePicker` / `Calendar` | 领域组合，暂不组件化 |
| `result-carousel` / `stat-grid` | `Carousel` / `CardList` / `Statistic` | 已覆盖或可组合 |
| `surface` | `Panel` / `Card` / `Layout` | 视觉体系不同，不借 |
| `agent-avatar` | `Avatar` | 可小幅增强（见 P2-12） |

### 6.2 值得借的「模式」而不是组件

| 模式 | tuffui 证据 | 用途 |
| --- | --- | --- |
| 脚本化 agent 回放 | `use-mock-run`：`MockStep` + `streamText` 按词流式、`replay` 重播（`registry/use-mock-run/use-mock-run.ts`） | 示例、文档预览、测试固定装置；pactor 可做一个零依赖测试/示例工具，不进运行时包 |
| 拖拽文件规则 | `drop-zone` 的 `accept` / `maxSize` / `maxFiles` / `checkFiles` + `onReject`（`docs.ts`） | Composer 附件规则；独立纯函数便于测试 |
| 表格窄屏优先级 | `data-table` 的 `priority: 1 \| 2 \| 3`（`docs.ts`） | `Table` 的响应式列隐藏，补容器查询更自然 |
| 状态播报 | `SkeletonGroup` 的 `role="status"` 一次性播报、`ResponseFeedback` 的致谢播报 | pactor 现有 `role="status"` 约定可继续复用 |
| 键盘 roving | `conversation-list` / `agent-question` / `segmented-control` | 与 pactor 已落地的 Segmented 模式一致，继续统一 |

### 6.3 明确不借

- tuffui 的银灰渐变 / Phosphor 视觉 / `Shell` + `Panel` 边框体系：pactor 是语义令牌 + 可换肤，视觉不迁移。
- 0 测试 / 只靠 typecheck：pactor 继续以交互 + a11y 测试为门槛。
- 每个组件自带 `docs.ts` + `demo.tsx` 的目录约定：pactor 走数据驱动 docs，不复制双份注册表。

---

## 七、推荐路线（兼容优先）

### 阶段 A（约 1 周）：三个 P0

1. `ConversationList` 管理能力（1.5–2 人日）。
2. `ResponseFeedback`（2–3 人日，先 inline）。
3. `AgentQuestion`（2–3 人日，含 part / DSL 接入）。

**完成后**：会话侧栏可日常使用；答案可反馈；agent 可向用户提问。

### 阶段 B（约 2–3 周）：会话体验补齐

4. `Composer` 队列 + 拖拽规则（2–2.5 人日，先做最高价值两项）。
5. `MessageList` / `ChatView` 分组、日期、未读、计数（1.5–2.5 人日）。
6. `SourceList` 脚注 / 面板（1.5–2 人日）。
7. 审批队列二期（4–6 人日）。
8. `ToolCall` 结构化结果 / Retry / 计时（1.5–2 人日）。

**完成后**：长会话可读、来源可查、审批可批量与撤销、工具调用可重试。

### 阶段 C（按产品需要）：模型扩展类

9. `MessageBranches` 展示层（2–3 人日）→ 版本模型（另 1–2 人日）。
10. `ContextWindowMeter`（1–1.5 人日）。
11. `ModelPicker` 子集（2–4 人日）。
12. 小增量：Suggestion refresh、Attachment 图片、AgentStatus steps、Avatar、Artifact 版本（合计 3–5 人日）。

### 兼容性红线

1. **所有新增 props 可选**，缺省行为与现状逐字节一致；新增组件不改变已有导出。
2. `ChatConfirm`、`ApprovalQueueController`、`ConversationList`、`MessageList`、`Composer` 的现有签名不破坏；只做加法。
3. `MessageActions` 默认动作仍是 `copy / regenerate / retry / edit`；`feedback` 只能由宿主显式加入。
4. 不新增运行时依赖；不复制 tuffui 的 motion / Phosphor / Radix / shiki；动效走 `--ease-*` / `--duration-*`。
5. 文案全部 i18n（zh-CN / en-US），不在组件内写死中文或英文。
6. 每个新组件配交互 + 键盘 + a11y 测试；DSL 组件同时验证 `registerChatComponents` 注册。
7. 样式全部 `data-slot` + 语义令牌；不引入 tuffui 的视觉类名。

### 验收口径

- 新组件在 `@pactor-app/chat/components` 可导入、可注册 DSL；root 导出 React 组件与类型。
- 现有 chat 测试全绿（当前 34 文件 / 503 测试），新增测试覆盖每个状态与键盘路径。
- 示例 / 文档站预览可用 `variant` / `replayKey` 契约（前置阶段已落地）。

---

## 八、证据索引

### tuffui

| 主题 | 文件 |
| --- | --- |
| 组件清单与分类 | `registry.json`（91 项；分类计数为 conversation 15 / foundations 24 / generative 23 / observability 8 / planning 2 / screens 7 / tools 5 / usage 4） |
| 会话列表 | `registry/conversation-list/docs.ts`、`conversation-list.tsx:63-72`、`:107-115`、`:140-149`、`:215-283` |
| 回答反馈 | `registry/response-feedback/docs.ts`、`response-feedback.tsx:21-29`、`:105-134`、`:174-198`、`:398` |
| Agent 提问 | `registry/agent-question/docs.ts`、`agent-question.tsx:121-133`、`:151-160`、`:166-168`、`:233-272` |
| Composer | `registry/agent-composer/docs.ts`、`agent-composer.tsx:32-35`、`:47-48`、`:56-60`、`:122-125` |
| 会话流 | `registry/chat-thread/docs.ts`、`chat-thread.tsx:55`、`:161-165`、`:181-187`、`:193-194`、`:275-289` |
| 来源清单 | `registry/source-list/docs.ts`、`source-list.tsx:26-36`、`:113-150`、`:177-251` |
| 审批队列 | `registry/tool-approval-queue/docs.ts`、`tool-approval-queue.tsx:76-84`、`:199-203`、`:239-267` |
| 消息分支 | `registry/message-branches/docs.ts`、`message-branches.tsx:25-53` |
| 上下文 / 模型 | `registry/context-window-meter/docs.ts`、`registry/model-picker/docs.ts` |
| 工具调用 | `registry/tool-call-block/docs.ts` |
| 拖拽 / 回放 | `registry/drop-zone/docs.ts`、`registry/use-mock-run/use-mock-run.ts` |
| 非 chat 基础 | `registry/empty-state/docs.ts`、`loading-skeleton/docs.ts`、`action-menu/docs.ts`、`toast-stack/docs.ts`、`data-table/docs.ts` 等 |

### pactor

| 主题 | 文件 |
| --- | --- |
| 会话列表 | `packages/chat/src/components/ConversationList/index.tsx:17-31` |
| 消息列表 | `packages/chat/src/components/MessageList/index.tsx:11-41` |
| 自动跟随 | `packages/chat/src/hooks/use-chat-auto-scroll.ts`、`packages/chat/src/view/ChatView.tsx:442-448` |
| 消息操作 | `packages/chat/src/view/MessageActions.tsx:65-103` |
| Composer | `packages/chat/src/components/Composer/index.tsx:51-127` |
| 工具调用 | `packages/chat/src/components/ToolCall/index.tsx:10-27` |
| 引用 | `packages/chat/src/components/Citation/index.tsx:20-66` |
| 附件 | `packages/chat/src/components/Attachment/index.tsx:9-52` |
| 审批 POC | `packages/chat/src/approval.tsx:20-22`、`:61-148` |
| 组件注册 | `packages/chat/src/components/index.ts`（19 个 DSL 组件） |

---

## 附录：91 项全量清单

> 用途为压缩表述，完整 props 见各目录 `docs.ts`。`screens` 为整页 demo，不是可复用组件。

### conversation（15）

| 名称 | 用途 |
| --- | --- |
| `chat-thread` | 会话流：分组、日期 / 未读分隔、跟随与 Jump to latest |
| `streaming-message` | 流式回答：推理折叠、citation chips、copy / retry |
| `agent-status` | agent 运行状态：当前步骤、轮换 detail、耗时、Stop |
| `message-branches` | 重新生成 / 编辑后的版本切换与分支图 |
| `response-feedback` | 点赞 / 点踩 + 原因 / 备注 + Undo |
| `agent-composer` | Ask / Plan / Act、上下文托盘、排队、斜杠命令 |
| `agent-question` | agent 提问：选项卡片、推荐与理由、多选 / 自由输入 |
| `user-message` | 用户消息：附件、就地编辑重发、发送状态 |
| `conversation-list` | 会话历史：搜索、置顶、日期分组、重命名、归档 / 删除 Undo |
| `prompt-suggestions` | 起始建议卡片与追问 chips，可刷新 |
| `attachment-preview` | 附件缩略图、上传进度、重试、移除 |
| `source-list` | 引用脚注与来源面板（claims 映射） |
| `code-block` | 代码块：文件名、语言、行号、换行、复制、折叠 |
| `model-picker` | 模型选择：搜索、provider、速度 / 价格 / 上下文对比 |
| `voice-session` | 语音会话：电平条、逐词转写、打断、静音 / 保持 |

### tools（5）

| 名称 | 用途 |
| --- | --- |
| `tool-approval-queue` | 工具审批：风险分组、多选批量、授权范围、resolved log + Undo |
| `tool-call-block` | 工具调用卡：参数、状态、耗时、结果、Retry |
| `file-changes` | 文件变更审阅：文件树 + hunk，逐 hunk 保留 / 回退 |
| `terminal-output` | 终端输出：stdout / stderr、退出状态、复制、停止 |
| `mcp-servers` | MCP 服务器：状态、授权、重连、逐工具开关 |

### usage（4）

| 名称 | 用途 |
| --- | --- |
| `context-window-meter` | 上下文窗口：分段 token、接近上限警告、Compact |
| `memory-panel` | agent 记忆：搜索、作用域、行内编辑、遗忘 |
| `usage-summary` | 用量与成本：按模型拆分、月度预算 |
| `rate-limits` | 限流：请求 / token 桶、retry-after、排队 |

### planning（2）

| 名称 | 用途 |
| --- | --- |
| `background-agents` | 后台 agent：实时 tile 网格 / 紧凑 dock |
| `checkpoint-timeline` | 检查点：按 turn 拖动、变更查看、恢复 |

### observability（8）

| 名称 | 用途 |
| --- | --- |
| `run-trace` | 运行火焰图：点击缩放 span、时间 / token / 成本拆分 |
| `eval-results` | eval 结果：通过 / 失败 / 回归网格 |
| `lap-timer` | 流水线秒表：分段、分段时间、最佳圈差 |
| `eval-race` | 模型 eval 竞速：椭圆赛道、排名、最快圈 |
| `tool-call-graph` | 工具调用关系图：延迟、错误率、最热路径 |
| `deploy-timeline` | prompt / 模型版本与 eval 分数时间线 |
| `delivery-heatmap` | webhook 端点 × 小时投递热力图 |
| `message-log` | webhook 事件时间线与可过滤日志 |

### generative（23）

| 名称 | 用途 |
| --- | --- |
| `chart-card` | 生成式图表卡：bar / line / area / donut |
| `dot-histogram` | 分布点堆叠，median / p95 标记 |
| `tick-gauge` | 刻度弧仪表：目标线与缺口 |
| `mirror-strips` | 双序列镜像点条 |
| `radial-dots` | 周期环点图 |
| `match-field` | 候选按分数分布在场域中 |
| `radar-chart` | 多轴雷达图 |
| `diverging-bars` | 双尺度发散柱 |
| `blast-radius` | 影响范围逐跳图 |
| `iso-bars` | 等距堆叠柱 |
| `hex-density` | 六边形密度图 |
| `data-table` | 可排序 / 过滤 / 分页 / 多选 / CSV 表格 |
| `stat-grid` | KPI 卡 + 滚动数字 + 迷你趋势 |
| `form-card` | agent 让用户填的表单 |
| `result-carousel` | 结果卡横向滚动 |
| `slot-picker` | 日期 / 时段选择与确认 |
| `confirmation-card` | 行动前的摘要确认：条目、合计、编辑、Undo |
| `json-viewer` | JSON 树：类型、计数、搜索、复制路径 |
| `artifact-panel` | 产物侧栏：预览 / 源码、版本历史、下载 |
| `tone-rewrite` | 语气改写：tone pad、流式结果、替换 / 插入 |
| `inbox-cleanup` | 订阅清理：发送者散点、退订区、清单 |
| `clause-playbook` | 条款谈判：市场分布、可接受区间 |
| `renewal-rings` | 合同续约 12 个月环图 |

### foundations（24）

| 名称 | 用途 |
| --- | --- |
| `surface` | Shell / Panel / Inset / IconTile 布局层 |
| `action-button` | 主 / 次 / 静默 / 危险按钮，含 loading 与 icon-only |
| `choice-controls` | Switch / Checkbox（mixed）/ RadioGroup 键盘 |
| `status-pill` | 五色状态 pill + 等宽 Tag |
| `segmented-control` | 滑块分段选择，键盘瞬时切换 |
| `progress-bar` | 进度 / 仪表条，含 stacked SegmentedBar |
| `rolling-number` | 数字滚动 |
| `text-field` | TextField / SearchField / TextArea + label / error |
| `tooltip-hint` | 触发器侧向缩放的提示 |
| `action-menu` | 下拉 / 右键菜单：图标、快捷键、子菜单、勾选 |
| `popover-panel` | 触发器锚定面板，外点 / Esc 关闭，焦点保持 |
| `modal-sheet` | 居中对话框 + 边缘抽屉，焦点陷阱 / 滚动锁 |
| `toast-stack` | 堆叠通知，hover 展开、暂停、滑动关闭、动作 |
| `select-field` | Select + 可搜索 combobox、分组、键盘 typeahead |
| `tab-panels` | Tabs + 面板，滑动指示器、懒加载、计数 |
| `disclosure` | Accordion / 折叠，平滑高度 |
| `agent-avatar` | agent / 人像头像，presence、activity、stacked group |
| `loading-skeleton` | 答案 / 列表 / 卡片骨架 |
| `range-slider` | 单值 / 双值滑块，步长、标记、值标签 |
| `key-hint` | 平台自适应快捷键提示 |
| `loader` | Spinner / thinking 指示，可访问标签 |
| `empty-state` | 空 / 无结果 / 错误态，含动作与 retry |
| `date-field` | 日历 / 日期选择，范围、键盘、min / max |
| `drop-zone` | 拖拽文件区，类型 / 大小限制与拒绝原因 |

### screens（7，组合参考，非组件）

`ai-chat` / `coding-agent` / `data-answer` / `booking-assistant` / `agent-console` / `support-widget` / `handoff-inbox`

### 非组件项（3）

`theme`（颜色 token）、`motion-tokens`（缓动 / 弹簧 / 进出场）、`use-mock-run`（脚本化回放）
