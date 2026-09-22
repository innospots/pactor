# Tasks: add-chart-components

## 1. 基础设施

- [x] 1.1 在 `packages/ui/package.json` 添加 `echarts` 依赖并安装（`echarts/core` 模块化路线）
- [x] 1.2 新建 `packages/ui/src/components/chart/echarts-modules.ts`：集中完成 `echarts.use([...])` 按需注册（17 个图型所需的 chart/component/render 模块）
- [x] 1.3 新建 `chart/EChartBase/index.tsx`（位于 `src/components/chart/` 下）echarts init / `setOption(option, { notMerge: true })` / ResizeObserver resize / dispose / SSR 占位降级 / 语义色板（运行时读 `--chart-1..5` 等 CSS 变量）/ echarts click → `onSelect({ name, value, seriesName, dataIndex })`
- [x] 1.4 新建 `chart/lib/option-builders.ts`：option 构建纯函数（`buildLineOption`、`buildColumnOption`、`buildBarOption`、`buildAreaOption`、`buildPieOption`、`buildDonutOption`、`buildScatterOption`、`buildBubbleOption`、`buildRadarOption`、`buildFunnelOption`、`buildGaugeOption`、`buildHeatmapOption`、`buildTreeOption`、`buildSankeyOption`、`buildMapOption`、`buildComposedOption`），统一坐标轴/网格/提示框/图例的令牌化默认样式

## 2. 图表组件实现（`src/components/chart/` 目录）

- [x] 2.1 `chart/MetricCard/index.tsx`：value / title / trend（含语义色箭头，走令牌）/ 单值展示
- [x] 2.2 `chart/LineChart/index.tsx`：data / xKey / yKeys / smooth / showArea / colors / height
- [x] 2.3 `chart/ColumnChart/index.tsx`：data / xKey / yKeys / stacked / colors / height
- [x] 2.4 `chart/BarChart/index.tsx`：横向柱形（yKey 类目 + xKeys 数值）
- [x] 2.5 `chart/AreaChart/index.tsx`：data / xKey / yKeys / stacked / fillOpacity
- [x] 2.6 `chart/PieChart/index.tsx`：data / nameKey / valueKey / donut=false 切片 / label 开关
- [x] 2.7 `chart/DonutChart/index.tsx`：环形（innerRadius），支持中心指标 `centerLabel` / `centerValue`
- [x] 2.8 `chart/ScatterChart/index.tsx`：data / xKey / yKey / seriesKey 分组
- [x] 2.9 `chart/BubbleChart/index.tsx`：data / xKey / yKey / sizeKey 三变量
- [x] 2.10 `chart/RadarChart/index.tsx`：data / indicatorKey（维度名）/ yKeys 多系列对比
- [x] 2.11 `chart/FunnelChart/index.tsx`：data / nameKey / valueKey / 阶段排序
- [x] 2.12 `chart/GaugeChart/index.tsx`：value / min / max / 区间阈值色（令牌色）
- [x] 2.13 `chart/Heatmap/index.tsx`：data（x/y/value 字段）/ visualMap 令牌色阶
- [x] 2.14 `chart/TreeChart/index.tsx`：节点-连线层级树（data 为 name/children 层级）
- [x] 2.15 `chart/SankeyChart/index.tsx`：nodes / links / 方向流
- [x] 2.16 `chart/MapChart/index.tsx`：mapName / data / geoJson（传入时 registerMap；未注册渲染 Empty + warn，不抛错）
- [x] 2.17 `chart/ComposedChart/index.tsx`：声明式 series 数组描述（type: line|bar|area + dataKey），支持双轴

## 3. 注册、导出与测试

- [x] 3.1 `register.ts` 注册全部 17 个组件（含 `requires` 依赖声明与事件 schema，`onSelect` 支持 `params: { x: '${event}' }`）
- [x] 3.2 `components/index.ts` 导出 17 个组件及其 props 类型
- [x] 3.3 option 构建纯函数单测（数据形状 → option 结构断言）
- [x] 3.4 组件渲染结构测试（容器/占位/Empty 降级路径；echarts 实例层 mock，避免 jsdom canvas 依赖）
- [x] 3.5 DSL 集成测试：DSL 渲染 LineChart / ColumnChart + `events.onSelect` 点击事件（`expectEventState(context, key, expected)` 三参形式）
- [x] 3.6 验证：`cd packages/ui && npx tsc --noEmit && npx vitest run` 全绿（含既有测试无回归）
- [x] 3.7 `pnpm build` 后核对 `styles.css` 中新增类名编译（skin-tokens 扫描通过，chart/ 无字面色值）

## 4. doc 资产库同步

- [x] 4.1 新建 `doc/src/assets-data/details/chart-details.ts`：17 个图表组件详情（用途/示例/反例），并入 `component-details.ts`
- [x] 4.2 新建预览注册文件（`chart-a.tsx` … 按现有 basic-a~e 分片惯例），ComponentPreview 串行 spread
- [x] 4.3 `previewable.ts` 同步 17 个图表组件
- [x] 4.4 详情中注明：新页面优先使用 chart/ 组件集，既有 `Chart` 保留兼容
- [x] 4.5 验证：`pnpm --filter pactor-asset-library validate && pnpm --filter pactor-asset-library build` 通过，并用 playwright-cli 抽验预览真实渲染
