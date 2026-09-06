// @vitest-environment jsdom
/**
 * 布局组件（spec: layout-components）：Layout 方向推导 / Sider 受控折叠 /
 * Content 占据剩余空间 / Menu 渲染与受控选中 / 通用 props / Fragment 复用
 */
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import { expectIconBeforeLabel, renderDsl } from './helpers.js';

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
});
