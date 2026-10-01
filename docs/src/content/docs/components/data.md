---
title: 数据组件
description: 数据类 DSL 组件——Table / DataTable 与图表组件集（17 种 echarts 图表）的 props 契约与 DSL 示例
---

数据呈现组件：表格（Table / DataTable）与图表组件集（echarts 渲染），数据通常经 `${data.xxx}` 表达式注入。

### Table

| prop | 类型 | 说明 |
| --- | --- | --- |
| `columns` | TableColumn[] | 列定义（见下） |
| `dataSource` | object[] | 数据行（通常 `${data.xxx}`） |
| `rowKey` | string（默认 `'id'`） | 行 key 字段 |
| `loading` | boolean | 加载态（可绑 `${dataStatus.x.loading}`） |
| `pagination` | `false` \| `{ pageSize? }` | 分页配置 |
| 事件 `onChange` | — | 分页变化，传出 `{ current, pageSize, total }` |

TableColumn：`title`、`dataIndex`、`width`、`align`（`'left' | 'center' | 'right'`，表头与单元格同时生效，默认 left）、`cell`（DslNode 行模板，作用域注入 `row` / `rowIndex`——行内按钮的显隐禁用与动作参数都经 `${row.xxx}` 表达，见 [state 与表达式](/reference/dsl/#表达式与作用域)）。

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

### 图表组件集

图表以类型化组件提供（17 种，echarts 渲染）：`LineChart` / `ColumnChart` / `BarChart` / `AreaChart` / `PieChart` / `DonutChart` / `ScatterChart` / `BubbleChart` / `RadarChart` / `FunnelChart` / `GaugeChart` / `Heatmap` / `TreeChart` / `SankeyChart` / `MapChart` / `ComposedChart` 与指标卡 `MetricCard`。底层共享 EChartBase（生命周期 / 主题令牌 / 点击事件），不透传 echarts 自由 option。

**通用 props**（除 MetricCard 外各图表均支持）：

| prop | 类型 | 缺省 | 说明 |
| --- | --- | --- | --- |
| `title` | string | — | 图表标题 |
| `height` | `number` \| string | `256` | 容器高度 |
| `colors` | string[] | chart-1..5 语义令牌 | 系列颜色覆盖（按序循环） |
| 事件 `onSelect` | — | — | 点击图形触发，`${event}` 载荷 `{ name, value, seriesName, dataIndex }` |

**各类型数据映射**：

| 组件 | 数据 props | 说明 |
| --- | --- | --- |
| `LineChart` | `data` / `xKey` / `yKeys` | 趋势；`smooth` 平滑、`showArea` 面积填充、`stacked` 堆叠 |
| `ColumnChart` | `data` / `xKey` / `yKeys` | 离散类目比较；`stacked` 堆叠柱 |
| `BarChart` | `data` / `yKey` / `xKeys` | 横向条形（长类目 / 排名）；`stacked` 堆叠条 |
| `AreaChart` | `data` / `xKey` / `yKeys` | 面积趋势；`stacked`、`fillOpacity` |
| `PieChart` | `data` / `nameKey` / `valueKey` | 构成；`showLabel` 标签 |
| `DonutChart` | 同 PieChart | 环形；`innerRadius` / `outerRadius`、`centerLabel` / `centerValue` 中心指标 |
| `ScatterChart` | `data` / `xKey` / `yKey` | 两变量分布；`seriesKey` 分组 |
| `BubbleChart` | `data` / `xKey` / `yKey` / `sizeKey` | 三变量（大小映射非负数值）；`seriesKey` 分组 |
| `RadarChart` | `data` / `indicatorKey` / `yKeys` | 多维能力对比（量程 0-100） |
| `FunnelChart` | `data` / `nameKey` / `valueKey` | 阶段转化；`sort`（`descending` / `ascending` / `none`） |
| `GaugeChart` | `value` / `min` / `max` / `thresholds` / `unit` | 单指标区间状态（阈值配色走语义色） |
| `Heatmap` | `data` / `xKey` / `yKey` / `valueKey` | 二维密度（行数据 `{x, y, value}`） |
| `TreeChart` | `data` | 层级构成；`orient` 方向、`edgeShape` 连线、`initialTreeDepth` 初始展开深度 |
| `SankeyChart` | `nodes` / `links` | 流向规模（links 为 `{ source, target, value }`） |
| `MapChart` | `mapName` / `data` / `nameKey` / `valueKey` / `geoJson` \| `geoJsonUrl` | 地理分布；地图数据经 `geoJson`（内联）或 `geoJsonUrl`（远端）加载 |
| `ComposedChart` | `data` / `xKey` / `series` | 组合图；series 为 `{ type: line\|bar\|area, dataKey, name?, yAxisIndex? }`，任一 `yAxisIndex=1` 生成双数值轴 |
| `MetricCard` | `title` / `value` / `prefix` / `suffix` / `trend` / `trendLabel` | 看板指标卡；`trend` 正升负降，0 / 缺省不展示趋势行 |

```yaml
# 趋势 + 点击联动
- type: LineChart
  props:
    data: ${data.visits}
    xKey: month
    yKeys: [visits, signups]
    smooth: true
  events:
    onSelect:
      action: setState
      params:
        picked: ${event}

# 双轴组合：柱 = 订单量（左轴），线 = 营收额（右轴）
- type: ComposedChart
  props:
    data: ${data.monthly}
    xKey: month
    series:
      - { type: bar, dataKey: orders, name: 订单量 }
      - { type: line, dataKey: revenue, name: 营收额, yAxisIndex: 1 }
```

选型速查：趋势用 `LineChart` / `AreaChart`，离散比较用 `ColumnChart`（类目名长用 `BarChart`），构成用 `PieChart`（类别 ≤ 6）或 `DonutChart`（中心指标），分布用 `ScatterChart` / `BubbleChart`，多维能力用 `RadarChart`，阶段转化用 `FunnelChart`，单指标状态用 `GaugeChart`，层级 / 流向 / 地理用 `TreeChart` / `SankeyChart` / `MapChart`。