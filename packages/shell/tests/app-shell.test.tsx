// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

const nav = vi.hoisted(() => ({ pathname: '/dashboard', push: vi.fn() }));

vi.mock('next/navigation', () => ({
  usePathname: () => nav.pathname,
  useRouter: () => ({ push: nav.push }),
}));

// SkinSwitcher 挂 @pactor-app/theme 运行时，本测试不关心皮肤，整体替身
vi.mock('../src/client/SkinSwitcher.js', () => ({
  SkinSwitcher: () => <div data-testid="skin-switcher" />,
}));

import { AppShell, type SubAppContext } from '../src/client/AppShell.js';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(cleanup);

beforeAll(() => {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
});

function Page({ pathname }: SubAppContext) {
  return <div>page:{pathname}</div>;
}

describe('AppShell items 模式', () => {
  it('渲染品牌、按 order 排序的菜单、过滤 hidden，并派生高亮', () => {
    render(
      <AppShell
        brand={{ title: 'InnoSpots' }}
        menu={{
          mode: 'items',
          items: [
            { id: 'settings', title: '设置', path: '/settings', order: 2 },
            { id: 'dash', title: '看板', path: '/dashboard', order: 1 },
            { id: 'ghost', title: '隐藏', path: '/ghost', hidden: true },
          ],
        }}
        pages={{ '/dashboard': Page }}
      />,
    );
    expect(screen.getByText('InnoSpots')).toBeTruthy();
    expect(screen.queryByText('隐藏')).toBeNull();
    const buttons = screen.getAllByRole('button').filter((b) => ['看板', '设置'].includes(b.textContent ?? ''));
    expect(buttons.map((b) => b.textContent)).toEqual(['看板', '设置']);
    expect(buttons[0]!.className).toContain('is-active');
    expect(screen.getByText('page:/dashboard')).toBeTruthy();
  });

  it('点击菜单先 onSelect 再 navigate', () => {
    const onSelect = vi.fn();
    render(
      <AppShell
        menu={{ mode: 'items', items: [{ id: 'dash', title: '看板', path: '/dashboard' }], onSelect }}
        pages={{ '/dashboard': Page }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '看板' }));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'dash' }));
    expect(nav.push).toHaveBeenCalledWith('/dashboard');
  });

  it('skin.renderSwitcher 缺省渲染切换器，false 关闭；插槽渲染', () => {
    const { unmount } = render(
      <AppShell
        menu={{ mode: 'items', items: [] }}
        skin={{}}
        headerExtra={<div>hdr</div>}
        footer={<div>ftr</div>}
        pages={{}}
      />,
    );
    expect(screen.getByTestId('skin-switcher')).toBeTruthy();
    expect(screen.getByText('hdr')).toBeTruthy();
    expect(screen.getByText('ftr')).toBeTruthy();
    unmount();
    render(<AppShell menu={{ mode: 'items', items: [] }} skin={{ renderSwitcher: false }} pages={{}} />);
    expect(screen.queryByTestId('skin-switcher')).toBeNull();
  });

  it('未命中 pages 且无 renderSubApp → NotFound', () => {
    render(<AppShell menu={{ mode: 'items', items: [] }} pages={{}} />);
    expect(screen.getByText(/未找到页面/)).toBeTruthy();
  });

  it('layout.variant "top" 显式抛错', () => {
    expect(() =>
      render(<AppShell menu={{ mode: 'items', items: [] }} layout={{ variant: 'top' }} pages={{}} />),
    ).toThrow(/top.*尚未实现/);
  });

  it('layout.variant "side" 折叠按钮切换 data-collapsed', () => {
    const { container } = render(
      <AppShell menu={{ mode: 'items', items: [] }} layout={{ variant: 'side' }} pages={{}} />,
    );
    const sidebar = container.querySelector('.pactor-shell-sidebar')!;
    expect(sidebar.getAttribute('data-collapsed')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '收起菜单' }));
    expect(sidebar.getAttribute('data-collapsed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: '展开菜单' }));
    expect(sidebar.getAttribute('data-collapsed')).toBeNull();
  });
});

