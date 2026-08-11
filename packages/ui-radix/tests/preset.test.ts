/**
 * pactor-ui-radix 聚合包测试：
 * - 关键符号可从聚合包导入并使用（spec：聚合包 re-export）
 * - radixUiKit 预设形状（spec：radixUiKit 预设对象）
 * - 样式入口存在且聚合三个套件样式、exports 暴露（spec：合并样式入口）
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import {
  createRadixComponentRegistry,
  createRadixLayoutRegistry,
  RadixInteractionProvider,
  RadixOverlayHost,
  radixUiKit,
  registerRadixComponents,
  registerRadixLayouts,
} from '../src/index.js';

describe('聚合包 re-export：关键符号可用', () => {
  it('createRadixComponentRegistry 可导入并返回含内置组件的注册表', () => {
    expect(typeof createRadixComponentRegistry).toBe('function');
    const registry = createRadixComponentRegistry();
    expect(registry.has('Button')).toBe(true);
    expect(registry.has('Table')).toBe(true);
    expect(registry.has('Form')).toBe(true);
  });

  it('createRadixLayoutRegistry 可导入并返回含外壳布局的注册表', () => {
    expect(typeof createRadixLayoutRegistry).toBe('function');
    const registry = createRadixLayoutRegistry();
    expect(registry.has('admin')).toBe(true);
    expect(registry.has('blank')).toBe(true);
  });

  it('RadixOverlayHost / RadixInteractionProvider 可导入', () => {
    expect(RadixOverlayHost).toBeDefined();
    expect(RadixInteractionProvider).toBeDefined();
  });

  it('register 系列辅助函数也可从聚合包导入', () => {
    expect(typeof registerRadixComponents).toBe('function');
    expect(typeof registerRadixLayouts).toBe('function');
  });
});

describe('radixUiKit 预设对象', () => {
  it('三个槽位齐全且为对应 Radix 工厂/组件', () => {
    expect(radixUiKit.componentRegistry).toBe(createRadixComponentRegistry);
    expect(radixUiKit.layoutRegistry).toBe(createRadixLayoutRegistry);
    expect(radixUiKit.interactionKit.Provider).toBe(RadixInteractionProvider);
    expect(radixUiKit.interactionKit.OverlayHost).toBe(RadixOverlayHost);
  });
});

describe('合并样式入口', () => {
  const packageDir = dirname(dirname(fileURLToPath(import.meta.url)));
  const pkgPath = join(packageDir, 'package.json');
  const stylesPath = join(packageDir, 'styles.css');

  it('styles.css 存在且聚合三个套件样式表', () => {
    const css = readFileSync(stylesPath, 'utf8');
    // 合并为单文件（D1：直接拼接三包样式，不再有包路径 @import）——
    // 各层标志性选择器均应出现在合并产物中
    expect(css).toContain('.pcr-page');
    expect(css).toContain('.pcr-admin-layout');
    expect(css).toContain('.pcr-modal-overlay');
  });

  it('package.json exports 暴露 ./styles.css 且标注 sideEffects', () => {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as {
      exports: Record<string, unknown>;
      sideEffects: unknown;
    };
    expect(pkg.exports['./styles.css']).toBeDefined();
    expect(pkg.sideEffects).toContain('./styles.css');
  });
});
