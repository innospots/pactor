# Design: chat-default-skin

## Context

参考图（HOJO）的默认形态要素：侧栏 = 品牌行（左 logo/名 + 右折叠钮）+ 图标菜单（badge）+「最近」分组会话列表（状态点）+ 底部设备卡/用户卡；工作区顶栏极简（仅模型选择，左对齐）；空态 = 大问候语与 Composer 组成垂直居中组；Composer 为白底圆角卡片（左 "+"，右 mic + 深色圆钮上箭头发送）。

现状差距：空态 greeting 居中但 Composer 钉底；模型 chip 只能在 Composer 工具栏；AppShell 的 brand 只在移动端 topbar；侧栏无折叠/footer/dot。

约束（既有契约）：组件样式自持（styles.css + `--pactor-chat-*` 令牌）；函数不进 DSL props；零渲染承诺（未配置的新 props 不改变 DOM）；移动端抽屉行为不回退。

## Goals / Non-Goals

**Goals:**

- 空态下问候组与 Composer 垂直居中成组（参考图布局）
- `modelPlacement: 'header'` 时呈现参考图极简头部（左端模型 chip）
- 侧栏支持品牌行、桌面折叠（icon rail）、底部卡片槽、菜单项状态点
- Composer 发送钮与默认令牌对齐参考图气质

**Non-Goals:**

- 不做语音输入（mic）——宿主经 toolbarEnd 槽自行接入
- 不做会话列表的数据管理（删除/重命名/持久化）——侧栏仍是纯展示 + 事件
- 折叠状态不做受控/持久化（V1 内部非受控）
- 不动暗色令牌

## Decisions

### D1: 空态居中组 = ChatView 布局分支，非新组件

`messages.length === 0` 时 ChatView 渲染 `pactor-chat-view--empty` 变体：消息区为居中 flex 容器，EmptyState 与 Composer 作为同一居中列的相邻子节点（问候在上、建议在中、Composer 在下，列宽沿用 `--pactor-chat-content-width`）。有消息后恢复既有分支（消息列表 + 钉底 Composer）。

**为什么默认开启而非 opt-in**：参考图即主流默认形态；仅影响空会话视觉，不影响任何交互与消息态布局。EmptyState 组件本身不改（仍在消息区内渲染），变化在 ChatView 的容器类与 CSS。

### D2: modelPlacement 在 ChatComposition/WorkspaceHeader 层解析

`modelPlacement?: 'composer' | 'header'`（缺省 'composer'）：

- 'composer'：现状（Composer 工具栏 chip）
- 'header'：模型 chip 渲染在工作区头部**左端**（title 位置）；此时 header 渲染条件扩展为 `showHeader && (title/headerExtra/headerActions/modelPlacement==='header' 任一)`——仅模型配置时呈现参考图极简头部；title 同时存在时模型 chip 在 title 之前
- ChatView 仍是状态唯一来源（currentModel/handleModelChange 不变）；'header' 时 Composer 不再渲染模型 chip（不重复）
- Chat/ChatWorkspace 透传同名 prop（DSL 可序列化标量）

### D3: 侧栏头部与折叠（AppShell 层）

- ChatShell 提供 `brand` 时，桌面端在侧栏顶部渲染品牌行（brand 左、折叠钮右）；移动端维持 topbar 现状
- `collapsible?: boolean`（缺省 false）：折叠钮点击切换内部 `collapsed` 状态（非受控，ref/state 自持）；折叠后桌面侧栏为 icon rail（约 64px：菜单只显图标，label/badge/group/footer/brand 文案隐藏，tooltip 由 title 属性兜底）；移动端抽屉语义不变（折叠状态不影响抽屉）
- AppShell 增加 `sidebarFooter?: ReactNode`（渲染在侧栏滚动区之后的固定底部区）；ChatShell 透传 DslNode/ReactNode 双型槽
- 折叠钮图标用 lucide `PanelLeft`（与参考图语义一致），aria-expanded/aria-label 标注

### D4: ChatMenuItem.dot 状态点

`dot?: boolean`——在 label 右侧渲染状态圆点（`--pactor-chat-danger` 系令牌着色，参考图红点）。与 badge 可共存（badge 为计数胶囊，dot 为状态点）。DSL 可序列化布尔。

### D5: Composer 与令牌皮肤

- 发送/停止按钮：圆形实心（`--pactor-chat-primary` 深色系）、图标改 `ArrowUp` / `Square`（停止保持方块）；禁用态降透明度。视觉变化不涉及交互契约（chat-composer-extensions 的状态机不动）
- 默认令牌微调：`--pactor-chat-bg` 由纯白调整为暖白灰（参考图气质，约 #f7f6f3 档）；侧栏背景新增独立令牌 `--pactor-chat-sidebar-bg`（深一档，约 #efeeea 档）；Composer 卡片保持白底浮于其上。暗色令牌不动
- 侧栏宽度、菜单 item 圆角/间距微调对齐参考图

## Risks / Trade-offs

- [空态布局为默认行为变化，既有用户的空会话视觉改变] → 仅 CSS 层变化、无交互契约变化；暗色/令牌覆盖用户自动继承新布局
- [令牌默认值调整影响所有默认皮肤消费者] → 用户明确要求"默认参考如图"；自定义令牌覆盖的用户不受影响
- [icon rail 下 group/footer 隐藏导致信息不可达] → 折叠是用户主动行为且有 tooltip 兜底；V1 不做折叠态 flyout 菜单
- [空态居中组在极矮视口溢出] → 容器 `overflow-y: auto` + `margin: auto` 居中模式（溢出时自然从顶部滚）

## Migration Plan

无迁移。examples/chat 同步改为参考形态（modelPlacement: 'header'、侧栏分组/状态点/footer 卡片、空态）作为回归验证。
