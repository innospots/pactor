import { describe, expect, it } from 'vitest';

import themesJson from '../themes.json';
import {
  DEFAULT_THEME,
  THEMES,
  THEME_NAMES,
  getTheme,
  isThemeName,
  resolveTheme,
  themeText,
} from '../src/index.js';
import { THEME_LOADERS } from '../src/loaders.js';

describe('theme registry', () => {
  it('keeps the themes.json order', () => {
    expect(THEME_NAMES).toEqual(themesJson.themes.map((theme) => theme.name));
  });

  it('exposes 14 unique built-in themes', () => {
    expect(THEME_NAMES).toHaveLength(14);
    expect(new Set(THEME_NAMES).size).toBe(THEME_NAMES.length);
    expect(THEMES).toHaveLength(THEME_NAMES.length);
  });

  it('has a valid default theme present in the manifest', () => {
    expect(THEME_NAMES).toContain(DEFAULT_THEME);
    expect(themesJson.default).toBe(DEFAULT_THEME);
  });

  it('has a loader for every registered theme', () => {
    for (const name of THEME_NAMES) {
      expect(typeof THEME_LOADERS[name]).toBe('function');
    }
    expect(Object.keys(THEME_LOADERS)).toHaveLength(THEME_NAMES.length);
  });

  it('recognizes only registered names', () => {
    expect(isThemeName('zhu-cao')).toBe(true);
    expect(isThemeName('nope')).toBe(false);
    expect(isThemeName(null)).toBe(false);
    expect(isThemeName(42)).toBe(false);
  });

  it('resolves unknown values to the default theme', () => {
    expect(resolveTheme('zhu-cao')).toBe('zhu-cao');
    expect(resolveTheme('nope')).toBe(DEFAULT_THEME);
    expect(resolveTheme(null)).toBe(DEFAULT_THEME);
    expect(resolveTheme(undefined)).toBe(DEFAULT_THEME);
  });

  it('looks up definitions by name', () => {
    expect(getTheme('zhu-cao')?.label).toBe('朱草绛红');
    expect(getTheme('nope')).toBeUndefined();
  });

  it('localizes labels, families and sources', () => {
    const theme = getTheme('zhu-cao');
    expect(theme).toBeDefined();
    expect(themeText(theme!, 'zh-CN')).toEqual({
      label: '朱草绛红',
      family: '红色系',
      source: '朱草',
    });
    expect(themeText(theme!, 'en-US')).toEqual({
      label: 'Vermilion Red',
      family: 'Red',
      source: 'Zhu Cao',
    });
  });
});
