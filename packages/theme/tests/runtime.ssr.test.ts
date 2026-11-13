// @vitest-environment node
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';

import {
  DEFAULT_THEME,
  THEME_ATTR,
  THEME_EVENT,
  THEME_STYLE_ATTR,
  applyCustomTheme,
  applyTheme,
  readAppliedTheme,
  readStoredTheme,
  subscribeTheme,
} from '../src/index.js';

describe('SSR safety', () => {
  it('has no DOM globals in this environment', () => {
    expect(typeof document).toBe('undefined');
    expect(typeof window).toBe('undefined');
  });

  it('resolves applyTheme without touching the DOM', async () => {
    await expect(applyTheme('zhu-cao')).resolves.toBe('zhu-cao');
    await expect(applyTheme('not-a-theme')).resolves.toBe(DEFAULT_THEME);
  });

  it('returns the requested name from applyCustomTheme', () => {
    expect(applyCustomTheme('brand-x', '.brand-x{}')).toBe('brand-x');
  });

  it('reads no applied or stored theme', () => {
    expect(readAppliedTheme()).toBeNull();
    expect(readStoredTheme()).toBeNull();
  });

  it('returns a no-op unsubscribe function', () => {
    const off = subscribeTheme(() => {
      throw new Error('listener must not run');
    });
    expect(typeof off).toBe('function');
    expect(() => off()).not.toThrow();
  });

  it('can drive an injected document without global DOM globals', async () => {
    const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>');
    const seen: string[] = [];
    dom.window.addEventListener(THEME_EVENT, (event) => {
      seen.push((event as CustomEvent<{ theme: string }>).detail.theme);
    });

    const applied = await applyTheme('zhu-cao', {
      document: dom.window.document,
      storage: null,
      loaders: { 'zhu-cao': async () => '.injected{}' },
    });

    expect(applied).toBe('zhu-cao');
    expect(
      dom.window.document.documentElement.getAttribute(THEME_ATTR),
    ).toBe('zhu-cao');
    expect(
      dom.window.document.querySelector(`style[${THEME_STYLE_ATTR}]`)
        ?.textContent,
    ).toBe('.injected{}');
    expect(seen).toEqual(['zhu-cao']);
    expect(typeof document).toBe('undefined');
  });
});
