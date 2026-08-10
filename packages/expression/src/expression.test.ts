import { describe, expect, it } from 'vitest';

import {
  evaluateExpression,
  ExpressionError,
  hasExpression,
  parseExpression,
  resolveTemplate,
} from './index.js';

describe('template resolution', () => {
  it('returns the raw type when the whole string is one expression', () => {
    const scope = {
      state: { count: 42, active: true, user: { name: 'Alice' }, list: [1, 2] },
    };

    expect(resolveTemplate('${state.count}', scope)).toBe(42);
    expect(resolveTemplate('${state.active}', scope)).toBe(true);
    expect(resolveTemplate('${state.user}', scope)).toEqual({ name: 'Alice' });
    expect(resolveTemplate('${state.list}', scope)).toEqual([1, 2]);
  });

  it('concatenates mixed templates into a string', () => {
    const scope = { state: { count: 42 } };

    expect(resolveTemplate('共 ${state.count} 条', scope)).toBe('共 42 条');
    expect(resolveTemplate('${state.count} items', scope)).toBe('42 items');
    expect(resolveTemplate('${state.count}${state.count}', scope)).toBe('4242');
  });

  it('renders null/undefined as empty string in mixed templates', () => {
    expect(resolveTemplate('值: ${state.missing}', {})).toBe('值: ');
  });

  it('returns plain strings unchanged', () => {
    expect(resolveTemplate('普通文本', {})).toBe('普通文本');
    expect(hasExpression('普通文本')).toBe(false);
    expect(hasExpression('${a}')).toBe(true);
  });

  it('throws on unterminated expression', () => {
    expect(() => resolveTemplate('${state.count', {})).toThrow(ExpressionError);
  });

  it('handles quotes and braces inside expressions', () => {
    expect(resolveTemplate("${state.x == '}'}", { state: { x: '}' } })).toBe(true);
  });
});

describe('parser', () => {
  it('parses binary and logical expressions with correct precedence', () => {
    expect(evaluateExpression('1 + 2 * 3')).toBe(7);
    expect(evaluateExpression('(1 + 2) * 3')).toBe(9);
    expect(evaluateExpression('10 % 3')).toBe(1);
    expect(
      evaluateExpression("state.status == 'ACTIVE' && state.count > 0", {
        state: { status: 'ACTIVE', count: 3 },
      }),
    ).toBe(true);
    expect(evaluateExpression('!state.disabled', { state: { disabled: false } })).toBe(
      true,
    );
    expect(evaluateExpression('1 < 2 == true')).toBe(true);
  });

  it('parses and evaluates ternary expressions, including nesting', () => {
    expect(
      evaluateExpression("state.loading ? '加载中' : '完成'", {
        state: { loading: true },
      }),
    ).toBe('加载中');
    expect(evaluateExpression("a ? 'x' : b ? 'y' : 'z'", { a: false, b: true })).toBe(
      'y',
    );
  });

  it('rejects unsupported syntax at parse time with position info', () => {
    expect(() => parseExpression('state.x = 1')).toThrow(ExpressionError);
    expect(() => parseExpression('new Date()')).toThrow(ExpressionError);
    expect(() => parseExpression('() => 1')).toThrow(ExpressionError);
    try {
      parseExpression('state.x =');
    } catch (error) {
      expect(error).toBeInstanceOf(ExpressionError);
      expect((error as ExpressionError).pos).toBeTypeOf('number');
      return;
    }
    expect.unreachable('should have thrown');
  });

  it('parses computed member access', () => {
    const scope = { state: { list: ['a', 'b'] }, row: { key: 'v' } };
    expect(evaluateExpression('state.list[0]', scope)).toBe('a');
    expect(evaluateExpression("row['key']", scope)).toBe('v');
    expect(evaluateExpression('state.list[state.i]', { ...scope, state: { ...scope.state, i: 1 } })).toBe('b');
  });
});

describe('scope resolution', () => {
  it('resolves nested paths', () => {
    const scope = { state: { user: { name: 'Alice' } }, route: { params: { id: 7 } } };
    expect(evaluateExpression('state.user.name', scope)).toBe('Alice');
    expect(evaluateExpression('route.params.id', scope)).toBe(7);
  });

  it('returns undefined for missing paths instead of throwing', () => {
    expect(evaluateExpression('state.missing.deep', { state: {} })).toBeUndefined();
    expect(evaluateExpression('missing', {})).toBeUndefined();
    expect(evaluateExpression('missing.deep.path', {})).toBeUndefined();
  });
});

describe('whitelisted function calls', () => {
  it('calls functions provided via options', () => {
    const permission = (code: unknown) => code === 'customer:edit';
    expect(
      evaluateExpression("!permission('customer:edit')", {}, { functions: { permission } }),
    ).toBe(false);
    expect(
      evaluateExpression("!permission('customer:delete')", {}, { functions: { permission } }),
    ).toBe(true);
  });

  it('calls functions provided via scope', () => {
    const scope = { upper: (s: unknown) => String(s).toUpperCase() };
    expect(evaluateExpression("upper('abc')", scope)).toBe('ABC');
  });

  it('throws a controlled error for unregistered functions', () => {
    expect(() => evaluateExpression('hack()')).toThrow(/not registered/);
  });

  it('rejects member method calls at parse time', () => {
    expect(() =>
      evaluateExpression('state.user.getName()', { state: { user: { getName: () => 'x' } } }),
    ).toThrow(/member method calls are not allowed/);
  });
});

describe('global object isolation', () => {
  it('cannot reach globals via identifiers', () => {
    expect(evaluateExpression('window.location')).toBeUndefined();
    expect(evaluateExpression('globalThis')).toBeUndefined();
    expect(evaluateExpression('document')).toBeUndefined();
  });

  it('cannot call global functions', () => {
    expect(() => evaluateExpression("fetch('/api')")).toThrow(/not registered/);
    expect(() => evaluateExpression("eval('1')")).toThrow(/not registered/);
    expect(() => evaluateExpression('Function("return 1")()')).toThrow();
  });

  it('cannot escape via prototype chain keys', () => {
    expect(evaluateExpression('state.__proto__', { state: {} })).toBeUndefined();
    expect(evaluateExpression('state.constructor', { state: {} })).toBeUndefined();
  });
});

describe('short-circuit evaluation', () => {
  it('does not evaluate the right side of && when the left is falsy', () => {
    expect(evaluateExpression('state.missing && state.missing.deep', { state: {} })).toBe(
      undefined,
    );
  });

  it('does not evaluate the right side of || when the left is truthy', () => {
    expect(
      evaluateExpression("state.name || state.missing.deep", { state: { name: 'x' } }),
    ).toBe('x');
  });

  it('returns operand values, not coerced booleans', () => {
    expect(evaluateExpression("'' || 'fallback'", {})).toBe('fallback');
    expect(evaluateExpression("'a' && 'b'", {})).toBe('b');
  });
});
