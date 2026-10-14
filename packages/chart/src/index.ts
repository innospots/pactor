/**
 * @pactor-app/chart：echarts 渲染的 DSL 图表组件集。
 * 从 @pactor-app/ui 拆出（独立包），图表组件不再进 ui 主注册表；
 * 需要图表的接入方用 registerChartComponents 合并进既有 ComponentRegistry，
 * 或直接用 createChartComponentRegistry 创建纯图表注册表。
 */
import { Registry } from '@pactor-app/core';
import type { ComponentRegistry } from '@pactor-app/runtime';

import { MetricCard } from './components/MetricCard/index.js';
import { LineChart } from './components/LineChart/index.js';
import { ColumnChart } from './components/ColumnChart/index.js';
import { BarChart } from './components/BarChart/index.js';
import { AreaChart } from './components/AreaChart/index.js';
import { PieChart } from './components/PieChart/index.js';
import { DonutChart } from './components/DonutChart/index.js';
import { ScatterChart } from './components/ScatterChart/index.js';
import { BubbleChart } from './components/BubbleChart/index.js';
import { RadarChart } from './components/RadarChart/index.js';
import { FunnelChart } from './components/FunnelChart/index.js';
import { GaugeChart } from './components/GaugeChart/index.js';
import { Heatmap } from './components/Heatmap/index.js';
import { TreeChart } from './components/TreeChart/index.js';
import { SankeyChart } from './components/SankeyChart/index.js';
import { MapChart } from './components/MapChart/index.js';
import { ComposedChart } from './components/ComposedChart/index.js';

export { MetricCard } from './components/MetricCard/index.js';
export type { MetricCardProps } from './components/MetricCard/index.js';
export { LineChart } from './components/LineChart/index.js';
export type { LineChartProps } from './components/LineChart/index.js';
export { ColumnChart } from './components/ColumnChart/index.js';
export type { ColumnChartProps } from './components/ColumnChart/index.js';
export { BarChart } from './components/BarChart/index.js';
export type { BarChartProps } from './components/BarChart/index.js';
export { AreaChart } from './components/AreaChart/index.js';
export type { AreaChartProps } from './components/AreaChart/index.js';
export { PieChart } from './components/PieChart/index.js';
export type { PieChartProps } from './components/PieChart/index.js';
export { DonutChart } from './components/DonutChart/index.js';
export type { DonutChartProps } from './components/DonutChart/index.js';
export { ScatterChart } from './components/ScatterChart/index.js';
export type { ScatterChartProps } from './components/ScatterChart/index.js';
export { BubbleChart } from './components/BubbleChart/index.js';
export type { BubbleChartProps } from './components/BubbleChart/index.js';
export { RadarChart } from './components/RadarChart/index.js';
export type { RadarChartProps } from './components/RadarChart/index.js';
export { FunnelChart } from './components/FunnelChart/index.js';
export type { FunnelChartProps } from './components/FunnelChart/index.js';
export { GaugeChart } from './components/GaugeChart/index.js';
export type { GaugeChartProps } from './components/GaugeChart/index.js';
export { Heatmap } from './components/Heatmap/index.js';
export type { HeatmapProps } from './components/Heatmap/index.js';
export { TreeChart } from './components/TreeChart/index.js';
export type { TreeChartProps } from './components/TreeChart/index.js';
export { SankeyChart } from './components/SankeyChart/index.js';
export type { SankeyChartProps } from './components/SankeyChart/index.js';
export { MapChart } from './components/MapChart/index.js';
export type { MapChartProps } from './components/MapChart/index.js';
export { ComposedChart } from './components/ComposedChart/index.js';
export type { ComposedChartProps, ComposedSeriesItem } from './components/ComposedChart/index.js';
export { EChartBase } from './components/EChartBase/index.js';
export type { ChartSelectPayload, EChartBaseProps } from './components/EChartBase/index.js';

/**
 * DSL 类型名 → 组件映射。
 * 交互事件经 echarts click → onSelect，DSL 用 events.onSelect + ${event}。
 */
export const chartComponents = {
  MetricCard,
  LineChart,
  ColumnChart,
  BarChart,
  AreaChart,
  PieChart,
  DonutChart,
  ScatterChart,
  BubbleChart,
  RadarChart,
  FunnelChart,
  GaugeChart,
  Heatmap,
  TreeChart,
  SankeyChart,
  MapChart,
  ComposedChart,
} as const;

/** 把图表组件集按 DSL 类型名注册到给定 ComponentRegistry（可与 ui 主注册表合并） */
export function registerChartComponents(registry: ComponentRegistry): void {
  for (const [type, component] of Object.entries(chartComponents)) {
    registry.register(type, component);
  }
}

/** 创建只注册了图表组件集的新 ComponentRegistry */
export function createChartComponentRegistry(): ComponentRegistry {
  const registry = new Registry<unknown>('ComponentRegistry');
  registerChartComponents(registry);
  return registry;
}
