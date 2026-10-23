import { describe, expect, it } from 'vitest';

import { innospotsWebShellV1, innospotsWebShellV2 } from './profiles/index.js';
import { transformSitemap } from './transform-sitemap.js';

const site = {
  id: 'site',
  layouts: {
    admin: 'admin.layout.yaml',
    bare: { type: 'BareLayout' },
  },
  pages: [
    { id: 'login', path: '/login', title: '登录', public: true },
    { id: 'dashboard', path: '/dashboard', title: '工作台', lazy: true },
  ],
  menus: [
    { id: 'dash', title: '工作台', pageId: 'dashboard', path: '/dashboard' },
    {
      id: 'grp',
      title: '组',
      type: 'group',
      children: [{ id: 'sub', title: '子页', pageId: 'login', path: '/login' }],
    },
  ],
};

const adminLayout = { type: 'AdminLayout' };

function makeOptions(profile: typeof innospotsWebShellV1, demoPublic = false) {
  return {
    profile,
    demoPublic,
    loadLayout: (rel: string): unknown => {
      if (rel === 'admin.layout.yaml') return adminLayout;
      throw new Error(`未知布局: ${rel}`);
    },
  };
}

describe('transformSitemap', () => {
  it('字符串布局引用内联为对象，对象布局保持不变', () => {
    const { site: next } = transformSitemap(site, makeOptions(innospotsWebShellV1));
    const layouts = next.layouts as Record<string, unknown>;
    expect(layouts.admin).toEqual(adminLayout);
    expect(layouts.bare).toEqual({ type: 'BareLayout' });
  });

  it('stripMenuPaths：菜单显式 path 删除（含 children 递归）', () => {
    const { site: next } = transformSitemap(site, makeOptions(innospotsWebShellV1));
    const menus = next.menus as Record<string, unknown>[];
    expect(menus[0]).not.toHaveProperty('path');
    expect(menus[0]!.pageId).toBe('dashboard');
    const children = menus[1]!.children as Record<string, unknown>[];
    expect(children[0]).not.toHaveProperty('path');
    expect(children[0]!.pageId).toBe('login');
  });

  it('forceInlinePages 按 profile 开关：@1 去 lazy，@2 保留', () => {
    const v1 = transformSitemap(site, makeOptions(innospotsWebShellV1));
    const v1Pages = v1.site.pages as Record<string, unknown>[];
    expect(v1Pages[1]).not.toHaveProperty('lazy');

    const v2 = transformSitemap(site, makeOptions(innospotsWebShellV2));
    const v2Pages = v2.site.pages as Record<string, unknown>[];
    expect(v2Pages[1]!.lazy).toBe(true);
  });

  it('demo.public：pages 与 menus（含 children）标记 public: true', () => {
    const { site: next } = transformSitemap(site, makeOptions(innospotsWebShellV2, true));
    const pages = next.pages as Record<string, unknown>[];
    expect(pages.every((page) => page.public === true)).toBe(true);
    const menus = next.menus as Record<string, unknown>[];
    expect(menus[0]!.public).toBe(true);
    expect((menus[1]!.children as Record<string, unknown>[])[0]!.public).toBe(true);
  });

  it('不修改入参（返回新对象）', () => {
    const before = JSON.parse(JSON.stringify(site)) as unknown;
    transformSitemap(site, makeOptions(innospotsWebShellV1));
    expect(site).toEqual(before);
  });

  it('返回页面 / 菜单 / 布局计数', () => {
    const result = transformSitemap(site, makeOptions(innospotsWebShellV2));
    expect(result.pageCount).toBe(2);
    expect(result.menuCount).toBe(2);
    expect(result.layoutCount).toBe(2);
  });
});
