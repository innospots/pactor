# Spec: chat-model-selector

Chat 内建模型选择（`pactor-chat`）：models 受控 props、内建模型 chip、选中值进入 transport 输入。

## ADDED Requirements

### Requirement: 模型列表配置与内建 chip

`Chat` / `ChatWorkspace` SHALL 支持 `models?: { value: string; label: string }[]` 配置。提供非空 `models` 时，Composer 工具栏右端 SHALL 渲染内建模型 chip（当前模型 label + 展开指示），点击打开锚定弹层列出全部模型，选中项带选中标记。`models` 缺省或为空数组时 MUST NOT 渲染模型 chip。内建 chip SHALL 渲染在 `toolbarEnd` 槽位内容之前（两者共存）。

#### Scenario: 配置模型渲染 chip

- **WHEN** DSL 配置 `models: [{ value: 'demo', label: 'demo-mock' }]`
- **THEN** Composer 工具栏右端出现内建模型 chip，显示当前模型 label

#### Scenario: 未配置不渲染

- **WHEN** 未提供 `models`
- **THEN** 工具栏无模型 chip，DOM 与既有行为一致

### Requirement: 受控与非受控选中态

`model?: string` + `onModelChange?: (value: string) => void` 同时提供时为受控模式（以 props 为准）；仅提供 `models` 时为非受控模式，组件自持选中态，缺省选中 `models[0]`。DSL 侧 SHALL 可经 `model: ${state.model}` + `events.onModelChange → setState` 构成受控闭环，event 作用域含 `model`。

#### Scenario: 非受控缺省选中

- **WHEN** 仅配置 `models`（两项），用户未做选择
- **THEN** 当前模型为 `models[0]` 的 value

#### Scenario: 受控闭环

- **WHEN** DSL 绑定 `model: ${state.model}` 与 `events.onModelChange` 的 setState 动作，用户在弹层中选择另一模型
- **THEN** onModelChange 事件以选中值触发，setState 后 chip 显示新模型

### Requirement: 选中模型进入 transport 输入

发送消息时，当前选中模型的 value SHALL 作为 `ChatInput.model` 传入 `transport.send(input)`。未配置 `models` 时 `ChatInput.model` 为 undefined。

#### Scenario: transport 收到模型

- **WHEN** 配置 models 且当前选中 `demo`，发送一条消息
- **THEN** transport.send 收到的 input.model 为 `'demo'`

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
