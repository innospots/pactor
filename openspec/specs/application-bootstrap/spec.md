# Spec: application-bootstrap

createPactorApplication 启动编排与扩展 API（`pactor-app`，设计文档第 86–88 节）。

### Requirement: 启动编排

`createPactorApplication(options)` SHALL 在 mount 时依次完成：加载 bootstrap（loader 注入或按 api.baseURL 创建 HttpDslResourceLoader，默认 `/api/runtime`）→ PermissionStore 写入 permissions → MenuRegistry(menus) → 解析布局（options.layout > bootstrap.layout.type > 'admin'）→ 解析 i18n 配置（options.locale/messages/defaultLocale > bootstrap.locale/messages > 浏览器语言 > 'zh-CN'）→ 组装共享 registries 与 adapters。bootstrap 加载失败 MUST 渲染受控启动错误页（含重试），不白屏。menus/permissions 缺省 MUST 按 `[]` 处理。

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
