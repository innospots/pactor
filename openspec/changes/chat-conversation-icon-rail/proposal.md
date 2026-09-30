# chat-conversation-icon-rail

## Why

ChatPage 对话区 header 目前固定渲染一个产物区开关图标（未配置 `conversationHeaderAction` 时的缺省行为），header 空间被单一功能占死，且「产物、执行步骤」等对话级附加信息没有统一的扩展入口。需要把这类附加内容的入口从 header 迁出，收敛为 header 下方一条纵向图标栏，点击图标 toggle 展示对应内容（侧栏面板或悬浮弹框）。

## What Changes

- **BREAKING**（视觉/行为）：ChatPage 对话区 header 不再默认渲染产物区开关图标；仅当显式配置 `conversationHeaderAction` 时才展示该按钮（现有逻辑取反——现在是未配置才显示缺省开关）。
- 新增对话区图标栏（conversation rail）：位于 header 下方、对话内容侧边，由上到下排列图标按钮；无配置项时整栏不渲染。
- 每个图标项绑定一块「对话附加内容」（如产物列表、执行步骤），点击图标 toggle 展示/收起；再次点击或点击其他图标切换。
- 附加内容支持两种呈现形态（按图标项配置）：**panel**（复用产物栏式右侧固定宽栏）与 **popover**（在图标栏旁悬浮的弹框，参考设计截图）。
- 产物区开关迁移为图标栏的内置入口之一（保持现有产物面板能力与受控 props 不变）。

## Capabilities

### New Capabilities

- `chat-conversation-side-rail`: ChatPage 对话区图标栏——header 默认图标的移除、图标栏渲染与显隐、图标项点击 toggle、panel / popover 两种附加内容呈现形态及其与产物面板的整合。

### Modified Capabilities

（无——现有 spec 未覆盖 ChatPage 对话区 header 图标行为，全部以新 capability 需求表达）

## Impact

- `packages/ui/src/components/chat/ChatPage/index.tsx`：header 缺省开关移除、图标栏渲染、panel/popover 容器。
- 可能触及 `packages/ui/src/components/chat/ArtifactPanel/`（作为 panel 形态的复用对象）与 chat 样式令牌（`--pactor-chat-*`，图标栏宽度 / popover 定位）。
- DSL 侧（`@pactor-app/chat` 的 Chat 组件 props 映射）如需暴露图标栏配置，同步补充；纯 React 宿主经 props 直接使用。
- 依赖 `conversationHeaderAction` 缺省行为的宿主需要显式配置才能保留 header 按钮。
