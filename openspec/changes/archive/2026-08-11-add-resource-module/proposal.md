# Proposal: add-resource-module

## Why

框架的核心价值是"页面 DSL 不随前端打包，经 API 动态加载"（设计文档第 1、33–36 节）。pactor-runtime 能运行一份已到手的 PageDsl，但还没有"从哪里拿 DSL"的一层：HTTP 加载、缓存、版本控制。本变更落地 `pactor-resource`——Page / Fragment / Bootstrap 资源的统一加载层（V1 Resource 范围：Bootstrap、Page API、Fragment API、Version、Cache，第 98 节）。

## What Changes

- 新增 `pactor-resource` 包（`packages/resource`），依赖 `pactor-core`；零 React 依赖，纯 TypeScript，浏览器/Node 均可用。
- **资源模型**：DSL Resource Envelope 类型（附录 C：`id` / `resourceType` / `version` / `dslVersion` / `etag` / `requires` / `schema`），`PageResource` / `FragmentResource` / `BootstrapResource` 类型。
- **Loader 接口与实现**（第 35 节）：
  - `DslResourceLoader` 统一接口（loadPage / loadFragment / loadBootstrap）。
  - `HttpDslResourceLoader`：经可替换的 HttpAdapter（结构化接口，默认 fetch 实现）访问 `/api/runtime/pages/{id}` 等端点，支持 baseUrl 配置。
  - `StaticDslLoader`：内存 Map 提供资源，供本地开发与测试。
- **缓存与版本控制**（第 36 节）：Memory Cache，缓存键 `id@version`；bootstrap 返回版本表后按版本失效；ETag 条件请求（If-None-Match / 304 复用缓存）；`invalidate(id)` 手动失效。
- 单元测试（mock HttpAdapter，不发真实请求）。
- 文档站新增 pactor-resource 模块页。

## Capabilities

### New Capabilities

- `resource-loader`: 资源 Envelope 模型、DslResourceLoader 接口、HTTP / Static 实现、Bootstrap 加载。
- `resource-cache`: 内存缓存、`id@version` 缓存键、版本失效、ETag 条件请求。

### Modified Capabilities

（无。）

## Impact

- **新增代码**：`packages/resource`，依赖仅 `pactor-core`。
- **不修改**既有包；与 pactor-runtime 的集成（HttpDslLoader → PageRuntime）由后续 pactor-app 组合层完成。
- **后续模块**：pactor-router（按 pageId 触发加载）、pactor-app（bootstrap 编排）。
