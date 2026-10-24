import { describe, expect, it } from 'vitest';

import { ConfigError, loadModuleConfig } from './config.js';
import { createTempDir, writeText } from './test-utils.js';

describe('loadModuleConfig', () => {
  it('access.default 缺省为 authenticated，支持 public', () => {
    const temp = createTempDir();
    try {
      writeText(
        `${temp.dir}/pactor.module.json`,
        JSON.stringify({ id: 'demo', name: 'Demo' }),
      );
      expect(loadModuleConfig(temp.dir).access.default).toBe('authenticated');

      writeText(
        `${temp.dir}/pactor.module.json`,
        JSON.stringify({ id: 'demo', name: 'Demo', access: { default: 'public' } }),
      );
      expect(loadModuleConfig(temp.dir).access.default).toBe('public');
    } finally {
      temp.cleanup();
    }
  });

  it('access.default 非法值抛 ConfigError', () => {
    const temp = createTempDir();
    try {
      writeText(
        `${temp.dir}/pactor.module.json`,
        JSON.stringify({ id: 'demo', access: { default: 'nope' } }),
      );
      expect(() => loadModuleConfig(temp.dir)).toThrow(ConfigError);
    } finally {
      temp.cleanup();
    }
  });

  it('遗留 demo 字段报错并引导迁移到 access.default', () => {
    const temp = createTempDir();
    try {
      writeText(
        `${temp.dir}/pactor.module.json`,
        JSON.stringify({ id: 'demo', demo: { public: true } }),
      );
      expect(() => loadModuleConfig(temp.dir)).toThrow(/access/);
    } finally {
      temp.cleanup();
    }
  });

  it('serverEntry / apiPrefixes 成对配置并保留在返回值中', () => {
    const temp = createTempDir();
    try {
      writeText(
        `${temp.dir}/pactor.module.json`,
        JSON.stringify({
          id: 'demo',
          serverEntry: 'module/server.ts',
          apiPrefixes: ['/api/risk-analysis'],
        }),
      );
      const config = loadModuleConfig(temp.dir);
      expect(config.serverEntry).toBe('module/server.ts');
      expect(config.apiPrefixes).toEqual(['/api/risk-analysis']);
    } finally {
      temp.cleanup();
    }
  });

  it('serverEntry 与 apiPrefixes 缺一或为空时抛 ConfigError', () => {
    const cases = [
      { id: 'demo', serverEntry: 'module/server.ts' },
      { id: 'demo', apiPrefixes: ['/api/risk-analysis'] },
      { id: 'demo', serverEntry: 'module/server.ts', apiPrefixes: [] },
    ];
    for (const raw of cases) {
      const temp = createTempDir();
      try {
        writeText(`${temp.dir}/pactor.module.json`, JSON.stringify(raw));
        expect(() => loadModuleConfig(temp.dir)).toThrow(ConfigError);
      } finally {
        temp.cleanup();
      }
    }
  });

  it('apiPrefixes 非法格式（裸 /api、尾斜杠、query、通配、:param）报错', () => {
    const invalid = ['/api', '/api/risk/', '/api/risk?x=1', '/api/risk/*', '/api/:id'];
    for (const prefix of invalid) {
      const temp = createTempDir();
      try {
        writeText(
          `${temp.dir}/pactor.module.json`,
          JSON.stringify({
            id: 'demo',
            serverEntry: 'module/server.ts',
            apiPrefixes: [prefix],
          }),
        );
        expect(() => loadModuleConfig(temp.dir)).toThrow(ConfigError);
      } finally {
        temp.cleanup();
      }
    }
  });

  it('保留前缀 /api/modules、/api/runtime 及其子路径不可声明', () => {
    for (const prefix of ['/api/modules', '/api/modules/x', '/api/runtime', '/api/runtime/x']) {
      const temp = createTempDir();
      try {
        writeText(
          `${temp.dir}/pactor.module.json`,
          JSON.stringify({
            id: 'demo',
            serverEntry: 'module/server.ts',
            apiPrefixes: [prefix],
          }),
        );
        expect(() => loadModuleConfig(temp.dir)).toThrow(/保留前缀/);
      } finally {
        temp.cleanup();
      }
    }
  });

  it('同一模块内前缀重复或互相包含报错', () => {
    const cases = [
      ['/api/risk', '/api/risk'],
      ['/api/risk', '/api/risk/data'],
    ];
    for (const apiPrefixes of cases) {
      const temp = createTempDir();
      try {
        writeText(
          `${temp.dir}/pactor.module.json`,
          JSON.stringify({ id: 'demo', serverEntry: 'module/server.ts', apiPrefixes }),
        );
        expect(() => loadModuleConfig(temp.dir)).toThrow(ConfigError);
      } finally {
        temp.cleanup();
      }
    }
  });

  it('启用 serverEntry 时 id 必须是 URL 安全字符', () => {
    const temp = createTempDir();
    try {
      writeText(
        `${temp.dir}/pactor.module.json`,
        JSON.stringify({
          id: 'risk app',
          serverEntry: 'module/server.ts',
          apiPrefixes: ['/api/risk'],
        }),
      );
      expect(() => loadModuleConfig(temp.dir)).toThrow(/URL|id/);
    } finally {
      temp.cleanup();
    }
  });

  it('未启用 serverEntry 时不校验前缀与 id URL 安全性', () => {
    const temp = createTempDir();
    try {
      writeText(
        `${temp.dir}/pactor.module.json`,
        JSON.stringify({ id: 'risk app' }),
      );
      expect(loadModuleConfig(temp.dir).apiPrefixes).toBeUndefined();
    } finally {
      temp.cleanup();
    }
  });
});
