import type { ActionConfig } from 'pactor-core';
import { describe, expect, it, vi } from 'vitest';

import { createRuntimeContext } from '../context/context.js';
import type { RuntimeContext } from '../context/context.js';
import { registerBuiltinActions } from './builtins.js';
import { ActionEngine } from './engine.js';

function setup(options: Parameters<typeof createRuntimeContext>[0] = {}) {
  const context = createRuntimeContext(options);
  registerBuiltinActions(context.actions);
  const engine = new ActionEngine(context);
  return { context, engine };
}

function rawEngine(context: RuntimeContext) {
  // 不注册内置动作的引擎，用于管线本身的测试
  return new ActionEngine(context);
}

describe('Action 注册与执行管线', () => {
  it('执行已注册动作，params 中的表达式已求值', async () => {
    const context = createRuntimeContext({ state: { count: 41 } });
    const handler = vi.fn(() => ({ ok: true as const }));
    context.actions.register('my.action', handler);
    const engine = rawEngine(context);

    const result = await engine.execute({
      action: 'my.action',
      params: { count: '${state.count + 1}', label: '共 ${state.count} 条' },
    });

    expect(result.ok).toBe(true);
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        params: { count: 42, label: '共 41 条' },
      }),
      expect.anything(),
    );
  });

  it('未注册动作受控失败，不抛出', async () => {
    const { engine } = setup();

    const result = await engine.execute({ action: 'ghost.action' });

    expect(result.ok).toBe(false);
    expect(result.error?.message).toContain('ghost.action');
    expect(result.error?.message).toContain('not registered');
  });

  it('condition 为 false 跳过，handler 不被调用', async () => {
    const context = createRuntimeContext({ state: { ready: false } });
    const handler = vi.fn(() => ({ ok: true as const }));
    context.actions.register('my.action', handler);
    const engine = rawEngine(context);

    const result = await engine.execute({
      action: 'my.action',
      condition: '${state.ready}',
    });

    expect(result).toEqual({ ok: true, skipped: true });
    expect(handler).not.toHaveBeenCalled();
  });

  it('condition 支持对象形式 { expression }', async () => {
    const { engine, context } = setup();

    const result = await engine.execute({
      action: 'setState',
      params: { a: 1 },
      condition: { expression: '${state.ready}' },
    });

    expect(result.skipped).toBe(true);
    expect(context.state.get('a')).toBeUndefined();
  });

  it('permission 拒绝拦截，handler 不被调用', async () => {
    const context = createRuntimeContext({
      permission: { check: () => false },
    });
    const handler = vi.fn(() => ({ ok: true as const }));
    context.actions.register('my.action', handler);
    const engine = rawEngine(context);

    const result = await engine.execute({
      action: 'my.action',
      permission: 'customer:edit',
    });

    expect(result.ok).toBe(false);
    expect(result.error?.message).toContain('permission denied');
    expect(handler).not.toHaveBeenCalled();
  });

  it('handler 抛错收敛为受控失败', async () => {
    const context = createRuntimeContext();
    context.actions.register('bad.action', () => {
      throw new Error('boom');
    });
    const engine = rawEngine(context);

    const result = await engine.execute({ action: 'bad.action' });

    expect(result.ok).toBe(false);
    expect(result.error?.message).toBe('boom');
  });
});

describe('内置动作 setState / resetState', () => {
  it('setState 合并求值后的参数', async () => {
    const { engine, context } = setup({ state: { count: 1 } });

    const result = await engine.execute({
      action: 'setState',
      params: { count: '${state.count + 1}' },
    });

    expect(result.ok).toBe(true);
    expect(context.state.get('count')).toBe(2);
  });

  it('resetState 重置到初始值', async () => {
    const { engine, context } = setup({ state: { count: 1 } });

    await engine.execute({ action: 'setState', params: { count: 9 } });
    await engine.execute({ action: 'resetState' });

    expect(context.state.getState()).toEqual({ count: 1 });
  });
});

