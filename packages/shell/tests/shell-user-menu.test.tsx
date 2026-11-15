// @vitest-environment jsdom
import { act, cleanup, render } from '@testing-library/react';
import type { ReactNode } from 'react';

import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const captured = vi.hoisted(() => ({ props: null as Record<string, unknown> | null }));

vi.mock('@pactor-app/ui/components', () => ({
  UserMenu: (props: Record<string, unknown>) => {
    captured.props = props;
    return null;
  },
}));

import {
  ShellUserMenu,
  ShellUserMenuConfigContext,
  type ShellUserMenuConfig,
} from '../src/client/ShellUserMenu.js';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const user = { name: '测试用户', email: 'tester' };

function renderWithConfig(config: ShellUserMenuConfig | null, node?: ReactNode) {
  const inner = node ?? <ShellUserMenu user={user} />;
  return render(
    <ShellUserMenuConfigContext.Provider value={config}>
      {inner}
    </ShellUserMenuConfigContext.Provider>,
  );
}

afterEach(cleanup);

beforeAll(() => {
  // jsdom 无 matchMedia，补最小实现
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
});

beforeEach(() => {
  captured.props = null;
  localStorage.clear();
  document.documentElement.removeAttribute('data-pactor-theme');
});

describe('ShellUserMenu', () => {
  it('无配置时在线状态 / 主题 / 密度 / 语言缺省全开', () => {
    renderWithConfig(null);
    const props = captured.props!;
    // 在线状态由包装层自持（初始 available），onStatusChange 启用菜单内切换
    expect(props.status).toBe('available');
    expect(props.onStatusChange).toBeTypeOf('function');
    expect(props.showTheme).toBe(true);
    expect(props.showSize).toBe(true);
    expect(props.showLanguage).toBe(true);
    // 主题受控于外壳外观模式（无持久化时为 system）
    expect(props.theme).toBe('system');
    expect(props.onThemeChange).toBeTypeOf('function');
  });

  it('在线状态切换经包装层回显并上报 DSL 回调', () => {
    const onStatusChange = vi.fn();
    renderWithConfig(null, <ShellUserMenu user={user} onStatusChange={onStatusChange} />);
    act(() => (captured.props!.onStatusChange as (s: string) => void)('busy'));
    expect(onStatusChange).toHaveBeenCalledWith('busy');
    expect(captured.props!.status).toBe('busy');
  });

  it('context 配置可关闭各项并透传语言 / 密度选项', () => {
    const languages = [{ value: 'en-US', label: 'English' }];
    renderWithConfig({ showStatus: false, showSize: false, showLanguage: false, languages });
    const props = captured.props!;
    expect(props.status).toBeUndefined();
    expect(props.onStatusChange).toBeUndefined();
    expect(props.showSize).toBe(false);
    expect(props.showLanguage).toBe(false);
    expect(props.languages).toBe(languages);
  });

  it('DSL 显式 props 优先于 context 配置', () => {
    renderWithConfig(
      { showSize: false },
      <ShellUserMenu user={user} showSize={true} showTheme={false} />,
    );
    const props = captured.props!;
    expect(props.showSize).toBe(true);
    expect(props.showTheme).toBe(false);
    // showTheme 关闭时不接管主题受控
    expect(props.theme).toBeUndefined();
  });

  it('主题选择同步外壳外观模式：持久化 pactor.mode 并按外壳契约写属性', () => {
    renderWithConfig(null);
    const onThemeChange = captured.props!.onThemeChange as (t: string) => void;

    act(() => onThemeChange('dark'));
    expect(localStorage.getItem('pactor.mode')).toBe('dark');
    expect(document.documentElement.getAttribute('data-pactor-theme')).toBe('dark');
    // 受控回显：pactor.mode 变化经偏好事件回读
    expect(captured.props!.theme).toBe('dark');

    act(() => onThemeChange('light'));
    expect(localStorage.getItem('pactor.mode')).toBe('light');
    expect(document.documentElement.getAttribute('data-pactor-theme')).toBeNull();
    expect(captured.props!.theme).toBe('light');
  });

  it('DSL 显式受控 theme 时不接管同步', () => {
    const onThemeChange = vi.fn();
    renderWithConfig(null, <ShellUserMenu user={user} theme="dark" onThemeChange={onThemeChange} />);
    const props = captured.props!;
    expect(props.theme).toBe('dark');
    act(() => (props.onThemeChange as (t: string) => void)('light'));
    expect(onThemeChange).toHaveBeenCalledWith('light');
    expect(localStorage.getItem('pactor.mode')).toBeNull();
  });
});
