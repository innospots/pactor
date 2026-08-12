// @vitest-environment jsdom
import './setup.js';

import { cleanup, fireEvent, render, screen, act, within } from '@testing-library/react';
import {
  MemoryNavigation,
  MenuRegistry,
  type MenuItem,
  type RouteContext,
} from 'pactor-router';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { RadixAdminLayout } from '../../src/layout/index.js';

afterEach(cleanup);

const menus: MenuItem[] = [
  {
    id: 'customer',
    type: 'group',
    title: '客户管理',
    defaultOpen: true,
    children: [
      {
        id: 'customer-list',
        type: 'page',
        title: '客户列表',
        path: '/customers',
      },
      {
        id: 'customer-detail',
        type: 'page',
        title: '客户详情',
        path: '/customers/:id',
        hidden: true,
        activeMenu: 'customer-list',
      },
    ],
  },
  { id: 'dashboard', type: 'page', title: '工作台', path: '/dashboard' },
  { id: 'docs', type: 'link', title: '文档', path: 'https://example.com' },
];

function createRegistry(extra?: MenuItem[]) {
  return new MenuRegistry(extra ?? menus);
}

function renderAdmin(
  options: {
    config?: Parameters<typeof RadixAdminLayout>[0]['config'];
    route?: RouteContext;
    bridge?: MemoryNavigation;
    registry?: MenuRegistry;
    permissionChecker?: { hasAny(codes: string[]): boolean };
  } = {},
) {
  const bridge = options.bridge ?? new MemoryNavigation('/');
  const registry = options.registry ?? createRegistry();
  const result = render(
    <RadixAdminLayout
      config={options.config}
      brand={{ title: '运营平台' }}
      registry={registry}
      bridge={bridge}
      route={options.route}
      permissionChecker={options.permissionChecker}
    >
      <div>页面内容</div>
    </RadixAdminLayout>,
  );
  return { ...result, bridge, registry };
}

describe('RadixAdminLayout 布局结构与开关', () => {
  it('默认渲染：Header（品牌标题）、Sidebar、内容区含 children（pcr 语义 class，无 ant 元素）', () => {
    const { container } = renderAdmin();

    expect(screen.getByText('运营平台')).toBeTruthy();
    expect(container.querySelector('.pcr-admin-header')).toBeTruthy();
    expect(container.querySelector('.pcr-admin-sidebar')).toBeTruthy();
    expect(
      container.querySelector('.pcr-admin-content')?.textContent,
    ).toContain('页面内容');
    expect(container.querySelector('.ant-layout')).toBeNull();
  });

  it('关闭 sidebar 时不渲染 Sidebar', () => {
    const { container } = renderAdmin({ config: { sidebar: false } });

    expect(container.querySelector('.pcr-admin-sidebar')).toBeNull();
    expect(container.querySelector('.pcr-admin-header')).toBeTruthy();
  });

  it('关闭 header 时不渲染 Header', () => {
    const { container } = renderAdmin({ config: { header: false } });

    expect(container.querySelector('.pcr-admin-header')).toBeNull();
    expect(container.querySelector('.pcr-admin-sidebar')).toBeTruthy();
  });
});

describe('RadixAdminLayout Sidebar 菜单渲染', () => {
  it('group 渲染为可折叠组（Radix Accordion），defaultOpen 组内 page 项渲染', () => {
    const { container } = renderAdmin();

    expect(container.querySelector('.pcr-menu-group')).toBeTruthy();
    expect(screen.getByText('客户管理')).toBeTruthy();
    expect(screen.getByText('客户列表')).toBeTruthy();
    expect(screen.getByText('工作台')).toBeTruthy();
  });

  it('permissionChecker 判定无权限的 page 不出现在菜单中', () => {
    const registry = createRegistry([
      { id: 'dashboard', type: 'page', title: '工作台', path: '/dashboard' },
      {
        id: 'admin',
        type: 'page',
        title: '系统管理',
        path: '/admin',
        permission: 'admin',
      },
    ]);
    renderAdmin({ registry, permissionChecker: { hasAny: () => false } });

    expect(screen.getByText('工作台')).toBeTruthy();
    expect(screen.queryByText('系统管理')).toBeNull();
  });

  it('disabled 项渲染为禁用按钮', () => {
    const registry = createRegistry([
      {
        id: 'dashboard',
        type: 'page',
        title: '工作台',
        path: '/dashboard',
        disabled: true,
      },
    ]);
    renderAdmin({ registry });

    const item = screen.getByText('工作台').closest('button');
    expect(item?.disabled).toBe(true);
  });
});

