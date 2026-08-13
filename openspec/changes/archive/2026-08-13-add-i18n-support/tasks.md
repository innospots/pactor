## 1. 定义 i18n 基础类型

- [x] 1.1 在 `pactor-core` 中定义 `I18nMessages`、`I18nContext`、`Locale` 等基础类型。
- [x] 1.2 在 `pactor-schema` 中为 bootstrap / options 增加 i18n 相关 schema 字段（可选，BootstrapResource 已支持扩展字段）。

## 2. 表达式引擎支持 t()

- [x] 2.1 在 `pactor-expression` 的白名单 Function Registry 中注册 `t(key)` / `t(key, params)`（经 RuntimeContext scope 注入）。
- [x] 2.2 实现参数插值（`{{name}}`）与回退逻辑（当前 locale → defaultLocale → key）。
- [x] 2.3 为 `t()` 添加单元测试，覆盖基础翻译、插值、回退、缺失 key。

## 3. RuntimeContext 注入 locale 与 i18n

- [x] 3.1 扩展 `pactor-runtime` 的 `createRuntimeContext`，支持注入 `locale` 与 `messages`。
- [x] 3.2 在 RuntimeContext 中暴露 `locale` 字段与 `i18n` 对象（含 `t` 函数）。
- [x] 3.3 确保表达式作用域中包含 `t`，使 DSL 可使用 `${t('key')}`。
- [x] 3.4 为 RuntimeContext i18n 扩展添加测试。

## 4. pactor-app 启动编排集成 i18n

- [x] 4.1 在 `createPactorApplication` options 中支持 `locale`、`defaultLocale`、`messages`。
- [x] 4.2 在 bootstrap 解析中读取 `locale` 与 `messages`，优先级为 options > bootstrap > navigator.language > 'zh-CN'。
- [x] 4.3 将解析后的 locale/messages 注入应用级 RuntimeContext 与页面运行时。
- [x] 4.4 提供 `app.setLocale(locale, messages?)` API，支持运行时切换语言并触发重建。
- [x] 4.5 为应用启动编排添加 i18n 相关测试。

## 5. UI kit 与布局文案国际化

- [x] 5.1 在 `pactor-ui-radix` 布局（AdminLayout、Login、Blank 等）中将硬编码文案改为 `i18n.t()`。
- [x] 5.2 在 `pactor-ui-antd` 布局中做同样替换（antd 组件自身已处理文案，无需额外修改）。
- [x] 5.3 定义内置文案的稳定 key 命名空间（如 `pactor.layout.logout`、`pactor.table.empty`、`pactor.form.required`）。
- [x] 5.4 在内置组件（Table、Form、Empty 等）中使用 i18n key 并允许 messages 覆盖。
- [x] 5.5 为 UI kit 布局与组件添加 i18n 测试。

## 6. 示例与文档

- [x] 6.1 在 `examples/admin` 或 `examples/admin-antd` 中增加 locale 切换入口与多语言 messages 示例。
- [x] 6.2 新增 `docs/src/content/docs/guides/i18n.md`，说明配置方式、DSL 用法、内置 key 列表。
- [x] 6.3 在 `docs/src/content/docs/reference/dsl.md` 中补充 `${t('...')}` 表达式说明。
- [x] 6.4 更新 `README.md` 或相关包文档提及 i18n 支持。

## 7. 验证与收尾

- [x] 7.1 运行 `pnpm build`、`pnpm typecheck`、`pnpm test` 确保无回归。
- [x] 7.2 确认未配置 i18n 时行为与现状一致（向后兼容）。
- [x] 7.3 检查 DSL 校验器（`pactor-cli validate`）对 `${t('...')}` 表达式的支持。
