import type { BootstrapResource } from '@pactor-app/resource';

import { readSession } from './auth';

/**
 * 模拟服务端 bootstrap 资源（无后端演示），按本地会话分两种形态：
 *
 * - 未登录：login 布局 + 仅 /login 菜单（无权限、无业务菜单）；
 * - 已登录：admin 布局 + 业务菜单。permissions 授予 customer:view /
 *   customer:edit，故意不含 customer:delete（列表删除按钮演示 denied: disabled）
 *   与 system:admin（"系统设置"菜单被过滤，直接访问 /settings 得到 403）；
 *   menus 含 group 分组、hidden 详情页（activeMenu 指向列表页高亮）、未授权项。
 */
export function createBootstrap(): Partial<BootstrapResource> &
  Record<string, unknown> {
  const session = readSession();

  if (!session) {
    return {
      app: { name: 'Pactor Admin 示例' },
      permissions: [],
      menus: [
        {
          id: 'login',
          type: 'page',
          title: '登录',
          path: '/login',
          pageId: 'login',
          hidden: true,
        },
      ],
      layout: { type: 'login' },
      pageVersions: { login: 1 },
    };
  }

  return {
    app: { name: 'Pactor Admin 示例' },
    user: session.user,
    permissions: ['customer:view', 'customer:edit'],
    menus: [
      {
        id: 'dashboard',
        type: 'page',
        title: '工作台',
        icon: 'home',
        path: '/',
        pageId: 'dashboard',
      },
      {
        id: 'customer',
        type: 'group',
        title: '客户管理',
        icon: 'users',
        children: [
          {
            id: 'customer-list',
            type: 'page',
            title: '客户列表',
            path: '/customers',
            pageId: 'customer-list',
            permission: 'customer:view',
          },
          {
            // master-detail 演示页：左侧列表点击 → 右侧详情（含 loading 态）
            id: 'customer-detail',
            type: 'page',
            title: '客户 360',
            path: '/customers/360',
            pageId: 'customer-detail',
            permission: 'customer:view',
          },
          {
            // 布局组件演示页（Layout/Sider/Menu 等页面级自由组合）
            id: 'layout-demo',
            type: 'page',
            title: '布局演示',
            path: '/layout-demo',
            pageId: 'layout-demo',
            permission: 'customer:view',
          },
        ],
      },
      {
        // 隐藏详情页：不出现在菜单树，但参与路径匹配；命中时高亮列表页
        id: 'customer-edit',
        type: 'page',
        title: '编辑客户',
        path: '/customers/:id/edit',
        pageId: 'customer-edit',
        hidden: true,
        activeMenu: 'customer-list',
        permission: 'customer:edit',
      },
      {
        // 扩展组件演示页（shadcn 扩展组件四批集中演示）
        id: 'components-demo',
        type: 'group',
        title: '组件演示',
        children: [
          {
            id: 'extended-components',
            type: 'page',
            title: '扩展组件',
            path: '/extended-components',
            pageId: 'extended-components',
            permission: 'customer:view',
          },
        ],
      },
      {
        // AI 工作区：Chat 一等组件页（产出物面板演示），无权限门控
        id: 'ai-workspace',
        type: 'page',
        title: 'AI 工作区',
        icon: 'message-square',
        path: '/ai',
        pageId: 'ai-workspace',
      },
      {
        // 未授权项：permissions 不含 system:admin，菜单中被过滤；
        // 直接访问 /settings 由 DynamicDslRoute 渲染 403
        id: 'settings',
        type: 'page',
        title: '系统设置',
        icon: 'settings',
        path: '/settings',
        pageId: 'settings',
        permission: 'system:admin',
      },
    ],
    layout: { type: 'admin', tabs: true, fixedHeader: true, fixedSider: true, breadcrumb: true, collapsible: true, breakpoint: 'lg' },
    pageVersions: { dashboard: 1, 'customer-list': 1, 'customer-detail': 1, 'layout-demo': 1, 'extended-components': 1, 'customer-edit': 1, 'ai-workspace': 1 },
  };
}
