# Design: chat-on-ui-components

## Context

定位原则：**packages/chat 是用 pactor-app 构建的实例**（Chat 类型页面的便捷封装），其组件一律优先复用 packages/ui 现有组件。已建立的基础设施（chat-chrome-dsl-composition / chat-composer-on-chatinput）：ChromeSlot（类型齐备校验 + 受控回退 + 内部组件 ambient 注册 + wrap）、`chat.*` 内建动作（sendSuggestion / openArtifact / messageAction / composerSubmit）、`.pactor-chat-chrome` 令牌映射。

本批四个迁移区域与缺口：

- ChatSidebarMenu（Chat.tsx:156-222）：数据驱动菜单，项含 badge/dot/group/disabled——ui Menu items 仅有 key/label/icon/children，**需先扩展**；
- ModelChip（77 行）：chip 触发钮 + AnchoredPopover 列表——ui Select 语义等同（受控 value + options + onChange），形态为 select 而非 chip；
- WorkspaceHeader（218 行）：header 条 + 可编辑标题 + 操作组——操作组/槽位可 DSL 化，可编辑标题无 ui 对应构件；
- ArtifactPanel 标题栏：标题 + kind 角标 + 关闭钮——Text/Badge/Button 直对。

## Goals / Non-Goals

**Goals:**

- ui Menu 扩展 badge/dot/group/disabled；四处 chrome 迁移（菜单/模型选择/header 操作组/面板标题栏）
- chrome 片段内图标一律 ui Icon，映射集中；行为契约零变化；fallback 零变化

**Non-Goals:**

- AppShell 本体（chat-app-shell 的 CSS 媒体查询布局约束 + drawer context 命令式 API）、AnchoredPopover（@ 文本锚点 ui Popover 表达不了）、ContextSourceList、ActivityTrace、MessageBubble、流式核心、安全降级链、ArtifactPanel 拖拽调宽
- 可编辑标题的 ui 构件化（无对应组件，保持 chat 内部组件）

## Decisions

### D1：ui Menu items 扩展字段

`MenuItem` 增加 `badge?: string | number`（label 后角标）、`dot?: boolean`（label 右侧 danger 系状态点，与 badge 可共存）、`group?: string`（相邻同组只渲染一次分组标题）、`disabled?: boolean`（置灰不可选，不触发 onSelect）。仅作用于 inline 模式展示层，不动 children 递归与 selectedKey 语义——与 chat 菜单项模型（ChatMenuItem）字段级对齐。

### D2：ChatSidebarMenu → Menu 片段

片段 `{ type: 'Menu', props: { mode: 'inline', items, selectedKey: activeMenuKey }, events: { onSelect: [chat.menuSelect] } }`。items 由 chat 从 ChatMenuItem[] 构建（icon 名经 D7 映射）。`chat.menuSelect`（params.key ← `${event}`）→ 包级 handler → ChatComposition 的 onMenuSelect 传播 + 移动端 drawer close（现 ChatSidebarMenu 内 `drawer?.close()` 语义）。menu 为空或 sidebar 槽提供时不进片段（现状分支不变）。

### D3：ModelChip → Select 片段

片段 `{ type: 'Select', props: { options: models, value: model, className: chip 收敛类 }, events: { onChange: [chat.modelChange] } }`（`chat.modelChange`（params.value ← `${event}`）→ onModelChange）。视觉向 ui kit 对齐：DSL 环境呈现 shadcn Select 形态（不再维持 chip 私有视觉），经 className + chrome 令牌映射收敛尺寸；fallback 保留 ModelChip 原视觉。位置契约不变（header 位 / composer toolbarEnd 槽之前——composer 片段的 ChatComposerToolbarEnd 内 ModelChip 同步换为内部 Select 承载组件，保持同一渲染层决策）。

### D4：WorkspaceHeader → 操作组片段 + 标题内部组件

header 条骨架保持 chat（布局/样式契约），内部：

- 左端：标题区经内部组件 `ChatHeaderTitle`（ambient 注册；editableTitle 的 button↔input 切换交互保持 chat 实现）；
- 右端：headerActions 操作组 + headerExtra 槽经片段渲染——`Tooltip > Button(variant=text) > Icon` 数组（export/theme/clear 图标经 D7 映射），点击经 `chat.headerAction`（params.action）→ 包内 export/theme/clear 行为 + 并行事件传播（onExport/onThemeChange/onClear 契约不变）；headerExtra 为 DslNode 时并入片段 children、ReactNode 时经内部组件槽。

### D5：ArtifactPanel 标题栏 → 片段

`Flex(space-between) > [Flex > Text strong(title) + Badge(kind)] + Button(variant=text, Icon x)`，关闭经 `chat.panelClose` → onClose。拖拽调宽手柄与内容区（markdown/code/text/dsl 渲染器）保持 chat 实现。

### D6：Icon 收敛与映射

新建 `chrome/icons.ts`：chat 图标名 → ui Icon 白名单名的单一映射表（覆盖菜单 MENU_ICONS、操作 MESSAGE_ACTION_ICONS、header 操作、面板关闭等全部片段用图标；已确认 ui 白名单含 copy/check/refresh-ccw/pencil/message-square/Share2/bookmark/settings/history/plus/user/download/sun/moon/trash2/x/panel-right 等，缺失语义就近映射）。未知名 → `circle-question-mark` 占位（与 chat 现状的占位语义一致）。MessageActions 片段的 CHROME_ICON_MAP 迁入该模块统一维护。

### D7：迁移模式复用

全部沿用 ChromeSlot + requires 校验 + 内部组件桥 + fallback：行为（导出/主题/清空/高亮/drawer close/受控规则）零外迁；无 renderer / 类型缺失 / 内部组件名冲突 → 手写实现。新增内建动作：`chat.menuSelect` / `chat.modelChange` / `chat.headerAction` / `chat.panelClose`（注册与宿主优先规则同既有）。

## Risks / Trade-offs

- [ui Menu 扩展影响面（admin 布局菜单共用）] → 扩展为纯增量可选字段，admin 菜单项不含新字段时渲染不变；ui 测试覆盖
- [模型选择视觉变化（chip → Select）] → 既定方向（chrome 向 ui kit 对齐）；fallback 保留原视觉；examples 冒烟核对
- [chat.menuSelect 等动作经异步引擎，高亮反馈延迟] → selectedKey 为受控 prop（activeMenuKey 来自宿主/URL），动作只触发传播与 drawer close，无受控输入时序问题
- [WorkspaceHeader 的 ReactNode 槽（sidebarFooter 类似场景）] → DslNode 进片段、ReactNode 经内部组件槽，双型槽契约（chat-dsl-component D3）不变

## Migration Plan

ui Menu 扩展 → chat 四区域逐块迁移（各自独立 fallback）→ 既有测试零回归 + 新 DSL 路径测试 → 根级验证 + examples 冒烟。回滚 = git revert。

## Open Questions

- ui Select 的 size/外观收敛到工具栏节奏的具体类名（实现期对照 composer 工具栏定稿）
