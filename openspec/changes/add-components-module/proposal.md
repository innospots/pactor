# Proposal: add-components-module

## Why

`pactor-runtime` 已提供 Renderer 与 ComponentRegistry，但 Registry 里还没有任何组件——DSL 页面目前无法真正渲染。按路线图，本变更落地 `pactor-components`：设计文档第 13/77/98 节定义的 V1 Level 1 基础组件集，经 antd 适配层封装（第 14 节：DSL 不直接暴露 Ant Design API），注册即可用。

## What Changes

- 新增 `pactor-components` 包（`packages/components`），依赖 pactor-core / pactor-runtime；peerDependencies `react >=18`、`antd >=5`。
- 实现 V1 基础组件（第 98 节 Component 清单中的非 Overlay 部分）：**Page、Grid、Flex、Card、Button、Alert、Statistic、Tabs、Table、Form、Input、Select**。
  - Modal / Drawer 归后续 pactor-interaction（Overlay Runtime）；Markdown 归后续 pactor-markdown。
- 每个组件为 **DSL 友好 props → antd props** 的适配器（如 `variant: primary` → `type="primary"`），并规范化事件值（如 Input 的 onChange 直接给 `value` 而非原生 event）。
- Form 容器协同：Form 内的 Input/Select 自动包装为表单项（`name` / `label` / `rules`），提交时经 `onSubmit` 事件给出 values，并写入 `form` 作用域。
- Table 支持列定义（`title` / `dataIndex` / `width`）与可选 `cell` 子模板——经 Renderer 子作用域机制以 `row` / `rowIndex` 渲染。
- 提供 `registerBuiltinComponents(registry)` 与 `createBuiltinComponentRegistry()` 注册入口。
- 组件测试（Vitest + Testing Library + jsdom + antd）。
- 文档站新增 pactor-components 模块页。

## Capabilities

### New Capabilities

- `builtin-components`: V1 基础组件目录与 antd 适配约定——DSL props 规范化、事件值规范化、注册入口。
- `form-container`: Form 容器协同——字段自动包装、校验规则、提交事件、form 作用域。
- `table-component`: Table 组件——列定义、数据绑定、`cell` 行模板与 row/rowIndex 子作用域。

### Modified Capabilities

（无。）

## Impact

- **新增代码**：`packages/components`。
- **新依赖**：peerDependencies `react >=18`、`antd >=5`；devDependencies 增加 `antd`、`@ant-design/icons`（如需）、既有 react 测试栈。
- **对接口的要求**：依赖 pactor-runtime 的 Renderer 子作用域机制（`renderChildren(children, { row, rowIndex })`）——已在 add-runtime-module 落地。
- **后续模块**：pactor-interaction（Modal/Drawer/Confirm）、pactor-layout（消费 Page/Menu 等）。
