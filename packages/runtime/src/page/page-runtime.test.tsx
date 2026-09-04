// @vitest-environment jsdom
import { Registry, type PageDsl } from '@pactor-app/core';
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { ActionHandler, ServiceHandler } from '../index.js';
import {
  createPageRuntime,
  PageRuntimeError,
  PageRuntimeView,
} from './page-runtime.js';
import { useRenderer } from '../renderer/renderer-context.js';

afterEach(cleanup);

function minimalDsl(overrides: Partial<PageDsl> = {}): PageDsl {
  return {
    dsl: '1.0',
    page: { id: 'p1', title: '测试页' },
    ...overrides,
  };
}

describe('PageDsl 加载校验', () => {
  it('非法 DSL 抛 PageRuntimeError，含结构化错误路径', () => {
    const bad = { dsl: '1.0', page: {} } as unknown as PageDsl;

    let caught: unknown;
    try {
      createPageRuntime(bad);
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeInstanceOf(PageRuntimeError);
    const error = caught as PageRuntimeError;
    expect(error.errors.length).toBeGreaterThan(0);
    expect(error.errors.map((e) => e.path)).toContain('/page/id');
    expect(error.message).toContain('/page/id');
  });

  it('合法 DSL 创建成功，可访问 RuntimeContext', () => {
    const runtime = createPageRuntime(minimalDsl());

    expect(runtime.context.page).toEqual({ id: 'p1', title: '测试页' });
    expect(runtime.context.state).toBeDefined();
    expect(runtime.context.data).toBeDefined();
  });
});

describe('初始化链路', () => {
  it('完整初始化：state 初始化 + autoLoad 触发 + onInit 执行', async () => {
    const service = vi.fn(async (params: Record<string, unknown>) => params);
    // autoLoad 在创建时即触发，服务须经注入的 registry 预先注册
    const services = new Registry<ServiceHandler>('ServiceRegistry');
    services.register('customer.list', service);
    const runtime = createPageRuntime(
      minimalDsl({
        state: { keyword: '张' },
        dataSources: {
          customers: {
            type: 'service',
            service: 'customer.list',
            autoLoad: true,
            params: { keyword: '${state.keyword}' },
          },
        },
        lifecycle: {
          onInit: { action: 'setState', params: { inited: true } },
        },
      }),
      { services },
    );

    await runtime.initialized;

    expect(runtime.context.state.getState()).toMatchObject({
      keyword: '张',
      inited: true,
    });
    expect(service).toHaveBeenCalledWith({ keyword: '张' });
    expect(runtime.context.data.getData('customers')).toEqual({
      keyword: '张',
    });
  });

  it('内置动作已注册（navigate 等上层动作不在其中）', () => {
    const runtime = createPageRuntime(minimalDsl());

    expect(runtime.context.actions.list().sort()).toEqual([
      'call',
      'delay',
      'form.setValues',
      'if',
      'parallel',
      'reload',
      'request',
      'resetState',
      'sequence',
      'setState',
    ]);
  });
});

describe('生命周期编排', () => {
  it('生命周期动作按 init → load 顺序执行（动作经注入 registry 预先注册）', async () => {
    const order: string[] = [];
    const actions = new Registry<ActionHandler>('ActionRegistry');
    actions.register('mark', (action) => {
      order.push(String(action.params?.['name']));
      return { ok: true };
    });

    const runtime = createPageRuntime(
      minimalDsl({
        lifecycle: {
          onInit: { action: 'mark', params: { name: 'init' } },
          onLoad: { action: 'mark', params: { name: 'load' } },
        },
      }),
      { actions },
    );

    await runtime.initialized;

    expect(order).toEqual(['init', 'load']);
  });

  it('onReady / onShow / onHide 由宿主触发', async () => {
    const events: string[] = [];
    const runtime = createPageRuntime(
      minimalDsl({
        lifecycle: {
          onReady: { action: 'setState', params: { ready: true } },
          onShow: { action: 'setState', params: { shown: true } },
          onHide: { action: 'setState', params: { hidden: true } },
        },
      }),
    );
    runtime.onLifecycle((event) => events.push(event));
    await runtime.initialized;

    await runtime.ready();
    await runtime.show();
    await runtime.hide();

    expect(runtime.context.state.getState()).toMatchObject({
      ready: true,
      shown: true,
      hidden: true,
    });
    expect(events).toEqual(['onInit', 'onLoad', 'onReady', 'onShow', 'onHide']);
  });

  it('destroy 执行 onDestroy 并清理订阅', async () => {
    const listener = vi.fn();
    const runtime = createPageRuntime(
      minimalDsl({
        lifecycle: { onDestroy: { action: 'setState', params: { gone: true } } },
      }),
    );
    runtime.onLifecycle(listener);
    await runtime.initialized;

    await runtime.destroy();

    expect(runtime.destroyed).toBe(true);
    expect(runtime.context.state.get('gone')).toBe(true);
    expect(listener).toHaveBeenCalledWith('onDestroy');

    // 订阅已清理：后续不再通知，宿主触发方法也不再执行
    listener.mockClear();
    await runtime.show();
    expect(listener).not.toHaveBeenCalled();
  });
});

describe('渲染入口', () => {
  it('渲染 body 子树', () => {
    const Label = ({ text }: { text?: string }) => <span>{text}</span>;
    const runtime = createPageRuntime(
      minimalDsl({
        state: { name: '世界' },
        body: { type: 'Label', props: { text: '你好 ${state.name}' } },
      }),
    );
    runtime.context.components.register('Label', Label);

    render(<PageRuntimeView runtime={runtime} />);

    expect(screen.getByText('你好 世界')).toBeTruthy();
  });

  it('runtime.render() 返回 React 元素', () => {
    const Label = ({ text }: { text?: string }) => <span>{text}</span>;
    const runtime = createPageRuntime(
      minimalDsl({ body: { type: 'Label', props: { text: 'hi' } } }),
    );
    runtime.context.components.register('Label', Label);

    render(<>{runtime.render()}</>);

    expect(screen.getByText('hi')).toBeTruthy();
  });

  it('无 body 渲染为空，不抛错', () => {
    const runtime = createPageRuntime(minimalDsl());

    const { container } = render(<PageRuntimeView runtime={runtime} />);

    expect(container.innerHTML).toBe('');
  });
});

/**
 * 端到端验证（tasks 7.3，设计文档第 10 节 Page DSL 的精简版）：
 * state → 表达式 props → 事件动作 → 数据源 reload。
 */
describe('端到端：设计文档第 10 节 Page DSL', () => {
  it('关键字搜索驱动数据源 reload', async () => {
    const pageDsl: PageDsl = {
      dsl: '1.0',
      requires: { runtime: '>=1.0.0' },
      page: { id: 'customer-list', title: '客户管理', type: 'list' },
      state: { keyword: '' },
      dataSources: {
        customers: {
          type: 'service',
          service: 'customer.list',
          autoLoad: true,
          params: { keyword: '${state.keyword}' },
        },
      },
      body: {
        type: 'Page',
        children: [
          {
            type: 'SearchButton',
            props: { text: '搜索 ${state.keyword}' },
            events: {
              onClick: [
                { action: 'setState', params: { keyword: '张' } },
                { action: 'reload', params: { dataSource: 'customers' } },
              ],
            },
          },
          { type: 'ResultCount', props: { text: '结果: ${data.customers}' } },
        ],
      },
    };

    const calls: Record<string, unknown>[] = [];
    // autoLoad 在创建时即触发，服务须经注入的 registry 预先注册
    const services = new Registry<ServiceHandler>('ServiceRegistry');
    services.register('customer.list', async (params) => {
      calls.push(params);
      return `list(${params['keyword']})`;
    });
    const runtime = createPageRuntime(pageDsl, { services });
    runtime.context.components.register('Page', ({ children }: { children?: React.ReactNode }) => (
      <div>{children}</div>
    ));
    runtime.context.components.register(
      'SearchButton',
      ({ text, onClick }: { text?: string; onClick?: () => void }) => (
        <button onClick={() => onClick?.()}>{text}</button>
      ),
    );
    runtime.context.components.register(
      'ResultCount',
      ({ text }: { text?: string }) => <span>{text}</span>,
    );

    render(<PageRuntimeView runtime={runtime} />);
    await act(async () => {
      await runtime.initialized;
    });

    // autoLoad 以初始 keyword '' 加载一次
    expect(calls).toEqual([{ keyword: '' }]);
    expect(screen.getByText('结果: list()')).toBeTruthy();

    // 点击：setState 更新 keyword → 按钮文案重渲染；reload 以新 keyword 重新加载
    screen.getByRole('button').click();
    await vi.waitFor(() => {
      expect(calls).toEqual([{ keyword: '' }, { keyword: '张' }]);
    });
    expect(screen.getByText('搜索 张')).toBeTruthy();
    expect(screen.getByText('结果: list(张)')).toBeTruthy();
  });
});

describe('命名动作结果（页面级 actionResults）', () => {
  it('事件分发间共享同一记录，destroy 时清理', async () => {
    const runtime = createPageRuntime(
      minimalDsl({
        body: {
          type: 'Page',
          children: [],
        },
      }),
    );
    await act(async () => {
      await runtime.initialized;
    });

    runtime.context.actions.register('mark', (action) => ({
      ok: true as const,
      data: action.params?.['value'],
    }));
    // 两次独立分发（模拟两次事件）读写同一 actionResults
    await runtime.engine.executeAll([
      { id: 'a', action: 'mark', params: { value: 1 } },
    ]);
    await runtime.engine.executeAll([
      { id: 'b', action: 'mark', params: { value: 2 } },
    ]);
    expect(runtime.context.actionResults).toEqual({ a: 1, b: 2 });

    await runtime.destroy();
    expect(runtime.context.actionResults).toEqual({});
  });
});

describe('页面级命名动作（PageDsl.actions + call）', () => {
  it('DSL 中的 actions 挂入 context，call 按名执行并共享页面 state', async () => {
    const runtime = createPageRuntime(
      minimalDsl({
        actions: {
          refreshAndMark: [
            { action: 'setState', params: { step: 'done' } },
          ],
        },
      }),
    );
    await act(async () => {
      await runtime.initialized;
    });

    expect(runtime.context.namedActions['refreshAndMark']).toBeDefined();

    const result = await runtime.engine.execute({
      action: 'call',
      params: { name: 'refreshAndMark' },
    });

    expect(result.ok).toBe(true);
    expect(runtime.context.state.get('step')).toBe('done');

    await runtime.destroy();
  });
});

describe('页面级命名组件（PageDsl.components）', () => {
  it('DSL 中的 components 挂入 context.pageComponents', async () => {
    const runtime = createPageRuntime(
      minimalDsl({
        components: {
          header: { type: 'Page', children: [] },
        },
      }),
    );
    await act(async () => {
      await runtime.initialized;
    });

    expect(runtime.context.pageComponents['header']).toBeDefined();

    await runtime.destroy();
  });
});

describe('PageRuntimeView children（Renderer 上下文内的宿主扩展）', () => {
  it('children 渲染在 DslRenderer 上下文之内，可 useRenderer', async () => {
    const runtime = createPageRuntime(
      minimalDsl({
        body: { type: 'Page', children: [] },
      }),
    );
    runtime.context.components.register(
      'Page',
      ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    );
    await act(async () => {
      await runtime.initialized;
    });

    const seen: string[] = [];
    function HostExtension() {
      const { context } = useRenderer();
      seen.push(context.page.id ?? '');
      return <span>扩展位</span>;
    }

    render(
      <PageRuntimeView runtime={runtime}>
        <HostExtension />
      </PageRuntimeView>,
    );

    expect(screen.getByText('扩展位')).toBeTruthy();
    expect(seen).toEqual(['p1']);
    await runtime.destroy();
  });
});
