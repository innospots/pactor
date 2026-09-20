/**
 * 图表分类组件（17 个）。
 * 来源：product-design/ui/component-design.md §3.7 图表（§11 首版验收矩阵：图表 = 17）。
 * 命名口径：文档以中文名为规范名（名称列即图表类型），英文名列为建议英文标识，
 * id 采用稳定英文短名 slug；「地图」取 slug map-chart 以保留地理语义。
 * tokenRefs 本期全部留空：待样式 Token 接入后回填（含数据可视化色彩规则）。
 */
import type { ComponentEntry } from '../types.ts';

export const chartComponents: ComponentEntry[] = [
  { id: 'component.metric-card', name: '指标卡', category: 'charts', purpose: '单值与变化', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：MetricCard。' },
  { id: 'component.line-chart', name: '折线图', category: 'charts', purpose: '连续趋势', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：LineChart。' },
  { id: 'component.column-chart', name: '柱状图', category: 'charts', purpose: '离散比较', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：ColumnChart。' },
  { id: 'component.bar-chart', name: '条形图', category: 'charts', purpose: '长分类名称的横向比较', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：BarChart。' },
  { id: 'component.area-chart', name: '面积图', category: 'charts', purpose: '趋势与累计规模', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：AreaChart。' },
  { id: 'component.pie-chart', name: '饼图', category: 'charts', purpose: '少量类别构成', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：PieChart。' },
  { id: 'component.donut-chart', name: '环形图', category: 'charts', purpose: '构成与中心指标', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：DonutChart。' },
  { id: 'component.scatter-chart', name: '散点图', category: 'charts', purpose: '两变量关系与分布', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：ScatterChart。' },
  { id: 'component.bubble-chart', name: '气泡图', category: 'charts', purpose: '三变量关系', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：BubbleChart。' },
  { id: 'component.radar-chart', name: '雷达图', category: 'charts', purpose: '多维能力对比', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：RadarChart。' },
  { id: 'component.funnel-chart', name: '漏斗图', category: 'charts', purpose: '流程阶段转化', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：FunnelChart。' },
  { id: 'component.gauge-chart', name: '仪表盘', category: 'charts', purpose: '单指标区间状态', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：GaugeChart。' },
  { id: 'component.heatmap', name: '热力图', category: 'charts', purpose: '二维密度与强弱', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：Heatmap。' },
  { id: 'component.treemap', name: '树图', category: 'charts', purpose: '层级构成', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：Treemap。' },
  { id: 'component.sankey-chart', name: '桑基图', category: 'charts', purpose: '节点之间的流向与规模', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：SankeyChart。' },
  { id: 'component.map-chart', name: '地图', category: 'charts', purpose: '地理分布与区域比较', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：MapChart；地理分布与区域比较。' },
  { id: 'component.composed-chart', name: '组合图', category: 'charts', purpose: '多种度量或表达目标组合', maturity: 'stable', change: 'new', integration: 'integrated', description: '建议英文标识：ComposedChart。' },
];
