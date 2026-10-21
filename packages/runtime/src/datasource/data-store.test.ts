import type { DataSourceConfig } from '@pactor-app/core';
import { describe, expect, it, vi } from 'vitest';

import type { HttpAdapter, HttpRequestConfig } from '../context/adapters.js';
import { createRuntimeContext } from '../context/context.js';

/** 创建带 dataSources 的上下文（DataStore 经工厂组装） */
function setup(
  dataSources: Record<string, DataSourceConfig>,
  options: Parameters<typeof createRuntimeContext>[0] = {},
) {
  const context = createRuntimeContext({ ...options, dataSources });
  return { context, store: context.data };
}

describe('DataStore 状态管理', () => {
  it('加载成功的状态流转：loading → data，error 清空', async () => {
    const { store } = setup({
      users: { type: 'static', value: [1, 2] },
    });
    const seen: boolean[] = [];
    store.subscribe(() => seen.push(store.get('users').loading));

    await store.load('users');

    expect(seen).toEqual([true, false]);
    const status = store.get('users');
    expect(status.loading).toBe(false);
    expect(status.data).toEqual([1, 2]);
    expect(status.error).toBeUndefined();
    expect(store.getData('users')).toEqual([1, 2]);
  });

  it('加载失败写入 error，不向调用方抛出', async () => {
    const { store } = setup({
      bad: { type: 'service', service: 'missing.service' },
    });

    await expect(store.load('bad')).resolves.toBeUndefined();

    const status = store.get('bad');
    expect(status.loading).toBe(false);
    expect(status.error).toBeInstanceOf(Error);
    expect(status.error?.message).toContain('missing.service');
  });

  it('加载开始清空上一次 error，失败保留旧 data', async () => {
    let fail = false;
    const services = {
      get: () => async () => {
        if (fail) throw new Error('boom');
        return 'ok';
      },
    };
    const { store } = setup(
      { s: { type: 'service', service: 'x' } },
      { services: services as never },
    );

    await store.load('s');
    expect(store.getData('s')).toBe('ok');

    fail = true;
    await store.load('s');
    expect(store.get('s').error?.message).toBe('boom');
    expect(store.getData('s')).toBe('ok');

    fail = false;
    await store.load('s');
    expect(store.get('s').error).toBeUndefined();
  });

  it('加载未知数据源名抛错（供 Action 引擎收敛）', async () => {
    const { store } = setup({});
    await expect(store.load('ghost')).rejects.toThrow('ghost');
  });

  it('订阅与退订', async () => {
    const { store } = setup({ a: { type: 'static', value: 1 } });
    const listener = vi.fn();
    const off = store.subscribe(listener);

    await store.load('a');
    expect(listener).toHaveBeenCalled();
    const calls = listener.mock.calls.length;

    off();
    await store.load('a');
    expect(listener).toHaveBeenCalledTimes(calls);
  });
});

describe('static 类型数据源', () => {
  it('static 数据立即可用', async () => {
    const { store } = setup({
      options: { type: 'static', value: { a: [1, { b: 2 }] } },
    });

    await store.load('options');

    expect(store.getData('options')).toEqual({ a: [1, { b: 2 }] });
  });
});

