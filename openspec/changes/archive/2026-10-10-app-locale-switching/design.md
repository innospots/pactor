# Design: 应用侧无刷新切换语言与语言偏好持久化

## Context

当前语言切换（`setLocale`）是 V1 整页刷新策略（`application.ts:547`）：更新内存 session 后 `window.location.reload()`。locale 解析链为 `options.locale > bootstrap.locale > navigator.language > 'zh-CN'`（浏览器语言探测已实现），但无任何持久化——刷新后切换静默回退，除非调用方自行持久化（spec 明确"语言偏好由调用方负责持久化"）。

语言消费有两个彼此独立的路径，响应能力不同：

| 消费端 | 数据流 | 能否无刷新响应 |
|---|---|---|
| React 树（内置组件/布局） | AppShell 以 session 建一次 `I18nContext` → Provider → `useI18n` | ✅ context value 变化即全量重渲染 |
| 页面运行时（DSL/表达式） | `createPageRuntime` 把 locale/messages 打进 `RuntimeContext`（创建时快照）；`buildScope` 暴露 `t`/`locale`；renderer 只订阅 state/data 版本（`renderer.tsx:69-76`） | ❌ 快照，必须重建 runtime |

## Goals / Non-Goals

**Goals:**

- `setLocale` 无整页刷新：布局、菜单、路由、会话保留，仅语言相关部分响应。
- 框架默认接管语言偏好持久化（可关闭/可替换），刷新后语言选择存活。
- bootstrap 完成前调用 `setLocale` 不丢弃（暂存并应用）。
- 支持异步补充 messages（先切语言、后补文案），过渡期靠回退链不白屏。

**Non-Goals:**

- 页面运行时状态保留（DataStore 快照、未提交表单在切换时丢失）——不做可变 i18n，见 D3。
- 嵌入模式（`createPactorPage`）不引入持久化：locale 由宿主 props 驱动，重建时机由宿主控制。
- 不监听 `storage` 事件做多标签页实时同步。
- 不内置语言切换 UI（入口属业务），只提供机制与持久化。

## Decisions

### D1: 会话状态可订阅化（`useSyncExternalStore`）

`session` 从 `createPactorApplication` 闭包变量升级为可订阅源：暴露 `app.subscribeSession(listener)` / `app.getSession()`，`setLocale` 更新 session 后通知监听器。AppShell 改用 `useSyncExternalStore` 取 session。

- 备选：把 session 提升为 Application 组件的 React state。**被否**：session 同时服务于非 React 的工厂函数（`createPageRuntime` 等读取 session 字段），单一订阅源比 React state 更稳，且不会把状态提升进渲染层。

### D2: `setLocale` 语义 = 更新会话 + 通知 + 持久化

`setLocale(locale, messages?)` → 展开新 session（仅换 i18n 切片，`menuRegistry`/`brand`/`user` 等引用不变）→ 通知订阅者 → 写入持久化。AppShell 重渲染 → 重建 `I18nContext` value → 所有 `useI18n` 消费者自动跟随新语言；内置 `pactor.*` 文案回退已按 Provider locale 选语言（`i18n-context.ts:114`），此层免费获得。布局组件实例不卸载（同类型 props 更新），菜单因 `menuRegistry` 引用不变而不重建。

### D3: 页面运行时经「i18n 版本」重建（页面 key 加入版本号）

`DslPageLoader` 现有 key 为 `pageId + route`（`page-loader.tsx:26` 注释）。session 增加单调递增的 `i18nVersion`，**locale 或 messages 任一变化都 +1**，页面 key 改为 `pageId + route + i18nVersion`。key 变化 → React 卸载旧页面组件 → cleanup 中 runtime.destroy() → 重建 runtime（`createPageRuntime` 读最新 session 的 locale/messages）→ 表达式 `${t(...)}` 按新语言求值。

- 备选 A：renderer 订阅 locale 版本、i18n 改可变引用全量重求值。**被否**：侵入 runtime 上下文模型，所有闭包捕获 `t` 引用的位置都要改，状态保留收益与成本不匹配；留作未来演进。
- 备选 B：key 只加 locale，messages 不变时不重建。**被否**：同语言异步补充 messages 的场景（先 `setLocale('fr-FR')` 后 `setLocale('fr-FR', messages)`）不生效。
- 取舍：页面状态（DataStore 快照、表单草稿）在切换时丢失。语言切换是低频操作，与 V1 相比丢失范围从"整应用"缩小到"页面区"——布局、菜单、路由、会话全部保留。

