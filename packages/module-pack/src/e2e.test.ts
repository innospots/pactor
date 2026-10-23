import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { parseDocument } from 'yaml';

import { buildModule, ModuleBuildError } from './build.js';
import { validateModule } from './validate.js';
import { createTempDir, writeText } from './test-utils.js';

/**
 * e2e fixture：微型工程（2 页 + 1 布局字符串引用 + 1 fragment +
 * 1 action 文件 + public 下一个 svg），跑 buildModule 全链路。
 */
function createFixtureProject(dir: string, configOverrides = ''): void {
  writeText(
    join(dir, 'package.json'),
    JSON.stringify(
      {
        name: '@demo/risk-app',
        version: '0.2.0',
        files: ['dist-module'],
        exports: {
          './manifest': './dist-module/manifest.json',
          './client': './dist-module/client/index.js',
          './styles.css': './dist-module/client/index.css',
        },
      },
      null,
      2,
    ),
  );
  writeText(
    join(dir, 'pactor.module.json'),
    `{
  "id": "demo",
  "name": "Demo Module",
  "basePath": "/demo"${configOverrides}
}
`,
  );
  writeText(
    join(dir, 'tsconfig.json'),
    JSON.stringify({ compilerOptions: { baseUrl: '.', paths: { '@/*': ['src/*'] } } }),
  );
  writeText(
    join(dir, 'src/server/yaml/sitemap.yaml'),
    `id: site
resourceType: sitemap
version: 1
dslVersion: "1.0"
app: { name: Demo }
auth: { loginPath: /login }
layouts:
  admin: admin.layout.yaml
pages:
  - { id: login, path: /login, title: 登录, public: true }
  - { id: dashboard, path: /dashboard, title: 工作台, lazy: true }
menus:
  - { id: dash, title: 工作台, pageId: dashboard, path: /dashboard }
`,
  );
  writeText(
    join(dir, 'src/server/yaml/admin.layout.yaml'),
    `dsl: '1.0'
layout: { id: admin }
body:
  type: AdminLayout
  props: { logo: /next.svg }
`,
  );
  writeText(
    join(dir, 'src/server/yaml/common/login.yaml'),
    `dsl: '1.0'
page: { id: login, title: 登录 }
body:
  type: LoginForm
  props:
    logo: /next.svg
  events:
    onSubmit:
      - action: request
        params:
          url: http://localhost:8011/api/auth/login
      - action: app.reload
        params: { to: /dashboard }
`,
  );
  writeText(
    join(dir, 'src/server/yaml/main/dashboard.page.yaml'),
    `dsl: '1.0'
page: { id: dashboard, title: 工作台 }
body:
  type: Page
  children:
    - $include: shared/card.fragment.yaml
`,
  );
  writeText(
    join(dir, 'src/server/yaml/shared/card.fragment.yaml'),
    `dsl: '1.0'
fragment: { id: card }
body:
  type: Card
  children:
    - type: Button
      events:
        onClick:
          action: navigate
          params: { to: /login }
`,
  );
  writeText(
    join(dir, 'src/pactor/demo-actions.ts'),
    `export const demoActions = {
  'demo.hello': () => ({ ok: true }),
};
`,
  );
  writeText(
    join(dir, 'module/client.ts'),
    `import { demoActions } from '../src/pactor/demo-actions';
import './style.css';

export const extensions = {
  components: {},
  actions: { ...demoActions },
};
`,
  );
  writeText(join(dir, 'module/style.css'), '.demo-module { color: red; }\n');
  writeText(join(dir, 'public/next.svg'), '<svg/>');
}

function loadYaml(file: string): Record<string, unknown> {
  return parseDocument(readFileSync(file, 'utf8')).toJS() as Record<string, unknown>;
}

