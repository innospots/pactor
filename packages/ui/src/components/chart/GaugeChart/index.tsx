import type { CSSProperties } from 'react';

import { EChartBase, type ChartSelectPayload } from '../EChartBase/index.js';
import { buildGaugeOption } from '../lib/option-builders.js';
import { getChartTheme } from '../lib/theme.js';

/**
 * GaugeChart 适配器（chart/ 组件集，echarts）：仪表盘，
 * 单指标区间状态展示，阈值分段配色（语义色令牌）。
 */
export interface GaugeChartProps {
  /** 当前值 */
  value?: number;
  /** 量程下限，默认 0 */
  min?: number;
  /** 量程上限，默认 100 */
  max?: number;
  /** 阈值区间：按 value 上限分段配色（颜色缺省取主题色板首色），末段兜底到 max */
  thresholds?: { value: number; color?: string }[];
  /** 数值单位后缀（如 %） */
  unit?: string;
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

export function GaugeChart({
  value = 0,
  min,
  max,
  thresholds,
  unit,
  title,
  height,
  onSelect,
  className,
  style,
}: GaugeChartProps) {
  const option = buildGaugeOption(
    { value, min, max, thresholds, unit, title },
    getChartTheme(),
  );
  return (
    <EChartBase
      slot="gauge-chart"
      option={option}
      height={height}
      onSelect={onSelect}
      className={className}
      style={style}
    />
  );
}
