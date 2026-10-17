// @vitest-environment jsdom
/**
 * SitemapApp（design/dynamic-page.md）：多源合并 / menus×pages 继承 /
 * 缓存加载器 / 匿名守卫 / DSL 布局渲染 / activeMenu 高亮。
 */
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { StrictMode } from 'react';
import type { PageDsl } from '@pactor-app/core';
import { MenuRegistry } from '@pactor-app/router';
import { createComponentRegistry } from '@pactor-app/ui/components';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createHttpHooks,
  createSitemapLoader,
  defaultSitemapActions,
  defaultSitemapGuard,
  fetchSitemap,
  mergeSitemapMenus,
  resolveSitemapRoute,
  SitemapApp,
} from '../src/index.js';
import type { SitemapResource } from '../src/index.js';

const textPage = (id: string, text: string): PageDsl => ({
  dsl: '1.0',
  page: { id, title: id },
  body: { type: 'Text', props: { text } },
});

const simpleLayout = {
  dsl: '1.0',
  body: {
    type: 'Flex',
    props: { direction: 'horizontal' },
    children: [
      { type: 'SitemapMenu', props: { items: '${data.session.menus}' } },
      { type: 'PageOutlet' },
    ],
  },
};

function createSitemap(overrides: Partial<SitemapResource> = {}): SitemapResource {
  return {
    id: 'site',
    resourceType: 'sitemap',
    version: 1,
    dslVersion: '1.0',
    app: { name: 'Test App' },
    layout: 'admin',
    auth: { loginPath: '/login' },
    layouts: { admin: simpleLayout },
    pages: [
      { id: 'login', path: '/login', title: '登录', version: 1, pageDsl: textPage('login', '登录页') },
      { id: 'home', path: '/', title: '首页', version: 1, pageDsl: textPage('home', '首页内容') },
      { id: 'detail', path: '/reports/:id', title: '详情', version: 1, pageDsl: textPage('detail', '详情内容') },
    ],
    menus: [
      { id: 'login', type: 'page', pageId: 'login', title: '登录', public: true, hidden: true },
      { id: 'home', type: 'page', pageId: 'home', title: '首页', icon: 'home', order: 1 },
      { id: 'detail', type: 'page', pageId: 'detail', title: '详情', hidden: true, activeMenu: 'home' },
    ],
    ...overrides,
  };
}

const jsonResponse = (data: unknown): Response =>
  new Response(JSON.stringify(data), { status: 200 });

afterEach(cleanup);

describe('mergeSitemapMenus', () => {
  it('type: page 条目缺省继承引用页面的 path / title，覆写优先', () => {
    const sitemap = createSitemap();
    const merged = mergeSitemapMenus(sitemap);
    const home = merged.find((m) => m.id === 'home')!;
    expect(home.path).toBe('/');
    expect(home.title).toBe('首页');

    const custom = mergeSitemapMenus({
      ...sitemap,
      menus: [{ id: 'x', type: 'page', pageId: 'home', title: '工作台' }],
    });
    expect(custom[0]!.title).toBe('工作台');
    expect(custom[0]!.path).toBe('/');
  });

  it('group / link 原样透传，children 递归合并', () => {
    const merged = mergeSitemapMenus({
      ...createSitemap(),
      menus: [
        {
          id: 'g',
          type: 'group',
          title: '分组',
          children: [{ id: 'home', type: 'page', pageId: 'home', title: '首页' }],
        },
        { id: 'ext', type: 'link', title: '外链', path: 'https://a.com', external: true },
      ],
    });
    expect(merged[0]!.children![0]!.path).toBe('/');
    expect(merged[1]!.path).toBe('https://a.com');
  });
});

