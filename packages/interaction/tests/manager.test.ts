import { describe, expect, it, vi } from 'vitest';

import { OverlayManager, OVERLAY_CANCEL_PAYLOAD } from '../src/manager.js';

/** 包装 open：附上 id 提取与 settled 追踪，便于断言 */
function openTracked(
  manager: OverlayManager,
  config: Parameters<OverlayManager['open']>[0],
  options?: Parameters<OverlayManager['open']>[1],
) {
  let settled: unknown = undefined;
  let resolved = false;
  const promise = manager.open(config, options).then((payload) => {
    resolved = true;
    settled = payload;
    return payload;
  });
  const id = manager.stack()[manager.stack().length - 1]?.id ?? '';
  return { promise, id, result: () => ({ resolved, settled }) };
}

describe('Overlay 打开与堆栈', () => {
  it('打开 modal 与 drawer：stack() 按打开顺序含两个唯一条目', () => {
    const manager = new OverlayManager();

    openTracked(manager, { type: 'modal', title: 'A' });
    openTracked(manager, { type: 'drawer', title: 'B' });

    const stack = manager.stack();
    expect(stack).toHaveLength(2);
    expect(stack.map((e) => e.type)).toEqual(['modal', 'drawer']);
    expect(stack.map((e) => e.title)).toEqual(['A', 'B']);
    expect(new Set(stack.map((e) => e.id)).size).toBe(2);
  });

  it('非法 type 的 open 受控拒绝，不入栈', async () => {
    const manager = new OverlayManager();

    await expect(
      manager.open({ type: 'popover' } as never),
    ).rejects.toThrow('modal');
    expect(manager.stack()).toHaveLength(0);
  });
});

describe('open 的 Promise 模型', () => {
  it('close(id, payload) 原样 resolve payload，条目从堆栈移除', async () => {
    const manager = new OverlayManager();
    const { promise, id } = openTracked(manager, { type: 'modal' });

    manager.close(id, { success: true, userId: 1001 });

    await expect(promise).resolves.toEqual({ success: true, userId: 1001 });
    expect(manager.stack()).toHaveLength(0);
  });

  it('取消语义：无 payload 的 close resolve { success: false }', async () => {
    const manager = new OverlayManager();
    const { promise, id } = openTracked(manager, { type: 'modal' });

    manager.close(id);

    await expect(promise).resolves.toEqual(OVERLAY_CANCEL_PAYLOAD);
    await expect(promise).resolves.toEqual({ success: false });
  });

  it('缺省关闭栈顶：连续打开两个后 close() 只关栈顶', async () => {
    const manager = new OverlayManager();
    const first = openTracked(manager, { type: 'modal', title: 'A' });
    const second = openTracked(manager, { type: 'modal', title: 'B' });

    manager.close();

    await expect(second.promise).resolves.toEqual({ success: false });
    expect(manager.stack().map((e) => e.title)).toEqual(['A']);
    expect(first.result().resolved).toBe(false);
  });

  it('close(payload)（非字符串）关闭栈顶并原样 resolve', async () => {
    const manager = new OverlayManager();
    const { promise } = openTracked(manager, { type: 'drawer' });

    manager.close({ success: true });

    await expect(promise).resolves.toEqual({ success: true });
  });

  it('未知 id / 空堆栈的 close 为受控 no-op', async () => {
    const manager = new OverlayManager();
    const tracked = openTracked(manager, { type: 'modal' });

    manager.close('ghost-id', { success: true });
    expect(manager.stack()).toHaveLength(1);
    expect(tracked.result().resolved).toBe(false);

    manager.close(tracked.id);
    await tracked.promise;
    expect(() => manager.close()).not.toThrow();
  });
});

describe('订阅', () => {
  it('open / close 各通知一次；退订后不再通知', () => {
    const manager = new OverlayManager();
    const listener = vi.fn();
    const unsubscribe = manager.subscribe(listener);

    const { id } = openTracked(manager, { type: 'modal' });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.lastCall?.[0]).toHaveLength(1);

    manager.close(id);
    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener.mock.lastCall?.[0]).toHaveLength(0);

    unsubscribe();
    openTracked(manager, { type: 'modal' });
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('stack() 快照引用在堆栈不变时保持稳定（useSyncExternalStore 兼容）', () => {
    const manager = new OverlayManager();
    const before = manager.stack();
    expect(manager.stack()).toBe(before);

    openTracked(manager, { type: 'modal' });
    const after = manager.stack();
    expect(after).not.toBe(before);
    expect(manager.stack()).toBe(after);
  });
});

describe('parent 作用域', () => {
  it('open 传入 parentScope 后 parentScopeOf(id) 返回浅快照', () => {
    const manager = new OverlayManager();
    const state = { count: 1 };
    const { id } = openTracked(
      manager,
      { type: 'modal' },
      { parentScope: { state, route: { params: {} } } },
    );

    const snapshot = manager.parentScopeOf(id);
    expect(snapshot).toEqual({ state, route: { params: {} } });
    // 浅快照：state 对象引用共享（只读约定）
    expect(snapshot?.['state']).toBe(state);
  });

  it('未传 parentScope 返回 undefined；close 后快照随之移除', async () => {
    const manager = new OverlayManager();
    const withScope = openTracked(
      manager,
      { type: 'modal' },
      { parentScope: { state: {} } },
    );
    const withoutScope = openTracked(manager, { type: 'modal' });

    expect(manager.parentScopeOf(withoutScope.id)).toBeUndefined();

    manager.close(withScope.id, { success: true });
    await withScope.promise;
    expect(manager.parentScopeOf(withScope.id)).toBeUndefined();
  });
});
