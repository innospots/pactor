import { readFileSync } from 'node:fs';

import { Registry } from '@pactor-app/core';
import { describe, expect, it } from 'vitest';

import {
  createShadcnComponentRegistry,
  registerShadcnComponents,
} from '../../src/components/index.js';

/** 内置组件类型名硬编码清单（契约断言，替代原跨 kit 注册表同构断言） */
const BUILTIN_TYPES = [
  'Page',
  'Grid',
  'Flex',
  'Card',
  'Button',
  'Alert',
  'Statistic',
  'Text',
  'Tabs',
  'Table',
  'Form',
  'Input',
  'Select',
  'Layout',
  'Header',
  'Sider',
  'Content',
  'Footer',
  'Menu',
  'Link',
];

describe('组件注册入口', () => {
  it('createShadcnComponentRegistry 注册后 20 个类型名全部可解析', () => {
    const registry = createShadcnComponentRegistry();
    for (const type of BUILTIN_TYPES) {
      expect(registry.has(type), type).toBe(true);
    }
  });

  it('createShadcnComponentRegistry 的类型名集合恰为 20 个内置类型（硬编码断言）', () => {
    const registry = createShadcnComponentRegistry();
    expect(registry.list().sort()).toEqual([...BUILTIN_TYPES].sort());
  });

  it('registerShadcnComponents 注册到外部 Registry', () => {
    const registry = new Registry<unknown>('ComponentRegistry');
    registerShadcnComponents(registry);
    expect(registry.list().sort()).toEqual([...BUILTIN_TYPES].sort());
  });
});

describe('样式表', () => {
  it('包 exports 暴露 ./styles.css 入口', () => {
    const pkg = JSON.parse(
      readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
    ) as { exports: Record<string, unknown>; sideEffects?: string[] };
    expect(pkg.exports['./styles.css']).toBeDefined();
    expect(pkg.sideEffects).toContain('./styles.css');
  });

  it('样式源文件定义 shadcn 语义令牌与 [data-pactor-theme=dark] 暗色覆盖，含 preflight 与动画层', () => {
    const css = readFileSync(
      new URL('../../src/styles.css', import.meta.url),
      'utf8',
    );
    for (const token of [
      '--background',
      '--foreground',
      '--card',
      '--popover',
      '--primary',
      '--secondary',
      '--muted',
      '--accent',
      '--destructive',
      '--border',
      '--input',
      '--ring',
      '--radius',
      '--chart-1',
      '--chart-5',
      '--sidebar',
      '--sidebar-ring',
    ]) {
      expect(css, token).toContain(token);
    }
    expect(css).toContain("[data-pactor-theme='dark']");
    // preflight 开启（官方基线）：完整 tailwindcss 导入 + tw-animate-css 动画层
    expect(css).toContain("@import 'tailwindcss'");
    expect(css).toContain("tw-animate-css");
    // accordion 关键帧（vendored Accordion 的 animate-[accordion-*] 任意值类依赖）
    expect(css).toContain('@keyframes accordion-down');
    expect(css).toContain('@keyframes accordion-up');
  });
});
