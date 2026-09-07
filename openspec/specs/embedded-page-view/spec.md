# Spec: embedded-page-view

## Purpose

嵌入式页面视图（`@pactor-app/app`）：在存量 React 项目中以组件形式嵌入 DSL 页面，不接管路由。


## Requirements

### Requirement: PactorPage 组件

模块 SHALL 导出 `PactorPage` 组件：prop `pageId`（经 loader 加载）、`page`（`PageDsl` 对象或 `DslSourceRef` 动态引用——经 service/http 通道远端加载 PageDsl）二选一；`route` prop（`{ params?, query? }`）注入路由作用域。组件 MUST NOT 创建或依赖任何路由库；加载中渲染加载态，加载失败渲染带重试的错误页（`page` 为引用形态时加载失败同样走该错误态与 `onError` 回调，重试重新请求）。远端加载的 PageDsl MUST 经 `validatePageDsl` 校验后才创建运行时，校验失败按加载失败处理。

#### Scenario: 按 pageId 加载渲染

- **WHEN** 宿主渲染 `<PactorPage pageId="detail" route={{ params: { id: '1' } }} />`，loader 能解析该页
- **THEN** 页面 DSL 正常渲染，DSL 内 `${route.params.id}` 为 `'1'`

#### Scenario: 直接传 PageDsl

- **WHEN** 宿主渲染 `<PactorPage page={pageDsl} />`
- **THEN** 不经 loader 直接渲染该页面

#### Scenario: page 为动态引用

- **WHEN** 宿主渲染 `<PactorPage page={{ source: { type: 'service', service: 'dsl.page' } }} />`
- **THEN** 先经 service 加载 PageDsl，校验通过后创建运行时渲染

#### Scenario: 加载失败可重试

- **WHEN** loader 加载 pageId 失败
- **THEN** 渲染错误页且点击重试后重新加载

#### Scenario: 动态引用加载失败

- **WHEN** `page` 引用的 http 请求失败
- **THEN** 渲染错误页、触发 `onError`，点击重试后重新请求

### Requirement: createPactorPage 工厂

模块 SHALL 导出 `createPactorPage(options)` 工厂，返回 PactorPage 组件。options 支持：`loader`、`services`、`actions`、`components`、`capabilities`、`ui`（UI kit 预设）、`permissions` / `permission` 适配、`locale` / `messages`。工厂 MUST NOT 要求宿主注入路由对象。返回的组件 MUST 组装与整应用一致的 registries / 交互层 / i18n。

#### Scenario: 不注入路由对象即可使用

- **WHEN** 宿主仅以 `createPactorPage({ loader, services })` 创建组件并渲染
- **THEN** 页面正常渲染，框架不访问任何路由库

#### Scenario: 交互层可用

- **WHEN** 嵌入页 DSL 触发 `confirm` / `message` / `overlay.open` 动作
- **THEN** 交互行为与整应用模式一致（经工厂组装的 interaction kit 渲染）

### Requirement: 嵌入模式的自然跳转

嵌入模式下 DSL 的跳转 MUST 为自然导航，不依赖宿主路由实现：`Link` 组件渲染原生 `<a href>`（支持 `target`）；`navigate` 动作缺省以 `location.assign(to)` 整页跳转。

#### Scenario: Link 渲染原生锚点

- **WHEN** DSL 声明 `{ type: 'Link', props: { text: '详情', href: '/items/1' } }`
- **THEN** 渲染 `<a href="/items/1">详情</a>`，点击由浏览器自然跳转

#### Scenario: navigate 动作整页跳转

- **WHEN** 嵌入页 DSL 触发 `navigate` 动作且未注入任何路由适配
- **THEN** 以 `location.assign` 跳转目标路径

### Requirement: 多实例隔离

同一宿主页面渲染多个 PactorPage 实例时，各实例的 state / dataSources / 交互层 MUST 相互隔离。

#### Scenario: 双实例状态隔离

- **WHEN** 页面同时渲染两个不同 pageId 的 PactorPage，其中一个经 setState 更新状态
- **THEN** 另一实例的渲染与状态不受影响