describe('选项字段映射（valueField / labelField / disabledField）', () => {
  it('声明映射后数组项归一化出 label/value/disabled，原字段保留', async () => {
    const services = {
      get: () => async () => [
        { code: 'active', name: '启用', off: false },
        { code: 'archived', name: '已归档', off: true },
      ],
    };
    const { store } = setup(
      {
        statusOptions: {
          type: 'service',
          service: 'options.list',
          valueField: 'code',
          labelField: 'name',
          disabledField: 'off',
        },
      },
      { services: services as never },
    );

    await store.load('statusOptions');

    expect(store.getData('statusOptions')).toEqual([
      { code: 'active', name: '启用', off: false, label: '启用', value: 'active', disabled: false },
      { code: 'archived', name: '已归档', off: true, label: '已归档', value: 'archived', disabled: true },
    ]);
  });

  it('未声明映射时数据原样返回', async () => {
    const { store } = setup({
      raw: {
        type: 'static',
        value: [{ code: 'a', name: 'A' }],
      },
    });

    await store.load('raw');

    expect(store.getData('raw')).toEqual([{ code: 'a', name: 'A' }]);
  });

  it('加载结果非数组时不做映射', async () => {
    const { store } = setup({
      obj: {
        type: 'static',
        value: { code: 'a', name: 'A' },
        valueField: 'code',
        labelField: 'name',
      },
    });

    await store.load('obj');

    expect(store.getData('obj')).toEqual({ code: 'a', name: 'A' });
  });

  it('缺省 value/label 字段名回退为 item.value / item.label', async () => {
    const { store } = setup({
      opts: {
        type: 'static',
        value: [
          { label: '启用', value: 'active' },
          { label: '停用', value: 'inactive', disabled: true },
        ],
        disabledField: 'disabled',
      },
    });

    await store.load('opts');

    expect(store.getData('opts')).toEqual([
      { label: '启用', value: 'active', disabled: false },
      { label: '停用', value: 'inactive', disabled: true },
    ]);
  });
});

describe('service 类型数据源', () => {
  it('调用已注册服务，params 经当前作用域求值', async () => {
    const handler = vi.fn(async (params: Record<string, unknown>) => params);
    const { context, store } = setup(
      {
        customers: {
          type: 'service',
          service: 'customer.list',
          params: { keyword: '${state.keyword}' },
        },
      },
      { state: { keyword: '张' } },
    );
    context.services.register('customer.list', handler);

    await store.load('customers');

    expect(handler).toHaveBeenCalledWith({ keyword: '张' });
    expect(store.getData('customers')).toEqual({ keyword: '张' });
  });

  it('服务未注册时写入受控错误，不抛出', async () => {
    const { store } = setup({
      customers: { type: 'service', service: 'ghost.service' },
    });

    await store.load('customers');

    expect(store.get('customers').error?.message).toContain(
      'service not registered',
    );
  });
});

describe('http 类型数据源', () => {
  it('request 字段在每次加载前求值', async () => {
    const requests: HttpRequestConfig[] = [];
    const http: HttpAdapter = {
      request: vi.fn(async (config) => {
        requests.push(config);
        return { page: config.params?.['page'] };
      }),
    };
    const { context, store } = setup(
      {
        list: {
          type: 'http',
          request: {
            method: 'GET',
            url: '/api/list',
            params: { page: '${state.page}' },
          },
        },
      },
      { state: { page: 1 }, http },
    );

    await store.load('list');
    expect(requests[0]).toMatchObject({
      method: 'GET',
      url: '/api/list',
      params: { page: 1 },
    });
    expect(store.getData('list')).toEqual({ page: 1 });

    context.state.set({ page: 2 });
    await store.load('list');
    expect(requests[1]?.params).toEqual({ page: 2 });
  });

  it('http 失败写入 error，不抛出', async () => {
    const http: HttpAdapter = {
      request: async () => {
        throw new Error('network down');
      },
    };
    const { store } = setup(
      { list: { type: 'http', request: { url: '/api/list' } } },
      { http },
    );

    await store.load('list');

    expect(store.get('list').error?.message).toBe('network down');
  });
});

