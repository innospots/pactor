import { describe, expect, it } from 'vitest';

import { MenuRegistry, type MenuItem } from './menu.js';

/**
 * 规格「完整菜单项类型检查」：声明含 group 嵌套 page 与 hidden 详情页
 * 的完整菜单树，本文件 tsc --noEmit 通过即满足。
 */
const menus: MenuItem[] = [
  {
    id: 'home',
    type: 'page',
    title: '首页',
    icon: 'home',
    path: '/',
    pageId: 'home',
  },
  {
    id: 'customer',
    type: 'group',
    title: '客户管理',
    icon: 'user',
    order: 2,
    defaultOpen: true,
    children: [
      {
        id: 'customer-list',
        type: 'page',
        title: '客户列表',
        path: '/customers',
        pageId: 'customer-list',
        permission: 'customer:view',
        order: 1,
        keepAlive: true,
        breadcrumb: true,
        tab: true,
      },
      {
        id: 'customer-edit',
        type: 'page',
        title: '编辑客户',
        path: '/customers/:id/edit',
        pageId: 'customer-edit',
        hidden: true,
        activeMenu: 'customer-list',
        permission: { code: 'customer:edit', denied: 'hidden' },
        badge: 3,
        disabled: false,
      },
    ],
  },
  {
    id: 'docs-link',
    type: 'link',
    title: '外部文档',
    path: '/docs',
    external: true,
    target: '_blank',
  },
];

describe('MenuRegistry 构建', () => {
  it('可见树过滤隐藏页，扁平可路由列表含该项', () => {
    const registry = new MenuRegistry(menus);

    const tree = registry.tree();
    // group 保留、其 children 中 hidden 详情页被过滤
    const customer = tree.find((item) => item.id === 'customer');
    expect(customer?.children?.map((item) => item.id)).toEqual([
      'customer-list',
    ]);
    expect(tree.some((item) => item.id === 'customer-edit')).toBe(false);

    // 扁平可路由列表：非 group 且有 path（含隐藏页）
    expect(registry.list().map((item) => item.id)).toContain('customer-edit');
    expect(registry.list().map((item) => item.id)).not.toContain('customer');
  });

  it('list() 按 order 排序，未指定 order 的保持声明顺序在后', () => {
    const registry = new MenuRegistry([
      { id: 'a', type: 'page', title: 'A', path: '/a', order: 2 },
      { id: 'b', type: 'page', title: 'B', path: '/b', order: 1 },
      { id: 'c', type: 'page', title: 'C', path: '/c' },
    ]);

    expect(registry.list().map((item) => item.id)).toEqual(['b', 'a', 'c']);
  });

  it('多个未指定 order 的条目保持声明顺序', () => {
    const registry = new MenuRegistry([
      { id: 'x', type: 'page', title: 'X', path: '/x', order: 1 },
      { id: 'y', type: 'page', title: 'Y', path: '/y' },
      { id: 'z', type: 'page', title: 'Z', path: '/z' },
    ]);

    expect(registry.list().map((item) => item.id)).toEqual(['x', 'y', 'z']);
  });
});

describe('findByPath', () => {
  const registry = new MenuRegistry(menus);

  it('匹配静态与参数路径', () => {
    const list = registry.findByPath('/customers');
    expect(list?.menu.id).toBe('customer-list');
    expect(list?.params).toEqual({});

    const edit = registry.findByPath('/customers/123/edit');
    expect(edit?.menu.id).toBe('customer-edit');
    expect(edit?.params).toEqual({ id: '123' });
  });

  it('隐藏页参与匹配', () => {
    const hit = registry.findByPath('/customers/42/edit');

    expect(hit?.menu.id).toBe('customer-edit');
    expect(hit?.menu.hidden).toBe(true);
  });

  it('未命中返回 null', () => {
    expect(registry.findByPath('/not-registered')).toBeNull();
  });
});

describe('findById', () => {
  const registry = new MenuRegistry(menus);

  it('按 id 查找 page / group / 隐藏项，不存在返回 undefined', () => {
    expect(registry.findById('customer-list')?.title).toBe('客户列表');
    expect(registry.findById('customer')?.type).toBe('group');
    expect(registry.findById('customer-edit')?.hidden).toBe(true);
    expect(registry.findById('nope')).toBeUndefined();
  });
});
