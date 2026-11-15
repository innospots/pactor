import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

function createHostRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'shell-assemble-'));

  writeFileSync(
    join(root, 'package.json'),
    JSON.stringify({ name: 'fixture-host', version: '0.0.0', type: 'module' }),
  );

  mkdirSync(join(root, 'src/modules'), { recursive: true });
  writeFileSync(
    join(root, 'src/modules/module-list.json'),
    JSON.stringify({ modules: [{ package: 'fixture-mod', enabled: true }] }),
  );

  const pkg = join(root, 'node_modules/fixture-mod');
  mkdirSync(join(pkg, 'dist-module/dsl'), { recursive: true });
  mkdirSync(join(pkg, 'dist-module/assets'), { recursive: true });
  mkdirSync(join(pkg, 'dist-module/client'), { recursive: true });
  writeFileSync(
    join(pkg, 'package.json'),
    JSON.stringify({
      name: 'fixture-mod',
      version: '0.1.0',
      type: 'module',
      exports: {
        './manifest': './dist-module/manifest.json',
        './client': './dist-module/client/index.js',
      },
    }),
  );
  writeFileSync(
    join(pkg, 'dist-module/manifest.json'),
    JSON.stringify({
      schemaVersion: '1',
      id: 'fixture',
      name: 'Fixture',
      version: '0.1.0',
      pactorVersionRange: '>=1.55.0',
      basePath: '/fixture',
      sitemap: 'dsl/sitemap.yaml',
      dslRoot: 'dsl',
      assetsRoot: 'assets',
      clientEntry: './client/index.js',
    }),
  );
  writeFileSync(
    join(pkg, 'dist-module/dsl/sitemap.yaml'),
    [
      'id: fixture',
      'resourceType: sitemap',
      'version: 1',
      'dslVersion: "1.0"',
      'pages:',
      '  - { id: home, path: /, title: 首页, public: true }',
      'menus: []',
      '',
    ].join('\n'),
  );
  writeFileSync(
    join(pkg, 'dist-module/dsl/home.yaml'),
    'dsl: "1.0"\npage: { id: home, title: 首页 }\nbody: { type: Text, props: { content: hello } }\n',
  );
  writeFileSync(join(pkg, 'dist-module/assets/logo.txt'), 'fixture');
  writeFileSync(join(pkg, 'dist-module/client/index.js'), 'export const extensions = {};\n');

  return root;
}

/**
 * 最小宿主工程：一个启用的 UI 模块 fixture-mod + Shell 自带站点。
 * 宿主 sitemap 只声明 menus 与自有布局；包默认站点（页面 / admin 等布局）
 * 经字段级合并一并装配（menus/pages 按 id 合并，默认条目保留）。
 */
export function createFixtureHost(): string {
  const root = createHostRoot();

  mkdirSync(join(root, 'src/shell/layouts'), { recursive: true });
  writeFileSync(
    join(root, 'src/shell/sitemap.yaml'),
    [
      'id: shell',
      'resourceType: sitemap',
      'version: 1',
      'dslVersion: "1.0"',
      'app: { name: FixtureShell }',
      'auth: { loginPath: /login }',
      'layout: shell',
      'menus:',
      '  - { id: home, type: page, pageId: "fixture:home", path: /fixture, title: 首页, order: 1, public: true }',
      'layouts:',
      '  shell: layouts/shell.layout.yaml',
      '',
    ].join('\n'),
  );
  writeFileSync(
    join(root, 'src/shell/layouts/shell.layout.yaml'),
    ['dsl: "1.0"', 'body:', '  type: Layout', '  children:', '    - type: PageOutlet', ''].join('\n'),
  );

  return root;
}

/** 裸宿主：只有模块 fixture，没有 src/shell（壳站点全部回退包内默认）。 */
export function createBareHost(): string {
  return createHostRoot();
}
