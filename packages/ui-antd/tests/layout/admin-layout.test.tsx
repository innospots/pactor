// @vitest-environment jsdom
import './setup.js';

import { cleanup, fireEvent, render, screen, act, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  MemoryNavigation,
  MenuRegistry,
  type MenuItem,
  type RouteContext,
} from 'pactor-router';

import { AdminLayout } from '../../src/layout/index.js';

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
    config?: Parameters<typeof AdminLayout>[0]['config'];
    route?: RouteContext;
    bridge?: MemoryNavigation;
    registry?: MenuRegistry;
    permissionChecker?: { hasAny(codes: string[]): boolean };
  } = {},
) {
  const bridge = options.bridge ?? new MemoryNavigation('/');
  const registry = options.registry ?? createRegistry();
  const result = render(
    <AdminLayout
      config={options.config}
      brand={{ title: '运营平台' }}
      registry={registry}
      bridge={bridge}
      route={options.route}
      permissionChecker={options.permissionChecker}
    >
      <div>页面内容</div>
    </AdminLayout>,
  );
  return { ...result, bridge, registry };
}

describe('AdminLayout 布局结构与开关', () => {
  it('默认渲染：Header（品牌标题）、Sidebar、内容区含 children', () => {
    const { container } = renderAdmin();

    expect(screen.getByText('运营平台')).toBeTruthy();
    expect(container.querySelector('.pactor-admin-header')).toBeTruthy();
    expect(container.querySelector('.pactor-admin-sidebar')).toBeTruthy();
    expect(
      container.querySelector('.pactor-admin-content')?.textContent,
    ).toContain('页面内容');
  });

  it('关闭 sidebar 时不渲染 Sidebar', () => {
    const { container } = renderAdmin({ config: { sidebar: false } });

    expect(container.querySelector('.pactor-admin-sidebar')).toBeNull();
    expect(container.querySelector('.pactor-admin-header')).toBeTruthy();
  });
});

