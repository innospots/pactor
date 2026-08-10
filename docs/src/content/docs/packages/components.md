---
title: pactor-components
description: 内置组件——V1 基础组件（Page / Grid / Flex / Card / Button / Alert / Statistic / Tabs / Table / Form / Input / Select）的 antd 适配层
---

`pactor-components` 提供 V1 内置组件：12 个 DSL 组件的 antd 适配器。DSL 只暴露框架级 props（如 `variant`），适配器负责映射到 antd props，不把 antd 专有 API 透传为 DSL 协议。

```bash
pnpm add pactor-components pactor-runtime antd react
```

`react >= 18`、`antd >= 5` 为 peer dependency（开发基准为 antd v6）。

## 注册入口

```tsx
import { createPageRuntime, PageRuntimeView } from 'pactor-runtime';
import { createBuiltinComponentRegistry } from 'pactor-components';

const runtime = createPageRuntime(pageDsl, {
  components: createBuiltinComponentRegistry(), // 注册全部 12 个内置组件
});

await runtime.initialized;
<PageRuntimeView runtime={runtime} />;
```

也可以注册到已有的 Registry：`registerBuiltinComponents(runtime.context.components)`。

## 组件一览

### 布局与容器

| 组件 | DSL props | 说明 |
| --- | --- | --- |
| `Page` | `title` | 页面容器：可选标题 + 内容区 |
| `Grid` | `columns`（默认 1）、`gap` | children 逐项包 Col（span = 24/columns）均分栏 |
| `Flex` | `direction`、`gap`、`justify`、`align` | 映射 antd Flex |
| `Card` | `title`、`bordered` | `bordered: false` 映射 antd `variant="borderless"` |
| `Tabs` | `items` | `items[].children` 为 DslNode 数组，pane 内容经 Renderer children 机制渲染 |

### 展示

| 组件 | DSL props | 说明 |
| --- | --- | --- |
| `Button` | `text`、`variant`、`danger`、`size`、`loading`、`disabled`、`submit` | `variant` 映射 antd `type`；`submit: true` 时作为 Form 提交按钮 |
| `Alert` | `message`、`description`、`variant`（success/info/warning/error） | `message` 映射 antd v6 的 `title` |
| `Statistic` | `title`、`value`、`precision`、`suffix` | `value` 可为表达式（如 `${data.summary.total}`） |

### 表单

- `Form`：创建 antd Form 实例并经 React Context 下发。提交（Form 内 `submit: true` 的 Button）且校验通过时：先把 values 写入 runtime state 的 `form` 路径（`${form.<field>}` 表达式可用），再以 values 触发 `onSubmit` 事件（进入 `event` 作用域）。
- `Input` / `Select`：在 Form 内且声明 `name` 时**自动包装为表单项**（`label` / `rules` 生效）；不在 Form 内或未声明 `name` 时渲染独立受控控件，`onChange` 仅触发事件。
- `rules` 映射 antd 校验规则，当前支持 `required` + `message`；校验失败阻止提交并展示错误。
- `Select` 接受 `options`（`Array<{ label, value }>`，支持表达式解析）。

```yaml
type: Form
events:
  onSubmit: { action: setState, params: { keyword: '${event.keyword}' } }
children:
  - type: Input
    props:
      name: keyword
      label: 关键词
      rules: [{ required: true, message: 必填 }]
  - type: Button
    props: { text: 搜索, submit: true }
```

### 数据

`Table`：`columns` / `dataSource` / `rowKey`（默认 `'id'`）/ `loading` / `pagination`（`false` 或 `{ pageSize }`）。

列定义支持 `cell: DslNode` 行模板——该列每个单元格经 Renderer 子作用域机制渲染，作用域注入 `row`（当前行记录）与 `rowIndex`：

```yaml
type: Table
props:
  dataSource: '${data.users}'
  columns:
    - { title: 姓名, dataIndex: name }
    - title: 操作
      cell:
        type: Button
        props: { text: 编辑 }
        events:
          onClick: { action: setState, params: { editing: '${row.id}' } }
```

## 事件值规范化

组件事件回调传递 DSL 层有意义的值而非原生 DOM 事件（Renderer 把该值放入 `event` 作用域）：

| 事件 | 传出的值 |
| --- | --- |
| `Input.onChange` | 输入的 string |
| `Select.onChange` | 选中的 value |
| `Form.onSubmit` | 表单 values |
| `Table.onChange` | pagination 信息 |
| `Tabs.onChange` | 新激活的 key |

:::note
内嵌在 props 中的 DslNode 子树（如 Table 的 `cell`、Tabs 的 `items[].children`）不在父作用域提前求值，而是经 `renderChildren` 以组件注入的局部作用域解析——`${row.x}` 等表达式因此可用。
:::
