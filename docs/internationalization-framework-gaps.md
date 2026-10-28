# Pactor 国际化框架端能力缺口分析

> 历史审计快照：本文记录当时的框架缺口，包含旧路径 bindings 方案和旧实现状态。最新目标以 `internationalization-design.md` 为准：方式三改为字段内 `$i18n{key:default}`；简写尚未实现，旧 bindings 在兼容期仍可使用。

日期：2026-10-22

状态：分析文档；本次仅盘点现状与缺口，不包含代码变更。

对照基线：[`docs/internationalization-design.md`](./internationalization-design.md)

检查范围：`packages/*` 框架包。Next.js / starter / create-app 模板 / examples 属于应用端实现，仅作现状参考，其改造不计入框架缺口（见附录 A）。

检查版本：分支 `develop_20261019`，各 `@pactor-app/*` 包 `1.54.4`。

边界说明：设计文档中标注 Next.js 的章节（5.3 请求解析、6.0.2 本地目录、6.0.4 语言包接口、10 接入位置）描述的是**应用端**实现；框架端只承载与宿主无关的纯逻辑、类型与运行时能力。

## 1. 结论摘要

1. 当前框架的国际化能力集中在**浏览器端词条表与应用内切换**：`createI18nContext`、RuntimeContext 的 `locale` / `t`、`setLocale`、内置组件中英文案。这些能力可以支撑设计文档中的“旧版客户端 `t` 兼容模式”，但不能承担设计主方案的服务端 DSL 本地化。
2. 设计文档第 4、6、8、9 节所需的**作者态声明、服务端转换器、语言包 Provider、locale 解析器、资源 envelope 扩展、locale 传播与缓存隔离**，在框架内目前没有任何实现。在 `packages/*` 内检索 `$i18n`、`$localizedText`、`resolveRequestLocale`、`supportedLocales`、`representation`、`bundleVersions` 均无命中（不含本文与设计文档）；应用端 starter / examples 同样没有这些实现，但它们不属于框架交付范围。
3. 设计文档第 2 节的“仓库现状”表基本准确，但没有覆盖后来落地的内置组件/布局默认文案国际化（`615573a feat(i18n)` 及其后续）。这些能力属于客户端兼容层，不能替代服务端转换主链路。
4. 框架端缺口共 **44 项**，按落地优先级分为：
   - **P0 阻塞主链路：24 项**——不补齐则“服务端返回已本地化 DSL JSON”无法成立；
   - **P1 正确性与一致性：16 项**——主链路可跑，但会出现旧语言缓存、切换失败、语言来源不一致等问题；
   - **P2 完善与治理：4 项**——对应设计文档第二、三阶段，可延后但接口必须预留。

   另有 4 项（G19、G20、G45、G46）属于应用端 Next.js / starter / 模板职责，列于附录 A，不计入框架缺口。

### 1.1 检索证据

```text
$ grep -rn '\$i18n' packages --include='*.ts' --include='*.tsx' --include='*.yaml'
（无命中）

$ grep -rn 'localizedText' packages
（无命中）

$ grep -rni 'resolveRequestLocale|accept-language|supportedLocales|defaultStrategy' packages
（无命中）

$ grep -rn 'representation|bundleVersions|MessageProvider|DslLocalizer|localizePageDsl' packages
（无命中）
```

这说明设计文档中的新增 DSL 字段、服务端接口和解析器目前都只存在于文档，尚未进入框架代码。应用端 starter / examples 也尚未实现，但它们属于应用端交付，不改变框架缺口统计。

## 2. 已有能力盘点

以下能力已经存在，后续缺口分析不应重复计入；其中标注“部分”的，只覆盖客户端或只覆盖单点场景。

