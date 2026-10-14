import type { CSSProperties } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

import { cn } from '../../lib/utils.js';

/**
 * MetricCard 适配器（chart/ 组件集）：单指标卡——标题 + 大数值 +
 * 趋势箭头（语义色令牌）。数据可视化看板的顶层概览单元。
 */
export interface MetricCardProps {
  /** 指标标题 */
  title?: string;
  /** 指标数值（通常为表达式解析后的数字） */
  value?: number | string;
  /** 前缀（如 ¥） */
  prefix?: string;
  /** 后缀（如单位） */
  suffix?: string;
  /** 趋势百分比：正数升（success），负数降（destructive），0 / 缺省不展示 */
  trend?: number;
  /** 趋势对比说明（如 "较上月"） */
  trendLabel?: string;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

export function MetricCard({
  title,
  value,
  prefix,
  suffix,
  trend,
  trendLabel,
  className,
  style,
}: MetricCardProps) {
  const showTrend = typeof trend === 'number' && trend !== 0;
  const rising = (trend ?? 0) > 0;
  return (
    <div
      data-slot="metric-card"
      className={cn('rounded-lg border bg-card p-4 text-card-foreground shadow-sm', className)}
      style={style}
    >
      {title ? (
        <div data-slot="metric-card-title" className="text-sm text-muted-foreground">
          {title}
        </div>
      ) : null}
      <div
        data-slot="metric-card-value"
        className="mt-1 text-2xl font-semibold tracking-tight tabular-nums"
      >
        {prefix}
        {value}
        {suffix}
      </div>
      {showTrend ? (
        <div
          data-slot="metric-card-trend"
          data-trend={rising ? 'up' : 'down'}
          className={cn(
            'mt-1 inline-flex items-center gap-0.5 text-sm',
            rising ? 'text-success' : 'text-destructive',
          )}
        >
          {rising ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
          {Math.abs(trend ?? 0)}%
          {trendLabel ? (
            <span className="ml-1 text-muted-foreground">{trendLabel}</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
