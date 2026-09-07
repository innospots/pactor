# Spec: i18n

## Purpose

应用级国际化（i18n）：`createPactorApplication` / bootstrap 的 locale 与 messages 配置，RuntimeContext 的 i18n 上下文，表达式 `t()` 翻译函数，以及内置组件/布局默认文案的覆盖机制。


## Requirements

### Requirement: 应用级 i18n 配置

系统 SHALL 支持通过 `createPactorApplication(options)` 或 bootstrap 配置国际化资源。配置项包括 `locale`（当前语言）、`defaultLocale`（回退语言）、`messages`（键值翻译表）。未配置时系统 MUST 按现状工作，不强制要求 i18n。

#### Scenario: 静态配置 i18n

- **WHEN** 调用 `createPactorApplication({ appId: 'my-app', locale: 'en-US', messages: { 'menu.home': 'Home' } })`
- **THEN** 应用以 `en-US` 渲染，表达式 `${t('menu.home')}` 解析为 `'Home'`

#### Scenario: bootstrap 下发 i18n

- **WHEN** bootstrap 返回 `{ locale: 'zh-CN', messages: { 'menu.home': '首页' } }`
- **THEN** 应用使用该 locale 与 messages 渲染

### Requirement: 运行时 i18n 上下文

RuntimeContext SHALL 暴露 `locale` 与 `i18n` 对象，供表达式与组件读取。`i18n` MUST 提供 `t(key, params?)` 翻译函数。React 组件 MUST 可经 `I18nContextProvider` / `useI18n()` 消费同一上下文；无 Provider 时 `useI18n()` 回退到内置默认中文文案上下文。

#### Scenario: 组件读取 locale

- **WHEN** 页面组件通过 RuntimeContext 读取 `locale`
- **THEN** 返回当前生效的语言代码（如 `'zh-CN'`）

#### Scenario: 表达式使用 t() 翻译

- **WHEN** DSL 中写 `title: "${t('customer.title')}"` 且 messages 含 `customer.title`
- **THEN** 渲染时解析为对应语言的文案

### Requirement: 翻译回退与参数插值

翻译函数 SHALL 支持参数插值与回退。回退顺序 MUST 为：当前 locale → defaultLocale → key 本身。参数插值使用 `{{name}}` 占位符。messages MUST 支持扁平（`{ 'menu.home': '首页' }`）与按语言（`{ 'zh-CN': {...} }`）两种结构。

#### Scenario: 参数插值

- **WHEN** messages 为 `{ 'welcome': 'Hello, {{name}}!' }`，表达式为 `${t('welcome', { name: 'Alice' })}`
- **THEN** 返回 `'Hello, Alice!'`

#### Scenario: 回退到 defaultLocale

- **WHEN** 当前 locale 为 `fr-FR` 但 messages 只有 `zh-CN` 与 `en-US`，defaultLocale 为 `zh-CN`
- **THEN** `t('menu.home')` 返回 `zh-CN` 下的对应值

#### Scenario: 缺失 key 回退为 key

- **WHEN** 请求不存在的 key `missing.key`
- **THEN** 返回字符串 `'missing.key'`

### Requirement: 运行时切换语言

app 实例 SHALL 提供 `setLocale(locale, messages?)`，更新当前会话的语言与（可选）追加 messages。V1 采用整页刷新策略：`setLocale` 调用后触发 `window.location.reload()`，语言偏好由调用方负责持久化（bootstrap 完成前调用 MUST 忽略并告警）。

#### Scenario: 切换语言并刷新

- **WHEN** bootstrap 完成后调用 `app.setLocale('en-US')`
- **THEN** session locale 更新为 `'en-US'`，页面整页刷新后按新语言渲染

### Requirement: 布局与菜单文案国际化

应用外壳布局（AdminLayout 等）的固定文案（侧边栏展开/收起、页签关闭、面包屑等 aria-label）SHALL 使用 `pactor.layout.*` i18n key 渲染，允许 messages 覆盖。菜单标题 MUST NOT 做表达式求值：布局按字符串直渲染 menu.title，多语言菜单 MUST 由服务端按用户语言下发，或由 bootstrap 工厂按当前语言生成。

#### Scenario: 布局固定文案可覆盖

- **WHEN** messages 提供 `pactor.layout.collapseSidebar` 为 `'Collapse sidebar'`
- **THEN** AdminLayout 侧边栏收起按钮的 aria-label 显示为 `'Collapse sidebar'`

#### Scenario: 菜单标题按语言下发

- **WHEN** bootstrap menus 中某项 title 为服务端/工厂按当前语言生成的字符串
- **THEN** 侧边栏直渲染该字符串作为菜单标题

### Requirement: 内置组件默认文案国际化

内置组件（Table、Form、Select 等）的默认提示文案 SHALL 使用 i18n key 并允许业务覆盖。内置 key 的命名空间 MUST 以 `pactor.` 开头并保持稳定；未覆盖时回退到内置默认中文文案。

#### Scenario: 覆盖 Table 空状态文案

- **WHEN** messages 提供 `pactor.table.empty` 为 `'No data'`
- **THEN** Table 组件在无数据时显示 `'No data'`

#### Scenario: 覆盖 Form 必填提示

- **WHEN** messages 提供 `pactor.form.required` 为 `'This field is required'`
- **THEN** 表单校验失败时显示该文案
