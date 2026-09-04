# Tasks: allow-mixed-children-refs

## 1. 核心类型（@pactor-app/core）

- [x] 1.1 新增 `DslChildrenItem = DslNode | DslSourceRef`；`DslChildren` 改为 `DslChildrenItem[] | DslSourceRef`；`resolveRootNodes` 返回类型放宽为 `DslChildrenItem[]`（数组含引用元素时原样返回）
- [x] 1.2 单测：混排数组类型与 resolveRootNodes 行为

## 2. Schema（@pactor-app/schema）

- [x] 2.1 children 数组 items 改为 `anyOf: [DslNode, DslSourceRef]`（节点级与根级共用 dslChildrenSchema）
- [x] 2.2 `validateDslNodes` 数组元素接受节点或引用两种形态
- [x] 2.3 单测：混排通过与非法元素拒绝

## 3. 渲染（@pactor-app/runtime）

- [x] 3.1 `renderChildrenOf`：数组元素为引用时逐项渲染 DslSourceBoundary（key 用 `dslSourceKey`，结果按 DslNode[] 展开）
- [x] 3.2 渲染入口 `renderRoots`：根级 children 数组中引用元素渲染边界；附加子树挂最后一个节点根
- [x] 3.3 单测：混排顺序渲染、单引用失败不影响其他元素、根级混排

## 4. 消费方适配

- [x] 4.1 chat `guardChatDsl`：数组中引用元素替换为受控占位（deniedType `(remote)`），内联元素照常递归；补单测
- [x] 4.2 ui `Layout`：方向推导跳过引用元素
- [x] 4.3 cli `walkDslTree`：跳过引用元素递归；inspect 将数组引用元素计入 `source(service|http)`

## 5. 文档与示例

- [x] 5.1 `docs/reference/dsl.md` 动态引用章节：补"children 混排"说明与示例（替代"绕道 components"的说法）
- [x] 5.2 next-app-example `/remote-demo` 改为混排演示（内联节点 + 引用元素并存于同一 children）

## 6. 全量验证

- [x] 6.1 `pnpm build && pnpm typecheck && pnpm test` 全绿
- [x] 6.2 `pnpm docs:build` 通过；浏览器核验 `/remote-demo` 混排渲染

## 7. 归档前置

- [ ] 7.1 先归档 `add-dynamic-dsl-loading`（其 delta 合入主线后，本变更的 MODIFIED 目标才存在），再归档本变更
