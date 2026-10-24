import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { deriveApiPrefix, deriveModuleId, initModule } from './init.js';

describe('deriveModuleId', () => {
  it('默认添加 pactor-app- 前缀', () => {
    expect(deriveModuleId('ai-risk-mesh')).toBe('pactor-app-ai-risk-mesh');
    expect(deriveModuleId('@demo/risk-app')).toBe('pactor-app-risk-app');
    expect(deriveModuleId('RiskApp')).toBe('pactor-app-risk-app');
  });

  it('已有 pactor-app- 前缀时不重复添加', () => {
    expect(deriveModuleId('pactor-app-ai-risk-mesh')).toBe('pactor-app-ai-risk-mesh');
    expect(deriveModuleId('@demo/pactor-app-console')).toBe('pactor-app-console');
  });

  it('异常输入回退为 pactor-app-module', () => {
    expect(deriveModuleId(undefined)).toBe('pactor-app-module');
    expect(deriveModuleId('')).toBe('pactor-app-module');
  });
});

describe('deriveApiPrefix', () => {
  it('去掉 pactor-app- 前缀并挂在 /api 下', () => {
    expect(deriveApiPrefix('pactor-app-risk-analysis')).toBe('/api/risk-analysis');
    expect(deriveApiPrefix('custom-id')).toBe('/api/custom-id');
  });

  it('空前缀回退为 /api/module', () => {
    expect(deriveApiPrefix('pactor-app-')).toBe('/api/module');
  });
});

describe('initModule overwrite', () => {
  function makeProject(): string {
    const dir = mkdtempSync(join(tmpdir(), 'module-pack-init-'));
    writeFileSync(
      join(dir, 'package.json'),
      JSON.stringify({ name: 'risk-app', version: '0.1.0' }),
    );
    return dir;
  }

  it('默认跳过已存在文件，overwrite 时覆盖并记入 overwritten', () => {
    const dir = makeProject();
    try {
      initModule({ dir });
      // 用户改过配置
      writeFileSync(join(dir, 'pactor.module.json'), '{\n  "id": "custom"\n}\n');

      const skipped = initModule({ dir });
      expect(skipped.skipped.join()).toContain('pactor.module.json');
      expect(readFileSync(join(dir, 'pactor.module.json'), 'utf8')).toContain('custom');

      const redone = initModule({ dir, overwrite: true });
      expect(redone.overwritten).toContain('pactor.module.json');
      expect(redone.overwritten).toContain('module/client.ts');
      expect(redone.overwritten).toContain('module/module.css');
      const config = JSON.parse(readFileSync(join(dir, 'pactor.module.json'), 'utf8')) as {
        id: string;
      };
      expect(config.id).toBe('pactor-app-risk-app');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe('initModule 模块入口脚手架', () => {
  function makeProject(name = 'risk-app'): string {
    const dir = mkdtempSync(join(tmpdir(), 'module-pack-init-'));
    writeFileSync(join(dir, 'package.json'), JSON.stringify({ name, version: '0.1.0' }));
    return dir;
  }

  it('默认生成 module.css，client 入口 import 它', () => {
    const dir = makeProject();
    try {
      const result = initModule({ dir });
      expect(result.created).toContain('module/module.css');
      expect(existsSync(join(dir, 'module/module.css'))).toBe(true);
      expect(readFileSync(join(dir, 'module/client.ts'), 'utf8')).toContain(
        "import './module.css'",
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('module.css 已存在时默认保留，即便 client.ts 需要新建', () => {
    const dir = makeProject();
    try {
      mkdirSync(join(dir, 'module'), { recursive: true });
      writeFileSync(join(dir, 'module/module.css'), '.custom { color: red; }\n');

      const result = initModule({ dir });
      expect(result.created).toContain('module/client.ts');
      expect(result.skipped.join('\n')).toContain('module/module.css');
      expect(readFileSync(join(dir, 'module/module.css'), 'utf8')).toContain('.custom');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('未开启 server 时不生成 server.ts，配置不含 serverEntry/apiPrefixes', () => {
    const dir = makeProject();
    try {
      const result = initModule({ dir });
      expect(existsSync(join(dir, 'module/server.ts'))).toBe(false);
      expect(result.warnings.join('\n')).not.toContain('serverEntry');
      const config = JSON.parse(
        readFileSync(join(dir, 'pactor.module.json'), 'utf8'),
      ) as Record<string, unknown>;
      expect(config).not.toHaveProperty('serverEntry');
      expect(config).not.toHaveProperty('apiPrefixes');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('server: true 生成 server.ts，写入 serverEntry/apiPrefixes 与 ./server export', () => {
    const dir = makeProject();
    try {
      const result = initModule({ dir, server: true });
      expect(result.created).toContain('module/server.ts');
      const server = readFileSync(join(dir, 'module/server.ts'), 'utf8');
      expect(server).toContain('export const handlers');
      expect(server).toContain("'/api/risk-app/hello'");

      const config = JSON.parse(
        readFileSync(join(dir, 'pactor.module.json'), 'utf8'),
      ) as Record<string, unknown>;
      expect(config.serverEntry).toBe('module/server.ts');
      expect(config.apiPrefixes).toEqual(['/api/risk-app']);

      const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')) as {
        exports: Record<string, string>;
      };
      expect(pkg.exports['./server']).toBe('./dist-module/server/index.mjs');
      // 配置已由 init 写全，不应再提示手动补齐
      expect(result.warnings.join('\n')).not.toContain('serverEntry');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('server: true 且 server.ts 已存在：默认保留原文件', () => {
    const dir = makeProject();
    try {
      initModule({ dir, server: true });
      writeFileSync(join(dir, 'module/server.ts'), 'export const handlers = { custom: 1 };\n');

      const again = initModule({ dir, server: true });
      expect(again.skipped.join('\n')).toContain('module/server.ts');
      expect(readFileSync(join(dir, 'module/server.ts'), 'utf8')).toContain('custom: 1');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('server: true 但配置已存在且未声明 serverEntry：跳过配置并提示补齐', () => {
    const dir = makeProject();
    try {
      initModule({ dir }); // 先生成不含 serverEntry 的配置
      const result = initModule({ dir, server: true });
      expect(result.skipped.join('\n')).toContain('pactor.module.json');
      expect(existsSync(join(dir, 'module/server.ts'))).toBe(true);
      expect(result.warnings.join('\n')).toContain('serverEntry');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
