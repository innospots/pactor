// @vitest-environment jsdom
import './setup.js';

import { Registry, type PageDsl } from '@pactor-app/core';
import { createPageRuntime } from '@pactor-app/runtime';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  ChatShell,
  ChatView,
  ConversationStore,
  registerChatComponent,
  type ChatMenuItem,
} from '../src/index.js';

afterEach(cleanup);

function shellMenu(): ChatMenuItem[] {
  return [
    { key: 'chat', label: '对话', icon: 'chat' },
    { key: 'settings', label: '系统设置', icon: 'settings' },
  ];
}

describe('ChatShell（spec: chat-dsl-component / ChatShell 外壳组件）', () => {
  it('menu 数据驱动内建菜单侧栏：AppShell 承载，activeMenuKey 高亮', () => {
    render(
      <ChatShell
        menu={shellMenu()}
        activeMenuKey="settings"
        content={<div>主区内容</div>}
      />,
    );
    expect(document.querySelector('.pactor-chat-shell')).toBeTruthy();
    const items = document.querySelectorAll('.pactor-chat-menu__item');
    expect(items).toHaveLength(2);
    expect(
      document.querySelector('.pactor-chat-menu__item--active')?.textContent,
    ).toContain('系统设置');
    expect(screen.getByText('主区内容')).toBeTruthy();
  });

  it('onMenuSelect 以 key + item 触发；ChatShell 不含导航逻辑（只发事件）', () => {
    const onMenuSelect = vi.fn();
    render(
      <ChatShell
        menu={shellMenu()}
        activeMenuKey="chat"
        onMenuSelect={onMenuSelect}
        content={<div>对话页</div>}
      />,
    );
    fireEvent.click(screen.getByText('系统设置'));
    expect(onMenuSelect).toHaveBeenCalledTimes(1);
    expect(onMenuSelect).toHaveBeenCalledWith('settings', shellMenu()[1]);
    // 外壳自身不切换内容（由宿主决定）
    expect(screen.getByText('对话页')).toBeTruthy();
  });

  it('sidebar 槽替代内建菜单侧栏；brand 透传 AppShell 顶栏', () => {
    render(
      <ChatShell
        menu={shellMenu()}
        sidebar={<nav>自定义侧栏</nav>}
        brand={<span>品牌区</span>}
        content={<div>内容</div>}
      />,
    );
    expect(screen.getByText('自定义侧栏')).toBeTruthy();
    expect(document.querySelector('.pactor-chat-menu')).toBeNull();
    // brand 双位置（决策 D3）：移动端顶栏 + 桌面侧栏品牌行
    expect(screen.getAllByText('品牌区')).toHaveLength(2);
  });

  it('content 为 ReactNode：原样渲染（路由出口形态，spec scenario: 路由出口内容槽）', () => {
    // 模拟路由出口：宿主按"当前 URL"选择渲染内容
    function RouteOutlet({ path }: { path: string }): React.ReactNode {
      return path === '/settings' ? <div>设置页</div> : <div>对话页</div>;
    }
    const { rerender } = render(
      <ChatShell menu={shellMenu()} content={<RouteOutlet path="/chat" />} />,
    );
    expect(screen.getByText('对话页')).toBeTruthy();
    // 菜单点击 → 宿主回调执行"导航" → 按新路径渲染（刷新即按 URL 还原的等价语义）
    rerender(
      <ChatShell
        menu={shellMenu()}
        activeMenuKey="settings"
        content={<RouteOutlet path="/settings" />}
      />,
    );
    expect(screen.getByText('设置页')).toBeTruthy();
  });

  it('切换后对话状态存活：共享 ConversationStore 的 ChatView 跨内容切换不丢消息（spec scenario）', () => {
    const store = new ConversationStore();
    store.appendMessage({
      id: 'u1',
      role: 'user',
      status: 'completed',
      parts: [{ type: 'text', content: '既有消息', status: 'ready' }],
    });

    function Content({ page }: { page: string }): React.ReactNode {
      return page === 'chat' ? (
        <ChatView store={store} />
      ) : (
        <div>设置页</div>
      );
    }

    const { rerender } = render(
      <ChatShell menu={shellMenu()} content={<Content page="chat" />} />,
    );
    expect(screen.getByText('既有消息')).toBeTruthy();

    rerender(<ChatShell menu={shellMenu()} content={<Content page="settings" />} />);
    expect(screen.queryByText('既有消息')).toBeNull();

    rerender(<ChatShell menu={shellMenu()} content={<Content page="chat" />} />);
    expect(screen.getByText('既有消息')).toBeTruthy();
  });
});

