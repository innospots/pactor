# @pactor-app/i18n

Pactor 服务端国际化纯逻辑包：请求语言识别（LocaleResolver）与语言包 Provider（统一契约 + YAML / API 两种来源）。

- 不依赖 `next` 或任何宿主 API；请求信息（path/query/cookie/Accept-Language）以普通对象传入。
- 默认入口 `@pactor-app/i18n` 为浏览器安全纯逻辑，不含 `yaml`。
- `YamlMessageProvider` 仅从 Node 入口 `@pactor-app/i18n/node` 导出，`yaml` 为 peerDependency。

## LocaleResolver

```ts
import { resolveRequestLocale } from '@pactor-app/i18n';

const result = resolveRequestLocale(
  { queryLocale: 'en-US', cookieLocale: 'zh-CN', acceptLanguage: 'zh-CN' },
  {
    supportedLocales: ['zh-CN', 'en-US'],
    defaultLocale: 'zh-CN',
    defaultStrategy: 'system', // 或 'application'
    aliases: { en: 'en-US' },
    fallbackLocales: { 'fr-CA': ['fr'] },
  },
);
// → { locale: 'en-US', source: 'url-query', explicit: true }
```

优先级：URL path/query > `locale` Cookie > Accept-Language（q 权重、忽略 q=0、`*` 用默认语言、同权重按出现顺序）> 应用 defaultLocale。显式值非法/不支持/冲突抛 `I18nError`（code：`INVALID_LOCALE` / `UNSUPPORTED_LOCALE` / `LOCALE_CONFLICT` / `DUPLICATE_LOCALE_PARAM`）；失效 Cookie 忽略并继续解析链。

## MessageProvider 契约

```ts
interface MessageProvider {
  load(input: {
    appId: string;
    tenantId?: string;
    locale: string;
    namespaces: string[];
    release: string;
  }): Promise<MessageBundleSet>; // @pactor-app/core 类型
}
```

## ApiMessageProvider（默认入口）

```ts
import { ApiMessageProvider } from '@pactor-app/i18n';

const provider = new ApiMessageProvider({
  endpoint: 'https://language-service.example/v1/i18n/bundles',
  fetch: globalThis.fetch.bind(globalThis),
  headers: { Authorization: 'Bearer ...' }, // 服务端凭据
});
const bundles = await provider.load({ appId, locale, namespaces, release });
```

校验 HTTP 状态与 `Content-Type: application/json`、解析 JSON、校验 envelope（`format: 'simple-v1'` 与协议字段）；支持 ETag/If-None-Match，304 时复用同缓存键的已校验包（`loadWithCacheInfo` 返回 `{ bundleSet, etag, notModified }`）。

## YamlMessageProvider（Node 入口）

```ts
import { readFile } from 'node:fs/promises';
import { YamlMessageProvider } from '@pactor-app/i18n/node';

const provider = new YamlMessageProvider({
  manifest, // 语言包发布清单普通对象（appId/release/locales→namespace→{path, version}）
  readFile: (path) => readFile(join(baseDir, path), 'utf8'),
});
```

严格解析 YAML：语法错误、重复 key、自定义标签、非字符串词条、超出大小/别名展开限制均拒绝；namespace 间完整 key 冲突检查；输出与 API 来源相同的 `MessageBundleSet`。文件路径只取自受信任清单（校验为安全相对路径），不用用户输入拼接。

## TranslatableFieldRegistry（可翻译字段注册表）

按组件 type / 动作名注册可翻译字段路径（支持 `props.text` 与数组通配 `props.columns[*].title` 形态）：

```ts
import { createDefaultTranslatableFieldRegistry } from '@pactor-app/i18n';

const registry = createDefaultTranslatableFieldRegistry();
registry.register('Card', ['props.title', 'props.items[*].label']);
registry.registerAction('notify', 'params.text');
```

内置注册 Button/Text/Input/Table 列/Select 选项的常用展示字段（`text`、`label`、`placeholder`、`description`、`ariaLabel`、`columns[*].title`、`options[*].label`）与 `message`/`confirm` 动作参数。DslLocalizer 只转换注册字段；未注册字段出现 `$i18n` 抛 `UNREGISTERED_I18N_FIELD`。

## localizePageDsl（纯转换入口）

```ts
import { localizePageDsl } from '@pactor-app/i18n';

const schema = localizePageDsl({
  page: authorizedPage, // 作者态 Page DSL（可含顶层 i18n 字段）
  locale: 'en-US',
  defaultLocale: 'zh-CN',
  languageBundles: { current: englishBundleSet, fallbacks: [chineseBundleSet] },
  registry, // 可选，缺省用内置注册表
  onDiagnostic, // 可选，missing-translation / missing-param 诊断
});
```

统一处理 `$i18n.messages`、`$i18n.key` 与字段内 `$i18n{key:default}` 三种声明；查找顺序为 当前 locale → 显式语言级回退（fallbacks 有序）→ defaultLocale → 描述 fallback（简写中的 default）→ key；空字符串视为有效翻译。返回新对象，不修改输入；静态结果输出字符串；含 `${...}` 运行时参数时编译为 `{ $localizedText: { template, params } }`；词条/fallback 含字面量 `${` 抛 `UNSAFE_MESSAGE`。

## localizeYamlResource（Node 入口，YAML 资源编排）

```ts
import { readFile } from 'node:fs/promises';
import { localizeYamlResource, YamlMessageProvider } from '@pactor-app/i18n/node';

const result = await localizeYamlResource({
  loadText: () => readFile('pages/editor.page.yaml', 'utf8'),
  provider, // YamlMessageProvider / ApiMessageProvider 均可
  appId, release, locale, defaultLocale,
  fallbackLocales: ['fr'], // 可选，显式语言级回退
  prune, // 可选，会话裁剪钩子
});
// → { schema: 已本地化 Page DSL, localization: { locale, defaultLocale, release, bundleVersions } }
```

流程：加载文本 → 严格解析（默认 `parsePageYamlStrict`，可注入）→ 作者态校验 → 可选裁剪 → 提取 namespaces → Provider 一次性批量加载当前与回退语言包 → localizePageDsl → 下发态校验。作者态/下发态校验失败抛 `PAGE_DSL_INVALID`，解析失败抛 `PAGE_YAML_INVALID`，加载失败抛 `PAGE_LOAD_FAILED`。
