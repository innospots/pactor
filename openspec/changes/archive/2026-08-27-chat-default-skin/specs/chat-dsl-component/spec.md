# Spec Delta: chat-dsl-component

## MODIFIED Requirements

### Requirement: ChatShell 外壳组件

`pactor-chat` SHALL 提供 `ChatShell` DSL 组件（注册函数 SHALL 一并注册，已存在同名类型时 MUST NOT 覆盖）：AppShell + 内建菜单侧栏（复用 ChatMenuItem 数据与图标白名单、`activeMenuKey` 高亮、`events.onMenuSelect` 事件，event 作用域含 `key` 与 `item`）+ `content` 主区内容槽（接受 DslNode——经 renderChildren 渲染；或 ReactNode——纯 React 场景可传路由出口等元素）。ChatShell MUST NOT 含聊天逻辑与路由逻辑——菜单点击只触发事件，导航或状态切换由宿主/DSL 决定；`sidebar?: DslNode | ReactNode` 槽提供时 SHALL 替代内建菜单侧栏。典型用法：DSL 场景 content 槽内放若干带 `when` 条件的子树（onMenuSelect → setState 闭环）；应用场景 content 传路由出口，onMenuSelect → bridge.push，刷新后由路由还原页面。

ChatShell SHALL 支持侧栏增强（设计决策 D3/D4）：`brand` 提供时桌面端渲染于侧栏头部品牌行；`collapsible?: boolean`（DSL 可序列化布尔，缺省 false）透传 AppShell 折叠能力；`sidebarFooter?: DslNode | ReactNode` 侧栏底部槽（DslNode 经 renderChildren 渲染，ReactNode 原样渲染）。

#### Scenario: 菜单切换内容区

- **WHEN** DSL 配置 ChatShell（menu 含 对话/设置 两项，content 槽内两个 when 子树），点击"设置"菜单项触发 onMenuSelect → setState
- **THEN** 主区渲染设置页子树，"设置"菜单项高亮

#### Scenario: 路由出口内容槽

- **WHEN** 纯 React 场景以 ReactNode 传入路由出口作为 content，菜单点击回调执行导航
- **THEN** 内容区随路由渲染对应页面，刷新后按当前 URL 还原

#### Scenario: 切换后对话状态存活

- **WHEN** content 内 Chat 经共享 ConversationStore（services.store）驱动，切换到设置页再切回对话页
- **THEN** 既有消息不丢失

#### Scenario: 侧栏底部槽

- **WHEN** DSL 配置 sidebarFooter 为一个 Card 节点
- **THEN** 该卡片固定渲染在侧栏底部

## ADDED Requirements

### Requirement: 菜单项状态点

`ChatMenuItem` SHALL 支持 `dot?: boolean`（DSL 可序列化布尔）：为 true 时在菜单项 label 右侧渲染状态圆点（danger 系令牌着色）。dot 与 badge 可共存（badge 为计数胶囊，dot 为状态点）；缺省 / false 时不渲染。

#### Scenario: 状态点渲染

- **WHEN** menu 中一项配置 `dot: true`
- **THEN** 该菜单项 label 右侧出现状态圆点

#### Scenario: 缺省无状态点

- **WHEN** menu 项未配置 dot
- **THEN** 该菜单项无状态点，DOM 与既有行为一致
