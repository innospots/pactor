# Tasks: support-partial-dsl-structure

## 1. 核心类型（@pactor-app/core）

- [x] 1.1 `packages/core/src/document.ts`：`PageDsl` 新增 `children?: DslNode[]`（含注释说明与 `body` 的优先级语义）
- [x] 1.2 新增并导出 `resolveRootNodes(pageDsl): DslNode[]`（body 优先 → `[body]`；否则 `children ?? []`），并自 `packages/core/src/index.ts` 导出
- [x] 1.3 单测：body 优先、仅 children、两者皆空、两者共存 四种形态

## 2. Schema 校验（@pactor-app/schema）

- [x] 2.1 Page DSL 根结构 JSON Schema 增加根级 `children`（DslNode 数组，复用 DslNode 递归 Schema）
- [x] 2.2 `body` 与 `children` 共存时输出 warning（不阻断校验）
- [x] 2.3 单测：children 形态通过、children 内非法节点报错路径正确、共存 warning

## 3. 运行时渲染（@pactor-app/runtime）

- [x] 3.1 `page-runtime.tsx`：`render()` 与 `PageRuntimeView` 改用 `resolveRootNodes`，逐个渲染子节点（React Fragment 归并，共享同一 context/engine），空树渲染 null
- [x] 3.2 单测：根级 children 多节点按序渲染且共享 state 作用域；body 优先；空树不抛错

## 4. CLI 兼容（@pactor-app/cli）

- [x] 4.1 `inspect` / `lint` 的树遍历改为 `resolveRootNodes` 同语义的 `walkPageTrees`，支持无 body 文档
- [x] 4.2 lint 对 body/children 共存输出提示（body-children-conflict warning）

## 5. 示例与文档

- [x] 5.1 `examples/admin/src/pages/layout-demo.page.yaml` 改写为根级 `children` 形态（移除 `body` 与 Page 包装），`node packages/cli/dist/cli.js validate` 通过
- [x] 5.2 更新 `docs/src/content/docs/reference/dsl.md`：根结构新增 `children` 字段说明与局部描述示例，明确 body/children 优先级

## 6. 全量验证

- [x] 6.1 `pnpm build && pnpm typecheck && pnpm test` 全绿
- [x] 6.2 `pnpm docs:build` 通过；admin 示例中 layout-demo 页面功能人工/截图核验
