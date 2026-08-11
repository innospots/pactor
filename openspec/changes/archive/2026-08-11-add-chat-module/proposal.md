# Proposal: add-chat-module

## Why

设计文档第 56–76 节：Chat 不是一个 ChatBox 组件，而是"AI Message Rendering Protocol + Chat Runtime"——AI 返回的不只是文本，还有 Markdown、DSL UI、Tool 状态。V1 Chat 范围（第 98 节）：text、markdown、dsl、tool-call、tool-result、streaming、Safe Registry。前置已全部就绪：pactor-markdown（markdown part）、pactor-runtime（DSL 渲染与作用域）、pactor-permission（capability 权限）、pactor-interaction（高风险确认）。本变更落地 `pactor-chat`，是 V1 全景的最后一个模块。

## What Changes

- 新增 `pactor-chat` 包（`packages/chat`），dependencies：`pactor-core` / `pactor-runtime` / `pactor-markdown` / `pactor-permission`（workspace:*）；peerDependencies：`react >=18`、`antd >=5`。
- **消息模型（第 58/59/70 节）**：`ChatMessage`（id/role/status/parts）与 Part 类型（text/markdown/dsl/tool-call/tool-result/thinking/error/status）；`ConversationStore`（零 React）：消息与 part 的追加/更新、状态机（pending/streaming/completed/error/cancelled）、订阅。
- **Streaming（第 69 节）**：SSE 事件模型（message.start/text.delta/thinking.delta/tool.start/tool.result/dsl.start/dsl.complete/message.end/message.error）；`applyChatEvent(store, event)` 纯 reducer；`ChatTransport` 接口（`send(input) → AsyncIterable<ChatEvent>`，传输可注入，测试用手动 driver）。
- **Safe Registry（第 63、81.4 节）**：白名单过滤的 ComponentRegistry 包装——AI 生成 DSL 只能使用白名单组件，未命中渲染受控"不支持组件"占位。
- **capability 动作（第 64、81.5 节）**：`action: capability` + `name` → CapabilityRegistry 查找 → PermissionAdapter 检查 → 可选 Confirmation（高风险，经注入的 confirm）→ 执行 → 结果/错误受控返回。
- **Chat 作用域（第 73 节）**：DSL part 渲染时注入 `conversation` / `message` / `user` / `params`，禁止访问浏览器环境（沿用 runtime 表达式约束）。
- **React 视图**：`<ChatView>`（消息列表 + Composer）、`<MessageBubble>`、`<PartRenderer>`（text/markdown 走 pactor-markdown、dsl 走 runtime Renderer + Safe Registry、tool-call/tool-result 折叠状态卡、thinking 折叠、error）；`registerChatLayout(layoutRegistry)` 注册 chat 布局（header + 消息区 + composer，会话历史侧栏留后续）。
- 单元测试（store/reducer/safe registry/capability 纯 Node）+ 组件测试（jsdom 端到端：transport driver 推事件 → 流式渲染 → DSL part 白名单拦截 → capability 动作）。
- 文档站新增 pactor-chat 模块页。

## Capabilities

### New Capabilities

- `chat-message-model`: ChatMessage/Part 类型、ConversationStore 状态机与订阅。
- `chat-streaming`: SSE 事件模型、纯 reducer、ChatTransport 注入接口。
- `chat-safe-registry`: 组件白名单包装、capability 动作（权限+确认+执行）、chat 作用域。
- `chat-view`: ChatView/MessageBubble/PartRenderer/Composer 与 chat 布局注册。

### Modified Capabilities

（无。）

## Impact

- **新增代码**：`packages/chat`；不修改既有包（如需最小补充导出，允许并注明）。
- **V1 范围裁剪**：附件/文件上传、语音、多会话持久化与历史侧栏、chart part 独立类型（用 dsl 表达）、审批流组件、feedback 按钮、服务端 SSE 客户端实现（仅定义 Transport 接口 + 手动 driver）。
- **至此 V1 范围（第 98 节）全部模块落地**；V2（DSL Center、在线编辑等）不在本路线图。
