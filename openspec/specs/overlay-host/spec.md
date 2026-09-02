# Spec: overlay-host

Overlay 的 React 渲染层（`pactor-ui-antd` interaction 层）：antd Modal/Drawer、DSL content 渲染、page overlay、InteractionProvider。

### Requirement: Modal/Drawer 渲染

`<OverlayHost>` SHALL 订阅 OverlayManager 堆栈：type 为 modal 渲染 antd Modal、drawer 渲染 antd Drawer，应用 title/width；UI 取消（X/蒙层/取消）MUST 触发取消语义 close。

#### Scenario: 渲染打开的 modal

- **WHEN** manager.open({ type: 'modal', title: '用户详情', content })
- **THEN** 页面出现标题为"用户详情"的 antd Modal

#### Scenario: 点击关闭触发取消语义

- **WHEN** 点击 Modal 的关闭按钮
- **THEN** open 的 Promise resolve `{ success: false }`，弹层消失

### Requirement: DSL content 渲染

条目的 `content`（DslNode）SHALL 经 @pactor-app/runtime Renderer 渲染，作用域注入 `params`（entry.params）与 `parent`（打开时的父作用域快照）。

#### Scenario: content 访问 params

- **WHEN** content 为 `{ type: 'UserDetail', props: { userId: '${params.id}' } }` 且 open 的 params.id 为 7
- **THEN** UserDetail 组件收到 userId 为 7

### Requirement: page overlay 动态加载

条目含 `page.pageId` 时 SHALL 经注入的 `resolvePage(pageId)` 加载 DSL 并渲染；未注入 resolvePage 时 MUST 渲染受控错误提示而非崩溃。

#### Scenario: page overlay 渲染

- **WHEN** resolvePage 返回含 body 的 PageDsl，打开 `{ page: { pageId: 'user-edit' } }`
- **THEN** Drawer/Modal 中渲染该页面 body

#### Scenario: 未注入 resolvePage

- **WHEN** 未注入 resolvePage 打开 page 类型 overlay
- **THEN** 渲染受控错误提示，不抛未捕获异常

### Requirement: InteractionProvider

`<InteractionProvider>` SHALL 基于 antd App 捕获 modal/message API 实例并注入 UiBridge，供 confirm/message 动作使用。

#### Scenario: Provider 挂载后 ui 可用

- **WHEN** 挂载 InteractionProvider 后执行 message 动作
- **THEN** antd message 被调用

### Requirement: overlay 内容响应式

OverlayHost 渲染的 DSL content 中绑定 state / data 的表达式（如 `options: ${state.xxx}`）MUST 随 store 变化重渲染（OverlayHost 订阅 StateStore / DataStore，与页面 Renderer 的订阅语义一致）。

#### Scenario: state 变化驱动 overlay 内容更新

- **WHEN** overlay 已打开且其 content 含 `${state.label}` 绑定，随后 setState 修改 label
- **THEN** overlay 内渲染内容更新为新值，无需关闭重开

#### Scenario: store 变化重渲染

- **WHEN** overlay DSL 绑定 state 的表达式在 store 变化后
- **THEN** overlay 内容随之更新
