import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { createI18nContext } from '@pactor-app/core';
import { evaluateExpression } from '@pactor-app/expression';
import { validateAuthorPageDsl, validateLocalizedPageDsl } from '@pactor-app/schema';

import * as next from '../starters/next-app-starter/src/server/i18n';
import * as prd from '../skills/pactor-prd/template/src/server/i18n';
import { withClientDemo } from '../starters/spa-starter/src/i18n/demo';
import { messages } from '../starters/spa-starter/src/i18n/messages';

const root = process.cwd();
const examples = [
  { name: 'Next starter', dir: 'starters/next-app-starter', api: next },
  { name: 'PRD template', dir: 'skills/pactor-prd/template', api: prd },
];

afterAll(() => process.chdir(root));

function yaml(project: string, file: string): any {
  return parse(readFileSync(join(root, project, 'src/server/yaml', file), 'utf8'));
}

function pageFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? pageFiles(path) : entry.name.endsWith('.yaml') && entry.name !== 'sitemap.yaml' ? [path] : [];
  });
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
      const site = yaml(example.dir, 'sitemap.yaml');
      const login = yaml(example.dir, example.dir.startsWith('starters') ? 'pages/login.page.yaml' : 'common/login.yaml');
      site.pages.find((page: { id: string }) => page.id === 'login').pageDsl = login;
      const original = structuredClone(site);
      const en = await example.api.localizeSitemap(site, 'en-US');
      const zh = await example.api.localizeSitemap(site, 'zh-CN');
      expect(site).toEqual(original);
      expect(en.pages.find((page) => page.id === 'login')?.title).toBe('Sign in');
      expect(zh.pages.find((page) => page.id === 'login')?.title).toBe('登录');
      expect(JSON.stringify(en)).not.toContain('"i18n"');
      expect(JSON.stringify(en.layouts.admin)).toContain('Sign out');
      expect((en as any).localization.locale).toBe('en-US');
    });

    it('converts every page to valid localized DSL in both languages', async () => {
      process.chdir(resolve(root, example.dir));
      const dir = resolve(root, example.dir, 'src/server/yaml');
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
