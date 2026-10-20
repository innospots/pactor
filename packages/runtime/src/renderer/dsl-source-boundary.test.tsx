// @vitest-environment jsdom
import { Registry, type DslNode, type PageDsl } from '@pactor-app/core';
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { ServiceHandler } from '../index.js';
import { createPageRuntime, PageRuntimeView } from '../page/page-runtime.js';

afterEach(cleanup);

/** 等待异步引用解析落地（固定延迟冲刷；勿用 act 包 vi.waitFor——轮询不会推进） */
async function flushAsync(ms = 300) {
  await act(async () => {
    await new Promise((r) => setTimeout(r, ms));
  });
}


function minimalDsl(overrides: Partial<PageDsl> = {}): PageDsl {
  return {
    dsl: '1.0',
    page: { id: 'p1', title: '测试页' },
    ...overrides,
  };
}

const Label = ({ text }: { text?: string }) => <span>{text}</span>;

function registerLabel(runtime: ReturnType<typeof createPageRuntime>) {
  runtime.context.components.register('Label', Label);
  runtime.context.components.register(
    'Page',
    ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  );
}

describe('动态 DSL 引用（DslSourceRef）', () => {
  it('节点 children 为 service 引用：先渲染占位，成功后渲染远端子树', async () => {
    const services = new Registry<ServiceHandler>('ServiceRegistry');
    services.register('dsl.items', async () => [
      { type: 'Label', props: { text: '远端 ${state.name}' } },
    ] satisfies DslNode[]);
    const runtime = createPageRuntime(
      minimalDsl({
        state: { name: '世界' },
        body: {
          type: 'Page',
          children: {
            source: { type: 'service', service: 'dsl.items' },
            placeholder: { type: 'Label', props: { text: '加载中' } },
          },
        },
      }),
      { services },
    );
    registerLabel(runtime);

    render(<PageRuntimeView runtime={runtime} />);

    // 占位先行
    expect(screen.getByText('加载中')).toBeTruthy();
    await flushAsync();
    expect(screen.getByText('远端 世界')).toBeTruthy();
    expect(screen.queryByText('加载中')).toBeNull();
    await runtime.destroy();
  });

  it('同一引用两处渲染只请求一次（Promise 级缓存去重）', async () => {
    const service = vi.fn(async () => [{ type: 'Label', props: { text: 'x' } }]);
    const services = new Registry<ServiceHandler>('ServiceRegistry');
    services.register('dsl.items', service);
    const ref = { source: { type: 'service', service: 'dsl.items' } } as const;
    const runtime = createPageRuntime(
      minimalDsl({
        body: {
          type: 'Page',
          children: [
            { type: 'Page', children: ref },
            { type: 'Page', children: ref },
          ],
        },
      }),
      { services },
    );
    registerLabel(runtime);

    render(<PageRuntimeView runtime={runtime} />);
    await flushAsync();
    expect(screen.getAllByText('x')).toHaveLength(2);
    expect(service).toHaveBeenCalledTimes(1);
    await runtime.destroy();
  });

  it('children 数组混排：内联节点与引用元素按声明顺序渲染，单引用失败不影响其他元素', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const services = new Registry<ServiceHandler>('ServiceRegistry');
    services.register('dsl.good', async () => [
      { type: 'Label', props: { text: '远端A' } },
    ]);
    services.register('dsl.bad', async () => {
      throw new Error('boom');
    });
    const runtime = createPageRuntime(
      minimalDsl({
        body: {
          type: 'Page',
          children: [
            { type: 'Label', props: { text: '内联1' } },
            { source: { type: 'service', service: 'dsl.good' } },
            { type: 'Label', props: { text: '内联2' } },
            { source: { type: 'service', service: 'dsl.bad' } },
            { type: 'Label', props: { text: '内联3' } },
          ],
        },
      }),
      { services },
    );
    registerLabel(runtime);

    const { container } = render(<PageRuntimeView runtime={runtime} />);
    await flushAsync();

    // 内联元素立即渲染；引用元素异步落地；失败引用渲染空
    expect(screen.getByText('内联1')).toBeTruthy();
    expect(screen.getByText('远端A')).toBeTruthy();
    expect(screen.getByText('内联2')).toBeTruthy();
    expect(screen.getByText('内联3')).toBeTruthy();
    expect(warn).toHaveBeenCalled();

    // 渲染顺序与声明一致
    const texts = [...container.querySelectorAll('span')].map((el) => el.textContent);
    expect(texts).toEqual(['内联1', '远端A', '内联2', '内联3']);
    warn.mockRestore();
    await runtime.destroy();
  });

  it('根级 children 数组混排引用元素：渲染入口直接支持', async () => {
    const services = new Registry<ServiceHandler>('ServiceRegistry');
    services.register('dsl.root', async () => [
      { type: 'Label', props: { text: '根级远端' } },
    ]);
    const runtime = createPageRuntime(
      minimalDsl({
        children: [
          { type: 'Label', props: { text: '根级内联' } },
          { source: { type: 'service', service: 'dsl.root' } },
        ],
      }),
      { services },
    );
    registerLabel(runtime);

    render(<PageRuntimeView runtime={runtime} />);
    await flushAsync();

    expect(screen.getByText('根级内联')).toBeTruthy();
    expect(screen.getByText('根级远端')).toBeTruthy();
    await runtime.destroy();
  });

  it('引用 params 表达式按首次作用域求值一次', async () => {
    const service = vi.fn(async () => [{ type: 'Label', props: { text: 'ok' } }]);
    const services = new Registry<ServiceHandler>('ServiceRegistry');
    services.register('dsl.items', service);
    const runtime = createPageRuntime(
      minimalDsl({
        state: { id: 'a' },
        body: {
          type: 'Page',
          children: {
            source: {
              type: 'service',
              service: 'dsl.items',
              params: { id: '${state.id}' },
            },
          },
        },
      }),
      { services },
    );
    registerLabel(runtime);

    render(<PageRuntimeView runtime={runtime} />);
    await flushAsync();
    expect(screen.getByText('ok')).toBeTruthy();
    expect(service).toHaveBeenCalledWith({ id: 'a' });

    // state 变化不触发重拉
    await act(async () => {
      runtime.context.state.set('id', 'b');
    });
    expect(service).toHaveBeenCalledTimes(1);
    await runtime.destroy();
  });

  it('解析失败：告警并渲染空，不击穿渲染层', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const services = new Registry<ServiceHandler>('ServiceRegistry');
    services.register('dsl.bad', async () => {
      throw new Error('boom');
    });
    const runtime = createPageRuntime(
      minimalDsl({
        body: {
          type: 'Page',
          children: [
            { type: 'Label', props: { text: 'before' } },
            { type: 'Page', children: { source: { type: 'service', service: 'dsl.bad' } } },
            { type: 'Label', props: { text: 'after' } },
          ],
        },
      }),
      { services },
    );
    registerLabel(runtime);

    render(<PageRuntimeView runtime={runtime} />);
    await flushAsync();
    expect(warn).toHaveBeenCalled();
    expect(screen.getByText('before')).toBeTruthy();
    expect(screen.getByText('after')).toBeTruthy();
    warn.mockRestore();
    await runtime.destroy();
  });

  it('远端内容未通过 Schema 校验：告警并渲染空', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const services = new Registry<ServiceHandler>('ServiceRegistry');
    services.register('dsl.invalid', async () => [{ props: { text: '缺 type' } }]);
    const runtime = createPageRuntime(
      minimalDsl({
        body: {
          type: 'Page',
          children: { source: { type: 'service', service: 'dsl.invalid' } },
        },
      }),
      { services },
    );
    registerLabel(runtime);

    const { container } = render(<PageRuntimeView runtime={runtime} />);
    await flushAsync();
    expect(warn).toHaveBeenCalled();
    expect(screen.queryByText('缺 type')).toBeNull();
    expect(container.innerHTML).not.toContain('缺 type');
    warn.mockRestore();
    await runtime.destroy();
  });

  it('命名组件为动态引用：component 引用处惰性解析并套用覆盖', async () => {
    const services = new Registry<ServiceHandler>('ServiceRegistry');
    services.register('dsl.card', async () => ({
      type: 'Label',
      props: { text: '定义处' },
    }));
    const runtime = createPageRuntime(
      minimalDsl({
        components: {
          remote: { source: { type: 'service', service: 'dsl.card' } },
        },
        body: {
          type: 'Page',
          children: [
            { component: 'remote', props: { text: '引用处覆盖' } },
          ],
        },
      }),
      { services },
    );
    registerLabel(runtime);

    render(<PageRuntimeView runtime={runtime} />);
    await flushAsync();
    expect(screen.getByText('引用处覆盖')).toBeTruthy();
    await runtime.destroy();
  });

  it('根级 children 为 http 引用：渲染入口异步解析渲染', async () => {
    const http = {
      request: vi.fn(async () => [{ type: 'Label', props: { text: '远端根' } }]),
    };
    const runtime = createPageRuntime(
      minimalDsl({
        children: {
          source: { type: 'http', request: { url: '/api/dsl/root' } },
        },
      }),
      { http },
    );
    registerLabel(runtime);

    render(<PageRuntimeView runtime={runtime} />);
    await flushAsync();
    expect(screen.getByText('远端根')).toBeTruthy();
    expect(http.request).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/api/dsl/root' }),
    );
    await runtime.destroy();
  });
});

