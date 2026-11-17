import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { assembleModules } from '../src/assemble/assemble.js';

import { createBareHost, createFixtureHost } from './helpers.js';

describe('assembleModules', () => {
  it('装配 fixture 模块：索引、DSL 复制、静态资源、注册表', () => {
    const rootDir = createFixtureHost();
    const summary = assembleModules({ rootDir });

    // 1 个模块路由 + 包默认站点 7 个开箱页面（login/workspace/themes/profile/403/404/500）
    expect(summary).toMatchObject({ modules: 1, routes: 8, serverApis: 0 });

    const generated = join(rootDir, '.generated/pactor');
    const pages = JSON.parse(readFileSync(join(generated, 'pages.json'), 'utf8'));
    expect(pages.pages).toHaveLength(8);
    const fixturePage = pages.pages.find(
      (p: { globalPageId: string }) => p.globalPageId === 'fixture:home',
    );
    expect(fixturePage).toMatchObject({
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

  it('menuMode merge：模块菜单并入导航，path 按页面清单 + basePath 推导', () => {
    const rootDir = createBareHost();
    // 模块构建期会剥离菜单 path（模块菜单契约），菜单只留 pageId 引用
    const sitemapPath = join(rootDir, 'node_modules/fixture-mod/dist-module/dsl/sitemap.yaml');
    const content = readFileSync(sitemapPath, 'utf8');
    writeFileSync(
      sitemapPath,
      content.replace(
        'menus: []',
        'menus:\n  - { id: home, type: page, pageId: home, title: 首页, icon: chart, badge: 3 }',
      ),
    );

    assembleModules({ rootDir });
    const menus = JSON.parse(
      readFileSync(join(rootDir, '.generated/pactor/menus.json'), 'utf8'),
    ).menus;
    const home = menus.find((m: { id: string }) => m.id === 'home');
    expect(home).toMatchObject({
      pageId: 'fixture:home',
      path: '/fixture',
      // badge 字段随菜单清单原样透传到客户端
      badge: 3,
    });
    expect('hidden' in home).toBe(false);
  });
});

describe('壳站点分层（宿主 src/shell 优先，包默认站点兜底）', () => {
  it('无 src/shell：整体回退包内默认站点', () => {
    const rootDir = createBareHost();
    assembleModules({ rootDir });

    const generated = join(rootDir, '.generated/pactor');
    const meta = JSON.parse(readFileSync(join(generated, 'sitemap-meta.json'), 'utf8'));
    expect(meta.layout).toBe('admin');
    expect(meta.app.name).toBe('Pactor Shell');
    expect(meta.auth.loginPath).toBe('/login');
    expect(meta.layouts.admin.body.children[0].type).toBe('NavigationShell');
    expect(Object.keys(meta.layouts)).toEqual(
      expect.arrayContaining(['admin', 'login', 'auth', 'blank']),
    );

    const routes = JSON.parse(readFileSync(join(generated, 'routes.json'), 'utf8')).routes;
    const paths = routes.map((r: { publicPath: string }) => r.publicPath);
    expect(paths).toEqual(
      expect.arrayContaining([
        '/login',
        '/workspace',
        '/settings/themes',
        '/profile',
        '/403',
        '/404',
        '/500',
      ]),
    );

    // 错误页三件套：hidden（不出现在导航）、blank 布局、DSL 已落盘
    const menusJson = JSON.parse(readFileSync(join(generated, 'menus.json'), 'utf8')).menus;
    for (const id of ['403', '404', '500']) {
      const menu = menusJson.find((m: { id: string }) => m.id === id);
      expect(menu).toMatchObject({ hidden: true, layout: 'blank', public: true });
      expect(existsSync(join(generated, `dsl/shell/${id}.yaml`))).toBe(true);
    }

    // 默认页面 DSL 已落盘
    expect(existsSync(join(generated, 'dsl/shell/login.yaml'))).toBe(true);
    expect(existsSync(join(generated, 'dsl/shell/workspace.yaml'))).toBe(true);

    // 来源报告全部来自默认层
    const report = JSON.parse(readFileSync(join(generated, 'shell-site.json'), 'utf8'));
    expect(Object.values(report.sources as Record<string, string>)).not.toContain('host');
    expect(report.overridden).toEqual([]);
  });

  it('宿主仅提供 sitemap（menus 按 id 合并、pages/layouts 回退默认）', () => {
    const rootDir = createBareHost();
    mkdirSync(join(rootDir, 'src/shell'), { recursive: true });
    writeFileSync(
      join(rootDir, 'src/shell/sitemap.yaml'),
      [
        'id: shell',
        'resourceType: sitemap',
        'version: 1',
        'app: { name: 我的壳 }',
        'menus:',
        '  - { id: home, type: page, pageId: "fixture:home", path: /fixture, title: 首页, public: true }',
        '',
      ].join('\n'),
    );

    assembleModules({ rootDir });
    const generated = join(rootDir, '.generated/pactor');
    const meta = JSON.parse(readFileSync(join(generated, 'sitemap-meta.json'), 'utf8'));

    // app 宿主优先；layout/auth 回退默认
    expect(meta.app.name).toBe('我的壳');
    expect(meta.layout).toBe('admin');
    expect(meta.auth.loginPath).toBe('/login');
    // layouts 按 key 合并：默认四套全部可用（宿主未声明）
    expect(meta.layouts.admin.body.children[0].type).toBe('NavigationShell');

    // menus 按 id 合并：宿主条目在前，默认条目（工作台/主题设置/隐藏项）保留
    const menus = JSON.parse(readFileSync(join(generated, 'menus.json'), 'utf8')).menus;
    const menuIds = menus.map((m: { id: string }) => m.id);
    expect(menuIds[0]).toBe('home');
    expect(menuIds).toEqual(
      expect.arrayContaining(['home', 'workspace', 'themes', 'login', 'profile']),
    );
    const pages = JSON.parse(readFileSync(join(generated, 'pages.json'), 'utf8')).pages;
    expect(pages.map((p: { globalPageId: string }) => p.globalPageId)).toContain('shell:login');

    const report = JSON.parse(readFileSync(join(generated, 'shell-site.json'), 'utf8'));
    expect(report.sources['sitemap.yaml']).toBe('host');
    expect(report.sources['layouts/admin.layout.yaml']).toBe('default');
  });

  it('宿主菜单引用模块页面时保留显式 path（与默认页同名 id 不被覆盖）', () => {
    const rootDir = createBareHost();
    const moduleDir = join(rootDir, 'node_modules/fixture-mod/dist-module');
    const sitemapPath = join(moduleDir, 'dsl/sitemap.yaml');
    writeFileSync(
      sitemapPath,
      readFileSync(sitemapPath, 'utf8').replace(
        'pages:\n  - { id: home, path: /, title: 首页, public: true }',
        'pages:\n  - { id: home, path: /, title: 首页, public: true }\n  - { id: workspace, path: /workspace, title: 模块工作台, public: true }',
      ),
    );
    writeFileSync(
      join(moduleDir, 'dsl/workspace.yaml'),
      'dsl: "1.0"\npage: { id: workspace, title: 模块工作台 }\nbody: { type: Text, props: { content: hi } }\n',
    );

    mkdirSync(join(rootDir, 'src/shell'), { recursive: true });
    writeFileSync(
      join(rootDir, 'src/shell/sitemap.yaml'),
      [
        'id: shell',
        'resourceType: sitemap',
        'version: 1',
        'menus:',
        '  - { id: workspace, type: page, pageId: "fixture:workspace", path: /fixture/workspace, title: 工作台 }',
        '',
      ].join('\n'),
    );

    assembleModules({ rootDir });
    const menus = JSON.parse(
      readFileSync(join(rootDir, '.generated/pactor/menus.json'), 'utf8'),
    ).menus;
    const menu = menus.find((m: { id: string }) => m.id === 'workspace');
    // 默认站点同 id 页面 /workspace 不得覆盖宿主为模块页面写的显式 path
    expect(menu).toMatchObject({
      pageId: 'fixture:workspace',
      path: '/fixture/workspace',
    });
  });

  it('宿主覆盖同名布局：admin 用宿主文件，其余布局仍回退默认', () => {
    const rootDir = createBareHost();
    mkdirSync(join(rootDir, 'src/shell/layouts'), { recursive: true });
    writeFileSync(
      join(rootDir, 'src/shell/sitemap.yaml'),
      [
        'id: shell',
        'resourceType: sitemap',
        'version: 1',
        'menus: []',
        '',
      ].join('\n'),
    );
    writeFileSync(
      join(rootDir, 'src/shell/layouts/admin.layout.yaml'),
      ['dsl: "1.0"', 'body:', '  type: Layout', '  props: { className: host-admin }', '  children:', '    - type: PageOutlet', ''].join('\n'),
    );

    assembleModules({ rootDir });
    const generated = join(rootDir, '.generated/pactor');
    const meta = JSON.parse(readFileSync(join(generated, 'sitemap-meta.json'), 'utf8'));
    expect(meta.layouts.admin.body.props.className).toBe('host-admin');
    expect(meta.layouts.blank.body.type).toBe('PageOutlet');

    const report = JSON.parse(readFileSync(join(generated, 'shell-site.json'), 'utf8'));
    expect(report.sources['layouts/admin.layout.yaml']).toBe('host');
    expect(report.overridden).toContain('layouts/admin.layout.yaml');
  });
});
