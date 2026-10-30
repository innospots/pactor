/**
 * echarts option 构建纯函数：每个图表组件把受限 props 翻译为 option，
 * 纯函数便于单测（jsdom 无 canvas，不断言 echarts 实例行为）。
 * 颜色一律来自 ChartTheme 令牌解析结果或用户显式覆盖。
 */
import type { EChartsCoreOption } from 'echarts/core';

import type { ChartTheme } from './theme.js';

/** 行式数据（通常为 `${data.xxx}` 表达式解析结果） */
export type ChartRow = Record<string, unknown>;

export interface CategoryChartInput {
  data: ChartRow[];
  /** 类目字段（横向柱形时为行标识字段） */
  xKey?: string;
  /** 数值字段（多系列传多个） */
  yKeys?: string[];
  /** 系列颜色覆盖（按序循环） */
  colors?: string[];
  /** 图表标题 */
  title?: string;
  /** 堆叠 */
  stacked?: boolean;
  /** 平滑折线 */
  smooth?: boolean;
  /** 折线下面填充 */
  showArea?: boolean;
  /** 填充不透明度（面积图） */
  fillOpacity?: number;
}

export interface PieChartInput {
  data: ChartRow[];
  /** 切片名称字段，默认 name */
  nameKey?: string;
  /** 切片数值字段，默认 value */
  valueKey?: string;
  /** 系列颜色覆盖 */
  colors?: string[];
  /** 图表标题 */
  title?: string;
  /** 是否显示标签 */
  showLabel?: boolean;
}

export interface DonutChartInput extends PieChartInput {
  /** 内半径（px 或百分比串），默认 '48%' */
  innerRadius?: number | string;
  /** 外半径，默认 '72%' */
  outerRadius?: number | string;
  /** 中心指标 */
  centerLabel?: string;
  centerValue?: number | string;
}

export interface ScatterChartInput {
  data: ChartRow[];
  /** X 数值字段 */
  xKey?: string;
  /** Y 数值字段 */
  yKey?: string;
  /** 分组字段（按值拆系列） */
  seriesKey?: string;
  /** 系列颜色覆盖 */
  colors?: string[];
  title?: string;
}

export interface BubbleChartInput extends ScatterChartInput {
  /** 气泡大小字段（第三变量） */
  sizeKey?: string;
}

export interface RadarChartInput {
  data: ChartRow[];
  /** 维度名字段（每行一个雷达轴） */
  indicatorKey?: string;
  /** 系列字段（每列一个对比系列） */
  yKeys?: string[];
  colors?: string[];
  title?: string;
}

export interface FunnelChartInput {
  data: ChartRow[];
  nameKey?: string;
  valueKey?: string;
  /** 排序：降序（大在上）/升序/输入顺序 */
  sort?: 'descending' | 'ascending' | 'none';
  colors?: string[];
  title?: string;
}

export interface GaugeChartInput {
  value: number;
  min?: number;
  max?: number;
  /** 阈值区间（按 value 上限分段配色，末段兜底到 max） */
  thresholds?: { value: number; color?: string }[];
  /** 单位后缀 */
  unit?: string;
  title?: string;
}

export interface HeatmapChartInput {
  data: ChartRow[];
  xKey?: string;
  yKey?: string;
  valueKey?: string;
  title?: string;
}

export interface TreeChartInput {
  /** 层级数据：通常为单根 [{ name, children: [...] }] */
  data: ChartRow[];
  title?: string;
  /** 展开方向：vertical 根在上向下（TB）/ horizontal 根在左向右（LR） */
  orient?: 'vertical' | 'horizontal';
  /** 连线形状：曲线 / 折线 */
  edgeShape?: 'curve' | 'polyline';
  /** 初始展开的层级深度（缺省 2，-1 全部展开） */
  initialTreeDepth?: number;
}

export interface SankeyChartInput {
  nodes: { name: string }[];
  links: { source: string; target: string; value: number }[];
  title?: string;
}

