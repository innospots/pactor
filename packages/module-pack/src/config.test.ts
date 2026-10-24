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
});
