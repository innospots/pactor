# Delta: chat-artifact-panel

## MODIFIED Requirements

### Requirement: 产物面板单一实现

ArtifactPanel 的展示实现 SHALL 全仓唯一，归属 `@pactor-app/chat` 的展示组件层（`src/components/`，见 chat-ui-components）；`packages/chat` 的视图层 MUST NOT 保留独立的 ArtifactPanel 展示实现与第二份 `buildArtifactTree` / 产物下载 / dsl-preview 逻辑。chat 版既有能力（inspector 槽、viewRequest 目录定位信号、拖拽调宽、整对象 onSelectArtifact）SHALL 由该唯一实现承载，行为不回归。视图层 SHALL 仅保留 ArtifactStore 数据层与装配接线（chat-composition），根入口的 `ArtifactPanel` / `buildArtifactTree` / `ArtifactPanelProps` / `ArtifactTreeNode` / `ArtifactViewer` / `ArtifactViewers` 导出符号 SHALL 保持可用（指向单一实现）。

#### Scenario: 无重复实现

- **WHEN** 全仓检索 ArtifactPanel 展示实现与 buildArtifactTree 定义
- **THEN** 各仅存在一份（归属 `@pactor-app/chat`），packages/ui 中无残留

#### Scenario: 面板能力不回归

- **WHEN** ChatComposition 打开产物面板，执行产物切换、目录树导航、inspector 槽渲染、拖拽调宽与下载
- **THEN** 各能力行为与收敛前一致

#### Scenario: DSL 预览可用

- **WHEN** 产物面板渲染 dsl 类型产物
- **THEN** 经 runtime Renderer 正常预览，白名单外节点替换为 ChatDenied 占位
