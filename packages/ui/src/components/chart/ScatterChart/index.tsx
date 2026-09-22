import type { CSSProperties } from 'react';

import { EChartBase, type ChartSelectPayload } from '../EChartBase/index.js';
import { buildScatterOption } from '../lib/option-builders.js';
import { getChartTheme } from '../lib/theme.js';

/**
 * ScatterChart 适配器（chart/ 组件集，echarts）：散点图，
 * 展示两变量关系与分布，seriesKey 可按值拆分子系列。
 */
export interface ScatterChartProps {
  /** 数据行数组 */
  data?: Record<string, unknown>[];
  /** X 数值字段，默认 x */
  xKey?: string;
  /** Y 数值字段，默认 y */
  yKey?: string;
  /** 分组字段（按值拆系列，配图例） */
  seriesKey?: string;
  /** 系列颜色覆盖（按序循环） */
  colors?: string[];
  /** 图表标题 */
  title?: string;
  /** 容器高度（px 或 CSS 长度），缺省 256 */
  height?: number | string;
  /** 点击数据点触发（DSL：events.onSelect → `${event}`） */
  onSelect?: (payload: ChartSelectPayload) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

export function ScatterChart({
  data = [],
  xKey,
  yKey,
  seriesKey,
  colors,
  title,
  height,
  onSelect,
  className,
  style,
}: ScatterChartProps) {
  const option = buildScatterOption(
    { data, xKey, yKey, seriesKey, colors, title },
    getChartTheme(),
  );
  return (
    <EChartBase
      slot="scatter-chart"
      option={option}
      height={height}
      onSelect={onSelect}
      className={className}
      style={style}
    />
  );
}
