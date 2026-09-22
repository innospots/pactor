import type { CSSProperties } from 'react';

import { EChartBase, type ChartSelectPayload } from '../EChartBase/index.js';
import { buildFunnelOption } from '../lib/option-builders.js';
import { getChartTheme } from '../lib/theme.js';

/**
 * FunnelChart 适配器（chart/ 组件集，echarts）：漏斗图，
 * 展示流程阶段转化，支持降序 / 升序 / 输入顺序排列。
 */
export interface FunnelChartProps {
  /** 阶段数据行数组 */
  data?: Record<string, unknown>[];
  /** 阶段名字段，默认 name */
  nameKey?: string;
  /** 阶段数值字段，默认 value */
  valueKey?: string;
  /** 排序方式：降序（大在上，缺省）/ 升序 / 输入顺序 */
  sort?: 'descending' | 'ascending' | 'none';
  /** 系列颜色覆盖（按序循环） */
  colors?: string[];
  /** 图表标题 */
  title?: string;
  /** 容器高度（px 或 CSS 长度），缺省 256 */
  height?: number | string;
  /** 点击阶段触发（DSL：events.onSelect → `${event}`） */
  onSelect?: (payload: ChartSelectPayload) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

export function FunnelChart({
  data = [],
  nameKey,
  valueKey,
  sort,
  colors,
  title,
  height,
  onSelect,
  className,
  style,
}: FunnelChartProps) {
  const option = buildFunnelOption(
    { data, nameKey, valueKey, sort, colors, title },
    getChartTheme(),
  );
  return (
    <EChartBase
      slot="funnel-chart"
      option={option}
      height={height}
      onSelect={onSelect}
      className={className}
      style={style}
    />
  );
}
