import type { BootstrapResource } from 'pactor-resource';

import { readSession } from './auth';
import { translate } from './i18n';

/**
 * 模拟服务端 bootstrap 资源（无后端演示），按本地会话分两种形态：
 *
 * - 未登录：login 布局 + 仅 /login 菜单（无权限、无业务菜单）；
 * - 已登录：admin 布局 + 业务菜单。permissions 授予 customer:view /
 *   customer:edit，故意不含 customer:delete（列表删除按钮演示 denied: disabled）
 *   与 system:admin（"系统设置"菜单被过滤，直接访问 /settings 得到 403）；
 *   menus 含 group 分组、hidden 详情页（activeMenu 指向列表页高亮）、未授权项。
 *
 * 菜单标题 / 应用名不做表达式求值（框架按字符串直渲染），
 * 因此按当前语言偏好经 translate() 查表生成；切换语言整页刷新后
 * bootstrap 重新执行，即得到新语言的菜单。
 */
export function createBootstrap(): Partial<BootstrapResource> &
  Record<string, unknown> {
  const session = readSession();

  if (!session) {
    return {
      app: { name: translate('app.name') },
      permissions: [],
      menus: [
        {
          id: 'login',
          type: 'page',
          title: translate('menu.login'),
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
    app: { name: translate('app.name') },
    user: session.user,
    permissions: ['customer:view', 'customer:edit'],
    menus: [
      {
        id: 'dashboard',
        type: 'page',
        title: translate('menu.dashboard'),
        path: '/',
        pageId: 'dashboard',
      },
      {
        id: 'customer',
        type: 'group',
        title: translate('menu.customers'),
        children: [
          {
            id: 'customer-list',
            type: 'page',
            title: translate('menu.customerList'),
            path: '/customers',
            pageId: 'customer-list',
            permission: 'customer:view',
          },
        ],
      },
      {
        // 隐藏详情页：不出现在菜单树，但参与路径匹配；命中时高亮列表页
        id: 'customer-edit',
        type: 'page',
        title: translate('menu.customerEdit'),
        path: '/customers/:id/edit',
        pageId: 'customer-edit',
        hidden: true,
        activeMenu: 'customer-list',
        permission: 'customer:edit',
      },
      {
        // 未授权项：permissions 不含 system:admin，菜单中被过滤；
        // 直接访问 /settings 由 DynamicDslRoute 渲染 403
        id: 'settings',
        type: 'page',
        title: translate('menu.settings'),
        path: '/settings',
        pageId: 'settings',
        permission: 'system:admin',
      },
    ],
    layout: { type: 'admin', tabs: true, breadcrumb: true, collapsible: true, breakpoint: 'lg' },
    pageVersions: { dashboard: 1, 'customer-list': 1, 'customer-edit': 1 },
  };
}
