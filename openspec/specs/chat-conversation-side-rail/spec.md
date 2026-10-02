# Spec: chat-conversation-side-rail

## Purpose

ChatPage 对话区图标栏（conversation rail）：header 缺省图标移除、图标栏渲染与显隐、图标项 toggle 交互、panel / popover 两种附加内容呈现形态，以及产物区开关的内置迁移。

## Requirements

### Requirement: 对话区 header 不渲染缺省图标

ChatPage 对话区 header SHALL 仅渲染标题；仅当显式配置 `conversationHeaderAction` 时才 SHALL 渲染右侧操作按钮（点击经 `onConversationHeaderAction` 传出）；未配置时 MUST NOT 渲染任何缺省按钮（包括产物区开关）。

#### Scenario: 未配置 headerAction

- **WHEN** 渲染 ChatPage 且未传 `conversationHeaderAction`
- **THEN** 对话区 header 只含标题，右侧无任何按钮

#### Scenario: 配置 headerAction

- **WHEN** 传入 `conversationHeaderAction` 并点击该按钮
- **THEN** 渲染图标 / 文案按钮且触发 `onConversationHeaderAction`

### Requirement: 对话图标栏渲染与显隐

ChatPage SHALL 在对话区 header 下方、对话内容右缘渲染纵向图标栏（conversation rail），图标由上到下排列，宽度经令牌 `--pactor-chat-rail-width`（缺省 40px）可调；每个图标项 hover SHALL 展示 tooltip（取 `label`）。`conversationRailItems` 为空且 `hideArtifactRailItem` 为 true 时 MUST NOT 渲染图标栏 DOM。

#### Scenario: 默认含产物项

- **WHEN** 默认渲染 ChatPage（未传 conversationRailItems / hideArtifactRailItem）
- **THEN** 图标栏渲染且首项为产物入口图标

#### Scenario: 整栏隐藏

- **WHEN** `conversationRailItems` 为空且 `hideArtifactRailItem: true`
- **THEN** 不渲染图标栏，对话区不留图标栏宽度

### Requirement: 产物入口迁移为图标栏内置项

产物区开关 SHALL 作为图标栏内置项（key `artifact`）缺省渲染在首位，图标随开关态切换（开：`panel-right-close`，关：`panel-right-open`）；点击 SHALL 走既有产物开关状态机——受控 `artifactOpen` + `onArtifactOpenChange` 闭环与非受控 `defaultArtifactOpen` 语义不变；`hideArtifactRailItem: true` 时 MUST NOT 渲染该项。产物面板本身（预览 / 目录树 / 下载 / Resizable 调宽）行为 MUST 保持不变。

#### Scenario: 点击产物图标 toggle

- **WHEN** 点击图标栏产物图标
- **THEN** 产物区打开 / 收起，受控宿主收到 `onArtifactOpenChange`

#### Scenario: 产物面板能力保持

- **WHEN** 产物区处于打开态
- **THEN** 面板预览 / 目录树 / 下载 / 拖拽调宽与变更前一致

### Requirement: 图标项 toggle 与状态机

图标项点击 SHALL toggle 对应附加内容：点击未激活项激活之，点击已激活项收起，点击其他项切换。非受控时内部维护 `activeRailKey`；提供 `activeConversationRailKey` 即受控，变更经 `onConversationRailChange` 传出。同一时刻 SHALL 至多一个 panel 项与一个 popover 项处于激活态。

#### Scenario: toggle 开关

- **WHEN** 依次点击同一图标项两次
- **THEN** 附加内容先展示后收起

#### Scenario: 项间切换

- **WHEN** 项 A 激活时点击项 B
- **THEN** A 内容关闭，B 内容展示

#### Scenario: 受控模式

- **WHEN** 传入 `activeConversationRailKey` 并点击图标项
- **THEN** 内部状态不变更，仅触发 `onConversationRailChange`

### Requirement: panel 形态附加内容

`display: 'panel'` 的激活项 SHALL 在产物区分栏位渲染其 `content`（右侧固定宽栏，与产物面板同位）；panel 项与产物区 SHALL 互斥——激活 panel 项时产物区关闭（受控宿主经 `onArtifactOpenChange(false)` 闭环），打开产物区时激活的 panel 项关闭。

#### Scenario: panel 项渲染

- **WHEN** 激活 `display: 'panel'` 的图标项
- **THEN** 其 content 渲染在右侧分栏（原产物面板位置）

#### Scenario: 与产物区互斥

- **WHEN** 产物区打开时激活 panel 项
- **THEN** 产物区关闭并展示 panel 项内容

### Requirement: popover 形态附加内容

`display: 'popover'`（缺省）的激活项 SHALL 将其 `content` 渲染为悬浮弹层：定位于图标栏左侧、header 下缘之下，不占布局空间；宽度经令牌 `--pactor-chat-rail-popover-width`（缺省 320px）且不超过可用宽度；Esc、点击弹层外部或再次点击该图标 SHALL 关闭弹层。

#### Scenario: 弹层定位与渲染

- **WHEN** 激活 popover 图标项
- **THEN** 弹层浮于图标栏左侧，对话区布局不位移

#### Scenario: 弹层关闭

- **WHEN** 弹层打开时按 Esc 或点击弹层外部
- **THEN** 弹层关闭，对应项回到未激活态

### Requirement: 附加内容槽位渲染

图标项 `content` SHALL 复用组件既有槽位渲染路径：React 元素直接渲染，普通对象按 DslNode 经 ambient renderer 渲染；未提供 `content` 的项激活时 MUST NOT 渲染空 panel / popover（仅 tooltip 入口，点击仅触发 change 事件）。

#### Scenario: DSL 内容渲染

- **WHEN** 图标项 content 为 DslNode 且环境具备 renderer
- **THEN** 经 renderChildren 渲染宿主组件

#### Scenario: 无内容项

- **WHEN** 激活未配置 content 的图标项
- **THEN** 不渲染 panel / popover 容器，仅触发状态变更事件
