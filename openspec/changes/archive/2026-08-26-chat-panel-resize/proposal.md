# chat-panel-resize

## Why

产出物面板宽度目前固定（`--pactor-chat-inspector-width`，缺省 320px），只能通过皮肤令牌调整；不同产出物（代码/表格/文档）对宽度需求差异大，用户需要**拖拽面板左缘实时调宽**（参考形态：各 IDE / ChatGPT Canvas 侧栏）。

## What Changes

- `ArtifactPanel` 左缘新增拖拽手柄（`role="separator"`，aria 完备）：pointer 拖拽实时改变面板宽度，夹取范围 [240px, 容器宽 70%]；拖拽期间禁文本选择；窄屏（<768px，覆盖抽屉形态）不显示手柄。
- 拖拽结果为组件内部状态（inline width 覆盖令牌缺省）；不改受控 props 契约，DSL 零迁移。

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `chat-artifact-panel`: "面板布局与响应式"需求补拖拽调宽行为。

## Impact

- `packages/chat`：view/ArtifactPanel.tsx + styles.css + 测试。
- 无破坏性：纯增量交互。
