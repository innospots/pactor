/**
 * 数据展示分类组件（15 个）。
 * 来源：product-design/ui/component-design.md §3.5 数据展示（§11 首版验收矩阵：数据展示 = 15）。
 * 命名口径：文档明确 Table（常规表格）与 DataTable（高密度可编辑网格）为两个独立组件，
 * 不做合并或替代；Segmented 主归属数据展示，不建独立 Tabs 语义。
 * tokenRefs 本期全部留空：待样式 Token 接入后回填。
 */
import type { ComponentEntry } from '../types.ts';

export const dataDisplayComponents: ComponentEntry[] = [
  { id: 'component.card', name: 'Card', category: 'data-display', purpose: '承载一个独立主题或对象摘要', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：卡片。' },
  { id: 'component.list', name: 'List', category: 'data-display', purpose: '纵向展示同类对象集合', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：列表。' },
  { id: 'component.table', name: 'Table', category: 'data-display', purpose: '按行列展示和操作结构化数据', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：表格；与 DataTable、高级表格为不同层级的表格方案。' },
  { id: 'component.tree', name: 'Tree', category: 'data-display', purpose: '展示和操作层级数据', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：树。' },
  { id: 'component.descriptions', name: 'Descriptions', category: 'data-display', purpose: '展示对象的标签—值属性', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：描述列表。' },
  { id: 'component.statistic', name: 'Statistic', category: 'data-display', purpose: '突出显示单个指标', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：统计数值。' },
  { id: 'component.calendar', name: 'Calendar', category: 'data-display', purpose: '按日期组织事件或状态', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：日历。' },
  { id: 'component.timeline', name: 'Timeline', category: 'data-display', purpose: '按时间顺序展示事件', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：时间线。' },
  { id: 'component.accordion', name: 'Accordion', category: 'data-display', purpose: '折叠和展开分组内容', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：折叠面板。设计文档原名：Collapse。' },
  { id: 'component.carousel', name: 'Carousel', category: 'data-display', purpose: '在有限区域轮播内容', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：轮播。' },
  { id: 'component.empty', name: 'Empty', category: 'data-display', purpose: '表示暂无内容并提供下一步', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：空状态。' },
  { id: 'component.image', name: 'Image', category: 'data-display', purpose: '展示图片及基础预览能力', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：图片；放大缩放查看由媒体分类 ImageViewer 负责。' },
  { id: 'component.qrcode', name: 'QRCode', category: 'data-display', purpose: '将内容编码为二维码', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：二维码。' },
  { id: 'component.segmented', name: 'Segmented', category: 'data-display', purpose: '在少量互斥视图或模式间切换', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：分段控制器。' },
  { id: 'component.data-table', name: 'DataTable', category: 'data-display', purpose: '提供高密度、可编辑的大型数据网格', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：数据网格；适合高密度编辑与虚拟化。设计文档原名：DataTable。' },
];
