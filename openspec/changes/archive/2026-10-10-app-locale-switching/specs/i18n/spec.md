# Delta Spec: i18n

## MODIFIED Requirements

### Requirement: 运行时切换语言

app 实例 SHALL 提供 `setLocale(locale, messages?)`，无整页刷新地切换当前会话语言：更新会话 i18n 配置（locale 与可选 messages）→ 通知 React 层重建 `I18nContext` → locale 或 messages 任一变化时触发页面运行时重建（页面 key 含 i18n 版本），表达式 `t()` 按新语言求值；布局与菜单 MUST NOT 重建。语言偏好 SHALL 由框架默认持久化（localStorage，key `pactor.locale`），options 可经 `localeStorage` 关闭或替换存储实现。bootstrap 完成前调用 MUST 暂存并在会话就绪后应用，MUST NOT 丢弃。

#### Scenario: 无刷新切换语言

- **WHEN** bootstrap 完成后调用 `app.setLocale('en-US')`
- **THEN** 不触发整页刷新；布局与菜单保留，内置组件默认文案切换为英文，页面表达式 `t()` 按新语言求值

#### Scenario: 切换后刷新恢复语言

- **WHEN** `setLocale('en-US')` 后重新加载页面，且 options 未传 locale、bootstrap 未下发 locale
- **THEN** 应用以 `en-US` 启动（持久化值生效）

#### Scenario: 显式配置优先于持久化

- **WHEN** options 传入 `locale: 'zh-CN'` 且持久化值为 `'en-US'`
- **THEN** 应用以 `zh-CN` 启动

#### Scenario: bootstrap 前调用暂存

- **WHEN** bootstrap 完成前调用 `setLocale('fr-FR')`
- **THEN** 会话就绪后应用以 `fr-FR` 生效，调用不被丢弃

#### Scenario: 同语言补充 messages

- **WHEN** `setLocale('fr-FR')` 后异步拉取完成，再调 `setLocale('fr-FR', { 'menu.home': 'Accueil' })`
- **THEN** 页面运行时重建，表达式按补充后的 messages 求值

#### Scenario: 跨语言切换后业务 messages 未补充

- **WHEN** 当前 messages 为中文文案，调用 `setLocale('en-US')` 且未传 messages
- **THEN** 内置组件默认文案立即切换为英文；业务 messages 保留旧语言词条（`messages ?? session.messages` 语义），经回退链继续展示中文，不白屏、不显示原始 key；异步补充英文 messages 后按新文案求值

#### Scenario: 关闭框架持久化

- **WHEN** options 传 `localeStorage: false` 后调用 `setLocale('en-US')`
- **THEN** 语言切换生效但不写入 localStorage，持久化由调用方负责

#### Scenario: 持久化不可用降级

- **WHEN** localStorage 被禁用或不可写时调用 `setLocale('en-US')`
- **THEN** 语言切换正常生效，无异常抛出（仅无持久化）