| 能力 | 位置 | 现状 |
| --- | --- | --- |
| 扁平 / 按语言分组的 messages、`{{name}}` 插值、当前 locale → defaultLocale → key 回退 | `packages/core/src/i18n.ts` | 已完成；缺显式命中结果、语言级回退、消息格式抽象 |
| RuntimeContext 暴露 `locale` 与 `i18n.t` | `packages/runtime/src/context/context.ts` | 已完成 |
| 表达式作用域提供 `locale` 与 `t`，支持 `${t('key', params)}` | `packages/runtime/src/context/scope.ts` | 已完成，属于设计中的兼容入口 |
| React `useI18n` / `I18nContextProvider`，内置 `pactor.*` 中英两套文案 | `packages/runtime/src/context/i18n-context.ts`、`context/locales/*` | 已完成；`useI18n` 的命中判断方式有缺陷（见 G12） |
| 整应用 locale 解析链（options > localStorage > bootstrap > 浏览器语言）、`setLocale`、`i18nVersion` 页面重建、`LocaleStorage` 适配器 | `packages/app/src/application.ts` | 部分完成；仅客户端词条切换，不重新获取服务端资源 |
| `SitemapApp` 的 `locale` / `defaultLocale` / `messages` props 与页面工厂重建 | `packages/app/src/sitemap/SitemapApp.tsx` | 部分完成；sitemap 与页面资源不会随语言重新请求 |
| 内置组件默认文案使用 `pactor.*` key；DatePicker 按 locale 映射 date-fns | `packages/ui/src/**` | 已完成 |
| `UserMenu` / `Header` 的语言选择 UI | `packages/ui/src/ui/user-menu/*`、`components/Header/*` | 部分完成；只发事件或直接写 localStorage，未桥接应用级 `setLocale` 与服务端偏好 |
| 页面 YAML 加载、会话裁剪、sitemap / lazy page 下发（应用端参考） | `starters/next-app-starter/src/server/sitemap.ts` | 已完成页面加载；完全没有 locale / 语言包概念 |
| DSL Schema、运行时校验、资源 envelope | `packages/schema`、`packages/resource` | 只有现有 DSL 协议，没有 i18n 扩展字段 |

> 表中 `starters/*` 一行属于应用端参考实现，列出仅为说明现状；框架包本身不包含任何 Next.js 能力，后续也不应新增 Next.js 适配代码。

## 3. 缺口清单

优先级定义：

- **P0**：设计主链路无法成立，必须先做。
- **P1**：主链路可运行，但一致性、正确性或切换体验不达标。
- **P2**：治理与增强，可在第二阶段之后补。

### 3.1 协议与 Schema（G01–G07）

| ID | 缺口 | 现状与证据 | 优先级 |
| --- | --- | --- | --- |
| G01 | 作者态可翻译值 `$i18n`（`key` / `messages` / `params` / `fallback`）没有类型与 JSON Schema | `packages/schema/src/schemas/dsl-node.ts:137` 的 `props` 是自由对象 `{ type: 'object' }`，`$i18n` 不会被识别；`packages/core/src/node.ts` 也没有对应类型 | P0 |
| G02 | 页面作者态 `i18n` 字段（`namespaces` / `bindings`）不存在 | `packages/schema/src/schemas/page-dsl.ts:154` 页面根 `additionalProperties: false`，没有 `i18n`；`packages/core/src/document.ts:83` 的 `PageDsl` 接口也没有该字段。作者写 `i18n:` 会直接校验失败 | P0 |
| G03 | 页面级 `bindings` 的 JSON Pointer 定位、原值隐式 fallback、路径失效/重复/非字符串校验没有实现 | 设计第 4.0、4.2 节；当前没有任何路径遍历或绑定校验代码 | P0 |
| G04 | 可翻译字段注册表不存在，内置组件与动作也没有声明可翻译字段 | 设计第 4.4 节要求按组件/动作契约遍历 `text`、`label`、`columns[*].title`、`options[*].label`、`rules[*].message` 等；当前组件注册表只登记 React 组件，没有任何 i18n 元数据 | P0 |
| G05 | 作者态 Schema 与下发态 Schema 没有拆分 | `packages/schema` 只有 `pageDslSchema` / `dslNodeSchema` 一套；`validatePageDsl` 既用于运行时分发，也会被误用于作者态。设计要求“作者态校验 → 权限裁剪 → 翻译 → 下发态校验”四步 | P0 |
| G06 | 下发态 `$localizedText` 值类型没有定义 | 设计第 4.3 节的 `{ "$localizedText": { template, params } }` 没有 TypeScript 类型、JSON Schema 或运行时分支 | P0 |
| G07 | `requires` 没有 i18n / DSL 特性版本；Fragment 没有作者态国际化协议 | `packages/core/src/document.ts` 的 `RequiresConfig` 只有 `runtime` / `components`；`FragmentDsl` 与 `DslFragmentPayload` 都没有 `i18n` 字段，而设计要求动态片段与页面使用同一语言上下文 | P1 |