describe('fetchSitemap', () => {
  it('多源合并：pages/menus/layouts 按键合并，后源覆盖前源', async () => {
    const a = createSitemap();
    const b = createSitemap({
      pages: [{ id: 'extra', path: '/extra', title: '扩展', pageDsl: textPage('extra', 'x') }],
      menus: [{ id: 'home', type: 'page', pageId: 'home', title: '覆盖首页' }],
      layouts: { admin: { dsl: '1.0', body: { type: 'PageOutlet' } } },
    });
    const fetcher = vi.fn(async (url: string) =>
      jsonResponse(url === '/a' ? a : b),
    ) as unknown as typeof fetch;
    const merged = await fetchSitemap(['/a', '/b'], { fetcher });
    expect(merged.pages.map((p) => p.id)).toContain('extra');
    expect(merged.menus.find((m) => m.id === 'home')!.title).toBe('覆盖首页');
    expect(merged.layouts['admin']!.body.type).toBe('PageOutlet');
    // app / auth 取第一个源
    expect(merged.app).toEqual(a.app);
  });

  it('baseUrl：相对源地址以 baseUrl 补全，绝对地址原样', async () => {
    const sitemap = createSitemap();
    const fetcher = vi.fn(async () => jsonResponse(sitemap)) as unknown as typeof fetch;
    await fetchSitemap(['api/sitemap', '/sitemap2', 'https://cdn.example.com/s.json'], {
      fetcher,
      baseUrl: 'https://api.example.com/',
    });
    const urls = vi.mocked(fetcher).mock.calls.map((c) => c[0]);
    expect(urls).toEqual([
      'https://api.example.com/api/sitemap',
      'https://api.example.com/sitemap2',
      'https://cdn.example.com/s.json',
    ]);
  });

  it('baseUrl 缺省：相对地址原样传递（由宿主环境解析）', async () => {
    const fetcher = vi.fn(async () =>
      jsonResponse(createSitemap()),
    ) as unknown as typeof fetch;
    await fetchSitemap(['/api/sitemap'], { fetcher });
    expect(vi.mocked(fetcher).mock.calls[0]![0]).toBe('/api/sitemap');
    // 跨源 cookie 会话：credentials: 'include'
    expect(vi.mocked(fetcher).mock.calls[0]![1]).toMatchObject({
      credentials: 'include',
    });
  });

  it('httpHooks：request 改写地址，response 拆包', async () => {
    const sitemap = createSitemap();
    const fetcher = vi.fn(async (url: string) =>
      jsonResponse({ data: url === 'https://proxy/api/sitemap' ? sitemap : null }),
    ) as unknown as typeof fetch;
    const merged = await fetchSitemap(['/api/sitemap'], {
      fetcher,
      httpHooks: {
        request: (config) => ({ ...config, url: `https://proxy${config.url}` }),
        response: (data) => (data as { data: unknown }).data,
      },
    });
    expect(vi.mocked(fetcher).mock.calls[0]![0]).toBe('https://proxy/api/sitemap');
    expect(merged.id).toBe('site');
  });
});

