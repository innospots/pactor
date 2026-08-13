## ADDED Requirements

### Requirement: 应用级 i18n 配置
系统 SHALL 支持通过 `createPactorApplication(options)` 或 bootstrap 配置国际化资源。配置项包括 `locale`（当前语言）、`defaultLocale`（回退语言）、`messages`（键值翻译表）。未配置时系统 MUST 按现状工作，不强制要求 i18n。

#### Scenario: 静态配置 i18n
- **WHEN** 调用 `createPactorApplication({ appId: 'my-app', locale: 'en-US', messages: { 'menu.home': 'Home' } })`
- **THEN** 应用以 `en-US` 渲染，表达式 `${t('menu.home')}` 解析为 `'Home'`

#### Scenario: bootstrap 下发 i18n
- **WHEN** bootstrap 返回 `{ locale: 'zh-CN', messages: { 'menu.home': '首页' } }`
- **THEN** 应用使用该 locale 与 messages 渲染

### Requirement: 运行时 i18n 上下文
RuntimeContext SHALL 暴露 `locale` 与 `i18n` 对象，供表达式与组件读取。`i18n` MUST 提供 `t(key, params?)` 翻译函数。

#### Scenario: 组件读取 locale
- **WHEN** 页面组件通过 RuntimeContext 读取 `locale`
- **THEN** 返回当前生效的语言代码（如 `'zh-CN'`）

#### Scenario: 表达式使用 t() 翻译
- **WHEN** DSL 中写 `title: "${t('customer.title')}"` 且 messages 含 `customer.title`
- **THEN** 渲染时解析为对应语言的文案

### Requirement: 翻译回退与参数插值
翻译函数 SHALL 支持参数插值与回退。回退顺序 MUST 为：当前 locale → defaultLocale → key 本身。参数插值使用 `{{name}}` 占位符。

#### Scenario: 参数插值
- **WHEN** messages 为 `{ 'welcome': 'Hello, {{name}}!' }`，表达式为 `${t('welcome', { name: 'Alice' })}`
- **THEN** 返回 `'Hello, Alice!'`

#### Scenario: 回退到 defaultLocale
- **WHEN** 当前 locale 为 `fr-FR` 但 messages 只有 `zh-CN` 与 `en-US`，defaultLocale 为 `zh-CN`
- **THEN** `t('menu.home')` 返回 `zh-CN` 下的对应值

#### Scenario: 缺失 key 回退为 key
- **WHEN** 请求不存在的 key `missing.key`
- **THEN** 返回字符串 `'missing.key'`

### Requirement: 布局与菜单文案国际化
应用外壳（AdminLayout、Login、Blank 等）与菜单标题 SHALL 支持通过 i18n 渲染。菜单标题与布局固定文案 MUST 优先使用 messages 中的翻译，未提供时回退到原始字符串。

#### Scenario: 菜单标题使用 t()
- **WHEN** bootstrap menus 中某项 title 为 `${t('menu.customers')}`，messages 含 `menu.customers`
- **THEN** 侧边栏渲染对应语言的菜单标题

#### Scenario: 布局固定文案可覆盖
- **WHEN** messages 提供 `pactor.layout.logout` 为 `'Sign out'`
- **THEN** AdminLayout 的「退出登录」按钮显示为 `'Sign out'`

### Requirement: 内置组件默认文案国际化
内置组件（Table、Form、Empty 等）的默认提示文案 SHALL 使用 i18n key 并允许业务覆盖。内置 key 的命名空间 MUST 以 `pactor.` 开头并保持稳定。

#### Scenario: 覆盖 Table 空状态文案
- **WHEN** messages 提供 `pactor.table.empty` 为 `'No data'`
- **THEN** Table 组件在无数据时显示 `'No data'`

#### Scenario: 覆盖 Form 必填提示
- **WHEN** messages 提供 `pactor.form.required` 为 `'This field is required'`
- **THEN** 表单校验失败时显示该文案
