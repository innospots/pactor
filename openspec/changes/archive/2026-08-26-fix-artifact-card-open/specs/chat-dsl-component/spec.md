# Delta: chat-dsl-component

## ADDED Requirements

### Requirement: 卡片打开事件

`Chat` SHALL 支持 `events.onOpenArtifact`（ActionConfig）：点击消息流内产出物卡片的"在面板中打开"按钮时触发，event 作用域 SHALL 含 `artifact`（卡片对应产出物数据）。受控 DSL 场景的典型接法为 setState 写 artifact + panelOpen。

#### Scenario: 卡片点击触发动作

- **WHEN** DSL 配置 onOpenArtifact 为 setState 动作链，点击产出物卡片打开按钮
- **THEN** 动作以 event.artifact 为产出物数据执行
