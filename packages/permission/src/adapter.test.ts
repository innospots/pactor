import type { PageDsl } from 'pactor-core';
import type { PermissionAdapter } from 'pactor-runtime';
import { createPageRuntime } from 'pactor-runtime';
import { describe, expect, it } from 'vitest';

import { createPermissionAdapter } from './adapter.js';
import { PermissionStore } from './store.js';

function storeWith(codes: string[]): PermissionStore {
  const store = new PermissionStore();
  store.setPermissions(codes);
  return store;
}

describe('createPermissionAdapter：三种形态检查', () => {
  it('store 含 customer:edit 时三种形态均返回 true，不含时均返回 false', () => {
    const adapter = createPermissionAdapter(storeWith(['customer:edit']));

    expect(adapter.check('customer:edit')).toBe(true);
    expect(adapter.check(['x', 'customer:edit'])).toBe(true);
    expect(adapter.check({ code: 'customer:edit', denied: 'disabled' })).toBe(
      true,
    );

    const empty = createPermissionAdapter(storeWith([]));
    expect(empty.check('customer:edit')).toBe(false);
    expect(empty.check(['x', 'customer:edit'])).toBe(false);
    expect(empty.check({ code: 'customer:edit', denied: 'disabled' })).toBe(
      false,
    );
  });

  it('数组语义为 hasAny', () => {
    const adapter = createPermissionAdapter(storeWith(['customer:edit']));

    expect(adapter.check(['customer:delete', 'customer:edit'])).toBe(true);
    expect(adapter.check(['customer:delete', 'customer:view'])).toBe(false);
  });
});

describe('与 pactor-runtime 的类型兼容（编译期断言）', () => {
  it('结构化兼容 runtime 的 PermissionAdapter 接口', () => {
    // 编译期断言：类型不兼容时 tsc --noEmit 直接失败
    const adapter: PermissionAdapter = createPermissionAdapter(
      storeWith(['a']),
    );

    expect(adapter.check('a')).toBe(true);
  });
});

describe('与 runtime Action 引擎集成', () => {
  const pageDsl: PageDsl = {
    dsl: '1.0',
    page: { id: 'customer-list', title: '客户管理', type: 'list' },
    body: { type: 'Page', children: [] },
  };

  it('PageRuntime 注入该 adapter 后，无权限的动作被拦截返回 { ok: false }', async () => {
    const store = storeWith(['customer:view']);
    const runtime = createPageRuntime(pageDsl, {
      permission: createPermissionAdapter(store),
    });
    runtime.context.actions.register('danger', () => ({ ok: true as const }));

    const denied = await runtime.engine.execute({
      action: 'danger',
      permission: 'customer:delete',
    });
    expect(denied.ok).toBe(false);
    expect(denied.error?.message).toContain('permission denied');

    const allowed = await runtime.engine.execute({
      action: 'danger',
      permission: 'customer:view',
    });
    expect(allowed.ok).toBe(true);

    await runtime.destroy();
  });
});
