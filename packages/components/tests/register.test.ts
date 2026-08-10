import { describe, expect, it } from 'vitest';

import {
  createBuiltinComponentRegistry,
  registerBuiltinComponents,
} from '../src/index.js';
import { Registry } from 'pactor-core';

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
  it('createBuiltinComponentRegistry 注册后 12 个类型名全部可解析', () => {
    const registry = createBuiltinComponentRegistry();
    for (const type of BUILTIN_TYPES) {
      expect(registry.has(type), type).toBe(true);
    }
  });

  it('registerBuiltinComponents 注册到外部 Registry', () => {
    const registry = new Registry<unknown>('ComponentRegistry');
    registerBuiltinComponents(registry);
    expect(registry.list().sort()).toEqual([...BUILTIN_TYPES].sort());
  });
});
