// @vitest-environment jsdom
import './setup.js';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { AppShell, useSidebarDrawer } from '../src/index.js';

afterEach(cleanup);

function renderShell(extra?: { locationKey?: string }) {
  return render(
    <AppShell
      sidebar={<nav data-testid="sidebar">侧栏</nav>}
      brand={<span data-testid="brand">Pactor Chat</span>}
      locationKey={extra?.locationKey}
    >
      <div data-testid="content">主区</div>
    </AppShell>,
  );
}

describe('AppShell（spec: chat-app-shell）', () => {
  it('渲染侧栏与主内容：sidebar 与 children 均出现（spec: 应用外壳布局）', () => {
    renderShell();
    expect(screen.getByTestId('sidebar')).toBeTruthy();
    expect(screen.getByTestId('content')).toBeTruthy();
    expect(screen.getByTestId('brand')).toBeTruthy();
    expect(document.querySelector('.pactor-chat-shell')).toBeTruthy();
    expect(document.querySelector('.pactor-chat-shell__sidebar')).toBeTruthy();
    expect(document.querySelector('.pactor-chat-shell__main')).toBeTruthy();
  });

  it('菜单按钮打开抽屉：遮罩出现，aria-expanded 翻转（spec: 移动端抽屉）', () => {
    renderShell();
    const menuButton = screen.getByRole('button', { name: '打开导航' });
    expect(menuButton.getAttribute('aria-expanded')).toBe('false');
    expect(document.querySelector('.pactor-chat-shell__scrim')).toBeNull();

    fireEvent.click(menuButton);
    expect(menuButton.getAttribute('aria-expanded')).toBe('true');
    expect(document.querySelector('.pactor-chat-shell__scrim')).toBeTruthy();
  });

  it('抽屉打开时按 Escape 关闭（spec: Escape 与遮罩关闭）', () => {
    renderShell();
    fireEvent.click(screen.getByRole('button', { name: '打开导航' }));
    expect(document.querySelector('.pactor-chat-shell__scrim')).toBeTruthy();

    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(document.querySelector('.pactor-chat-shell__scrim')).toBeNull();
    expect(screen.getByRole('button', { name: '打开导航' }).getAttribute('aria-expanded')).toBe(
      'false',
    );
  });

  it('点击遮罩关闭抽屉（spec: Escape 与遮罩关闭）', () => {
    renderShell();
    fireEvent.click(screen.getByRole('button', { name: '打开导航' }));
    const scrim = document.querySelector('.pactor-chat-shell__scrim')!;
    fireEvent.click(scrim);
    expect(document.querySelector('.pactor-chat-shell__scrim')).toBeNull();
  });

  it('抽屉打开且 locationKey 变化时在新一轮渲染中关闭（spec: locationKey 变化关闭）', () => {
    const { rerender } = renderShell({ locationKey: 's1' });
    fireEvent.click(screen.getByRole('button', { name: '打开导航' }));
    expect(document.querySelector('.pactor-chat-shell__scrim')).toBeTruthy();

    rerender(
      <AppShell
        sidebar={<nav data-testid="sidebar">侧栏</nav>}
        locationKey="s2"
      >
        <div data-testid="content">主区</div>
      </AppShell>,
    );
    expect(document.querySelector('.pactor-chat-shell__scrim')).toBeNull();
  });

  it('关闭时侧栏容器带 inert，打开时移除（spec: 关闭时 inert）', () => {
    // jsdom 不应用媒体查询：把 matchMedia 桩为移动视口分支（matches: true），
    // 覆盖 setup.js 恒为 false 的 polyfill
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query.includes('max-width'),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;

    try {
      renderShell();
      const sidebar = document.querySelector('.pactor-chat-shell__sidebar')!;
      expect(sidebar.hasAttribute('inert')).toBe(true);

      fireEvent.click(screen.getByRole('button', { name: '打开导航' }));
      expect(sidebar.hasAttribute('inert')).toBe(false);
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });

  it('useSidebarDrawer：壳内 close() 关闭抽屉（spec: 壳内关闭抽屉）', () => {
    function SidebarNav() {
      const drawer = useSidebarDrawer();
      return (
        <button type="button" onClick={() => drawer?.close()}>
          导航项
        </button>
      );
    }
    render(
      <AppShell sidebar={<SidebarNav />}>
        <div>主区</div>
      </AppShell>,
    );

    fireEvent.click(screen.getByRole('button', { name: '打开导航' }));
    expect(document.querySelector('.pactor-chat-shell__scrim')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '导航项' }));
    expect(document.querySelector('.pactor-chat-shell__scrim')).toBeNull();
  });

  it('useSidebarDrawer：壳外返回 null 不抛错（spec: 壳外安全返回 null）', () => {
    function Outside() {
      const drawer = useSidebarDrawer();
      return <span>{drawer === null ? 'null' : 'has-context'}</span>;
    }
    render(<Outside />);
    expect(screen.getByText('null')).toBeTruthy();
  });
});