### D4: 持久化适配器 `LocaleStorage`，默认 localStorage、可关闭/替换

```ts
interface LocaleStorage {
  get(): string | undefined;
  set(locale: string): void;
}
```

默认实现：`createLocalStorageLocaleStorage(key = 'pactor.locale')` 工厂（key 可换），读写前置判断 `typeof localStorage !== 'undefined'` 并用 try/catch 包裹（SSR/隐私模式/禁用时静默降级为无持久化，行为等同现状）。`options.localeStorage?: LocaleStorage | false`：`false` 关闭框架持久化（回退调用方自管），自定义实现可替换为 cookie/服务端同步。

- 备选：固定 localStorage 不暴露适配器。**被否**：测试环境（jsdom 之外）、SSR、服务端会话 cookie 都是真实需求。

### D5: 启动解析链加入持久化值

`options.locale` > `localeStorage.get()` > `bootstrap.locale` > `navigator.language` > `'zh-CN'`。显式 options 是权威；持久化值（用户上次选择）压过 bootstrap（服务端默认）。`defaultLocale`/`messages` 解析链不变。

### D6: bootstrap 前的 `setLocale` 暂存（pending）

闭包内 `pendingLocale: { locale, messages? } | null`；bootstrap 完成组装 session 时若有 pending，先应用 pending 再持久化，并清空。替代现状的 `console.warn` + 忽略：宿主在 mount 前根据自身状态（如宿主读了 cookie）调 `setLocale` 是合理时序，丢弃会造成启动语言与宿主意图不一致。

### D7: 嵌入模式不动

`PactorPage` 的 locale 来自 options props，宿主改 props 即切换、重建时机由宿主控制（与整应用模式的 `i18nVersion` 机制职责对称）。本变更不引入嵌入模式持久化。

## Risks / Trade-offs

- [语言切换丢页面状态] → 明确取舍，范围已从整应用缩小到页面区；低频操作；未来可变 i18n 演进路径保留。
- [localStorage 不可用（隐私模式/禁用/SSR）] → try/catch 静默降级，无持久化时行为等同现状。
- [持久化值与 bootstrap 冲突（如服务端已切换语言）] → 用户偏好优先（D5），是显式设计而非缺陷。
- [显式 `options.locale` 压过持久化值] → 宿主硬编码 locale 时，用户经 `setLocale` 的切换在重启后不存活（每次启动显式配置重新生效）。属显式优先级语义（D5），接入方需要「用户偏好优先」时不得传 `options.locale`；文档中点明，避免误解为缺陷。
- [`setLocale` 高频调用导致反复重建页面] → 不节流；API 文档标注低频语义。
- [多标签页语言不同步] → Non-goal，不监听 `storage` 事件。
- [session 引用变化引起 AppShell 子树重渲染] → `setLocale` 展开时仅换 i18n 切片，`menuRegistry`/`brand`/`user` 引用不变，菜单与布局 DOM 复用；重渲染仅在 `setLocale` 时发生，属预期。

## Migration Plan

分三步提交，每步独立可测、向后兼容：

1. **持久化层**：`LocaleStorage` 接口 + localStorage 实现 + options 解析链加入持久化值（D4/D5）+ 测试。此步独立生效：即使切换仍走 reload，刷新后语言选择已存活。
2. **响应式会话**：session 可订阅 + `setLocale` 去 reload（D1/D2/D6）+ AppShell 改 `useSyncExternalStore` + pending 暂存 + 测试。此步后 React 层（内置组件/布局）无刷新切换。
3. **页面运行时重建**：`i18nVersion` 进 session 与页面 key（D3）+ 测试。此步后表达式层无刷新切换。

回滚：每步独立回滚；第 3 步回滚后退化为"React 层已切换、页面表达式保持旧语言"的中间态，属可接受的降级（非白屏、非崩溃）。

归档：合并 delta spec 到 `openspec/specs/i18n` 与 `openspec/specs/application-bootstrap`，替换「运行时切换语言」「启动编排」requirement。

## Open Questions

- 是否监听 `storage` 事件做多标签页同步？默认不做，若业务需要再迭代。
- 未来是否内置语言切换 UI（Header 下拉 + `onLocaleChange` 回调）？默认不做，保持机制与入口分离。
