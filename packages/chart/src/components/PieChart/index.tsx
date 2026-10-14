import type { CSSProperties } from 'react';

import { EChartBase, type ChartSelectPayload } from '../EChartBase/index.js';
import { buildPieOption } from '../lib/option-builders.js';
import { useChartTheme } from '../lib/use-chart-theme.js';

/**
 * PieChart 适配器（chart/ 组件集，echarts）：饼图，
 * 适用于少量类别的构成展示。
 */
export interface PieChartProps {
  /** 切片数据行数组 */
  data?: Record<string, unknown>[];
  /** 切片名称字段，默认 name */
  nameKey?: string;
  /** 切片数值字段，默认 value */
  valueKey?: string;
  /** 是否显示切片标签 */
  showLabel?: boolean;
  /** 系列颜色覆盖（按序循环） */
  colors?: string[];
  /** 图表标题 */
  title?: string;
  /** 容器高度（px 或 CSS 长度），缺省 256 */
  height?: number | string;
  /** 点击切片触发（DSL：events.onSelect → `${event}`） */
  onSelect?: (payload: ChartSelectPayload) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

export function PieChart({
  data = [],
  nameKey,
  valueKey,
  showLabel,
  colors,
  title,
  height,
  onSelect,
  className,
  style,
}: PieChartProps) {
  const option = buildPieOption(
    { data, nameKey, valueKey, showLabel, colors, title },
    useChartTheme(),
  );
  return (
    <EChartBase
      slot="pie-chart"
      option={option}
      height={height}
      onSelect={onSelect}
      className={className}
      style={style}
    />
  );
}
