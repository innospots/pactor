// @vitest-environment jsdom
import './setup.js';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { UserMenu as UiUserMenu } from '../../src/ui/user-menu/index.js';
import { globalSizeStorageKey } from '../../src/lib/global-size.js';
import { expectEventState, renderDsl } from './helpers.js';

const USER = { name: 'Emma Collins', email: 'emma@example.com' };

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute('data-pactor-size');
  window.localStorage.removeItem(globalSizeStorageKey);
});

function renderMenu(extra: Record<string, unknown> = {}) {
  render(<UiUserMenu user={USER} showSize {...extra} />);
  fireEvent.click(screen.getByRole('button', { name: /账户菜单/ }));
}

describe('UserMenu 密度切换', () => {
  it('showSize 显示「界面密度」分段行；选择即应用属性并持久化', () => {
    renderMenu();
    // 行标签（Segmented 行容器角色在桌面/抽屉两路径不同，按文本断言更稳）
    expect(screen.getByText('界面密度')).toBeTruthy();

    fireEvent.click(screen.getByRole('menuitemradio', { name: '紧凑' }));
    expect(document.documentElement.getAttribute('data-pactor-size')).toBe('compact');
    expect(window.localStorage.getItem(globalSizeStorageKey)).toBe('compact');

    fireEvent.click(screen.getByRole('menuitemradio', { name: '宽松' }));
    expect(document.documentElement.getAttribute('data-pactor-size')).toBe('comfortable');

    fireEvent.click(screen.getByRole('menuitemradio', { name: '默认' }));
    expect(document.documentElement.hasAttribute('data-pactor-size')).toBe(false);
    expect(window.localStorage.getItem(globalSizeStorageKey)).toBe('default');
  });

  it('受控 size：选择经 onSizeChange 上报并应用属性，但不写 localStorage', () => {
    const onSizeChange = vi.fn();
    renderMenu({ size: 'comfortable', onSizeChange });
    fireEvent.click(screen.getByRole('menuitemradio', { name: '紧凑' }));
    expect(onSizeChange).toHaveBeenCalledWith('compact');
    expect(document.documentElement.getAttribute('data-pactor-size')).toBe('compact');
    expect(window.localStorage.getItem(globalSizeStorageKey)).toBeNull();
  });

  it('非受控挂载时应用持久化偏好（刷新后密度保持）', () => {
    window.localStorage.setItem(globalSizeStorageKey, 'compact');
    render(<UiUserMenu user={USER} showSize />);
    expect(document.documentElement.getAttribute('data-pactor-size')).toBe('compact');
  });

  it('无持久化偏好时挂载不动 documentElement（不重置宿主已设密度）', () => {
    document.documentElement.setAttribute('data-pactor-size', 'comfortable');
    render(<UiUserMenu user={USER} showSize />);
    expect(document.documentElement.getAttribute('data-pactor-size')).toBe('comfortable');
  });

  it('DSL：showSize 透传；选择经 events.onSizeChange 传出密度值', async () => {
    const { context } = renderDsl({
      type: 'UserMenu',
      props: { user: USER, showSize: true },
      events: {
        onSizeChange: { action: 'setState', params: { density: '${event}' } },
      },
    });

    fireEvent.click(screen.getByRole('button', { name: /账户菜单/ }));
    fireEvent.click(screen.getByRole('menuitemradio', { name: '紧凑' }));

    await expectEventState(context, 'density', 'compact');
    expect(document.documentElement.getAttribute('data-pactor-size')).toBe('compact');
  });
});
