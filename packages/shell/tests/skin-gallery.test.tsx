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

import { SkinGallery } from '../src/client/SkinGallery.js';

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

describe('SkinGallery', () => {
  it('渲染页头、主题计数与皮肤卡片网格', () => {
    render(<SkinGallery skins={['qing-hui', 'qing-ming']} />);
    expect(screen.getByText('主题设置')).toBeTruthy();
    expect(screen.getByText('2 套主题')).toBeTruthy();
    expect(screen.getByRole('button', { name: /青灰冷调/ })).toBeTruthy();
  });

  it('点击皮肤卡片：写 localStorage、应用样式、上报 onChange，卡片进选中态', async () => {
    const onChange = vi.fn();
    render(<SkinGallery skins={['qing-hui', 'qing-ming']} onChange={onChange} />);
    const card = screen.getByRole('button', { name: /青灰冷调/ });
    fireEvent.click(card);

    expect(localStorage.getItem('pactor.theme')).toBe('qing-hui');
    expect(onChange).toHaveBeenCalledWith('qing-hui');
    expect(card.getAttribute('aria-pressed')).toBe('true');
    await waitFor(() =>
      expect(applyThemeMock).toHaveBeenCalledWith('qing-hui', {
        storageKey: 'pactor.theme',
        persist: false,
      }),
    );
  });

  it('allowDefault：首卡「默认皮肤」，点击清除持久化并回宿主基础皮肤', () => {
    localStorage.setItem('pactor.theme', 'qing-hui');
    const onChange = vi.fn();
    render(<SkinGallery allowDefault onChange={onChange} />);
    const card = screen.getByRole('button', { name: '默认皮肤' });
    fireEvent.click(card);

    expect(localStorage.getItem('pactor.theme')).toBeNull();
    expect(onChange).toHaveBeenCalledWith(null);
    expect(card.getAttribute('aria-pressed')).toBe('true');
  });

  it('外观模式：切换深色后 html 带 data-pactor-theme="dark"', () => {
    render(<SkinGallery />);
    fireEvent.click(screen.getByRole('button', { name: '深色' }));
    expect(localStorage.getItem('pactor.mode')).toBe('dark');
    expect(document.documentElement.getAttribute('data-pactor-theme')).toBe('dark');
  });

  it('defaultSkin：无持久化值时缺省皮肤进选中态', async () => {
    render(<SkinGallery defaultSkin="qing-ming" />);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /青冥/ }).getAttribute('aria-pressed')).toBe('true'),
    );
  });
});
