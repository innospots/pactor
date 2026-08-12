# Proposal: add-example-chat

## Why

`pactor-chat` 是 V1 收官模块（消息模型 / Streaming reducer / Safe Registry / capability 链 / ChatView 视图族），但目前没有任何可运行的示例工程，用户无法直观看到"AI 流式回复 + DSL 卡片 + 工具调用 + 高风险确认"的完整链路，也缺少接入参考。

## What Changes

- 新增 `examples/chat`（包名 `example-chat`，private，端口 **5399**）：独立 React + Vite 工程（不经 pactor-app，直接组合 pactor-chat 视图族）。
- 内置 mock AI transport（`src/mock-ai.ts`）：按用户输入意图流式产出 thinking / markdown / tool-call / dsl part 事件，模拟真实 SSE 服务端节奏（分片延迟）。
- 演示安全边界：Safe Registry 白名单渲染 LLM DSL（白名单外类型渲染 ChatDenied 占位）；capability 动作链（低风险直执行、高风险经 confirm 确认）。
- 附带 README（启动方式、意图口令、代码导览）。

## Capabilities

### New Capabilities

- `example-chat`: pactor-chat 对话示例工程（examples/chat），mock transport 流式演示全 part 类型，可启动可构建可验证。

### Modified Capabilities

（无）

## Impact

- 新增：`examples/chat/**`；workspace 成员（pnpm-workspace.yaml 已含 `examples/*`，无需改动）。
- 依赖：antd ^6（pactor-chat 视图与 pactor-ui-antd 的 peer，与 workspace 现有 antd@6.6.0 对齐）、pactor-chat / pactor-ui-antd workspace 包。
- 根 README 工程结构补登 example-chat（顺带补登已存在的 example-admin-antd）。
- 不影响任何现有包代码。
