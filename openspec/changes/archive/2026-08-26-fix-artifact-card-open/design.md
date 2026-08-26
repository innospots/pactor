# Design: fix-artifact-card-open

## Context

受控（DSL）模式下产出物卡片按钮是死按钮：`handleOpenArtifact` 仅 `!panelControlled` 时 `store.open`，受控分支无任何出口。DSL 侧因此无法把"点击卡片"接到面板打开（用户实测：关面板后按钮无效）。

## Decisions

### D1：新增 onOpenArtifact 回调/事件，始终触发

卡片点击 → `onOpenArtifact?.(artifact)` **无条件触发**；非受控时并行 `store.open`（保持纯 React 零接线可用）。受控 DSL 典型接法：`events.onOpenArtifact → setState artifact=${event.artifact}, panelOpen=true`。DSL 适配层折算 event 为 `{ artifact }`（与 onArtifact 同款）。

**备选**：受控时自动等效 setState —— 否决，框架不擅自改受控状态；隐藏受控模式下的按钮 —— 否决，卡片在消息流里应有重开入口。

## Risks / Trade-offs

无实质风险：纯新增回调，既有行为不变。
