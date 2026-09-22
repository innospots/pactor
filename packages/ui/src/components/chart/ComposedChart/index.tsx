import type { CSSProperties } from 'react';

import { EChartBase, type ChartSelectPayload } from '../EChartBase/index.js';
import { buildComposedOption, type ComposedSeriesItem } from '../lib/option-builders.js';
import { getChartTheme } from '../lib/theme.js';

export type { ComposedSeriesItem } from '../lib/option-builders.js';

/**
 * ComposedChart 适配器（chart/ 组件集，echarts）：组合图，
 * 声明式 series 描述混合折线/柱/面积，支持双数值轴。
 */
export interface ComposedChartProps {
  /** 数据行数组 */
  data?: Record<string, unknown>[];
  /** 类目字段 */
  xKey?: string;
  /** 系列描述数组（图型 + 数据字段，可指定副轴） */
  series?: ComposedSeriesItem[];
  /** 系列颜色覆盖（按序循环） */
  colors?: string[];
  /** 图表标题 */
  title?: string;
  /** 容器高度（px 或 CSS 长度），缺省 256 */
  height?: number | string;
  /** 点击图元触发（DSL：events.onSelect → `${event}`） */
  onSelect?: (payload: ChartSelectPayload) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

export function ComposedChart({
  data = [],
  xKey,
  series = [],
  colors,
  title,
  height,
  onSelect,
  className,
  style,
}: ComposedChartProps) {
  const option = buildComposedOption(
    { data, xKey, series, colors, title },
    getChartTheme(),
  );
  return (
    <EChartBase
      slot="composed-chart"
      option={option}
      height={height}
      onSelect={onSelect}
      className={className}
      style={style}
    />
  );
}
