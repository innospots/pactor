import { describe, expect, it, vi } from 'vitest';

import { PermissionStore } from './store.js';

describe('PermissionStore', () => {
  it('设置并查询权限：has / hasAny / hasAll', () => {
    const store = new PermissionStore();
    store.setPermissions(['customer:view', 'customer:edit']);

    expect(store.has('customer:view')).toBe(true);
    expect(store.has('customer:delete')).toBe(false);
    expect(store.hasAny(['customer:edit', 'x'])).toBe(true);
    expect(store.hasAny(['x', 'y'])).toBe(false);
    expect(store.hasAll(['customer:view', 'customer:edit'])).toBe(true);
    expect(store.hasAll(['customer:view', 'x'])).toBe(false);
  });

  it('未设置任何权限时所有查询为 false', () => {
    const store = new PermissionStore();

    expect(store.has('customer:view')).toBe(false);
    expect(store.hasAny(['customer:view'])).toBe(false);
    expect(store.hasAll([])).toBe(true);
  });

  it('替换与清空：setPermissions 整体替换，clear 后所有查询为 false', () => {
    const store = new PermissionStore();
    store.setPermissions(['customer:view', 'customer:edit']);
    store.setPermissions(['a']);

    expect(store.has('customer:view')).toBe(false);
    expect(store.has('a')).toBe(true);

    store.clear();
    expect(store.has('a')).toBe(false);
    expect(store.hasAny(['a', 'b'])).toBe(false);
  });

  it('订阅通知：setPermissions / clear 触发 listener，退订后不再调用', () => {
    const store = new PermissionStore();
    const listener = vi.fn();
    const off = store.subscribe(listener);

    store.setPermissions(['a']);
    store.clear();
    expect(listener).toHaveBeenCalledTimes(2);

    off();
    store.setPermissions(['b']);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('多个订阅者各自独立退订', () => {
    const store = new PermissionStore();
    const a = vi.fn();
    const b = vi.fn();
    const offA = store.subscribe(a);
    store.subscribe(b);

    offA();
    store.setPermissions(['x']);

    expect(a).not.toHaveBeenCalled();
    expect(b).toHaveBeenCalledTimes(1);
  });
});
