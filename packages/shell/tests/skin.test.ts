// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

const applyThemeMock = vi.hoisted(() =>
  vi.fn<(name: string, options?: { storageKey?: string; persist?: boolean }) => Promise<string>>(
    async (name) => name as never,
  ),
);

vi.mock('@pactor-app/theme', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@pactor-app/theme')>();
  return { ...actual, applyTheme: applyThemeMock };
});

import {
  applyShellMode,
  applyShellSkin,
  clearShellSkin,
  readShellMode,
  readStoredShellSkin,
  resolveShellSkin,
  selectShellMode,
  selectShellSkin,
  SHELL_MODE_STORAGE_KEY,
  SHELL_PREFERENCES_EVENT,
  SHELL_SKIN_STORAGE_KEY,
} from '../src/client/skin.js';

beforeEach(() => {
  localStorage.clear();
  applyThemeMock.mockClear();
  document.documentElement.removeAttribute('data-pactor-skin');
  document.documentElement.removeAttribute('data-requested-skin');
  document.documentElement.removeAttribute('data-pactor-theme');
  document.head.innerHTML = '';
});

describe('resolveShellSkin / readStoredShellSkin', () => {
  it('合法皮肤名原样返回；非法值回退 defaultSkin 或 null', () => {
    expect(resolveShellSkin('qing-hui')).toBe('qing-hui');
    expect(resolveShellSkin('nope', 'qing-ming')).toBe('qing-ming');
    expect(resolveShellSkin(null)).toBeNull();
  });

  it('readStoredShellSkin 读 localStorage，缺省键 pactor.theme', () => {
    localStorage.setItem(SHELL_SKIN_STORAGE_KEY, 'tian-shui');
    expect(readStoredShellSkin()).toBe('tian-shui');
  });
});

describe('selectShellSkin / clearShellSkin', () => {
  it('selectShellSkin 写存储并派发偏好事件', () => {
    const seen: string[] = [];
    window.addEventListener(SHELL_PREFERENCES_EVENT, () => seen.push('x'));
    selectShellSkin('qing-hui');
    expect(localStorage.getItem(SHELL_SKIN_STORAGE_KEY)).toBe('qing-hui');
    expect(seen).toHaveLength(1);
  });

  it('clearShellSkin 清除存储、注入 style、首屏 link 与 html 属性', () => {
    localStorage.setItem(SHELL_SKIN_STORAGE_KEY, 'qing-hui');
    const style = document.createElement('style');
    style.setAttribute('data-pactor-theme-style', 'qing-hui');
    document.head.appendChild(style);
    const link = document.createElement('link');
    link.setAttribute('data-pactor-skin', 'qing-hui');
    document.head.appendChild(link);
    document.documentElement.setAttribute('data-pactor-skin', 'qing-hui');
    document.documentElement.setAttribute('data-requested-skin', 'qing-hui');

    clearShellSkin();

    expect(localStorage.getItem(SHELL_SKIN_STORAGE_KEY)).toBeNull();
    expect(document.querySelector('style[data-pactor-theme-style]')).toBeNull();
    expect(document.querySelector('link[data-pactor-skin]')).toBeNull();
    expect(document.documentElement.getAttribute('data-pactor-skin')).toBeNull();
    expect(document.documentElement.getAttribute('data-requested-skin')).toBeNull();
  });
});

describe('applyShellSkin', () => {
  it('写 data-requested-skin，applyTheme 成功后移除首屏 link', async () => {
    const link = document.createElement('link');
    link.setAttribute('data-pactor-skin', 'qing-hui');
    document.head.appendChild(link);

    await applyShellSkin('qing-hui');

    expect(document.documentElement.getAttribute('data-requested-skin')).toBe('qing-hui');
    expect(applyThemeMock).toHaveBeenCalledWith(
      'qing-hui',
      expect.objectContaining({ persist: false, storageKey: SHELL_SKIN_STORAGE_KEY }),
    );
    expect(document.querySelector('link[data-pactor-skin]')).toBeNull();
  });

  it('applyTheme 失败时保留首屏 link', async () => {
    applyThemeMock.mockRejectedValueOnce(new Error('chunk fail'));
    const link = document.createElement('link');
    link.setAttribute('data-pactor-skin', 'qing-hui');
    document.head.appendChild(link);

    await applyShellSkin('qing-hui');

    expect(document.querySelector('link[data-pactor-skin]')).not.toBeNull();
  });
});

describe('mode', () => {
  it('readShellMode 非法值回退 system', () => {
    expect(readShellMode()).toBe('system');
    localStorage.setItem(SHELL_MODE_STORAGE_KEY, 'dark');
    expect(readShellMode()).toBe('dark');
    localStorage.setItem(SHELL_MODE_STORAGE_KEY, 'weird');
    expect(readShellMode()).toBe('system');
  });

  it('applyShellMode 按 mode 与系统偏好写/删 dark 属性', () => {
    applyShellMode('dark', false);
    expect(document.documentElement.getAttribute('data-pactor-theme')).toBe('dark');
    applyShellMode('light', true);
    expect(document.documentElement.getAttribute('data-pactor-theme')).toBeNull();
    applyShellMode('system', true);
    expect(document.documentElement.getAttribute('data-pactor-theme')).toBe('dark');
    applyShellMode('system', false);
    expect(document.documentElement.getAttribute('data-pactor-theme')).toBeNull();
  });

  it('selectShellMode 写存储并派发偏好事件', () => {
    let fired = 0;
    window.addEventListener(SHELL_PREFERENCES_EVENT, () => {
      fired += 1;
    });
    selectShellMode('dark');
    expect(localStorage.getItem(SHELL_MODE_STORAGE_KEY)).toBe('dark');
    expect(fired).toBe(1);
  });
});
