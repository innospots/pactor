---
title: "@pactor/resource"
description: 资源模块——DSL 资源 Envelope、HTTP / Static 加载器、id@version 内存缓存与 ETag 条件请求
---

`@pactor/resource` 解决「DSL 从哪来」：定义 Page / Fragment / Bootstrap 的统一资源 Envelope 与加载接口，提供 HTTP 与 Static 两种加载器实现，以及带版本控制、ETag 条件请求与并发去重的内存缓存。

```bash
pnpm add @pactor/resource
```

零 React 依赖，运行时仅依赖 @pactor/core 类型，浏览器 / Node 通用。HTTP 层为可替换的结构化 `HttpAdapter` 接口（默认 fetch 实现），便于统一认证与测试；Envelope 宽容解析（缺省字段给默认值），DSL 本体校验由 PageRuntime（@pactor/schema）负责。

## 资源 Envelope

```ts
import type { DslResourceEnvelope, PageResource } from '@pactor/resource';

interface DslResourceEnvelope<T> {
  id: string;
  resourceType: 'page' | 'fragment' | 'bootstrap' | string;
  version: number;        // 服务端递增版本号，用于缓存键 id@version
  dslVersion: string;
  etag?: string;
  requires?: RequiresConfig;
  schema: T;              // PageDsl / FragmentDsl
  updatedAt?: string;
}
```

`parseEnvelope(raw, { id, resourceType })` 宽容解析服务端响应：字段缺失给默认值（`resourceType` 由端点推断，`version` 默认 1），服务端直接返回裸 DSL（无 `schema` 字段）时整体作为 schema。`BootstrapResource` 字段宽松可选（`app` / `user` / `permissions` / `menus` / `pageVersions` 等），`pageVersions`（pageId → version）用于缓存版本控制。

## HttpDslResourceLoader

```ts
import { HttpDslResourceLoader } from '@pactor/resource';

const loader = new HttpDslResourceLoader({
  baseUrl: '/api/runtime',   // 默认值，可配置
  // adapter: 自定义 HttpAdapter，默认基于全局 fetch
});

const bootstrap = await loader.loadBootstrap(); // 自动用 pageVersions 更新版本表
const page = await loader.loadPage('customer-list');
const fragment = await loader.loadFragment('customer-card');
```

端点为 `{baseUrl}/pages/{id}`、`{baseUrl}/fragments/{id}`、`{baseUrl}/bootstrap`。非 2xx/304 响应抛含 `status` 的 `ResourceError`（默认 fetch 实现在适配器层抛出；自定义 adapter 未抛错时 loader 兜底抛出）。

## 内存缓存与版本控制

```ts
loader.updateVersions({ 'customer-list': 104 }); // 手动更新版本表
loader.invalidate('customer-list');              // 删除该 id 全部版本缓存条目
loader.clear();                                  // 清空缓存与版本表
```

- **缓存键 `id@version`**：版本表来自最近一次 bootstrap 的 `pageVersions`（`loadBootstrap` 后自动更新）或手动 `updateVersions`；命中不发请求直接返回。
- **版本失效**：版本表更新为 N+1 后重新加载并以 `id@N+1` 新键缓存。
- **无版本表时退化**：缓存条目有 etag → 下次请求带 `If-None-Match`，304 返回缓存副本、200 更新缓存；无 etag → 普通缓存直接命中。
- **并发去重**：同一资源的并发加载复用同一个进行中 Promise，不重复发起请求。

`MemoryResourceCache` 可独立使用（`get` / `set` / `delete` / `clear` / `keys`），也可通过 `new HttpDslResourceLoader({ cache })` 注入自有实例以观察缓存内容。当前版本不做 IndexedDB / Browser Cache 持久化。

## StaticDslLoader

```ts
import { StaticDslLoader } from '@pactor/resource';

const loader = new StaticDslLoader({
  pages: { demo: pageDsl },            // 裸 DSL 或完整 envelope
  fragments: { 'demo-card': fragmentDsl },
});

const page = await loader.loadPage('demo'); // 裸 DSL 包装为 version 1 的 envelope
```

查询不存在的 id 抛 `ResourceError`；`loadBootstrap()` 不可用（抛 `ResourceError`）。用于 examples、单测与本地 DSL 开发。

## 自定义 HttpAdapter

```ts
import type { HttpAdapter } from '@pactor/resource';

const adapter: HttpAdapter = async ({ url, method, headers }) => {
  const response = await fetch(url, {
    method,
    headers: { ...headers, Authorization: `Bearer ${token}` }, // 统一认证
  });
  return {
    status: response.status,
    data: response.status === 304 ? undefined : await response.json(),
    etag: response.headers.get('etag') ?? undefined,
  };
};

const loader = new HttpDslResourceLoader({ adapter });
```

:::note
版本表依赖 bootstrap：未加载 bootstrap 且未手动 `updateVersions` 时，版本失效不生效，退化为 ETag / 普通缓存，行为正确只是缓存粒度粗。DSL 版本兼容性校验（`requires` vs runtime version）由上层组合层在加载后执行，不在本包。
:::
