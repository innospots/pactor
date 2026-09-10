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
 * rail 折叠、移动端覆盖抽屉（Sheet）、useSidebarDrawer context、
 * Menu 在 collapsed 侧栏内降级为仅图标。
 *
 * 内部组合 shadcn Sidebar 原语（SidebarProvider / Sidebar / SidebarInset），
 * DOM 结构钩子为 shadcn 语义（data-slot=sidebar-wrapper / sidebar / sidebar-content /
 * sidebar-inset / sidebar-trigger / sidebar-menu-button 等）。
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
    const content = document.querySelector('[data-slot=sidebar-content]')!;
    const footer = document.querySelector('[data-slot=sidebar-footer]')!;
    expect(footer.textContent).toContain('底部区');
    expect(
      content.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING,
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

  it('collapsible 折叠为 icon rail：宽度收窄、items 仅图标、footer 与品牌内容隐藏、onCollapse 传出', async () => {
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

    const sidebar = document.querySelector('[data-slot=sidebar]')!;
    expect(sidebar.getAttribute('data-state')).toBe('collapsed');
    expect(sidebar.getAttribute('data-collapsible')).toBe('icon');
    // 品牌标题与 footer 条件渲染（折叠时不渲染）
    expect(document.querySelector('[data-slot=sidebar-footer]')).toBeNull();
    expect(screen.queryByText('后台')).toBeNull();

    // hover 菜单项经 Tooltip 展示（icon rail 模式下 SidebarMenuButton 内置 tooltip）
    const menuButton = document.querySelector('[data-slot=sidebar-menu-button]')!;
    fireEvent.focus(menuButton);
    await vi.waitFor(() => {
      expect(
        document.querySelector('[data-slot=tooltip-content]')?.textContent,
      ).toBe('概览');
    });
    // 关闭 tooltip 再展开，避免 getByText 命中 tooltip 内容
    fireEvent.blur(menuButton);

    fireEvent.click(screen.getByRole('button', { name: '展开侧边栏' }));
    expect(onCollapse).toHaveBeenCalledWith(false);
    expect(sidebar.getAttribute('data-state')).toBe('expanded');
    // tooltip portal 到 body，用 within 限定在 sidebar 内查询
    const { within } = await import('@testing-library/react');
    expect(within(sidebar as HTMLElement).getByText('概览')).toBeTruthy();
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

  it('移动端抽屉：菜单钮开启、Sheet 遮罩关闭、locationKey 变化关闭', () => {
    const restore = stubMobileViewport();
    try {
      const { rerender } = render(
        <Sidebar content={<div>侧栏</div>} locationKey="/a">
          主区
        </Sidebar>,
      );

      // 移动端：侧栏为 Sheet 抽屉，初始关闭
      expect(screen.queryByText('侧栏')).toBeNull();

      // 菜单钮开启
      fireEvent.click(screen.getByRole('button', { name: '打开导航' }));
      expect(screen.getByText('侧栏')).toBeTruthy();

      // locationKey 变化关闭
      rerender(
        <Sidebar content={<div>侧栏</div>} locationKey="/b">
          主区
        </Sidebar>,
      );
      expect(screen.queryByText('侧栏')).toBeNull();
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

    // hover 图标经 Tooltip 展示
    fireEvent.focus(document.querySelector('[data-slot=menu-item]')!);
    await vi.waitFor(() => {
      expect(
        document.querySelector('[data-slot=tooltip-content]')?.textContent,
      ).toBe('对话');
    });
  });
});
