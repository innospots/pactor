import { describe, expect, it } from 'vitest';

import {
  createI18nContext,
  isI18nDescriptor,
  isLocalizedText,
  lookupI18nMessage,
} from './i18n.js';

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

    it('treats empty string translation as a hit', () => {
      const i18n = createI18nContext({
        locale: 'en-US',
        defaultLocale: 'zh-CN',
        messages: {
          'zh-CN': { 'menu.empty': '占位' },
          'en-US': { 'menu.empty': '' },
        },
      });
      expect(i18n.t('menu.empty')).toBe('');
    });
  });
});

describe('lookupI18nMessage', () => {
  const messages = {
    'zh-CN': { 'menu.home': '首页' },
    'en-US': { 'menu.home': 'Home' },
    'flat.key': '扁平文案',
  };

  it('hits the current locale group first', () => {
    expect(lookupI18nMessage(messages, 'en-US', 'zh-CN', 'menu.home')).toEqual({
      found: true,
      value: 'Home',
      resolvedLocale: 'en-US',
    });
  });

  it('hits the flat key when locale groups miss', () => {
    expect(lookupI18nMessage(messages, 'en-US', 'zh-CN', 'flat.key')).toEqual({
      found: true,
      value: '扁平文案',
      resolvedLocale: undefined,
    });
  });

  it('falls back to the defaultLocale group', () => {
    expect(lookupI18nMessage(messages, 'fr-FR', 'zh-CN', 'menu.home')).toEqual({
      found: true,
      value: '首页',
      resolvedLocale: 'zh-CN',
    });
  });

  it('reports found=false when nothing matches', () => {
    expect(lookupI18nMessage(messages, 'fr-FR', 'zh-CN', 'missing.key')).toEqual({
      found: false,
      value: 'missing.key',
      resolvedLocale: undefined,
    });
  });

  it('treats an empty string translation as found', () => {
    const result = lookupI18nMessage(
      { 'en-US': { 'menu.empty': '' } },
      'en-US',
      'zh-CN',
      'menu.empty',
    );
    expect(result.found).toBe(true);
    expect(result.value).toBe('');
  });

  it('treats a translation equal to the key as found', () => {
    const result = lookupI18nMessage(
      { 'zh-CN': { ok: 'ok' } },
      'en-US',
      'zh-CN',
      'ok',
    );
    expect(result.found).toBe(true);
    expect(result.value).toBe('ok');
    expect(result.resolvedLocale).toBe('zh-CN');
  });
});

describe('isI18nDescriptor', () => {
  it('accepts a key-based descriptor', () => {
    expect(
      isI18nDescriptor({ $i18n: { key: 'menu.home', params: { n: 1 }, fallback: '首页' } }),
    ).toBe(true);
  });

  it('accepts an inline-messages descriptor', () => {
    expect(
      isI18nDescriptor({ $i18n: { messages: { 'zh-CN': '首页', 'en-US': 'Home' } } }),
    ).toBe(true);
  });

  it('rejects non-descriptor values', () => {
    expect(isI18nDescriptor(undefined)).toBe(false);
    expect(isI18nDescriptor(null)).toBe(false);
    expect(isI18nDescriptor('menu.home')).toBe(false);
    expect(isI18nDescriptor({})).toBe(false);
    expect(isI18nDescriptor({ $i18n: 'menu.home' })).toBe(false);
    expect(isI18nDescriptor({ $i18n: {} })).toBe(false);
    expect(isI18nDescriptor({ $i18n: { key: 42 } })).toBe(false);
    expect(isI18nDescriptor({ $i18n: { messages: { 'zh-CN': 1 } } })).toBe(false);
  });
});

describe('isLocalizedText', () => {
  it('accepts a localized text object', () => {
    expect(
      isLocalizedText({ $localizedText: { template: 'Hello, {{name}}!', params: { name: 'A' } } }),
    ).toBe(true);
    expect(isLocalizedText({ $localizedText: { template: '纯文本' } })).toBe(true);
  });

  it('rejects non-localized values', () => {
    expect(isLocalizedText(undefined)).toBe(false);
    expect(isLocalizedText(null)).toBe(false);
    expect(isLocalizedText('文本')).toBe(false);
    expect(isLocalizedText({})).toBe(false);
    expect(isLocalizedText({ $localizedText: '文本' })).toBe(false);
    expect(isLocalizedText({ $localizedText: {} })).toBe(false);
    expect(isLocalizedText({ $localizedText: { template: 1 } })).toBe(false);
  });
});
