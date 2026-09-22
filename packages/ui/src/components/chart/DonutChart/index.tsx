import type { CSSProperties } from 'react';

import { EChartBase, type ChartSelectPayload } from '../EChartBase/index.js';
import { buildDonutOption } from '../lib/option-builders.js';
import { getChartTheme } from '../lib/theme.js';

/**
 * DonutChart 适配器（chart/ 组件集，echarts）：环形图，
 * 中心可展示关键指标（centerLabel / centerValue）。
 */
export interface DonutChartProps {
  /** 切片数据行数组 */
  data?: Record<string, unknown>[];
  /** 切片名称字段，默认 name */
  nameKey?: string;
  /** 切片数值字段，默认 value */
  valueKey?: string;
  /** 内半径（px 或百分比串），默认 '48%' */
  innerRadius?: number | string;
  /** 外半径，默认 '72%' */
  outerRadius?: number | string;
  /** 中心指标名（如 "总计"） */
  centerLabel?: string;
  /** 中心指标值 */
  centerValue?: number | string;
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

export function DonutChart({
  data = [],
  nameKey,
  valueKey,
  innerRadius,
  outerRadius,
  centerLabel,
  centerValue,
  showLabel,
  colors,
  title,
  height,
  onSelect,
  className,
  style,
}: DonutChartProps) {
  const option = buildDonutOption(
    {
      data,
      nameKey,
      valueKey,
      innerRadius,
      outerRadius,
      centerLabel,
      centerValue,
      showLabel,
      colors,
      title,
    },
    getChartTheme(),
  );
  return (
    <EChartBase
      slot="donut-chart"
      option={option}
      height={height}
      onSelect={onSelect}
      className={className}
      style={style}
    />
  );
}
