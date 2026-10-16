# Proposal: chat-view-reuse-ui-components

## Why

Chat 展示能力重复存在于两包：`packages/ui/src/components/chat`（18 个展示组件）与 `packages/chat/src/view/`（Composer / ArtifactPanel / MessageBubble / EmptyState 等）。ui 侧 ArtifactPanel / ChatMessage 的头注释明确标注"移植/参考自 @pactor-app/chat"，产物树构建（`buildArtifactTree`）、下载、DSL 预览等逻辑存在两份实现，行为对齐靠人工同步。由于 `packages/chat` 已依赖 `@pactor-app/ui`，正确的收敛方向是 chat 视图层复用 ui 展示组件、删除包内重复的 UI 实现，chat 只保留运行时职责（store/transport/safeRegistry/chrome DSL 桥接）。

## What Changes

- `packages/chat` 视图层重构为组合 `@pactor-app/ui` 的 chat 展示组件：
  - **Composer**：`view/Composer` 改由 ui `Composer` 承载输入区展示（附件/上下文 chips/模型选择/拖拽粘贴）；chat 侧仅保留 streaming/onStop、IME 守卫、chrome DSL 桥接与 toolbar/mention/plus 回调的接线（ui Composer 缺失的展示能力先补进 ui 组件）。
  - **ArtifactPanel**：`view/ArtifactPanel` 与 ui `ArtifactPanel` 合并为单一实现（归属 ui），chat 缺失能力（inspector 槽、`viewRequest` 定位信号、拖拽调宽、整对象 `onSelectArtifact`）并入 ui 版本；`buildArtifactTree` / artifact 模型 / 下载 / dsl-preview 全仓只留一份。
  - **MessageBubble**：改为组合 ui `ChatMessage` / `Bubble` / `Sender` / `Thinking` / `ToolCall` / `StreamingText` 的展示块；dsl/artifact part 仍经 chat `PartRenderer` 承接，`ActivityTrace` / `MessageActions` 保留。
  - **EmptyState**：改由 ui `Welcome` + `Suggestion` 组合实现；chrome DSL 渲染路径保留。
- 删除 `packages/chat` 中被替换的重复 UI 实现与对应 `.pactor-chat-*` 样式规则（仅删除无引用部分；chrome 层共用类保留）。
- **导出兼容**：`@pactor-app/chat` 根入口继续导出 `Composer` / `ArtifactPanel` / `buildArtifactTree` 等既有符号（改为指向复用后的实现），外部消费方（theme-studio 的 `ChatView`、examples）无需改动。
- `packages/ui` 侧仅在必要时为 chat 组件补齐 chat 运行时需要的展示 props（如 Composer 的 streaming/onStop），不新增对 `@pactor-app/chat` 的依赖，依赖方向保持 ui ← chat 单向。
- 更新受影响测试（composer / artifact-panel / view / message-actions 等）与 doc/docs 文档中相关描述。

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `chat-view`: ChatView 的消息气泡、输入区、空态 SHALL 组合 ui chat 展示组件实现，仓内不得存在第二份重复 UI 实现。
- `chat-artifact-panel`: ArtifactPanel 收敛为单一实现（ui 归属），chat 侧仅保留 ArtifactStore 集成与类型再导出。

## Impact

- **代码**：`packages/chat/src/view/`（Composer、ArtifactPanel、MessageBubble、EmptyState 及牵连的 ChatView、chat-composition、chrome 桥接）、`packages/chat/styles.css`、`packages/chat/src/index.ts`；必要时 `packages/ui/src/components/chat/`（Composer/ArtifactPanel 补 props）。
- **API**：`@pactor-app/chat` 导出面保持稳定（符号不变、实现替换）；`@pactor-app/ui` 的 chat 组件可能新增可选 props（向后兼容）。
- **依赖**：无新增依赖；方向保持 `@pactor-app/chat` → `@pactor-app/ui` 单向。
- **消费方**：theme-studio（`ChatView`）、examples/chat、examples/admin 无需改动；doc/docs 文档描述更新。
- **测试**：packages/chat 的 composer / artifact-panel / view / message-actions / empty-state / model-selector 等测试随实现更新；ui 侧 chat 组件测试若补 props 需增补。
