# Design: add-dynamic-dsl-loading

## Context

DSL 目前全静态内联。运行时已有两条动态通道可复用：`RuntimeContext.services`（ServiceRegistry，页面 service 数据源同款）与 `RuntimeContext.http`（HttpAdapter，http 数据源同款）。DataStore 已示范了"按类型分派 + 作用域求值 params + 错误不击穿渲染层"的成熟模式（`packages/runtime/src/datasource/data-store.ts`）。

四个目标位置的现状：
- `PactorPage` 的 `page` prop：`PageDsl`（`packages/app/src/embedded.tsx`，创建运行时前已是 async 流程）
- 根级 `children`：`DslNode[]`（上次变更刚加入，`resolveRootNodes` 读取）
- 节点级 `children`：`DslNode[]`，渲染器同步递归（`renderChildrenOf`）
- `components` 值：`DslNode`，引用节点渲染时同步查表（`context.pageComponents`）

## Goals / Non-Goals

**Goals:**
- 统一的 `DslSourceRef` 类型覆盖上述四个位置，复用 services / http 通道。
- 渲染期异步解析带加载占位与失败降级，不击穿渲染层。
- 同一引用（结构等值）在一个页面运行时内只请求一次。
- 加载到的 DSL 内容经 Schema 校验后才进入渲染/运行时。

**Non-Goals:**
- 不做引用的表达式动态参数重载（params 含表达式时按**首次解析时**的作用域求值一次，不随 state 变化自动重拉；需要重拉的场景用 dataSources + 事件动作，不在本期）。
- 不支持 `computed` / `resource` 类型引用。
- 不引入 Suspense（运行时需兼容 React 18+ 语义且保持现有订阅模型，自管状态即可）。

## Decisions

### D1: 引用类型 `DslSourceRef`

```ts
export interface DslSourceRef {
  source:
    | { type: 'service'; service: string; params?: Record<string, unknown> }
    | { type: 'http'; request: { method?; url: string; params?; headers? } };
  /** 解析期间渲染的占位子树（可选，缺省渲染空） */
  placeholder?: DslNode;
}
```

- 备选 A：直接复用 `DataSourceConfig`。放弃——它带 `autoLoad`/`pagination` 等数据源专属语义，且顶层形态是 Record 而非内联引用。
- 备选 B：在 DslNode 上加 `source` 字段（节点即引用）。放弃——与"位置即引用"的统一性冲突，且污染节点类型。
- `placeholder` 为 DSL 原生占位方案，避免在 UI 无关的 runtime 里硬编码 Spinner 组件名。

### D2: 运行时解析器 `DslSourceResolver`（@pactor-app/runtime）

挂到 `RuntimeContext.dslSources`：
- `resolve(ref): Promise<unknown>`——按 `ref.source.type` 分派 services/http（params 经 `resolveDeep` 以当前作用域求值一次）；
- **缓存**：key 为 `JSON.stringify(ref.source)`（解析前的引用原文），Map 存 Promise，天然去重 + 失败也缓存（失败经 `invalidate(ref)` 或运行时销毁清理，MVP 不做 LRU）；
- 返回值由消费方校验形态（见 D4）。

### D3: 渲染期解析——`useResolvedDsl(ref)` hook（renderer 内）

渲染器遇到引用位置时渲染 `<DslSourceBoundary ref={...}>`（renderer 内部组件，非 DSL 组件类型）：
- `useState` + `useEffect` 调 `context.dslSources.resolve`，loading → 渲染 `ref.placeholder ?? null`；成功 → 按位置语义渲染结果（DslNode[] 逐个 `renderNode`，DslNode 单个渲染）；失败 → `console.warn` + 渲染空。
- 该组件经 `useRenderer()` 拿 context，沿用现有订阅模型，不引入新上下文。

### D4: 各位置接入点

| 位置 | 接入方式 |
| --- | --- |
| `PactorPage page` | `page?: PageDsl \| DslSourceRef`；EmbeddedPage 现有 async 流程中先 `resolve` → `validatePageDsl` 后再创建运行时，失败走既有 error 态 + onError |
| 根级 `children` | `PageDsl.children: DslNode[] \| DslSourceRef`；`resolveRootNodes` 保持同步签名只返回静态形态；渲染入口（`render()`/`PageRuntimeView`）对引用形态渲染 `DslSourceBoundary`（结果应为 DslNode[]） |
| 节点级 `children` | `DslNodeBase.children: DslNode[] \| DslSourceRef`；`renderChildrenOf` 遇引用形态返回 `<DslSourceBoundary>`（结果应为 DslNode[]） |
| `components` 值 | `PageDsl.components: Record<string, DslNode \| DslSourceRef>`；引用节点解析到引用形态时渲染 `DslSourceBoundary`（结果应为 DslNode），命中后相当于替换子树 |

加载结果校验：PageDsl 走 `validatePageDsl`；DslNode/DslNode[] 走 `@pactor-app/schema` 的 `dslNodeSchema`（新增导出一个 `validateDslNode` / `validateDslNodes` 便利函数）。校验失败按失败处理（warn + 空 / error 态）。

### D5: CLI / 工具链兼容

`walkDslTree` / `walkPageTrees` 遇到引用形态的 `children` 跳过递归（无内联子树可遍历），lint 表达式检查仍覆盖 ref 内 params 的字符串。inspect 输出标记 `source(service|http)`。

## Risks / Trade-offs

- [引用 params 只按首次作用域求值，用户误以为会像 dataSources 一样联动] → 文档明确"引用是**一次性加载**"，联动重载用 dataSources。
- [远端下发错误形态导致渲染崩溃] → 加载结果先 Schema 校验，失败降级为空 + warn。
- [缓存 key 用 JSON.stringify，字段顺序不同的等值引用会重复请求] → 可接受（key 构建按固定字段序拼接 source.type/service/url 缓解）；真正重复代价低。
- [循环引用（远端子树再引用自身所在命名组件）] → 沿用现有 `referenceStack` 守卫（渲染期命中即断链告警）。

## Migration Plan

纯增量，无迁移。现有全部静态形态行为不变。

## Open Questions

（无）
