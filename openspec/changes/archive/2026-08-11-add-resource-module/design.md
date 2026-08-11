# Design: add-resource-module

## Context

pactor-runtime 消费一份 PageDsl；本包解决"DSL 从哪来"（设计文档第 33–36、50–51 节、附录 C）。Runtime API 为 JSON（YAML 是服务端开发格式，浏览器不解析 YAML，第 34 节）。V1 范围：Bootstrap / Page API / Fragment API / Version / Cache（第 98 节）。

约束：

- 零 React 依赖；仅依赖 pactor-core（PageDsl / FragmentDsl / RequiresConfig 等类型）。
- HTTP 必须可替换（结构化 HttpAdapter 接口 + 默认 fetch 实现），便于统一认证与测试。
- 不做 IndexedDB / Browser Cache API 持久化（第 36 节提到 Browser Cache；V1 只做 Memory Cache + ETag，持久缓存留待后续）。

## Goals / Non-Goals

**Goals:**

- Envelope 与资源类型；`DslResourceLoader` 接口（loadPage / loadFragment / loadBootstrap）。
- `HttpDslResourceLoader`（baseUrl、ETag 条件请求）。
- `StaticDslLoader`（Map 数据源）。
- Memory Cache：`id@version` 键、版本失效、invalidate。
- 全 mock 测试。

**Non-Goals:**

- IndexedDbDslLoader / MockDslLoader（StaticDslLoader 已覆盖 mock 场景）、浏览器持久缓存。
- Theme / Capability / Chat config 端点（后续模块）。
- DSL 版本兼容性校验（`requires` vs runtime version）——由 app 组合层在加载后执行。

## Decisions

### D1: Envelope 与资源类型

```ts
interface DslResourceEnvelope<T> {
  id: string;
  resourceType: 'page' | 'fragment' | 'bootstrap' | ...;
  version: number;          // 服务端递增版本号
  dslVersion: string;
  etag?: string;
  requires?: RequiresConfig;
  schema: T;                // PageDsl / FragmentDsl
  updatedAt?: string;
}
type PageResource = DslResourceEnvelope<PageDsl>;
type FragmentResource = DslResourceEnvelope<FragmentDsl>;
```

宽容解析：服务端字段缺失时给默认（resourceType 由端点推断），不强行校验 envelope——DSL 本体校验在 PageRuntime（pactor-schema）。

### D2: Loader 接口

```ts
interface DslResourceLoader {
  loadPage(pageId: string): Promise<PageResource>;
  loadFragment(fragmentId: string): Promise<FragmentResource>;
  loadBootstrap(): Promise<BootstrapResource>;
}
```

`BootstrapResource` 包含 `app` / `user` / `permissions` / `menus` / `pageVersions: Record<string, number>` 等宽松字段（以服务端实际为准定义可选字段）。

### D3: HttpDslResourceLoader + 可替换 HttpAdapter

- `HttpAdapter = (request: { url: string; method?: string; headers?: Record<string,string> }) => Promise<{ status: number; data?: unknown; etag?: string }>`；默认实现基于全局 fetch，非 2xx/304 抛 `ResourceError`（含 status）。
- 端点：`{baseUrl}/pages/{id}`、`{baseUrl}/fragments/{id}`、`{baseUrl}/bootstrap`，baseUrl 默认 `/api/runtime`。
- ETag：缓存命中时请求带 `If-None-Match`；304 返回缓存副本（并刷新内存缓存）。

### D4: Memory Cache 与版本失效

- `MemoryResourceCache`：`get(key)` / `set(key, entry)` / `delete` / `clear`；键为 `id@version`。
- Loader 组合缓存（`CachedDslLoader` 装饰器或内置于 Http loader）：`loadPage(id)` 先查"当前版本表"（来自最近一次 bootstrap 的 `pageVersions`，可选）；有版本号 → 键 `id@version` 命中直接返回；无版本号 → 走 ETag 条件请求或普通 GET 后缓存。
- `invalidate(id)` 删除该 id 全部版本条目；`updateVersions(versions)` 更新版本表（bootstrap 后调用）。

### D5: StaticDslLoader

构造接受 `{ pages?: Record<string, PageDsl | PageResource>, fragments?: ... }`，包装为 envelope（version 默认 1）。用于 examples、单测与本地 DSL 开发。

### D6: 包结构

dependencies 仅 `pactor-core`（workspace:*）。源码：`types.ts`（envelope/资源）、`http-adapter.ts`、`cache/memory-cache.ts`、`loaders/http-loader.ts`、`loaders/static-loader.ts`、`errors.ts`、`index.ts`。

## Risks / Trade-offs

- [版本表依赖 bootstrap，未加载 bootstrap 时版本失效不生效] → 无版本表时退化为 ETag/普通请求，行为正确只是缓存粒度粗；文档注明。
- [Envelope 宽容解析可能掩盖服务端协议错误] → DSL 本体由 PageRuntime 严格校验兜底；envelope 只保证加载层健壮。
- [并发加载同 id 的重复请求] → 内置 inflight 去重（同 key 的进行中 Promise 复用）。

## Migration Plan

无（全新包）。顺序：类型 → HttpAdapter → MemoryCache → HttpLoader（含 ETag/版本/inflight）→ StaticLoader → 测试 → 文档。

## Open Questions

- Browser Cache / IndexedDB 持久化：后续迭代。
- `requires` capability validation 的触发点：pactor-app 组合层。
