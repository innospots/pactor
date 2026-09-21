/**
 * 导航分类组件（10 个）。
 * 来源：product-design/ui/component-design.md §3.3 导航（§11 首版验收矩阵：导航 = 10）。
 * tokenRefs 本期全部留空：待样式 Token 接入后回填。
 */
import type { ComponentEntry } from '../types.ts';

export const navigationComponents: ComponentEntry[] = [
  { id: 'component.menu', name: 'Menu', category: 'navigation', purpose: '在模块或功能之间导航', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：菜单。' },
  { id: 'component.tabs', name: 'Tabs', category: 'navigation', purpose: '在同层内容视图间切换', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：标签页。' },
  { id: 'component.breadcrumb', name: 'Breadcrumb', category: 'navigation', purpose: '表示当前位置与上级路径', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：面包屑。' },
  { id: 'component.pagination', name: 'Pagination', category: 'navigation', purpose: '在多页数据之间切换', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：分页。' },
  { id: 'component.steps', name: 'Steps', category: 'navigation', purpose: '表示流程阶段与当前进度', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：步骤条。' },
  { id: 'component.anchor', name: 'Anchor', category: 'navigation', purpose: '在长页面章节间定位', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：锚点。' },
  { id: 'component.dropdown-menu', name: 'DropdownMenu', category: 'navigation', purpose: '从临时操作或导航菜单中选择', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：下拉菜单。设计文档原名：Dropdown。' },
  { id: 'component.navigation-menu', name: 'NavigationMenu', category: 'navigation', purpose: '提供顶部、底部或全局导航', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：导航。设计文档原名：Navigation。' },
  { id: 'component.back-top', name: 'BackTop', category: 'navigation', purpose: '返回长页面顶部', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：回到顶部。' },
  { id: 'component.affix', name: 'Affix', category: 'navigation', purpose: '在滚动时固定关键导航或操作', maturity: 'stable', change: 'new', integration: 'integrated', description: '中文惯用名：固钉。' },
];