补充说明：

- `props` 目前不限制字段，所以 `$i18n` 对象**不会**在 Schema 层报错，而是会一路传到组件；这比“报错”更危险，会造成静默渲染对象（见 G38）。
- `page.title` 当前必须是字符串（`page-dsl.ts:106`），因此方式一/方式二不能直接写 `page.title.$i18n`；这正是设计引入 `bindings` 保留原字符串的原因，但 bindings 本身也还没实现（G03）。

### 3.2 Core i18n 语义（G08–G13）

| ID | 缺口 | 现状与证据 | 优先级 |
| --- | --- | --- | --- |
| G08 | `t()` 只有字符串返回值，没有 `{ found, value, resolvedLocale }` 形式的显式命中结果 | `packages/core/src/i18n.ts:21-28` 的 `I18nContext.t` 返回 `string`。设计第 8 节要求内部 lookup 返回命中状态，因为合法译文可能恰好等于 key | P0 |
| G09 | 回退链只有“当前 locale → 扁平 key → defaultLocale → key”，没有语言级回退（如 `fr-CA → fr`）与 locale 别名 | `packages/core/src/i18n.ts:67-103`；没有 `supportedLocales`、`aliases`、`defaultStrategy` 概念 | P1 |
| G10 | `I18nMessages` 不支持语言包 API 的 bundle 结构，也没有消息格式版本 | 当前类型是 `Record<string, string \| Record<string, string>>`（`i18n.ts:12`），无法表达设计第 6.1 节的 `{ locale, release, format, bundles: { ns: { version, messages } } }`；也没有 `simple-v1` / `icu-v1` 标识 | P0 |
| G11 | 缺失参数当前被替换为空字符串，设计要求保留占位符并记录诊断 | `packages/core/src/i18n.ts:38-43` 的 `interpolate` 对 `undefined` / `null` 返回 `''`；设计第 7 节明确要求“未知参数保留占位符并记录诊断”，且不能用改造后的行为破坏旧 `t` | P1 |
| G12 | `useI18n` 用 `translated === key` 判断是否命中，译文等于 key 时误判 | `packages/runtime/src/context/i18n-context.ts:34-37`；设计第 8 节已点名该实现需要替换 | P1 |
| G13 | 没有 ICU / 复数 / 性别解析 | 当前只有 `{{name}}` 简单插值；设计第 7 节将其列为第二阶段 `icu-v1`，接口需预留但不必首期实现 | P2 |

### 3.3 服务端本地化纯逻辑（G14–G18、G21）

这一节对应设计文档第 6 节，是当前**完全空白**的部分。框架只提供与宿主无关的纯逻辑；Next.js 的请求解析、路由、鉴权与接口适配全部由应用端实现，不进入框架包。

| ID | 缺口 | 现状与证据 | 优先级 |
| --- | --- | --- | --- |
| G14 | `LocaleResolver` / `resolveRequestLocale` 不存在：URL path、`?locale=`、`locale` Cookie、`Accept-Language` q 权重、`defaultStrategy`、别名、`INVALID_LOCALE` / `UNSUPPORTED_LOCALE` / `LOCALE_CONFLICT` 均无 | 设计第 5.3 节；输入应为普通请求信息对象（pathname / query / cookie / header 字符串），不依赖 Next.js 类型；`packages/*` 无 `accept-language`、`supportedLocales`、`defaultStrategy` 命中 | P0 |
| G15 | `MessageProvider` 契约与 `YamlMessageProvider` / `ApiMessageProvider` 不存在 | 设计第 6.0.3 节；没有统一的语言包加载接口，也没有本地 YAML / 远程 JSON 两种来源 | P0 |
| G16 | 语言包 YAML 的严格解析、重复 key 检查、非字符串词条拒绝、大小/别名展开限制、namespace 冲突检查、规范化输出都没有 | 设计第 6.0.2、6.1 节；框架内没有语言包解析、manifest 或规范化器 | P0 |
| G17 | `DslLocalizer` / `localizePageDsl` 不存在：三种声明方式的遍历、bindings 替换、`$localizedText` 模板编译、缺失诊断、不可变副本都没有 | 设计第 6 节；当前没有任何 DSL 结构转换逻辑 | P0 |
| G18 | `localizeYamlResource` 编排入口与 `validateLocalizedPageDsl` 下发态校验不存在 | 设计第 6.0.2 节；没有“加载 → 校验 → 裁剪 → 取语言包 → 转换 → 再校验”的服务端入口 | P0 |
| G21 | 框架侧没有语言包版本（release / bundleVersion）、条件请求（ETag/304）、语言级缓存键、超时/重试/降级（503、24 小时宽限） | 设计第 8、9 节；当前没有任何语言包缓存或发布版本概念。清单文件的生成与托管属于应用端 | P1 |

