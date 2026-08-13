## MODIFIED Requirements

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
