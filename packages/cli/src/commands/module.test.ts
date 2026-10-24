import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { parseArgs } from '../args.js';
import { createTempDir, createTestIo, writeText } from '../test-utils.js';
import { runModule } from './module.js';

/** 写文本文件（自动创建父目录） */
function write(file: string, content: string): void {
  mkdirSync(dirname(file), { recursive: true });
  writeText(file, content);
}

/** 最小可构建工程（纯 DSL：无 client entry） */
function createModuleProject(dir: string): void {
  write(
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
  write(
    join(dir, 'pactor.module.json'),
    JSON.stringify({ id: 'demo', name: 'Demo', basePath: '/demo' }),
  );
  write(
    join(dir, 'src/server/yaml/sitemap.yaml'),
    `id: site
auth: { loginPath: /login }
pages:
  - { id: login, path: /login, title: 登录, public: true }
menus: []
`,
  );
  write(
    join(dir, 'src/server/yaml/login.yaml'),
    `dsl: '1.0'\npage: { id: login, title: 登录 }\nbody:\n  type: LoginForm\n`,
  );
}

/** 带 server entry 的最小工程 */
function createServerModuleProject(dir: string): void {
  createModuleProject(dir);
  write(
    join(dir, 'pactor.module.json'),
    JSON.stringify({
      id: 'demo',
      name: 'Demo',
      basePath: '/demo',
      serverEntry: 'module/server.ts',
      apiPrefixes: ['/api/demo'],
    }),
  );
  write(
    join(dir, 'package.json'),
    JSON.stringify({
      name: '@demo/app',
      version: '0.1.0',
      files: ['dist-module'],
      exports: {
        './manifest': './dist-module/manifest.json',
        './client': './dist-module/client/index.js',
        './server': './dist-module/server/index.mjs',
      },
    }),
  );
  write(
    join(dir, 'module/server.ts'),
    `export const handlers = {
  '/api/demo/hello': { GET: () => Response.json({ code: 0, data: 'hi', message: 'ok' }) },
};
`,
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
    expect(out.join('\n')).toContain('server 未打包');
    const manifest = JSON.parse(
      readFileSync(join(temp.dir, 'dist-module', 'manifest.json'), 'utf8'),
    ) as Record<string, unknown>;
    expect(manifest.id).toBe('demo');
    expect(manifest.version).toBe('0.1.0');
  });

  it('build：server entry 打包并在摘要中标注', () => {
    createServerModuleProject(temp.dir);
    const { io, out } = createTestIo();
    expect(runModule(parseArgs(['build', '--dir', temp.dir]), io)).toBe(0);
    expect(out.join('\n')).toContain('server 已打包');
    expect(existsSync(join(temp.dir, 'dist-module', 'server', 'index.mjs'))).toBe(true);
    const manifest = JSON.parse(
      readFileSync(join(temp.dir, 'dist-module', 'manifest.json'), 'utf8'),
    ) as Record<string, unknown>;
    expect(manifest.serverEntry).toBe('server/index.mjs');
    expect(manifest.apiPrefixes).toEqual(['/api/demo']);
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
    write(
      join(temp.dir, 'src/server/yaml/sitemap.yaml'),
      `id: site\npages:\n  - { id: ghost, path: /ghost, title: 缺失 }\nmenus: []\n`,
    );
    const { io, err } = createTestIo();
    expect(runModule(parseArgs(['build', '--dir', temp.dir]), io)).toBe(1);
    expect(err.join('\n')).toContain('ghost');
    expect(existsSync(join(temp.dir, 'dist-module'))).toBe(false);
  });

  it('init：生成配置与 client 入口并注入 package.json，重复执行幂等', () => {
    write(
      join(temp.dir, 'package.json'),
      JSON.stringify({ name: '@demo/risk-app', version: '0.1.0' }, null, 2),
    );
    write(
      join(temp.dir, 'src/pactor/risk-actions.ts'),
      `export const riskActions = { 'risk.enterPage': () => {} };\n`,
    );

    const first = createTestIo();
    expect(runModule(parseArgs(['init', '--dir', temp.dir]), first.io)).toBe(0);
    expect(existsSync(join(temp.dir, 'pactor.module.json'))).toBe(true);
    const client = readFileSync(join(temp.dir, 'module/client.ts'), 'utf8');
    expect(client).toContain('riskActions');
    expect(client).toContain('export const extensions');
    expect(client).toContain("import './module.css'");
    expect(existsSync(join(temp.dir, 'module/module.css'))).toBe(true);
    expect(existsSync(join(temp.dir, 'module/server.ts'))).toBe(false);
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
    write(join(temp.dir, 'pactor.module.json'), `{\n  "id": "custom"\n}\n`);
    const second = createTestIo();
    expect(runModule(parseArgs(['init', '--dir', temp.dir]), second.io)).toBe(0);
    expect(second.out.join('\n')).toContain('已跳过: pactor.module.json');
    expect(readFileSync(join(temp.dir, 'pactor.module.json'), 'utf8')).toContain(
      'custom',
    );
  });

  it('init：注入 publish:module 脚本', () => {
    write(
      join(temp.dir, 'package.json'),
      JSON.stringify({ name: '@demo/risk-app', version: '0.1.0' }, null, 2),
    );
    const { io } = createTestIo();
    expect(runModule(parseArgs(['init', '--dir', temp.dir]), io)).toBe(0);
    const pkg = JSON.parse(readFileSync(join(temp.dir, 'package.json'), 'utf8')) as {
      scripts: Record<string, string>;
    };
    expect(pkg.scripts['publish:module']).toBe('pactor module publish');
  });

  it('init --server：生成 server.ts 并写入 serverEntry/apiPrefixes', () => {
    write(
      join(temp.dir, 'package.json'),
      JSON.stringify({ name: '@demo/risk-app', version: '0.1.0' }, null, 2),
    );
    const { io, err } = createTestIo();
    expect(runModule(parseArgs(['init', '--dir', temp.dir, '--server']), io)).toBe(0);

    expect(existsSync(join(temp.dir, 'module/server.ts'))).toBe(true);
    expect(readFileSync(join(temp.dir, 'module/server.ts'), 'utf8')).toContain(
      'export const handlers',
    );
    const config = JSON.parse(
      readFileSync(join(temp.dir, 'pactor.module.json'), 'utf8'),
    ) as { serverEntry?: string; apiPrefixes?: string[] };
    expect(config.serverEntry).toBe('module/server.ts');
    expect(config.apiPrefixes).toEqual(['/api/risk-app']);
    const pkg = JSON.parse(readFileSync(join(temp.dir, 'package.json'), 'utf8')) as {
      exports: Record<string, string>;
    };
    expect(pkg.exports['./server']).toBe('./dist-module/server/index.mjs');
    // 配置由 init 写全，不应再提示手动补齐
    expect(err.join('\n')).not.toContain('serverEntry');
  });

  it('init：检测 module/server.ts 注入 ./server export 并提示补齐 serverEntry/apiPrefixes', () => {
    write(
      join(temp.dir, 'package.json'),
      JSON.stringify({ name: '@demo/risk-app', version: '0.1.0' }, null, 2),
    );
    write(join(temp.dir, 'module/server.ts'), 'export const handlers = {};\n');
    const { io, err } = createTestIo();
    expect(runModule(parseArgs(['init', '--dir', temp.dir]), io)).toBe(0);
    const pkg = JSON.parse(readFileSync(join(temp.dir, 'package.json'), 'utf8')) as {
      exports: Record<string, string>;
    };
    expect(pkg.exports['./server']).toBe('./dist-module/server/index.mjs');
    expect(err.join('\n')).toContain('serverEntry');
    // 不写入半套 server 配置
    const config = JSON.parse(
      readFileSync(join(temp.dir, 'pactor.module.json'), 'utf8'),
    ) as Record<string, unknown>;
    expect(config).not.toHaveProperty('serverEntry');
    expect(config).not.toHaveProperty('apiPrefixes');
  });

  it('pack：默认自动递增 patch 版本号并生成对应 tgz', () => {
    createModuleProject(temp.dir);
    const { io, out } = createTestIo();
    const code = runModule(parseArgs(['pack', '--dir', temp.dir]), io);
    expect(code).toBe(0);
    const text = out.join('\n');
    expect(text).toContain('版本号已更新: @demo/app 0.1.0 → 0.1.1');
    expect(text).toContain('npm pack 完成: demo-app-0.1.1.tgz');
    expect(existsSync(join(temp.dir, 'demo-app-0.1.1.tgz'))).toBe(true);
    const pkg = JSON.parse(readFileSync(join(temp.dir, 'package.json'), 'utf8')) as {
      version: string;
    };
    expect(pkg.version).toBe('0.1.1');
    const manifest = JSON.parse(
      readFileSync(join(temp.dir, 'dist-module', 'manifest.json'), 'utf8'),
    ) as { version: string };
    expect(manifest.version).toBe('0.1.1');
  });

  it('pack：server bundle 在打包文件列表中', () => {
    createServerModuleProject(temp.dir);
    const { io, out } = createTestIo();
    expect(runModule(parseArgs(['pack', '--dir', temp.dir, '--no-bump']), io)).toBe(0);
    expect(out.join('\n')).toContain('npm pack --dry-run 检查通过');
    const tgz = join(temp.dir, 'demo-app-0.1.0.tgz');
    expect(existsSync(tgz)).toBe(true);
    const listing = execFileSync('tar', ['-tzf', tgz], { encoding: 'utf8' });
    expect(listing).toContain('package/dist-module/server/index.mjs');
  });

  it('pack：--bump minor 按次版本递增，--no-bump 保持原版本', () => {    createModuleProject(temp.dir);
    const minor = createTestIo();
    expect(runModule(parseArgs(['pack', '--dir', temp.dir, '--bump', 'minor']), minor.io)).toBe(0);
    expect(minor.out.join('\n')).toContain('0.1.0 → 0.2.0');

    const keep = createTestIo();
    expect(runModule(parseArgs(['pack', '--dir', temp.dir, '--no-bump']), keep.io)).toBe(0);
    expect(keep.out.join('\n')).not.toContain('版本号已更新');
    const pkg = JSON.parse(readFileSync(join(temp.dir, 'package.json'), 'utf8')) as {
      version: string;
    };
    expect(pkg.version).toBe('0.2.0');
  });

  it('pack：--bump 取值非法退出码 2', () => {
    createModuleProject(temp.dir);
    const { io, err } = createTestIo();
    expect(runModule(parseArgs(['pack', '--dir', temp.dir, '--bump', 'nope']), io)).toBe(2);
    expect(err.join('\n')).toContain('--bump 取值非法');
  });

  it('publish --dry-run：递增版本、打包并演练发布（不上传）', () => {
    createModuleProject(temp.dir);
    const { io, out } = createTestIo();
    const code = runModule(parseArgs(['publish', '--dir', temp.dir, '--dry-run']), io);
    expect(code).toBe(0);
    const text = out.join('\n');
    expect(text).toContain('版本号已更新: @demo/app 0.1.0 → 0.1.1');
    expect(text).toContain('npm publish --dry-run 通过（未实际上传）');
  });

  it('init：文件已存在时非 TTY 默认保留并提示 --force，--force 直接覆盖', () => {
    write(
      join(temp.dir, 'package.json'),
      JSON.stringify({ name: 'risk-app', version: '0.1.0' }, null, 2),
    );
    const first = createTestIo();
    expect(runModule(parseArgs(['init', '--dir', temp.dir]), first.io)).toBe(0);
    write(join(temp.dir, 'pactor.module.json'), `{\n  "id": "custom"\n}\n`);

    // 非 TTY（vitest 环境）：默认保留，输出提示
    const second = createTestIo();
    expect(runModule(parseArgs(['init', '--dir', temp.dir]), second.io)).toBe(0);
    expect(second.err.join('\n')).toContain('--force');
    expect(second.out.join('\n')).toContain('已跳过: pactor.module.json');
    expect(readFileSync(join(temp.dir, 'pactor.module.json'), 'utf8')).toContain('custom');

    // --force：覆盖并提示
    const forced = createTestIo();
    expect(runModule(parseArgs(['init', '--dir', temp.dir, '--force']), forced.io)).toBe(0);
    expect(forced.out.join('\n')).toContain('已重新生成: pactor.module.json');
    const config = JSON.parse(readFileSync(join(temp.dir, 'pactor.module.json'), 'utf8')) as {
      id: string;
    };
    expect(config.id).toBe('pactor-app-risk-app');
  });
});
