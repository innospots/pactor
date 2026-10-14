import { useEffect, useState, type CSSProperties } from 'react';

import { Empty } from '../../components/Empty/index.js';
import { echarts } from '../echarts-modules.js';
import { EChartBase, type ChartSelectPayload } from '../EChartBase/index.js';
import { buildMapOption } from '../lib/option-builders.js';
import { useChartTheme } from '../lib/use-chart-theme.js';

/**
 * MapChart 适配器（chart/ 组件集，echarts）：地图，
 * 展示地理分布与区域比较（世界地图 / 国家地图 / 其他区域地图）。
 * 地图数据三种供给方式（优先级从高到低）：
 * - `geoJson`：内联 GeoJSON 对象，渲染期同步注册（幂等，StrictMode 安全）；
 * - `geoJsonUrl`：GeoJSON 资源地址，组件 fetch 后注册（按 mapName 缓存，
 *   同一地图多处复用只请求一次）；
 * - 两者都不传时要求 `mapName` 已注册（如应用启动时统一 registerMap）。
 * 未注册渲染 Empty 占位并 console.warn，不抛错。
 */
export interface MapChartProps {
  /** echarts 地图名 */
  mapName?: string;
  /** 区域数据行数组（区域名 + 数值） */
  data?: Record<string, unknown>[];
  /** 区域名字段，默认 name */
  nameKey?: string;
  /** 区域数值字段，默认 value */
  valueKey?: string;
  /** GeoJSON 地图数据（传入即注册到 echarts，优先于 geoJsonUrl） */
  geoJson?: Record<string, unknown>;
  /** GeoJSON 资源地址（组件 fetch 后注册到 echarts） */
  geoJsonUrl?: string;
  /** 图表标题 */
  title?: string;
  /** 容器高度（px 或 CSS 长度），缺省 256 */
  height?: number | string;
  /** 点击区域触发（DSL：events.onSelect → `${event}`） */
  onSelect?: (payload: ChartSelectPayload) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/** 已通过 geoJsonUrl 注册成功的地图缓存（避免重复请求） */
const fetchedMaps = new Set<string>();

function hasRegisteredMap(mapName: string): boolean {
  try {
    return typeof echarts.getMap === 'function' && echarts.getMap(mapName) != null;
  } catch {
    return false;
  }
}

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

export function MapChart({
  mapName = 'map',
  data = [],
  nameKey,
  valueKey,
  geoJson,
  geoJsonUrl,
  title,
  height,
  onSelect,
  className,
  style,
}: MapChartProps) {
  const theme = useChartTheme();
  const [loadState, setLoadState] = useState<LoadState>(() =>
    geoJson || !geoJsonUrl || hasRegisteredMap(mapName) ? 'idle' : 'loading',
  );

  if (geoJson) {
    // 渲染期同步注册（幂等，StrictMode 双渲染安全）：
    // 保证子层 EChartBase 初始化 setOption 时地图已可用
    try {
      echarts.registerMap(mapName, geoJson as never);
    } catch {
      // 数据非法时交由下方降级分支处理
    }
  }

  useEffect(() => {
    if (geoJson || !geoJsonUrl || hasRegisteredMap(mapName) || fetchedMaps.has(mapName)) {
      setLoadState('idle');
      return;
    }
    let cancelled = false;
    setLoadState('loading');
    fetch(geoJsonUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: unknown) => {
        if (cancelled) return;
        echarts.registerMap(mapName, json as never);
        fetchedMaps.add(mapName);
        setLoadState('ready');
      })
      .catch(() => {
        if (cancelled) return;
        // eslint-disable-next-line no-console
        console.warn(`[MapChart] 地图数据加载失败：${geoJsonUrl}`);
        setLoadState('error');
      });
    return () => {
      cancelled = true;
    };
  }, [geoJson, geoJsonUrl, mapName]);

  if (geoJsonUrl && !geoJson && loadState === 'loading') {
    return (
      <div
        data-slot="map-chart-loading"
        className={className}
        style={{ height: typeof height === 'number' ? `${height}px` : (height ?? 256), ...style }}
      />
    );
  }

  if (!geoJson && loadState === 'error') {
    return (
      <Empty
        title="地图加载失败"
        description="请检查 geoJsonUrl 网络可达性，或改用 geoJson / 预注册地图"
        className={className}
        style={style}
      />
    );
  }

  if (!geoJson && !hasRegisteredMap(mapName)) {
    // eslint-disable-next-line no-console
    console.warn(`[MapChart] 地图 "${mapName}" 未注册：请传入 geoJson / geoJsonUrl，或在应用启动时 echarts.registerMap`);
    return (
      <Empty
        title="地图未注册"
        description="请传入 geoJson / geoJsonUrl，或在应用启动时注册地图数据"
        className={className}
        style={style}
      />
    );
  }

  const option = buildMapOption({ mapName, data, nameKey, valueKey, title }, theme);
  return (
    <EChartBase
      slot="map-chart"
      option={option}
      height={height}
      onSelect={onSelect}
      className={className}
      style={style}
    />
  );
}