describe('ChatShell 侧栏增强（spec: chat-dsl-component，决策 D3/D4）', () => {
  it('菜单项 dot: true 在 label 右侧渲染状态圆点；缺省不渲染（spec: 状态点渲染 / 缺省无状态点）', () => {
    render(
      <ChatShell
        menu={[
          { key: 'chat', label: '对话', icon: 'chat', dot: true },
          { key: 'settings', label: '系统设置', icon: 'settings' },
        ]}
        content={<div>内容</div>}
      />,
    );
    const items = document.querySelectorAll('.pactor-chat-menu__item');
    expect(items[0]!.querySelector('.pactor-chat-menu__dot')).toBeTruthy();
    expect(items[1]!.querySelector('.pactor-chat-menu__dot')).toBeNull();
  });

  it('dot 与 badge 可共存（spec: 菜单项状态点）', () => {
    render(
      <ChatShell
        menu={[{ key: 'rec', label: '录音', icon: 'chat', badge: 3, dot: true }]}
        content={<div>内容</div>}
      />,
    );
    const item = document.querySelector('.pactor-chat-menu__item')!;
    expect(item.querySelector('.pactor-chat-menu__dot')).toBeTruthy();
    expect(item.querySelector('.pactor-chat-menu__badge')?.textContent).toBe('3');
  });

  it('collapsible / sidebarFooter 透传 AppShell：折叠钮渲染且底部槽固定渲染', () => {
    render(
      <ChatShell
        menu={shellMenu()}
        brand={<span>品牌</span>}
        collapsible
        sidebarFooter={<div data-testid="footer">用户卡</div>}
        content={<div>内容</div>}
      />,
    );
    // 底部槽固定渲染（折叠前先断言：collapsed 时 footer 整体隐藏）
    expect(
      document.querySelector(
        '[data-slot=sidebar-footer] [data-testid="footer"]',
      ),
    ).toBeTruthy();
    const button = screen.getByRole('button', { name: '收起侧边栏' });
    fireEvent.click(button);
    expect(
      document.querySelector('[data-slot=sidebar][data-state="collapsed"]'),
    ).toBeTruthy();
    expect(document.querySelector('[data-slot=sidebar-footer]')).toBeNull();
  });
});

describe('ChatShell DSL 注册与适配（spec: chat-dsl-component / ChatShell 外壳组件）', () => {
  it('registerChatComponent 一并注册 ChatShell；不覆盖已有同名类型', () => {
    const registry = new Registry<unknown>('ComponentRegistry');
    registerChatComponent(registry);
    expect(registry.has('ChatShell')).toBe(true);

    const existing = (): null => null;
    const registry2 = new Registry<unknown>('ComponentRegistry');
    registry2.register('ChatShell', existing);
    registerChatComponent(registry2);
    expect(registry2.get('ChatShell')).toBe(existing);
  });

  it('菜单切换内容区：onMenuSelect → setState 闭环，when 子树切换 + 高亮（spec scenario）', async () => {
    const components = new Registry<unknown>('ComponentRegistry');
    registerChatComponent(components);
    components.register(
      'Stack',
      ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    );
    components.register('ChatPage', () => <div>对话页内容</div>);
    components.register('SettingsPage', () => <div>设置页内容</div>);

    const runtime = createPageRuntime(
      {
        dsl: '1.0',
        page: { id: 'shell', title: '外壳页' },
        state: { page: 'chat' },
        body: {
          type: 'ChatShell',
          props: {
            menu: shellMenu(),
            activeMenuKey: '${state.page}',
            content: {
              type: 'Stack',
              children: [
                { type: 'ChatPage', when: "${state.page === 'chat'}" },
                {
                  type: 'SettingsPage',
                  when: "${state.page === 'settings'}",
                },
              ],
            },
          },
          events: {
            onMenuSelect: [
              { action: 'setState', params: { page: '${event.key}' } },
            ],
          },
        },
      } satisfies PageDsl,
      { components },
    );

    render(<>{runtime.render()}</>);
    await screen.findByText('对话页内容');
    expect(screen.queryByText('设置页内容')).toBeNull();
    expect(
      document.querySelector('.pactor-chat-menu__item--active')?.textContent,
    ).toContain('对话');

    // 点击"系统设置" → onMenuSelect({ key, item }) → setState → 内容切换 + 高亮
    fireEvent.click(screen.getByText('系统设置'));
    await screen.findByText('设置页内容');
    expect(screen.queryByText('对话页内容')).toBeNull();
    await vi.waitFor(() => {
      expect(
        document.querySelector('.pactor-chat-menu__item--active')?.textContent,
      ).toContain('系统设置');
    });
    await runtime.destroy();
  });
});
