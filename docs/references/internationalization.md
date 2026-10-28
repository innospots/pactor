# 国际化开发规范与使用说明

本文基于当前仓库实现编写，面向 **YAML 作者**、**服务端接入** 与 **运行时消费**。设计背景见 [`internationalization-design.md`](../internationalization-design.md)；API 速查见 [`packages/i18n/README.md`](../../packages/i18n/README.md)。

## 1. 能力分层

| 层级 | 包 / 位置 | 职责 |
| --- | --- | --- |
| 协议与类型 | `@pactor-app/core`（`i18n.ts`）、`@pactor-app/schema` | `$i18n`、`$localizedText`、`MessageBundleSet`、`LocalizationMeta`；作者态 / 下发态校验 |
| 服务端转换 | `@pactor-app/i18n` | 请求语言解析、`MessageProvider`、页面 DSL 本地化（`localizePageDsl` / `localizeYamlResource`） |
| 资源 Envelope | `@pactor-app/resource` | `representation: localized` + `localization` 元信息 |
| 客户端兼容 | `@pactor-app/runtime`、`@pactor-app/app` | 表达式 `${t('key')}`、`setLocale`、内置 `pactor.*` 文案；**不**承担作者态 `$i18n` 查找 |

**主路径**：服务端按请求语言把**作者态** Page YAML 转为**下发态** JSON（字符串或 `$localizedText`），浏览器只渲染结果。客户端 `messages` + `t()` 为兼容模式，与本文三种声明方式可并存，但业务页面推荐走服务端转换。

---

## 2. 三种多语言声明方式

同一页面可混用三种方式；**同一字段只能选一种**。方式三为字段内简写；旧路径 bindings 已移除。

### 2.1 方式一：属性内联多语言（`$i18n.messages`）

适用：少量、局部、不复用文案；**不需要**独立语言包文件。

```yaml
dsl: "1.0"
page:
  id: demo
  title: 示例
body:
  type: Button
  props:
    text:
      $i18n:
        messages:
          zh-CN: 保存
          en-US: Save
        fallback: 保存   # 可选；词条链全部失败时使用
```

规则：

- `$i18n` 为包装对象，**不允许**其他同级字段。
- `key` 与 `messages` **必须且只能出现一个**。
- `messages` 为 `locale → string` 扁平映射，值均为字符串。
- 可选 `params`：静态插值用 `{{name}}`；若某参数值为含 `${` 的表达式字符串，下发为 `$localizedText`（见 §5）。

### 2.2 方式二：属性引用语言包（`$i18n.key`）

适用：业务主写法；词条集中在语言包 YAML / 远程 API。

```yaml
dsl: "1.0"
page:
  id: user-list
  title: 用户
i18n:
  namespaces:
    - common
    - user
body:
  type: Button
  props:
    text:
      $i18n:
        key: common.save
        fallback: 保存
```

规则：

- `i18n.namespaces` 声明本页需要的语言包 **namespace**（分组名，不是 key 前缀）。
- `key` 为完整稳定键名（如 `common.save`），**不**解析表达式。
- 服务端通过 `MessageProvider.load` 按 `namespaces` 批量加载后查找词条。
- 若页面**未**声明 `namespaces` 且仅使用方式一内联 `messages`，**不会**调用 Provider（内联仍可转换）。

### 2.3 方式三：字段内简写

```yaml
dsl: "1.0"
page:
  id: editor
  title: "$i18n{editor.title:编辑器}"
i18n:
  namespaces: [editor, common]
body:
  type: Button
  props:
    text: "$i18n{common.save:保存}"
```

`$i18n{key:default}` 表示引用完整 key，并以 default 作为回退。它是整字段的静态文本简写：第一个冒号分隔 key 和 default，default 可为空且可含其他冒号；`\}` 和 `\\` 分别表示 default 中的右花括号和反斜杠，建议 YAML 使用单引号。动态参数用方式二 `params`，语言包不执行 `${...}`。

