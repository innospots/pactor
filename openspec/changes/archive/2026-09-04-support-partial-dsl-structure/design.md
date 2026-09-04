# Design: support-partial-dsl-structure

## Context

当前 Page DSL 的 UI 树必须挂在 `body: DslNode` 上，且约定俗成以 `type: Page` 包装（示例页均如此）。渲染入口在 `packages/runtime/src/page/page-runtime.tsx`（`render()` 与 `PageRuntimeView`，两处都直接读 `pageDsl.body`），类型定义在 `packages/core/src/document.ts`（`PageDsl.body?: DslNode`），schema 校验在 `packages/schema`，CLI 的 `inspect`/`lint` 也会遍历 `data.body`。

DSL 作为"页面局部描述"使用时（嵌入区块、演示页），`Page` 包装节点是纯样板，无语义价值。

## Goals / Non-Goals

**Goals:**
- 根级 `children: DslNode[]` 作为 `body` 的替代形态：DSL 文档可以直接描述一段 UI 片段，无需任何包装节点。
- 向后兼容：现有 `body: { type: Page, children }` 文档行为完全不变。
- 渲染、校验、CLI 遍历三处对两种形态一致支持。

**Non-Goals:**
- 不改变 `page` 元信息字段的必填性（局部描述仍可按需声明 page meta，缺失校验规则保持不变）。
- 不引入新的"片段文档类型"（如改造 `FragmentDsl`）——本变更只放宽 Page DSL 根结构。
- 不改变 `component` 引用节点（页面级 `components` 复用）的既有语义。

## Decisions

### D1: 新增根级 `children`，而非让 `body` 接受数组

`PageDsl` 增加 `children?: DslNode[]`，`body` 保持 `DslNode | undefined`。
- 备选方案 A：`body?: DslNode | DslNode[]`。放弃——`body` 既有类型签名遍布 runtime/CLI/测试，联合类型会污染所有消费点。
- 备选方案 B：强制用页面级 `components` + `component` 引用表达片段。放弃——这正是用户想消除的间接层。

### D2: 优先级与冲突规则

- `body` 存在 → 使用 `body`，忽略根级 `children`（schema 校验给出 warning，不算错误）。
- `body` 缺失、`children` 存在 → 以 `children` 作为 UI 树。
- 两者都缺失 → 与现状一致，渲染 `null`（空树）。

### D3: 渲染层不引入新节点类型

runtime 渲染根级 `children` 时，直接对每个子节点各渲染一个 `DslRenderer`（共享同一 context/engine），外层用 React Fragment 归并——不新增 `__Root__` 之类的合成节点类型，避免渲染器组件表和校验规则增加特殊分支。实现收敛为一个工具函数：

```ts
// packages/core 或 runtime：导出供 runtime 与 CLI 共用
resolveRootNodes(pageDsl): DslNode[]  // body 存在 → [body]；否则 children ?? []
```

CLI `inspect`/`lint` 的 `walkDslTree(data.body ...)` 改为遍历 `resolveRootNodes(data)`。

### D4: Schema 校验

- 根级 `children`：数组、每项递归按 DslNode 规则校验（type 必填、events/permission 形态等，复用现有 body 的校验函数）。
- `body` 与 `children` 同时存在 → warning（lint 级别），不阻断加载。
- 不再有任何"body 必须以 Page 包装"的隐含预期（本来校验也未强制，仅示例约定）。

## Risks / Trade-offs

- [同一文档同时写 `body` 和 `children`，`children` 被静默忽略，作者不易察觉] → schema 校验输出 warning，CLI lint 同样提示。
- [第三方工具按"必有 body"解析文档会漏掉 children 形态] → `resolveRootNodes` 从 core 导出作为官方读取入口，文档中明确推荐使用。

## Migration Plan

纯增量能力，无迁移负担。示例页 `layout-demo.page.yaml` 改写为新形态作为示范；其余示例保持 `body` 形态以验证兼容性。

## Open Questions

（无）
