import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { assembleModules } from '../src/assemble/assemble.js';

import { createFixtureHost } from './helpers.js';

describe('assembleModules', () => {
  it('装配 fixture 模块：索引、DSL 复制、静态资源、注册表', () => {
    const rootDir = createFixtureHost();
    const summary = assembleModules({ rootDir });

    expect(summary).toMatchObject({ modules: 1, routes: 1, serverApis: 0 });

    const generated = join(rootDir, '.generated/pactor');
    const pages = JSON.parse(readFileSync(join(generated, 'pages.json'), 'utf8'));
    expect(pages.pages).toHaveLength(1);
    expect(pages.pages[0]).toMatchObject({
      globalPageId: 'fixture:home',
      path: '/fixture',
      public: true,
      dslRef: 'dsl/fixture/home.yaml',
    });

    // DSL 落盘与静态资源版本化
    expect(existsSync(join(generated, 'dsl/fixture/home.yaml'))).toBe(true);
    expect(existsSync(join(rootDir, 'public/modules/fixture/0.1.0/logo.txt'))).toBe(true);

    // Shell 自带站点提供默认布局与固定菜单（pageId 已是全局 id，不再加前缀）
    const meta = JSON.parse(readFileSync(join(generated, 'sitemap-meta.json'), 'utf8'));
    expect(meta.layout).toBe('shell');
    expect(meta.layouts.shell.body.type).toBe('Layout');
    const menus = JSON.parse(readFileSync(join(generated, 'menus.json'), 'utf8'));
    expect(menus.menus[0]).toMatchObject({ id: 'home', pageId: 'fixture:home' });

    // 注册表引用包内类型出口
    const clientRegistry = readFileSync(join(generated, 'client-registry.ts'), 'utf8');
    expect(clientRegistry).toContain('from "fixture-mod/client"');
    expect(clientRegistry).toContain('@pactor-app/shell/client');
    const serverRegistry = readFileSync(join(generated, 'server-registry.ts'), 'utf8');
    expect(serverRegistry).toContain('@pactor-app/shell/server');
    expect(serverRegistry).toContain('moduleServers');
    expect(existsSync(join(generated, 'module-styles.ts'))).toBe(true);
    expect(JSON.parse(readFileSync(join(generated, 'servers.json'), 'utf8')).modules).toEqual([]);
  });

  it('页面 DSL 缺失时抛错（失败即阻断）', () => {
    const rootDir = createFixtureHost();
    // 追加一个无 DSL 文件的页面
    const sitemapPath = join(rootDir, 'node_modules/fixture-mod/dist-module/dsl/sitemap.yaml');
    const content = readFileSync(sitemapPath, 'utf8');
    writeFileSync(sitemapPath, content.replace('menus: []', '  - { id: missing, path: /missing, title: 缺失 }\nmenus: []'));

    expect(() => assembleModules({ rootDir })).toThrow(/缺少 DSL 文件/);
  });
});
