// @vitest-environment jsdom
import './setup.js';

import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryNavigation, MenuRegistry } from '@pactor-app/router';
import { PermissionStore } from '@pactor-app/permission';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ChatLayout,
  type ChatLayoutMenuItem,
} from '../../src/layout/index.js';

afterEach(cleanup);

const DEMO_MENU: ChatLayoutMenuItem[] = [
  { key: 'chat', label: '对话', icon: 'chat', path: '/chat' },
  { key: 'agents', label: '我的智能体', icon: 'user', path: '/agents' },
  { key: 'settings', label: '系统设置', icon: 'settings', path: '/settings', badge: 3 },
  { key: 'conv-1', label: '桌面框架调整', icon: 'history', path: '/chat', group: '最近', dot: true },
  { key: 'conv-2', label: '整理本周产品进展', icon: 'history', path: '/chat', group: '最近' },
];

describe('ChatLayout：菜单渲染', () => {
  it('渲染菜单项（含分组标签 / 图标 / badge / dot）', () => {
    render(
      <ChatLayout menu={DEMO_MENU}>
        <div>主内容</div>
      </ChatLayout>,
    );

    expect(screen.getByText('对话')).toBeTruthy();
    expect(screen.getByText('我的智能体')).toBeTruthy();
    expect(screen.getByText('系统设置')).toBeTruthy();
    expect(screen.getByText('最近')).toBeTruthy();
    expect(screen.getByText('桌面框架调整')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy(); // badge
    expect(screen.getByText('主内容')).toBeTruthy();
  });

  it('menu 为空数组且无 sidebar 槽时不渲染侧栏菜单', () => {
    const { container } = render(
      <ChatLayout menu={[]}>
        <div>主内容</div>
      </ChatLayout>,
    );

    expect(container.querySelector('[data-slot=menu]')).toBeNull();
    expect(screen.getByText('主内容')).toBeTruthy();
  });

  it('sidebar 槽优先于内建菜单', () => {
    render(
      <ChatLayout menu={DEMO_MENU} sidebar={<div>自定义侧栏</div>}>
        <div>主内容</div>
      </ChatLayout>,
    );

    expect(screen.getByText('自定义侧栏')).toBeTruthy();
    expect(screen.queryByText('对话')).toBeNull();
  });

  it('sidebarFooter 渲染在侧栏底部', () => {
    render(
      <ChatLayout menu={DEMO_MENU} sidebarFooter={<div>用户卡</div>}>
        <div>主内容</div>
      </ChatLayout>,
    );

    expect(screen.getByText('用户卡')).toBeTruthy();
  });
});

describe('ChatLayout：active 推导', () => {
  it('activeMenuKey 优先于 route 与 bridge', () => {
    const bridge = new MemoryNavigation('/chat');
    render(
      <ChatLayout
        menu={DEMO_MENU}
        bridge={bridge}
        route={{ path: '/agents', params: {}, query: {} }}
        activeMenuKey="settings"
      >
        <div>主内容</div>
      </ChatLayout>,
    );

    const settingsItem = screen.getByText('系统设置').closest('button');
    expect(settingsItem?.getAttribute('aria-current')).toBe('page');
  });

  it('route 优先于 bridge 订阅', () => {
    const bridge = new MemoryNavigation('/chat');
    render(
      <ChatLayout
        menu={DEMO_MENU}
        bridge={bridge}
        route={{ path: '/agents', params: {}, query: {} }}
      >
        <div>主内容</div>
      </ChatLayout>,
    );

    const agentsItem = screen.getByText('我的智能体').closest('button');
    expect(agentsItem?.getAttribute('aria-current')).toBe('page');
  });

  it('无 route 时按 bridge location 推导 active', () => {
    const bridge = new MemoryNavigation('/settings');
    render(
      <ChatLayout menu={DEMO_MENU} bridge={bridge}>
        <div>主内容</div>
      </ChatLayout>,
    );

    const settingsItem = screen.getByText('系统设置').closest('button');
    expect(settingsItem?.getAttribute('aria-current')).toBe('page');
  });

  it('bridge 导航后 active 跟随 location 变化', async () => {
    const user = userEvent.setup();
    const bridge = new MemoryNavigation('/chat');
    render(
      <ChatLayout menu={DEMO_MENU} bridge={bridge}>
        <div>主内容</div>
      </ChatLayout>,
    );

    await user.click(screen.getByText('我的智能体'));

    const agentsItem = screen.getByText('我的智能体').closest('button');
    expect(agentsItem?.getAttribute('aria-current')).toBe('page');
  });
});

describe('ChatLayout：导航行为', () => {
  it('onMenuSelect 提供时调用之（替代默认导航）', async () => {
    const user = userEvent.setup();
    const onMenuSelect = vi.fn();
    const bridge = new MemoryNavigation('/chat');
    render(
      <ChatLayout menu={DEMO_MENU} bridge={bridge} onMenuSelect={onMenuSelect}>
        <div>主内容</div>
      </ChatLayout>,
    );

    await user.click(screen.getByText('我的智能体'));

    expect(onMenuSelect).toHaveBeenCalledWith(
      'agents',
      expect.objectContaining({ key: 'agents', label: '我的智能体' }),
    );
    // 默认导航被替代，bridge location 不变
    expect(bridge.getLocation().pathname).toBe('/chat');
  });

  it('无 onMenuSelect 时默认 bridge.push(path)', async () => {
    const user = userEvent.setup();
    const bridge = new MemoryNavigation('/chat');
    render(
      <ChatLayout menu={DEMO_MENU} bridge={bridge}>
        <div>主内容</div>
      </ChatLayout>,
    );

    await user.click(screen.getByText('我的智能体'));

    expect(bridge.getLocation().pathname).toBe('/agents');
  });

  it('disabled 项不触发 onMenuSelect 与导航', async () => {
    const user = userEvent.setup();
    const onMenuSelect = vi.fn();
    const bridge = new MemoryNavigation('/chat');
    const menuWithDisabled: ChatLayoutMenuItem[] = [
      { key: 'chat', label: '对话', path: '/chat' },
      { key: 'disabled', label: '禁用项', path: '/disabled', disabled: true },
    ];
    render(
      <ChatLayout menu={menuWithDisabled} bridge={bridge} onMenuSelect={onMenuSelect}>
        <div>主内容</div>
      </ChatLayout>,
    );

    await user.click(screen.getByText('禁用项'));

    expect(onMenuSelect).not.toHaveBeenCalled();
    expect(bridge.getLocation().pathname).toBe('/chat');
  });
});

describe('ChatLayout：registry 推导', () => {
  it('从 MenuRegistry 推导菜单（group 类型项 → 分组标签）', () => {
    const registry = new MenuRegistry([
      { id: 'chat', type: 'page', title: '对话', path: '/chat', icon: 'chat' },
      {
        id: 'recent',
        type: 'group',
        title: '最近',
        children: [
          { id: 'conv-1', type: 'page', title: '会话一', path: '/chat', icon: 'history' },
          { id: 'conv-2', type: 'page', title: '会话二', path: '/chat', icon: 'history' },
        ],
      },
    ]);
    render(
      <ChatLayout registry={registry}>
        <div>主内容</div>
      </ChatLayout>,
    );

    expect(screen.getByText('对话')).toBeTruthy();
    expect(screen.getByText('最近')).toBeTruthy();
    expect(screen.getByText('会话一')).toBeTruthy();
    expect(screen.getByText('会话二')).toBeTruthy();
  });

  it('registry 推导时 hidden 项不渲染', () => {
    const registry = new MenuRegistry([
      { id: 'chat', type: 'page', title: '对话', path: '/chat' },
      { id: 'hidden', type: 'page', title: '隐藏页', path: '/hidden', hidden: true },
    ]);
    render(
      <ChatLayout registry={registry}>
        <div>主内容</div>
      </ChatLayout>,
    );

    expect(screen.getByText('对话')).toBeTruthy();
    expect(screen.queryByText('隐藏页')).toBeNull();
  });

  it('registry 推导时 permissionChecker 过滤无权限项', () => {
    const registry = new MenuRegistry([
      { id: 'chat', type: 'page', title: '对话', path: '/chat' },
      {
        id: 'admin',
        type: 'page',
        title: '管理页',
        path: '/admin',
        permission: { code: 'admin' },
      },
    ]);
    const store = new PermissionStore();
    store.setPermissions([]); // 无 admin 权限
    render(
      <ChatLayout registry={registry} permissionChecker={store}>
        <div>主内容</div>
      </ChatLayout>,
    );

    expect(screen.getByText('对话')).toBeTruthy();
    expect(screen.queryByText('管理页')).toBeNull();
  });

  it('menu 显式数据优先于 registry 推导', () => {
    const registry = new MenuRegistry([
      { id: 'registry-item', type: 'page', title: '注册表项', path: '/registry' },
    ]);
    render(
      <ChatLayout menu={DEMO_MENU} registry={registry}>
        <div>主内容</div>
      </ChatLayout>,
    );

    expect(screen.getByText('对话')).toBeTruthy();
    expect(screen.queryByText('注册表项')).toBeNull();
  });
});

describe('ChatLayout：折叠', () => {
  it('collapsible 透传 Sidebar（渲染折叠触发器）', () => {
    const { container } = render(
      <ChatLayout menu={DEMO_MENU} collapsible>
        <div>主内容</div>
      </ChatLayout>,
    );

    expect(
      container.querySelector('[data-slot=sidebar-collapse-trigger]'),
    ).toBeTruthy();
  });
});
