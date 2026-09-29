import { useSyncExternalStore } from 'react';

import { getChartTheme, subscribeChartTheme, type ChartTheme } from './theme.js';

/**
 * 取当前图表主题并跟随皮肤切换：换肤（明暗切换 / 皮肤 CSS 热替换 /
 * CHART_SKIN_CHANGE_EVENT）时订阅机制清掉令牌缓存并触发重渲染，
 * 组件以新主题重建 echarts option，EChartBase notMerge 全量更新生效。
 */
export function useChartTheme(): ChartTheme {
  return useSyncExternalStore(subscribeChartTheme, getChartTheme, getChartTheme);
}
