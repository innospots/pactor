# Spec: application-bootstrap

## Purpose

createPactorApplication 启动编排与扩展 API（`@pactor-app/app`，设计文档第 86–88 节）。
## Requirements
### Requirement: 启动编排

`createPactorApplication(options)` SHALL 在 mount 时依次完成：加载 bootstrap（loader 注入或按 api.baseURL 创建 HttpDslResourceLoader，默认 `/api/runtime`）→ PermissionStore 写入 permissions → MenuRegistry(menus) → 解析布局（options.layout > bootstrap.layout.type > 'admin'）→ 解析 i18n 配置（options.locale/messages/defaultLocale > 持久化值（缺省 localStorage['pactor.locale']，可经 options.localeStorage 关闭/替换）> bootstrap.locale/messages > 浏览器语言 > 'zh-CN'）→ 组装共享 registries 与 adapters。bootstrap 加载失败 MUST 渲染受控启动错误页（含重试），不白屏。menus/permissions 缺省 MUST 按 `[]` 处理。

#### Scenario: 完整启动

- **WHEN** StaticDslLoader 提供含 app/user/permissions/menus 的 bootstrap 与一个页面，mount
- **THEN** 渲染布局外壳、菜单与该页面内容

#### Scenario: bootstrap 失败

- **WHEN** loadBootstrap reject
- **THEN** 渲染启动错误页，点击重试重新加载

#### Scenario: 缺省字段

- **WHEN** bootstrap 无 permissions/menus 字段
- **THEN** 正常启动，菜单为空

#### Scenario: 静态 i18n 配置

- **WHEN** options 传入 `locale: 'en-US'` 与 `messages: { 'menu.home': 'Home' }`
- **THEN** 应用以 `en-US` 渲染，菜单与页面表达式使用英文翻译

#### Scenario: bootstrap 下发 i18n

- **WHEN** bootstrap 返回 `locale: 'zh-CN'` 与 `messages: { 'menu.home': '首页' }`
- **THEN** 应用以 `zh-CN` 渲染，菜单与页面表达式使用中文翻译

#### Scenario: 持久化语言生效

- **WHEN** localStorage 存在 `pactor.locale = 'en-US'`，options 与 bootstrap 均未配置 locale
- **THEN** 应用以 `en-US` 渲染，优先级高于浏览器语言

#### Scenario: options 覆盖持久化语言

- **WHEN** localStorage 存在 `pactor.locale = 'en-US'` 且 options 传入 `locale: 'zh-CN'`
- **THEN** 应用以 `zh-CN` 渲染

#### Scenario: 显式 options.locale 下用户切换不跨重启存活

- **WHEN** options 传入 `locale: 'zh-CN'`，用户经 `setLocale('en-US')` 切换后重新加载页面
- **THEN** 应用仍以 `zh-CN` 启动（显式 options 优先级高于持久化值）；需要用户偏好优先的接入方 MUST NOT 传 `options.locale`

#### Scenario: 自定义存储适配器

- **WHEN** options 传入 `localeStorage` 自定义实现（如基于 cookie）
- **THEN** 启动时经该适配器读取持久化语言，`setLocale` 经该适配器写入

### Requirement: 共享注册表与页面运行时工厂

应用级 components/actions/services/capabilities registries MUST 被所有页面 PageRuntime 共享：内置组件与交互动作默认注册，options 提供的扩展注册生效。页面运行时创建时 MUST 注入 permission/router/http adapters 与 route context（params/query）、user、app。

#### Scenario: 业务组件跨页面可用

- **WHEN** options.components 注册 'RiskScore'，两个不同页面 DSL 均引用
- **THEN** 两个页面都能渲染该组件

#### Scenario: route context 注入

- **WHEN** 导航到 `/customers/123?tab=risk`，页面表达式引用 `${route.params.id}` 与 `${route.query.tab}`
- **THEN** 分别求值为 '123' 与 'risk'

#### Scenario: 页面权限生效

- **WHEN** bootstrap permissions 不含页面要求的权限码
- **THEN** 该页面 DSL 中配置该权限的组件按 denied 策略处理

### Requirement: 扩展注册 API

app 实例 SHALL 提供 `registerComponent` / `registerAction` / `registerService` / `registerCapability`，写入应用级共享 registry。

#### Scenario: 运行期注册动作

- **WHEN** mount 后调用 registerAction('my.action', handler)，页面执行该动作
- **THEN** handler 被调用

### Requirement: mount / unmount

`mount(selector)` SHALL 以 createRoot 渲染到匹配元素；`unmount()` MUST 卸载根。重复 mount MUST 先 unmount。

#### Scenario: 挂载与卸载

- **WHEN** mount('#root') 后 unmount()
- **THEN** 容器内先有内容，卸载后清空

### Requirement: 两种使用形态共享组装内核

`@pactor-app/app` SHALL 提供两种使用形态：整应用模式（`createPactorApplication`，菜单驱动路由 + 外壳布局）与嵌入模式（`createPactorPage` / `PactorPage`，无路由、无外壳）。两种形态 MUST 共享同一套组装内核（registries / 交互层 / i18n），同一份页面 DSL 在两种模式下渲染结果一致。

#### Scenario: 同一份 DSL 两种模式渲染一致

- **WHEN** 同一 PageDsl 分别经整应用模式（路由命中）与嵌入模式（PactorPage）渲染
- **THEN** 两种模式下页面内容与交互行为一致

