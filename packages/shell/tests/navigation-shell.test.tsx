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
