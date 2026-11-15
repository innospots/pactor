// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const nav = vi.hoisted(() => ({
  pathname: '/workspace',
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => nav.pathname,
  useRouter: () => ({ push: nav.push, replace: nav.replace, refresh: nav.refresh }),
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

import { NavigationShell, type NavigationMenuItem } from '../src/client/NavigationShell.js';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(cleanup);

const flatMenus: NavigationMenuItem[] = [
  { id: 'workspace', type: 'page', pageId: 'shell:workspace', path: '/workspace', title: '工作台', icon: 'workspace' },
  { id: 'themes', type: 'page', pageId: 'shell:themes', path: '/settings/themes', title: '主题设置', icon: 'settings' },
  { id: 'profile', type: 'page', pageId: 'shell:profile', path: '/profile', title: '个人中心', hidden: true },
];

const groupedMenus: NavigationMenuItem[] = [
  { id: 'workspace', type: 'page', pageId: 'shell:workspace', path: '/workspace', title: '工作台', icon: 'workspace' },
  {
    id: 'system',
    type: 'group',
    title: '系统管理',
    icon: 'settings',
    children: [
      { id: 'themes', type: 'page', pageId: 'shell:themes', path: '/settings/themes', title: '主题设置' },
      { id: 'users', type: 'page', pageId: 'm:users', path: '/settings/users', title: '用户管理' },
      { id: 'role-detail', type: 'page', pageId: 'm:role-detail', path: '/settings/roles/:roleId', title: '角色详情', hidden: true, activeMenu: 'users' },
    ],
  },
];

describe('NavigationShell', () => {
  it('扁平菜单：只渲染图标轨与主内容区，隐藏项不出现', () => {
    nav.pathname = '/workspace';
    const { container } = render(
      <NavigationShell menus={flatMenus}><div>内容</div></NavigationShell>,
    );
    expect(screen.getByRole('navigation', { name: '主导航' })).toBeTruthy();
    expect(container.querySelector('.kn-sidebar')).toBeNull();
    expect(screen.getByTitle('工作台')).toBeTruthy();
    expect(screen.queryByTitle('个人中心')).toBeNull();
    expect(screen.getByText('内容')).toBeTruthy();
  });

  it('当前页面对应的轨菜单项带激活态（aria-current）', () => {
    nav.pathname = '/settings/themes';
    render(<NavigationShell menus={flatMenus}><div /></NavigationShell>);
    const link = screen.getByTitle('主题设置');
    expect(link.getAttribute('aria-current')).toBe('page');
    expect(link.className).toContain('is-active');
  });

  it('命中分组：渲染二级侧栏并高亮子菜单', () => {
    nav.pathname = '/settings/users';
    const { container } = render(
      <NavigationShell menus={groupedMenus}><div /></NavigationShell>,
    );
    const sidebar = container.querySelector('.kn-sidebar');
    expect(sidebar).toBeTruthy();
    expect(screen.getByText('系统管理', { selector: '.kn-sidebar-title' })).toBeTruthy();
    const active = sidebar!.querySelector('.kn-menu-item.is-active');
    expect(active?.textContent).toBe('用户管理');
    // 隐藏子项不出现在侧栏
    expect(screen.queryByText('角色详情')).toBeNull();
  });

  it('activeMenu：隐藏页归组高亮到指定可见菜单', () => {
    nav.pathname = '/settings/roles/42';
    const { container } = render(
      <NavigationShell menus={groupedMenus}><div /></NavigationShell>,
    );
    const active = container.querySelector('.kn-menu-item.is-active');
    expect(active?.textContent).toBe('用户管理');
  });

  it('点击未命中分组：导航到第一个可见子项', () => {
    nav.pathname = '/workspace';
    render(<NavigationShell menus={groupedMenus}><div /></NavigationShell>);
    fireEvent.click(screen.getByTitle('系统管理'));
    expect(nav.push).toHaveBeenCalledWith('/settings/themes');
  });

  it('railFooter：贴底渲染插槽内容', () => {
    nav.pathname = '/workspace';
    const { container } = render(
      <NavigationShell menus={flatMenus} railFooter={<button type="button">账户区</button>}>
        <div />
      </NavigationShell>,
    );
    const footer = container.querySelector('.kn-rail-footer');
    expect(footer).toBeTruthy();
    expect(screen.getByRole('button', { name: '账户区' })).toBeTruthy();
  });

  it('labels 覆盖默认文案', () => {
    nav.pathname = '/workspace';
    render(
      <NavigationShell menus={flatMenus} labels={{ navMain: 'Main nav' }}>
        <div />
      </NavigationShell>,
    );
    expect(screen.getByRole('navigation', { name: 'Main nav' })).toBeTruthy();
  });
});

