import type { CSSProperties } from 'react';

import { EChartBase, type ChartSelectPayload } from '../EChartBase/index.js';
import { buildLineOption } from '../lib/option-builders.js';
import { useChartTheme } from '../lib/use-chart-theme.js';

/**
 * LineChart 适配器（chart/ 组件集，echarts）：连续趋势折线，
 * 支持多系列 / 平滑 / 面积填充 / 堆叠。
 */
export interface LineChartProps {
  /** 数据行数组（通常为 `${data.xxx}` 表达式解析结果） */
  data?: Record<string, unknown>[];
  /** 类目字段 */
  xKey?: string;
  /** 数值字段（多系列传多个） */
  yKeys?: string[];
  /** 平滑曲线 */
  smooth?: boolean;
  /** 折线下方面积填充 */
  showArea?: boolean;
  /** 堆叠面积/折线 */
  stacked?: boolean;
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

export function LineChart({
  data = [],
  xKey,
  yKeys,
  smooth = false,
  showArea = false,
  stacked = false,
  colors,
  title,
  height,
  onSelect,
  className,
  style,
}: LineChartProps) {
  const option = buildLineOption(
    { data, xKey, yKeys, smooth, showArea, stacked, colors, title },
    useChartTheme(),
  );
  return (
    <EChartBase
      slot="line-chart"
      option={option}
      height={height}
      onSelect={onSelect}
      className={className}
      style={style}
    />
  );
}
