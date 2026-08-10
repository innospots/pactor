import {
  evaluateExpression,
  type ExpressionFunction,
} from 'pactor-expression';
import { describe, expect, it } from 'vitest';

import { createPermissionFunction } from './expression.js';
import { PermissionStore } from './store.js';

describe('createPermissionFunction', () => {
  it('直接调用：返回 store.has(code)', () => {
    const store = new PermissionStore();
    store.setPermissions(['customer:edit']);
    const permission = createPermissionFunction(store);

    expect(permission('customer:edit')).toBe(true);
    expect(permission('customer:delete')).toBe(false);
  });

  it('注入求值作用域：求值 !permission(\'customer:edit\')', () => {
    const store = new PermissionStore();
    store.setPermissions(['customer:edit']);
    const scope = { permission: createPermissionFunction(store) };

    expect(evaluateExpression("!permission('customer:edit')", scope)).toBe(
      false,
    );
    expect(evaluateExpression("!permission('customer:delete')", scope)).toBe(
      true,
    );
  });

  it('作为白名单函数注入 options.functions', () => {
    const store = new PermissionStore();
    store.setPermissions(['customer:edit']);
    // ExpressionFunction 形参为 unknown，注入白名单函数表时按结构化签名断言
    const functions: Record<string, ExpressionFunction> = {
      permission: createPermissionFunction(store) as ExpressionFunction,
    };

    expect(
      evaluateExpression("!permission('customer:edit')", {}, { functions }),
    ).toBe(false);
    expect(
      evaluateExpression("!permission('customer:delete')", {}, { functions }),
    ).toBe(true);
  });

  it('权限变更后同一函数反映最新集合', () => {
    const store = new PermissionStore();
    const scope = { permission: createPermissionFunction(store) };

    expect(evaluateExpression("permission('customer:edit')", scope)).toBe(
      false,
    );

    store.setPermissions(['customer:edit']);
    expect(evaluateExpression("permission('customer:edit')", scope)).toBe(
      true,
    );
  });
});
