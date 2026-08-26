# Spec: chat-dsl-component

Chat 作为一等 DSL 组件（`pactor-chat`）：context 服务注入、菜单/header/侧栏区域配置、DSL 事件。

### Requirement: Chat 组件注册

`pactor-chat` SHALL 导出 `registerChatComponent(registry)`：向 DSL 组件注册表注册 `Chat` 类型（已存在同名类型时 MUST NOT 覆盖）。注册后页面 DSL 可以 `{ type: 'Chat', props, events }` 声明完整聊天工作区，与内置组件用法一致。

#### Scenario: 注册并声明

- **WHEN** 宿主调用 registerChatComponent 后，页面 DSL body 为 `{ type: 'Chat' }`
- **THEN** createPageRuntime 正常渲染聊天工作区

#### Scenario: 不覆盖已有注册

- **WHEN** 注册表已含 Chat 类型时再次调用 registerChatComponent
- **THEN** 保留原注册，不覆盖

### Requirement: 服务经 Context 注入

SHALL 导出 `ChatServicesProvider` 与 `useChatServices()`：宿主在应用根部注入一次 `ChatServices`（`transport` 必填；`store`/`storeFactory`/`safeRegistry`/`capabilities`/`permission`/`confirm`/`user`/附件回调/`onMentionTrigger`/`onPlusMenu`/`toolbarStart`/`toolbarEnd` 可选）。`Chat` 组件 SHALL 从最近的 provider 读取服务；无 provider 时 SHALL 渲染受控提示块并 console.warn，MUST NOT 抛错。

#### Scenario: 注入后可用

- **WHEN** ChatServicesProvider 注入 mock transport，DSL 渲染 Chat 并发送消息
- **THEN** 对话 turn 正常执行

#### Scenario: 缺失受控降级

- **WHEN** 无 provider 渲染 Chat
- **THEN** 渲染「未配置聊天服务」提示，不抛错

### Requirement: 左侧菜单配置

`Chat` SHALL 接受 `menu?: ChatMenuItem[]`（`key` / `label` / `icon?` 字符串图标名 / `badge?` / `disabled?` / `group?`）与 `activeMenuKey?: string`：提供 menu 时以 AppShell 承载并渲染内建侧栏（图标名映射内置 lucide 子集，未知名渲染占位；`group` 渲染分组标题）；`activeMenuKey` 控制高亮，可经 `${state.x}` 绑定 DSL state。`sidebar?: DslNode`（或 ReactNode）槽提供时 SHALL 替代内建侧栏。

#### Scenario: 菜单渲染与高亮

- **WHEN** DSL 配置 menu 两项且 activeMenuKey 绑定 state
- **THEN** 侧栏渲染两项，activeMenuKey 对应项高亮

#### Scenario: 未知图标名占位

- **WHEN** 菜单项 icon 为未知名称
- **THEN** 渲染占位图标，不抛错

### Requirement: 菜单选择事件

`Chat` SHALL 支持 `events.onMenuSelect`（ActionConfig）：点击菜单项时触发，event 作用域 SHALL 含 `key`（选中项 key）与 `item`（选中项数据）。点击未禁用项才触发；disabled 项 MUST NOT 触发。

#### Scenario: 选择更新状态

- **WHEN** DSL 配置 onMenuSelect 为 setState 动作（activeMenuKey = ${event.key}），点击菜单项
- **THEN** state 更新且高亮随之切换

#### Scenario: 禁用项不触发

- **WHEN** 点击 disabled 菜单项
- **THEN** 不触发 onMenuSelect

### Requirement: Header 配置

`Chat` SHALL 支持 header 三层配置：`title?` 标量（内建 header 标题）；`headerExtra?: DslNode`（标题右侧槽，经 renderChildren 渲染）；`header?: DslNode`（整体替换内建 header）；`showHeader?: false` 关闭 header。DslNode 槽仅在页面运行时可渲染；纯 React 使用时对应 props SHALL 接受 ReactNode。

#### Scenario: 标题与右侧槽

- **WHEN** DSL 配置 title 与 headerExtra（如一个 Button 节点）
- **THEN** header 渲染标题与右侧按钮

#### Scenario: 整体替换

- **WHEN** DSL 提供 header 节点
- **THEN** 内建 header 不渲染，渲染所给节点

