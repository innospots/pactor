# Delta: chat-dsl-component

## MODIFIED Requirements

### Requirement: 左侧菜单配置

`Chat` SHALL 接受 `menu?: ChatMenuItem[]`（`key` / `label` / `icon?` 字符串图标名 / `badge?` / `disabled?` / `group?`）与 `activeMenuKey?: string`：提供 menu 时以 AppShell 承载并渲染内建侧栏（图标名映射图标白名单，未知名渲染占位；`group` 渲染分组标题）；`activeMenuKey` 控制高亮，可经 `${state.x}` 绑定 DSL state。`sidebar?: DslNode`（或 ReactNode）槽提供时 SHALL 替代内建侧栏。

内建侧栏菜单 SHALL 优先经 chat chrome DSL 渲染层以宿主 `Menu` 组件组合渲染（见 chat-chrome-dsl；badge / dot / group / disabled 由 Menu items 扩展字段表达，图标经 ui Icon 白名单映射），选择经 `chat.menuSelect` 内建动作接回包内传播（含移动端 drawer 关闭语义）；无 renderer 环境或类型缺失时回退 chat 手写菜单，两条路径的渲染字段与交互语义 MUST 一致。

#### Scenario: 菜单渲染与高亮

- **WHEN** DSL 配置 menu 两项且 activeMenuKey 绑定 state
- **THEN** 侧栏渲染两项，activeMenuKey 对应项高亮

#### Scenario: 未知图标名占位

- **WHEN** 菜单项 icon 为未知名称
- **THEN** 渲染占位图标，不抛错

### Requirement: Header 配置

`Chat` SHALL 支持 header 三层配置：`title?` 标量（内建 header 标题）；`headerExtra?: DslNode`（标题右侧槽，经 renderChildren 渲染）；`header?: DslNode`（整体替换内建 header）；`showHeader?: false` 关闭 header。DslNode 槽仅在页面运行时可渲染；纯 React 使用时对应 props SHALL 接受 ReactNode。

内建 header SHALL 支持操作组配置 `headerActions?: ('export' | 'theme' | 'clear')[]`：按数组顺序在内建 header 右侧（headerExtra 槽之前）渲染对应图标按钮——export 将当前会话消息序列化为 Markdown 并触发下载；theme 切换 `document.documentElement` 的 `data-pactor-theme`；clear 清空当前会话 store。各操作 SHALL 同时触发并行事件（`events.onExport` / `onThemeChange`（event.theme）/ `onClear`），事件为通知语义，默认行为总在包内执行。`Chat` SHALL 支持 `editableTitle?: boolean`：开启后点击标题进入编辑，Enter / blur 提交并触发 `events.onTitleChange`（event.title）。`headerActions` 缺省时不渲染任何操作按钮。

内建 header 的操作组与 headerExtra 槽 SHALL 优先经 chat chrome DSL 渲染层以宿主组件（Button / Tooltip / Icon 等）组合渲染（见 chat-chrome-dsl），操作点击经 `chat.headerAction` 内建动作接回包内行为与并行事件；可编辑标题的编辑交互保持 chat 内部组件。无 renderer 环境或类型缺失时回退手写实现，行为契约不变。

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
