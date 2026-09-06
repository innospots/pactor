import type { CSSProperties } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { cn } from '../../../lib/utils.js';
import { ChartContainer, chartColor } from '../../../ui/chart.js';

/** 图表类型 */
export type ChartType = 'line' | 'bar' | 'area' | 'pie';

export interface ChartProps {
  /** 图表类型：line / bar / area / pie */
  chartType: ChartType;
  /** 数据数组（通常为 `${data.xxx}` 表达式解析结果） */
  data?: Record<string, unknown>[];
  /** 类目/名称字段（pie 时为切片 name 字段） */
  xKey?: string;
  /** 数值字段（多系列传多个；pie 取第一个作为 value 字段） */
  yKeys?: string[];
  /** 系列颜色（按序循环），缺省使用 chart-1..5 语义令牌 */
  colors?: string[];
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * Chart 适配器（shadcn kit，recharts 薄封装）：以受限框架级 props
 * （chartType / data / xKey / yKeys / colors）渲染 line/bar/area/pie
 * 图表，不透传 recharts 自由组合 API；缺省配色取 chart-1..5 令牌；
 * 多系列（yKeys > 1）或 pie 时渲染 Legend。
 */
export function Chart({
  chartType,
  data = [],
  xKey,
  yKeys = [],
  colors,
  className,
  style,
}: ChartProps) {
  const series = yKeys.length > 0 ? yKeys : ['value'];

  return (
    <div
      data-slot="chart"
      data-chart-type={chartType}
      className={cn('w-full', className)}
      style={style}
    >
      <ChartContainer>
        {chartType === 'pie' ? (
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              data={data}
              dataKey={series[0]}
              nameKey={xKey}
              innerRadius={0}
              outerRadius="80%"
              isAnimationActive={false}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={chartColor(index, colors)} />
              ))}
            </Pie>
          </PieChart>
        ) : chartType === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            {series.length > 1 ? <Legend /> : null}
            {series.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={key}
                stroke={chartColor(index, colors)}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        ) : chartType === 'area' ? (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            {series.length > 1 ? <Legend /> : null}
            {series.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                name={key}
                stroke={chartColor(index, colors)}
                fill={chartColor(index, colors)}
                fillOpacity={0.3}
                isAnimationActive={false}
              />
            ))}
          </AreaChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            {series.length > 1 ? <Legend /> : null}
            {series.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                name={key}
                fill={chartColor(index, colors)}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        )}
      </ChartContainer>
    </div>
  );
}
