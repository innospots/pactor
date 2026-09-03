import type { CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';

export interface StatisticProps {
  /** 指标标题 */
  title?: string;
  /** 指标数值（通常为表达式解析后的数字） */
  value?: number | string;
  /** 小数精度 */
  precision?: number;
  /** 后缀（如单位） */
  suffix?: string;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/** Statistic 适配器（shadcn kit）：标题 + 数值（precision 精度 / suffix 后缀） */
export function Statistic({ title, value, precision, suffix, className, style }: StatisticProps) {
  const display =
    typeof value === 'number' && precision !== undefined
      ? value.toFixed(precision)
      : value;
  return (
    <div data-slot="statistic" className={cn(className)} style={style}>
      {title ? (
        <div data-slot="statistic-title" className="text-sm text-muted-foreground">
          {title}
        </div>
      ) : null}
      <div data-slot="statistic-value" className="text-2xl font-bold tabular-nums">
        {display}
        {suffix ? (
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}
