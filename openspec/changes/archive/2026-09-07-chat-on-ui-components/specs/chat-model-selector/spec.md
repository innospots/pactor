# Delta: chat-model-selector

## MODIFIED Requirements

### Requirement: 模型列表配置与内建 chip

`Chat` / `ChatWorkspace` SHALL 支持 `models?: { value: string; label: string }[]` 配置。提供非空 `models` 时，Composer 工具栏右端 SHALL 渲染内建模型选择（当前模型 label + 展开指示），点击展开列出全部模型，选中项带选中标记。`models` 缺省或为空数组时 MUST NOT 渲染模型选择。内建模型选择 SHALL 渲染在 `toolbarEnd` 槽位内容之前（两者共存）。

内建模型选择 SHALL 优先经 chat chrome DSL 渲染层以宿主 `Select` 组件承载（见 chat-chrome-dsl；options / 受控 value / onChange 语义等同，选择经 `chat.modelChange` 内建动作接回受控规则 D5），DSL 环境的视觉向 ui kit 对齐（不维持 chip 私有形态）；无 renderer 环境或类型缺失时回退手写 chip 呈现（锚定弹层形态），受控与非受控选中态规则在两条路径 MUST 一致。

#### Scenario: 配置模型渲染 chip

- **WHEN** DSL 配置 `models: [{ value: 'demo', label: 'demo-mock' }]`
- **THEN** Composer 工具栏右端出现内建模型选择，显示当前模型 label

#### Scenario: 未配置不渲染

- **WHEN** 未提供 `models`
- **THEN** 工具栏无模型选择，DOM 与既有行为一致
