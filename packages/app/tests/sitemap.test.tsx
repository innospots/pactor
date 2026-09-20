// @vitest-environment jsdom
/**
 * SitemapApp（design/dynamic-page.md）：多源合并 / menus×pages 继承 /
 * 缓存加载器 / 匿名守卫 / DSL 布局渲染 / activeMenu 高亮。
 */
import { render, screen, waitFor } from '@testing-library/react';
import type { PageDsl } from '@pactor-app/core';
import { describe, expect, it, vi } from 'vitest';

import {
  createSitemapLoader,
  fetchSitemap,
  mergeSitemapMenus,
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

  it('public 页匿名可访问（登录页）', async () => {
    const navigate = renderApp(createSitemap(), '/login');
    await screen.findByText('登录页');
    expect(navigate).not.toHaveBeenCalled();
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
});