describe('AppShell sitemap 模式', () => {
  it('不渲染自有 chrome，直接渲染 renderSubApp', () => {
    render(
      <AppShell
        menu={{ mode: 'sitemap' }}
        brand={{ title: '不应出现' }}
        renderSubApp={({ pathname }) => <div>sub:{pathname}</div>}
      />,
    );
    expect(screen.getByText('sub:/dashboard')).toBeTruthy();
    expect(screen.queryByText('不应出现')).toBeNull();
    expect(document.querySelector('.pactor-shell-sidebar')).toBeNull();
  });
});

describe('AppShell 徽标 / 分组 / 面包屑 / 品牌点击 / 兜底', () => {
  it('菜单徽标：正常渲染；0 与空串不渲染；>99 显示 99+', () => {
    const { container } = render(
      <AppShell
        menu={{
          mode: 'items',
          items: [
            { id: 'a', title: '待办', path: '/a', badge: 3 },
            { id: 'b', title: '公告', path: '/b', badge: 'NEW' },
            { id: 'c', title: '清空', path: '/c', badge: 0 },
            { id: 'd', title: '海量', path: '/d', badge: 128 },
          ],
        }}
        pages={{}}
      />,
    );
    const badges = [...container.querySelectorAll('.pactor-shell-menu-badge')].map(
      (el) => el.textContent,
    );
    expect(badges).toEqual(['3', 'NEW', '99+']);
  });

  it('分组标题：相邻同组只渲染一次，无组项前无标题', () => {
    const { container } = render(
      <AppShell
        menu={{
          mode: 'items',
          items: [
            { id: 'a', title: '文章', path: '/a', group: '内容' },
            { id: 'b', title: '页面', path: '/b', group: '内容' },
            { id: 'c', title: '其他', path: '/c' },
          ],
        }}
        pages={{}}
      />,
    );
    const groups = [...container.querySelectorAll('.pactor-shell-menu-group')].map(
      (el) => el.textContent,
    );
    expect(groups).toEqual(['内容']);
  });

  it('面包屑：缺省显示当前命中菜单，breadcrumb=false 关闭', () => {
    const { container, unmount } = render(
      <AppShell
        menu={{ mode: 'items', items: [{ id: 'dash', title: '看板', path: '/dashboard' }] }}
        pages={{ '/dashboard': Page }}
      />,
    );
    const crumb = container.querySelector('.pactor-shell-breadcrumb');
    expect(crumb?.textContent).toContain('看板');
    unmount();
    const { container: off } = render(
      <AppShell
        breadcrumb={false}
        menu={{ mode: 'items', items: [{ id: 'dash', title: '看板', path: '/dashboard' }] }}
        pages={{ '/dashboard': Page }}
      />,
    );
    expect(off.querySelector('.pactor-shell-breadcrumb')).toBeNull();
  });

  it('brand.onClick 优先于 href；均缺省时不可点', () => {
    const onClick = vi.fn();
    const { unmount } = render(
      <AppShell
        brand={{ title: 'InnoSpots', href: '/home', onClick }}
        menu={{ mode: 'items', items: [] }}
        pages={{}}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'InnoSpots' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(nav.push).not.toHaveBeenCalledWith('/home');
    unmount();
    render(
      <AppShell brand={{ title: '纯展示' }} menu={{ mode: 'items', items: [] }} pages={{}} />,
    );
    expect(screen.queryByRole('button', { name: '纯展示' })).toBeNull();
  });

  it('brand.href 点击走 navigate', () => {
    render(
      <AppShell
        brand={{ title: 'InnoSpots', href: '/home' }}
        menu={{ mode: 'items', items: [] }}
        pages={{}}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'InnoSpots' }));
    expect(nav.push).toHaveBeenCalledWith('/home');
  });

  it('fallbacks.notFound 覆盖内置 404 兜底', () => {
    render(
      <AppShell
        menu={{ mode: 'items', items: [] }}
        pages={{}}
        fallbacks={{ notFound: <div>自定义 404</div> }}
      />,
    );
    expect(screen.getByText('自定义 404')).toBeTruthy();
    expect(screen.queryByText(/未找到页面/)).toBeNull();
  });

  it('默认 404 兜底：状态码 + 返回首页', () => {
    render(<AppShell menu={{ mode: 'items', items: [] }} pages={{}} />);
    expect(screen.getByText('404')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '返回首页' }));
    expect(nav.push).toHaveBeenCalledWith('/');
  });
});
