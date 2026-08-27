# Spec Delta: chat-model-selector

## ADDED Requirements

### Requirement: 模型选择位置配置

`Chat` / `ChatWorkspace` SHALL 支持 `modelPlacement?: 'composer' | 'header'`（缺省 `'composer'`，为 DSL 可序列化标量）。`'composer'` 时维持既有行为（chip 渲染在 Composer 工具栏右端、toolbarEnd 槽之前）；`'header'` 时模型 chip SHALL 渲染在工作区头部左端（title 之前），且 Composer 不再渲染模型 chip（不重复）。`'header'` 时头部渲染条件 SHALL 扩展：即使未配置 title / headerExtra / headerActions，仅配置 models 也渲染极简头部（参考"顶栏仅模型选择"形态）。受控/非受控选中态规则与 ChatInput.model 语义不随位置变化。

#### Scenario: header 极简形态

- **WHEN** 配置 models 与 `modelPlacement: 'header'`，未配置 title/headerActions
- **THEN** 工作区头部仅渲染模型 chip（左对齐），Composer 工具栏无模型 chip

#### Scenario: 缺省位置不变

- **WHEN** 配置 models 且未配置 modelPlacement
- **THEN** 模型 chip 仍渲染在 Composer 工具栏右端

#### Scenario: 位置不影响选中语义

- **WHEN** `modelPlacement: 'header'` 且受控闭环配置（model + onModelChange），切换模型
- **THEN** onModelChange 触发且后续发送的 transport 输入携带新 model