export interface MapChartInput {
  mapName: string;
  data: ChartRow[];
  nameKey?: string;
  valueKey?: string;
  title?: string;
}

export interface ComposedSeriesItem {
  /** 图型：折线 / 柱 / 面积 */
  type: 'line' | 'bar' | 'area';
  /** 数据字段 */
  dataKey: string;
  /** 0 主数值轴 / 1 副数值轴（双轴） */
  yAxisIndex?: 0 | 1;
  /** 系列显示名，缺省取 dataKey */
  name?: string;
}

export interface ComposedChartInput {
  data: ChartRow[];
  xKey?: string;
  series: ComposedSeriesItem[];
  colors?: string[];
  title?: string;
}

function pickColor(theme: ChartTheme, colors: string[] | undefined, index: number): string {
  if (colors && colors.length > 0) return colors[index % colors.length]!;
  return theme.palette[index % theme.palette.length]!;
}

function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function axisLabel(theme: ChartTheme) {
  return { color: theme.muted };
}

function grid() {
  return { left: 8, right: 16, top: 40, bottom: 4, containLabel: true };
}

function axisTooltip(theme: ChartTheme) {
  return {
    trigger: 'axis' as const,
    backgroundColor: theme.card,
    borderColor: theme.border,
    textStyle: { color: theme.foreground },
  };
}

function itemTooltip(theme: ChartTheme) {
  return {
    trigger: 'item' as const,
    backgroundColor: theme.card,
    borderColor: theme.border,
    textStyle: { color: theme.foreground },
  };
}

function titleOption(title: string | undefined) {
  return title ? { text: title, left: 8 as const, top: 4 } : undefined;
}

function legendOption(theme: ChartTheme, show: boolean) {
  return show ? { top: 4, textStyle: { color: theme.muted } } : undefined;
}

function categorySeries(
  input: CategoryChartInput,
  theme: ChartTheme,
  kind: 'line' | 'bar',
  area: boolean,
): EChartsCoreOption {
  const rows = input.data;
  const keys = input.yKeys && input.yKeys.length > 0 ? input.yKeys : ['value'];
  const series = keys.map((key, index) => ({
    type: kind,
    name: key,
    data: rows.map((row) => toNumber(row[key])),
    ...(kind === 'line' ? { smooth: input.smooth ?? false, symbolSize: 6 } : {}),
    ...(area ? { areaStyle: { opacity: input.fillOpacity ?? 0.25 } } : {}),
    ...(input.stacked ? { stack: 'total' } : {}),
    ...(kind === 'line' ? { emphasis: { focus: 'series' as const } } : {}),
    itemStyle: { color: pickColor(theme, input.colors, index) },
    ...(kind === 'line' ? { lineStyle: { color: pickColor(theme, input.colors, index) } } : {}),
    ...(area ? { lineStyle: { color: pickColor(theme, input.colors, index) } } : {}),
  }));
  const legend = legendOption(theme, keys.length > 1);
  return {
    color: (input.colors && input.colors.length > 0 ? input.colors : theme.palette),
    title: titleOption(input.title),
    grid: grid(),
    tooltip: axisTooltip(theme),
    ...(legend ? { legend } : {}),
    xAxis: { type: 'category', data: rows.map((row) => String(input.xKey ? row[input.xKey] : '')), axisLabel: axisLabel(theme), axisLine: { lineStyle: { color: theme.border } } },
    yAxis: { type: 'value', axisLabel: axisLabel(theme), splitLine: { lineStyle: { color: theme.border } } },
    series,
  } as EChartsCoreOption;
}

/** 折线图 */
export function buildLineOption(input: CategoryChartInput, theme: ChartTheme): EChartsCoreOption {
  return categorySeries(input, theme, 'line', input.showArea ?? false);
}

/** 柱状图（垂直） */
export function buildColumnOption(input: CategoryChartInput, theme: ChartTheme): EChartsCoreOption {
  return categorySeries(input, theme, 'bar', false);
}

