import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { deriveModuleId, initModule } from './init.js';

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
      const config = JSON.parse(readFileSync(join(dir, 'pactor.module.json'), 'utf8')) as {
        id: string;
      };
      expect(config.id).toBe('pactor-app-risk-app');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
