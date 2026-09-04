# Proposal: support-partial-dsl-structure

## Why

当前 Page DSL 强制要求 `body` 是一棵以 `type: Page` 包裹的组件树，隐含"一份 DSL 文档 = 一个完整页面"的假设。但实际使用中 DSL 经常只描述页面的局部区域（如嵌入宿主页面的一个区块、layout-demo 这类演示页），`body.type: Page` 包装层成为无意义的样板嵌套，也让 DSL 无法自然地表达"局部描述"。

## What Changes

- DSL 文档根结构新增可选 `children: DslNode[]` 字段：声明后 `body` 可省略，渲染时以根 `children` 作为 UI 树（隐式 Fragment 根），不再强制 `Page` 包装节点。
- `body` 与 `children` 的优先级：`body` 存在时优先使用 `body`（向后兼容）；`body` 缺失且 `children` 存在时按局部描述渲染；两者都缺失按空树处理。
- Schema 校验同步放宽：文档不再因 `body` 缺失 `Page` 包装而报错，仅要求 `body` 或 `children` 至少其一（纯数据/逻辑文档除外场景按既有空 body 规则）。
- 示例 `examples/admin/src/pages/layout-demo.page.yaml` 改为根级 `children` 形态。

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `dsl-core-protocol`: Page DSL 根结构类型新增可选 `children` 字段，`body` 从"UI 树根"调整为可选字段，明确 body/children 共存时的优先级语义。
- `dsl-schema-validation`: 校验规则放宽——接受根级 `children` 无 `Page` 包装的文档，并校验 `body` 与 `children` 的互斥优先级。
- `page-runtime`: 页面运行时挂载时，文档缺省 `body` 而含 `children` 时直接以 `children` 渲染。
- `example-admin`: layout-demo 页面示例改为根级 `children` 形态。

## Impact

- `packages/core/src/document.ts`（PageDsl 类型）
- schema 校验包（`packages/schema`）
- 页面运行时/渲染入口（`packages/runtime`、`packages/app`）
- 示例 `examples/admin`
- 文档 `docs/src/content/docs/reference/dsl.md` 及相关 DSL 结构说明

向后兼容：现有 `body: { type: Page, children }` 形态继续有效。
