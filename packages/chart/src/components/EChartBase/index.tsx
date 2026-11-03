import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { useI18n } from '@pactor-app/runtime';

import { cn } from '../../lib/utils.js';
import { echarts, type EChartsCoreOption } from '../echarts-modules.js';

/** 图表点击事件的规范化载荷（DSL 事件 `${event}` 值） */
export interface ChartSelectPayload {
  name?: unknown;
  value?: unknown;
  seriesName?: string;
  dataIndex?: number;
}

/** 保守空态判定：series 无法识别时不视为空（保持渲染现状）；
 *  所有系列的 data 均缺失或为空数组（含 series 本身为空数组）才判定空。
 *  地图系列（series.map）例外：空 data 仍会渲染底图轮廓，不视为空 */
function isEmptyOption(option: EChartsCoreOption): boolean {
  const series = (option as { series?: unknown }).series;
  if (!Array.isArray(series)) return false;
  if (series.some((item) => (item as { map?: unknown } | null)?.map)) return false;
  return series.every((item) => {
    const data = (item as { data?: unknown } | null)?.data;
    return !Array.isArray(data) || data.length === 0;
  });
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
 * 所有系列 data 均为空时渲染同高空态占位（data-slot="chart-empty"），
 * 数据到达后自动切换为图表（初始化 effect 依赖 empty）。
 */
export function EChartBase({
  option,
  height = 256,
  onSelect,
  className,
  style,
  slot,
}: EChartBaseProps) {
  const { t } = useI18n();
  const hostRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof echarts.init> | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const [failed, setFailed] = useState(false);
  const empty = isEmptyOption(option);

  useEffect(() => {
    if (empty) return;
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
    // empty 由 true 转 false 时图表容器才挂载，需要重新初始化
  }, [empty]);

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

  // 空数据占位：与图表同高（保持布局稳定），虚线面板 + 居中提示，
  // 避免渲染空白坐标系被误读为「图表坏了」
  if (empty) {
    return (
      <div
        data-slot="chart-empty"
        className={cn(
          'flex w-full items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground',
          className,
        )}
        style={{ height: typeof height === 'number' ? `${height}px` : height, ...style }}
      >
        {t('pactor.chart.empty')}
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
