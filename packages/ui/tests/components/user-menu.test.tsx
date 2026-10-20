// @vitest-environment jsdom
/**
 * UserMenu 账户菜单契约：头像触发器 / 账号信息头 / 账户入口 /
 * 内联主题与在线状态切换 / 退出登录；主题与状态选择保持展开，
 * 其余项关闭并归还焦点；异步退出显示进度后关闭。
 */
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PresenceDot, UserMenu as UiUserMenu } from '../../src/ui/user-menu.js';
import { UserMenu } from '../../src/components/components/UserMenu/index.js';
import {
  COMMON_PROPS_PROBE,
  expectCommonProps,
  expectEventState,
  renderDsl,
} from './helpers.js';

const USER = {
  name: 'Emma Collins',
  email: 'emma@example.com',
  plan: 'Pro',
};

function openMenu() {
  const trigger = screen.getByRole('button', { name: /账户菜单/ });
  fireEvent.click(trigger);
  return trigger;
}

describe('UserMenu（DSL）', () => {
  it('触发器展示首字母与可访问名称；展开后展示账号、徽标与账户入口', () => {
    renderDsl({
      type: 'UserMenu',
      props: {
        user: USER,
        status: 'available',
        items: [
          { label: '个人资料', value: 'profile', icon: 'user' },
          { label: '设置', value: 'settings', icon: 'settings', keys: ['⌘', ','] },
        ],
      },
    });

    const trigger = screen.getByRole('button', {
      name: '账户菜单，Emma Collins，在线',
    });
    expect(trigger.textContent).toContain('EC');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(trigger);

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('emma@example.com')).toBeTruthy();
    expect(screen.getByText('Pro')).toBeTruthy();

    const profile = screen.getByRole('menuitem', { name: '个人资料' });
    expect(profile.querySelector('[data-slot=icon]')).not.toBeNull();
    expect(screen.getByRole('menuitem', { name: '设置' }).textContent).toContain('⌘');
  });

  it('账户入口点击经 onSelect 传出 value，并关闭菜单', async () => {
    const { context } = renderDsl({
      type: 'UserMenu',
      props: {
        user: USER,
        items: [
          { label: '个人资料', value: 'profile' },
          { label: '设置', value: 'settings' },
        ],
      },
      events: {
        onSelect: { action: 'setState', params: { selected: '${event}' } },
      },
    });

    openMenu();
    fireEvent.click(screen.getByRole('menuitem', { name: '个人资料' }));

    await expectEventState(context, 'selected', 'profile');
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('主题切换保持菜单展开，并经 onThemeChange 上报', async () => {
    const { context } = renderDsl({
      type: 'UserMenu',
      props: { user: USER, defaultTheme: 'system' },
      events: {
        onThemeChange: { action: 'setState', params: { theme: '${event}' } },
      },
    });

    openMenu();
    expect(
      screen.getByRole('menuitemradio', { name: '跟随系统' }).getAttribute('aria-checked'),
    ).toBe('true');

    fireEvent.click(screen.getByRole('menuitemradio', { name: '深色' }));

    await expectEventState(context, 'theme', 'dark');
    expect(screen.getByRole('menu')).toBeTruthy();
    expect(
      screen.getByRole('menuitemradio', { name: '深色' }).getAttribute('aria-checked'),
    ).toBe('true');
  });

  it('在线状态切换保持展开，并经 onStatusChange 上报', async () => {
    const { context } = renderDsl({
      type: 'UserMenu',
      props: { user: USER },
      events: {
        onStatusChange: { action: 'setState', params: { status: '${event}' } },
      },
    });

    const trigger = screen.getByRole('button', { name: /账户菜单/ });
    expect(trigger.getAttribute('aria-label')).toContain('在线');

    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('menuitemradio', { name: '忙碌' }));

    await expectEventState(context, 'status', 'busy');
    expect(screen.getByRole('menu')).toBeTruthy();
    expect(trigger.getAttribute('aria-label')).toContain('忙碌');
  });

  it('showTheme=false 且无状态回调时不渲染切换分组', () => {
    renderDsl({
      type: 'UserMenu',
      props: { user: USER, showTheme: false },
    });

    openMenu();
    expect(screen.queryByRole('group', { name: '主题' })).toBeNull();
    expect(screen.queryByRole('group', { name: '状态' })).toBeNull();
    expect(screen.getByRole('menuitem', { name: '退出登录' })).toBeTruthy();
  });

  it('键盘：ArrowDown 打开并聚焦首项，方向键循环，Escape 关闭并归还焦点', async () => {
    renderDsl({
      type: 'UserMenu',
      props: {
        user: USER,
        items: [
          { label: '个人资料', value: 'profile' },
          { label: '设置', value: 'settings' },
        ],
      },
    });

    const trigger = screen.getByRole('button', { name: /账户菜单/ });
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });

    const profile = screen.getByRole('menuitem', { name: '个人资料' });
    await waitFor(() => expect(document.activeElement).toBe(profile));

    fireEvent.keyDown(profile, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(
      screen.getByRole('menuitem', { name: '设置' }),
    );

    fireEvent.keyDown(document.activeElement as Element, { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('受控 open：无需点击即渲染面板，关闭经 onOpenChange 上报', async () => {
    const { context } = renderDsl({
      type: 'UserMenu',
      props: { user: USER, open: true },
      events: {
        onOpenChange: {
          action: 'setState',
          params: { open: '${event}' },
        },
      },
    });
    expect(screen.getByRole('menu')).toBeTruthy();

    fireEvent.pointerDown(document.body);
    await expectEventState(context, 'open', false);
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'UserMenu',
      props: { user: USER, ...COMMON_PROPS_PROBE },
    });
    expectCommonProps(container.querySelector('[data-slot=user-menu]'));
  });
});

describe('UserMenu（React）', () => {
  it('异步退出：显示进度并保持展开，Promise 落定后关闭', async () => {
    let resolve!: () => void;
    const onSignOut = vi.fn(
      () =>
        new Promise<void>((done) => {
          resolve = done;
        }),
    );

    render(
      <UserMenu
        user={USER}
        items={[{ label: '个人资料', value: 'profile' }]}
        onSignOut={onSignOut}
      />,
    );

    openMenu();
    const signOut = screen.getByRole('menuitem', { name: '退出登录' });
    fireEvent.click(signOut);

    await waitFor(() =>
      expect(signOut.getAttribute('aria-busy')).toBe('true'),
    );
    expect(screen.getByText('正在退出')).toBeTruthy();
    expect(screen.getByRole('menu')).toBeTruthy();

    await act(async () => {
      resolve();
    });

    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });

  it('同步退出直接关闭', () => {
    const onSignOut = vi.fn();
    render(<UserMenu user={USER} onSignOut={onSignOut} />);

    openMenu();
    fireEvent.click(screen.getByRole('menuitem', { name: '退出登录' }));

    expect(onSignOut).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('点击外部关闭并上报 onOpenChange', () => {
    const onOpenChange = vi.fn();
    render(<UserMenu user={USER} onOpenChange={onOpenChange} />);

    openMenu();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    fireEvent.pointerDown(document.body);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('显示姓名开关：showName 渲染姓名与箭头，默认隐藏', () => {
    const { rerender } = render(<UserMenu user={USER} />);
    expect(screen.queryByText('Emma Collins')).toBeNull();

    rerender(<UserMenu user={USER} showName />);
    expect(screen.getByText('Emma Collins')).toBeTruthy();
  });

  it('窄屏渲染底部抽屉：关闭时无遮罩，展开后遮罩可点击关闭', () => {
    const base = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      ...base(query),
      matches: query.includes('max-width: 639px'),
    })) as typeof window.matchMedia;
    try {
      render(<UserMenu user={USER} />);
      expect(document.querySelector('[data-slot=user-menu-scrim]')).toBeNull();

      openMenu();
      const scrim = document.querySelector('[data-slot=user-menu-scrim]');
      expect(scrim).not.toBeNull();
      expect(screen.getByRole('menu')).toBeTruthy();

      fireEvent.click(scrim!);
      expect(screen.queryByRole('menu')).toBeNull();
      expect(document.querySelector('[data-slot=user-menu-scrim]')).toBeNull();
    } finally {
      window.matchMedia = base;
    }
  });
});

describe('PresenceDot', () => {
  it('三种状态各有独立图形（实心 / 横杠 / 圆环）', () => {
    const { container } = render(
      <div>
        <PresenceDot status="available" />
        <PresenceDot status="busy" />
        <PresenceDot status="away" />
        <PresenceDot status="offline" />
      </div>,
    );

    const dots = container.querySelectorAll('[data-slot=presence-dot]');
    expect(dots).toHaveLength(4);
    expect(dots[0]!.className).toContain('bg-success');
    expect(dots[1]!.className).toContain('bg-destructive');
    expect(dots[2]!.className).toContain('bg-warning');
    expect(dots[3]!.className).toContain('bg-muted-foreground');

    const ring = (dot: Element) => dot.children[0]!.className;
    const bar = (dot: Element) => dot.children[1]!.className;
    expect(ring(dots[0]!)).toContain('scale-0');
    expect(bar(dots[0]!)).toContain('scale-x-0');
    expect(bar(dots[1]!)).toContain('scale-x-100');
    expect(ring(dots[2]!)).toContain('scale-100');
    expect(ring(dots[3]!)).toContain('scale-100');
  });

  it('内孔 / 横杠读取 --presence-surface，缺省回退 popover', () => {
    render(<UiUserMenu user={USER} status="available" defaultOpen />);
    const dot = document.querySelector('[data-slot=presence-dot]')!;
    expect(
      (dot.children[1] as HTMLElement).style.backgroundColor,
    ).toContain('--presence-surface');
  });
});
