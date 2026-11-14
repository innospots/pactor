import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { assembleModules } from '../src/assemble/assemble.js';
import { validateModules } from '../src/assemble/validate.js';

import { createFixtureHost } from './helpers.js';

function assembledHost(): string {
  const rootDir = createFixtureHost();
  assembleModules({ rootDir });
  return rootDir;
}

describe('validateModules', () => {
  it('合法装配通过并返回计数', () => {
    const rootDir = assembledHost();
    expect(validateModules({ rootDir })).toEqual({
      routes: 1,
      pages: 1,
      menus: 1,
      serverApis: 0,
    });
  });

  it('路由 URL 冲突抛错', () => {
    const rootDir = assembledHost();
    const assemblyPath = join(rootDir, '.generated/pactor/assembly.json');
    const assembly = JSON.parse(readFileSync(assemblyPath, 'utf8'));
    assembly.routes.push({ ...assembly.routes[0], globalPageId: 'other:home' });
    writeFileSync(assemblyPath, JSON.stringify(assembly));

    expect(() => validateModules({ rootDir })).toThrow(/路由 URL 冲突/);
  });

  it('菜单引用不存在的 pageId 抛错', () => {
    const rootDir = assembledHost();
    const menusPath = join(rootDir, '.generated/pactor/menus.json');
    writeFileSync(
      menusPath,
      JSON.stringify({ menus: [{ id: 'ghost', type: 'page', pageId: 'fixture:nope' }] }),
    );

    expect(() => validateModules({ rootDir })).toThrow(/引用了不存在的页面/);
  });

  it('globalPageId 重复抛错', () => {
    const rootDir = assembledHost();
    const pagesPath = join(rootDir, '.generated/pactor/pages.json');
    const pages = JSON.parse(readFileSync(pagesPath, 'utf8'));
    pages.pages.push({ ...pages.pages[0] });
    writeFileSync(pagesPath, JSON.stringify(pages));

    expect(() => validateModules({ rootDir })).toThrow(/globalPageId 重复/);
  });
});
