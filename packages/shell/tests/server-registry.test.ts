import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  getAssembly,
  getAssemblySummary,
  getFragmentsIndex,
  getMenusIndex,
  getPagesIndex,
  getSitemapMeta,
} from '../src/server/registry.js';

function fixtureDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'shell-registry-'));
  writeFileSync(
    join(dir, 'assembly.json'),
    JSON.stringify({
      generatedAt: '2026-11-14T00:00:00.000Z',
      modules: [
        { id: 'm1', name: 'M1', package: 'm1', version: '0.1.0', basePath: '/m1' },
      ],
      routes: [
        {
          publicPath: '/m1',
          moduleId: 'm1',
          pageId: 'home',
          globalPageId: 'm1:home',
          pattern: '/m1',
          paramNames: [],
        },
      ],
    }),
  );
  writeFileSync(
    join(dir, 'pages.json'),
    JSON.stringify({
      pages: [
        {
          globalPageId: 'm1:home',
          moduleId: 'm1',
          pageId: 'home',
          path: '/m1',
          title: '首页',
          version: 1,
          public: true,
          dslRef: 'dsl/m1/home.yaml',
        },
      ],
    }),
  );
  writeFileSync(join(dir, 'menus.json'), JSON.stringify({ menus: [{ id: 'home', type: 'page', pageId: 'm1:home' }] }));
  writeFileSync(
    join(dir, 'sitemap-meta.json'),
    JSON.stringify({ layout: 'shell', dslVersion: '1.0', app: { name: 'Fixture' }, auth: { loginPath: '/login' }, layouts: {} }),
  );
  writeFileSync(join(dir, 'fragments.json'), JSON.stringify({ fragments: {} }));
  return dir;
}

describe('registry', () => {
  it('按 generatedDir 读取装配索引', () => {
    const generatedDir = fixtureDir();
    expect(getAssembly({ generatedDir }).modules[0]?.id).toBe('m1');
    expect(getPagesIndex({ generatedDir }).pages[0]?.globalPageId).toBe('m1:home');
    expect(getMenusIndex({ generatedDir }).menus).toHaveLength(1);
    expect(getSitemapMeta({ generatedDir }).layout).toBe('shell');
    expect(getFragmentsIndex({ generatedDir }).fragments).toEqual({});
  });

  it('getAssemblySummary 返回模块清单与路由数', () => {
    const generatedDir = fixtureDir();
    const summary = getAssemblySummary({ generatedDir });
    expect(summary.modules).toHaveLength(1);
    expect(summary.routeCount).toBe(1);
  });
});