### 3.4 资源协议与加载器（G22–G27）

| ID | 缺口 | 现状与证据 | 优先级 |
| --- | --- | --- | --- |
| G22 | 资源 envelope 没有 `representation`、`localization`、`bundleVersions` | `packages/resource/src/types.ts:11-25` 的 `DslResourceEnvelope` 只有 id / resourceType / version / dslVersion / etag / requires / schema / updatedAt | P0 |
| G23 | `parseEnvelope` 只构造固定字段，服务端新增的 i18n 字段会被丢弃 | `packages/resource/src/types.ts:75-104`：返回对象是白名单式构造，`localization` 不会保留 | P0 |
| G24 | locale 不向资源请求传播 | `packages/app/src/sitemap/fetch.ts`（sitemap 请求）、`packages/app/src/sitemap/loader.ts`（页面请求）、`packages/resource/src/loaders/http-loader.ts`（页面/片段请求）都不拼接 `?locale=`；`packages/app/src/sitemap/url.ts` 的 `resolveUrl` 也没有 locale 参数 | P0 |
| G25 | 缓存键缺少 locale / release / bundleVersion | `packages/app/src/sitemap/loader.ts:45` 为 `${pageId}@${version}`；`packages/resource/src/loaders/http-loader.ts` 也是 `id@version`；`packages/runtime/src/datasource/dsl-source-resolver.ts` 的 key 只含引用原文 | P0 |
| G26 | `createSitemapLoader.loadFragment` 直接抛“未实现” | `packages/app/src/sitemap/loader.ts:81-83`；设计中的动态片段/懒加载片段链路在 sitemap 模式下不可用 | P1 |
| G27 | bootstrap 的 i18n 读取没有对齐设计的 `localization` 协议 | `packages/app/src/application.ts:501-517` 读取的是 `bootstrap.locale` / `bootstrap.defaultLocale` / `bootstrap.messages`；设计第 6.2 节要求从 `localization.locale/defaultLocale` 映射，并把 `release` / `bundleVersions` 带入会话。`BootstrapResource` 没有 `localization` / `release` / `bundleVersions` 的显式类型（仅靠索引签名透传） | P1 |

补充：

- `packages/app/src/sitemap/types.ts` 的 `SitemapResource`、`SitemapPageEntry`、`SitemapMenuItem` 都没有 `localization` 或 `release` 字段，即使服务端返回也会被类型层忽略。
- 设计要求“上游已本地化则校验后透传，上游是原始 YAML/作者态 JSON 则由服务端（应用端）转换”，当前没有 `representation` 区分，只能按 HTTP 200 一律当作可用 DSL。

### 3.5 应用运行时与语言切换（G28–G36）

