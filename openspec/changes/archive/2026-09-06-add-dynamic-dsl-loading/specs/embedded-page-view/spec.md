# Delta: embedded-page-view

## MODIFIED Requirements

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
