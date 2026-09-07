import type { BootstrapResource } from '@pactor-app/resource';

/**
 * 示例菜单项：路由菜单字段 + ChatShell 展示扩展字段
 * （group 分组标题 / dot 状态点；badge 透传 ChatMenuItem）。
 * 框架 sanitizeMenus 展开保留扩展字段，MenuRegistry 不裁剪，
 * 布局映射时读取（spec: example-chat-on-pactor-app，设计决策 D2）。
 */
export interface DemoMenuItem {
  id: string;
  type: 'page';
  title: string;
  path: string;
  pageId: string;
  icon?: string;
  order?: number;
  badge?: number;
  group?: string;
  dot?: boolean;
  hidden?: boolean;
  activeMenu?: string;
}

/**
 * 菜单声明：功能菜单（对话 / 我的智能体 / 系统设置，设置带 badge 演示）
 * + 「最近」分组历史会话（group + dot 演示，spec: chat-default-skin）。
 * 历史会话项与「对话」共用 /chat 路由，以 ?id= 区分会话
 * （chat.page.yaml conversationId 消费 query.id，刷新可还原）。
 * 隐藏项 home 把 / 映射到 chat 页（高亮回退「对话」），替代原手写
 * 路由的 Navigate 重定向——隐藏页参与路径匹配但不出现在菜单树。
 */
export const DEMO_MENUS: DemoMenuItem[] = [
  { id: 'home', type: 'page', title: '对话', path: '/', pageId: 'chat', hidden: true, activeMenu: 'chat', order: 0 },
  { id: 'chat', type: 'page', title: '对话', path: '/chat', pageId: 'chat', icon: 'chat', order: 1 },
  { id: 'agents', type: 'page', title: '我的智能体', path: '/agents', pageId: 'agents', icon: 'user', order: 2 },
  { id: 'settings', type: 'page', title: '系统设置', path: '/settings', pageId: 'settings', icon: 'settings', order: 3, badge: 3 },
  { id: 'conv-desktop', type: 'page', title: '桌面框架调整', path: '/chat', pageId: 'chat', icon: 'history', order: 11, group: '最近', dot: true },
  { id: 'conv-weekly', type: 'page', title: '整理本周产品进展', path: '/chat', pageId: 'chat', icon: 'history', order: 12, group: '最近', dot: true },
  { id: 'conv-meeting', type: 'page', title: '会议行动项汇总', path: '/chat', pageId: 'chat', icon: 'history', order: 13, group: '最近' },
  { id: 'conv-roadmap', type: 'page', title: 'Q3 路线图梳理', path: '/chat', pageId: 'chat', icon: 'history', order: 14, group: '最近' },
];

/**
 * 模拟服务端 bootstrap 资源（无后端演示）：菜单与布局由"服务端"下发
 * （spec: example-chat-on-pactor-app，设计决策 D2），对齐 examples/admin
 * 的 bootstrap 模式；layout.type: 'chat' 由入口 layoutRegistry 注册的
 * ChatAppLayout 解析。
 */
export function createBootstrap(): Partial<BootstrapResource> &
  Record<string, unknown> {
  return {
    app: { name: 'Pactor Chat 示例' },
    permissions: [],
    menus: DEMO_MENUS,
    layout: { type: 'chat' },
    pageVersions: { chat: 1, agents: 1, settings: 1 },
  };
}
