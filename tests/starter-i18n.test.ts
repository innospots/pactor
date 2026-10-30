import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createI18nContext } from '@pactor-app/core';
import { evaluateExpression } from '@pactor-app/expression';
import { validateAuthorPageDsl, validateLocalizedPageDsl } from '@pactor-app/schema';

import { withClientDemo } from '../starters/spa-starter/src/i18n/demo';
import { messages } from '../starters/spa-starter/src/i18n/messages';

const root = process.cwd();
let next: typeof import('../starters/next-app-starter/src/backend/pages/i18n');
let buildSitemap: typeof import('../starters/next-app-starter/src/backend/pages/sitemap').buildSitemap;
const examples = [
  {
    name: 'Next starter',
    dir: 'starters/next-app-starter',
    get api() {
      return next;
    },
  },
];
const requireFromStarter = createRequire(
  new URL('../starters/next-app-starter/package.json', import.meta.url),
);
const { parse } = requireFromStarter('yaml') as {
  parse: (source: string) => unknown;
};

beforeAll(async () => {
  process.chdir(resolve(root, 'starters/next-app-starter'));
  next = await import('../starters/next-app-starter/src/backend/pages/i18n');
  ({ buildSitemap } = await import('../starters/next-app-starter/src/backend/pages/sitemap'));
});

afterAll(() => process.chdir(root));

function pageFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? pageFiles(path) : entry.name.endsWith('.yaml') && entry.name !== 'sitemap.yaml' ? [path] : [];
  });
}

function collectI18nKeys(value: unknown, keys = new Set<string>()): Set<string> {
  if (typeof value === 'string') {
    for (const match of value.matchAll(/\$i18n\{([^:}]+):/g)) {
      keys.add(match[1].trim());
    }
    return keys;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectI18nKeys(item, keys);
    return keys;
  }
  if (value !== null && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const spec = record.$i18n;
    if (spec !== null && typeof spec === 'object' && typeof (spec as { key?: unknown }).key === 'string') {
      keys.add((spec as { key: string }).key);
    }
    for (const item of Object.values(record)) collectI18nKeys(item, keys);
  }
  return keys;
}

for (const example of examples) {
  describe(example.name, () => {
    it('resolves query, cookie and browser language and rejects invalid requests', () => {
      expect(example.api.requestLocale(new Request('http://example/api?locale=en-US'), 'zh-CN').locale).toBe('en-US');
      expect(example.api.requestLocale(new Request('http://example/api'), 'en-US').locale).toBe('en-US');
      expect(example.api.requestLocale(new Request('http://example/api', { headers: { 'accept-language': 'en-US,en;q=0.9' } })).locale).toBe('en-US');
      expect(() => example.api.requestLocale(new Request('http://example/api?locale=fr-FR'))).toThrow();
      expect(() => example.api.requestLocale(new Request('http://example/api?locale=en-US&locale=zh-CN'))).toThrow();
    });

    it('localizes sitemap, layout and inline pages without mutating the source', async () => {
      process.chdir(resolve(root, example.dir));
      const site = buildSitemap(null);
      const original = structuredClone(site);
      const en = await example.api.localizeSitemap(site, 'en-US');
      const zh = await example.api.localizeSitemap(site, 'zh-CN');
      expect(site).toEqual(original);
      expect(en.pages.find((page) => page.id === 'login')?.title).toBe('Sign in');
      expect(zh.pages.find((page) => page.id === 'login')?.title).toBe('登录');
      expect(JSON.stringify(en)).not.toContain('$i18n');
      expect(en.menus.find((menu) => menu.id === 'login')?.title).toBe('Sign in');
      expect((en as any).localization.locale).toBe('en-US');
    });

    it('converts every page to valid localized DSL in both languages', async () => {
      process.chdir(resolve(root, example.dir));
      const dir = resolve(root, example.dir, 'src/backend/pages/yaml');
      for (const file of pageFiles(dir)) {
        const page = parse(readFileSync(file, 'utf8'));
        expect(validateAuthorPageDsl(page), file).toMatchObject({ valid: true });
        for (const locale of ['zh-CN', 'en-US']) {
          const localized = await example.api.localizePage(page, locale);
          expect(validateLocalizedPageDsl(localized), `${file} ${locale}`).toMatchObject({ valid: true });
          expect(localized).not.toHaveProperty('i18n');
        }
      }
    });

    it('defines every referenced page translation key in both language packs', () => {
      process.chdir(resolve(root, example.dir));
      const yamlDir = resolve(root, example.dir, 'src/backend/pages/yaml');
      const keys = new Set<string>();
      for (const file of pageFiles(yamlDir)) {
        collectI18nKeys(parse(readFileSync(file, 'utf8')), keys);
      }
      for (const locale of ['zh-CN', 'en-US']) {
        const packFile = resolve(
          root,
          example.dir,
          `src/backend/pages/i18n/locales/${locale}/app.yaml`,
        );
        const pack = parse(readFileSync(packFile, 'utf8')) as Record<string, unknown>;
        const missing = [...keys].filter((key) => !(key in pack)).sort();
        expect(missing, locale).toEqual([]);
      }
    });
  });
}

describe('SPA language pack', () => {
  it('injects a public page and resolves runtime expressions in both languages', () => {
    for (const locale of ['zh-CN', 'en-US'] as const) {
      const site = withClientDemo({ pages: [], menus: [] }, locale) as any;
      expect(site.menus[0].title).toBe(messages[locale]['demo.menu']);
      expect(site.menus[0].public).toBe(true);
      const scope = { state: { name: 'Ada' }, t: createI18nContext({ locale, messages }).t };
      expect(evaluateExpression("t('demo.greeting', { name: state.name })", scope)).toBe(locale === 'en-US' ? 'Hello, Ada!' : '你好，Ada！');
      expect(validateLocalizedPageDsl(site.pages[0].pageDsl)).toMatchObject({ valid: true });
    }
  });
});
