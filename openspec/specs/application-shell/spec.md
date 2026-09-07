# Spec: application-shell

## Purpose

Application React 组合（`@pactor-app/app`）：动态路由、布局包裹、页面加载态、ErrorBoundary、Overlay/Provider 集成。


## Requirements

### Requirement: 动态路由集成

SHALL 以 react-router 承载路由（支持 basename），DynamicDslRoute 命中菜单页时渲染页面加载器；未命中渲染 404 页；无权限渲染 403 页。

#### Scenario: 菜单导航渲染页面

- **WHEN** 点击菜单项（bridge 导航）
- **THEN** 渲染对应 pageId 的 DSL 页面

#### Scenario: 未注册路径 404

- **WHEN** 访问未注册路径
- **THEN** 渲染 404 提示

#### Scenario: 无权限 403

- **WHEN** 访问无权限的页面路径
- **THEN** 渲染 403 提示

### Requirement: 页面加载与错误处理

页面加载中 SHALL 渲染 loading 态；加载失败（网络/校验错误）MUST 渲染受控错误页；渲染期异常 MUST 被 ErrorBoundary 捕获并显示受控错误页，不白屏。

#### Scenario: 加载失败错误页

- **WHEN** loadPage reject
- **THEN** 渲染错误页而非崩溃

#### Scenario: 渲染异常被捕获

- **WHEN** 页面某注册组件渲染时抛错
- **THEN** ErrorBoundary 显示错误页，应用外壳不崩溃

### Requirement: 布局包裹

页面 MUST 渲染在解析后的布局组件内；admin 布局传入 brand/registry/bridge/route/headerExtra；布局开关来自 bootstrap.layout 配置。

#### Scenario: admin 外壳包裹页面

- **WHEN** bootstrap.layout.type 为 admin 且 tabs 开启
- **THEN** 页面内容出现在 AdminLayout 内容区，菜单与页签可见

### Requirement: Overlay 与交互集成

OverlayHost 与 InteractionProvider MUST 集成进组合层：DSL 动作可打开 overlay 并渲染 DSL 内容；page 类型 overlay 经 loader 加载；message/confirm 动作可用。

#### Scenario: 页面内打开 overlay

- **WHEN** 页面按钮执行 overlay.open（content 含文本组件）
- **THEN** 出现 Modal/Drawer 且渲染该内容

#### Scenario: message 动作

- **WHEN** 页面执行 message 动作
- **THEN** antd message 出现对应提示

### Requirement: 应用级 providers 槽位

`createPactorApplication` SHALL 支持 `providers?: ComponentType<{ children?: ReactNode }>`：该组件在 Router 之内、InteractionKit 之外包装应用内容（业务 ConfigProvider / 全局 Context 由此进入应用树，message/modal/overlay 均消费其上下文）。缺省不包装。

#### Scenario: providers 包装应用

- **WHEN** 传入 providers 组件
- **THEN** 应用内容被该组件包装，其 Context 对页面 DSL 渲染树可见

#### Scenario: 缺省不包装

- **WHEN** 未传 providers
- **THEN** 应用结构与不传时一致，无额外包装层

### Requirement: headerExtra 头部插槽

`createPactorApplication` SHALL 支持 `headerExtra?: ReactNode`：admin 布局时透传为布局的 headerExtra（头部右侧插槽）。

#### Scenario: 头部插槽渲染

- **WHEN** 传入 headerExtra 且布局为 admin
- **THEN** 头部右侧渲染该内容
