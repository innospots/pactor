// @vitest-environment jsdom
/**
 * 整应用 locale 请求传播与缓存隔离（G24/G25，设计 5.2）：
 * 缺省 HttpDslResourceLoader 按会话 locale 分实例——页面请求携带
 * `?locale=`，缓存键 id@version@locale；setLocale 后页面重建不命中
 * 旧语言缓存，切回旧语言命中各自缓存。bootstrap 请求（会话未就绪）
 * 不携带 locale（保持现状）。
 */
import './setup.js';

import { act, cleanup, screen, waitFor } from '@testing-library/react';
import type { PageDsl } from '@pactor-app/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createPactorApplication,
  type PactorApplication,
} from '../src/index.js';
import {
  createBootstrap,
  mountApp,
  setUrl,
  standardMenus,
  unmountApp,
} from './helpers.js';

let app: PactorApplication | null = null;

/** 渲染 ${t('welcome')} 的页面 */
function welcomePage(): PageDsl {
  return {
    dsl: '1.0',
    page: { id: 'home', title: '首页' },
    body: {
      type: 'Page',
      children: [{ type: 'Text', props: { value: "${t('welcome')}" } }],
    },
  };
}

const localeMessages = {
  'zh-CN': { welcome: '欢迎' },
  'en-US': { welcome: 'Welcome' },
};

const json = (data: unknown): Response =>
  new Response(JSON.stringify(data), { status: 200 });

/** 记录请求 URL 的 fetch mock：bootstrap / 页面端点 */
function createFetchMock() {
  const urls: string[] = [];
  const mock = vi.fn(async (input: unknown) => {
    const url = String(input);
    urls.push(url);
    if (url.endsWith('/bootstrap')) {
      return json(
        createBootstrap({
          menus: [standardMenus[0]],
          locale: 'zh-CN',
          messages: localeMessages,
          pageVersions: { home: 3 },
        }),
      );
    }
    if (url.includes('/pages/home')) {
      return json({
        id: 'home',
        resourceType: 'page',
        version: 3,
        dslVersion: '1.0',
        schema: welcomePage(),
      });
    }
    throw new Error(`unexpected url: ${url}`);
  });
  return { mock, urls };
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(async () => {
  if (app !== null) {
    await unmountApp(app);
    app = null;
  }
  cleanup();
  document.body.innerHTML = '';
  window.history.replaceState({}, '', '/');
  localStorage.clear();
  vi.unstubAllGlobals();
});

describe('locale 请求传播与缓存隔离（G24/G25）', () => {
  function createHttpApp(): ReturnType<typeof createFetchMock> {
    const { mock, urls } = createFetchMock();
    // 缺省 HttpDslResourceLoader 在 createPactorApplication 时捕获全局 fetch
    vi.stubGlobal('fetch', mock);
    app = createPactorApplication({
      appId: 'risk-admin',
      api: { baseURL: '/api/runtime' },
      components: {
        Text: ({ value }: { value?: string }) => <span>{value}</span>,
      },
    });
    return { mock, urls };
  }

  it('bootstrap 不带 locale；页面请求携带会话 locale 的 ?locale=', async () => {
    setUrl('/');
    const { urls } = createHttpApp();
    await mountApp(app!);
    await screen.findByText('欢迎');

    expect(urls[0]).toBe('/api/runtime/bootstrap');
    expect(urls).toContain('/api/runtime/pages/home?locale=zh-CN');
    expect(urls.filter((u) => u.includes('/pages/'))).toEqual([
      '/api/runtime/pages/home?locale=zh-CN',
    ]);
  });

  it('setLocale 后页面重建不命中旧语言缓存；切回命中各自缓存', async () => {
    setUrl('/');
    const { urls } = createHttpApp();
    await mountApp(app!);
    await screen.findByText('欢迎');
    const zhPageCalls = () =>
      urls.filter((u) => u === '/api/runtime/pages/home?locale=zh-CN').length;
    expect(zhPageCalls()).toBe(1);

    // 切到 en-US：新语言缓存未命中 → 携带新 locale 重新请求
    await act(async () => {
      app!.setLocale('en-US');
    });
    await screen.findByText('Welcome');
    await waitFor(() => {
      expect(urls).toContain('/api/runtime/pages/home?locale=en-US');
    });

    // 切回 zh-CN：命中各自语言缓存（id@version@locale），不再请求
    await act(async () => {
      app!.setLocale('zh-CN');
    });
    await screen.findByText('欢迎');
    expect(zhPageCalls()).toBe(1);
    expect(
      urls.filter((u) => u === '/api/runtime/pages/home?locale=en-US'),
    ).toHaveLength(1);
  });
});
