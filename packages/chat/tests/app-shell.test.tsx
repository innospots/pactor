// @vitest-environment jsdom
import './setup.js';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { AppShell, useSidebarDrawer } from '../src/index.js';

afterEach(cleanup);

/**
 * AppShell（spec: chat-app-shell / chat-on-ui-sidebar）：外壳为 ui
 * Sidebar 薄封装——DOM 为 ui Sidebar 的 data-slot 结构，chat 侧挂
 * pactor-chat-shell 类做令牌映射；行为语义与历史一致。
 */

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
    // brand 双位置（决策 D3）：移动端顶栏 + 桌面侧栏品牌行
    expect(screen.getAllByTestId('brand')).toHaveLength(2);
    expect(
      document.querySelector('[data-slot=sidebar-topbar] [data-testid="brand"]'),
    ).toBeTruthy();
    expect(
      document.querySelector('[data-slot=sidebar-brand] [data-testid="brand"]'),
    ).toBeTruthy();
    expect(document.querySelector('.pactor-chat-shell')).toBeTruthy();
    expect(document.querySelector('[data-slot=sidebar]')).toBeTruthy();
    expect(document.querySelector('[data-slot=sidebar-content]')).toBeTruthy();
  });

  it('菜单按钮打开抽屉：遮罩出现，aria-expanded 翻转（spec: 移动端抽屉）', () => {
    renderShell();
    const menuButton = screen.getByRole('button', { name: '打开导航' });
    expect(menuButton.getAttribute('aria-expanded')).toBe('false');
    expect(document.querySelector('[data-slot=sidebar-scrim]')).toBeNull();

    fireEvent.click(menuButton);
    expect(menuButton.getAttribute('aria-expanded')).toBe('true');
    expect(document.querySelector('[data-slot=sidebar-scrim]')).toBeTruthy();
  });

  it('抽屉打开时按 Escape 关闭（spec: Escape 与遮罩关闭）', () => {
    renderShell();
    fireEvent.click(screen.getByRole('button', { name: '打开导航' }));
    expect(document.querySelector('[data-slot=sidebar-scrim]')).toBeTruthy();

    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(document.querySelector('[data-slot=sidebar-scrim]')).toBeNull();
    expect(screen.getByRole('button', { name: '打开导航' }).getAttribute('aria-expanded')).toBe(
      'false',
    );
  });

  it('点击遮罩关闭抽屉（spec: Escape 与遮罩关闭）', () => {
    renderShell();
    fireEvent.click(screen.getByRole('button', { name: '打开导航' }));
    const scrim = document.querySelector('[data-slot=sidebar-scrim]')!;
    fireEvent.click(scrim);
    expect(document.querySelector('[data-slot=sidebar-scrim]')).toBeNull();
  });

  it('抽屉打开且 locationKey 变化时在新一轮渲染中关闭（spec: locationKey 变化关闭）', () => {
    const { rerender } = renderShell({ locationKey: 's1' });
    fireEvent.click(screen.getByRole('button', { name: '打开导航' }));
    expect(document.querySelector('[data-slot=sidebar-scrim]')).toBeTruthy();

    rerender(
      <AppShell
        sidebar={<nav data-testid="sidebar">侧栏</nav>}
        locationKey="s2"
      >
        <div data-testid="content">主区</div>
      </AppShell>,
    );
    expect(document.querySelector('[data-slot=sidebar-scrim]')).toBeNull();
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
      const sidebar = document.querySelector('[data-slot=sidebar]')!;
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
    expect(document.querySelector('[data-slot=sidebar-scrim]')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '导航项' }));
    expect(document.querySelector('[data-slot=sidebar-scrim]')).toBeNull();
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

/** 把 matchMedia 桩为移动视口分支（与 inert 测试同款手法） */
function mockMobileViewport(): () => void {
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
  return () => {
    window.matchMedia = originalMatchMedia;
  };
}

describe('AppShell 侧栏增强（spec: chat-app-shell / 桌面侧栏头部与折叠，决策 D3）', () => {
  it('折叠切换：侧栏带 data-collapsed，折叠钮 aria-expanded / aria-label 更新（spec: 折叠为图标栏）', () => {
    render(
      <AppShell
        sidebar={<nav data-testid="sidebar">侧栏</nav>}
        brand={<span>品牌</span>}
        collapsible
      >
        <div>主区</div>
      </AppShell>,
    );
    const sidebar = document.querySelector('[data-slot=sidebar]')!;
    const button = screen.getByRole('button', { name: '收起侧边栏' });
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(sidebar.getAttribute('data-collapsed')).toBeNull();

    fireEvent.click(button);
    expect(sidebar.getAttribute('data-collapsed')).toBe('true');
    const expandButton = screen.getByRole('button', { name: '展开侧边栏' });
    expect(expandButton.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(expandButton);
    expect(sidebar.getAttribute('data-collapsed')).toBeNull();
    expect(screen.getByRole('button', { name: '收起侧边栏' })).toBeTruthy();
  });

  it('缺省无折叠：未配置 collapsible 不渲染折叠钮（spec: 缺省无折叠）', () => {
    render(
      <AppShell sidebar={<nav>侧栏</nav>} brand={<span>品牌</span>}>
        <div>主区</div>
      </AppShell>,
    );
    expect(screen.queryByRole('button', { name: '收起侧边栏' })).toBeNull();
    expect(
      document.querySelector('[data-slot=sidebar][data-collapsed]'),
    ).toBeNull();
  });

  it('移动端不渲染折叠钮，抽屉行为不变（spec: 移动端不受影响）', () => {
    const restore = mockMobileViewport();
    try {
      render(
        <AppShell
          sidebar={<nav data-testid="sidebar">侧栏</nav>}
          brand={<span>品牌</span>}
          collapsible
        >
          <div>主区</div>
        </AppShell>,
      );
      expect(screen.queryByRole('button', { name: '收起侧边栏' })).toBeNull();
      expect(
        document.querySelector('[data-slot=sidebar][data-collapsed]'),
      ).toBeNull();

      // 抽屉语义不变：菜单按钮打开抽屉 + 遮罩
      fireEvent.click(screen.getByRole('button', { name: '打开导航' }));
      expect(document.querySelector('[data-slot=sidebar-scrim]')).toBeTruthy();
    } finally {
      restore();
    }
  });
});

describe('AppShell 侧栏底部槽（spec: chat-app-shell / 侧栏底部槽）', () => {
  it('sidebarFooter 固定在侧栏底部渲染（spec: 底部卡片）', () => {
    render(
      <AppShell
        sidebar={<nav data-testid="sidebar">侧栏</nav>}
        sidebarFooter={<div data-testid="footer">用户卡</div>}
      >
        <div>主区</div>
      </AppShell>,
    );
    const footer = document.querySelector('[data-slot=sidebar-footer]')!;
    expect(footer).toBeTruthy();
    expect(footer.querySelector('[data-testid="footer"]')).toBeTruthy();
    // 底部区在侧栏内、滚动区之后
    const body = document.querySelector('[data-slot=sidebar-nav]')!;
    expect(
      body.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('未提供 sidebarFooter 时不渲染底部区容器（零渲染承诺）', () => {
    render(
      <AppShell sidebar={<nav>侧栏</nav>}>
        <div>主区</div>
      </AppShell>,
    );
    expect(document.querySelector('[data-slot=sidebar-footer]')).toBeNull();
  });
});
