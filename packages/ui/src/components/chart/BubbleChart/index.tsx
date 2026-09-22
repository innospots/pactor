import type { CSSProperties } from 'react';

import { EChartBase, type ChartSelectPayload } from '../EChartBase/index.js';
import { buildBubbleOption } from '../lib/option-builders.js';
import { getChartTheme } from '../lib/theme.js';

/**
 * BubbleChart 适配器（chart/ 组件集，echarts）：气泡图，
 * 在两变量关系上叠加第三变量（sizeKey）映射气泡大小。
 */
export interface BubbleChartProps {
  /** 数据行数组 */
  data?: Record<string, unknown>[];
  /** X 数值字段，默认 x */
  xKey?: string;
  /** Y 数值字段，默认 y */
  yKey?: string;
  /** 气泡大小字段（第三变量），默认 size */
  sizeKey?: string;
  /** 分组字段（按值拆系列） */
  seriesKey?: string;
  /** 系列颜色覆盖（按序循环） */
  colors?: string[];
  /** 图表标题 */
  title?: string;
  /** 容器高度（px 或 CSS 长度），缺省 256 */
  height?: number | string;
  /** 点击气泡触发（DSL：events.onSelect → `${event}`） */
  onSelect?: (payload: ChartSelectPayload) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

export function BubbleChart({
  data = [],
  xKey,
  yKey,
  sizeKey,
  seriesKey,
  colors,
  title,
  height,
  onSelect,
  className,
  style,
}: BubbleChartProps) {
  const option = buildBubbleOption(
    { data, xKey, yKey, sizeKey, seriesKey, colors, title },
    getChartTheme(),
  );
  return (
    <EChartBase
      slot="bubble-chart"
      option={option}
      height={height}
      onSelect={onSelect}
      className={className}
      style={style}
    />
  );
}
