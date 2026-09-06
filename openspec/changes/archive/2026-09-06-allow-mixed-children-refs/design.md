# Design: allow-mixed-children-refs

## Context

上一变更（add-dynamic-dsl-loading）引入了 `children: DslNode[] | DslSourceRef` 二选一形态，消费方按"整体判引用"处理。本变更把数组元素放宽为 `DslNode | DslSourceRef`，整体引用形态保留。

## Goals / Non-Goals

**Goals:**
- children 数组内联节点与动态引用任意混排，渲染顺序与声明一致。
- 每个引用项独立解析（独立 placeholder / 失败降级 / 缓存），互不影响。
- 所有 children 消费方行为明确且无破坏性变更。

**Non-Goals:**
- 不改变整体引用形态（`children: { source }`）的语义。
- 不改变 placeholder / 缓存 / 一次性求值等既有引用语义。
- 不支持 props 内嵌 DSL 子树之外的引用位置（仅 children）。

## Decisions

### D1: 类型形态

```ts
export type DslChildrenItem = DslNode | DslSourceRef;
export type DslChildren = DslChildrenItem[] | DslSourceRef;
```

- 备选：只保留混排数组、废弃整体引用形态。放弃——破坏刚发布的兼容契约，且整体引用对"整段远端下发"更简洁。
- 元素判型沿用 `isDslSourceRef`（含 `source` 字段即引用），节点与引用结构互斥，无歧义。

### D2: 渲染层逐元素边界

`renderChildrenOf` 对数组逐个处理：DslNode 走原 `renderNode`；`DslSourceRef` 渲染 `<DslSourceBoundary key=dslSourceKey(ref)>`，解析结果按 DslNode[] 展开（与整体引用语义一致——引用内容即"若干个子树节点"）。引用项的 key 用 `dslSourceKey`，避免与节点 id/index 冲突。

根级 children（renderRoots / PageRuntimeView）同理：数组逐项，引用项渲染边界；附加子树（OverlayHost 的 children）仍挂最后一个**节点**根的 DslRenderer 内。

### D3: resolveRootNodes 放宽

返回 `(DslNode | DslSourceRef)[]`：body 存在 → `[body]`；根级 children 为数组 → 原样返回（元素可为引用）；整体引用或缺失 → `[]`（整体引用仍由渲染入口的边界处理）。CLI 遍历方自行跳过引用元素。

### D4: 各消费方策略

| 消费方 | 策略 |
| --- | --- |
| schema | children 数组 items 改为 `anyOf: [DslNode, DslSourceRef]`；`validateDslNodes` 逐元素接受两种形态 |
| renderer / page-runtime | 见 D2 |
| chat 守卫 | 数组中引用项替换为 `ChatDenied` 占位（deniedType `'(remote)'`），内联节点照常递归 |
| Layout 方向推导 | 引用项跳过（无法静态判定是否为 Sider），仅按内联项推导 |
| CLI walkDslTree / walkPageTrees | 遇引用元素跳过递归；inspect 对引用元素计入 `source(service\|http)` |

## Risks / Trade-offs

- [数组中出现引用项导致工具链漏判] → 所有遍历收口在 `walkDslTree`/`renderChildrenOf`/`resolveRootNodes` 三处，统一处理。
- [引用项与节点混排时 React key 稳定性] → 引用项 key 取 `dslSourceKey`，节点取 `id ?? index`，冲突概率忽略（key 仅 React 内部协调）。

## Migration Plan

纯增量。既有 DSL 无需改动。

## Open Questions

（无）
