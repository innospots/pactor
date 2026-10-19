// @vitest-environment jsdom
/**
 * 布局组件（spec: layout-components）：Layout 方向推导 / Sider 受控折叠 /
 * Content 占据剩余空间 / Menu 渲染与受控选中 / 通用 props / Fragment 复用
 */
import { cleanup, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { expectEventState, expectIconBeforeLabel, renderDsl } from './helpers.js';

afterEach(cleanup);

describe('Layout 方向推导', () => {
  it('含 Sider 直接子节点时为 horizontal', () => {
    const { container } = renderDsl({
      type: 'Layout',
      children: [
        { type: 'Sider', children: [{ type: 'Alert', props: { message: '侧栏' } }] },
        { type: 'Content', children: [{ type: 'Alert', props: { message: '内容' } }] },
      ],
    });

    const layout = container.querySelector('[data-slot=layout]')!;
    expect(layout.getAttribute('data-direction')).toBe('horizontal');
    expect(layout.classList.contains('flex-row')).toBe(true);
    expect(screen.getByText('侧栏')).toBeDefined();
    expect(screen.getByText('内容')).toBeDefined();
  });

  it('无 Sider 时为 vertical', () => {
    const { container } = renderDsl({
      type: 'Layout',
      children: [
        { type: 'Header', children: [{ type: 'Alert', props: { message: '顶栏' } }] },
        { type: 'Content', children: [] },
        { type: 'Footer', children: [{ type: 'Alert', props: { message: '底栏' } }] },
      ],
    });

    const layout = container.querySelector('[data-slot=layout]')!;
    expect(layout.getAttribute('data-direction')).toBe('vertical');
    expect(layout.classList.contains('flex-col')).toBe(true);
    expect(screen.getByText('底栏')).toBeDefined();
  });

  it('显式 direction 覆盖推导', () => {
    const { container } = renderDsl({
      type: 'Layout',
      props: { direction: 'vertical' },
      children: [{ type: 'Sider', children: [] }],
    });

    expect(
      container.querySelector('[data-slot=layout]')!.getAttribute('data-direction'),
    ).toBe('vertical');
  });

  it('component 引用的 Sider 子树同样计入推导', () => {
    const { container } = renderDsl(
      {
        type: 'Layout',
        children: [
          { component: 'sideNav' },
          { type: 'Content', children: [] },
        ],
      },
      {
        pageComponents: {
          sideNav: {
            type: 'Sider',
            children: [{ type: 'Alert', props: { message: '侧栏' } }],
          },
        },
      },
    );

    const layout = container.querySelector('[data-slot=layout]')!;
    expect(layout.getAttribute('data-direction')).toBe('horizontal');
    expect(screen.getByText('侧栏')).toBeDefined();
  });
});

describe('Sider 受控折叠', () => {
  it('width 默认 200，显式 width 生效', () => {
    const { container } = renderDsl({
      type: 'Sider',
      props: { width: 240 },
    });
    const sider = container.querySelector('[data-slot=layout-sider]') as HTMLElement;
    expect(sider.style.width).toBe('240px');
  });

  it('collapsed 时宽度为 collapsedWidth', () => {
    const { container } = renderDsl({
      type: 'Sider',
      props: { collapsed: true, width: 200, collapsedWidth: 64 },
    });
    const sider = container.querySelector('[data-slot=layout-sider]') as HTMLElement;
    expect(sider.style.width).toBe('64px');
  });

  it('collapsible 触发器点击经 onCollapse 回传（受控闭环）', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl({
      type: 'Sider',
      props: { collapsible: true, collapsed: '${state.siderCollapsed}' },
      events: {
        onCollapse: { action: 'setState', params: { siderCollapsed: '${event}' } },
      },
    });

    await user.click(screen.getByRole('button', { name: 'collapse sider' }));
    expect(context.state.get('siderCollapsed')).toBe(true);
  });
});

describe('Content / Footer', () => {
  it('Content 根节点 flex-1 占据剩余空间', () => {
    const { container } = renderDsl({
      type: 'Layout',
      children: [
        { type: 'Header', children: [] },
        { type: 'Content', children: [{ type: 'Alert', props: { message: '主体' } }] },
      ],
    });
    const content = container.querySelector('[data-slot=layout-content]')!;
    expect(content.classList.contains('flex-1')).toBe(true);
  });

  it('Footer 渲染于 Content 之后', () => {
    const { container } = renderDsl({
      type: 'Layout',
      children: [
        { type: 'Content', children: [{ type: 'Alert', props: { message: 'C' } }] },
        { type: 'Footer', children: [{ type: 'Alert', props: { message: 'F' } }] },
      ],
    });
    const layout = container.querySelector('[data-slot=layout]')!;
    const slots = Array.from(layout.children).map((el) => el.getAttribute('data-slot'));
    expect(slots).toEqual(['layout-content', 'layout-footer']);
  });
});

