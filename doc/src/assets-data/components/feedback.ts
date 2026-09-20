/**
 * 反馈分类组件（14 个）。
 * 来源：product-design/ui/component-design.md §3.6 反馈（§11 首版验收矩阵：反馈 = 14）。
 * 命名口径：文档明确 Message（全局短时反馈）与 AI 分类 ChatMessage（会话消息）必须区分，
 * 二者并存且不可合并；Spin 为局部处理状态，LoadingOverlay 为阻断式加载层，同样并存。
 * tokenRefs 本期全部留空：待样式 Token 接入后回填。
 */
import type { ComponentEntry } from '../types.ts';

export const feedbackComponents: ComponentEntry[] = [
  { id: 'component.alert', name: 'Alert', category: 'feedback', purpose: '在内容上下文中持续显示提示', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：警告提示。' },
  { id: 'component.message', name: 'Message', category: 'feedback', purpose: '全局短时反馈操作结果', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：全局消息；与 AI 会话组件 ChatMessage 名称与职责均不同。' },
  { id: 'component.notification', name: 'Notification', category: 'feedback', purpose: '显示信息更丰富的全局通知', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：通知提醒。' },
  { id: 'component.modal', name: 'Modal', category: 'feedback', purpose: '阻断当前流程以确认或完成任务', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：模态框。' },
  { id: 'component.drawer', name: 'Drawer', category: 'feedback', purpose: '在保留页面上下文时展示扩展任务', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：抽屉。' },
  { id: 'component.popconfirm', name: 'Popconfirm', category: 'feedback', purpose: '就近确认轻量危险操作', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：气泡确认。' },
  { id: 'component.popover', name: 'Popover', category: 'feedback', purpose: '在触发对象附近展示补充内容', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：气泡卡片。' },
  { id: 'component.progress', name: 'Progress', category: 'feedback', purpose: '展示任务完成程度', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：进度条。' },
  { id: 'component.result', name: 'Result', category: 'feedback', purpose: '汇总任务最终结果和后续操作', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：结果页。' },
  { id: 'component.skeleton', name: 'Skeleton', category: 'feedback', purpose: '在结构已知时展示加载占位', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：骨架屏。' },
  { id: 'component.spin', name: 'Spin', category: 'feedback', purpose: '表示局部区域正在处理', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：加载中；仅紧邻内容的局部处理状态。' },
  { id: 'component.loading-overlay', name: 'LoadingOverlay', category: 'feedback', purpose: '在页面或区块上覆盖统一加载状态', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：加载遮罩；阻断范围与取消策略须在详情页说明。' },
  { id: 'component.watermark', name: 'Watermark', category: 'feedback', purpose: '在内容表面添加来源或安全标识', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：水印。' },
  { id: 'component.tour', name: 'Tour', category: 'feedback', purpose: '分步骤引导用户认识界面', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：漫游引导。' },
];
