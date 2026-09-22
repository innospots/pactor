import type { CSSProperties } from 'react';

import { EChartBase, type ChartSelectPayload } from '../EChartBase/index.js';
import { buildColumnOption } from '../lib/option-builders.js';
import { getChartTheme } from '../lib/theme.js';

/**
 * ColumnChart 适配器（chart/ 组件集，echarts）：垂直柱状图，
 * 支持多系列 / 堆叠，适用于离散类目比较。
 */
export interface ColumnChartProps {
  /** 数据行数组 */
  data?: Record<string, unknown>[];
  /** 类目字段 */
  xKey?: string;
  /** 数值字段（多系列传多个） */
  yKeys?: string[];
  /** 堆叠柱 */
  stacked?: boolean;
  /** 系列颜色覆盖（按序循环） */
  colors?: string[];
  /** 图表标题 */
  title?: string;
  /** 容器高度（px 或 CSS 长度），缺省 256 */
  height?: number | string;
  /** 点击柱子触发（DSL：events.onSelect → `${event}`） */
  onSelect?: (payload: ChartSelectPayload) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

export function ColumnChart({
  data = [],
  xKey,
  yKeys,
  stacked = false,
  colors,
  title,
  height,
  onSelect,
  className,
  style,
}: ColumnChartProps) {
  const option = buildColumnOption(
    { data, xKey, yKeys, stacked, colors, title },
    getChartTheme(),
  );
  return (
    <EChartBase
      slot="column-chart"
      option={option}
      height={height}
      onSelect={onSelect}
      className={className}
      style={style}
    />
  );
}
