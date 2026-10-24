import { Registry } from '@pactor-app/core';
import { describe, expect, it, vi } from 'vitest';

import {
  createDefaultPermissionAdapter,
  createDefaultRouterAdapter,
  createFetchHttpAdapter,
} from './adapters.js';
import {
  createRuntimeContext,
  type ServiceHandler,
} from './context.js';
import { buildScope } from './scope.js';

describe('createRuntimeContext', () => {
  it('创建默认上下文：全部标准字段 + 空 Registry + 默认 adapter', () => {
    const context = createRuntimeContext({ page: { id: 'p1' } });

    expect(context.page).toEqual({ id: 'p1' });
    expect(context.app).toEqual({});
    expect(context.user).toEqual({});
    expect(context.state.getState()).toEqual({});
    expect(context.route.params).toEqual({});
    expect(context.route.query).toEqual({});
    expect(context.services.list()).toEqual([]);
    expect(context.components.list()).toEqual([]);
    expect(context.actions.list()).toEqual([]);
    expect(context.capabilities.list()).toEqual([]);
    // 默认 permission 放行、navigate no-op
    expect(context.permission.check('any:code')).toBe(true);
    expect(() => context.route.navigate('/x')).not.toThrow();
  });

  it('注入自定义 Registry 与 Adapter', () => {
    const services = new Registry<ServiceHandler>('ServiceRegistry');
    const components = new Registry<unknown>('ComponentRegistry');
    const permission = { check: vi.fn(() => false) };
    const router = { navigate: vi.fn() };
    const http = { request: vi.fn(async () => ({})) };

    const context = createRuntimeContext({
      services,
      components,
      permission,
      router,
      http,
    });

    expect(context.services).toBe(services);
    expect(context.components).toBe(components);
    expect(context.permission).toBe(permission);
    expect(context.http).toBe(http);
    context.route.navigate('/home');
    expect(router.navigate).toHaveBeenCalledWith('/home');
  });

  it('默认 RouterAdapter 为 no-op 并告警', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    createDefaultRouterAdapter().navigate('/x');
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });

  it('默认 PermissionAdapter 放行任意权限码', () => {
    const adapter = createDefaultPermissionAdapter();
    expect(adapter.check('customer:edit')).toBe(true);
    expect(adapter.check(['a', 'b'])).toBe(true);
  });

  it('localizationMode 缺省为 client，可显式指定 server', () => {
    expect(createRuntimeContext().localizationMode).toBe('client');
    expect(
      createRuntimeContext({ localizationMode: 'server' }).localizationMode,
    ).toBe('server');
  });

  it('默认 HttpAdapter 基于全局 fetch', async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    vi.stubGlobal('fetch', fetchMock);
    try {
      const adapter = createFetchHttpAdapter();
      const data = await adapter.request({
        url: '/api/x',
        params: { page: 1 },
      });
      expect(data).toEqual({ ok: true });
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/x?page=1',
        expect.objectContaining({ method: 'GET' }),
      );
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe('ServiceRegistry', () => {
  it('注册并解析服务', () => {
    const context = createRuntimeContext();
    const handler: ServiceHandler = (params) => ({ echo: params });

    context.services.register('customer.list', handler);

    expect(context.services.get('customer.list')).toBe(handler);
  });
});

describe('buildScope', () => {
  it('作用域包含 state 与 data 当前值', async () => {
    const context = createRuntimeContext({
      state: { keyword: 'x' },
      dataSources: {
        users: { type: 'static', value: [{ name: '张三' }] },
      },
    });
    await context.data.load('users');

    const scope = buildScope(context);

    expect(scope['state']).toEqual({ keyword: 'x' });
    expect(scope['data']).toEqual({ users: [{ name: '张三' }] });
  });

  it('dataStatus 暴露各数据源 loading / error 状态', async () => {
    const context = createRuntimeContext({
      dataSources: {
        users: { type: 'static', value: [1] },
        bad: { type: 'service', service: 'missing' },
      },
    });

    // 加载前：未加载的源 loading 为 false
    expect(buildScope(context)['dataStatus']).toEqual({
      users: { loading: false, error: undefined },
      bad: { loading: false, error: undefined },
    });

    await context.data.load('users');
    await context.data.load('bad');

    const status = buildScope(context)['dataStatus'] as Record<
      string,
      { loading: boolean; error?: Error }
    >;
    expect(status['users']).toEqual({ loading: false, error: undefined });
    expect(status['bad']?.loading).toBe(false);
    expect(status['bad']?.error).toBeInstanceOf(Error);
  });

  it('局部作用域覆盖同名全局键', () => {
    const context = createRuntimeContext({ state: { count: 1 } });
    const row = { name: 'row-0' };

    const scope = buildScope(context, { row, state: { count: 99 } });

    expect(scope['row']).toBe(row);
    expect(scope['state']).toEqual({ count: 99 });
  });

  it('params 为 route.params 的别名', () => {
    const context = createRuntimeContext({
      route: { params: { id: '42' } },
    });

    const scope = buildScope(context);

    expect(scope['params']).toEqual({ id: '42' });
    expect(scope['route']).toBe(context.route);
  });

  it('包含 locale 与 t 翻译函数', () => {
    const context = createRuntimeContext({
      locale: 'en-US',
      messages: { 'menu.home': 'Home' },
    });

    const scope = buildScope(context);

    expect(scope['locale']).toBe('en-US');
    expect(scope['t']).toBe(context.i18n.t);
    expect((scope['t'] as (key: string) => string)('menu.home')).toBe('Home');
  });
});
