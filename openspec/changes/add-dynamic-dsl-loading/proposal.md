# Proposal: add-dynamic-dsl-loading

## Why

当前 DSL 的所有结构（页面本体、组件树、命名组件）都必须是**静态内联**的：要么 YAML 文件全量下发，要么 `PactorPage page` 直接传完整对象。真实场景中页面往往是"服务端按需下发片段"——如列表行点击后加载的详情子树、按权限/角色下发的差异化区块、大页面拆片按需加载。需要一种声明式机制，让 DSL 的各个位置能以 `service` / `http` 动态引用远端 DSL 内容。

## What Changes

- 新增 **`DslSourceRef`**（动态 DSL 引用）类型：`{ source: { type: 'service', service, params? } | { type: 'http', request } }`，复用运行时已有的 ServiceRegistry / HttpAdapter 通道拉取 DSL 内容（PageDsl / DslNode / DslNode[]）。
- 四个位置支持 `DslSourceRef`：
  1. **`PactorPage` 的 `page` prop**：`PageDsl | DslSourceRef`（引用形式先加载再创建运行时）；
  2. **DSL 根级 `children`**：`DslNode[] | DslSourceRef`；
  3. **组件节点的 `children`**：`DslNode[] | DslSourceRef`（子树远端加载，渲染时异步解析）；
  4. **页面级 `components` 的每个命名组件**：`DslNode | DslSourceRef`（引用处渲染时惰性解析）。
- 渲染语义：引用解析期间渲染加载占位（可配置），失败按"表达式错误不击穿渲染层"原则告警并渲染空；解析结果按页面运行时缓存（同一引用不重复请求）。
- Schema 校验同步支持上述位置的引用形态。

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `dsl-core-protocol`: 新增 `DslSourceRef` 类型；`DslNode.children`、Page DSL 根级 `children`、`components` 值拓宽为可含 `DslSourceRef`。
- `dsl-schema-validation`: `children`（节点级与根级）与 `components` 值接受 source 引用形态；引用形态本身按结构校验（service 形态必填 `service`，http 形态必填 `request.url`）。
- `dsl-renderer`: 渲染器遇到 source 引用的 children / 命名组件时经运行时异步解析，加载中与失败时按约定渲染，解析结果按运行时缓存复用。
- `page-runtime`: 根级 `children` 为 source 引用时，运行时渲染入口异步解析后渲染。
- `embedded-page-view`: `PactorPage` 的 `page` prop 支持 `DslSourceRef`，加载失败走既有 onError/错误态。

## Impact

- `packages/core`（类型）、`packages/schema`（校验）、`packages/runtime`（渲染器 + 运行时解析/缓存）、`packages/app`（PactorPage props）
- 文档 `docs/src/content/docs/reference/dsl.md`、嵌入模式相关文档
- 向后兼容：所有现有静态形态不变；引用形态为纯增量