describe('Menu', () => {
  const items = [
    { key: 'home', label: '首页' },
    {
      key: 'customer',
      label: '客户管理',
      children: [{ key: 'customer-list', label: '客户列表' }],
    },
  ];

  it('inline 模式渲染菜单树，selectedKey 高亮', () => {
    const { container } = renderDsl({
      type: 'Menu',
      props: { items, selectedKey: 'customer-list' },
    });

    expect(screen.getByText('客户管理')).toBeDefined();
    const active = container.querySelector('[data-key=customer-list] [data-slot=menu-item]')!;
    expect(active.getAttribute('aria-current')).toBe('page');
    expect(container.querySelector('[data-slot=menu]')!.getAttribute('data-mode')).toBe('inline');
  });

  it('horizontal 模式横向排列', () => {
    const { container } = renderDsl({
      type: 'Menu',
      props: { items, mode: 'horizontal' },
    });
    expect(container.querySelector('[data-slot=menu]')!.getAttribute('data-mode')).toBe('horizontal');
  });

  it('点击经 onSelect 传出 key（接 navigate 的典型链路）', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl({
      type: 'Menu',
      props: { items },
      events: {
        onSelect: { action: 'setState', params: { selected: '${event}' } },
      },
    });

    await user.click(screen.getByText('客户列表'));
    expect(context.state.get('selected')).toBe('customer-list');
  });

  it('声明 icon 的菜单项在文字前渲染图标', () => {
    const { container } = renderDsl({
      type: 'Menu',
      props: {
        items: [
          { key: 'home', label: '首页', icon: 'home' },
          {
            key: 'customer',
            label: '客户管理',
            children: [{ key: 'customer-list', label: '客户列表', icon: 'users' }],
          },
        ],
      },
    });

    expectIconBeforeLabel(
      container.querySelector('[data-key=home] [data-slot=menu-item]')!,
      '首页',
    );
    expectIconBeforeLabel(
      container.querySelector('[data-key=customer-list] [data-slot=menu-item]')!,
      '客户列表',
    );
  });

  it('展示扩展字段：badge 角标 / dot 状态点 / group 分组标题 / disabled 不可选', async () => {
    const user = userEvent.setup();
    const { container, context } = renderDsl({
      type: 'Menu',
      props: {
        items: [
          { key: 'chat', label: '对话', badge: 3 },
          { key: 'conv-1', label: '桌面框架调整', dot: true, group: '最近' },
          { key: 'conv-2', label: '整理本周产品进展', group: '最近' },
          { key: 'disabled-item', label: '禁用项', disabled: true },
        ],
      },
      events: {
        onSelect: { action: 'setState', params: { selected: '${event}' } },
      },
    });

    // badge / dot / 分组标题（相邻同组只渲染一次）
    expect(screen.getByText('3')).toBeDefined();
    expect(
      container.querySelector('[data-key=conv-1] [data-slot=menu-item-dot]'),
    ).not.toBeNull();
    expect(container.querySelectorAll('[data-slot=menu-group]')).toHaveLength(1);
    expect(screen.getByText('最近')).toBeDefined();


    // 普通项可选；disabled 项不触发 onSelect
    await user.click(screen.getByText('对话'));
    expect(context.state.get('selected')).toBe('chat');
    await user.click(screen.getByText('禁用项'));
    expect(context.state.get('selected')).toBe('chat');
  });

  it('collapsible：目录项点击展开/收起子菜单且不触发 onSelect，chevron 旋转', async () => {
    const user = userEvent.setup();
    const { container, context } = renderDsl({
      type: 'Menu',
      props: { items, collapsible: true },
      events: {
        onSelect: { action: 'setState', params: { selected: '${event}' } },
      },
    });

    // 初始折叠：子菜单不渲染，chevron 收起
    const dirItem = container.querySelector(
      '[data-key=customer] [data-slot=menu-item]',
    )!;
    const chevron = container.querySelector(
      '[data-key=customer] [data-slot=menu-item-chevron]',
    )!;
    expect(chevron).not.toBeNull();
    expect(screen.queryByText('客户列表')).toBeNull();
    expect(chevron.classList.contains('rotate-180')).toBe(false);

    // 点击目录项：展开，不触发 onSelect
    await user.click(dirItem);
    expect(screen.getByText('客户列表')).toBeDefined();
    expect(chevron.classList.contains('rotate-180')).toBe(true);
    expect(context.state.get('selected')).toBeUndefined();

    // 再次点击：收起；叶子项仍正常触发 onSelect
    await user.click(dirItem);
    expect(screen.queryByText('客户列表')).toBeNull();
    await user.click(dirItem);
    await user.click(screen.getByText('客户列表'));
    await expectEventState(context, 'selected', 'customer-list');
  });

  it('collapsible：selectedKey 祖先目录链初始展开，其余目录折叠', () => {
    renderDsl({
      type: 'Menu',
      props: {
        collapsible: true,
        selectedKey: 'customer-list',
        items: [
          {
            key: 'customer',
            label: '客户管理',
            children: [
              {
                key: 'customer-group',
                label: '客户分组',
                children: [{ key: 'customer-list', label: '客户列表' }],
              },
            ],
          },
          {
            key: 'system',
            label: '系统管理',
            children: [{ key: 'system-user', label: '用户管理' }],
          },
        ],
      },
    });

    // 祖先链 customer / customer-group 展开，叶子可见；其余目录折叠
    expect(screen.getByText('客户列表')).toBeDefined();
    expect(screen.queryByText('用户管理')).toBeNull();
  });

  it('collapsible：defaultExpandedKeys 指定目录初始展开（与 selectedKey 无关）', () => {
    renderDsl({
      type: 'Menu',
      props: {
        collapsible: true,
        defaultExpandedKeys: ['system'],
        items: [
          { key: 'home', label: '首页' },
          {
            key: 'system',
            label: '系统管理',
            children: [{ key: 'system-user', label: '用户管理' }],
          },
          {
            key: 'customer',
            label: '客户管理',
            children: [{ key: 'customer-list', label: '客户列表' }],
          },
        ],
      },
    });

    expect(screen.getByText('用户管理')).toBeDefined();
    expect(screen.queryByText('客户列表')).toBeNull();
  });

  it('缺省 collapsible：子菜单静态展开，目录项不可选中（点击不触发 onSelect）', async () => {
    const user = userEvent.setup();
    const { context } = renderDsl({
      type: 'Menu',
      props: { items },
      events: {
        onSelect: { action: 'setState', params: { selected: '${event}' } },
      },
    });

    expect(screen.getByText('客户列表')).toBeDefined();
    await user.click(screen.getByText('客户管理'));
    // 目录项不参与选中：点击为空操作，叶子项照常触发 onSelect
    expect(context.state.get('selected')).toBeUndefined();
    await user.click(screen.getByText('客户列表'));
    await expectEventState(context, 'selected', 'customer-list');
  });

  /** 渲染 collapsed(icon rail)侧栏内的 Menu：Sidebar content 槽 DSL + 点击收起触发器 */
  function renderRailMenu(menuNode: Record<string, unknown>) {
    const result = renderDsl({
      type: 'Sidebar',
      props: { collapsible: true, content: menuNode },
      children: [{ type: 'Text', props: { text: '主区' } }],
    } as never);
    fireEvent.click(screen.getByRole('button', { name: '收起侧边栏' }));
    const menu = document.querySelector('[data-slot=menu]')!;
    expect(menu.getAttribute('data-collapsed')).toBe('true');
    return { ...result, menu };
  }

  it('icon rail：目录项 hover 经右侧 flyout 展示子菜单，rail 内不平铺', async () => {
    const { menu } = renderRailMenu({
      type: 'Menu',
      props: { items },
    });

    // rail 内不平铺子菜单图标
    expect(menu.querySelector('[data-key=customer-list]')).toBeNull();

    // hover 目录图标 → 右侧 flyout（完整形态：label 可见）
    fireEvent.mouseEnter(
      menu.querySelector('[data-key=customer] [data-slot=menu-item]')!,
    );
    await vi.waitFor(() => {
      expect(document.querySelector('[data-slot=menu-flyout]')).not.toBeNull();
    });
    expect(
      document.querySelector('[data-slot=menu-flyout]')!.textContent,
    ).toContain('客户管理');
    expect(screen.getByText('客户列表')).toBeDefined();
  });

  it('icon rail flyout：点选叶子触发 onSelect 且浮层关闭', async () => {
    const { menu, context } = renderRailMenu({
      type: 'Menu',
      props: { items },
      events: {
        onSelect: { action: 'setState', params: { selected: '${event}' } },
      },
    });

    fireEvent.mouseEnter(
      menu.querySelector('[data-key=customer] [data-slot=menu-item]')!,
    );
    await vi.waitFor(() => {
      expect(document.querySelector('[data-slot=menu-flyout]')).not.toBeNull();
    });

    fireEvent.click(screen.getByText('客户列表'));
    await expectEventState(context, 'selected', 'customer-list');
    await vi.waitFor(() => {
      expect(document.querySelector('[data-slot=menu-flyout]')).toBeNull();
    });
  });
});

describe('Grid 子项跨列', () => {
  it('子节点 props.style 的 gridColumn/gridRow 提升到 grid-item 包裹容器', () => {
    const { container } = renderDsl({
      type: 'Grid',
      props: {
        columns: 2,
        gap: 16,
      },
      children: [
        { type: 'Text', props: { text: '甲' } },
        {
          type: 'Text',
          props: { text: '乙', style: { gridColumn: '1 / -1' } },
        },
      ],
    });

    const items = container.querySelectorAll('[data-slot=grid-item]');
    expect(items).toHaveLength(2);
    expect((items[0] as HTMLElement).style.gridColumn).toBe('');
    expect((items[1] as HTMLElement).style.gridColumn).toBe('1 / -1');
  });
});
