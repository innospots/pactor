---
title: 数据组件
description: 数据类 DSL 组件——Table / DataTable / Chart 的 props 契约与 DSL 示例（行模板作用域、排序筛选分页、图表系列配置）
---

数据呈现组件：表格（Table / DataTable）与图表（Chart），数据通常经 `${data.xxx}` 表达式注入。

### Table

| prop | 类型 | 说明 |
| --- | --- | --- |
| `columns` | TableColumn[] | 列定义（见下） |
| `dataSource` | object[] | 数据行（通常 `${data.xxx}`） |
| `rowKey` | string（默认 `'id'`） | 行 key 字段 |
| `loading` | boolean | 加载态（可绑 `${dataStatus.x.loading}`） |
| `pagination` | `false` \| `{ pageSize? }` | 分页配置 |
| 事件 `onChange` | — | 分页变化，传出 `{ current, pageSize, total }` |

TableColumn：`title`、`dataIndex`、`width`、`cell`（DslNode 行模板，作用域注入 `row` / `rowIndex`——行内按钮的显隐禁用与动作参数都经 `${row.xxx}` 表达，见 [state 与表达式](/reference/dsl/#表达式与作用域)）。

### DataTable

一体化数据表：在既有 Table 语义之上提供排序（sortable 列表头点击切换升 / 降序，客户端排序）、筛选（filterable 列表头输入框，客户端包含匹配）与分页（复用 Table 分页行为）。单元格自定义渲染沿用 Table `cell` 的 `row` / `rowIndex` 作用域语义。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `columns` | DataTableColumn[] | `[]` | 列定义（见下） |
| `rows` | `Record<string, unknown>[]` | `[]` | 数据行（通常为 `${data.xxx}` 表达式解析结果） |
| `rowKey` | string | `'id'` | 行 key 字段 |
| `pagination` | `false` \| `{ pageSize?: number }` | — | 分页配置：`false` 关闭，`{ pageSize }` 简化映射 |
| `sort` | `{ key: string, order: 'asc' \| 'desc' }` | — | 受控初始排序（后续点击表头由内部维护） |
| 事件 `onSort` | — | — | 排序变化时触发，`${event}` 为 `{ key, order }` |
| 事件 `onPageChange` | — | — | 分页变化时触发，`${event}` 为页码（number） |

DataTableColumn：`key`（string）、`title?`、`sortable?`、`filterable?`、`children?`（DslNode[] 单元格自定义渲染子树，子作用域注入 `row` 与 `rowIndex`）、`renderChildren?`（契约兼容别名，同 `children`）。

```yaml
- type: DataTable
  props:
    rows: ${data.customers}
    pagination: { pageSize: 10 }
    columns:
      - { key: name, title: 姓名, filterable: true }
      - { key: age, title: 年龄, sortable: true }
  events:
    onSort:
      action: setState
      params:
        sortInfo: ${event}
```

### Chart

图表（recharts 薄封装）：以受限框架级 props 渲染 line / bar / area / pie 图表，不透传 recharts 自由组合 API；缺省配色取 chart-1..5 语义令牌；多系列（`yKeys` > 1）或 pie 时渲染 Legend。

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `chartType` | `line` \| `bar` \| `area` \| `pie` | —（必填） | 图表类型 |
| `data` | `Record<string, unknown>[]` | `[]` | 数据数组（通常为 `${data.xxx}` 表达式解析结果） |
| `xKey` | string | — | 类目 / 名称字段（pie 时为切片 name 字段） |
| `yKeys` | string[] | `['value']` | 数值字段（多系列传多个；pie 取第一个作为 value 字段） |
| `colors` | string[] | chart-1..5 语义令牌 | 系列颜色（按序循环） |

```yaml
- type: Chart
  props:
    chartType: bar
    data: ${data.sales}
    xKey: month
    yKeys: [amount]
```
