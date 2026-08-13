import { describe, expect, it } from 'vitest';

import { createI18nContext } from './i18n.js';

describe('createI18nContext', () => {
  it('returns default locale and defaultLocale when no options provided', () => {
    const i18n = createI18nContext();
    expect(i18n.locale).toBe('zh-CN');
    expect(i18n.defaultLocale).toBe('zh-CN');
  });

  it('uses provided locale and defaultLocale', () => {
    const i18n = createI18nContext({ locale: 'en-US', defaultLocale: 'zh-CN' });
    expect(i18n.locale).toBe('en-US');
    expect(i18n.defaultLocale).toBe('zh-CN');
  });

  describe('t()', () => {
    it('translates flat keys', () => {
      const i18n = createI18nContext({
        messages: { 'menu.home': '首页' },
      });
      expect(i18n.t('menu.home')).toBe('首页');
    });

    it('translates locale-scoped keys', () => {
      const i18n = createI18nContext({
        locale: 'en-US',
        messages: {
          'zh-CN': { 'menu.home': '首页' },
          'en-US': { 'menu.home': 'Home' },
        },
      });
      expect(i18n.t('menu.home')).toBe('Home');
    });

    it('falls back to defaultLocale when current locale missing key', () => {
      const i18n = createI18nContext({
        locale: 'fr-FR',
        defaultLocale: 'zh-CN',
        messages: {
          'zh-CN': { 'menu.home': '首页' },
          'en-US': { 'menu.home': 'Home' },
        },
      });
      expect(i18n.t('menu.home')).toBe('首页');
    });

    it('returns key itself when translation missing', () => {
      const i18n = createI18nContext({ messages: {} });
      expect(i18n.t('missing.key')).toBe('missing.key');
    });

    it('interpolates params', () => {
      const i18n = createI18nContext({
        messages: { welcome: 'Hello, {{name}}!' },
      });
      expect(i18n.t('welcome', { name: 'Alice' })).toBe('Hello, Alice!');
    });

    it('replaces missing params with empty string', () => {
      const i18n = createI18nContext({
        messages: { welcome: 'Hello, {{name}}!' },
      });
      expect(i18n.t('welcome')).toBe('Hello, {{name}}!');
      expect(i18n.t('welcome', {})).toBe('Hello, !');
    });

    it('handles non-string values in params', () => {
      const i18n = createI18nContext({
        messages: { count: '共 {{count}} 条' },
      });
      expect(i18n.t('count', { count: 42 })).toBe('共 42 条');
    });
  });
});
