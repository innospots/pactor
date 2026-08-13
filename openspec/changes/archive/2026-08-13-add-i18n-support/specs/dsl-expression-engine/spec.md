## ADDED Requirements

### Requirement: i18n 翻译函数

表达式引擎 SHALL 在 Function Registry 中提供 `t(key)` 与 `t(key, params)` 白名单函数，用于根据当前 locale 翻译文案。`t()` MUST 支持参数插值（`{{name}}`）与回退（当前 locale → defaultLocale → key 本身）。

#### Scenario: 基础翻译

- **WHEN** 作用域提供 `t` 函数，messages 含 `menu.home`，求值 `t('menu.home')`
- **THEN** 返回当前 locale 下 `menu.home` 的翻译值

#### Scenario: 参数插值

- **WHEN** messages 为 `{ 'welcome': 'Hello, {{name}}!' }`，求值 `t('welcome', { name: 'Alice' })`
- **THEN** 返回 `'Hello, Alice!'`

#### Scenario: 缺失 key 回退

- **WHEN** 求值 `t('missing.key')` 且 messages 中不存在该 key
- **THEN** 返回字符串 `'missing.key'`