describe('内置动作 reload', () => {
  function withDataSources() {
    const loads: string[] = [];
    const services = {
      get: (name: string) => async () => {
        loads.push(name);
        return name;
      },
    };
    const { context, engine } = setup({
      services: services as never,
      dataSources: {
        users: { type: 'service', service: 'users', autoLoad: true },
        orders: { type: 'service', service: 'orders', autoLoad: true },
        dict: { type: 'service', service: 'dict' },
      },
    });
    return { context, engine, loads };
  }

  it('指定数据源 reload：仅该数据源重新加载', async () => {
    const { engine, loads } = withDataSources();

    await engine.execute({
      action: 'reload',
      params: { dataSource: 'users' },
    });

    expect(loads).toEqual(['users']);
  });

  it('缺省 reload 全部 autoLoad 源', async () => {
    const { engine, loads } = withDataSources();

    await engine.execute({ action: 'reload' });

    expect(loads.sort()).toEqual(['orders', 'users']);
  });
});

describe('内置动作 request', () => {
  it('请求结果写入 target 指定的 state 路径', async () => {
    const { engine, context } = setup({
      http: { request: async () => ({ id: 1 }) },
    });

    const result = await engine.execute({
      action: 'request',
      params: { url: '/api/x', target: 'state.detail' },
    });

    expect(result.ok).toBe(true);
    expect(context.state.get('detail')).toEqual({ id: 1 });
  });

  it('请求参数透传 HttpAdapter 且表达式已求值', async () => {
    const request = vi.fn(async () => ({}));
    const { engine } = setup({
      state: { id: '7' },
      http: { request },
    });

    await engine.execute({
      action: 'request',
      params: {
        method: 'POST',
        url: '/api/x/${state.id}',
        params: { id: '${state.id}' },
        body: { id: '${state.id}' },
      },
    });

    expect(request).toHaveBeenCalledWith({
      method: 'POST',
      url: '/api/x/7',
      params: { id: '7' },
      headers: undefined,
      body: { id: '7' },
    });
  });

  it('请求失败返回受控失败，不抛出', async () => {
    const { engine } = setup({
      http: {
        request: async () => {
          throw new Error('500');
        },
      },
    });

    const result = await engine.execute({
      action: 'request',
      params: { url: '/api/x' },
    });

    expect(result.ok).toBe(false);
    expect(result.error?.message).toBe('500');
  });
});

describe('编排动作 sequence / parallel / if / delay', () => {
  it('sequence 串行执行', async () => {
    const order: string[] = [];
    const { engine, context } = setup();
    context.actions.register('mark', (action) => {
      order.push(String(action.params?.['name']));
      return { ok: true };
    });

    await engine.execute({
      action: 'sequence',
      params: {
        actions: [
          { action: 'mark', params: { name: 'a' } },
          { action: 'mark', params: { name: 'b' } },
        ],
      },
    });

    expect(order).toEqual(['a', 'b']);
  });

  it('sequence 遇失败中断，后续动作不执行', async () => {
    const order: string[] = [];
    const { engine, context } = setup();
    context.actions.register('fail', () => ({
      ok: false,
      error: new Error('x'),
    }));
    context.actions.register('mark', (action) => {
      order.push(String(action.params?.['name']));
      return { ok: true };
    });

    const result = await engine.execute({
      action: 'sequence',
      params: {
        actions: [
          { action: 'mark', params: { name: 'a' } },
          { action: 'fail' },
          { action: 'mark', params: { name: 'b' } },
        ],
      },
    });

    expect(result.ok).toBe(false);
    expect(order).toEqual(['a']);
  });

  it('parallel 并行执行，全部完成后返回', async () => {
    const { engine, context } = setup();
    const done: string[] = [];
    context.actions.register('slow', async (action) => {
      const ms = Number(action.params?.['ms'] ?? 0);
      await new Promise((r) => setTimeout(r, ms));
      done.push(String(action.params?.['name']));
      return { ok: true };
    });

    const result = await engine.execute({
      action: 'parallel',
      params: {
        actions: [
          { action: 'slow', params: { name: 'slow', ms: 30 } },
          { action: 'slow', params: { name: 'fast', ms: 0 } },
        ],
      },
    });

    expect(result.ok).toBe(true);
    // 并行：fast 先完成（串行则 slow 先完成）
    expect(done).toEqual(['fast', 'slow']);
  });

  it('parallel 任一失败则整体失败', async () => {
    const { engine, context } = setup();
    context.actions.register('fail', () => ({
      ok: false,
      error: new Error('x'),
    }));

    const result = await engine.execute({
      action: 'parallel',
      params: { actions: [{ action: 'setState', params: {} }, { action: 'fail' }] },
    });

    expect(result.ok).toBe(false);
  });

  it('if 分支：condition 为真执行 then', async () => {
    const { engine, context } = setup({ state: { flag: true } });

    await engine.execute({
      action: 'if',
      params: {
        condition: '${state.flag}',
        then: { action: 'setState', params: { branch: 'then' } },
        else: { action: 'setState', params: { branch: 'else' } },
      },
    });

    expect(context.state.get('branch')).toBe('then');
  });

  it('if 分支：condition 为假且配置了 else，仅 else 执行', async () => {
    const { engine, context } = setup({ state: { flag: false } });

    await engine.execute({
      action: 'if',
      params: {
        condition: '${state.flag}',
        then: { action: 'setState', params: { branch: 'then' } },
        else: [
          { action: 'setState', params: { branch: 'else' } },
          { action: 'setState', params: { step: 2 } },
        ],
      },
    });

    expect(context.state.get('branch')).toBe('else');
    expect(context.state.get('step')).toBe(2);
  });

  it('delay 等待 ms 后返回成功', async () => {
    const { engine } = setup();
    const start = Date.now();

    const result = await engine.execute({
      action: 'delay',
      params: { ms: 20 },
    });

    expect(result.ok).toBe(true);
    expect(Date.now() - start).toBeGreaterThanOrEqual(15);
  });

  it('编排子动作继承局部作用域且 state 取当前值', async () => {
    const { engine, context } = setup({ state: { count: 0 } });

    await engine.execute(
      {
        action: 'sequence',
        params: {
          actions: [
            { action: 'setState', params: { count: '${state.count + 1}' } },
            { action: 'setState', params: { count: '${state.count + 1}' } },
            { action: 'setState', params: { seen: '${item}' } },
          ],
        },
      },
      { item: 'x' },
    );

    // 第二个 setState 若读旧快照会得到 1；正确行为是 2
    expect(context.state.get('count')).toBe(2);
    expect(context.state.get('seen')).toBe('x');
  });
});

