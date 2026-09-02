import type { PermissionConfig } from '@pactor-app/core';
import { describe, expect, it } from 'vitest';

import {
  checkPagePermission,
  filterMenusByPermission,
} from './guards.js';
import { PermissionStore } from './store.js';

interface MenuItem {
  key: string;
  label?: string;
  permission?: PermissionConfig;
  children?: MenuItem[];
}

function storeWith(codes: string[]): PermissionStore {
  const store = new PermissionStore();
  store.setPermissions(codes);
  return store;
}

describe('filterMenusByPermission', () => {
  it('递归过滤：无权限项与空目录被移除，其余保留且原数组不变', () => {
    const menus: MenuItem[] = [
      { key: 'dashboard', label: '仪表盘' },
      { key: 'customer', label: '客户', permission: 'customer:view' },
      { key: 'strategy', label: '策略', permission: 'strategy:view' },
      {
        key: 'system',
        label: '系统管理',
        children: [
          { key: 'role', label: '角色', permission: 'role:view' },
          { key: 'log', label: '日志' },
        ],
      },
      {
        key: 'admin',
        label: '运维',
        children: [{ key: 'ops', permission: 'ops:view' }],
      },
    ];
    const snapshot = JSON.parse(JSON.stringify(menus)) as unknown;
    const store = storeWith(['customer:view', 'role:view']);

    const filtered = filterMenusByPermission(menus, store);

    expect(filtered.map((item) => item.key)).toEqual([
      'dashboard',
      'customer',
      'system',
    ]);
    // system 目录下只剩有权限的 role 与未配置 permission 的 log
    expect(filtered[2]?.children?.map((item) => item.key)).toEqual([
      'role',
      'log',
    ]);
    // admin 目录的唯一子项无权限，空目录一并移除
    expect(filtered.some((item) => item.key === 'admin')).toBe(false);
    // 原数组不被修改
    expect(menus).toEqual(snapshot);
  });

  it('泛型保持菜单项类型，children 被过滤的项返回浅拷贝', () => {
    const menus: MenuItem[] = [
      {
        key: 'system',
        label: '系统管理',
        children: [{ key: 'role', permission: 'role:view' }],
      },
    ];

    const filtered = filterMenusByPermission(menus, storeWith(['role:view']));

    expect(filtered[0]?.label).toBe('系统管理');
    expect(filtered[0]?.children?.[0]?.key).toBe('role');
    // children 无变化时仍返回新数组，但无 children 的项保持原引用
    const plain: MenuItem[] = [{ key: 'dashboard' }];
    const kept = filterMenusByPermission(plain, storeWith([]));
    expect(kept[0]).toBe(plain[0]);
    expect(kept).not.toBe(plain);
  });

  it('对象形式 permission 同样生效', () => {
    const menus: MenuItem[] = [
      { key: 'edit', permission: { code: 'customer:edit', denied: 'hidden' } },
    ];

    expect(filterMenusByPermission(menus, storeWith([]))).toEqual([]);
    expect(
      filterMenusByPermission(menus, storeWith(['customer:edit'])),
    ).toHaveLength(1);
  });
});

describe('checkPagePermission', () => {
  it('页面含 permission 时按 checker 判定', () => {
    const page = { id: 'strategy', permission: 'strategy:view' as const };

    expect(checkPagePermission(page, storeWith([]))).toBe(false);
    expect(checkPagePermission(page, storeWith(['strategy:view']))).toBe(true);
  });

  it('页面无 permission 字段时放行', () => {
    const page: { id: string; permission?: PermissionConfig } = {
      id: 'dashboard',
    };

    expect(checkPagePermission(page, storeWith([]))).toBe(true);
  });
});
