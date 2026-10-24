import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type { ModulePackConfig } from './config.js';
import { emitModule, readProjectVersion } from './emit-manifest.js';
import { createTempDir, writeText } from './test-utils.js';

function makeConfig(overrides: Partial<ModulePackConfig> = {}): ModulePackConfig {
  return {
    id: 'demo',
    name: 'Demo Module',
    basePath: '/demo',
    yamlRoot: 'src/server/yaml',
    clientEntry: 'module/client.ts',
    actions: [],
    publicDir: 'public',
    target: 'innospots-web-shell@2',
    access: { default: 'authenticated' },
    tailwind: { enabled: false },
    rewrite: { absoluteApiToRelative: true },
    outDir: 'dist-module',
    ...overrides,
  };
}

describe('emit-manifest', () => {
  let temp: ReturnType<typeof createTempDir>;
  beforeEach(() => {
    temp = createTempDir();
  });
  afterEach(() => temp.cleanup());

  it('manifest 字段齐备且 version 与目标工程 package.json 同步', () => {
    writeText(
      join(temp.dir, 'package.json'),
      JSON.stringify({ name: '@demo/app', version: '1.2.3' }),
    );
    writeText(join(temp.dir, 'public', 'next.svg'), '<svg/>');
    const outDir = join(temp.dir, 'out');
    const warnings: string[] = [];

    const result = emitModule({
      config: makeConfig(),
      projectDir: temp.dir,
      outDir,
      site: { id: 'site', pages: [], menus: [], layouts: {} },
      pages: new Map([['login', { dsl: '1.0', page: { id: 'login' } }]]),
      clientEntry: 'client/index.js',
      styles: ['client/index.css'],
      warnings,
    });

    expect(result.manifest).toEqual({
      schemaVersion: '1',
      id: 'demo',
      name: 'Demo Module',
      version: '1.2.3',
      pactorVersionRange: '^1.54.0',
      basePath: '/demo',
      sitemap: 'dsl/sitemap.yaml',
      dslRoot: 'dsl',
      assetsRoot: 'assets',
      clientEntry: 'client/index.js',
      styles: ['client/index.css'],
    });
    // 目标工程未安装 pactor-app：回退 ^1.54.0 并告警
    expect(warnings.some((w) => w.includes('pactorVersionRange'))).toBe(true);

    const manifestOnDisk = JSON.parse(
      readFileSync(join(outDir, 'manifest.json'), 'utf8'),
    ) as Record<string, unknown>;
    expect(manifestOnDisk.version).toBe('1.2.3');
  });

  it('配置 server 入口时输出 serverEntry 与 apiPrefixes', () => {
    writeText(join(temp.dir, 'package.json'), JSON.stringify({ version: '0.1.0' }));
    const result = emitModule({
      config: makeConfig({
        serverEntry: 'module/server.ts',
        apiPrefixes: ['/api/risk-analysis'],
      }),
      projectDir: temp.dir,
      outDir: join(temp.dir, 'out'),
      site: { id: 'site' },
      pages: new Map(),
      serverEntry: 'server/index.mjs',
      apiPrefixes: ['/api/risk-analysis'],
      warnings: [],
    });
    expect(result.manifest.serverEntry).toBe('server/index.mjs');
    expect(result.manifest.apiPrefixes).toEqual(['/api/risk-analysis']);
  });

  it('未配置 server 入口时 manifest 不含 server 字段', () => {
    writeText(join(temp.dir, 'package.json'), JSON.stringify({ version: '0.1.0' }));
    const result = emitModule({
      config: makeConfig(),
      projectDir: temp.dir,
      outDir: join(temp.dir, 'out'),
      site: { id: 'site' },
      pages: new Map(),
      warnings: [],
    });
    expect(result.manifest).not.toHaveProperty('serverEntry');
    expect(result.manifest).not.toHaveProperty('apiPrefixes');
  });

  it('落盘 dsl/sitemap.yaml、<pageId>.yaml 与 assets 副本', () => {    writeText(join(temp.dir, 'package.json'), JSON.stringify({ version: '0.1.0' }));
    writeText(join(temp.dir, 'public', 'skins', 'dark.css'), 'body{}');
    const outDir = join(temp.dir, 'out');

    emitModule({
      config: makeConfig(),
      projectDir: temp.dir,
      outDir,
      site: { id: 'site', pages: [{ id: 'login' }] },
      pages: new Map([['login', { page: { id: 'login' } }]]),
      warnings: [],
    });

    expect(readFileSync(join(outDir, 'dsl', 'sitemap.yaml'), 'utf8')).toContain(
      'id: site',
    );
    expect(readFileSync(join(outDir, 'dsl', 'login.yaml'), 'utf8')).toContain(
      'id: login',
    );
    expect(readFileSync(join(outDir, 'assets', 'skins', 'dark.css'), 'utf8')).toBe(
      'body{}',
    );
  });

  it('module-assets.json 含路径与 sha256', () => {
    writeText(join(temp.dir, 'package.json'), JSON.stringify({ version: '0.1.0' }));
    writeText(join(temp.dir, 'public', 'next.svg'), '<svg/>');
    const outDir = join(temp.dir, 'out');

    emitModule({
      config: makeConfig(),
      projectDir: temp.dir,
      outDir,
      site: { id: 'site' },
      pages: new Map(),
      warnings: [],
    });

    const assets = JSON.parse(
      readFileSync(join(outDir, 'module-assets.json'), 'utf8'),
    ) as { module: string; assets: { path: string; sha256: string; size: number }[] };
    expect(assets.module).toBe('demo');
    expect(assets.assets).toHaveLength(1);
    expect(assets.assets[0]!.path).toBe('next.svg');
    expect(assets.assets[0]!.sha256).toMatch(/^[0-9a-f]{64}$/);
  });

  it('目标工程安装 pactor-app 时推导其版本范围', () => {
    writeText(join(temp.dir, 'package.json'), JSON.stringify({ version: '0.1.0' }));
    writeText(
      join(temp.dir, 'node_modules', 'pactor-app', 'package.json'),
      JSON.stringify({ name: 'pactor-app', version: '1.54.5' }),
    );
    const warnings: string[] = [];
    const result = emitModule({
      config: makeConfig(),
      projectDir: temp.dir,
      outDir: join(temp.dir, 'out'),
      site: { id: 'site' },
      pages: new Map(),
      warnings,
    });
    expect(result.manifest.pactorVersionRange).toBe('^1.54.5');
    expect(warnings).toEqual([]);
  });

  it('readProjectVersion：缺失 package.json 回退 0.0.0', () => {
    expect(readProjectVersion(temp.dir)).toBe('0.0.0');
  });
});