| ID | 缺口 | 现状与证据 | 优先级 |
| --- | --- | --- | --- |
| G28 | 没有 `supportedLocales` / `defaultStrategy` / 别名映射配置 | `PactorApplicationOptions`（`application.ts:61-132`）只有 `locale` / `defaultLocale` / `messages` / `localeStorage`；`SitemapAppProps` 同样只有 `locale` / `defaultLocale` / `messages` | P1 |
| G29 | 启动 locale 解析链与设计不一致，且没有校验 | `application.ts:495-511` 的顺序是 options > localStorage > bootstrap > `navigator.language` > `zh-CN`；设计第 5.1 节要求 URL > `locale` Cookie > `Accept-Language` > `defaultLocale`，并校验 `supportedLocales`、拒绝非法显式语言 | P1 |
| G30 | `setLocale` 是同步的会话更新，没有“先取资源 → 校验 → 一次性提交 → 失败回滚 → 丢弃旧代次响应 → 同步 URL”的切换事务 | `application.ts:620-642` 只更新 `locale` / `messages` / `i18nVersion` 并写持久化；设计第 9.2 节要求的异步事务不存在 | P0 |
| G31 | `SitemapApp` 切换 locale 不会重新请求 sitemap 与内联页面 | `SitemapApp.tsx:204-214` 的拉取 effect 依赖只有 `fetcher`、`baseUrl`、`httpAdapter`、`sources`，没有 `locale`；`pageFactory` 会随 locale 重建（`SitemapApp.tsx:376-437`），但 `sitemap` 对象仍是旧语言的 | P0 |
| G32 | 整应用 `setLocale` 后页面会重建，但 `resolvePage` 仍命中旧语言缓存，请求也不带 locale | `app-shell.tsx` 的 `pageLoaderKey` 含 `i18nVersion`，会触发 `DslPageLoader` 重新 `app.resolvePage`；而 `application.ts:574-577` 的 `resolvePage` 只调 `loader.loadPage(pageId)`，`HttpDslResourceLoader` 以 `id@version` 命中旧缓存。菜单、布局、bootstrap 也不会重新获取 | P0 |
| G33 | 没有内置 Cookie `LocaleStorage` 与旧 `pactor.locale` localStorage 迁移 | `packages/app/src/locale-storage.ts` 只有 localStorage 实现（key `pactor.locale`）；设计第 5.2、5.4 节要求统一 `locale` Cookie 并迁移旧值。服务端 `Set-Cookie`（登录 / 偏好保存）属于应用端 | P1 |
| G34 | `UserMenu` 直接写 `pactor.locale` localStorage，未桥接应用级切换；`Header` 只发事件 | `packages/ui/src/ui/user-menu/user-menu.tsx:18,56-67,203`；宿主需要自己把 `onLanguageChange` 接到 `app.setLocale` 或服务端切换，框架没有提供默认桥接 | P1 |
| G35 | 会话没有 `localization` / `release` / `bundleVersions`；嵌入式 `PactorPage` 的 locale 首次渲染后固化；`session.context` 不含 locale | `PactorAppSession`（`application.ts:138-164`）只有 locale/defaultLocale/messages/i18nVersion；`packages/app/src/embedded.tsx:167-171` 直接使用时用首渲染 options 创建工厂，后续 `locale` prop 变化不会生效；`packages/app/src/sitemap/session.ts` 只有 user/app/menus | P1 |
| G36 | locale 切换后没有同步文档 `lang` / `dir` 与 URL | `application.ts:620-642` 的 `setLocale` 只更新会话与持久化，未设置 `document.documentElement.lang` / `dir`，也没有把当前 locale 写回路由查询参数的入口。服务端 `<html lang>` / `Content-Language` 属于应用端 | P1 |

### 3.6 Runtime 渲染与安全（G37–G41）

| ID | 缺口 | 现状与证据 | 优先级 |
| --- | --- | --- | --- |
| G37 | `resolveDeep` 没有 `$localizedText` 分支 | `packages/runtime/src/utils/resolve.ts:29-50` 只处理字符串/数组/普通对象；`$localizedText.params` 中的 `${state.x}` 会被提前求值，而包装对象本身会被原样传给组件 | P0 |
| G38 | 作者态 `$i18n` 若漏到客户端，会被当作普通对象递归渲染，没有协议错误拒绝 | `packages/runtime/src/renderer/renderer.tsx:408-431` 的 `resolveProps` 对所有对象递归 `resolveDeep`；没有“本地化模式下禁止 `$i18n`”的开关或错误分支 | P0 |
| G39 | 译文或 fallback 中的 `${...}` 会被表达式引擎执行，存在注入风险 | 服务端替换后的字符串进入 `resolveDeep` 后仍会命中 `hasExpression`；设计第 7 节要求发布/转换阶段拒绝含 `${` 的词条，并对插值后的静态结果二次检查。当前没有该检查 | P0 |
| G40 | 旧 `${t(...)}` 没有服务端 AST 编译、白名单或报错 | 当前只在浏览器端由表达式引擎求值；设计第 4.3 节要求服务端只接受“整个属性为单个 t 调用、key 为字符串字面量、params 为受支持对象”，其余形态发布时报错 | P1 |
| G41 | 动作 params、dataSource params、DslSourceRef params 中的本地化值没有统一处理 | `packages/runtime/src/action/engine.ts`、`datasource/data-store.ts`、`datasource/dsl-source-resolver.ts` 都直接 `resolveDeep`；没有 `$localizedText` / `$i18n` 的统一入口，也没有本地化模式下的拒绝策略 | P1 |

