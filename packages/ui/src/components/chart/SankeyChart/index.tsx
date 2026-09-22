import type { CSSProperties } from 'react';

import { EChartBase, type ChartSelectPayload } from '../EChartBase/index.js';
import { buildSankeyOption } from '../lib/option-builders.js';
import { getChartTheme } from '../lib/theme.js';

/**
 * SankeyChart 适配器（chart/ 组件集，echarts）：桑基图，
 * 展示节点之间的流向与规模。
 */
export interface SankeyChartProps {
  /** 节点数组 */
  nodes?: { name: string }[];
  /** 流向边：source → target 及数值 */
  links?: { source: string; target: string; value: number }[];
  /** 图表标题 */
  title?: string;
  /** 容器高度（px 或 CSS 长度），缺省 256 */
  height?: number | string;
  /** 点击节点或边触发（DSL：events.onSelect → `${event}`） */
  onSelect?: (payload: ChartSelectPayload) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

export function SankeyChart({
  nodes = [],
  links = [],
  title,
  height,
  onSelect,
  className,
  style,
}: SankeyChartProps) {
  const option = buildSankeyOption({ nodes, links, title }, getChartTheme());
  return (
    <EChartBase
      slot="sankey-chart"
      option={option}
      height={height}
      onSelect={onSelect}
      className={className}
      style={style}
    />
  );
}
