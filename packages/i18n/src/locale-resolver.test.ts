import { describe, expect, it } from 'vitest';

import { I18nError } from './errors.js';
import {
  normalizeLocaleTag,
  parseAcceptLanguage,
  resolveRequestLocale,
  type LocaleResolverConfig,
} from './locale-resolver.js';

/** 设计 5.5 节基准配置：支持 zh-CN/en-US，默认 zh-CN，别名 en → en-US */
const baseConfig: LocaleResolverConfig = {
  supportedLocales: ['zh-CN', 'en-US'],
  defaultLocale: 'zh-CN',
  aliases: { en: 'en-US' },
};

describe('设计 5.5 解析示例表（逐行覆盖）', () => {
  it('行 1：URL ?locale=en-US + Cookie zh-CN + 系统 zh-CN → en-US（显式 URL 优先，两种策略一致）', () => {
    for (const defaultStrategy of ['system', 'application'] as const) {
      const result = resolveRequestLocale(
        { queryLocale: 'en-US', cookieLocale: 'zh-CN', acceptLanguage: 'zh-CN' },
        { ...baseConfig, defaultStrategy },
      );
      expect(result).toEqual({ locale: 'en-US', source: 'url-query', explicit: true });
    }
  });

  it('行 2：无 URL，Cookie locale=en-US，系统 zh-CN → en-US（用户偏好优先）', () => {
    for (const defaultStrategy of ['system', 'application'] as const) {
      const result = resolveRequestLocale(
        { cookieLocale: 'en-US', acceptLanguage: 'zh-CN' },
        { ...baseConfig, defaultStrategy },
      );
      expect(result).toEqual({ locale: 'en-US', source: 'cookie', explicit: true });
    }
  });

  it('行 3：账号语言 en-US 已写入 locale Cookie，无 URL → en-US，来源 cookie', () => {
    const result = resolveRequestLocale({ cookieLocale: 'en-US' }, baseConfig);
    expect(result).toEqual({ locale: 'en-US', source: 'cookie', explicit: true });
  });

  it('行 4：无显式语言，Accept-Language: en;q=0.9,zh-CN;q=0.8（system）→ en-US（别名匹配）', () => {
    const result = resolveRequestLocale(
      { acceptLanguage: 'en;q=0.9,zh-CN;q=0.8' },
      { ...baseConfig, defaultStrategy: 'system' },
    );
    expect(result).toEqual({ locale: 'en-US', source: 'accept-language', explicit: false });
  });

  it('行 5：无显式语言，系统偏好 en-US（application）→ zh-CN（直接应用默认）', () => {
    const result = resolveRequestLocale(
      { acceptLanguage: 'en-US' },
      { ...baseConfig, defaultStrategy: 'application' },
    );
    expect(result).toEqual({ locale: 'zh-CN', source: 'application-default', explicit: false });
  });

  it('行 6：无显式语言，系统偏好仅 fr-FR（system）→ zh-CN（支持列表未命中）', () => {
    const result = resolveRequestLocale(
      { acceptLanguage: 'fr-FR' },
      { ...baseConfig, defaultStrategy: 'system' },
    );
    expect(result).toEqual({ locale: 'zh-CN', source: 'application-default', explicit: false });
  });

  it('行 7：显式 ?locale=fr-FR → UNSUPPORTED_LOCALE（两种策略一致）', () => {
    for (const defaultStrategy of ['system', 'application'] as const) {
      try {
        resolveRequestLocale({ queryLocale: 'fr-FR' }, { ...baseConfig, defaultStrategy });
        expect.unreachable();
      } catch (error) {
        expect(error).toBeInstanceOf(I18nError);
        expect((error as I18nError).code).toBe('UNSUPPORTED_LOCALE');
      }
    }
  });

  it('行 8：旧 Cookie fr-FR 失效，系统 en-US（system）→ 忽略 Cookie，采用 en-US', () => {
    const result = resolveRequestLocale(
      { cookieLocale: 'fr-FR', acceptLanguage: 'en-US' },
      { ...baseConfig, defaultStrategy: 'system' },
    );
    expect(result).toEqual({ locale: 'en-US', source: 'accept-language', explicit: false });
  });

  it('行 9：路径 /en-US/users + 查询 ?locale=zh-CN → LOCALE_CONFLICT（两种策略一致）', () => {
    for (const defaultStrategy of ['system', 'application'] as const) {
      try {
        resolveRequestLocale(
          { pathLocale: 'en-US', queryLocale: 'zh-CN' },
          { ...baseConfig, defaultStrategy },
        );
        expect.unreachable();
      } catch (error) {
        expect(error).toBeInstanceOf(I18nError);
        expect((error as I18nError).code).toBe('LOCALE_CONFLICT');
      }
    }
  });
});