补充：

- 设计明确要求“翻译结果不得再次送入表达式引擎”。当前唯一能做这件事的位置就是 `resolveDeep`，但它在 props、action、dataSource 三处共用，改动必须集中在该函数或其上层，不能只改 renderer。
- 服务端本地化模式下，客户端仍暴露 `${t(...)}` 会形成两套翻译路径；需要运行时模式开关（G38 的一部分）或发布校验（G40）来防止混用。

### 3.7 UI / 组件 / 格式化（G42–G44）

| ID | 缺口 | 现状与证据 | 优先级 |
| --- | --- | --- | --- |
| G42 | 内置组件与动作的可翻译字段契约没有声明（与 G04 是同一能力的 UI 侧） | 设计第 4.4 节列出的 `text` / `label` / `placeholder` / `description` / `ariaLabel` / `columns[*].title` / `options[*].label` / `rules[*].message` / 动作 `message.params.text` / 确认框标题，没有任何组件元数据或集中清单 | P0 |
| G43 | 没有共享的日期/数字/金额格式化适配层 | DatePicker 内部用 date-fns locale 映射（`packages/ui/src/components/components/DatePicker/index.tsx:107-110`），但没有设计第 7 节要求的 `Intl` 共享适配层（locale / timeZone / currency 显式传递） | P2 |
| G44 | RTL / `dir` 没有支持 | 无 `dir` 属性管理、无 RTL 样式或布局适配；设计第 11 节将其列为第三阶段 | P2 |

### 3.8 工具链（G47）

| ID | 缺口 | 现状与证据 | 优先级 |
| --- | --- | --- | --- |
| G47 | 没有词条提取 CLI、覆盖率门禁、missing-key 指标与翻译平台导入导出 | 设计第 11 节第三阶段的工具链均未实现；框架包内没有词条扫描、key 校验或覆盖率统计工具 | P2 |

G45（starter）、G46（create-app 模板）与 examples 改造属于应用端实现，已移至附录 A；框架只提供它们消费的纯逻辑与类型。

### 3.9 测试与可观测性（G48）

| ID | 缺口 | 现状与证据 | 优先级 |
| --- | --- | --- | --- |
| G48 | 没有 i18n 协议与转换链路的测试，也没有监控指标 | 现有测试集中在客户端 `t` 回退、`setLocale`、内置组件文案（`packages/core/src/i18n.test.ts`、`packages/app/tests/locale-switching.test.tsx`、`packages/ui/tests/components/i18n-coverage.test.tsx` 等）；没有 LocaleResolver、DslLocalizer、MessageProvider、路径绑定、`$localizedText`、安全拒绝、语言切换竞态、指标采集的测试 | P1 |

## 4. 缺口与设计章节对照

| 设计章节 | 需要的框架能力 | 对应缺口 |
| --- | --- | --- |
| 4.0–4.2 作者协议 | `$i18n`、页面 `i18n`、bindings、双 Schema | G01、G02、G03、G05、G07 |
| 4.3 参数与动态翻译 | `$localizedText` 类型与运行时解析、旧 `t` 编译 | G06、G37、G40、G41 |
| 4.4 转换范围 | 可翻译字段注册表、组件/动作元数据 | G04、G42 |
| 5 语言识别 | LocaleResolver、supportedLocales、Cookie、别名 | G14、G28、G29、G33 |
| 6.0 双来源语言包 | MessageProvider、YAML/API Provider | G15、G16（G20、G45 为应用端） |
| 6.1 语言包接口 | bundle 模型、版本、namespace、ETag | G10、G21 |
| 6.2 下发协议 | envelope、`representation`、`localization` | G22、G23、G27 |
| 7 动态参数边界 | `$localizedText`、注入防护、缺失参数策略 | G11、G37、G39 |
| 8 缺失与回退 | 显式命中、语言级回退、诊断、降级 | G08、G09、G12、G13、G21 |
| 9 缓存与切换 | 缓存键、异步切换事务、URL 同步 | G25、G30、G31、G32、G36 |
| 10 Next.js 接入（应用端） | 框架侧只需动态片段加载；sitemap 本地化、API 路由、模板均在应用端 | G26 |
| 11 实施顺序 | 分阶段交付 | 见第 5 节 |

