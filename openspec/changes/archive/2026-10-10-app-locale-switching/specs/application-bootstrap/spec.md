# Delta Spec: application-bootstrap

## MODIFIED Requirements

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
