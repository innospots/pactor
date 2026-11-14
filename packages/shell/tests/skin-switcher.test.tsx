// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const applyThemeMock = vi.hoisted(() =>
  vi.fn<(name: string, options?: { storageKey?: string; persist?: boolean }) => Promise<string>>(
    async (name) => name as never,
  ),
);

vi.mock('@pactor-app/theme', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@pactor-app/theme')>();
  return { ...actual, applyTheme: applyThemeMock };
});

import { SkinSwitcher } from '../src/client/SkinSwitcher.js';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

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
  localStorage.clear();
  applyThemeMock.mockClear();
  document.documentElement.removeAttribute('data-pactor-skin');
  document.documentElement.removeAttribute('data-requested-skin');
  document.documentElement.removeAttribute('data-pactor-theme');
  document.head.innerHTML = '';
});

describe('SkinSwitcher', () => {
  it('无持久化且无 defaultSkin 时触发按钮显示「默认皮肤」', () => {
    render(<SkinSwitcher allowDefault />);
    expect(screen.getByRole('button', { name: /默认皮肤/ })).toBeTruthy();
  });

  it('选择皮肤：写 localStorage、调 applyTheme（persist:false）、上报 onChange', async () => {
    const onChange = vi.fn();
    render(<SkinSwitcher skins={['qing-hui', 'qing-ming']} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /皮肤/ }));
    fireEvent.click(screen.getByRole('button', { name: /青灰冷调/ }));

    expect(localStorage.getItem('pactor.theme')).toBe('qing-hui');
    expect(onChange).toHaveBeenCalledWith('qing-hui');
    await waitFor(() =>
      expect(applyThemeMock).toHaveBeenCalledWith(
        'qing-hui',
        expect.objectContaining({ persist: false }),
      ),
    );
  });

  it('点「默认皮肤」卡片清除覆盖并上报 null', async () => {
    localStorage.setItem('pactor.theme', 'qing-hui');
    const onChange = vi.fn();
    render(<SkinSwitcher skins={['qing-hui']} allowDefault onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /皮肤/ }));
    fireEvent.click(screen.getByRole('button', { name: /^默认皮肤$/ }));

    await waitFor(() => expect(localStorage.getItem('pactor.theme')).toBeNull());
    expect(onChange).toHaveBeenCalledWith(null);
    expect(document.documentElement.getAttribute('data-pactor-skin')).toBeNull();
  });

  it('外观模式段控：选深色写存储并置 data-pactor-theme', async () => {
    render(<SkinSwitcher skins={['qing-hui']} />);
    fireEvent.click(screen.getByRole('button', { name: /皮肤/ }));
    fireEvent.click(screen.getByRole('button', { name: '深色' }));

    await waitFor(() => expect(localStorage.getItem('pactor.mode')).toBe('dark'));
    await waitFor(() =>
      expect(document.documentElement.getAttribute('data-pactor-theme')).toBe('dark'),
    );
  });
});