describe('URL 显式语言', () => {
  it('仅路径语言 → source url-path', () => {
    const result = resolveRequestLocale({ pathLocale: 'en-US' }, baseConfig);
    expect(result).toEqual({ locale: 'en-US', source: 'url-path', explicit: true });
  });

  it('路径与查询规范化后一致 → 不冲突，url-path 优先', () => {
    const result = resolveRequestLocale(
      { pathLocale: 'en-us', queryLocale: 'en-US' },
      baseConfig,
    );
    expect(result).toEqual({ locale: 'en-US', source: 'url-path', explicit: true });
  });

  it('路径与查询经别名解析后一致 → 不冲突', () => {
    const result = resolveRequestLocale({ pathLocale: 'en', queryLocale: 'en-US' }, baseConfig);
    expect(result).toEqual({ locale: 'en-US', source: 'url-path', explicit: true });
  });

  it('查询语言使用别名 ?locale=en → en-US', () => {
    const result = resolveRequestLocale({ queryLocale: 'en' }, baseConfig);
    expect(result).toEqual({ locale: 'en-US', source: 'url-query', explicit: true });
  });

  it('显式值格式非法 → INVALID_LOCALE', () => {
    expect(() => resolveRequestLocale({ queryLocale: '!!' }, baseConfig)).toThrowError(
      expect.objectContaining({ code: 'INVALID_LOCALE' }),
    );
  });

  it('显式空值 → INVALID_LOCALE', () => {
    expect(() => resolveRequestLocale({ queryLocale: '' }, baseConfig)).toThrowError(
      expect.objectContaining({ code: 'INVALID_LOCALE' }),
    );
  });

  it('路径语言非法时即使查询合法也报 INVALID_LOCALE', () => {
    expect(() =>
      resolveRequestLocale({ pathLocale: 'x1', queryLocale: 'en-US' }, baseConfig),
    ).toThrowError(expect.objectContaining({ code: 'INVALID_LOCALE' }));
  });

  it('重复 locale 查询参数 → DUPLICATE_LOCALE_PARAM', () => {
    expect(() =>
      resolveRequestLocale({ queryLocale: ['en-US', 'zh-CN'] }, baseConfig),
    ).toThrowError(expect.objectContaining({ code: 'DUPLICATE_LOCALE_PARAM' }));
  });

  it('重复参数即使值相同也报错', () => {
    expect(() =>
      resolveRequestLocale({ queryLocale: ['en-US', 'en-US'] }, baseConfig),
    ).toThrowError(expect.objectContaining({ code: 'DUPLICATE_LOCALE_PARAM' }));
  });

  it('单元素数组等价于字符串', () => {
    const result = resolveRequestLocale({ queryLocale: ['en-US'] }, baseConfig);
    expect(result).toEqual({ locale: 'en-US', source: 'url-query', explicit: true });
  });

  it('显式语言不做语言级回退（fallbackLocales 不影响显式解析）', () => {
    const config: LocaleResolverConfig = {
      ...baseConfig,
      fallbackLocales: { 'fr-CA': ['en-US'] },
    };
    expect(() => resolveRequestLocale({ queryLocale: 'fr-CA' }, config)).toThrowError(
      expect.objectContaining({ code: 'UNSUPPORTED_LOCALE' }),
    );
  });
});

