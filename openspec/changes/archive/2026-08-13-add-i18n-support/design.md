## Context

Pactor 是一个 Server-Driven UI 框架，页面通过 YAML/JSON DSL 下发，由浏览器 Runtime 渲染。当前所有文案（组件 props、菜单标题、布局外壳文本）均以硬编码字符串存在。企业级应用需要面向多语言用户，因此需要在不破坏 DSL 协议与 React 组件契约的前提下，引入统一的国际化机制。

现状：

- `pactor-core` / `pactor-schema` 无 i18n 类型
- `pactor-expression` 表达式引擎仅支持白名单函数（如 `permission`），无 `t()`
- `pactor-runtime` RuntimeContext 不含 locale/i18n
- `pactor-app` 启动编排未注入 locale/messages
- UI kit（Radix/antd）与布局外壳文案硬编码

## Goals / Non-Goals

**Goals:**

- 在 RuntimeContext 中提供 `locale` 与 `i18n`，供表达式与组件读取
- 在表达式引擎中提供 `t(key)` / `t(key, params)` 白名单函数，支持参数插值与回退
- 支持应用级与页面级文案翻译：菜单、布局、内置组件默认文案均可覆盖
- 支持 bootstrap 下发 `locale` 与 `messages`，或 `createPactorApplication` 静态配置
- 保持向后兼容：未配置 i18n 时行为与现状一致

**Non-Goals:**

- 不引入第三方 i18n 库（如 i18next、react-intl）；实现轻量键值翻译
- 不做 RTL（从右到左）布局支持
- 不做自动翻译或 AI 翻译
- 不覆盖所有第三方组件（antd 自带 locale 由 antd ConfigProvider 管理，pactor 只负责自身文案）

## Decisions

- **翻译模型：扁平键值 + 命名空间**
  使用 `Record<string, string>` 作为 messages，支持点路径嵌套（如 `menu.home`）。选择轻量模型而非复杂 ICU MessageFormat，因为 DSL 场景以简单文案为主，避免增加运行时体积与解析复杂度。

- **表达式函数：`t(key, params?)`**
  在 `pactor-expression` 白名单函数注册表中新增 `t`。参数插值使用 `{{name}}` 占位符（与现有 `${}` 表达式区分），回退顺序：当前 locale → defaultLocale → key 本身。

- **Locale 注入层级**
  `createPactorApplication({ locale, messages, defaultLocale })` 静态配置 > bootstrap `locale` / `messages` > 浏览器 `navigator.language` > `'zh-CN'`。RuntimeContext 中暴露 `locale` 与 `i18n`（含 `t` 函数）。

- **组件文案解析时机**
  Renderer 在 resolveProps 阶段对字符串属性执行表达式求值，`${t('key')}` 在运行时解析。内置组件的默认文案（如 Table 空状态、Form 校验提示）也走 `t()`，允许业务通过 messages 覆盖。

- **布局外壳国际化**
  AdminLayout / Login / Blank 等布局的固定文案（如「退出登录」「首页」）改为通过 `i18n.t()` 渲染。菜单标题从 bootstrap 下发，支持 `${t('menu.xxx')}` 表达式。

- **不处理 antd 组件内部 locale**
  antd 的 DatePicker、Pagination 等组件自带 locale 包，由业务通过 antd `ConfigProvider` 的 `locale` 属性注入。pactor 只负责自身 DSL 与外壳文案。

## Risks / Trade-offs

- **[Risk] 表达式 `t()` 被滥用导致 DSL 臃肿** → Mitigation：在 DSL 参考文档中建议仅对文案使用 `t()`，逻辑仍用 state/data；保持 messages 键值扁平。
- **[Risk] 内置组件文案 key 不稳定导致覆盖失效** → Mitigation：为内置文案定义稳定的 key 命名空间（如 `pactor.table.empty`、`pactor.form.required`），写入文档。
- **[Risk] 运行时 locale 切换需要重建页面** → Mitigation：V1 采用整页刷新或强制重渲染策略；提供 `app.setLocale()` API 触发重建。
- **[Trade-off] 不引入成熟 i18n 库** → 减少依赖与体积，但功能较简单；若未来需要复数、性别、日期格式化，可再评估接入 i18next。

## Migration Plan

1. 在 `pactor-core` 定义 `I18nMessages`、`I18nContext` 类型
2. 在 `pactor-expression` 注册 `t()` 函数
3. 在 `pactor-runtime` 扩展 RuntimeContext，注入 `locale` 与 `i18n`
4. 在 `pactor-app` 解析 options/bootstrap 中的 i18n 配置并注入
5. 在 UI kit 与布局组件中使用 `i18n.t()` 替换硬编码文案
6. 更新示例与文档

回滚：i18n 配置为可选，缺省时行为与现有版本一致；可直接回退代码而不影响现有 DSL。

## Open Questions

- 页面级 messages 是否需要覆盖应用级 messages？（V1 建议支持，优先级：页面 > 应用）
- locale 切换时是否需要持久化到 localStorage？（V1 不提供，由业务自行处理）
