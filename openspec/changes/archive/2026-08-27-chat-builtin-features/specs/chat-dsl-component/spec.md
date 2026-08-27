# Spec Delta: chat-dsl-component

## MODIFIED Requirements

### Requirement: Header 配置

`Chat` SHALL 支持 header 三层配置：`title?` 标量（内建 header 标题）；`headerExtra?: DslNode`（标题右侧槽，经 renderChildren 渲染）；`header?: DslNode`（整体替换内建 header）；`showHeader?: false` 关闭 header。DslNode 槽仅在页面运行时可渲染；纯 React 使用时对应 props SHALL 接受 ReactNode。

内建 header SHALL 支持操作组配置 `headerActions?: ('export' | 'theme' | 'clear')[]`：按数组顺序在内建 header 右侧（headerExtra 槽之前）渲染对应图标按钮——export 将当前会话消息序列化为 Markdown 并触发下载；theme 切换 `document.documentElement` 的 `data-pactor-theme`；clear 清空当前会话 store。各操作 SHALL 同时触发并行事件（`events.onExport` / `onThemeChange`（event.theme）/ `onClear`），事件为通知语义，默认行为总在包内执行。`Chat` SHALL 支持 `editableTitle?: boolean`：开启后点击标题进入编辑，Enter / blur 提交并触发 `events.onTitleChange`（event.title）。`headerActions` 缺省时不渲染任何操作按钮。

#### Scenario: 标题与右侧槽

- **WHEN** DSL 配置 title 与 headerExtra（如一个 Button 节点）
- **THEN** header 渲染标题与右侧按钮

#### Scenario: 整体替换

- **WHEN** DSL 提供 header 节点
- **THEN** 内建 header 不渲染，渲染所给节点

#### Scenario: 内建导出

- **WHEN** 配置 `headerActions: ['export']`，会话中有消息，点击导出按钮
- **THEN** 触发 Markdown 文件下载，且 events.onExport 动作链执行

#### Scenario: 内建清空

- **WHEN** 配置 `headerActions: ['clear']` 并点击清空按钮
- **THEN** 会话 store 清空，且 events.onClear 动作链执行

#### Scenario: 可编辑标题

- **WHEN** 配置 `editableTitle: true`，点击标题修改为「周报助手」并提交
- **THEN** header 显示新标题，events.onTitleChange 以 event.title 「周报助手」执行

## ADDED Requirements

### Requirement: 模型选择配置

`Chat` SHALL 支持模型选择 props：`models?: { value: string; label: string }[]`、`model?: string` 与事件 `events.onModelChange`（event 作用域含 `model`）。全部为 DSL 可表达数据；行为细节见 chat-model-selector capability。

#### Scenario: DSL 受控模型

- **WHEN** DSL 配置 `models`、`model: ${state.model}` 与 `events.onModelChange` 的 setState 动作，切换模型
- **THEN** state.model 更新，后续发送的 transport 输入携带新 model

### Requirement: 上下文数据源配置

`Chat` SHALL 支持 `contexts?: ChatContextSource[]` 与事件 `events.onContextsChange`（event 作用域含 `contexts`）；`source.service` 引用经注入的 `ChatServices.callService` 解析。全部为 DSL 可表达数据；行为细节见 chat-context-sources capability。

#### Scenario: DSL 声明上下文源

- **WHEN** DSL 配置 contexts（@ 触发，service 引用）并注入 callService
- **THEN** 输入 @ 出现内建弹层，候选项来自 callService 返回