describe('autoLoad 与手动刷新', () => {
  it('init 触发全部 autoLoad 数据源', async () => {
    const { store } = setup({
      a: { type: 'static', value: 1, autoLoad: true },
      b: { type: 'static', value: 2, autoLoad: true },
      c: { type: 'static', value: 3 },
    });

    await store.init();

    expect(store.getData('a')).toBe(1);
    expect(store.getData('b')).toBe(2);
    expect(store.get('c').loading).toBe(false);
    expect(store.getData('c')).toBeUndefined();
  });

  it('缺省 reload 刷新全部 autoLoad 源，非 autoLoad 源不加载', async () => {
    const loads: string[] = [];
    const services = {
      get: (name: string) => async () => {
        loads.push(name);
        return name;
      },
    };
    const { store } = setup(
      {
        a: { type: 'service', service: 'a', autoLoad: true },
        b: { type: 'service', service: 'b', autoLoad: true },
        c: { type: 'service', service: 'c' },
      },
      { services: services as never },
    );

    await store.reload();

    expect(loads.sort()).toEqual(['a', 'b']);
  });

  it('refresh(name) 重新执行加载', async () => {
    let count = 0;
    const services = {
      get: () => async () => ++count,
    };
    const { store } = setup(
      { s: { type: 'service', service: 'x' } },
      { services: services as never },
    );

    await store.refresh('s');
    await store.refresh('s');

    expect(store.getData('s')).toBe(2);
  });

  it('computed / resource 类型写入受控错误（留待后续迭代）', async () => {
    const { store } = setup({ c: { type: 'computed' } });

    await store.load('c');

    expect(store.get('c').error?.message).toContain('unsupported');
  });
});

describe('运行时注册（register / registerAll / unregister）', () => {
  it('register 播种空状态、通知订阅者，load 按动态配置加载', async () => {
    const { context, store } = setup({});
    const listener = vi.fn();
    store.subscribe(listener);
    const versionBefore = store.getVersion();

    const ok = store.register('frag', {
      type: 'http',
      request: { url: '/api/frag' },
    });

    expect(ok).toBe(true);
    expect(store.get('frag')).toEqual({ loading: false });
    expect(store.getVersion()).toBeGreaterThan(versionBefore);
    expect(listener).toHaveBeenCalled();

    const http = context.http;
    const spy = vi
      .spyOn(http, 'request')
      .mockResolvedValue({ items: [1] });
    await store.load('frag');
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/api/frag' }),
    );
    expect(store.getData('frag')).toEqual({ items: [1] });
  });

  it('名称冲突：告警并跳过，保留既有配置（重复注册幂等）', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { store } = setup({
      existing: { type: 'static', value: 'page-level' },
    });

    const ok = store.register('existing', { type: 'static', value: 'frag' });

    expect(ok).toBe(false);
    expect(warn).toHaveBeenCalled();
    await store.load('existing');
    expect(store.getData('existing')).toBe('page-level');
    warn.mockRestore();
  });

  it('registerAll 返回实际注册成功的名称，冲突名跳过', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { store } = setup({
      clash: { type: 'static', value: 1 },
    });

    const registered = store.registerAll({
      a: { type: 'static', value: 'a' },
      clash: { type: 'static', value: 2 },
      b: { type: 'static', value: 'b' },
    });

    expect(registered.sort()).toEqual(['a', 'b']);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it('unregister 移除配置与状态，此后 load 按未知源抛错', async () => {
    const { store } = setup({});
    store.register('temp', { type: 'static', value: 1 });
    await store.load('temp');
    expect(store.getData('temp')).toBe(1);

    store.unregister('temp');

    expect(store.get('temp')).toEqual({ loading: false });
    await expect(store.load('temp')).rejects.toThrow('temp');
    // 未知名注销为 no-op
    store.unregister('ghost');
  });

  it('缺省 reload 覆盖运行时注册的 autoLoad 源', async () => {
    let fragLoads = 0;
    const services = {
      get: () => async () => ++fragLoads,
    };
    const { store } = setup(
      { init: { type: 'static', value: 0, autoLoad: true } },
      { services: services as never },
    );
    // init 之后的运行时注册（如片段载荷携带的 dataSources）
    store.register('frag', {
      type: 'service',
      service: 'frag.svc',
      autoLoad: true,
    });
    store.register('manual', { type: 'static', value: 'm' });

    await store.reload();

    // reload 动态读取 configs：运行时注册的 autoLoad 源一并刷新
    expect(fragLoads).toBe(1);
    expect(store.getData('init')).toBe(0);
    expect(store.getData('manual')).toBeUndefined();
  });
});
