import type { CSSProperties } from 'react';

import { EChartBase, type ChartSelectPayload } from '../EChartBase/index.js';
import { buildTreeOption } from '../lib/option-builders.js';
import { getChartTheme } from '../lib/theme.js';

/**
 * TreeChart 适配器（chart/ 组件集，echarts）：树图，
 * 节点-连线层级树（对齐 echarts 2.2.4 tree 系列形态）：
 * 根节点定位布局，曲线/折线连边，叶子节点着色，支持展开方向与
 * 初始展开深度配置。
 */
export interface TreeChartProps {
  /** 层级数据：通常为单根 [{ name, children: [...] }] */
  data?: Record<string, unknown>[];
  /** 图表标题 */
  title?: string;
  /** 展开方向：vertical 根在上向下（缺省）/ horizontal 根在左向右 */
  orient?: 'vertical' | 'horizontal';
  /** 连线形状：曲线（缺省）/ 折线 */
  edgeShape?: 'curve' | 'polyline';
  /** 初始展开的层级深度，缺省 2；-1 表示全部展开 */
  initialTreeDepth?: number;
  /** 容器高度（px 或 CSS 长度），缺省 256 */
  height?: number | string;
  /** 点击节点触发（DSL：events.onSelect → `${event}`） */
  onSelect?: (payload: ChartSelectPayload) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

export function TreeChart({
  data = [],
  title,
  orient,
  edgeShape,
  initialTreeDepth,
  height,
  onSelect,
  className,
  style,
}: TreeChartProps) {
  const option = buildTreeOption(
    { data, title, orient, edgeShape, initialTreeDepth },
    getChartTheme(),
  );
  return (
    <EChartBase
      slot="tree-chart"
      option={option}
      height={height}
      onSelect={onSelect}
      className={className}
      style={style}
    />
  );
}
