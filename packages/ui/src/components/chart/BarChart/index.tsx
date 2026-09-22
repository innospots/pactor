import type { CSSProperties } from 'react';

import { EChartBase, type ChartSelectPayload } from '../EChartBase/index.js';
import { buildBarOption } from '../lib/option-builders.js';
import { getChartTheme } from '../lib/theme.js';

/**
 * BarChart 适配器（chart/ 组件集，echarts）：横向条形图，
 * 适用于长分类名称的横向比较（yKey 类目 + xKeys 数值）。
 */
export interface BarChartProps {
  /** 数据行数组 */
  data?: Record<string, unknown>[];
  /** 类目字段（纵轴） */
  yKey?: string;
  /** 数值字段（横轴，多系列传多个） */
  xKeys?: string[];
  /** 堆叠条 */
  stacked?: boolean;
  /** 系列颜色覆盖（按序循环） */
  colors?: string[];
  /** 图表标题 */
  title?: string;
  /** 容器高度（px 或 CSS 长度），缺省 256 */
  height?: number | string;
  /** 点击条块触发（DSL：events.onSelect → `${event}`） */
  onSelect?: (payload: ChartSelectPayload) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

export function BarChart({
  data = [],
  yKey,
  xKeys,
  stacked = false,
  colors,
  title,
  height,
  onSelect,
  className,
  style,
}: BarChartProps) {
  const option = buildBarOption(
    { data, yKey, yKeys: xKeys, stacked, colors, title },
    getChartTheme(),
  );
  return (
    <EChartBase
      slot="bar-chart"
      option={option}
      height={height}
      onSelect={onSelect}
      className={className}
      style={style}
    />
  );
}
