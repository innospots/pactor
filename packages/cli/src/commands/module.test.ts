import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { parseArgs } from '../args.js';
import { createTempDir, createTestIo, writeText } from '../test-utils.js';
import { runModule } from './module.js';

/** 最小可构建工程（纯 DSL：无 client entry） */
function createModuleProject(dir: string): void {
  writeText(
    join(dir, 'package.json'),
    JSON.stringify({
      name: '@demo/app',
      version: '0.1.0',
      files: ['dist-module'],
      exports: {
        './manifest': './dist-module/manifest.json',
        './client': './dist-module/client/index.js',
      },
    }),
  );
  writeText(
    join(dir, 'pactor.module.json'),
    JSON.stringify({ id: 'demo', name: 'Demo', basePath: '/demo' }),
  );
  writeText(
    join(dir, 'src/server/yaml/sitemap.yaml'),
    `id: site
auth: { loginPath: /login }
pages:
  - { id: login, path: /login, title: 登录, public: true }
menus: []
`,
  );
  writeText(
    join(dir, 'src/server/yaml/login.yaml'),
    `dsl: '1.0'\npage: { id: login, title: 登录 }\nbody:\n  type: LoginForm\n`,
  );
}

describe('pactor module', () => {
  let temp: ReturnType<typeof createTempDir>;
  beforeEach(() => {
    temp = createTempDir();
  });
  afterEach(() => temp.cleanup());

  it('无子命令打印用法，退出码 2', () => {
    const { io, err } = createTestIo();
    expect(runModule(parseArgs([]), io)).toBe(2);
    expect(err.join('\n')).toContain('pactor module');
  });

  it('未知子命令退出码 2', () => {
    const { io, err } = createTestIo();
    expect(runModule(parseArgs(['nope']), io)).toBe(2);
    expect(err.join('\n')).toContain('未知 module 子命令: nope');
  });

  it('build：最小工程构建成功并输出摘要', () => {
    createModuleProject(temp.dir);
    const { io, out } = createTestIo();
    const code = runModule(parseArgs(['build', '--dir', temp.dir]), io);
    expect(code).toBe(0);
    expect(out.join('\n')).toContain('模块构建完成');
    expect(out.join('\n')).toContain('页面 1');
    const manifest = JSON.parse(
      readFileSync(join(temp.dir, 'dist-module', 'manifest.json'), 'utf8'),
    ) as Record<string, unknown>;
    expect(manifest.id).toBe('demo');
    expect(manifest.version).toBe('0.1.0');
  });

  it('build 后 validate 通过，退出码 0', () => {
    createModuleProject(temp.dir);
    const buildIo = createTestIo();
    expect(runModule(parseArgs(['build', '--dir', temp.dir]), buildIo.io)).toBe(0);
    const { io, out } = createTestIo();
    expect(runModule(parseArgs(['validate', '--dir', temp.dir]), io)).toBe(0);
    expect(out.join('\n')).toContain('校验通过');
  });

  it('validate：产物缺失时报错误，退出码 1', () => {
    createModuleProject(temp.dir);
    const { io, err } = createTestIo();
    expect(runModule(parseArgs(['validate', '--dir', temp.dir]), io)).toBe(1);
    expect(err.join('\n')).toContain('产物不存在');
  });

  it('build：页面 DSL 缺失退出码 1 且不留产物', () => {
    createModuleProject(temp.dir);
    writeText(
      join(temp.dir, 'src/server/yaml/sitemap.yaml'),
      `id: site\npages:\n  - { id: ghost, path: /ghost, title: 缺失 }\nmenus: []\n`,
    );
    const { io, err } = createTestIo();
    expect(runModule(parseArgs(['build', '--dir', temp.dir]), io)).toBe(1);
    expect(err.join('\n')).toContain('ghost');
    expect(existsSync(join(temp.dir, 'dist-module'))).toBe(false);
  });

  it('init：生成配置与 client 入口并注入 package.json，重复执行幂等', () => {
    writeText(
      join(temp.dir, 'package.json'),
      JSON.stringify({ name: '@demo/risk-app', version: '0.1.0' }, null, 2),
    );
    writeText(
      join(temp.dir, 'src/pactor/risk-actions.ts'),
      `export const riskActions = { 'risk.enterPage': () => {} };\n`,
    );

    const first = createTestIo();
    expect(runModule(parseArgs(['init', '--dir', temp.dir]), first.io)).toBe(0);
    expect(existsSync(join(temp.dir, 'pactor.module.json'))).toBe(true);
    const client = readFileSync(join(temp.dir, 'module/client.ts'), 'utf8');
    expect(client).toContain('riskActions');
    expect(client).toContain('export const extensions');
    const pkg = JSON.parse(readFileSync(join(temp.dir, 'package.json'), 'utf8')) as {
      files: string[];
      exports: Record<string, string>;
      scripts: Record<string, string>;
      peerDependencies: Record<string, string>;
    };
    expect(pkg.files).toContain('dist-module');
    expect(pkg.exports['./manifest']).toBe('./dist-module/manifest.json');
    expect(pkg.exports['./client']).toBe('./dist-module/client/index.js');
    expect(pkg.scripts['build:module']).toBe('pactor module build');
    expect(pkg.scripts['pack:module']).toBe('pactor module pack');
    expect(pkg.peerDependencies['pactor-app']).toBeDefined();

    // 重复执行：文件已存在则跳过，不覆盖
    writeText(join(temp.dir, 'pactor.module.json'), `{\n  "id": "custom"\n}\n`);
    const second = createTestIo();
    expect(runModule(parseArgs(['init', '--dir', temp.dir]), second.io)).toBe(0);
    expect(second.out.join('\n')).toContain('已跳过: pactor.module.json');
    expect(readFileSync(join(temp.dir, 'pactor.module.json'), 'utf8')).toContain(
      'custom',
    );
  });
});
