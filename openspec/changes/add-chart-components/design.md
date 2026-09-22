# Design: add-chart-components

## Context

`@pactor-app/ui` 是 Pactor DSL 的内置 UI kit（shadcn 体系，Tailwind v4 预编译 `styles.css`）。现有 `components/Chart/index.tsx` 是对 recharts 的薄封装，仅覆盖 line / bar / area / pie。资产库 `doc/src/assets-data/components/charts.ts`（component-design.md §3.7，§11 验收矩阵图表 = 17）定义了 17 个图表类组件的规范命名。本变更在 `src/components/chart/` 目录（与 `register.ts`、`components/` 平级）基于 echarts 实现这 17 个组件。

约束：
- 组件必须注册进 DSL 注册表（`register.ts`）才能在 DSL 页面中渲染；事件经 `events.onXxx: { action, params: { x: '${event}' } }` 规范化。
- `skin-tokens.test` 扫描 `src/` 禁止字面色值——图表配色必须走语义令牌（chart-1..5 / success / warning / destructive 等），运行时从 CSS 变量读取。
- 新组件需 `pnpm build` 后确认样式类编译进 `styles.css`。

## Goals / Non-Goals

**Goals:**
- 17 个图表组件（MetricCard … ComposedChart）在 `chart/` 子目录落地，props 契约简洁、DSL 可配。
- echarts 按需引入（`echarts/core` + 模块化注册），共享 `EChartBase` 统一生命周期（init / dispose / ResizeObserver 自适应 / 令牌主题注入）。
- 每个组件注册 DSL、导出类型、补测试；doc 资产库补详情与预览。

**Non-Goals:**
- ~~不改动既有 `Chart` 组件~~（后续决定：**BREAKING** 移除 recharts `Chart` 与 recharts 依赖，图表能力统一收敛到 chart/ 组件集）。
- 不做图表编辑器 / 拖拽配置等可视化搭建能力。
- MapChart 不内置任何地图数据文件（geoJson 由使用方传入）。

## Decisions

### D1: 渲染引擎选 echarts 而非扩展 recharts
echarts 原生覆盖雷达/漏斗/仪表盘/热力/树图/桑基/地图/气泡等全部 17 类图型；recharts 缺少 gauge、sankey、map、heatmap、treemap 的成熟支持。用户已明确指定 echarts 文档为基准。代价是新增依赖与包体积分——用 `echarts/core` 只注册用到的 chart/component/render 模块缓解。

### D2: 共享 `EChartBase` 基础件（不注册为 DSL 组件）
每个组件把 props 翻译成 echarts `option` 后交给 `EChartBase` 渲染。`EChartBase` 负责：`echarts.init`、深比较后 `setOption(option, { notMerge: true })`、ResizeObserver 自适应、卸载 dispose、从 CSS 变量读取语义色构建调色板、把 echarts 事件（click 等）映射为组件 `onSelect`/`onClick` 回调。类比媒体批的 `ImageLightbox` 共享件。

### D3: 目录与命名
`packages/ui/src/components/chart/<Name>/index.tsx`，路径深度 3 层（utils 引入 `../../../lib/utils.js`）。组件名取 doc 英文标识：MetricCard、LineChart、ColumnChart、BarChart、AreaChart、PieChart、DonutChart、ScatterChart、BubbleChart、RadarChart、FunnelChart、GaugeChart、Heatmap、TreeChart、SankeyChart、MapChart、ComposedChart。

### D4: props 契约风格——受限框架级，不透传 echarts option
与既有 `Chart` 一致：每个组件只暴露 DSL 友好的受限 props（data / xKey / yKeys / title / colors / height 等），内部组装 option；需要高度定制时使用 `ComposedChart`（接受 series 数组描述）或回落到原生 echarts。避免把 echarts 自由 API 直通 DSL。

### D5: 数据源形状
统一 `data: Record<string, unknown>[]`（行数组）+ `xKey`/`yKeys` 字段约定；特殊图型扩展专用字段（SankeyChart 用 `nodes`/`links`，TreeChart 用 `name`/`children` 层级，GaugeChart/MetricCard 用单值 `value`）。这让 `${data.xxx}` 表达式解析结果可直接注入。

### D6: 配色走语义令牌
默认调色板运行时读取 `--chart-1..5`、`--success`、`--warning`、`--destructive` 等 CSS 变量（不写字面色值，过 skin-tokens 扫描）；props `colors` 可覆盖。

### D7: MapChart 地图数据
props：`mapName`（echarts 地图名）、`data`（区域值数组）、可选 `geoJson`（传入时 `echarts.registerMap(mapName, geoJson)`）；未提供 geoJson 且地图未注册时渲染 Empty 占位并 console.warn，不抛错。

### D8: DSL 事件
图表交互统一暴露 `onSelect`（echarts `click`），回调参数为 `{ name, value, seriesName, dataIndex }`；DSL 中 `events.onSelect: { action: 'setState', params: { x: '${event}' } }` 规范化。

## Risks / Trade-offs

- [echarts 包体积] → `echarts/core` 按需注册；各组件只 import 所需模块，共享一份模块化注册文件（`chart/echarts-modules.ts`）。
- [SSR 场景 `window` 不存在] → `EChartBase` 在 effect 中懒初始化，服务端渲染出占位容器；doc 站（Astro SSR）需验证无 hydration 报错。
- [skin-tokens 字面色扫描] → 组件内不出现十六进制/rgb 字面量，全部走 CSS 变量读取或令牌类名。
- [jsdom 测试无 canvas] → echarts 在 jsdom 需 canvas 支持；测试用 mock（`EChartBase` 抽接口或测试只断言 props→option 翻译层）。倾向：把 option 构建逻辑抽为纯函数（`buildLineOption(...)` 等），单测覆盖纯函数 + 组件渲染结构，echarts 实例层用轻量 mock。
- [旧 Chart 与 chart/ 组件集并存造成困惑] → 已移除旧 `Chart`（recharts），doc 资产库详情注明图表能力统一由 chart/ 组件集提供。

## Migration Plan

纯新增，无迁移。发布时 `@pactor-app/ui` 版本 bump（按仓库流程），doc 站点重新构建。

## Open Questions

- 地图 geoJson 的默认来源（是否后续接地图数据服务）——本期由使用方传入。
- doc 资产库中既有 `Chart` 条目是否标记为 legacy——留给后续变更决定。
