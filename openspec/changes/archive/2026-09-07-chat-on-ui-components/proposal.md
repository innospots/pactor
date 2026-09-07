# Proposal: chat-on-ui-components

## Why

`@pactor-app/chat` 的定位确立：**它本身就是一个用 pactor-app 构建的实例**——为开发者提供 Chat 类型页面的便捷封装。因此 chat 内的组件应一律优先复用 `@pactor-app/ui` 的现有组件（Icon、ChatInput、Menu、Select、Button 等），而不是维护平行的手写实现。chat-chrome-dsl-composition 已建立渲染层机制并迁移了空态/操作条/反馈/artifact 卡片，chat-composer-on-chatinput 迁移了 Composer；本变更确立总原则并推进剩余 chrome 的迁移：侧栏菜单、模型选择、workspace header、产出物面板标题栏，以及 Icon 用法的全面收敛。

## What Changes

- **`@pactor-app/ui` Menu 扩展**：`items` 项增加 `badge?`（角标）/ `dot?`（状态点）/ `group?`（分组标题，相邻同组只渲染一次）/ `disabled?`（不可选）——chat 侧栏菜单的展示字段在 ui Menu 中原生可表达
- **ChatSidebarMenu → ui Menu**：menu 配置（含 group/dot/badge/disabled、activeMenuKey 高亮、onMenuSelect 闭环、图标名映射）经 chrome 片段以 Menu 渲染；选择经 `chat.menuSelect` 内建动作接回（含移动端 drawer 关闭语义）
- **ModelChip → ui Select**：models/value/onChange 经 Select 承载（`chat.modelChange` 动作）；视觉向 ui kit 对齐（不再维持 chip 私有形态，fallback 路径保留原 chip）
- **WorkspaceHeader → ui 组合**：右端操作组（export/theme/clear）与 headerExtra 槽经 Button/Tooltip/Icon 片段渲染（`chat.headerAction` 动作）；可编辑标题交互保持 chat 内部组件（ui 无对应构件）
- **ArtifactPanel 标题栏 → ui 组合**：Text + Badge + Button（`chat.panelClose`）；内容区渲染器（markdown/code/dsl 活预览）保持
- **Icon 收敛**：全部 chrome 片段内图标一律用 ui Icon，chat 图标名 → ui Icon 白名单的映射集中维护（未知名渲染占位，语义与现状一致）；fallback 路径保留 lucide（守零运行时依赖契约）
- 机制不变：ChromeSlot + 类型齐备校验 + 受控回退（无 renderer / 类型缺失 / 宿主占用内部组件名时回退手写实现）

## Capabilities

### New Capabilities

（无——机制由 chat-chrome-dsl 承载）

### Modified Capabilities

- `layout-components`: 「Menu 导航菜单组件」——items 项扩展 badge/dot/group/disabled 展示字段
- `chat-dsl-component`: 「左侧菜单配置」——内建侧栏菜单优先经 ui Menu DSL 组合渲染（配置契约不变）；「Header 配置」——内建 header 操作组与 headerExtra 槽优先经 ui 组件组合渲染（行为契约不变）
- `chat-model-selector`: 「模型列表配置与内建 chip」——模型选择在 DSL 环境经 ui Select 承载，受控规则与位置契约（toolbarEnd 槽之前）不变
- `chat-artifact-panel`: 「ArtifactPanel 视图与内建渲染器」——标题栏优先经 ui 组件组合渲染（内容区内建渲染器不变）

## Impact

- **代码**：`packages/ui/src/components/components/Menu/`（扩展）、`packages/chat/src/view/`（Chat/ChatShell 菜单、ModelChip、WorkspaceHeader、ArtifactPanel）、`packages/chat/src/view/chrome/`（新片段与内建动作、图标映射）
- **规格**：`layout-components`、`chat-dsl-component`、`chat-model-selector`、`chat-artifact-panel` 增量
- **测试**：既有测试全走 fallback（零回归）；各区域新增 DSL 路径测试
- **视觉**：DSL 环境下模型选择呈现为 shadcn Select 形态（既定变化，fallback 不变）；其余区域经 chrome 令牌映射与 className 复用保持视觉一致
- **不影响**：Chat props 配置契约、ChatServices、chat-domain 核心（气泡/流式/活动轨迹/安全降级链）、AppShell 本体与 AnchoredPopover（后续批次）