### Requirement: 发送事件

`Chat` SHALL 支持 `events.onSend`：用户发送消息时触发，event 作用域含 `text`。注入 transport 时 turn 驱动不受影响（onSend 与 transport 并行，同 ChatView 语义）。

#### Scenario: 发送触发动作

- **WHEN** DSL 配置 onSend 动作链并发送一条消息
- **THEN** 动作以 event.text 为用户文本执行

### Requirement: ChatShell 外壳组件

`pactor-chat` SHALL 提供 `ChatShell` DSL 组件（注册函数 SHALL 一并注册，已存在同名类型时 MUST NOT 覆盖）：AppShell + 内建菜单侧栏（复用 ChatMenuItem 数据与图标白名单、`activeMenuKey` 高亮、`events.onMenuSelect` 事件，event 作用域含 `key` 与 `item`）+ `content` 主区内容槽（接受 DslNode——经 renderChildren 渲染；或 ReactNode——纯 React 场景可传路由出口等元素）。ChatShell MUST NOT 含聊天逻辑与路由逻辑——菜单点击只触发事件，导航或状态切换由宿主/DSL 决定；`sidebar?: DslNode | ReactNode` 槽提供时 SHALL 替代内建菜单侧栏。典型用法：DSL 场景 content 槽内放若干带 `when` 条件的子树（onMenuSelect → setState 闭环）；应用场景 content 传路由出口，onMenuSelect → bridge.push，刷新后由路由还原页面。

#### Scenario: 菜单切换内容区

- **WHEN** DSL 配置 ChatShell（menu 含 对话/设置 两项，content 槽内两个 when 子树），点击"设置"菜单项触发 onMenuSelect → setState
- **THEN** 主区渲染设置页子树，"设置"菜单项高亮

#### Scenario: 路由出口内容槽

- **WHEN** 纯 React 场景以 ReactNode 传入路由出口作为 content，菜单点击回调执行导航
- **THEN** 内容区随路由渲染对应页面，刷新后按当前 URL 还原

#### Scenario: 切换后对话状态存活

- **WHEN** content 内 Chat 经共享 ConversationStore（services.store）驱动，切换到设置页再切回对话页
- **THEN** 既有消息不丢失

### Requirement: 产出物面板配置

`Chat` SHALL 支持产出物面板的受控配置：`artifact?: ChatArtifact` 与 `panelOpen?: boolean` 可绑 DSL state（`${state.x}`）；`events.onPanelClose` 在面板关闭按钮/遮罩点击时触发（典型接法：setState panelOpen=false）。受控 props 提供时以其为准；未提供时由内部 ArtifactStore 状态驱动。`inspector?: DslNode`（或 ReactNode）槽提供时 SHALL 整体替代面板内建渲染器。

#### Scenario: 受控开关闭环

- **WHEN** DSL 将 panelOpen 绑定 ${state.panelOpen} 且 onPanelClose 配 setState，点击关闭按钮
- **THEN** state 更新且面板随之关闭

#### Scenario: inspector 槽替代内建渲染

- **WHEN** DSL 提供 inspector DslNode 槽
- **THEN** 面板内容区渲染该节点而非内建渲染器

### Requirement: 产出物事件

`Chat` SHALL 支持 `events.onArtifact`：消息流中 artifact part 就绪（status ready）时触发，event 作用域 SHALL 含 `artifact`（产出物数据）。框架 MUST NOT 未经配置擅自打开面板——开面板由 DSL 动作（如 setState）或消息内产出物卡片按钮触发。

#### Scenario: 产出物到达触发动作

- **WHEN** DSL 配置 onArtifact 为 setState 动作链，transport 输出 artifact part 且就绪
- **THEN** 动作以 event.artifact 为产出物数据执行

### Requirement: 卡片打开事件

`Chat` SHALL 支持 `events.onOpenArtifact`（ActionConfig）：点击消息流内产出物卡片的"在面板中打开"按钮时触发，event 作用域 SHALL 含 `artifact`（卡片对应产出物数据）。受控 DSL 场景的典型接法为 setState 写 artifact + panelOpen。

#### Scenario: 卡片点击触发动作

- **WHEN** DSL 配置 onOpenArtifact 为 setState 动作链，点击产出物卡片打开按钮
- **THEN** 动作以 event.artifact 为产出物数据执行