describe('createSitemapLoader', () => {
  it('内联页直接命中并注入 session dataSource', async () => {
    const loader = createSitemapLoader(createSitemap());
    const resource = await loader.loadPage('home');
    expect(resource.version).toBe(1);
    expect(resource.schema.dataSources?.['session']).toEqual({
      type: 'service',
      service: 'session.context',
      autoLoad: true,
    });
  });

  it('懒加载页经端点获取，id@version 缓存只取一次', async () => {
    const fetcher = vi.fn(async () =>
      jsonResponse({
        id: 'lazy',
        resourceType: 'page',
        version: 7,
        dslVersion: '1.0',
        schema: textPage('lazy', '懒加载'),
      }),
    ) as unknown as typeof fetch;
    const sitemap = createSitemap({
      pages: [{ id: 'lazy', path: '/lazy', title: '懒页', version: 7 }],
    });
    const loader = createSitemapLoader(sitemap, { fetcher });
    const first = await loader.loadPage('lazy');
    const second = await loader.loadPage('lazy');
    expect(first).toBe(second);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('baseUrl：懒加载端点相对路径以 baseUrl 补全', async () => {
    const fetcher = vi.fn(async () =>
      jsonResponse({
        id: 'lazy',
        resourceType: 'page',
        version: 1,
        dslVersion: '1.0',
        schema: textPage('lazy', '懒加载'),
      }),
    ) as unknown as typeof fetch;
    const sitemap = createSitemap({
      pages: [{ id: 'lazy', path: '/lazy', title: '懒页', version: 1 }],
    });
    const loader = createSitemapLoader(sitemap, {
      fetcher,
      baseUrl: 'https://api.example.com',
    });
    await loader.loadPage('lazy');
    expect(vi.mocked(fetcher).mock.calls[0]![0]).toBe(
      'https://api.example.com/api/pages/lazy',
    );
  });

  it('httpHooks：页面端点请求同样经过 response 拆包', async () => {
    const page = {
      id: 'lazy',
      resourceType: 'page',
      version: 1,
      dslVersion: '1.0',
      schema: textPage('lazy', '懒加载'),
    };
    const fetcher = vi.fn(async () =>
      jsonResponse({ data: page }),
    ) as unknown as typeof fetch;
    const sitemap = createSitemap({
      pages: [{ id: 'lazy', path: '/lazy', title: '懒页' }],
    });
    const loader = createSitemapLoader(sitemap, {
      fetcher,
      httpHooks: { response: (data) => (data as { data: unknown }).data },
    });
    const resource = await loader.loadPage('lazy');
    expect(resource.id).toBe('lazy');
    expect(resource.schema.body).toEqual(textPage('lazy', '懒加载').body);
  });
});

describe('resolveSitemapRoute', () => {
  const resolve = (sitemap: SitemapResource, pathname: string) =>
    resolveSitemapRoute(sitemap, new MenuRegistry(mergeSitemapMenus(sitemap)), pathname);

  it('布局名解析链：menu.layout → 顶层 layout → layouts 首键', () => {
    const base = createSitemap();
    // 顶层 layout
    expect(resolve(base, '/')!.route!.layoutName).toBe('admin');
    // menu.layout 优先
    const withMenuLayout = createSitemap({
      layouts: { ...base.layouts, bare: { dsl: '1.0', body: { type: 'PageOutlet' } } },
      menus: [{ id: 'home', type: 'page', pageId: 'home', title: '首页', layout: 'bare' }],
    });
    expect(resolve(withMenuLayout, '/')!.route!.layoutName).toBe('bare');
    // 无顶层 layout → layouts 首键
    const noTopLayout = createSitemap({ layout: undefined });
    expect(resolve(noTopLayout, '/')!.route!.layoutName).toBe('admin');
  });

  it('activeMenu：高亮 key 取指向菜单项的 path', () => {
    const res = resolve(createSitemap(), '/reports/42');
    expect(res.route!.pageId).toBe('detail');
    expect(res.route!.highlightKey).toBe('/');
    expect(res.route!.params).toEqual({ id: '42' });
  });

  it('菜单显式 path 与页面参数模式不同：params 按页面 path 重新匹配', () => {
    // 一级菜单落到静态地址（/reports/1）作默认页，页面模式是 /reports/:id
    const sitemap = createSitemap({
      menus: [
        { id: 'home', type: 'page', pageId: 'home', title: '首页', order: 1 },
        {
          id: 'reports',
          type: 'page',
          pageId: 'detail',
          path: '/reports/1',
          title: '报表',
          order: 2,
        },
        { id: 'detail', type: 'page', pageId: 'detail', title: '详情', hidden: true, activeMenu: 'reports' },
      ],
    });
    // 菜单静态地址命中：pageId 来自菜单，params 按页面模式重匹配
    const landing = resolve(sitemap, '/reports/1')!;
    expect(landing.route!.pageId).toBe('detail');
    expect(landing.route!.params).toEqual({ id: '1' });
    // 其他参数地址命中隐藏菜单（页面继承的 :id 模式）
    const other = resolve(sitemap, '/reports/42')!;
    expect(other.route!.params).toEqual({ id: '42' });
    expect(other.route!.highlightKey).toBe('/reports/1');
  });

  it('布局嵌套链：无 parent 时仅自身；parent 上溯成链（最外层在前）', () => {
    // 无 parent → 链为自身
    expect(resolve(createSitemap(), '/')!.route!.layoutChain).toEqual(['admin']);
    // agent.parent = admin → ['admin', 'agent']，layoutName 仍是最内层
    const nested = createSitemap({
      layouts: {
        admin: simpleLayout,
        agent: { ...simpleLayout, parent: 'admin' },
      },
      menus: [{ id: 'home', type: 'page', pageId: 'home', title: '首页', layout: 'agent' }],
    });
    const res = resolve(nested, '/')!.route!;
    expect(res.layoutName).toBe('agent');
    expect(res.layoutChain).toEqual(['admin', 'agent']);
  });

  it('布局嵌套链：parent 成环 / 悬空时截断，有限终止', () => {
    const cyclic = createSitemap({
      layouts: {
        a: { ...simpleLayout, parent: 'b' },
        b: { ...simpleLayout, parent: 'a' },
      },
      layout: 'a',
    });
    expect(resolve(cyclic, '/')!.route!.layoutChain).toEqual(['b', 'a']);
    const dangling = createSitemap({
      layouts: { admin: { ...simpleLayout, parent: 'ghost' } },
    });
    expect(resolve(dangling, '/')!.route!.layoutChain).toEqual(['admin']);
  });

  it('未命中路径：menu 与 route 均为 null', () => {
    expect(resolve(createSitemap(), '/nope')).toEqual({ menu: null, route: null });
  });
});

describe('createHttpHooks', () => {
  // jsdom 页面源：http://localhost:3000
  it('request：缺省不改写（服务端 CORS 直连）；proxyPrefix 时跨域改写', async () => {
    const direct = createHttpHooks();
    expect(
      (await direct.request!({ url: 'https://api.example.com/a/b?x=1' })).url,
    ).toBe('https://api.example.com/a/b?x=1');

    const proxied = createHttpHooks({ proxyPrefix: '/api-external' });
    expect(
      (await proxied.request!({ url: 'https://api.example.com/a/b?x=1' })).url,
    ).toBe('/api-external/a/b?x=1');
    // 同源绝对地址 / 相对地址不改写
    expect(
      (await proxied.request!({ url: 'http://localhost:3000/api/x' })).url,
    ).toBe('http://localhost:3000/api/x');
    expect((await proxied.request!({ url: '/api/x' })).url).toBe('/api/x');
  });

  it('request：自定义公共头注入', async () => {
    const hooks = createHttpHooks({
      headers: () => ({ authorization: 'Bearer t' }),
    });
    const config = await hooks.request!({ url: 'https://a.com/sitemap' });
    expect(config.url).toBe('https://a.com/sitemap');
    expect(config.headers).toEqual({ authorization: 'Bearer t' });
  });

  it('response：包裹结构拆包，非 0 抛错，非包裹透传，envelope:false 关闭', async () => {
    const hooks = createHttpHooks();
    expect(await hooks.response!({ code: 0, data: { a: 1 } })).toEqual({ a: 1 });
    expect(() => hooks.response!({ code: 401, data: null, message: '未登录' })).toThrow(
      '未登录',
    );
    expect(await hooks.response!({ a: 1 })).toEqual({ a: 1 });
    const raw = createHttpHooks({ envelope: false });
    expect(await raw.response!({ code: 401, data: null })).toEqual({
      code: 401,
      data: null,
    });
  });
});

describe('defaultSitemapActions', () => {
  const fakeCtx = (handler?: unknown) =>
    ({ context: { services: { get: () => handler } } }) as never;

  it('service.call：调用已注册服务并透传求值后的 params', async () => {
    const handler = vi.fn(async () => ({ echoed: true }));
    const result = await defaultSitemapActions['service.call']!(
      {
        action: 'service.call',
        params: { service: 'demo.echo', params: { a: 1 } },
      },
      fakeCtx(handler),
    );
    expect(result).toEqual({ ok: true, data: { echoed: true } });
    expect(handler).toHaveBeenCalledWith({ a: 1 });
  });

  it('service.call：服务未注册 / 缺参数受控失败', async () => {
    const missing = await defaultSitemapActions['service.call']!(
      { action: 'service.call', params: { service: 'nope' } },
      fakeCtx(undefined),
    );
    expect(missing.ok).toBe(false);
    const noName = await defaultSitemapActions['service.call']!(
      { action: 'service.call', params: {} },
      fakeCtx(undefined),
    );
    expect(noName.ok).toBe(false);
  });
});

describe('defaultSitemapGuard', () => {
  it('匿名访问非 public 页（含未命中）→ 重定向 loginPath', () => {
    const sitemap = createSitemap();
    expect(defaultSitemapGuard({ sitemap, pathname: '/', menu: null })).toEqual({
      allow: false,
      redirectTo: '/login',
    });
    const custom = createSitemap({ auth: { loginPath: '/signin' } });
    expect(defaultSitemapGuard({ sitemap: custom, pathname: '/', menu: null })).toEqual({
      allow: false,
      redirectTo: '/signin',
    });
  });

  it('public 页与登录用户放行', () => {
    const loginMenu = { id: 'login', type: 'page' as const, pageId: 'login', title: '登录', public: true };
    expect(
      defaultSitemapGuard({ sitemap: createSitemap(), pathname: '/login', menu: loginMenu }),
    ).toEqual({ allow: true });
    const authed = { ...createSitemap(), user: { name: 'A' } };
    expect(defaultSitemapGuard({ sitemap: authed, pathname: '/', menu: null })).toEqual({
      allow: true,
    });
  });
});

describe('SitemapApp', () => {
  const renderApp = (
    sitemap: SitemapResource,
    pathname: string,
    navigate = vi.fn(),
  ) => {
    const fetcher = (async () => jsonResponse(sitemap)) as unknown as typeof fetch;
    render(
      <SitemapApp sources={['/api/sitemap']} pathname={pathname} navigate={navigate} fetcher={fetcher} />,
    );
    return navigate;
  };

  it('匿名访问非 public 页：重定向 auth.loginPath', async () => {
    const navigate = renderApp(createSitemap(), '/');
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/login'));
  });

  it('登录用户：布局菜单 + 内联页渲染', async () => {
    renderApp({ ...createSitemap(), user: { name: 'A' } }, '/');
    await screen.findByText('首页内容');
    // 布局菜单（session.context 桥）渲染可见菜单项
    await screen.findByText('首页');
  });

  it('布局级 state / lifecycle：onInit 写 state，布局 DSL 绑定渲染', async () => {
    renderApp(
      {
        ...createSitemap(),
        user: { name: 'A' },
        layouts: {
          admin: {
            dsl: '1.0',
            state: { brand: '初始' },
            lifecycle: {
              onInit: [{ action: 'setState', params: { brand: '布局品牌' } }],
            },
            body: {
              type: 'Flex',
              children: [
                { type: 'Text', props: { text: '${state.brand}' } },
                { type: 'PageOutlet' },
              ],
            },
          },
        },
      },
      '/',
    );
    // onInit 执行后 state 更新 → 布局绑定文本刷新；页面内容正常渲染
    await screen.findByText('布局品牌');
    await screen.findByText('首页内容');
  });

  it('布局运行时的 page 类型弹层：overlay.open 经 loader 解析 pageId 渲染', async () => {
    const base = createSitemap();
    renderApp(
      {
        ...base,
        user: { name: 'A' },
        pages: [
          ...base.pages,
          {
            id: 'form-page',
            path: '/form',
            title: '表单',
            version: 1,
            pageDsl: textPage('form-page', '弹层表单内容'),
          },
        ],
        layouts: {
          admin: {
            dsl: '1.0',
            body: {
              type: 'Flex',
              children: [
                {
                  type: 'Button',
                  props: { text: '布局按钮' },
                  events: {
                    onClick: {
                      action: 'overlay.open',
                      params: {
                        overlay: {
                          type: 'modal',
                          title: '创建',
                          page: { pageId: 'form-page' },
                        },
                      },
                    },
                  },
                },
                { type: 'PageOutlet' },
              ],
            },
          },
        },
      },
      '/',
    );
    fireEvent.click(await screen.findByRole('button', { name: '布局按钮' }));
    // 布局运行时注入了 loader → page 弹层经 resolvePage 加载并渲染
    expect(await screen.findByText('弹层表单内容')).toBeDefined();
  });

  it('嵌套内层布局的 overlay.open：单次点击只弹一个层', async () => {
    const base = createSitemap();
    renderApp(
      {
        ...base,
        user: { name: 'A' },
        layouts: {
          admin: {
            dsl: '1.0',
            body: {
              type: 'Flex',
              children: [
                { type: 'Text', props: { text: '外层外壳' } },
                { type: 'PageOutlet' },
              ],
            },
          },
          inner: {
            dsl: '1.0',
            parent: 'admin',
            body: {
              type: 'Flex',
              children: [
                {
                  type: 'Button',
                  props: { text: '内层按钮' },
                  events: {
                    onClick: {
                      action: 'overlay.open',
                      params: {
                        overlay: { type: 'modal', title: '内层弹层' },
                      },
                    },
                  },
                },
                { type: 'PageOutlet' },
              ],
            },
          },
        },
        menus: [
          { id: 'login', type: 'page', pageId: 'login', title: '登录', public: true, hidden: true },
          { id: 'home', type: 'page', pageId: 'home', title: '首页', layout: 'inner' },
        ],
      },
      '/',
    );
    fireEvent.click(await screen.findByRole('button', { name: '内层按钮' }));
    await screen.findByText('内层弹层');
    expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(1);
  });

  it('布局嵌套：内外层包裹页面渲染；导航分叉时外层运行时常驻（state 保持）', async () => {
    const base = createSitemap();
    const sitemap: SitemapResource = {
      ...base,
      user: { name: 'A' },
      layouts: {
        admin: {
          dsl: '1.0',
          state: { brand: '初始' },
          body: {
            type: 'Flex',
            children: [
              {
                type: 'Button',
                props: { text: '改名' },
                events: {
                  onClick: { action: 'setState', params: { brand: '已改' } },
                },
              },
              { type: 'Text', props: { text: '${state.brand}' } },
              { type: 'PageOutlet' },
            ],
          },
        },
        agent: {
          dsl: '1.0',
          parent: 'admin',
          body: {
            type: 'Flex',
            children: [
              { type: 'Text', props: { text: '内层侧栏' } },
              { type: 'PageOutlet' },
            ],
          },
        },
      },
      pages: [
        ...base.pages,
        { id: 'a', path: '/a', title: 'A', version: 1, pageDsl: textPage('a', '页面A') },
        { id: 'b', path: '/b', title: 'B', version: 1, pageDsl: textPage('b', '页面B') },
      ],
      menus: [
        ...base.menus,
        { id: 'a', type: 'page', pageId: 'a', title: 'A', layout: 'agent', hidden: true },
        { id: 'b', type: 'page', pageId: 'b', title: 'B', layout: 'admin', hidden: true },
      ],
    };
    const fetcher = (async () => jsonResponse(sitemap)) as unknown as typeof fetch;
    // navigate 需稳定引用（宿主应以 useCallback / 模块级常量传入）：
    // 新引用会重建页面工厂导致布局运行时卸载
    const navigate = vi.fn();
    const { rerender } = render(
      <SitemapApp sources={['/api/sitemap']} pathname="/a" navigate={navigate} fetcher={fetcher} />,
    );
    // 嵌套渲染：外层品牌 + 内层侧栏 + 页面内容同屏
    await screen.findByText('初始');
    await screen.findByText('内层侧栏');
    await screen.findByText('页面A');
    // 改外层布局 state
    fireEvent.click(screen.getByRole('button', { name: '改名' }));
    await screen.findByText('已改');
    // 导航到仅用外层布局的页面：内层布局卸载，外层运行时常驻（state 不重置）
    rerender(
      <SitemapApp sources={['/api/sitemap']} pathname="/b" navigate={navigate} fetcher={fetcher} />,
    );
    await screen.findByText('页面B');
    expect(screen.queryByText('内层侧栏')).toBeNull();
    expect(screen.getByText('已改')).toBeDefined();
  });

  it('public 页匿名可访问（登录页）', async () => {    const navigate = renderApp(createSitemap(), '/login');
    await screen.findByText('登录页');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('baseUrl：sources 相对地址以 baseUrl 补全请求', async () => {
    const fetcher = vi.fn(async () =>
      jsonResponse(createSitemap()),
    ) as unknown as typeof fetch;
    render(
      <SitemapApp
        sources={['api/sitemap']}
        baseUrl="https://api.example.com"
        pathname="/login"
        navigate={vi.fn()}
        fetcher={fetcher}
      />,
    );
    await screen.findByText('登录页');
    expect(vi.mocked(fetcher).mock.calls[0]![0]).toBe(
      'https://api.example.com/api/sitemap',
    );
  });

  it('activeMenu：隐藏详情页高亮指向的菜单项', async () => {
    renderApp({ ...createSitemap(), user: { name: 'A' } }, '/reports/42');
    await screen.findByText('详情内容');
    await waitFor(() => {
      // 详情页隐藏不进菜单，activeMenu: 'home' → 高亮「首页」菜单项
      const selected = document.querySelector('[aria-current="page"]');
      expect(selected?.textContent).toContain('首页');
    });
  });

  it('componentRegistry：自定义注册表工厂生效（页面 DSL 可用其中组件）', async () => {
    window.history.pushState(null, '', '/');
    const sitemap = createSitemap();
    // 页面 body 引用内置注册表之外的类型名
    sitemap.pages[1] = {
      ...sitemap.pages[1]!,
      pageDsl: {
        dsl: '1.0',
        page: { id: 'home', title: '首页' },
        body: { type: 'MarkerX', props: { text: 'marker-content' } },
      },
    };
    const fetcher = (async () =>
      jsonResponse({ ...sitemap, user: { name: 'A' } })) as unknown as typeof fetch;
    const MarkerX = ({ text }: { text?: string }) => <div>{text}</div>;
    render(
      <SitemapApp
        sources={['/api/sitemap']}
        fetcher={fetcher}
        componentRegistry={() => {
          const registry = createComponentRegistry();
          registry.register('MarkerX', MarkerX);
          return registry;
        }}
      />,
    );
    await screen.findByText('marker-content');
  });

  it('纯前端模式：未注入路由 props 时用内置浏览器路由', async () => {    window.history.pushState(null, '', '/');
    const fetcher = (async () =>
      jsonResponse({ ...createSitemap(), user: { name: 'A' } })
    ) as unknown as typeof fetch;
    render(<SitemapApp sources={['/api/sitemap']} fetcher={fetcher} />);
    await screen.findByText('首页内容');
    // 浏览器导航（pushState + popstate）→ 内容区随路由切换
    act(() => {
      window.history.pushState(null, '', '/reports/42');
      window.dispatchEvent(new Event('popstate'));
    });
    await screen.findByText('详情内容');
    expect(window.location.pathname).toBe('/reports/42');
  });

  it('纯前端模式：匿名守卫经 History API 重定向登录页', async () => {
    window.history.pushState(null, '', '/');
    const fetcher = (async () =>
      jsonResponse(createSitemap())
    ) as unknown as typeof fetch;
    render(<SitemapApp sources={['/api/sitemap']} fetcher={fetcher} />);
    await screen.findByText('登录页');
    expect(window.location.pathname).toBe('/login');
  });

  it('guard：自定义守卫替换缺省重定向', async () => {
    const fetcher = (async () =>
      jsonResponse(createSitemap())
    ) as unknown as typeof fetch;
    const navigate = vi.fn();
    render(
      <SitemapApp
        sources={['/api/sitemap']}
        pathname="/"
        navigate={navigate}
        fetcher={fetcher}
        guard={() => ({ allow: false, redirectTo: '/register' })}
      />,
    );
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/register'));
  });

  it('guard：放行匿名访问时不重定向', async () => {
    const fetcher = (async () =>
      jsonResponse(createSitemap())
    ) as unknown as typeof fetch;
    const navigate = vi.fn();
    render(
      <SitemapApp
        sources={['/api/sitemap']}
        pathname="/"
        navigate={navigate}
        fetcher={fetcher}
        guard={() => ({ allow: true })}
      />,
    );
    await screen.findByText('首页内容');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('request 失败 → 后续动作继续执行（message 提示）', async () => {
    const failPage: PageDsl = {
      dsl: '1.0',
      page: { id: 'home', title: '首页' },
      body: {
        type: 'Button',
        props: { text: '提交' },
        events: {
          onClick: [
            {
              id: 'r',
              action: 'request',
              params: { method: 'POST', url: 'http://127.0.0.1:9/unreachable' },
            },
            {
              action: 'if',
              params: {
                condition: '${actions.r.token}',
                else: [
                  {
                    action: 'message',
                    params: { messageType: 'error', text: '操作失败提示' },
                  },
                ],
              },
            },
          ],
        },
      },
    };
    const sitemap = {
      ...createSitemap(),
      user: { name: 'A' },
      pages: [{ id: 'home', path: '/', title: '首页', version: 1, pageDsl: failPage }],
    };
    const fetcher = (async () => jsonResponse(sitemap)) as unknown as typeof fetch;
    render(
      <StrictMode>
        <SitemapApp
          sources={['/api/sitemap']}
          pathname="/"
          navigate={vi.fn()}
          fetcher={fetcher}
        />
      </StrictMode>,
    );
    fireEvent.click(await screen.findByText('提交'));
    await screen.findByText('操作失败提示');
  });

  it('缺省动作：service.call 开箱可用，宿主同名覆盖', async () => {
    const callPage: PageDsl = {
      dsl: '1.0',
      page: { id: 'home', title: '首页' },
      body: {
        type: 'Button',
        props: { text: '调用服务' },
        events: {
          onClick: [
            {
              action: 'service.call',
              params: { service: 'demo.echo', params: { a: 1 } },
            },
          ],
        },
      },
    };
    const sitemap = {
      ...createSitemap(),
      user: { name: 'A' },
      pages: [{ id: 'home', path: '/', title: '首页', version: 1, pageDsl: callPage }],
    };
    const fetcher = (async () => jsonResponse(sitemap)) as unknown as typeof fetch;
    const echo = vi.fn(async () => ({ ok: 1 }));
    const custom = vi.fn(() => ({ ok: true as const }));

    // 默认实现：调用 props.services 注册的服务
    const { unmount } = render(
      <SitemapApp
        sources={['/api/sitemap']}
        pathname="/"
        navigate={vi.fn()}
        fetcher={fetcher}
        services={{ 'demo.echo': echo }}
      />,
    );
    fireEvent.click(await screen.findByText('调用服务'));
    await waitFor(() => expect(echo).toHaveBeenCalledWith({ a: 1 }));
    unmount();

    // 宿主 actions 同名覆盖默认实现
    render(
      <SitemapApp
        sources={['/api/sitemap']}
        pathname="/"
        navigate={vi.fn()}
        fetcher={fetcher}
        services={{ 'demo.echo': echo }}
        actions={{ 'service.call': custom }}
      />,
    );
    fireEvent.click(await screen.findByText('调用服务'));
    await waitFor(() => expect(custom).toHaveBeenCalled());
    expect(echo).toHaveBeenCalledTimes(1);
  });
});

describe('SitemapApp：国际化（设计 D7，i18n spec）', () => {
  const renderI18n = (
    sitemap: SitemapResource,
    props: Record<string, unknown> = {},
  ) => {
    const fetcher = (async () => jsonResponse(sitemap)) as unknown as typeof fetch;
    return render(
      <SitemapApp
        sources={['/api/sitemap']}
        pathname="/"
        navigate={vi.fn()}
        fetcher={fetcher}
        {...props}
      />,
    );
  };

  const welcomePage = (): PageDsl => ({
    dsl: '1.0',
    page: { id: 'home', title: 'home' },
    body: { type: 'Text', props: { text: "${t('welcome')}" } },
  });

  it('locale/messages 透传：页面表达式与内置组件按配置语言渲染', async () => {
    const sitemap = createSitemap({
      user: { name: 'A' },
      pages: [
        { id: 'home', path: '/', title: 'home', version: 1, pageDsl: welcomePage() },
      ],
    });
    renderI18n(sitemap, { locale: 'en-US', messages: { welcome: 'Welcome' } });

    await screen.findByText('Welcome');
  });

  it('宿主切换 locale prop：页面重建按新语言渲染', async () => {
    const sitemap = createSitemap({
      user: { name: 'A' },
      pages: [
        { id: 'home', path: '/', title: 'home', version: 1, pageDsl: welcomePage() },
      ],
    });
    const messages = {
      'zh-CN': { welcome: '欢迎' },
      'en-US': { welcome: 'Welcome' },
    };
    const fetcher = (async () => jsonResponse(sitemap)) as unknown as typeof fetch;
    const common = {
      sources: ['/api/sitemap'],
      pathname: '/',
      navigate: vi.fn(),
      fetcher,
      messages,
    };
    const { rerender } = render(<SitemapApp {...common} locale="zh-CN" />);
    await screen.findByText('欢迎');

    rerender(<SitemapApp {...common} locale="en-US" />);
    await screen.findByText('Welcome');
  });

  it('sitemap 状态文案按语言渲染（拉取失败）', async () => {
    const fetcher = vi.fn(async () => {
      throw new Error('boom');
    }) as unknown as typeof fetch;
    render(
      <SitemapApp
        sources={['/api/sitemap']}
        pathname="/"
        navigate={vi.fn()}
        fetcher={fetcher}
        locale="en-US"
      />,
    );

    await screen.findByText('Sitemap loading failed: boom');
  });

  it('messages 覆盖 sitemap 状态文案（404）', async () => {
    const sitemap = createSitemap({ user: { name: 'A' } });
    renderI18n(sitemap, {
      pathname: '/none',
      messages: { 'pactor.sitemap.notFound': 'Missing {{path}}!' },
    });

    await screen.findByText('Missing /none!');
  });
});
