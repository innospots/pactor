# Proposal: chat-default-skin

## Why

pactor-chat 的默认形态（空态、工作区头部、侧栏、Composer）与主流 AI 对话产品（参考图：HOJO）存在明显差距：空态下 Composer 钉在底部而非与问候语组成居中组；模型选择只能放在 Composer 工具栏，无法呈现参考图"顶栏仅模型选择"的极简头部；侧栏缺少品牌区/折叠/底部卡片位与状态点。这导致"零配置默认皮肤"不可用，每个宿主都要自行补布局。

## What Changes

- **空态居中组**：会话为空时，问候语/副标题/建议与 Composer 组成垂直居中组渲染（Composer 不再钉底）；有消息后恢复既有消息列表 + 底部 Composer 布局
- **模型选择位置可配**：新增 `modelPlacement?: 'composer' | 'header'`（缺省 'composer' 非破坏）；'header' 时模型 chip 渲染在工作区头部左端，此时即使无 title/headerActions 也渲染极简头部
- **侧栏增强**（ChatShell/AppShell）：桌面端侧栏头部支持 brand 展示与折叠按钮（`collapsible`，缺省 false），折叠后为图标栏（icon rail）；新增 `sidebarFooter` 槽（DslNode/ReactNode，承载设备卡/用户卡等）；`ChatMenuItem` 新增 `dot?: boolean` 状态点
- **Composer 与令牌皮肤**：发送/停止按钮改为上箭头深色圆钮；默认令牌微调（工作区暖白灰、侧栏深一档、卡片/圆角对齐参考图）

无 BREAKING：所有结构 props 缺省保持现状；空态居中组为默认行为变化（仅影响空会话视觉）。

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `chat-empty-state`: 空态布局需求变化——问候组与 Composer 组成垂直居中组
- `chat-model-selector`: 新增 modelPlacement 需求（chip 渲染位置与极简头部规则）
- `chat-app-shell`: 桌面侧栏头部（brand/折叠按钮）、icon rail 折叠态、sidebarFooter 槽
- `chat-dsl-component`: ChatMenuItem.dot、ChatShell 新 props（sidebarFooter/collapsible/brand 桌面展示）、Chat/ChatWorkspace 的 modelPlacement DSL 透传
- `example-chat`: 示例对齐参考形态（modelPlacement: header、侧栏最近组 + dot、footer 卡片、空态居中组）

## Impact

- `packages/chat`：ChatView/EmptyState（空态布局）、ChatComposition/WorkspaceHeader（modelPlacement header 形态）、AppShell/ChatShell/ChatSidebarMenu（侧栏头部/折叠/footer/dot）、Composer（按钮形态）、styles.css（布局 + 令牌）
- `examples/chat`：chat.page.yaml 与 App.tsx 对齐参考形态；app.css 相应精简
- 视觉回归面：空态布局为默认变化；令牌微调影响所有默认皮肤消费者（暗色令牌不变）