只在明确允许翻译的静态元信息和注册的组件展示字段识别；不得替换状态、业务数据、URL、路由、标识、权限或请求参数。解析 YAML 后规范化，非法、未闭合或不允许字段中的显式简写应报错。

**迁移**：旧 `i18n.bindings` 已移除；将 key 与显式 fallback 移至目标字段，缺省 fallback 时使用原字段文案，动态参数改用对象式 `$i18n.params`。迁移后验证两种语言输出。

---

## 3. 可翻译字段过滤（注册表）

`DslLocalizer` **只**转换已注册字段上的 `$i18n`；未注册字段出现 `$i18n` → `UNREGISTERED_I18N_FIELD`（不静默忽略）。

默认注册（`createDefaultTranslatableFieldRegistry()`）：

| 组件 type | 字段路径（`props.` 前缀；`*` 为数组通配） |
| --- | --- |
| Button | `text`, `label`, `description`, `ariaLabel` |
| Text | `text`, `description`, `ariaLabel` |
| Input | `text`, `label`, `placeholder`, `description`, `ariaLabel` |
| Table | `label`, `description`, `ariaLabel`, `columns[*].title` |
| Select | `label`, `placeholder`, `description`, `ariaLabel`, `options[*].label` |

| 动作 | 参数字段 |
| --- | --- |
| `message` | `params.text` |
| `confirm` | `params.title`, `params.content` |

自定义组件 / 动作：

```ts
import { createDefaultTranslatableFieldRegistry } from '@pactor-app/i18n';

const registry = createDefaultTranslatableFieldRegistry();
registry.register('MyCard', ['props.title', 'props.items[*].label']);
registry.registerAction('notify', 'params.text');
```

遍历范围：`body`、`children`、`components`、页面级 `actions` / `lifecycle` 内已注册路径。`state`、`dataSources`、`meta` 等处的 `$i18n` 在**残留扫描**阶段一律拒绝。

---

## 4. 语言包加载的三种途径

框架通过统一接口 `MessageProvider` 加载词条；**不提供**声明式 `messageSource` YAML 配置解析，应用在服务端 **选择并注入** Provider。

| 途径 | 实现类 | 入口 | 典型场景 |
| --- | --- | --- | --- |
| 本地 YAML + manifest | `YamlMessageProvider` | `@pactor-app/i18n/node` | Next/Node 同进程读 `locales/**/*.yaml` |
| 远程语言包 API | `ApiMessageProvider` | `@pactor-app/i18n` | 独立语言服务、多应用共享词条 |
| 经 Next 暴露的 bundles API | 同上 `ApiMessageProvider`，`endpoint` 指向 `GET /api/i18n/bundles` | 应用自建 Route | 外部渲染服务与本地词条同协议；**仓库未内置该 Route** |

本地与远程输出结构相同：`MessageBundleSet`（见 §5.2）。

### 4.1 `MessageProvider.load` 入参

```ts
interface LoadMessagesInput {
  appId: string;
  tenantId?: string;   // 仅来自服务端可信上下文
  locale: string;
  namespaces: string[];
  release: string;
}
```

- `namespaces` 通常来自页面作者态 `i18n.namespaces`。
- `tenantId`、`release`、`appId` 由应用发布配置决定，**不接受**浏览器任意指定。

### 4.2 方式 A：本地 YAML（`YamlMessageProvider`）

**清单 `manifest.json` 结构：**

```json
{
  "appId": "console",
  "release": "rel-20261022-01",
  "locales": {
    "zh-CN": {
      "common": { "path": "locales/zh-CN/common.yaml", "version": "12" },
      "user": { "path": "locales/zh-CN/user.yaml", "version": "7" }
    },
    "en-US": {
      "common": { "path": "locales/en-US/common.yaml", "version": "12" },
      "user": { "path": "locales/en-US/user.yaml", "version": "7" }
    }
  }
}
```

**单文件内容**（扁平 `key: 文案`，值必须为字符串；可用 `{{count}}` 插值）：

