# Proposal: add-chart-components

## Why

`@pactor-app/ui` 目前只有一个基于 recharts 的薄封装 `Chart` 组件，仅支持 line / bar / area / pie 四种图型，无法满足资产库（`doc/src/assets-data/components/charts.ts`，源自 component-design.md §3.7 / §11 验收矩阵）定义的 17 种图表类组件的落地需求——其中雷达、漏斗、仪表盘、热力、树图、桑基、地图等图型 recharts 无法覆盖。DSL 页面因此缺少数据可视化的完整表达能力。

## What Changes

- 在 `packages/ui/src/components/chart/` 目录中新增 17 个图表组件（与 `register.ts`、`components/` 平级）（与 `chat/` 子目录同构）：
  `MetricCard`、`LineChart`、`ColumnChart`、`BarChart`、`AreaChart`、`PieChart`、`DonutChart`、`ScatterChart`、`BubbleChart`、`RadarChart`、`FunnelChart`、`GaugeChart`、`Heatmap`、`TreeChart`、`SankeyChart`、`MapChart`、`ComposedChart`。
- 引入 `echarts`（`echarts/core` 按需注册）作为渲染引擎，封装共享的 `EChartBase`（初始化 / 销毁 / ResizeObserver / 语义色令牌注入，不作为 DSL 组件注册）。
- 每个组件注册进 DSL 组件注册表（register.ts），导出 props 类型（components/index.ts），并补齐组件测试。
- 既有 `Chart` 组件保持不变（向后兼容，不迁移）。
- doc 资产库补齐 17 个图表组件的详情与预览（新增 chart-details 与预览注册，previewable 同步）。

## Capabilities

### New Capabilities

- `chart-components`: `@pactor-app/ui` 图表组件集——17 个 chart 子目录组件的 props 契约、DSL 渲染（含事件：`onSelect` 等通过 `params: { x: '${event}' }` 规范化）、echarts 按需注册与主题令牌接入、共享 EChartBase 生命周期行为，以及 doc 资产库对应详情/预览。

### Modified Capabilities

（无——既有 `Chart` 组件行为不变。）

## Impact

- **代码**：`packages/ui/src/components/chart/`（新建 17 个组件目录 + 共享基础件）、`packages/ui/src/components/register.ts`、`packages/ui/src/components/index.ts`、新增测试文件。
- **依赖**：`@pactor-app/ui` 新增 `echarts` 依赖（`echarts/core` 模块化引入，避免全量打包）；`pnpm-lock.yaml` 更新。
- **文档站**：`doc/src/assets-data/details/`（新增图表详情）、`doc/src/components/previews/`（新增预览注册）、`previewable.ts` 同步。
- **兼容性**：**BREAKING** —— 移除既有 recharts 薄封装 `Chart` 组件与 `recharts` 依赖；line/bar/area/pie 场景迁移到 `LineChart`/`ColumnChart`/`AreaChart`/`PieChart`。