describe('片段载荷（DslFragmentPayload）', () => {
  it('片段携带 state：合并进页面 state 后渲染 children 子树', async () => {
    const services = new Registry<ServiceHandler>('ServiceRegistry');
    services.register('dsl.frag', async () => ({
      children: [{ type: 'Label', props: { text: '${state.greeting} 世界' } }],
      state: { greeting: '你好' },
    }));
    const runtime = createPageRuntime(
      minimalDsl({
        body: {
          type: 'Page',
          children: { source: { type: 'service', service: 'dsl.frag' } },
        },
      }),
      { services },
    );
    registerLabel(runtime);

    render(<PageRuntimeView runtime={runtime} />);
    await flushAsync();

    expect(screen.getByText('你好 世界')).toBeTruthy();
    expect(runtime.context.state.get('greeting')).toBe('你好');
    await runtime.destroy();
  });

  it('片段携带 dataSources：autoLoad 源自动加载，reload 对运行时注册源生效', async () => {
    let l2Loads = 0;
    const services = new Registry<ServiceHandler>('ServiceRegistry');
    services.register('dsl.frag', async () => ({
      children: [
        { type: 'Label', props: { text: 'L2: ${data.level2}' } },
      ],
      dataSources: {
        level2: { type: 'service', service: 'svc.l2', autoLoad: true },
      },
    }));
    services.register('svc.l2', async () => `v${++l2Loads}`);
    const runtime = createPageRuntime(
      minimalDsl({
        body: {
          type: 'Page',
          children: { source: { type: 'service', service: 'dsl.frag' } },
        },
      }),
      { services },
    );
    registerLabel(runtime);

    render(<PageRuntimeView runtime={runtime} />);
    await flushAsync();

    // autoLoad：注册后即触发一次加载（页面 init 已过）
    expect(l2Loads).toBe(1);
    expect(screen.getByText('L2: v1')).toBeTruthy();

    // reload 对 init 之后注册的源生效
    await act(async () => {
      await runtime.context.data.reload('level2');
    });
    expect(l2Loads).toBe(2);
    expect(screen.getByText('L2: v2')).toBeTruthy();
    await runtime.destroy();
  });

  it('片段数据源 URL 的 ${state.*} 按加载时的实时作用域求值', async () => {
    const http = {
      request: vi.fn(async (config: { url: string }) => ({ url: config.url })),
    };
    const services = new Registry<ServiceHandler>('ServiceRegistry');
    services.register('dsl.frag', async () => ({
      children: [{ type: 'Label', props: { text: 'frag' } }],
      state: { l1: 'a' },
      dataSources: {
        level2: {
          type: 'http',
          autoLoad: false,
          request: { url: '/api/l2/${state.l1}' },
        },
      },
    }));
    const runtime = createPageRuntime(
      minimalDsl({
        body: {
          type: 'Page',
          children: { source: { type: 'service', service: 'dsl.frag' } },
        },
      }),
      { services, http },
    );
    registerLabel(runtime);

    render(<PageRuntimeView runtime={runtime} />);
    await flushAsync();

    // autoLoad: false 不自动加载
    expect(http.request).not.toHaveBeenCalled();

    // 片段 state 已合并，加载时按当前作用域求值
    await act(async () => {
      await runtime.context.data.load('level2');
    });
    expect(http.request).toHaveBeenLastCalledWith(
      expect.objectContaining({ url: '/api/l2/a' }),
    );

    // state 变化后再次加载按新作用域求值
    await act(async () => {
      runtime.context.state.set('l1', 'b');
    });
    await act(async () => {
      await runtime.context.data.load('level2');
    });
    expect(http.request).toHaveBeenLastCalledWith(
      expect.objectContaining({ url: '/api/l2/b' }),
    );
    await runtime.destroy();
  });

  it('数据源名冲突：告警并跳过，页面级配置不受影响', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const services = new Registry<ServiceHandler>('ServiceRegistry');
    services.register('dsl.frag', async () => ({
      children: [{ type: 'Label', props: { text: 'frag' } }],
      dataSources: {
        shared: { type: 'static', value: 'frag-value' },
      },
    }));
    const runtime = createPageRuntime(
      minimalDsl({
        dataSources: {
          shared: { type: 'static', value: 'page-value' },
        },
        body: {
          type: 'Page',
          children: { source: { type: 'service', service: 'dsl.frag' } },
        },
      }),
      { services },
    );
    registerLabel(runtime);

    render(<PageRuntimeView runtime={runtime} />);
    await flushAsync();

    expect(warn).toHaveBeenCalled();
    expect(screen.getByText('frag')).toBeTruthy();
    // 冲突名跳过：仍是页面级配置
    await act(async () => {
      await runtime.context.data.load('shared');
    });
    expect(runtime.context.data.getData('shared')).toBe('page-value');
    warn.mockRestore();
    await runtime.destroy();
  });

  it('卸载时注销本边界注册的数据源', async () => {
    const services = new Registry<ServiceHandler>('ServiceRegistry');
    services.register('dsl.frag', async () => ({
      children: [{ type: 'Label', props: { text: 'frag' } }],
      dataSources: {
        temp: { type: 'static', value: 1 },
      },
    }));
    const runtime = createPageRuntime(
      minimalDsl({
        body: {
          type: 'Page',
          children: { source: { type: 'service', service: 'dsl.frag' } },
        },
      }),
      { services },
    );
    registerLabel(runtime);

    const { unmount } = render(<PageRuntimeView runtime={runtime} />);
    await flushAsync();
    await act(async () => {
      await runtime.context.data.load('temp');
    });
    expect(runtime.context.data.getData('temp')).toBe(1);

    unmount();

    // 卸载后注销：按未知源抛错
    await expect(runtime.context.data.load('temp')).rejects.toThrow('temp');
    await runtime.destroy();
  });

  it('无效载荷（children 非数组）：按既有校验路径告警并渲染空', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const services = new Registry<ServiceHandler>('ServiceRegistry');
    services.register('dsl.bad', async () => ({ children: 'not-an-array' }));
    const runtime = createPageRuntime(
      minimalDsl({
        body: {
          type: 'Page',
          children: [
            { type: 'Label', props: { text: 'before' } },
            { type: 'Page', children: { source: { type: 'service', service: 'dsl.bad' } } },
            { type: 'Label', props: { text: 'after' } },
          ],
        },
      }),
      { services },
    );
    registerLabel(runtime);

    render(<PageRuntimeView runtime={runtime} />);
    await flushAsync();

    expect(warn).toHaveBeenCalled();
    expect(screen.getByText('before')).toBeTruthy();
    expect(screen.getByText('after')).toBeTruthy();
    warn.mockRestore();
    await runtime.destroy();
  });

  it('片段 children 内含非法节点：校验失败告警并渲染空', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const services = new Registry<ServiceHandler>('ServiceRegistry');
    services.register('dsl.badfrag', async () => ({
      children: [{ props: { text: '缺 type' } }],
      state: { x: 1 },
    }));
    const runtime = createPageRuntime(
      minimalDsl({
        body: {
          type: 'Page',
          children: { source: { type: 'service', service: 'dsl.badfrag' } },
        },
      }),
      { services },
    );
    registerLabel(runtime);

    const { container } = render(<PageRuntimeView runtime={runtime} />);
    await flushAsync();

    expect(warn).toHaveBeenCalled();
    expect(container.innerHTML).not.toContain('缺 type');
    warn.mockRestore();
    await runtime.destroy();
  });

  it('裸数组响应行为不变：无副作用、无告警', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const services = new Registry<ServiceHandler>('ServiceRegistry');
    services.register('dsl.plain', async () => [
      { type: 'Label', props: { text: '裸数组' } },
    ]);
    const runtime = createPageRuntime(
      minimalDsl({
        body: {
          type: 'Page',
          children: { source: { type: 'service', service: 'dsl.plain' } },
        },
      }),
      { services },
    );
    registerLabel(runtime);

    render(<PageRuntimeView runtime={runtime} />);
    await flushAsync();

    expect(screen.getByText('裸数组')).toBeTruthy();
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
    await runtime.destroy();
  });

  it('根级 children 引用返回片段载荷：注册数据源并渲染 children 子树', async () => {
    const services = new Registry<ServiceHandler>('ServiceRegistry');
    services.register('dsl.rootfrag', async () => ({
      children: [{ type: 'Label', props: { text: '根片段 ${state.tag}' } }],
      state: { tag: 'R' },
      dataSources: {
        rootData: { type: 'static', value: 'rd', autoLoad: true },
      },
    }));
    const runtime = createPageRuntime(
      minimalDsl({
        children: { source: { type: 'service', service: 'dsl.rootfrag' } },
      }),
      { services },
    );
    registerLabel(runtime);

    render(<PageRuntimeView runtime={runtime} />);
    await flushAsync();

    expect(screen.getByText('根片段 R')).toBeTruthy();
    expect(runtime.context.data.getData('rootData')).toBe('rd');
    await runtime.destroy();
  });
});
