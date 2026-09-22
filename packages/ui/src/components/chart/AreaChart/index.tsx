import type { CSSProperties } from 'react';

import { EChartBase, type ChartSelectPayload } from '../EChartBase/index.js';
import { buildAreaOption } from '../lib/option-builders.js';
import { getChartTheme } from '../lib/theme.js';

/**
 * AreaChart 适配器（chart/ 组件集，echarts）：面积图，
 * 强调趋势与累计规模，支持多系列 / 堆叠 / 填充不透明度。
 */
export interface AreaChartProps {
  /** 数据行数组 */
  data?: Record<string, unknown>[];
  /** 类目字段 */
  xKey?: string;
  /** 数值字段（多系列传多个） */
  yKeys?: string[];
  /** 堆叠面积 */
  stacked?: boolean;
  /** 填充不透明度（0-1），缺省 0.25 */
  fillOpacity?: number;
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

export function AreaChart({
  data = [],
  xKey,
  yKeys,
  stacked = false,
  fillOpacity,
  colors,
  title,
  height,
  onSelect,
  className,
  style,
}: AreaChartProps) {
  const option = buildAreaOption(
    { data, xKey, yKeys, stacked, fillOpacity, colors, title },
    getChartTheme(),
  );
  return (
    <EChartBase
      slot="area-chart"
      option={option}
      height={height}
      onSelect={onSelect}
      className={className}
      style={style}
    />
  );
}
