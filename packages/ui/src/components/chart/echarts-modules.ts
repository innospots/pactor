/**
 * echarts 模块化注册（图表组件集共享，side-effect 模块）。
 * 仅注册 17 个图型所需的 chart / component / render 模块，
 * 避免全量 `import 'echarts'` 造成的包体膨胀；
 * 被 EChartBase 引入一次即可生效。
 */
import * as echarts from 'echarts/core';
import {
  BarChart,
  FunnelChart,
  GaugeChart,
  HeatmapChart,
  LineChart,
  MapChart,
  PieChart,
  RadarChart,
  SankeyChart,
  ScatterChart,
  TreeChart,
} from 'echarts/charts';
import {
  DataZoomComponent,
  GeoComponent,
  GridComponent,
  LegendComponent,
  RadarComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  RadarChart,
  FunnelChart,
  GaugeChart,
  HeatmapChart,
  TreeChart,
  SankeyChart,
  MapChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  DataZoomComponent,
  GeoComponent,
  RadarComponent,
  CanvasRenderer,
]);

export { echarts };
export type { EChartsCoreOption } from 'echarts/core';
