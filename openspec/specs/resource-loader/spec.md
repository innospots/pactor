# Spec: resource-loader

DSL 资源模型与加载器（`pactor-resource`）：Page / Fragment / Bootstrap 的统一加载接口与 HTTP、Static 实现。

### Requirement: 资源 Envelope 模型

SHALL 定义 `DslResourceEnvelope<T>`（`id` / `resourceType` / `version` / `dslVersion` / `etag?` / `requires?` / `schema` / `updatedAt?`）及 `PageResource` / `FragmentResource` / `BootstrapResource` 类型，与附录 C 一致。解析 MUST 宽容：envelope 字段缺失时给默认值（resourceType 由端点推断），DSL 本体校验留给 PageRuntime。

#### Scenario: 完整 envelope 解析

- **WHEN** 服务端返回完整 page envelope JSON
- **THEN** 解析为 PageResource，各字段可访问

#### Scenario: 宽容缺省

- **WHEN** 服务端返回缺少 `etag` / `updatedAt` 的 envelope
- **THEN** 正常解析，缺失字段为 undefined

### Requirement: DslResourceLoader 接口

SHALL 定义统一接口：`loadPage(pageId)` / `loadFragment(fragmentId)` / `loadBootstrap()`，返回对应资源 Promise。

#### Scenario: 接口多实现

- **WHEN** 以同一接口使用 Http 与 Static 两种 loader
- **THEN** 调用方代码无需区分实现

### Requirement: HttpDslResourceLoader

SHALL 经结构化 HttpAdapter（默认 fetch 实现）访问端点 `{baseUrl}/pages/{id}`、`{baseUrl}/fragments/{id}`、`{baseUrl}/bootstrap`，baseUrl 默认 `/api/runtime`、可配置。非 2xx/304 响应 MUST 抛含 status 的 `ResourceError`。

#### Scenario: 加载页面资源

- **WHEN** mock adapter 对 `/api/runtime/pages/customer-list` 返回 200 与 envelope
- **THEN** loadPage('customer-list') 解析返回该资源

#### Scenario: 404 抛 ResourceError

- **WHEN** adapter 返回 404
- **THEN** 抛出 ResourceError 且 status 为 404

#### Scenario: 自定义 baseUrl

- **WHEN** 配置 baseUrl 为 `/custom/runtime`
- **THEN** 请求 URL 以 `/custom/runtime/pages/` 开头

### Requirement: Bootstrap 加载

`loadBootstrap()` SHALL 返回 Bootstrap 资源，包含可选的 `app` / `user` / `permissions` / `menus` / `pageVersions` 等字段；`pageVersions`（pageId → version）用于缓存版本控制。

#### Scenario: bootstrap 返回版本表

- **WHEN** bootstrap 响应含 `pageVersions: { 'customer-list': 103 }`
- **THEN** 资源中可读取该映射

### Requirement: StaticDslLoader

SHALL 从构造时传入的 Map 数据返回资源：`{ pages, fragments }` 接受 PageDsl/FragmentDsl 或完整 envelope；裸 DSL 包装为默认 envelope（version 1）。查询不存在的 id MUST 抛 ResourceError。

#### Scenario: 裸 DSL 包装

- **WHEN** 以 `{ pages: { demo: pageDsl } }` 构造并 loadPage('demo')
- **THEN** 返回 envelope，schema 为该 DSL，version 为 1

#### Scenario: 未命中抛错

- **WHEN** loadPage('missing')
- **THEN** 抛 ResourceError