## 5. 建议的实施顺序

### 阶段 A：协议内核与服务端纯函数（对应设计第一阶段）

目标：让“一份作者态 YAML → 服务端本地化 DSL JSON → 客户端直接渲染”在单元测试中跑通，不依赖 Next.js。

1. 在 `packages/core` 增加 `$i18n` / `$localizedText` / `MessageBundleSet` 类型，扩展 `t` 的内部 lookup 为 `{ found, value, resolvedLocale }`（保留 `t` 返回字符串的兼容签名）。
2. 在 `packages/schema` 增加作者态与下发态两套 schema，加入 `$i18n`、`i18n.namespaces`、`i18n.bindings`、`$localizedText` 的结构校验；增加可翻译字段注册表类型。
3. 在 `packages/schema` 或新的 `@pactor-app/i18n` 中实现 `fieldRegistry` 与内置组件的可翻译字段清单。
4. 实现 `LocaleResolver`、`MessageProvider` 契约、`YamlMessageProvider`、`ApiMessageProvider`、`DslLocalizer`、`localizeYamlResource`、`validateLocalizedPageDsl`。
5. 在 `packages/runtime` 为 `resolveDeep` 增加 `$localizedText` 分支，并集中处理 `$i18n` 的拒绝与 `${` 注入检查。
6. 在 `packages/resource` 扩展 envelope 与 `parseEnvelope`，保留 `representation` / `localization` / `bundleVersions`。
7. 在 `packages/app` 的资源请求中传播 locale，并把缓存键扩为 `id@version@locale@release@bundleVersion`。

阶段 A 的退出标准：单测覆盖三种声明方式、回退、缺失、bindings 失效、不可变性、注入拒绝、动态模板。

### 阶段 B：应用接入与切换一致性（对应设计第二阶段）

1. `SitemapApp` 把 locale 纳入 sitemap / page / fragment 请求与缓存键；locale 变化时重新拉取 sitemap 并按新语言重建页面。
2. 整应用 `setLocale` 改为异步事务：目标语言资源校验成功后再提交会话，失败保持原状态，旧代次响应丢弃，URL 与文档 `lang` / `dir` 同步。
3. 增加 Cookie `LocaleStorage` 与旧 `pactor.locale` 迁移；`UserMenu` / `Header` 提供默认桥接。服务端偏好保存与 `Set-Cookie` 由应用端实现。
4. 把 `localization.locale/defaultLocale/release/bundleVersions` 映射进 `PactorAppSession` 与 `session.context`。
5. 增加集成测试：语言 × 版本、语言包 304/超时、切换竞态、旧代次响应丢弃。

Next.js 侧（sitemap / 菜单 / 布局的本地化、`/api/i18n/bundles`、starter、create-app 模板、examples）由应用端基于阶段 A 的纯函数实现；本仓库框架包不新增任何 Next.js 代码。

阶段 B 的退出标准：应用端按目标 locale 下发 sitemap 与页面后，框架侧菜单、布局、页面、动态片段全部来自同一 locale/release；切换失败可回滚；断网/语言包失败有受控降级。

### 阶段 C：治理与增强（对应设计第三阶段）

1. `simple-v1` 之外的 `icu-v1`（复数、性别、复杂句式），服务端与客户端使用同一解析器版本。
2. `Intl` 日期/数字/金额共享适配层；RTL。
3. 词条提取 CLI、覆盖率门禁、翻译平台导入导出、missing-key 指标。

## 6. 需要先确认的架构决策

