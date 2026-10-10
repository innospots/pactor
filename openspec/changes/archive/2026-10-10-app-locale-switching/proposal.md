# Proposal: 应用侧无刷新切换语言与语言偏好持久化

## Why

当前 `setLocale(locale, messages?)` 采用 V1 整页刷新策略：更新内存 session 后触发 `window.location.reload()`。整页刷新丢失全部客户端状态、白屏闪烁、重跑 bootstrap；且语言偏好持久化完全由调用方负责——刷新后 locale 重新走 `options > bootstrap > 浏览器语言` 解析链，若调用方未自行持久化，切换会静默回退。框架应把语言切换升级为无刷新的响应式切换，并将持久化收进框架（可覆盖）。

## What Changes

- `setLocale(locale, messages?)` 不再整页刷新：更新应用会话状态，React 上下文层与页面运行时层响应式跟随新语言。
- 框架接管语言偏好持久化：默认写入 `localStorage`（默认 key `pactor.locale`，可经工厂参数更换；也可通过 storage 适配器整体关闭或替换为 cookie/服务端同步）。
- 启动时 locale 解析链加入持久化值：`options.locale` > 持久化值 > `bootstrap.locale` > `navigator.language` > `'zh-CN'`。
- 语言切换后页面运行时重建：`DslPageLoader` 的页面 key 加入 locale，切换后所有页面 runtime destroy → 重建，表达式 `${t(...)}` 按新语言求值；布局与菜单不重建。
- bootstrap 完成前调用 `setLocale` 不再丢弃：暂存 pending locale，会话就绪后自动应用。
- 切换语言时可异步补充该语言的 messages（不传或后传均允许），回退链保证过渡期不白屏。

## Capabilities

### Modified Capabilities

- `i18n`: 「运行时切换语言」requirement 从 V1 整页刷新改为响应式无刷新切换 + 框架持久化（含 bootstrap 前 pending、messages 异步补充场景）。
- `application-bootstrap`: locale 解析链加入持久化值（`options` > 持久化 > `bootstrap` > 浏览器语言 > `'zh-CN'`），并明确持久化适配器可被关闭/替换。

## Impact

- `packages/app/src/application.ts`：`setLocale` 实现、session 可订阅化（`useSyncExternalStore`）、locale 解析链、pending locale、storage 适配器。
- `packages/app/src/app-shell.tsx`：AppShell 订阅 session，locale 变化重建 `I18nContext`。
- `packages/app/src/page-loader.tsx`：页面 key 加入 locale。
- `packages/core` / `packages/runtime`：无接口变更，复用现有 `I18nContext` / `RuntimeContext` / `buildScope`。
- 测试：`application` bootstrap 测试、`i18n` 相关测试新增语言切换与持久化场景。
- 无 breaking 变更：`setLocale` 签名不变，行为由整页刷新变为局部重建；持久化从"调用方负责"变为"框架默认 + 可覆盖"，对已自行持久化的调用方兼容（框架持久化与调用方逻辑并存时不冲突）。
