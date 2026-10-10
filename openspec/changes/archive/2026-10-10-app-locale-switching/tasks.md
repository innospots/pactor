# Tasks: 应用侧无刷新切换语言与语言偏好持久化

## 1. 持久化层（设计 D4/D5）

- [x] 1.1 在 `packages/app/src` 定义并导出 `LocaleStorage` 接口（`get(): string | undefined` / `set(locale: string): void`），实现默认 `createLocalStorageLocaleStorage(key = 'pactor.locale')` 工厂（key 可换；读写前置 `typeof localStorage !== 'undefined'` 判断 + try/catch 包裹，SSR/隐私模式/禁用时静默降级）
- [x] 1.2 `CreatePactorApplicationOptions` 增加 `localeStorage?: LocaleStorage | false` 选项
- [x] 1.3 启动解析链加入持久化值：`options.locale > localeStorage.get() > bootstrap.locale > navigator.language > 'zh-CN'`（`application.ts` loadSession 内）
- [x] 1.4 测试（`packages/app/tests`）：options 覆盖持久化值；持久化值覆盖 bootstrap 与浏览器语言；无存储/存储不可用时回退现状行为；自定义适配器读写被调用

## 2. 响应式会话与无刷新切换（设计 D1/D2/D6）

- [x] 2.1 handle 暴露 `subscribeSession(listener)` / `getSession()`；session 变化时通知所有监听器
- [x] 2.2 重构 `setLocale`：展开新 session（仅换 locale/messages 切片，其余字段引用不变）→ 通知订阅者 → 经 `localeStorage` 写入；移除 `window.location.reload()`
- [x] 2.3 pending locale：bootstrap 完成前调用 `setLocale` 暂存（`pendingLocale`），会话组装时应用 pending 并持久化，替代现有 warn+忽略
- [x] 2.4 `AppShell`（`packages/app/src/app-shell.tsx`）改用 `useSyncExternalStore` 订阅 session，替换一次性 setState 的 loadSession 状态机中 i18n 相关部分
- [x] 2.5 测试：`setLocale` 不触发整页刷新（mock `window.location.reload` 断言未调用）；切换后内置组件默认文案随语言变化；bootstrap 前调用暂存并于就绪后生效；`localeStorage: false` 时不写存储；切换后刷新（持久化生效）从 `'en-US'` 启动

## 3. 页面运行时重建（设计 D3）

- [x] 3.1 session 增加 `i18nVersion`（初始 0，`setLocale` 时 locale 或 messages 任一变化则 +1）
- [x] 3.2 `DslPageLoader`（`packages/app/src/page-loader.tsx`）页面 key 加入 `i18nVersion`，key 变化触发旧 runtime destroy → 重建（复用现有 key 重建机制）
- [x] 3.3 测试：切换语言后页面 DSL 表达式 `${t(...)}` 按新语言求值；同语言补充 messages 后表达式按补充后的文案求值；切换后布局与菜单保留（组件实例未卸载）

## 4. 验证与文档

- [x] 4.1 更新 `setLocale` 与相关选项的 JSDoc：低频语义、页面状态丢失取舍、持久化适配器说明
- [x] 4.2 运行 `packages/app` 全量测试与类型检查（含新增用例），确认无回归
- [x] 4.3 运行 `openspec validate app-locale-switching`（或等价校验命令）确认 delta spec 合法
