# Proposal: allow-mixed-children-refs

## Why

`children` 目前是 `DslNode[] | DslSourceRef` 二选一：一处 children 要么全内联、要么整体远端。实际排版中常见"部分内联 + 部分远端"（如静态标题区 + 两个远端下发的区块并排），现在必须绕道 `components` + `component` 引用，为一次性内容强制起名，增加了不必要的间接层。

## What Changes

- `children`（节点级与 Page DSL 根级）数组元素类型放宽为 `DslNode | DslSourceRef`——内联节点与动态引用可任意混排，各自独立解析渲染（每个引用项独立的占位/失败边界与缓存 key）。
- 整体引用形态（`children: { source }`）继续保留，语义不变（向后兼容）。
- `resolveRootNodes` 返回类型同步放宽为 `(DslNode | DslSourceRef)[]`。
- Schema 校验：children 数组元素接受节点或引用形态。
- 消费方适配：renderer 逐元素渲染（引用项经 DslSourceBoundary）；chat 白名单守卫拒绝数组中的引用项（替换为受控占位）；Layout 方向推导跳过引用项；CLI 遍历跳过引用项并在 inspect 中标记。

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `dsl-core-protocol`: `DslChildren` 数组元素放宽为 `DslNode | DslSourceRef`；`resolveRootNodes` 返回类型同步放宽。
- `dsl-schema-validation`: children 数组元素接受节点或引用；`validateDslNodes` 逐元素支持两种形态。
- `dsl-renderer`: 渲染器对 children 数组中的引用项逐个经 DslSourceBoundary 解析渲染。
- `page-runtime`: 渲染入口支持根级 children 数组中混排引用项。
- `chat-safe-registry`: 白名单守卫拒绝 children 数组中的动态引用项。
- `layout-components`: Layout 方向推导跳过引用项。
- `dsl-cli`: 树遍历跳过引用项，inspect 标记数组中的引用项。

## Impact

- `packages/core`（类型）、`packages/schema`（校验）、`packages/runtime`（渲染器/渲染入口）、`packages/chat`（守卫）、`packages/ui`（Layout）、`packages/cli`（遍历/inspect）
- 文档 `docs/src/content/docs/reference/dsl.md`、next-app-example 演示页
- 向后兼容：既有"纯数组"与"整体引用"形态行为完全不变
