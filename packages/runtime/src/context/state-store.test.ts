import { describe, expect, it, vi } from 'vitest';

import { StateStore } from './state-store.js';

describe('StateStore', () => {
  it('路径读取与写入', () => {
    const store = new StateStore({ user: { name: 'Alice' } });

    store.set('user.name', 'Bob');

    expect(store.get('user.name')).toBe('Bob');
    expect(store.getState().user).toEqual({ name: 'Bob' });
  });

  it('路径写入为不可变更新，且能创建不存在的中间层级', () => {
    const store = new StateStore({ user: { name: 'Alice' } });
    const before = store.getState();

    store.set('user.name', 'Bob');
    store.set('a.b.c', 1);

    expect(store.getState()).not.toBe(before);
    expect(before.user).toEqual({ name: 'Alice' });
    expect(store.get('a.b.c')).toBe(1);
  });

  it('读取不存在的路径返回 undefined', () => {
    const store = new StateStore({ a: 1 });

    expect(store.get('x.y.z')).toBeUndefined();
  });

  it('对象合并', () => {
    const store = new StateStore({ a: 1, b: 2 });

    store.set({ b: 3 });

    expect(store.getState()).toEqual({ a: 1, b: 3 });
  });

  it('订阅与退订', () => {
    const store = new StateStore({ a: 1 });
    const listener = vi.fn();

    const unsubscribe = store.subscribe(listener);
    store.set({ a: 2 });
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    store.set({ a: 3 });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('reset 恢复初始值', () => {
    const store = new StateStore({ user: { name: 'Alice' }, count: 0 });

    store.set('user.name', 'Bob');
    store.set({ count: 10 });
    store.reset();

    expect(store.getState()).toEqual({ user: { name: 'Alice' }, count: 0 });
  });

  it('版本号随每次写入递增', () => {
    const store = new StateStore({});
    const v0 = store.getVersion();

    store.set({ a: 1 });
    expect(store.getVersion()).toBeGreaterThan(v0);
    const v1 = store.getVersion();
    store.reset();
    expect(store.getVersion()).toBeGreaterThan(v1);
  });
});
