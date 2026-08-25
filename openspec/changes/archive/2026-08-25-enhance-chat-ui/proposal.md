# Proposal: enhance-chat-ui

## Why

`pactor-chat` 的协议层（消息模型 / Streaming reducer / Safe Registry / capability 动作）已经完整，但视图层仍是 V1 最小实现：空白会话没有欢迎页、Composer 仅支持纯文本（连 IME 合成守卫都没有）、工具调用/思考过程是孤立的折叠卡片、消息操作只有复制。现有一套经过验证的 Claude 风格 Chat 产品界面可作为功能与视觉参照（流式状态头、配对工具轨迹、空状态建议、四态发送按钮、引用与附件带等），值得在保持 `pactor-chat` "零 antd 运行时依赖 + 纯 CSS 令牌 + 零 React 核心" 架构约束的前提下系统性吸收。仅参照其功能模式与视觉语言，不引用、不绑定其技术栈与代码。

## What Changes

- **空状态 / 欢迎页**：会话为空时渲染问候语（衬线展示字体）+ 起始建议卡片（点击即发送或预填），替代当前的空白消息区。
- **流式状态头与活动轨迹（Activity Trace）**：助手消息顶部增加流式状态行（动画图标 + 呼吸文案 + 计时时长，按事件推导 Reasoning / Tool / Responding 等模式）；`tool-call` 与 `tool-result` 配对为单行可展开轨迹条目（显示参数摘要、状态、耗时），最终答案阶段开始时自动折叠，用户手动展开/折叠后记住偏好。
- **消息操作栏**：在现有复制基础上增加重新生成（末轮）、用户消息"编辑并重发"（截断重跑）、错误重试；操作栏悬停显现。
- **Composer 增强**：IME 合成守卫（中文输入 Enter 不误发送）；发送按钮四态（idle / ready / streaming 可停止）；附件引用模型 + 卡片渲染（图片缩略图 / 文档卡片，上传与存储由调用方负责）；工具栏扩展槽（调用方注入 capability / 模型 / 知识库等选择器）；`@` 提及与 `+` 菜单的插槽式扩展点（pactor-chat 提供入口与弹层容器，具体 picker 由调用方实现）。
- **视觉语言刷新**：`styles.css` 对齐参照界面的设计语言——更大圆角（composer ~26px、卡片 16px）、消息滚动区上下 mask 渐隐、quiet 图标按钮（悬停增亮）、衬线展示字体用于标题/问候、6px 细滚动条；全部收敛进 `--pactor-chat-*` CSS 令牌，保留 `[data-pactor-theme='dark']` 暗色覆盖。
- **接口边界**：所有新功能所需的数据（起始建议、附件、选择器选项、提及列表等）一律以导出的 TypeScript 接口/类型定义，由调用方经 props、受控值或回调注入；功能本身以导出的组件 / hooks / 纯函数形式对外输出。包内 MUST NOT 直接发起网络请求、读取外部数据源或依赖特定框架 API。
- **思考过程升级**：thinking part 支持 markdown 渲染、流式期间展开 + 转圈指示、答案阶段开始自动折叠。

明确**不在本次范围**：会话持久化与多会话侧栏、真实 SSE/WebSocket 客户端、语音输入、文件预览抽屉、后端绑定的具体 picker（图书 / 题库 / 代理列表等）——这些由调用方基于扩展点自行实现。

## Capabilities

### New Capabilities
- `chat-empty-state`: 空会话欢迎页（问候语 + 可配置起始建议，点击发送/预填）。
- `chat-activity-trace`: 流式状态头（模式推导 + 计时）与配对工具轨迹（单行可展开、参数摘要、自动折叠）。
- `chat-message-actions`: 消息操作栏（复制 / 重新生成 / 编辑重发 / 错误重试）及其与 store、turn 驱动的协作。
- `chat-composer-extensions`: Composer 增强——IME 守卫、四态发送按钮、附件引用卡片、工具栏与提及/菜单扩展槽。

### Modified Capabilities
- `chat-view`: 视图结构变化（空状态挂载点、活动轨迹取代独立 tool 卡片、操作栏扩展）与视觉令牌刷新；thinking part 渲染升级。
- `chat-message-model`: `ChatMessage` 增加可选 `attachments` 引用；`ConversationStore` 增加截断/移除方法以支持编辑重发与重新生成。
- `chat-streaming`: 增加重新生成轮次语义（复用末条用户输入重跑 turn，不产生新用户消息）。

## Impact

- **代码**：`packages/chat/src`（`model.ts`、`store.ts`、`events.ts`/`transport.ts` 小幅扩展、`view/` 新增 EmptyState / ActivityTrace / MessageActions 等组件、Composer 重写、`styles.css` 大改）、`packages/chat/tests/`、`examples/chat` 演示更新、文档站 chat 章节。
- **API**：新增导出（`EmptyState` 相关 props、`ChatAttachment` 类型、Composer 扩展槽 props、`runRegenerateTurn` 等）；现有 props 仅做向后兼容的增量扩展，**无 BREAKING**。
- **依赖**：不新增运行时依赖；不引入组件库、样式/动画框架或任何框架专有 API（仅依赖 React + DOM 标准能力），动画用纯 CSS 实现。