```yaml
common.save: 保存
common.cancel: 取消
user.selectedCount: "已选择 {{count}} 项"
```

**构造参数：**

| 参数 | 说明 |
| --- | --- |
| `manifest` | 清单对象（构造时 `validateManifest`） |
| `readFile(path)` | 异步读清单中的**相对路径**（禁止 `..`、绝对路径） |
| `maxFileBytes` | 单文件上限，默认 1_000_000 |
| `maxAliasCount` | YAML 别名展开上限，默认 100 |

缺失 namespace、manifest 与 `load` 的 `appId`/`release` 不一致等 → `MANIFEST_MISMATCH` / `NAMESPACE_NOT_FOUND` / `MESSAGE_BUNDLE_INVALID`。

### 4.3 方式 B / C：远程 API（`ApiMessageProvider`）

**构造参数：**

| 参数 | 说明 |
| --- | --- |
| `endpoint` | 语言包 API 基址（应用配置，非用户输入） |
| `fetch` | 注入的 fetch 风格函数（Node / Edge 适配） |
| `headers` | 可选，如 `Authorization`（服务端凭据） |

**请求 URL（GET）：**

```http
GET {endpoint}?appId=console&locale=en-US&namespaces=common,user&release=rel-20261022-01
```

可选查询参数：`tenantId`。

**响应要求：**

- HTTP 200，`Content-Type: application/json`
- Body 为 §5.2 的 `MessageBundleSet` envelope
- 支持 `ETag` / `If-None-Match`；304 时复用同缓存键已校验包（`loadWithCacheInfo` 返回 `notModified: true`）

返回 YAML 或非 JSON → `MESSAGE_PROTOCOL_ERROR`。

方式 C 与方式 B 使用同一客户端；差异仅在 `endpoint` 指向本应用实现的 bundles 路由，路由内部通常委托 `YamlMessageProvider` 再 `Response.json`。

### 4.4 请求语言解析（`resolveRequestLocale`）

在调用 `localizeYamlResource` 前，由宿主把 HTTP 请求适配为：

```ts
interface ResolveLocaleInput {
  pathLocale?: string;
  queryLocale?: string | string[];
  cookieLocale?: string;
  acceptLanguage?: string;
}

interface LocaleResolverConfig {
  supportedLocales: string[];
  defaultLocale: string;
  defaultStrategy?: 'system' | 'application'; // 缺省 system
  aliases?: Record<string, string>;           // 如 { en: 'en-US' }
  fallbackLocales?: Record<string, string[]>; // Accept-Language 协商用
}
```

**优先级**：URL path/query > `locale` Cookie > `Accept-Language`（仅 `defaultStrategy: 'system'`）> `defaultLocale`。

**返回：**

```ts
interface ResolvedRequestLocale {
  locale: string;
  source: 'url-path' | 'url-query' | 'cookie' | 'accept-language' | 'application-default';
  explicit: boolean;
}
```

显式非法 / 不支持 / 多值冲突 → `I18nError`（`INVALID_LOCALE` / `UNSUPPORTED_LOCALE` / `LOCALE_CONFLICT` / `DUPLICATE_LOCALE_PARAM`）。可将 `source`、`explicit` 写入 `localization` 元信息。

---

## 5. 数据结构

### 5.1 作者态翻译描述（`$i18n` 内层）

```ts
// 二选一
{ key: string; params?: Record<string, unknown>; fallback?: string }
| { messages: Record<string, string>; params?: Record<string, unknown>; fallback?: string }
```

词条键名规则（语言包内）：非空点分段，段内无空白与点，如 `common.save`、`user.page.title`。

### 5.2 语言包集合 `MessageBundleSet`

Provider 与 API 的统一输出：

```ts
interface MessageBundleSet {
  appId: string;
  locale: string;
  release: string;
  format: 'simple-v1';
  bundles: Record<string, MessageBundle>;
}

interface MessageBundle {
  version: string;
  messages: Record<string, string>;
}
```

**API JSON 示例：**

