import { readFileSync } from 'node:fs';

import { Registry } from 'pactor-core';
import { createBuiltinComponentRegistry } from 'pactor-ui-antd/components';
import { describe, expect, it } from 'vitest';

import {
  createRadixComponentRegistry,
  registerRadixComponents,
} from '../../src/components/index.js';

const BUILTIN_TYPES = [
  'Page',
  'Grid',
  'Flex',
  'Card',
  'Button',
  'Alert',
  'Statistic',
  'Tabs',
  'Table',
  'Form',
  'Input',
  'Select',
];

describe('组件注册入口', () => {
  it('createRadixComponentRegistry 注册后 12 个类型名全部可解析', () => {
    const registry = createRadixComponentRegistry();
    for (const type of BUILTIN_TYPES) {
      expect(registry.has(type), type).toBe(true);
    }
  });

  it('registerRadixComponents 注册到外部 Registry', () => {
    const registry = new Registry<unknown>('ComponentRegistry');
    registerRadixComponents(registry);
    expect(registry.list().sort()).toEqual([...BUILTIN_TYPES].sort());
  });
});

describe('契约一致性：类型名集合', () => {
  it('createRadixComponentRegistry 与 createBuiltinComponentRegistry 的 list() 相等', () => {
    const radix = createRadixComponentRegistry();
    const builtin = createBuiltinComponentRegistry();
    expect(radix.list().sort()).toEqual(builtin.list().sort());
  });
});

describe('样式表', () => {
  it('包 exports 暴露 ./styles.css 入口且文件存在', () => {
    const pkg = JSON.parse(
      readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
    ) as { exports: Record<string, unknown> };
    expect(pkg.exports['./styles.css']).toBeDefined();
    const css = readFileSync(
      new URL('../../styles.css', import.meta.url),
      'utf8',
    );
    expect(css).toContain('.pcr-btn');
  });
});
