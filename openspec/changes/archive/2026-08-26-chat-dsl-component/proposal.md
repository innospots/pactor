# Proposal: chat-dsl-component

## Why

上一轮（chat-dsl-page）让聊天页可以通过 DSL 声明，但组件需宿主先调 `createChatWorkspace` 工厂创建再注册，且侧栏/header 只能整体注入。目标是让 Chat 成为与 Button/Input 同级的一等 DSL 组件：注册一次即可在任意页面 DSL 里写 `{ type: 'Chat', props: {...}, events: {...} }`，左侧菜单、header 内容等都由 DSL 配置，服务依赖经 React Context 提供者注入一次而非每处工厂创建。

## What Changes

- **新增 `Chat` DSL 组件**（`packages/chat`）：自包含聊天工作区组件（AppShell + header + ChatView 组合），经 `registerChatComponent(registry)` 注册为 `Chat` 类型，用法与内置组件一致。
- **`ChatServicesProvider`**：React Context 提供者，宿主在应用根部注入一次 transport / safeRegistry / capabilities / confirm / user / 附件与提及回调等运行时服务；`Chat` 组件从 context 读取。未提供时渲染受控提示（不抛错）。`createChatWorkspace` 工厂保留兼容，内部改为复用同一组合。
- **DSL 可配置区域**：
  - **左侧菜单**：`menu?: ChatMenuItem[]`（`key/label/icon?/badge?/children?`）+ `activeMenuKey?`（可绑 `${state.x}`）+ `events.onMenuSelect`（ActionConfig，选中项 key 进 event 作用域）；内建侧栏渲染（AppShell 承载，移动端抽屉沿用）。也可用 `sidebar?: DslNode` 槽完全自定义覆盖。
  - **Header**：`title?` 标量 + `headerExtra?: DslNode` 槽（标题右侧区域）；`header?: DslNode` 槽可整体替换。
  - 既有标量 props 沿用：`greeting` / `subtitle` / `suggestions` / `conversationId` / `params`。
- **DSL 事件**：`events.onSend`（event 作用域含 `text`）、`events.onMenuSelect`（含 `key` / `item`），走 renderer 既有 events → ActionConfig 机制。
- **examples/chat 升级**：`chat.page.yaml` 改为 `{ type: 'Chat' }` 声明，菜单、header、问候建议均入 YAML；宿主入口只剩 ChatServicesProvider 装配 + 组件注册 + createPageRuntime。

明确**不在本次范围**：菜单项的真实路由/会话持久化（示例用 DSL state + setState 动作演示）；消息内 dsl part 运行时不变。

## Capabilities

### New Capabilities
- `chat-dsl-component`: Chat 作为一等 DSL 组件——context 服务注入、菜单/header/侧栏区域配置、DSL 事件。

### Modified Capabilities
- `example-chat`: 页面 DSL 从 `ChatWorkspace` 升级为 `Chat` 组件声明，菜单与 header 配置进 YAML。

## Impact

- **代码**：`packages/chat`（新增 `Chat.tsx` / `ChatServicesProvider` / `registerChatComponent`，组合逻辑从 ChatWorkspace 提炼共用）、`examples/chat`（YAML 与宿主装配简化）。
- **API**：纯增量，无 BREAKING（`createChatWorkspace` 保留）。
- **依赖**：无新增运行时依赖。
