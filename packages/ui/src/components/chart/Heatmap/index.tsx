import type { CSSProperties } from 'react';

import { EChartBase, type ChartSelectPayload } from '../EChartBase/index.js';
import { buildHeatmapOption } from '../lib/option-builders.js';
import { getChartTheme } from '../lib/theme.js';

/**
 * Heatmap 适配器（chart/ 组件集，echarts）：热力图，
 * x/y 二维类目密度展示，visualMap 色阶取主题令牌。
 */
export interface HeatmapProps {
  /** 数据行数组（每行 x / y / value） */
  data?: Record<string, unknown>[];
  /** 横轴类目字段，默认 x */
  xKey?: string;
  /** 纵轴类目字段，默认 y */
  yKey?: string;
  /** 数值字段，默认 value */
  valueKey?: string;
  /** 图表标题 */
  title?: string;
  /** 容器高度（px 或 CSS 长度），缺省 256 */
  height?: number | string;
  /** 点击单元格触发（DSL：events.onSelect → `${event}`） */
  onSelect?: (payload: ChartSelectPayload) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

export function Heatmap({
  data = [],
  xKey,
  yKey,
  valueKey,
  title,
  height,
  onSelect,
  className,
  style,
}: HeatmapProps) {
  const option = buildHeatmapOption(
    { data, xKey, yKey, valueKey, title },
    getChartTheme(),
  );
  return (
    <EChartBase
      slot="heatmap"
      option={option}
      height={height}
      onSelect={onSelect}
      className={className}
      style={style}
    />
  );
}
