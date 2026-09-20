/**
 * 布局分类组件（9 个）。
 * 来源：product-design/ui/component-design.md §3.2 布局（§11 首版验收矩阵：布局 = 9）。
 * tokenRefs 本期全部留空：待样式 Token 接入后回填。
 */
import type { ComponentEntry } from '../types.ts';

export const layoutComponents: ComponentEntry[] = [
  { id: 'component.layout', name: 'Layout', category: 'layout', purpose: '组织页面级头部、侧栏和内容区', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：布局。' },
  { id: 'component.grid', name: 'Grid', category: 'layout', purpose: '按响应式行列排列内容', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：栅格。' },
  { id: 'component.flex', name: 'Flex', category: 'layout', purpose: '沿主轴和交叉轴排列对象', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：弹性布局。' },
  { id: 'component.space', name: 'Space', category: 'layout', purpose: '为一组相邻元素提供一致间距', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：间距。' },
  { id: 'component.container', name: 'Container', category: 'layout', purpose: '限制内容宽度并建立页面留白', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：容器。' },
  { id: 'component.splitter', name: 'Splitter', category: 'layout', purpose: '将工作区拆分为可调整面板', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：分栏。' },
  { id: 'component.resizable', name: 'Resizable', category: 'layout', purpose: '调整单个区域或对象尺寸', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：尺寸调整。' },
  { id: 'component.aspect-ratio', name: 'AspectRatio', category: 'layout', purpose: '保持媒体或预览画布比例', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：宽高比。' },
  { id: 'component.scroll-area', name: 'ScrollArea', category: 'layout', purpose: '建立受控滚动区域', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：滚动区域。' },
];
