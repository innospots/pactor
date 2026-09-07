// @vitest-environment jsdom
import './setup.js';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  Menu,
  Sidebar,
  useSidebarDrawer,
} from '../../src/components/index.js';

afterEach(cleanup);

/**
 * Sidebar 壳能力（spec: shadcn-extended-components / Sidebar 壳能力）：
 * content 自由内容槽、sidebarFooter、brand ReactNode 形态、桌面 icon
 * rail 折叠、移动端覆盖抽屉（遮罩 / Escape / locationKey / inert）、
 * useSidebarDrawer context、Menu 在 collapsed 侧栏内降级为仅图标。
 */

/** 把 matchMedia 桩为移动视口分支（jsdom 不应用媒体查询） */
function stubMobileViewport(): () => void {
  const original = window.matchMedia;
  window.matchMedia = ((query: string) => ({
    matches: true,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
  return () => {
    window.matchMedia = original;
  };
}

describe('Sidebar 壳能力', () => {
  it('content 槽替代 items 渲染；sidebarFooter 渲染在滚动区之后，未提供零渲染', () => {
    const { unmount } = render(
      <Sidebar
        content={<div>自定义侧栏</div>}
        sidebarFooter={<div>底部区</div>}
        items={[{ label: '不应出现', href: '/x' }]}
      >
        <div>主区</div>
      </Sidebar>,
    );
    expect(screen.getByText('自定义侧栏')).toBeTruthy();
    expect(screen.queryByText('不应出现')).toBeNull();
    const nav = document.querySelector('[data-slot=sidebar-nav]')!;
    const footer = document.querySelector('[data-slot=sidebar-footer]')!;
    expect(footer.textContent).toContain('底部区');
    expect(
      nav.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    unmount();

    render(<Sidebar content={<div>仅内容</div>}>主区</Sidebar>);
    expect(document.querySelector('[data-slot=sidebar-footer]')).toBeNull();
  });

  it('brand 支持 ReactNode：渲染在侧栏品牌行与移动端顶栏', () => {
    render(
      <Sidebar brand={<span>品牌 X</span>} content={<div>侧栏</div>}>
        主区
      </Sidebar>,
    );
    const brandRow = document.querySelector('[data-slot=sidebar-brand]')!;
    expect(brandRow.textContent).toContain('品牌 X');
    const topbar = document.querySelector('[data-slot=sidebar-topbar]')!;
    expect(topbar.textContent).toContain('品牌 X');
  });

  it('collapsible 折叠为 icon rail：宽度收窄、items 仅图标（title 兜底）、footer 与品牌内容隐藏、onCollapse 传出', async () => {
    const onCollapse = vi.fn();
    render(
      <Sidebar
        brand={{ title: '后台' }}
        items={[{ label: '概览', href: '/', icon: 'home' }]}
        sidebarFooter={<div>底部区</div>}
        collapsible
        onCollapse={onCollapse}
      >
        主区
      </Sidebar>,
    );
    const trigger = screen.getByRole('button', { name: '收起侧边栏' });
    fireEvent.click(trigger);
    expect(onCollapse).toHaveBeenCalledWith(true);

    const aside = document.querySelector('[data-slot=sidebar]')!;
    expect(aside.getAttribute('data-collapsed')).toBe('true');
    // label 隐藏；hover 图标经 RailTooltip 展示（右侧浮层）
    expect(screen.queryByText('概览')).toBeNull();
    expect(
      document.querySelector('[data-slot=sidebar-item]')?.getAttribute('title'),
    ).toBeNull();
    expect(document.querySelector('[data-slot=sidebar-footer]')).toBeNull();
    expect(screen.queryByText('后台')).toBeNull();

    fireEvent.focus(document.querySelector('[data-slot=sidebar-item]')!);
    await vi.waitFor(() => {
      expect(
        document.querySelector('[data-slot=tooltip-content]')?.textContent,
      ).toBe('概览');
    });

    fireEvent.click(screen.getByRole('button', { name: '展开侧边栏' }));
    expect(onCollapse).toHaveBeenCalledWith(false);
    expect(aside.getAttribute('data-collapsed')).toBeNull();
    expect(screen.getByText('概览')).toBeTruthy();
  });

  it('useSidebarDrawer 提供 close 与 collapsed；不在 Sidebar 内返回 null', () => {
    const probe: Array<string> = [];
    function Probe() {
      const drawer = useSidebarDrawer();
      probe.push(drawer === null ? 'null' : String(drawer.collapsed));
      return null;
    }
    const { unmount } = render(
      <Sidebar content={<Probe />} collapsible>
        主区
      </Sidebar>,
    );
    expect(probe).toEqual(['false']);
    fireEvent.click(screen.getByRole('button', { name: '收起侧边栏' }));
    expect(probe).toEqual(['false', 'true']);
    unmount();

    render(<Probe />);
    expect(probe[2]).toBe('null');
  });

  it('移动端抽屉：菜单钮开启、遮罩 / Escape / locationKey 变化关闭，关闭时 inert', () => {
    const restore = stubMobileViewport();
    try {
      const { rerender } = render(
        <Sidebar content={<div>侧栏</div>} locationKey="/a">
          主区
        </Sidebar>,
      );
      const aside = document.querySelector('[data-slot=sidebar]')!;
      expect(aside.hasAttribute('inert')).toBe(true);

      fireEvent.click(screen.getByRole('button', { name: '打开导航' }));
      expect(document.querySelector('[data-slot=sidebar-scrim]')).not.toBeNull();
      expect(aside.hasAttribute('inert')).toBe(false);

      // 遮罩点击关闭
      fireEvent.click(document.querySelector('[data-slot=sidebar-scrim]')!);
      expect(document.querySelector('[data-slot=sidebar-scrim]')).toBeNull();

      // Escape 关闭
      fireEvent.click(screen.getByRole('button', { name: '打开导航' }));
      expect(document.querySelector('[data-slot=sidebar-scrim]')).not.toBeNull();
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(document.querySelector('[data-slot=sidebar-scrim]')).toBeNull();

      // locationKey 变化关闭
      fireEvent.click(screen.getByRole('button', { name: '打开导航' }));
      expect(document.querySelector('[data-slot=sidebar-scrim]')).not.toBeNull();
      rerender(
        <Sidebar content={<div>侧栏</div>} locationKey="/b">
          主区
        </Sidebar>,
      );
      expect(document.querySelector('[data-slot=sidebar-scrim]')).toBeNull();
    } finally {
      restore();
    }
  });

  it('Menu 在 collapsed 侧栏内降级为仅图标（label / badge / 分组隐藏）', async () => {
    render(
      <Sidebar
        collapsible
        content={
          <Menu
            items={[
              { key: 'a', label: '对话', icon: 'chat' },
              { key: 'b', label: '设置', icon: 'settings', badge: 3, group: '系统' },
            ]}
          />
        }
      >
        主区
      </Sidebar>,
    );
    expect(screen.getByText('对话')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '收起侧边栏' }));

    expect(document.querySelector('[data-slot=menu]')?.getAttribute('data-collapsed')).toBe('true');
    expect(screen.queryByText('对话')).toBeNull();
    expect(screen.queryByText('系统')).toBeNull();
    expect(document.querySelector('[data-slot=menu-item-badge]')).toBeNull();

    // hover 图标经 RailTooltip 展示
    fireEvent.focus(document.querySelector('[data-slot=menu-item]')!);
    await vi.waitFor(() => {
      expect(
        document.querySelector('[data-slot=tooltip-content]')?.textContent,
      ).toBe('对话');
    });
  });
});