describe('事件动作数组串行', () => {
  it('executeAll 按声明顺序串行执行', async () => {
    const order: number[] = [];
    const { engine, context } = setup();
    context.actions.register('push', async (action) => {
      const n = Number(action.params?.['n']);
      await new Promise((r) => setTimeout(r, n === 1 ? 20 : 0));
      order.push(n);
      return { ok: true };
    });
    const actions: ActionConfig[] = [
      { action: 'push', params: { n: 1 } },
      { action: 'push', params: { n: 2 } },
    ];

    const results = await engine.executeAll(actions);

    expect(order).toEqual([1, 2]);
    expect(results.every((r) => r.ok)).toBe(true);
  });
});

describe('permission 数组与对象形态语义', () => {
  function setupWithStore(granted: string[]) {
    const context = createRuntimeContext({
      permission: {
        check(permission) {
          const codes = Array.isArray(permission)
            ? permission
            : typeof permission === 'object'
              ? Array.isArray(permission.code)
                ? permission.code
                : [permission.code]
              : [permission];
          return codes.some((code) => granted.includes(code));
        },
      },
    });
    const handler = vi.fn(() => ({ ok: true as const }));
    context.actions.register('my.action', handler);
    return { handler, engine: rawEngine(context) };
  }

  it('数组语义为 hasAny：任一命中即放行，全不命中则拦截', async () => {
    const { handler, engine } = setupWithStore(['customer:edit']);

    const allowed = await engine.execute({
      action: 'my.action',
      permission: ['customer:delete', 'customer:edit'],
    });
    expect(allowed.ok).toBe(true);

    const denied = await engine.execute({
      action: 'my.action',
      permission: ['customer:delete', 'customer:view'],
    });
    expect(denied.ok).toBe(false);
    expect(denied.error?.message).toContain('permission denied');
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('对象形式只判定 code，denied 策略不影响动作检查', async () => {
    const { engine } = setupWithStore(['customer:edit']);

    const allowed = await engine.execute({
      action: 'my.action',
      permission: { code: 'customer:edit', denied: 'disabled' },
    });
    expect(allowed.ok).toBe(true);

    const denied = await engine.execute({
      action: 'my.action',
      permission: { code: ['customer:delete'], denied: 'hidden' },
    });
    expect(denied.ok).toBe(false);
  });
});