describe('NavigationShell 徽标', () => {
  const badgeMenus: NavigationMenuItem[] = [
    { id: 'workspace', type: 'page', path: '/workspace', title: '工作台', badge: 3 },
    {
      id: 'system',
      type: 'group',
      title: '系统管理',
      children: [
        { id: 'users', type: 'page', path: '/settings/users', title: '用户管理', badge: 'NEW' },
        { id: 'audit', type: 'page', path: '/settings/audit', title: '审计日志', badge: 0 },
        { id: 'many', type: 'page', path: '/settings/many', title: '海量', badge: 128 },
      ],
    },
  ];

  it('一级轨渲染徽标；0 不渲染；>99 显示 99+', () => {
    nav.pathname = '/workspace';
    const { container } = render(
      <NavigationShell menus={badgeMenus}><div /></NavigationShell>,
    );
    const railBadges = [...container.querySelectorAll('.kn-rail-badge')].map(
      (el) => el.textContent,
    );
    expect(railBadges).toEqual(['3']);
  });

  it('二级侧栏渲染行内徽标（NEW），0 不渲染，128 显示 99+', () => {
    nav.pathname = '/settings/users';
    const { container } = render(
      <NavigationShell menus={badgeMenus}><div /></NavigationShell>,
    );
    const menuBadges = [...container.querySelectorAll('.kn-menu-badge')].map(
      (el) => el.textContent,
    );
    expect(menuBadges).toEqual(['NEW', '99+']);
  });
});

describe('NavigationShell 面包屑', () => {
  it('分组场景：分组标题 / 子项，末项纯文本', () => {
    nav.pathname = '/settings/users';
    const { container } = render(
      <NavigationShell menus={groupedMenus}><div /></NavigationShell>,
    );
    const crumb = container.querySelector('.kn-breadcrumb');
    expect(crumb?.textContent).toBe('系统管理/用户管理');
    const last = crumb!.querySelector('[aria-current="page"]');
    expect(last?.textContent).toBe('用户管理');
    // 中间项无 path（分组不可导航）→ 纯文本而非链接
    expect(crumb!.querySelectorAll('a')).toHaveLength(0);
  });

  it('hidden 详情页：命中项追加为末级纯文本', () => {
    nav.pathname = '/settings/roles/42';
    const { container } = render(
      <NavigationShell menus={groupedMenus}><div /></NavigationShell>,
    );
    const crumb = container.querySelector('.kn-breadcrumb');
    expect(crumb?.textContent).toBe('系统管理/角色详情');
  });

  it('breadcrumb=false 不渲染', () => {
    nav.pathname = '/settings/users';
    const { container } = render(
      <NavigationShell menus={groupedMenus} breadcrumb={false}><div /></NavigationShell>,
    );
    expect(container.querySelector('.kn-breadcrumb')).toBeNull();
  });

  it('无命中不渲染', () => {
    nav.pathname = '/totally/unknown';
    const { container } = render(
      <NavigationShell menus={groupedMenus}><div /></NavigationShell>,
    );
    expect(container.querySelector('.kn-breadcrumb')).toBeNull();
  });
});

describe('NavigationShell 品牌链接', () => {
  it('缺省 brandHref 为 /，品牌方块渲染为链接', () => {
    nav.pathname = '/workspace';
    const { container } = render(
      <NavigationShell menus={flatMenus}><div /></NavigationShell>,
    );
    const mark = container.querySelector('a.kn-mark');
    expect(mark?.getAttribute('href')).toBe('/');
  });

  it("brandHref='' 退化为纯展示", () => {
    nav.pathname = '/workspace';
    const { container } = render(
      <NavigationShell menus={flatMenus} brandHref=""><div /></NavigationShell>,
    );
    expect(container.querySelector('a.kn-mark')).toBeNull();
    expect(container.querySelector('div.kn-mark')).toBeTruthy();
  });
});
