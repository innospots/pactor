import type { BootstrapResource } from 'pactor-resource';

/**
 * 模拟服务端 bootstrap 资源（无后端演示）：
 * - permissions 授予 customer:view / customer:edit，
 *   故意不含 customer:delete（列表删除按钮演示 denied: disabled）
 *   与 system:admin（"系统设置"菜单被过滤，直接访问 /settings 得到 403）
 * - menus：group 分组、hidden 详情页（activeMenu 指向列表页高亮）、未授权项
 * - layout：admin 布局，开启页签（tabs）与面包屑（breadcrumb）
 */
export const bootstrap: Partial<BootstrapResource> & Record<string, unknown> = {
  app: { name: 'Pactor Admin 示例' },
  user: { id: 'u-1', name: '演示管理员', roles: ['operator'] },
  permissions: ['customer:view', 'customer:edit'],
  menus: [
    {
      id: 'dashboard',
      type: 'page',
      title: '工作台',
      path: '/',
      pageId: 'dashboard',
    },
    {
      id: 'customer',
      type: 'group',
      title: '客户管理',
      children: [
        {
          id: 'customer-list',
          type: 'page',
          title: '客户列表',
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
      title: '编辑客户',
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
      title: '系统设置',
      path: '/settings',
      pageId: 'settings',
      permission: 'system:admin',
    },
  ],
  layout: { type: 'admin', tabs: true, breadcrumb: true },
  pageVersions: { dashboard: 1, 'customer-list': 1, 'customer-edit': 1 },
};
