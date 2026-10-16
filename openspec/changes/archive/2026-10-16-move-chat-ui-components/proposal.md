# Proposal: move-chat-ui-components

## Why

上一变更（chat-view-reuse-ui-components）已将 `packages/chat` 视图层收敛为组合 `@pactor-app/ui` 的 chat 展示组件，运行时与展示的职责边界已清晰。但 18 个 chat 展示组件本体仍在 `packages/ui/src/components/chat/`，开发者需要引用 chat UI 组件时要从通用 UI 包取域组件，归属混乱；且 chat 包的组合层隔着包边界引用自己的核心零件。将 chat 展示组件迁入 `@pactor-app/chat`，使 chat 域代码（协议 + 运行时 + 展示组件）收敛为单一包，开发者经 `@pactor-app/chat/components` 一站式引用。

## What Changes

- **BREAKING**: `packages/ui/src/components/chat/` 18 个组件（AgentStatus / ArtifactPanel / Attachment / Bubble / ChatMessage / ChatPage / Citation / Composer / ConversationList / MessageList / Prompt / Sender / StepsPanel / StreamingText / Suggestion / Thinking / ToolCall / Welcome）迁至 `packages/chat/src/components/`；`@pactor-app/ui` 根入口与 `/components` 子路径不再导出这些符号。
- **BREAKING**: ui `createComponentRegistry` 的 `builtinComponents` 不再内置上述 chat 类型；改由 `@pactor-app/chat` 导出 `registerChatComponents(registry)` 注册（同名不覆盖语义）。
- `@pactor-app/chat` 新增子路径出口 `@pactor-app/chat/components`，导出 18 个展示组件与 `registerChatComponents`；根入口既有导出（`Composer`/`ArtifactPanel`/`buildArtifactTree` 等组合层符号）不变，仅改为指向包内实现。
- `packages/chat` 构建增加 Tailwind 编译步骤（对齐 ui 的 `tsup && tailwindcss`），迁移组件的 Tailwind 工具类随 `@pactor-app/chat/styles.css` 分发；ui `styles.css` 的 `--pactor-chat-rail-*` 令牌迁入 chat。
- 迁移 ui 侧 chat 组件测试（ai-chat-components / chat-page / artifact-panel）至 `packages/chat/tests/`。
- 更新消费方：`doc/` 预览（basic-e.tsx 改从 `@pactor-app/chat/components` 导入）、DSL 预览注册处调用 `registerChatComponents`、详情数据文案；`docs/` 包文档。
- 不动：`packages/ui/src/components/components/ChatInput` 等通用组件留在 ui（chat 组件经 `@pactor-app/ui` 引用，依赖方向保持 ui ← chat 单向）。

## Capabilities

### New Capabilities

- `chat-ui-components`: chat 展示组件族（18 个）归属 `@pactor-app/chat` 后的导出契约（`/components` 子路径）、DSL 注册入口 `registerChatComponents`、样式分发（Tailwind 编译 + 令牌归属）。

### Modified Capabilities

- `ui-package-structure`: ui 包不再包含/导出 chat 展示组件，`builtinComponents` 不再内置 chat 类型。
- `chat-dsl-component`: 新增 `registerChatComponents` 注册契约。
- `chat-view`: 「视图层复用 ui 展示组件」需求更新——展示组件改从 `@pactor-app/chat` 包内取（迁入后组合层不再跨包引用）。
- `chat-artifact-panel`: 「产物面板单一实现」需求更新——唯一实现的归属从 ui 改为 `@pactor-app/chat`。

## Impact

- **代码**：`packages/ui/src/components/chat/`（整目录迁出）、`packages/ui/src/components/index.ts`、`packages/ui/src/components/register.ts`、`packages/ui/src/styles.css`（令牌迁出）、`packages/chat/src/components/`（新建）、`packages/chat/src/index.ts`、`packages/chat` package.json / tsup / styles 构建。
- **API（破坏性）**：`@pactor-app/ui` 及 `/components` 移除 18 个 chat 组件导出；`builtinComponents` 移除对应 DSL 类型。迁移路径：`@pactor-app/chat/components` + `registerChatComponents`。
- **依赖**：chat 新增 tailwindcss devDependency（构建期）；运行时依赖方向不变（chat → ui/core/runtime）。
- **消费方**：`doc/`（预览导入路径、DSL 注册、详情文案、package.json）；theme-studio、examples 不受影响（不引用这 18 个组件）。
- **测试**：ui 侧 chat 测试迁入 chat；全仓构建/测试/doc astro build 需通过。
