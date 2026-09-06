import * as React from 'react';
import { ResponsiveContainer } from 'recharts';

import { cn } from '../lib/utils.js';

/** 默认图表配色：chart-1..5 语义令牌（按序循环取色） */
export const CHART_TOKEN_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
] as const;

/** 取第 index 个系列的颜色：优先 colors 覆盖，缺省回退 chart-1..5 令牌 */
export function chartColor(index: number, colors?: string[]): string {
  if (colors && colors.length > 0) {
    return colors[index % colors.length]!;
  }
  return CHART_TOKEN_COLORS[index % CHART_TOKEN_COLORS.length]!;
}

/**
 * shadcn chart 模式容器（vendored 薄封装）：固定高度 + 横向自适应
 * （内部为 recharts ResponsiveContainer），子节点为单个图表元素。
 */
function ChartContainer({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="chart-container"
      className={cn('h-64 w-full', className)}
      {...props}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}

export { ChartContainer };
