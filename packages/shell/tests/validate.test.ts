import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it, vi } from 'vitest';

import { assembleModules } from '../src/assemble/assemble.js';
import { validateModules } from '../src/assemble/validate.js';

import { createBareHost, createFixtureHost } from './helpers.js';

function assembledHost(): string {
  const rootDir = createFixtureHost();
  assembleModules({ rootDir });
  return rootDir;
}

describe('validateModules', () => {
  it('合法装配通过并返回计数', () => {
    const rootDir = assembledHost();
    // 模块 1 路由/页面 + 包默认站点 7 页面/菜单 + 宿主 1 菜单
    expect(validateModules({ rootDir })).toEqual({
      routes: 8,
      pages: 8,
      menus: 8,
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

describe('壳站点来源报告', () => {
  it('宿主覆盖包默认同名文件时输出提示', () => {
    const rootDir = createBareHost();
    mkdirSync(join(rootDir, 'src/shell/layouts'), { recursive: true });
    writeFileSync(
      join(rootDir, 'src/shell/sitemap.yaml'),
      ['id: shell', 'resourceType: sitemap', 'version: 1', 'menus: []', ''].join('\n'),
    );
    writeFileSync(
      join(rootDir, 'src/shell/layouts/admin.layout.yaml'),
      ['dsl: "1.0"', 'body:', '  type: PageOutlet', ''].join('\n'),
    );
    assembleModules({ rootDir });

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      validateModules({ rootDir });
      const messages = warn.mock.calls.map((call) => String(call[0]));
      expect(messages.some((m) => m.includes('壳站点来源'))).toBe(true);
      expect(
        messages.some(
          (m) => m.includes('覆盖了包默认站点同名文件') && m.includes('layouts/admin.layout.yaml'),
        ),
      ).toBe(true);
    } finally {
      warn.mockRestore();
    }
  });
});
