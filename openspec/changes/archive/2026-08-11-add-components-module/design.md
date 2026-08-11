# Design: add-components-module

## Context

pactor-runtime 的 Renderer 已支持：Registry 查找、props 深度表达式解析、events 绑定（`events.onChange` → prop `onChange`）、`renderChildren(children, extraScope)` 子作用域。本变更在其上实现 V1 基础组件（设计文档第 13、77、98 节），经 antd 适配层封装（第 14 节：DSL 只暴露框架级 props，不暴露 antd 原生 API）。

约束：

- DSL props 是框架协议（如 `variant`），适配器负责映射到 antd props；**禁止把 antd props 原样透传为 DSL 协议**。
- 事件值规范化：Renderer 把 `events.onChange` 绑定为 prop `onChange`，组件适配器调用时必须给出 DSL 层有意义的值（Input 给 `value` 而非原生 event），使 `${event}` 作用域之外的动作参数保持简洁。注意：Renderer 会把事件处理器传入的值放入 `event` 作用域（如 `${event}` 即 onChange 的值）。
- React >= 18、antd >= 5 为 peer dependency。

## Goals / Non-Goals

**Goals:**

- 12 个 V1 组件：Page、Grid、Flex、Card、Button、Alert、Statistic、Tabs、Table、Form、Input、Select。
- 统一的适配约定（props 映射、事件规范化、children 渲染）。
- Form 容器协同与 Table 行模板。
- `registerBuiltinComponents(registry)` / `createBuiltinComponentRegistry()`。
- jsdom 组件测试。

**Non-Goals:**

- Modal / Drawer / Confirm / Popover（pactor-interaction）、Markdown（pactor-markdown）、Chart、Level 2 企业组件（SearchForm/CrudTable 等）。
- 不做组件 props 的 JSON Schema 逐组件校验。
- 不做主题定制（pactor-theme）。
- DatePicker、Upload、Tree 等非 V1 清单组件。

## Decisions

### D1: 组件 = DSL props 接口 + antd 适配器

每个组件目录结构（示意）：`Button/index.tsx` 导出 `ButtonAdapter({ text, variant, danger, size, loading, disabled, onClick, children })` → 渲染 `<AntButton type={variantMap[variant]} ...>`。props 映射表集中在组件文件内，不抽象通用映射层（12 个组件各不相同，过早抽象反而难读）。

### D2: 事件值规范化

- Input：`onChange(value: string)`（内部 `e.target.value`）。
- Select：`onChange(value)`。
- Form：`onSubmit(values)`（内部 `onFinish`）；`onValuesChange?(changed, values)` 可选。
- Table：`onChange(pagination)`（分页变化）；行操作经 cell 模板内的 Button 等组件自身事件。
- 组件 props 类型显式声明这些回调签名，与 Renderer 的事件绑定（值进 `event` 作用域）对齐。

### D3: Form 容器协同经 React Context 探测

- `Form` 组件创建 antd Form 实例并通过 React Context 下发 `{ form, inForm: true }`。
- `Input` / `Select` 检测到 Form 上下文且自身声明了 `name` 时，自动包装为 `<Form.Item name label rules>`；不在 Form 内或无 `name` 时渲染独立控件（受控值来自 props.value，onChange 仅触发事件）。
- 提交：Form 渲染一个可选的提交按钮区域由 DSL 自行放置 Button（`htmlType: submit` 通过 `submit: true` DSL prop 表达）；Form 拦截 `onFinish` → 调用 `props.onSubmit?.(values)`，并把 values 写入 runtime state 的 `form` 路径（`setState` 到 `form`），使 `${form.fieldName}` 可用。

### D4: Table 行模板经 renderChildren

- columns DSL prop：`Array<{ title, dataIndex?, width?, cell?: DslNode }>`。
- 有 `cell` 的列：adapter 的 antd column `render: (_, row, rowIndex) => renderChildren([cell], { row, rowIndex })`（renderChildren 来自 pactor-runtime renderer context）。
- `dataSource`  prop 接表达式解析后的数组；`rowKey` 默认 `'id'`；`loading` 可绑 `${data.xxx.loading}` 之外，V1 直接接受 boolean。
- `pagination: false | { pageSize? }` 简化映射。

### D5: Tabs / Card / Page 等容器组件的 children

- Tabs：items DSL prop `Array<{ key, label, children?: DslNode[] }>`，pane 内容经 renderChildren 渲染。
- Card：`title` / `bordered` 等 + children 直接渲染。
- Page：页面容器（标题 + 内容区），children 直接渲染；不引入 antd PageHeader（已废弃），用简单排版实现。
- Grid：`columns`（默认 1）+ `gap`，children 逐项包 Col（span = 24/columns）。Flex：`direction` / `gap` / `justify` / `align` → antd Flex。

### D6: 注册入口与包结构

- `registerBuiltinComponents(registry)` 把 12 个组件按 DSL 类型名注册；`createBuiltinComponentRegistry()` 返回新 Registry（label `ComponentRegistry`）。
- dependencies：`pactor-core`、`pactor-runtime`（workspace:*）；peerDependencies：`react >=18`、`antd >=5`。
- 测试：vitest + @testing-library/react + jsdom；`tests/setup.ts` 提供 `matchMedia` 等 antd 必需的浏览器 polyfill；每个组件至少一个渲染测试 + 关键交互测试。

## Risks / Trade-offs

- [antd 大版本差异（v5 vs v6）] → peerDependencies 写 `>=5`；适配层只使用稳定 API；安装时以 v5 为开发基准。
- [jsdom 跑 antd 有环境坑（matchMedia、getComputedStyle、shadow DOM）] → setup 文件统一 polyfill；已知坑在测试中绕开（如 Tabs 的 ink bar 动画）。
- [Form 自动包装 Form.Item 的隐式行为可能让 DSL 作者困惑] → 文档明确"在 Form 内且声明 name 即成为表单项"规则；无 name 则独立渲染，行为可预测。
- [Table 行模板每行每列都调用 renderChildren，大表性能] → V1 接受；后续可加 memo。

## Migration Plan

无（全新包）。顺序：包骨架 → 展示类组件（Page/Card/Alert/Statistic/Grid/Flex/Button）→ 容器（Tabs）→ Form/Input/Select → Table → 注册入口 → 测试与文档。

## Open Questions

- 图标支持（Button icon 等）：V1 不做，避免引入 @ant-design/icons 的 DSL 协议设计；后续单独评估。
- `form` 作用域写入 state 的路径固定为 `form`；多表单页面的隔离（formId）留待 FormModal/交互层落地时细化。
