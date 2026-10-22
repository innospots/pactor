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
