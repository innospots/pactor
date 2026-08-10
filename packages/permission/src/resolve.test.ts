import { describe, expect, it } from 'vitest';

import {
  resolvePermissionCheck,
  resolvePermissionCodes,
} from './resolve.js';
import { PermissionStore } from './store.js';

function storeWith(codes: string[]): PermissionStore {
  const store = new PermissionStore();
  store.setPermissions(codes);
  return store;
}

describe('resolvePermissionCheck：三种形态归一', () => {
  const store = storeWith(['customer:edit']);

  it('string 形态：有权限放行，无权限拒绝且 denied 为 hidden', () => {
    expect(resolvePermissionCheck('customer:edit', store)).toEqual({
      allowed: true,
      denied: 'hidden',
    });
    expect(resolvePermissionCheck('customer:delete', store)).toEqual({
      allowed: false,
      denied: 'hidden',
    });
  });

  it('string[] 形态：数组按 hasAny 判定', () => {
    expect(
      resolvePermissionCheck(['x', 'customer:edit'], store).allowed,
    ).toBe(true);
    expect(resolvePermissionCheck(['x', 'y'], store).allowed).toBe(false);
  });

  it('对象形态：只判定 code，denied 缺省 hidden', () => {
    expect(
      resolvePermissionCheck({ code: 'customer:edit', denied: 'disabled' }, store),
    ).toEqual({ allowed: true, denied: 'disabled' });
    expect(resolvePermissionCheck({ code: 'customer:edit' }, store)).toEqual({
      allowed: true,
      denied: 'hidden',
    });
    expect(
      resolvePermissionCheck(
        { code: ['x', 'customer:edit'], denied: 'readonly' },
        store,
      ),
    ).toEqual({ allowed: true, denied: 'readonly' });
    expect(
      resolvePermissionCheck({ code: 'customer:delete', denied: 'disabled' }, store),
    ).toEqual({ allowed: false, denied: 'disabled' });
  });

  it('未配置 permission（undefined）视为放行', () => {
    expect(resolvePermissionCheck(undefined, store)).toEqual({
      allowed: true,
      denied: 'hidden',
    });
  });
});

describe('resolvePermissionCodes', () => {
  it('三种形态均归一为权限码数组', () => {
    expect(resolvePermissionCodes('a')).toEqual(['a']);
    expect(resolvePermissionCodes(['a', 'b'])).toEqual(['a', 'b']);
    expect(resolvePermissionCodes({ code: 'a', denied: 'hidden' })).toEqual(['a']);
    expect(resolvePermissionCodes({ code: ['a', 'b'] })).toEqual(['a', 'b']);
  });
});