```json
{
  "appId": "console",
  "locale": "en-US",
  "release": "rel-20261022-01",
  "format": "simple-v1",
  "bundles": {
    "common": {
      "version": "12",
      "messages": { "common.save": "Save", "common.cancel": "Cancel" }
    },
    "user": {
      "version": "7",
      "messages": { "user.selectedCount": "Selected: {{count}}" }
    }
  }
}
```

不同 namespace 之间 **禁止** 相同完整 key（加载时校验）。

### 5.3 下发态动态文本 `$localizedText`

含运行时表达式参数时，服务端输出：

```ts
interface LocalizedText {
  $localizedText: {
    template: string;              // 已选定语言的模板
    params?: Record<string, unknown>; // 可含 "${...}" 表达式，由 Runtime 求值
  };
}
```

Runtime（`resolveDeep`）对 `params` 递归求值后，用 `{{name}}` 插值 `template`。静态文案直接下发 **字符串**。

动态参数并非所有字段都可用：组件 props、动作参数等经过 Runtime `resolveDeep` 的路径可以求值；`page.title` 等由宿主作为静态元信息读取的字段未必经过该路径。把动态参数放进静态字段可能导致对象被当作字符串消费，或不发生更新。需要动态页面标题时，优先使用页面内支持表达式的文本组件，或由宿主单独实现动态元信息。

语言包只写 `欢迎，{{name}}`，表达式只由 DSL 作者在 `params.name: "${state.name}"` 提供。译文及插值结果不会再次求值，避免翻译内容注入表达式；当前服务端也会拒绝词条中的字面量 `${`。这是执行边界，不是对动态数据的禁止。当前 Schema 尚未按所有字段的消费方式强制检查动态参数，使用前仍需核对该字段是否经过 Runtime 求值。

下发态 **禁止** 残留 `$i18n`；`$localizedText` 结构由 `validateLocalizedPageDsl` 校验。

### 5.4 页面转换结果 `localizeYamlResource`

```ts
interface LocalizeYamlResourceResult {
  schema: PageDsl;           // 已本地化，无顶层 i18n
  localization: LocalizationMeta;
}

interface LocalizationMeta {
  locale: string;
  defaultLocale: string;
  source?: string;
  explicit?: boolean;
  release?: string;
  bundleVersions?: Record<string, string>; // namespace → version
}
```

**`localizeYamlResource` 主要参数：**

| 参数 | 说明 |
| --- | --- |
| `loadText()` | 加载页面 YAML 原文（本地或 HTTP，由应用实现） |
| `provider` | `YamlMessageProvider` 或 `ApiMessageProvider` |
| `appId`, `release`, `tenantId?` | 可信上下文 |
| `locale`, `defaultLocale` | 目标语言与默认语言 |
| `fallbackLocales?` | 有序语言级回退（在 current 与 defaultLocale 之间参与加载链） |
| `prune?` | 会话裁剪钩子（见 §6） |
| `registry?` | 可翻译字段注册表 |
| `onDiagnostic?` | 缺失词条 / 缺失参数回调 |

**`localizePageDsl` 入参（已有 Page 对象时）：**

```ts
localizePageDsl({
  page: authorPage,
  locale: 'en-US',
  defaultLocale: 'zh-CN',
  languageBundles: {
    current: bundleSetEn,
    fallbacks: [bundleSetZh], // 可选
  },
  registry,
  onDiagnostic,
});
```

### 5.5 资源 Envelope（下发给浏览器）

```ts
interface DslResourceEnvelope<T> {
  id: string;
  resourceType: string;
  version: number;
  dslVersion: string;
  representation?: 'source' | 'localized';
  localization?: LocalizationMeta;
  schema: T; // PageDsl
  // etag, requires, updatedAt ...
}
```

- `representation: 'localized'` 时必须有 `localization.locale`。
- 浏览器展示链路应只消费 **localized** 页面；`source` 仅供服务端再转换。

---

## 6. 过滤、裁剪与校验流水线