describe('Cookie 偏好', () => {
  it('Cookie 使用别名值 → 解析为支持语言', () => {
    const result = resolveRequestLocale({ cookieLocale: 'en' }, baseConfig);
    expect(result).toEqual({ locale: 'en-US', source: 'cookie', explicit: true });
  });

  it('Cookie 格式非法 → 忽略并继续解析链', () => {
    const result = resolveRequestLocale(
      { cookieLocale: 'not a locale', acceptLanguage: 'en-US' },
      baseConfig,
    );
    expect(result).toEqual({ locale: 'en-US', source: 'accept-language', explicit: false });
  });

  it('Cookie 不支持且协商未命中 → 应用默认', () => {
    const result = resolveRequestLocale({ cookieLocale: 'fr-FR' }, baseConfig);
    expect(result).toEqual({ locale: 'zh-CN', source: 'application-default', explicit: false });
  });

  it('Cookie 不覆盖 URL 显式语言', () => {
    const result = resolveRequestLocale(
      { queryLocale: 'zh-CN', cookieLocale: 'en-US' },
      baseConfig,
    );
    expect(result).toEqual({ locale: 'zh-CN', source: 'url-query', explicit: true });
  });
});

describe('Accept-Language 协商', () => {
  it('按 q 权重排序，高权重优先（与出现顺序无关）', () => {
    const result = resolveRequestLocale(
      { acceptLanguage: 'zh-CN;q=0.8,en;q=0.9' },
      baseConfig,
    );
    expect(result).toEqual({ locale: 'en-US', source: 'accept-language', explicit: false });
  });

  it('同权重按出现顺序', () => {
    const result = resolveRequestLocale({ acceptLanguage: 'en-US, zh-CN' }, baseConfig);
    expect(result.locale).toBe('en-US');
    const reversed = resolveRequestLocale({ acceptLanguage: 'zh-CN, en-US' }, baseConfig);
    expect(reversed.locale).toBe('zh-CN');
  });

  it('忽略 q=0 的条目', () => {
    const result = resolveRequestLocale(
      { acceptLanguage: 'en-US;q=0,zh-CN;q=0.5' },
      baseConfig,
    );
    expect(result).toEqual({ locale: 'zh-CN', source: 'accept-language', explicit: false });
  });

  it('忽略非法条目与无效权重', () => {
    const result = resolveRequestLocale(
      { acceptLanguage: '!!!;q=0.9,en-US;q=2,zh-CN;q=0.4' },
      baseConfig,
    );
    expect(result).toEqual({ locale: 'zh-CN', source: 'accept-language', explicit: false });
  });

  it('* 映射应用默认语言', () => {
    const result = resolveRequestLocale({ acceptLanguage: 'fr-FR,*;q=0.5' }, baseConfig);
    expect(result).toEqual({ locale: 'zh-CN', source: 'accept-language', explicit: false });
  });

  it('语言级回退使用 fallbackLocales（fr-CA → fr）', () => {
    const config: LocaleResolverConfig = {
      supportedLocales: ['fr', 'zh-CN'],
      defaultLocale: 'zh-CN',
      fallbackLocales: { 'fr-CA': ['fr'] },
    };
    const result = resolveRequestLocale({ acceptLanguage: 'fr-CA' }, config);
    expect(result).toEqual({ locale: 'fr', source: 'accept-language', explicit: false });
  });

  it('无 fallbackLocales 配置时 fr-CA 不自动降级为 fr', () => {
    const config: LocaleResolverConfig = {
      supportedLocales: ['fr', 'zh-CN'],
      defaultLocale: 'zh-CN',
    };
    const result = resolveRequestLocale({ acceptLanguage: 'fr-CA' }, config);
    expect(result).toEqual({ locale: 'zh-CN', source: 'application-default', explicit: false });
  });

  it('header 缺失或全无效时回退应用默认', () => {
    expect(resolveRequestLocale({}, baseConfig)).toEqual({
      locale: 'zh-CN',
      source: 'application-default',
      explicit: false,
    });
    expect(resolveRequestLocale({ acceptLanguage: '   ' }, baseConfig)).toEqual({
      locale: 'zh-CN',
      source: 'application-default',
      explicit: false,
    });
  });
});

