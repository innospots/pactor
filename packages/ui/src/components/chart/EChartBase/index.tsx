import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { echarts, type EChartsCoreOption } from '../echarts-modules.js';

/** 图表点击事件的规范化载荷（DSL 事件 `${event}` 值） */
export interface ChartSelectPayload {
  name?: unknown;
  value?: unknown;
  seriesName?: string;
  dataIndex?: number;
}

export interface EChartBaseProps {
  /** echarts option（由 option-builders 纯函数生成） */
  option: EChartsCoreOption;
  /** 容器高度：数字按 px，缺省 256 */
  height?: number | string;
  /** 点击图表元素（柱子 / 折线点 / 扇区等）触发，映射 echarts click */
  onSelect?: (payload: ChartSelectPayload) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
  /** 根节点 data-slot 标识（组件名 kebab） */
  slot: string;
}

/**
 * 图表渲染基础件（chart/ 组件集共享，不注册为 DSL 组件）：
 * 懒初始化 echarts 实例、notMerge 全量更新 option、
 * ResizeObserver 自适应、卸载销毁；初始化失败（如无 canvas 环境）
 * 降级为占位提示。SSR 下仅渲染空容器，effect 不执行。
 */
export function EChartBase({
  option,
  height = 256,
  onSelect,
  className,
  style,
  slot,
}: EChartBaseProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof echarts.init> | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let chart: ReturnType<typeof echarts.init> | null = null;
    try {
      chart = echarts.init(host);
    } catch {
      setFailed(true);
      return;
    }
    chartRef.current = chart;
    chart.on('click', (params: {
      name?: unknown;
      value?: unknown;
      seriesName?: string;
      dataIndex?: number;
    }) => {
      onSelectRef.current?.({
        name: params.name,
        value: params.value,
        seriesName: params.seriesName,
        dataIndex: params.dataIndex,
      });
    });
    const observer = new ResizeObserver(() => chart?.resize());
    observer.observe(host);
    return () => {
      observer.disconnect();
      chart?.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    try {
      chartRef.current?.setOption(option, { notMerge: true });
    } catch {
      // 实例初始化失败时静默忽略（降级占位已展示）
    }
  }, [option]);

  if (failed) {
    return (
      <div
        data-slot="chart-fallback"
        className={cn(
          'flex h-32 w-full items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground',
          className,
        )}
        style={style}
      >
        当前环境不支持图表渲染
      </div>
    );
  }

  return (
    <div
      ref={hostRef}
      data-slot={slot}
      className={cn('w-full', className)}
      style={{ height: typeof height === 'number' ? `${height}px` : height, ...style }}
    />
  );
}
