import type { CSSProperties } from 'react';

import { EChartBase, type ChartSelectPayload } from '../EChartBase/index.js';
import { buildRadarOption } from '../lib/option-builders.js';
import { useChartTheme } from '../lib/use-chart-theme.js';

/**
 * RadarChart 适配器（chart/ 组件集，echarts）：雷达图，
 * 每行一个维度（indicatorKey），每列一个对比系列（yKeys）。
 */
export interface RadarChartProps {
  /** 数据行数组（每行一个雷达维度） */
  data?: Record<string, unknown>[];
  /** 维度名字段，默认 indicator */
  indicatorKey?: string;
  /** 系列字段（多列多维对比），默认 ['value'] */
  yKeys?: string[];
  /** 系列颜色覆盖（按序循环） */
  colors?: string[];
  /** 图表标题 */
  title?: string;
  /** 容器高度（px 或 CSS 长度），缺省 256 */
  height?: number | string;
  /** 点击触发（DSL：events.onSelect → `${event}`） */
  onSelect?: (payload: ChartSelectPayload) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

export function RadarChart({
  data = [],
  indicatorKey,
  yKeys,
  colors,
  title,
  height,
  onSelect,
  className,
  style,
}: RadarChartProps) {
  const option = buildRadarOption(
    { data, indicatorKey, yKeys, colors, title },
    useChartTheme(),
  );
  return (
    <EChartBase
      slot="radar-chart"
      option={option}
      height={height}
      onSelect={onSelect}
      className={className}
      style={style}
    />
  );
}