/** 条形图（横向，yKey 类目 + xKeys 数值） */
export function buildBarOption(
  input: CategoryChartInput & { yKey?: string },
  theme: ChartTheme,
): EChartsCoreOption {
  const rows = input.data;
  const keys = input.yKeys && input.yKeys.length > 0 ? input.yKeys : ['value'];
  const series = keys.map((key, index) => ({
    type: 'bar',
    name: key,
    data: rows.map((row) => toNumber(row[key])),
    ...(input.stacked ? { stack: 'total' } : {}),
    itemStyle: { color: pickColor(theme, input.colors, index) },
  }));
  const legend = legendOption(theme, keys.length > 1);
  return {
    color: input.colors && input.colors.length > 0 ? input.colors : theme.palette,
    title: titleOption(input.title),
    grid: grid(),
    tooltip: axisTooltip(theme),
    ...(legend ? { legend } : {}),
    xAxis: { type: 'value', axisLabel: axisLabel(theme), splitLine: { lineStyle: { color: theme.border } } },
    yAxis: { type: 'category', data: rows.map((row) => String(input.yKey ? row[input.yKey] : '')), axisLabel: axisLabel(theme), axisLine: { lineStyle: { color: theme.border } } },
    series,
  } as EChartsCoreOption;
}

/** 面积图 */
export function buildAreaOption(input: CategoryChartInput, theme: ChartTheme): EChartsCoreOption {
  const withArea: CategoryChartInput = { ...input, showArea: true };
  return categorySeries(withArea, theme, 'line', true);
}

function pieOption(
  input: PieChartInput,
  theme: ChartTheme,
  radius: [string | number, string | number],
  extra: Record<string, unknown>,
): EChartsCoreOption {
  const nameKey = input.nameKey ?? 'name';
  const valueKey = input.valueKey ?? 'value';
  return {
    color: input.colors && input.colors.length > 0 ? input.colors : theme.palette,
    title: titleOption(input.title),
    tooltip: itemTooltip(theme),
    legend: { bottom: 0, textStyle: { color: theme.muted } },
    series: [
      {
        type: 'pie',
        radius,
        center: ['50%', '52%'],
        data: input.data.map((row) => ({ name: String(row[nameKey] ?? ''), value: toNumber(row[valueKey]) })),
        label: { show: input.showLabel ?? false, color: theme.muted },
        emphasis: { scaleSize: 6 },
      },
    ],
    ...extra,
  } as EChartsCoreOption;
}

/** 饼图 */
export function buildPieOption(input: PieChartInput, theme: ChartTheme): EChartsCoreOption {
  return pieOption(input, theme, [0, '72%'], {});
}

/** 环形图（中心指标） */
export function buildDonutOption(input: DonutChartInput, theme: ChartTheme): EChartsCoreOption {
  const inner = input.innerRadius ?? '48%';
  const outer = input.outerRadius ?? '72%';
  const extra: Record<string, unknown> = {};
  if (input.centerValue !== undefined || input.centerLabel !== undefined) {
    extra.title = {
      text: input.centerValue !== undefined ? String(input.centerValue) : '',
      subtext: input.centerLabel ?? '',
      left: 'center',
      top: '40%',
      textStyle: { color: theme.foreground, fontSize: 22 },
      subtextStyle: { color: theme.muted },
    };
  }
  return pieOption(input, theme, [inner, outer], extra);
}

