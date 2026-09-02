# Spec: resource-cache

资源缓存与版本控制（`@pactor-app/resource`）：内存缓存、`id@version` 缓存键、版本失效、ETag 条件请求、并发去重。

### Requirement: 内存缓存

`MemoryResourceCache` SHALL 提供 `get` / `set` / `delete` / `clear`，键为字符串（约定 `id@version`）。

#### Scenario: 存取与清除

- **WHEN** set 后 get 同键
- **THEN** 返回该条目；delete/clear 后 get 返回 undefined

### Requirement: 缓存命中的加载

带缓存的 loader（CachedDslLoader 或内置缓存的 Http loader）SHALL 在缓存命中时不发请求直接返回缓存资源。

#### Scenario: 二次加载命中缓存

- **WHEN** loadPage 成功后再次 loadPage 同 id（版本未变）
- **THEN** HttpAdapter 仅被调用一次，两次返回内容一致

### Requirement: 版本失效

SHALL 支持版本表（`updateVersions` 或 bootstrap 自动更新）：版本号为 N 的资源以 `id@N` 缓存；版本表更新为 N+1 后 MUST 重新加载并以新键缓存。`invalidate(id)` MUST 删除该 id 的全部缓存条目。

#### Scenario: 版本变化重新加载

- **WHEN** customer-list@103 已缓存，版本表更新为 104 后 loadPage
- **THEN** 发起新请求并以 customer-list@104 缓存

#### Scenario: invalidate

- **WHEN** 缓存两个版本条目后 invalidate(id)
- **THEN** 后续 loadPage 重新请求

### Requirement: ETag 条件请求

缓存条目含 etag 时，后续请求 SHALL 携带 `If-None-Match`；服务端返回 304 时 MUST 返回缓存副本且不视为错误。

#### Scenario: 304 复用缓存

- **WHEN** 缓存条目 etag 为 'v1'，请求返回 304
- **THEN** loadPage 返回缓存资源，adapter 收到的请求头含 `If-None-Match: v1`

#### Scenario: 200 更新缓存

- **WHEN** 条件请求返回 200 与新 etag
- **THEN** 返回新资源并更新缓存

### Requirement: 并发去重

同一资源的并发加载 MUST 复用同一个进行中请求，不重复发起。

#### Scenario: 并发 loadPage

- **WHEN** 缓存未命中时并发调用 loadPage('a') 两次
- **THEN** HttpAdapter 仅被调用一次，两个 Promise 都解析为同一资源