1. **新包还是扩展现有包**：建议新增 `@pactor-app/i18n` 承载服务端纯逻辑（LocaleResolver / MessageProvider / DslLocalizer / manifest 读取），避免 `@pactor-app/core` 引入 YAML 依赖。框架包不得依赖 Next.js 或宿主专属 API；Next.js 适配（请求解析、Route Handler、鉴权、Cookie 写入）全部在应用端实现。`@pactor-app/core` 只保留客户端共享类型与翻译函数。
2. **YAML 依赖策略**：`yaml` 目前只出现在应用端 starter 的 dependencies 中。若 `@pactor-app/i18n` 直接依赖它，需要明确浏览器 bundle 不引入；建议作为可选 peer 或仅在 Node 入口导出。
3. **双模式开关**：服务端本地化模式与旧客户端 `t` 模式必须显式区分，否则无法判断 `$i18n`、`${t(...)}` 是兼容写法还是协议错误。建议在 `PageResource` / `SitemapApp` 上增加模式标记，并让运行时按模式拒绝非法节点。
4. **URL 语言策略**：框架的 LocaleResolver 只接受应用端传入的 pathname / query / cookie / Accept-Language 原始信息，不绑定具体 URL 形态；后台应用用 `?locale=` 还是公开站点用 `/[locale]/`，由应用端决定。
5. **Cookie 与 localStorage**：设计统一使用 `locale` Cookie；现有实现使用 `pactor.locale` localStorage。框架侧只提供浏览器端读写适配与迁移；Cookie 的 `Secure` / `SameSite` / `Path` 与服务端 `Set-Cookie` 由应用端决定。
6. **locale 权威来源**：服务端返回的 `localization.locale` 应为唯一权威值；前端不再用 `navigator.language` 二次协商。现有 `application.ts` 的解析链需要整体替换，而不是叠加。
7. **`t` 的兼容边界**：设计只允许“整个属性为单个 `${t(...)}`”进入服务端编译。需要明确其他形态是发布错误还是运行时错误，并给出迁移提示。
8. **`requires` 版本化**：新增 `$i18n` / `$localizedText` 后，旧 Runtime 不能消费新 DSL。需要增加类似 `requires.i18n` 或 DSL 能力版本，并在发布校验中检查。

## 7. 最小可交付（MVP）建议

若希望尽快验证主链路，建议先做以下 8 组能力（共 18 个缺口），全部是框架纯函数与运行时能力，不依赖 Next.js：

- G01、G02、G03：作者态 `$i18n.key` + `bindings` 可写、可校验；
- G04（先覆盖 Button / Text / Input / Table 列 / Select 选项）：字段注册表可遍历；
- G08、G10：`t` 显式命中 + bundle 模型；
- G14、G15、G16：locale 解析 + YAML Provider；
- G17、G18：转换器与下发态校验；
- G22、G23：envelope 携带 `representation` / `localization`；
- G24、G25：请求传播 locale + 缓存按 locale 隔离；
- G37、G38、G39：`$localizedText` 解析、`$i18n` 拒绝、`${` 注入防护。

MVP 验收：同一份作者态 YAML 在两个 locale 输入下经框架纯函数返回不同的本地化 JSON（单测即可验证）；应用端接入后，浏览器网络面板中不出现 `$i18n`、语言包请求或客户端 `t` 调用，切换语言后页面内容更新且不出现旧语言缓存。

## 附录 A：应用端职责（不计入框架缺口）

以下事项由应用端（Next.js / starter / create-app 模板 / examples）基于框架提供的纯逻辑实现，不属于 `packages/*` 的交付范围。列在此处是为了避免应用端接入时漏项。

| 原编号 | 应用端职责 | 说明 |
| --- | --- | --- |
| G19 | sitemap / 菜单 / 布局的服务端本地化 | 应用端在返回前按 locale 转换菜单与布局标题；框架只负责请求 locale、缓存隔离与切换后重新拉取（G24、G25、G31） |
| G20 | `GET /api/i18n/bundles` 与 manifest 下发 | Route Handler 调用框架的 MessageProvider / 解析器，按设计第 6.1 节输出 JSON；框架不提供该路由 |
| G45 | starter 的 i18n 目录、语言包、双语言页面 | 应用端目录约定、manifest、Provider 装配与页面示例 |
| G46 | create-app 的 Next.js / SPA 模板 | 模板输出的是应用端代码，属于脚手架资产，不属于框架运行时能力 |
| G47-示例 | `examples/*` 的接入示例 | examples 只做演示，不计入框架能力 |
| G36-服务端 | `<html lang>` / `dir`、`Content-Language`、服务端 `Set-Cookie` | 由应用端在布局与响应头中设置；框架只同步浏览器端文档属性与 URL |

边界约束：`packages/*` 的运行时模块不导入 `next`、`next/*` 或任何 Next.js 类型；create-app 的模板内容仅作为应用脚手架资产，不参与框架构建与导出。框架需要宿主信息时只接受普通对象参数（pathname、query、cookie、Accept-Language 字符串等），应用端负责把这些信息从 `NextRequest` 映射为框架入参。