function scatterSeries(
  input: ScatterChartInput,
  theme: ChartTheme,
  extra?: {
    /** 自定义数据点形状（如气泡 [x, y, size]） */
    datum?: (row: ChartRow) => unknown[];
    /** 依数据点求 symbolSize */
    symbolSize?: (datum: unknown[]) => number;
  },
): EChartsCoreOption {
  const xKey = input.xKey ?? 'x';
  const yKey = input.yKey ?? 'y';
  const groups = new Map<string, ChartRow[]>();
  if (input.seriesKey) {
    for (const row of input.data) {
      const g = String(row[input.seriesKey] ?? '');
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g)!.push(row);
    }
  } else {
    groups.set('', input.data);
  }
  const names = [...groups.keys()];
  const series = names.map((name, index) => ({
    type: 'scatter',
    name: name || undefined,
    data: groups.get(name)!.map((row) =>
      extra?.datum ? extra.datum(row) : [toNumber(row[xKey]), toNumber(row[yKey])],
    ),
    symbolSize: extra?.symbolSize ?? 10,
    itemStyle: { color: pickColor(theme, input.colors, index) },
  }));
  const legend = legendOption(theme, input.seriesKey !== undefined && names.length > 1);
  return {
    color: input.colors && input.colors.length > 0 ? input.colors : theme.palette,
    title: titleOption(input.title),
    grid: grid(),
    tooltip: axisTooltip(theme),
    ...(legend ? { legend } : {}),
    xAxis: { type: 'value', axisLabel: axisLabel(theme), splitLine: { lineStyle: { color: theme.border } } },
    yAxis: { type: 'value', axisLabel: axisLabel(theme), splitLine: { lineStyle: { color: theme.border } } },
    series,
  } as EChartsCoreOption;
}

/** 散点图（seriesKey 分组） */
export function buildScatterOption(input: ScatterChartInput, theme: ChartTheme): EChartsCoreOption {
  return scatterSeries(input, theme);
}

/** 气泡图（sizeKey 第三变量映射气泡大小） */
export function buildBubbleOption(input: BubbleChartInput, theme: ChartTheme): EChartsCoreOption {
  const sizeKey = input.sizeKey ?? 'size';
  const sizes = input.data.map((row) => toNumber(row[sizeKey]));
  const min = Math.min(...sizes, 0);
  const max = Math.max(...sizes, 1);
  const span = max - min || 1;
  return scatterSeries(input, theme, {
    datum: (row) => [toNumber(row[input.xKey ?? 'x']), toNumber(row[input.yKey ?? 'y']), toNumber(row[sizeKey])],
    symbolSize: (datum) => {
      const [x, y, size] = datum as [number, number, number];
      void x;
      void y;
      return 12 + ((toNumber(size) - min) / span) * 36;
    },
  });
}

/** 雷达图（indicatorKey 每行一个轴，yKeys 每列一个系列） */
export function buildRadarOption(input: RadarChartInput, theme: ChartTheme): EChartsCoreOption {
  const indicatorKey = input.indicatorKey ?? 'indicator';
  const keys = input.yKeys && input.yKeys.length > 0 ? input.yKeys : ['value'];
  return {
    color: input.colors && input.colors.length > 0 ? input.colors : theme.palette,
    title: titleOption(input.title),
    tooltip: itemTooltip(theme),
    ...(keys.length > 1 ? { legend: legendOption(theme, true) } : {}),
    radar: {
      indicator: input.data.map((row) => ({ name: String(row[indicatorKey] ?? ''), max: 100 })),
      axisName: { color: theme.muted },
      splitLine: { lineStyle: { color: theme.border } },
      splitArea: { areaStyle: { color: [] } },
    },
    series: [
      {
        type: 'radar',
        data: input.data.length === 0 ? [] : keys.map((key) => ({
          name: key,
          value: input.data.map((row) => toNumber(row[key])),
        })),
      },
    ],
  } as EChartsCoreOption;
}

/** 漏斗图 */
export function buildFunnelOption(input: FunnelChartInput, theme: ChartTheme): EChartsCoreOption {
  const nameKey = input.nameKey ?? 'name';
  const valueKey = input.valueKey ?? 'value';
  return {
    color: input.colors && input.colors.length > 0 ? input.colors : theme.palette,
    title: titleOption(input.title),
    tooltip: itemTooltip(theme),
    series: [
      {
        type: 'funnel',
        left: '12%',
        width: '76%',
        sort: input.sort ?? 'descending',
        gap: 2,
        label: { show: true, position: 'inside', color: theme.card },
        data: input.data.map((row) => ({ name: String(row[nameKey] ?? ''), value: toNumber(row[valueKey]) })),
      },
    ],
  } as EChartsCoreOption;
}

