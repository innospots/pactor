# Tasks: add-resource-module

## 1. 包骨架

- [x] 1.1 创建 `packages/resource`：`pactor-core` workspace:* 唯一依赖、tsconfig、tsup、LICENSE、README；`pnpm install` 成功

## 2. 资源模型与 HttpAdapter（spec: resource-loader）

- [x] 2.1 `types.ts`：DslResourceEnvelope / PageResource / FragmentResource / BootstrapResource 类型与宽容解析函数
- [x] 2.2 `errors.ts`：ResourceError（含 status）
- [x] 2.3 `http-adapter.ts`：结构化 HttpAdapter 接口 + 默认 fetch 实现（非 2xx/304 抛 ResourceError，解析 etag 响应头）

## 3. 缓存（spec: resource-cache）

- [x] 3.1 `MemoryResourceCache`：get/set/delete/clear
- [x] 3.2 版本表管理：updateVersions / 从 bootstrap 提取 pageVersions / `id@version` 键约定 / invalidate(id) 删除全部版本条目

## 4. Loader 实现（spec: resource-loader + resource-cache）

- [x] 4.1 `HttpDslResourceLoader`：baseUrl 配置、三个端点、envelope 解析
- [x] 4.2 缓存集成：命中不发请求、版本失效重载、ETag 条件请求（If-None-Match / 304 复用 / 200 更新）、并发 inflight 去重
- [x] 4.3 `StaticDslLoader`：Map 数据、裸 DSL 包装默认 envelope、未命中抛 ResourceError

## 5. 测试

- [x] 5.1 单测覆盖两个 spec 全部 scenario（mock HttpAdapter，无真实请求）

## 6. 验收与文档

- [x] 6.1 `pnpm -r --if-present build`、`pnpm test`、`pnpm typecheck` 全部通过
- [x] 6.2 文档站新增 `packages/resource.md`，侧边栏与快速开始模块表同步，`pnpm docs:build` 通过