当前 `localizeYamlResource` 的处理顺序：

```text
加载 YAML 文本
  → 严格解析（parsePageYamlStrict：禁自定义标签、重复 key 等）
  → validateAuthorPageDsl（允许顶层 i18n + 递归校验 $i18n）
  → prune(page) 可选：权限 / 租户 / 菜单可见性裁剪（须在提取 namespaces 前）
  → 提取 i18n.namespaces
  → Provider 按 locale 链批量 load（current + fallbackLocales + defaultLocale，去重保序）
  → localizePageDsl（转换元信息和已注册字段 → 残留扫描）
  → validateLocalizedPageDsl（无 $i18n，$localizedText 合法）
  → 组装 envelope + localization
```

### 6.1 词条查找与回退（转换阶段）

对单个翻译描述，查找顺序：

1. 当前 `locale` 语言包 / 内联 `messages[locale]`
2. `languageBundles.fallbacks` 与 `fallbackLocales` 构成的显式语言级回退
3. `defaultLocale`
4. 描述上的 `fallback` 字符串
5. 方式二：回退为 **key 字符串**；方式一无 key：`'[missing translation]'`

空字符串译文视为**有效命中**。未命中当前 locale 但命中回退链时，可通过 `onDiagnostic` 收到 `missing-translation`。

### 6.2 安全与内容过滤

- 选定模板若含字面量 `${`（非 Runtime 参数对象场景）→ `UNSAFE_MESSAGE`
- 语言包路径仅来自 manifest；API URL 仅来自应用配置
- namespace 列表来自已校验 DSL，不接受客户端任意扩列

### 6.3 校验函数选用

| 场景 | 函数 |
| --- | --- |
| 作者态页面（含 `i18n`、`$i18n`） | `validateAuthorPageDsl` |
| 下发态页面（已转换） | `validateLocalizedPageDsl` |
| 仅运行时 Page（无作者态 i18n） | `validatePageDsl` |

---

## 7. 客户端兼容（简要）

不经过服务端 `$i18n` 转换时：

```ts
createPactorApplication({
  locale: 'zh-CN',
  defaultLocale: 'zh-CN',
  messages: { 'menu.home': '首页' }, // 或按 locale 分组
});
// 或 instance.setLocale('en-US', messages);
```

表达式作用域提供 `locale` 与 `t`；内置组件 `pactor.*` 文案由 `useI18n` 兜底。此路径**不会**自动重拉远程语言包或重转换 YAML。

---

## 8. 错误码速查

| Code | 常见原因 |
| --- | --- |
| `UNREGISTERED_I18N_FIELD` | 未注册字段上的 `$i18n` 或遍历范围外残留 |
| `I18N_DESCRIPTOR_INVALID` | key/messages 互斥违反等 |
| `NAMESPACE_NOT_FOUND` | Provider 缺少请求的 namespace |
| `MESSAGE_PROTOCOL_ERROR` | API 响应非合法 JSON envelope |
| `PAGE_DSL_INVALID` | 作者态或下发态 Schema 失败 |
| `INVALID_LOCALE` / `UNSUPPORTED_LOCALE` | 请求语言解析失败 |

统一错误类型：`I18nError`（`@pactor-app/i18n`），可用 `isI18nError(err, code)` 过滤。

---

## 9. 相关源码索引

| 主题 | 路径 |
| --- | --- |
| 对象声明与字段内简写转换 | `packages/i18n/src/dsl-localizer.ts` |
| 注册表 | `packages/i18n/src/translatable-field-registry.ts` |
| Schema | `packages/schema/src/schemas/i18n.ts` |
| Provider | `packages/i18n/src/yaml-message-provider.ts`、`api-message-provider.ts` |
| 编排入口 | `packages/i18n/src/localize-yaml-resource.ts` |
| 请求语言 | `packages/i18n/src/locale-resolver.ts` |
| Runtime 消费 `$localizedText` | `packages/runtime/src/utils/resolve.ts` |
