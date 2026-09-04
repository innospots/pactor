// @vitest-environment jsdom
import './setup.js';

import type { PageDsl } from '@pactor-app/core';
import { StaticDslLoader } from '@pactor-app/resource';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createPactorPage, PactorPage } from '../src/index.js';

afterEach(cleanup);

const detailPage: PageDsl = {
  dsl: '1.0',
  page: { id: 'detail', title: '详情' },
  body: {
    type: 'Page',
    props: { title: '详情页' },
    children: [
      { type: 'Alert', props: { message: 'ID：${route.params.id}' } },
    ],
  },
};

const listPage: PageDsl = {
  dsl: '1.0',
  page: { id: 'list', title: '列表' },
  state: { mark: 'A' },
  body: {
    type: 'Page',
    children: [
      { type: 'Alert', props: { message: '列表-${state.mark}' } },
      {
        type: 'Button',
        props: { text: '标记' },
        events: {
          onClick: { action: 'setState', params: { mark: 'B' } },
        },
      },
    ],
  },
};

describe('PactorPage 嵌入式页面', () => {
  it('pageId 经 loader 加载渲染，route.params 注入表达式作用域', async () => {
    const loader = new StaticDslLoader({ pages: { detail: detailPage } });
    const Page = createPactorPage({ loader });

    render(<Page pageId="detail" route={{ params: { id: '42' } }} />);

    expect(await screen.findByText('详情页')).toBeDefined();
    expect(screen.getByText('ID：42')).toBeDefined();
  });

  it('直接传 page 渲染（不经 loader）', async () => {
    render(<PactorPage page={detailPage} route={{ params: { id: '7' } }} />);

    expect(await screen.findByText('ID：7')).toBeDefined();
  });

  it('pageId 加载失败渲染错误页，重试后重新加载', async () => {
    let fail = true;
    const loader = {
      loadBootstrap: async () => ({}),
      loadPage: async () => {
        if (fail) {
          throw new Error('网络错误');
        }
        return { schema: detailPage, version: 1 };
      },
    } as never;
    const onError = vi.fn();
    const Page = createPactorPage({ loader, onError });

    render(<Page pageId="detail" route={{ params: { id: '1' } }} />);

    expect(await screen.findByText('页面加载失败')).toBeDefined();
    expect(onError).toHaveBeenCalledOnce();

    fail = false;
    fireEvent.click(screen.getByRole('button', { name: '重试' }));

    expect(await screen.findByText('详情页')).toBeDefined();
  });

  it('交互层一致：overlay.open 在嵌入页可用', async () => {
    const page: PageDsl = {
      dsl: '1.0',
      page: { id: 'p', title: 'P' },
      body: {
        type: 'Page',
        children: [
          {
            type: 'Button',
            props: { text: '打开' },
            events: {
              onClick: {
                action: 'overlay.open',
                params: {
                  overlay: {
                    type: 'modal',
                    title: '弹层',
                    content: { type: 'Alert', props: { message: '弹层内容' } },
                  },
                },
              },
            },
          },
        ],
      },
    };
    const Page = createPactorPage({});

    render(<Page page={page} />);
    fireEvent.click(await screen.findByRole('button', { name: '打开' }));

    expect(await screen.findByText('弹层内容')).toBeDefined();
  });

  it('多实例隔离：一个实例的 setState 不影响另一个', async () => {
    const Page = createPactorPage({});

    render(
      <div>
        <Page page={listPage} />
        <Page page={detailPage} route={{ params: { id: '9' } }} />
      </div>,
    );

    expect(await screen.findByText('列表-A')).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: '标记' }));

    expect(await screen.findByText('列表-B')).toBeDefined();
    expect(screen.getByText('ID：9')).toBeDefined();
  });

  it('navigate 动作退化为自然跳转（location.assign，不崩溃）', async () => {
    const page: PageDsl = {
      dsl: '1.0',
      page: { id: 'p', title: 'P' },
      body: {
        type: 'Page',
        children: [
          {
            type: 'Button',
            props: { text: '跳转' },
            events: {
              onClick: { action: 'navigate', params: { to: '/legacy/path' } },
            },
          },
        ],
      },
    };
    const Page = createPactorPage({});

    render(<Page page={page} />);
    // jsdom 的 location.assign 未实现（virtual console 报错但不抛异常）
    fireEvent.click(await screen.findByRole('button', { name: '跳转' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '跳转' })).toBeDefined();
    });
  });
});
