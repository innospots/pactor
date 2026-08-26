# fix-artifact-card-open

## Why

消息流内产出物卡片的"在面板中打开"按钮在受控（DSL）模式下无任何效果：`ChatComposition.handleOpenArtifact` 只在非受控时 `store.open`，受控时不触发任何宿主回调——面板关闭后用户无法从消息卡片重新打开。chat-artifact-panel spec 的"卡片打开面板"场景本就要求"触发面板打开路径（store.open **或宿主回调**）"，实现漏了后者。

## What Changes

- `Chat` / `ChatComposition` / `createChatWorkspace` 新增 `onOpenArtifact(artifact)` 回调（DSL 侧 `events.onOpenArtifact`，event 作用域含 `artifact`）：卡片按钮点击时无条件触发；非受控模式同时 `store.open`（原行为保留）。
- examples/chat 与 examples/admin 的 AI 工作区 YAML 接线：`onOpenArtifact → setState artifact=${event.artifact}, panelOpen=true`。

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `chat-artifact-panel`: "artifact 消息 part"需求的卡片打开场景补受控回调路径。
- `chat-dsl-component`: Chat 组件新增 `events.onOpenArtifact`。

## Impact

- `packages/chat`：chat-composition.tsx、view/Chat.tsx、chat-workspace.tsx + 测试。
- examples/chat、examples/admin 两个 YAML。
- 无破坏性：纯新增回调。