describe('buildModule e2e（微型工程全链路）', () => {
  let temp: ReturnType<typeof createTempDir>;
  beforeEach(() => {
    temp = createTempDir();
  });
  afterEach(() => temp.cleanup());

  it('产出可被 Shell 装配的 dist-module 结构', () => {
    createFixtureProject(temp.dir);
    const result = buildModule({ dir: temp.dir });
    const out = result.outDir;

    // 摘要统计
    expect(result.stats).toEqual({ pages: 2, menus: 1, layouts: 1, assets: 1 });
    expect(result.clientBundled).toBe(true);
    // 绝对 API 地址告警 + pactorVersionRange 回退告警
    expect(result.warnings.some((w) => w.includes('http://localhost:8011'))).toBe(true);

    // manifest 契约
    const manifest = JSON.parse(
      readFileSync(join(out, 'manifest.json'), 'utf8'),
    ) as Record<string, unknown>;
    expect(manifest).toMatchObject({
      schemaVersion: '1',
      id: 'demo',
      name: 'Demo Module',
      version: '0.2.0',
      basePath: '/demo',
      sitemap: 'dsl/sitemap.yaml',
      dslRoot: 'dsl',
      assetsRoot: 'assets',
      clientEntry: 'client/index.js',
      styles: ['client/index.css'],
    });

    // sitemap：布局字符串引用已内联、菜单去 path、@2 保留 lazy
    const site = loadYaml(join(out, 'dsl', 'sitemap.yaml'));
    const layouts = site.layouts as Record<string, unknown>;
    expect(typeof layouts.admin).toBe('object');
    expect((layouts.admin as { body: { type: string } }).body.type).toBe('AdminLayout');
    const menus = site.menus as Record<string, unknown>[];
    expect(menus[0]).not.toHaveProperty('path');
    expect(menus[0]!.pageId).toBe('dashboard');
    const pages = site.pages as Record<string, unknown>[];
    expect(pages[1]!.lazy).toBe(true);

    // 布局内联对象里的资源 URL 也被重写
    const adminBody = (layouts.admin as { body: { props: { logo: string } } }).body;
    expect(adminBody.props.logo).toBe('/modules/demo/0.2.0/next.svg');

    // 页面 DSL：导航重写 / API 剥离 origin / 资源重写
    const login = loadYaml(join(out, 'dsl', 'login.yaml')) as {
      body: { props: { logo: string }; events: { onSubmit: Record<string, unknown>[] } };
    };
    expect(login.body.props.logo).toBe('/modules/demo/0.2.0/next.svg');
    const [request, reload] = login.body.events.onSubmit as [
      { params: { url: string } },
      { params: { to: string } },
    ];
    expect(request.params.url).toBe('/api/auth/login');
    expect(reload.params.to).toBe('/demo/dashboard');

    // fragment 经 $include 展开
    const dashboard = loadYaml(join(out, 'dsl', 'dashboard.yaml')) as {
      body: { children: Record<string, unknown>[] };
    };
    const card = dashboard.body.children[0] as { body: { type: string } };
    expect(card.body.type).toBe('Card');

    // 产物中无 $include 残留
    const dslFiles = readdirSync(join(out, 'dsl'));
    for (const file of dslFiles) {
      expect(readFileSync(join(out, 'dsl', file), 'utf8')).not.toContain('$include');
    }

    // assets 复制 + sha256 清单
    expect(existsSync(join(out, 'assets', 'next.svg'))).toBe(true);
    const assetList = JSON.parse(
      readFileSync(join(out, 'module-assets.json'), 'utf8'),
    ) as { assets: { path: string; sha256: string }[] };
    expect(assetList.assets[0]!.path).toBe('next.svg');
    expect(assetList.assets[0]!.sha256).toMatch(/^[0-9a-f]{64}$/);

    // client bundle：actions 打进同一 bundle，react/pactor 未内嵌
    const bundle = readFileSync(join(out, 'client', 'index.js'), 'utf8');
    expect(bundle).toContain('demo.hello');
    expect(bundle).toContain('extensions');
    expect(existsSync(join(out, 'client', 'index.js.map'))).toBe(true);
  });

  it('target innospots-web-shell@1 时去掉页面 lazy', () => {
    createFixtureProject(temp.dir, ',\n  "target": "innospots-web-shell@1"');
    const result = buildModule({ dir: temp.dir });
    const site = loadYaml(join(result.outDir, 'dsl', 'sitemap.yaml'));
    const pages = site.pages as Record<string, unknown>[];
    expect(pages.every((page) => !('lazy' in page))).toBe(true);
  });

  it('产物通过 validateModule 校验', () => {
    createFixtureProject(temp.dir);
    buildModule({ dir: temp.dir });
    const validation = validateModule({ dir: temp.dir });
    expect(validation.errors).toEqual([]);
    expect(validation.ok).toBe(true);
  });

  it('basePath: "/" 被 profile forbidRootBasePath 拒绝，且不留产物', () => {
    createFixtureProject(temp.dir);
    writeText(
      join(temp.dir, 'pactor.module.json'),
      `{\n  "id": "demo",\n  "name": "Demo Module",\n  "basePath": "/"\n}\n`,
    );
    expect(() => buildModule({ dir: temp.dir })).toThrowError(ModuleBuildError);
    try {
      buildModule({ dir: temp.dir });
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(ModuleBuildError);
      expect((error as ModuleBuildError).errors[0]).toContain('forbidRootBasePath');
    }
    expect(existsSync(join(temp.dir, 'dist-module'))).toBe(false);
  });

  it('页面 DSL 缺失时报错且不留半成品', () => {
    createFixtureProject(temp.dir);
    // sitemap 增加一个不存在 DSL 文件的页面
    writeText(
      join(temp.dir, 'src/server/yaml/sitemap.yaml'),
      `id: site
auth: { loginPath: /login }
layouts:
  admin: admin.layout.yaml
pages:
  - { id: login, path: /login, title: 登录 }
  - { id: ghost, path: /ghost, title: 缺失页 }
menus: []
`,
    );
    expect(existsSync(join(temp.dir, 'dist-module'))).toBe(false);
    try {
      buildModule({ dir: temp.dir });
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(ModuleBuildError);
      const buildError = error as ModuleBuildError;
      expect(buildError.errors.some((e) => e.includes('ghost'))).toBe(true);
    }
    expect(existsSync(join(temp.dir, 'dist-module'))).toBe(false);
  });

  it('纯 DSL 模块（无 client entry）：跳过 bundle，manifest 无 clientEntry', () => {
    createFixtureProject(temp.dir);
    // 删除 client entry
    writeText(
      join(temp.dir, 'pactor.module.json'),
      `{\n  "id": "demo",\n  "name": "Demo Module",\n  "basePath": "/demo",\n  "clientEntry": "module/missing.ts"\n}\n`,
    );
    const result = buildModule({ dir: temp.dir });
    expect(result.clientBundled).toBe(false);
    expect(result.warnings.some((w) => w.includes('纯 DSL 模块'))).toBe(true);
    const manifest = JSON.parse(
      readFileSync(join(result.outDir, 'manifest.json'), 'utf8'),
    ) as Record<string, unknown>;
    expect(manifest).not.toHaveProperty('clientEntry');
    expect(existsSync(join(result.outDir, 'dsl', 'sitemap.yaml'))).toBe(true);
  });
});