describe('RadixAdminLayout 菜单选中与导航', () => {
  it('选中态取 route.activeMenu（隐藏详情页高亮其指向的项）', () => {
    const route: RouteContext = {
      path: '/customers/1',
      params: { id: '1' },
      query: {},
      menuId: 'customer-detail',
      activeMenu: 'customer-list',
    };
    const { container } = renderAdmin({ route });

    const selected = container.querySelector('.pcr-menu-item-active');
    expect(selected?.textContent).toContain('客户列表');
  });

  it('点击 page 项经 bridge.push 导航到其 path', () => {
    const bridge = new MemoryNavigation('/');
    const push = vi.spyOn(bridge, 'push');
    renderAdmin({ bridge });

    fireEvent.click(screen.getByText('客户列表'));

    expect(push).toHaveBeenCalledWith('/customers');
  });

  it('点击 link/external 项经 window.open 新窗口打开', () => {
    const open = vi.fn();
    vi.stubGlobal('open', open);
    try {
      renderAdmin();
      fireEvent.click(screen.getByText('文档'));
      expect(open).toHaveBeenCalledWith('https://example.com', '_blank');
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe('RadixAdminLayout Breadcrumb', () => {
  it('breadcrumb 开启时按 activeMenu 菜单链渲染', () => {
    const route: RouteContext = {
      path: '/customers',
      params: {},
      query: {},
      menuId: 'customer-list',
      activeMenu: 'customer-list',
    };
    const { container } = renderAdmin({
      config: { breadcrumb: true },
      route,
    });

    const breadcrumb = container.querySelector('.pcr-admin-breadcrumb');
    expect(breadcrumb).toBeTruthy();
    const texts = [
      ...(breadcrumb?.querySelectorAll('.pcr-breadcrumb-link') ?? []),
    ].map((el) => el.textContent?.trim());
    expect(texts).toEqual(['客户管理', '客户列表']);
  });

  it('breadcrumb 关闭（默认）时不渲染面包屑', () => {
    const route: RouteContext = {
      path: '/customers',
      params: {},
      query: {},
      menuId: 'customer-list',
      activeMenu: 'customer-list',
    };
    const { container } = renderAdmin({ route });

    expect(container.querySelector('.pcr-admin-breadcrumb')).toBeNull();
  });
});

describe('RadixAdminLayout Tabs', () => {
  it('依次导航到两个页面出现两个页签，点击第一个页签导航回第一个页面', () => {
    const bridge = new MemoryNavigation('/dashboard');
    const { container } = renderAdmin({ config: { tabs: true }, bridge });

    act(() => {
      bridge.push('/customers');
    });

    const tabBar = container.querySelector('.pcr-admin-tabs');
    expect(tabBar?.textContent).toContain('工作台');
    expect(tabBar?.textContent).toContain('客户列表');

    fireEvent.click(within(tabBar as HTMLElement).getByText('工作台'));

    expect(bridge.getLocation().pathname).toBe('/dashboard');
  });

  it('关闭当前页签时导航到剩余最后一个页签', () => {
    const bridge = new MemoryNavigation('/dashboard');
    const { container } = renderAdmin({ config: { tabs: true }, bridge });

    act(() => {
      bridge.push('/customers');
    });
    expect(bridge.getLocation().pathname).toBe('/customers');

    // 当前页签（客户列表）的关闭按钮
    const activeTab = container.querySelector('.pcr-tab-active');
    const removeButton = activeTab?.querySelector('.pcr-tab-close');
    expect(removeButton).toBeTruthy();
    fireEvent.click(removeButton as Element);

    expect(bridge.getLocation().pathname).toBe('/dashboard');
    expect(container.querySelector('.pcr-admin-tabs')?.textContent).not.toContain(
      '客户列表',
    );
  });

  it('重复导航同一路径不产生重复页签', () => {
    const bridge = new MemoryNavigation('/dashboard');
    const { container } = renderAdmin({ config: { tabs: true }, bridge });

    act(() => {
      bridge.push('/customers');
      bridge.push('/dashboard');
      bridge.push('/customers');
    });

    const tabBar = container.querySelector('.pcr-admin-tabs');
    expect(tabBar?.querySelectorAll('.pcr-tab')).toHaveLength(2);
  });
});

describe('RadixAdminLayout 结构模式（spec: radix-layout / 模式与收起）', () => {
  it('top-bottom：无 Sidebar，footer 开关生效', () => {
    const { container } = renderAdmin({
      config: { mode: 'top-bottom', footer: true },
    });
    expect(
      container.querySelector('.pcr-admin-layout')?.getAttribute('data-mode'),
    ).toBe('top-bottom');
    expect(container.querySelector('.pcr-admin-sidebar')).toBeNull();
    expect(container.querySelector('.pcr-admin-footer')).toBeTruthy();
  });

  it('side-full：Sidebar 通栏含品牌区，Header 不重复品牌', () => {
    const { container } = renderAdmin({ config: { mode: 'side-full' } });
    expect(container.querySelector('.pcr-admin-side-full')).toBeTruthy();
    expect(
      container.querySelector('.pcr-admin-sidebar-brand')?.textContent,
    ).toContain('运营平台');
    expect(container.querySelector('.pcr-admin-header .pcr-admin-brand')).toBeNull();
  });

  it('two-column：一级菜单窄列 + 激活 group 的子菜单列', () => {
    const route: RouteContext = {
      path: '/customers',
      params: {},
      query: {},
      menuId: 'customer-list',
      activeMenu: 'customer-list',
    };
    const { container } = renderAdmin({ config: { mode: 'two-column' }, route });

    const primary = container.querySelector('.pcr-admin-primary-col')!;
    expect(primary.textContent).toContain('客');
    expect(primary.textContent).toContain('工');
    const secondary = container.querySelector('.pcr-admin-secondary-col')!;
    expect(secondary.textContent).toContain('客户列表');
    expect(within(secondary as HTMLElement).queryByText('工作台')).toBeNull();
  });

  it('collapsible：trigger 切换收起态；collapsed 初始收起', () => {
    const { container } = renderAdmin({ config: { collapsible: true } });
    const trigger = screen.getByRole('button', { name: '收起侧边栏' });
    expect(container.querySelector('.pcr-admin-sidebar')?.getAttribute('data-collapsed')).toBeNull();

    fireEvent.click(trigger);
    expect(container.querySelector('.pcr-admin-sidebar')?.getAttribute('data-collapsed')).toBe('true');
    // 收起态菜单仅显示首字符
    expect(screen.getByRole('button', { name: '展开侧边栏' })).toBeTruthy();

    cleanup();
    const again = renderAdmin({ config: { collapsible: true, collapsed: true } });
    expect(again.container.querySelector('.pcr-admin-sidebar')?.getAttribute('data-collapsed')).toBe('true');
  });

  it('收起态仅顶层首字符平铺；悬停 group 浮出子菜单，点其中 page 项导航并关闭浮层', async () => {
    const bridge = new MemoryNavigation('/');
    const push = vi.spyOn(bridge, 'push');
    const { container } = renderAdmin({
      config: { collapsible: true, collapsed: true },
      bridge,
    });
    const sidebar = container.querySelector('.pcr-admin-sidebar')!;
    // 顶层首字符：工（作台）、客（户管理）；子级"客户列表"不渲染
    expect(within(sidebar as HTMLElement).getByText('工')).toBeTruthy();
    expect(within(sidebar as HTMLElement).getByText('客')).toBeTruthy();
    expect(screen.queryByText('客户列表')).toBeNull();
    expect(sidebar.querySelector('.pcr-menu-group-trigger')).toBeNull();

    // 悬停 group 图标 → 浮出子菜单（含组标题与子项）
    fireEvent.mouseEnter(within(sidebar as HTMLElement).getByText('客'));
    const flyout = await screen.findByText('客户列表');
    expect(screen.getByText('客户管理')).toBeTruthy();

    // 点击浮层中的 page 项 → 导航且浮层关闭，侧边栏保持收起
    fireEvent.click(flyout);
    expect(push).toHaveBeenCalledWith('/customers');
    await vi.waitFor(() => {
      expect(screen.queryByText('客户列表')).toBeNull();
    });
    expect(
      container.querySelector('.pcr-admin-sidebar')?.getAttribute('data-collapsed'),
    ).toBe('true');
  });

  it('fixedHeader / fixedSider 加修饰 class（spec: 固定区域）', () => {
    const { container } = renderAdmin({
      config: { fixedHeader: true, fixedSider: true },
    });
    const layout = container.querySelector('.pcr-admin-layout')!;
    expect(layout.classList.contains('pcr-admin-layout--fixed-header')).toBe(true);
    expect(layout.classList.contains('pcr-admin-layout--fixed-sider')).toBe(true);
  });

  it('缺省即固定；显式 false 关闭（spec: 缺省固定 / 显式关闭）', () => {
    const { container } = renderAdmin();
    const layout = container.querySelector('.pcr-admin-layout')!;
    expect(layout.classList.contains('pcr-admin-layout--fixed-header')).toBe(true);
    expect(layout.classList.contains('pcr-admin-layout--fixed-sider')).toBe(true);

    cleanup();
    const off = renderAdmin({ config: { fixedHeader: false, fixedSider: false } });
    const layout2 = off.container.querySelector('.pcr-admin-layout')!;
    expect(layout2.classList.contains('pcr-admin-layout--fixed-header')).toBe(false);
    expect(layout2.classList.contains('pcr-admin-layout--fixed-sider')).toBe(false);
  });

  it('breakpoint：视口小于断点自动收起（spec: 响应式收起）', () => {
    const original = window.matchMedia;
    // 模拟视口命中 lg 断点（max-width: 991px 匹配）
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
      const { container } = renderAdmin({ config: { breakpoint: 'lg' } });
      expect(
        container.querySelector('.pcr-admin-sidebar')?.getAttribute('data-collapsed'),
      ).toBe('true');
    } finally {
      window.matchMedia = original;
    }
  });
});