/** 仪表盘（thresholds 分段配色，末段兜底到 max） */
export function buildGaugeOption(input: GaugeChartInput, theme: ChartTheme): EChartsCoreOption {
  const min = input.min ?? 0;
  const max = input.max ?? 100;
  const span = max - min || 1;
  const defaultThresholds = [{ value: max, color: theme.palette[0] }];
  const stops = (input.thresholds && input.thresholds.length > 0 ? input.thresholds : defaultThresholds)
    .slice()
    .sort((a, b) => a.value - b.value)
    .map((t, index, arr) => {
      const upper = index < arr.length - 1 ? t.value : max;
      return [(upper - min) / span, t.color ?? theme.palette[0]] as [number, string];
    });
  return {
    title: titleOption(input.title),
    series: [
      {
        type: 'gauge',
        min,
        max,
        startAngle: 210,
        endAngle: -30,
        progress: { show: true, width: 10 },
        axisLine: { lineStyle: { width: 10, color: stops } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        pointer: { show: false },
        anchor: { show: false },
        title: { show: false },
        detail: {
          valueAnimation: true,
          offsetCenter: [0, 0],
          fontSize: 26,
          color: theme.foreground,
          formatter: (value: number) => `${value}${input.unit ?? ''}`,
        },
        data: [{ value: toNumber(input.value) }],
      },
    ],
  } as EChartsCoreOption;
}

function valueRange(values: number[]): { min: number; max: number } {
  if (values.length === 0) return { min: 0, max: 1 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  return max === min ? { min, max: min + 1 } : { min, max };
}

/** 热力图（x/y 类目二维 + visualMap 令牌色阶） */
export function buildHeatmapOption(input: HeatmapChartInput, theme: ChartTheme): EChartsCoreOption {
  const xKey = input.xKey ?? 'x';
  const yKey = input.yKey ?? 'y';
  const valueKey = input.valueKey ?? 'value';
  const xs = [...new Set(input.data.map((row) => String(row[xKey])))];
  const ys = [...new Set(input.data.map((row) => String(row[yKey])))];
  const range = valueRange(input.data.map((row) => toNumber(row[valueKey])));
  return {
    title: titleOption(input.title),
    grid: grid(),
    tooltip: itemTooltip(theme),
    xAxis: { type: 'category', data: xs, axisLabel: axisLabel(theme), splitArea: { show: true } },
    yAxis: { type: 'category', data: ys, axisLabel: axisLabel(theme), splitArea: { show: true } },
    visualMap: {
      min: range.min,
      max: range.max,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      textStyle: { color: theme.muted },
      inRange: { color: [theme.palette[2] ?? theme.palette[0]!, theme.palette[0]!] },
    },
    series: [
      {
        type: 'heatmap',
        data: input.data.map((row) => [String(row[xKey]), String(row[yKey]), toNumber(row[valueKey])]),
        label: { show: false },
      },
    ],
  } as EChartsCoreOption;
}

/** 树图（节点-连线层级树：根节点展开，曲线/折线连边，叶子节点着色） */
export function buildTreeOption(input: TreeChartInput, theme: ChartTheme): EChartsCoreOption {
  const horizontal = input.orient === 'horizontal';
  return {
    title: titleOption(input.title),
    tooltip: itemTooltip(theme),
    series: input.data.length === 0 ? [] : [
      {
        type: 'tree',
        data: input.data,
        layout: 'orthogonal',
        orient: horizontal ? 'LR' : 'TB',
        edgeShape: input.edgeShape ?? 'curve',
        roam: false,
        expandAndCollapse: true,
        initialTreeDepth: input.initialTreeDepth ?? 2,
        label: {
          show: true,
          position: horizontal ? 'right' : 'bottom',
          color: theme.foreground,
          fontSize: 12,
        },
        itemStyle: { color: theme.palette[0], borderColor: theme.palette[0] },
        lineStyle: { color: theme.border, width: 1.5, curveness: 0.5 },
        leaves: {
          itemStyle: { color: theme.palette[1], borderColor: theme.palette[1] },
        },
        emphasis: { focus: 'relative' },
      },
    ],
  } as EChartsCoreOption;
}

/** 桑基图（nodes/links 流向） */
export function buildSankeyOption(input: SankeyChartInput, theme: ChartTheme): EChartsCoreOption {
  return {
    color: theme.palette,
    title: titleOption(input.title),
    tooltip: itemTooltip(theme),
    series: input.nodes.length === 0 ? [] : [
      {
        type: 'sankey',
        left: 24,
        right: 64,
        top: 40,
        bottom: 24,
        nodeWidth: 16,
        nodeGap: 12,
        draggable: false,
        label: { color: theme.muted },
        lineStyle: { color: 'gradient', curveness: 0.5 },
        emphasis: { focus: 'adjacency' as const },
        data: input.nodes,
        links: input.links,
      },
    ],
  } as EChartsCoreOption;
}

/** 地图（mapName 需已注册或组件传入 geoJson 注册） */
export function buildMapOption(input: MapChartInput, theme: ChartTheme): EChartsCoreOption {
  const nameKey = input.nameKey ?? 'name';
  const valueKey = input.valueKey ?? 'value';
  const range = valueRange(input.data.map((row) => toNumber(row[valueKey])));
  return {
    title: titleOption(input.title),
    tooltip: itemTooltip(theme),
    visualMap: {
      min: range.min,
      max: range.max,
      left: 8,
      bottom: 8,
      textStyle: { color: theme.muted },
      inRange: { color: [theme.palette[2] ?? theme.palette[0]!, theme.palette[0]!] },
    },
    series: [
      {
        type: 'map',
        map: input.mapName,
        roam: false,
        label: { show: false },
        emphasis: { label: { show: true, color: theme.foreground } },
        itemStyle: { borderColor: theme.card, borderWidth: 1 },
        data: input.data.map((row) => ({ name: String(row[nameKey] ?? ''), value: toNumber(row[valueKey]) })),
      },
    ],
  } as EChartsCoreOption;
}

/** 组合图（声明式 series 描述，支持双数值轴） */
export function buildComposedOption(input: ComposedChartInput, theme: ChartTheme): EChartsCoreOption {
  const rows = input.data;
  const hasSecondAxis = input.series.some((s) => s.yAxisIndex === 1);
  const series = input.series.map((s, index) => {
    const color = pickColor(theme, input.colors, index);
    return {
      type: s.type === 'area' ? 'line' : s.type,
      name: s.name ?? s.dataKey,
      data: rows.map((row) => toNumber(row[s.dataKey])),
      ...(s.type === 'line' ? { smooth: false, symbolSize: 6 } : {}),
      ...(s.type === 'area' ? { areaStyle: { opacity: 0.25 } } : {}),
      yAxisIndex: s.yAxisIndex ?? 0,
      itemStyle: { color },
      ...(s.type !== 'bar' ? { lineStyle: { color } } : {}),
    };
  });
  return {
    color: input.colors && input.colors.length > 0 ? input.colors : theme.palette,
    title: titleOption(input.title),
    grid: grid(),
    tooltip: axisTooltip(theme),
    legend: legendOption(theme, true),
    xAxis: { type: 'category', data: rows.map((row) => String(input.xKey ? row[input.xKey] : '')), axisLabel: axisLabel(theme), axisLine: { lineStyle: { color: theme.border } } },
    yAxis: hasSecondAxis
      ? [
          { type: 'value', axisLabel: axisLabel(theme), splitLine: { lineStyle: { color: theme.border } } },
          { type: 'value', axisLabel: axisLabel(theme), splitLine: { show: false } },
        ]
      : { type: 'value', axisLabel: axisLabel(theme), splitLine: { lineStyle: { color: theme.border } } },
    series,
  } as EChartsCoreOption;
}
