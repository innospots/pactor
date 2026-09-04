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
