/**
 * 通用分类组件（10 个）。
 * 来源：product-design/ui/component-design.md §3.1 通用（§11 首版验收矩阵：通用 = 10）。
 * tokenRefs 本期全部留空：样式 Token 数据尚未接入，引用不存在的 Token 会触发
 * 构建期校验失败；待样式 Token 接入后为代表性组件回填。
 */
import type { ComponentEntry } from '../types.ts';

export const generalComponents: ComponentEntry[] = [
  { id: 'component.button', name: 'Button', category: 'general', purpose: '触发即时操作', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：按钮。' },
  { id: 'component.icon', name: 'Icon', category: 'general', purpose: '传达操作、状态或对象含义', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：图标。' },
  { id: 'component.typography', name: 'Typography', category: 'general', purpose: '组织标题、正文和辅助文本', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：排版。' },
  { id: 'component.link', name: 'Link', category: 'general', purpose: '跳转页面、位置或外部资源', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：链接。' },
  { id: 'component.separator', name: 'Separator', category: 'general', purpose: '分隔内容分组', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：分割线。设计文档原名：Divider。' },
  { id: 'component.avatar', name: 'Avatar', category: 'general', purpose: '表示用户、组织或对象身份', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：头像。' },
  { id: 'component.badge', name: 'Badge', category: 'general', purpose: '表示数量、提醒或附着状态', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：徽标。' },
  { id: 'component.tag', name: 'Tag', category: 'general', purpose: '标记分类、属性或可移除条件', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：标签。' },
  { id: 'component.status', name: 'Status', category: 'general', purpose: '表达运行、审核或业务状态', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：状态。' },
  { id: 'component.tooltip', name: 'Tooltip', category: 'general', purpose: '补充短说明或不可见标签', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：文字提示。' },
];
