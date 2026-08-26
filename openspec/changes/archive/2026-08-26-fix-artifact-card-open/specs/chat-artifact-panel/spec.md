# Delta: chat-artifact-panel

## MODIFIED Requirements

### Requirement: artifact 消息 part

`ChatPart` 联合 SHALL 新增 `{ id?: string; type: 'artifact'; artifact: ChatArtifact; status?: PartStatus }`。PartRenderer SHALL 将消息流内的 artifact part 内联渲染为"产出物卡片"（标题 + kind 角标 + 打开按钮）；点击打开按钮 SHALL 触发面板打开路径：无条件触发宿主回调 `onOpenArtifact(artifact)`（受控场景的面板打开入口），非受控场景同时 `store.open`（原行为保留）。

#### Scenario: 消息流内产出物卡片

- **WHEN** assistant 消息含 artifact part
- **THEN** 消息区渲染产出物卡片而非原始 JSON

#### Scenario: 卡片打开面板（非受控）

- **WHEN** 未提供受控面板 props 时点击产出物卡片的打开按钮
- **THEN** 内部 store open，面板以该 artifact 打开

#### Scenario: 卡片触发宿主回调（受控）

- **WHEN** 受控模式（panelOpen/artifact 受控）下点击产出物卡片的打开按钮
- **THEN** 触发 onOpenArtifact 回调且 event 含该 artifact（面板开关由宿主/DSL 决定）