describe('AdminLayout Sidebar 菜单渲染', () => {
  it('group 渲染为子菜单，全部 page 项渲染', () => {
    const { container } = renderAdmin();

    expect(container.querySelector('.ant-menu-submenu')).toBeTruthy();
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
});

describe('AdminLayout 菜单选中与导航', () => {
  it('选中态取 route.activeMenu（隐藏详情页高亮其指向的项）', () => {
    const route: RouteContext = {
      path: '/customers/1',
      params: { id: '1' },
      query: {},
      menuId: 'customer-detail',
      activeMenu: 'customer-list',
    };
    const { container } = renderAdmin({ route });

    const selected = container.querySelector('.ant-menu-item-selected');
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

describe('AdminLayout Breadcrumb', () => {
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

    const breadcrumb = container.querySelector('.pactor-admin-breadcrumb');
    expect(breadcrumb).toBeTruthy();
    const texts = [
      ...(breadcrumb?.querySelectorAll('.ant-breadcrumb-link') ?? []),
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

    expect(container.querySelector('.pactor-admin-breadcrumb')).toBeNull();
  });
});

describe('AdminLayout Tabs', () => {
  it('依次导航到两个页面出现两个页签，点击第一个页签导航回第一个页面', () => {
    const bridge = new MemoryNavigation('/dashboard');
    const { container } = renderAdmin({ config: { tabs: true }, bridge });

    act(() => {
      bridge.push('/customers');
    });

    const tabBar = container.querySelector('.pactor-admin-tabs');
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
    const activeTab = container.querySelector('.ant-tabs-tab-active');
    const removeButton = activeTab?.querySelector('.ant-tabs-tab-remove');
    expect(removeButton).toBeTruthy();
    fireEvent.click(removeButton as Element);

    expect(bridge.getLocation().pathname).toBe('/dashboard');
    expect(container.querySelector('.pactor-admin-tabs')?.textContent).not.toContain(
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

    const tabBar = container.querySelector('.pactor-admin-tabs');
    expect(tabBar?.querySelectorAll('.ant-tabs-tab')).toHaveLength(2);
  });
});

describe('AdminLayout 结构模式（spec: admin-layout / 布局结构与开关）', () => {
  it('top-bottom（上-中-下）：无 Sidebar，footer 开关生效（spec: 上-中-下模式）', () => {
    const { container } = renderAdmin({
      config: { mode: 'top-bottom', footer: true },
    });

    const layout = container.querySelector('.pactor-admin-layout')!;
    expect(layout.getAttribute('data-mode')).toBe('top-bottom');
    expect(container.querySelector('.pactor-admin-sidebar')).toBeNull();
    expect(container.querySelector('.pactor-admin-header')).toBeTruthy();
    expect(container.querySelector('.pactor-admin-footer')).toBeTruthy();
  });

  it('side-full（通栏侧边）：Sidebar 全高居左含品牌区，Header 不重复品牌（spec: 通栏侧边模式）', () => {
    const { container } = renderAdmin({ config: { mode: 'side-full' } });

    expect(
      container.querySelector('.pactor-admin-layout')?.getAttribute('data-mode'),
    ).toBe('side-full');
    expect(container.querySelector('.pactor-admin-sidebar-brand')?.textContent).toContain(
      '运营平台',
    );
    expect(container.querySelector('.pactor-admin-header .pactor-admin-brand')).toBeNull();
  });

  it('two-column（侧边两列）：一级菜单窄列 + 选中 group 的子菜单列（spec: 两列侧边模式）', () => {
    const route: RouteContext = {
      path: '/customers',
      params: {},
      query: {},
      menuId: 'customer-list',
      activeMenu: 'customer-list',
    };
    const { container } = renderAdmin({ config: { mode: 'two-column' }, route });

    const primary = container.querySelector('.pactor-admin-primary-col')!;
    // 一级菜单：客户管理（group）/ 工作台 / 文档，窄列渲染首字符
    expect(primary.textContent).toContain('客');
    expect(primary.textContent).toContain('工');
    // 激活链首项为 customer group，第二列渲染其子菜单
    const secondary = container.querySelector('.pactor-admin-secondary-col')!;
    expect(secondary.textContent).toContain('客户列表');
    expect(within(secondary as HTMLElement).queryByText('工作台')).toBeNull();
    // 一级列激活态
    expect(
      primary.querySelector('.pactor-admin-primary-item-active')?.textContent,
    ).toBe('客');
  });
});

describe('AdminLayout 固定区域（spec: admin-layout / 固定区域）', () => {
  it('fixedHeader：Header sticky 固定（spec: 固定顶部）', () => {
    const { container } = renderAdmin({ config: { fixedHeader: true } });
    const header = container.querySelector('.pactor-admin-header') as HTMLElement;
    expect(header.style.position).toBe('sticky');
    expect(header.style.top).toBe('0px');
  });

  it('缺省即固定（spec: 缺省固定）；显式 false 关闭（spec: 显式关闭）', () => {
    const { container } = renderAdmin();
    const header = container.querySelector('.pactor-admin-header') as HTMLElement;
    const sider = container.querySelector('.pactor-admin-sidebar') as HTMLElement;
    expect(header.style.position).toBe('sticky');
    expect(sider.style.position).toBe('sticky');

    cleanup();
    const off = renderAdmin({ config: { fixedHeader: false, fixedSider: false } });
    const header2 = off.container.querySelector('.pactor-admin-header') as HTMLElement;
    const sider2 = off.container.querySelector('.pactor-admin-sidebar') as HTMLElement;
    expect(header2.style.position).not.toBe('sticky');
    expect(sider2.style.position).not.toBe('sticky');
  });

  it('fixedSider：Sidebar sticky 固定且自身滚动', () => {
    const { container } = renderAdmin({ config: { fixedSider: true } });
    const sider = container.querySelector('.pactor-admin-sidebar') as HTMLElement;
    expect(sider.style.position).toBe('sticky');
    expect(sider.style.overflow).toBe('auto');
  });
});

describe('AdminLayout 收起侧边栏（spec: admin-layout / 收起侧边栏）', () => {
  it('collapsible：trigger 点击切换收起态（spec: 收起与展开）', () => {
    const { container } = renderAdmin({ config: { collapsible: true } });

    const trigger = container.querySelector('.ant-layout-sider-trigger')!;
    expect(trigger).toBeTruthy();
    expect(container.querySelector('.ant-layout-sider-collapsed')).toBeNull();

    fireEvent.click(trigger);
    expect(container.querySelector('.ant-layout-sider-collapsed')).toBeTruthy();
  });

  it('collapsed 初始收起（spec: 初始收起）', () => {
    const { container } = renderAdmin({
      config: { collapsible: true, collapsed: true },
    });
    expect(container.querySelector('.ant-layout-sider-collapsed')).toBeTruthy();
  });
});
