# Spec: chart-components

## Purpose

`@pactor-app/chart` 独立包的图表组件集（`packages/chart/src/components/`；自 `@pactor-app/ui` 拆出）：17 个基于 echarts 按需引入的图表组件、受限 props 契约与统一数据源形状、语义色令牌、交互事件映射，以及旧 recharts Chart 组件的移除与迁移。

## Requirements

### Requirement: 图表组件集目录结构

`@pactor-app/chart` SHALL 在 `src/components/` 目录提供 17 个图表组件：MetricCard、LineChart、ColumnChart、BarChart、AreaChart、PieChart、DonutChart、ScatterChart、BubbleChart、RadarChart、FunnelChart、GaugeChart、Heatmap、TreeChart、SankeyChart、MapChart、ComposedChart。每个组件 SHALL 以 `<Name>/index.tsx` 形式组织，共享基础件 `EChartBase` 与模块化注册文件放在 components/ 目录下且不作为 DSL 组件注册。

#### Scenario: 目录布局符合约定

- **WHEN** 检查 `packages/chart/src/components/`
- **THEN** 存在 17 个组件目录及共享基础件文件，组件路径深度为 3 层

### Requirement: DSL 注册与导出

每个图表组件 SHALL 由 `@pactor-app/chart` 的 `chartComponents` 映射经 `registerChartComponents(registry)` 注册（或在 `createChartComponentRegistry()` 纯图表注册表中提供），并在包入口导出组件与 props 类型；`@pactor-app/ui` 主注册表不再内置图表组件，需要图表的接入方 SHALL 显式合并。DSL 页面 SHALL 能通过组件名直接渲染各图表组件。

#### Scenario: 注册表包含全部图表组件

- **WHEN** 检查 `packages/chart/src/index.ts`
- **THEN** 17 个图表组件全部完成注册与导出

#### Scenario: DSL 页面渲染折线图

- **WHEN** DSL 页面配置 `type: 'LineChart'` 并传入 `data` / `xKey` / `yKeys`
- **THEN** 页面渲染出折线图，数据点数量与传入行数一致

### Requirement: echarts 按需引入

图表组件 SHALL 通过 `echarts/core` 加模块化注册使用 echarts，仅引入各图型所需的 chart / component / render 模块，禁止全量 `import 'echarts'`。

#### Scenario: 无全量引入

- **WHEN** 检查 chart/ 目录源码
- **THEN** 不存在 `from 'echarts'` 的全量导入，所有 echarts 导入均来自 `echarts/core` 与显式模块路径

### Requirement: 共享生命周期基础件

`EChartBase` SHALL 负责 echarts 实例的初始化、`notMerge` 式 option 更新、ResizeObserver 尺寸自适应、卸载销毁，并在浏览器环境外（SSR）安全降级为占位容器。

#### Scenario: 容器尺寸变化自适应

- **WHEN** 图表容器宽度变化
- **THEN** echarts 实例调用 resize 重新渲染，无报错

#### Scenario: 组件卸载清理

- **WHEN** 图表组件卸载
- **THEN** echarts 实例被 dispose，无内存泄漏警告

### Requirement: 语义色令牌

图表默认配色 SHALL 运行时从 CSS 语义变量（`--chart-1..5` 及语义色变量）读取；组件源码 SHALL NOT 包含字面色值（通过 skin-tokens 扫描）；props `colors` 可覆盖默认调色板。

#### Scenario: 默认配色来自令牌

- **WHEN** 未传 `colors` 渲染 PieChart
- **THEN** 切片颜色取自 CSS 语义变量对应的调色板

#### Scenario: skin-tokens 扫描通过

- **WHEN** 运行 ui 包 skin-tokens 测试
- **THEN** 全部通过，chart/ 目录无字面色值

### Requirement: 统一数据源形状

行式图表（Line/Column/Bar/Area/Scatter/Bubble/Heatmap 等）SHALL 接受 `data: Record<string, unknown>[]` 加字段约定（`xKey` / `yKeys`）；层级或网络类图型 SHALL 接受其专用形状（TreeChart 的 `name`/`children` 层级，Sankey 的 `nodes`/`links`）；单值图型（GaugeChart、MetricCard）SHALL 接受 `value`。

#### Scenario: 表达式结果直接注入

- **WHEN** DSL 中 `data: '${data.revenue}'` 解析为行数组
- **THEN** ColumnChart 按行渲染柱条，无需额外变换

### Requirement: 受限 props 契约

各图表组件 SHALL 暴露受限框架级 props（如 `data` / `xKey` / `yKeys` / `title` / `colors` / `height` / `className` / `style`），SHALL NOT 透传 echarts option 自由组合 API；组合需求由 `ComposedChart` 满足。

#### Scenario: 不透传 echarts option

- **WHEN** 检查任一 chart/ 组件的 props 类型
- **THEN** 不存在直接接收 echarts `option` 对象的 prop（ComposedChart 的声明式 series 描述除外）

### Requirement: 图表交互事件

图表组件 SHALL 把 echarts `click` 交互统一映射为 `onSelect` 回调，参数形如 `{ name, value, seriesName, dataIndex }`；DSL 中 SHALL 支持 `events.onSelect: { action: 'setState', params: { x: '${event}' } }` 规范化写法。

#### Scenario: DSL 点击柱子触发状态更新

- **WHEN** 用户点击 ColumnChart 的某根柱子且 DSL 配置了 `events.onSelect`
- **THEN** 对应 action 被执行，事件参数进入状态

### Requirement: MapChart 地图数据约定

MapChart SHALL 通过 `mapName` 与可选 `geoJson` props 工作：传入 `geoJson` 时 SHALL 调用 `echarts.registerMap` 注册；未提供且地图未注册时 SHALL 渲染 Empty 占位并给出 warn，SHALL NOT 抛错。

#### Scenario: 未注册地图时优雅降级

- **WHEN** MapChart 未传 `geoJson` 且 `mapName` 未注册
- **THEN** 渲染 Empty 占位，控制台出现 warn，组件不抛出异常

### Requirement: 旧 Chart 组件移除

既有 `components/Chart`（recharts 薄封装）SHALL 被移除，`recharts` 依赖 SHALL 从 `@pactor-app/ui` 移除；DSL 中的 line/bar/area/pie 图表场景 SHALL 迁移到 `LineChart`/`ColumnChart`/`AreaChart`/`PieChart`。

#### Scenario: 注册表不再包含旧 Chart

- **WHEN** 检查 register.ts 的 builtinComponents
- **THEN** 不存在 `Chart` 类型，且 ui 包源码无 recharts 引用

### Requirement: doc 资产库同步

doc 资产库 SHALL 为 17 个图表组件提供详情条目与可运行预览，previewable 清单同步更新；详情中 SHALL 注明新页面优先使用 chart/ 组件集。

#### Scenario: 图表组件可预览

- **WHEN** 打开 doc 资产库「组件」页浏览图表分类
- **THEN** 17 个图表组件均有详情与预览，预览渲染真实图表

### Requirement: 测试覆盖

chart 包 SHALL 为图表组件提供测试：option 构建逻辑（纯函数）与组件渲染结构必须覆盖；DSL 集成测试 SHALL 经 `registerChartComponents` 合并进注册表，测试内不重复手工注册；事件断言 SHALL 使用 `expectEventState(context, key, expected)` 三参形式。

#### Scenario: chart 测试全绿

- **WHEN** 在 `packages/chart` 运行 `npx tsc --noEmit && npx vitest run`
- **THEN** 类型检查通过，全部测试通过（且 `@pactor-app/ui` 既有测试无回归）