describe('配置校验', () => {
  it('supportedLocales 为空 → INVALID_LOCALE_CONFIG', () => {
    expect(() =>
      resolveRequestLocale({}, { supportedLocales: [], defaultLocale: 'zh-CN' }),
    ).toThrowError(expect.objectContaining({ code: 'INVALID_LOCALE_CONFIG' }));
  });

  it('defaultLocale 不在支持列表 → INVALID_LOCALE_CONFIG', () => {
    expect(() =>
      resolveRequestLocale({}, { supportedLocales: ['en-US'], defaultLocale: 'zh-CN' }),
    ).toThrowError(expect.objectContaining({ code: 'INVALID_LOCALE_CONFIG' }));
  });

  it('支持列表条目非法 → INVALID_LOCALE_CONFIG', () => {
    expect(() =>
      resolveRequestLocale({}, { supportedLocales: ['zh-CN', '!!'], defaultLocale: 'zh-CN' }),
    ).toThrowError(expect.objectContaining({ code: 'INVALID_LOCALE_CONFIG' }));
  });

  it('别名与已支持语言冲突 → INVALID_LOCALE_CONFIG', () => {
    expect(() =>
      resolveRequestLocale(
        {},
        { supportedLocales: ['zh-CN', 'en-US'], defaultLocale: 'zh-CN', aliases: { 'en-US': 'zh-CN' } },
      ),
    ).toThrowError(expect.objectContaining({ code: 'INVALID_LOCALE_CONFIG' }));
  });

  it('别名目标无法解析到支持语言 → INVALID_LOCALE_CONFIG', () => {
    expect(() =>
      resolveRequestLocale(
        {},
        { supportedLocales: ['zh-CN'], defaultLocale: 'zh-CN', aliases: { en: 'en-US' } },
      ),
    ).toThrowError(expect.objectContaining({ code: 'INVALID_LOCALE_CONFIG' }));
  });

  it('别名环 → INVALID_LOCALE_CONFIG', () => {
    expect(() =>
      resolveRequestLocale(
        {},
        {
          supportedLocales: ['zh-CN', 'en-US'],
          defaultLocale: 'zh-CN',
          aliases: { en: 'english', english: 'en' },
        },
      ),
    ).toThrowError(expect.objectContaining({ code: 'INVALID_LOCALE_CONFIG' }));
  });

  it('非法 defaultStrategy → INVALID_LOCALE_CONFIG', () => {
    expect(() =>
      resolveRequestLocale(
        {},
        { ...baseConfig, defaultStrategy: 'browser' as 'system' },
      ),
    ).toThrowError(expect.objectContaining({ code: 'INVALID_LOCALE_CONFIG' }));
  });

  it('配置值大小写/下划线规范化后可用', () => {
    const result = resolveRequestLocale(
      { queryLocale: 'en_us' },
      { supportedLocales: ['ZH-cn', 'en-US'], defaultLocale: 'zh-CN' },
    );
    expect(result).toEqual({ locale: 'en-US', source: 'url-query', explicit: true });
  });
});

describe('normalizeLocaleTag', () => {
  it('规范化大小写与分隔符', () => {
    expect(normalizeLocaleTag('en_us')).toBe('en-US');
    expect(normalizeLocaleTag('ZH-cn')).toBe('zh-CN');
    expect(normalizeLocaleTag('zh-hant-tw')).toBe('zh-Hant-TW');
  });

  it('非法格式返回 undefined', () => {
    expect(normalizeLocaleTag('')).toBeUndefined();
    expect(normalizeLocaleTag('e')).toBeUndefined();
    expect(normalizeLocaleTag('en-US-x')).toBeUndefined();
    expect(normalizeLocaleTag('123')).toBeUndefined();
  });
});

describe('parseAcceptLanguage', () => {
  it('解析 tag 与 q，按 q 降序、同权重保序', () => {
    expect(parseAcceptLanguage('zh-CN;q=0.8,en;q=0.9,fr-FR;q=0.8')).toEqual([
      { tag: 'en', q: 0.9 },
      { tag: 'zh-CN', q: 0.8 },
      { tag: 'fr-FR', q: 0.8 },
    ]);
  });

  it('缺省 q 为 1；忽略 q=0、非法 tag 与无效 q', () => {
    expect(parseAcceptLanguage('en-US, fr-FR;q=0, !!;q=0.7, zh-CN;q=abc, *;q=0.1')).toEqual([
      { tag: 'en-US', q: 1 },
      { tag: '*', q: 0.1 },
    ]);
  });
});
