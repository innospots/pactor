import { describe, expect, it } from 'vitest';
import { MenuRegistry, type MenuItem } from 'pactor-router';

import { findMenuChain } from '../../src/layout/admin/menu-chain.js';
import {
  buildMenuItems,
  collectDefaultOpenKeys,
} from '../../src/layout/admin/menu-items.js';

const menus: MenuItem[] = [
  {
    id: 'customer',
    type: 'group',
    title: '客户管理',
    defaultOpen: true,
    children: [
      {
        id: 'customer-list',
        type: 'page',
        title: '客户列表',
        path: '/customers',
      },
      {
        id: 'customer-disabled',
        type: 'page',
        title: '停用项',
        path: '/disabled',
        disabled: true,
      },
      {
        id: 'customer-detail',
        type: 'page',
        title: '客户详情',
        path: '/customers/:id',
        hidden: true,
        activeMenu: 'customer-list',
      },
    ],
  },
  { id: 'dashboard', type: 'page', title: '工作台', path: '/dashboard' },
];

describe('buildMenuItems', () => {
  it('group → 子菜单，page → 菜单项，hidden 项不出现', () => {
    const items = buildMenuItems(new MenuRegistry(menus));

    expect(items).toHaveLength(2);
    const group = items[0] as { key: string; label: string; children: unknown[] };
    expect(group.key).toBe('customer');
    expect(group.label).toBe('客户管理');
    expect(group.children).toHaveLength(2);
    const plain = items[1] as { key: string; label: string };
    expect(plain).toMatchObject({ key: 'dashboard', label: '工作台' });
    const keys = JSON.stringify(items);
    expect(keys).not.toContain('customer-detail');
  });

  it('disabled 原样传递', () => {
    const items = buildMenuItems(new MenuRegistry(menus));
    const group = items[0] as { children: Array<{ key: string; disabled?: boolean }> };
    const disabledItem = group.children.find(
      (child) => child.key === 'customer-disabled',
    );
    expect(disabledItem?.disabled).toBe(true);
  });

  it('提供 permissionChecker 时先经权限过滤', () => {
    const withPermission: MenuItem[] = [
      { id: 'dashboard', type: 'page', title: '工作台', path: '/dashboard' },
      {
        id: 'admin',
        type: 'page',
        title: '系统管理',
        path: '/admin',
        permission: 'admin',
      },
    ];
    const checker = { hasAny: () => false };
    const items = buildMenuItems(new MenuRegistry(withPermission), checker);

    expect(items).toHaveLength(1);
    expect((items[0] as { key: string }).key).toBe('dashboard');
  });
});

describe('collectDefaultOpenKeys', () => {
  it('收集 defaultOpen 的 group id', () => {
    expect(collectDefaultOpenKeys(new MenuRegistry(menus))).toEqual(['customer']);
  });

  it('并入激活菜单父链上的 group（刷新子页面时选中项所在分组保持展开）', () => {
    const closed: MenuItem[] = [
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
          },
        ],
      },
    ];
    const registry = new MenuRegistry(closed);

    // 未传 activeMenuId：分组不展开
    expect(collectDefaultOpenKeys(registry)).toEqual([]);
    // 激活项在分组内：分组并入默认展开集
    expect(collectDefaultOpenKeys(registry, 'customer-list')).toEqual(['customer']);
    // 激活项不在任何分组内：不额外展开
    expect(collectDefaultOpenKeys(new MenuRegistry(menus), 'dashboard')).toEqual([
      'customer',
    ]);
  });
});

describe('findMenuChain', () => {
  it('返回从顶层到目标项的菜单链', () => {
    const chain = findMenuChain(new MenuRegistry(menus), 'customer-list');

    expect(chain.map((menu) => menu.title)).toEqual(['客户管理', '客户列表']);
  });

  it('未命中返回空数组', () => {
    expect(findMenuChain(new MenuRegistry(menus), 'missing')).toEqual([]);
  });
});
