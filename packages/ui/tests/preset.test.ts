/**
 * @pactor-app/ui 聚合包测试：
 * - 关键符号可从聚合包导入并使用（三层 re-export）
 * - shadcnUiKit 预设形状（三槽位为对应 shadcn 工厂/组件，与 @pactor-app/app
 *   UiKit 类型结构兼容——由 typecheck 保证，这里断言运行期解析）
 */
import { describe, expect, it } from 'vitest';

import {
  createShadcnComponentRegistry,
  createShadcnLayoutRegistry,
  registerShadcnComponents,
  registerShadcnLayouts,
  ShadcnInteractionProvider,
  ShadcnOverlayHost,
  shadcnUiKit,
} from '../src/index.js';

describe('聚合包 re-export：关键符号可用', () => {
  it('createShadcnComponentRegistry 可导入并返回含内置组件的注册表', () => {
    expect(typeof createShadcnComponentRegistry).toBe('function');
    const registry = createShadcnComponentRegistry();
    expect(registry.has('Button')).toBe(true);
    expect(registry.has('Table')).toBe(true);
    expect(registry.has('Form')).toBe(true);
  });

  it('createShadcnLayoutRegistry 可导入并返回含外壳布局的注册表', () => {
    expect(typeof createShadcnLayoutRegistry).toBe('function');
    const registry = createShadcnLayoutRegistry();
    expect(registry.has('admin')).toBe(true);
    expect(registry.has('blank')).toBe(true);
  });

  it('ShadcnOverlayHost / ShadcnInteractionProvider 可导入', () => {
    expect(ShadcnOverlayHost).toBeDefined();
    expect(ShadcnInteractionProvider).toBeDefined();
  });

  it('register 系列辅助函数也可从聚合包导入', () => {
    expect(typeof registerShadcnComponents).toBe('function');
    expect(typeof registerShadcnLayouts).toBe('function');
  });
});

describe('shadcnUiKit 预设对象', () => {
  it('三个槽位齐全且为对应 shadcn 工厂/组件', () => {
    expect(shadcnUiKit.componentRegistry).toBe(createShadcnComponentRegistry);
    expect(shadcnUiKit.layoutRegistry).toBe(createShadcnLayoutRegistry);
    expect(shadcnUiKit.interactionKit.Provider).toBe(ShadcnInteractionProvider);
    expect(shadcnUiKit.interactionKit.OverlayHost).toBe(ShadcnOverlayHost);
  });

  it('三个槽位工厂/组件运行期可解析（注册表可创建、组件为函数）', () => {
    const components = shadcnUiKit.componentRegistry();
    const layouts = shadcnUiKit.layoutRegistry();
    expect(components.list().length).toBeGreaterThan(0);
    expect(layouts.list().sort()).toEqual(['admin', 'blank', 'landing', 'login']);
    expect(typeof shadcnUiKit.interactionKit.Provider).toBe('function');
    expect(typeof shadcnUiKit.interactionKit.OverlayHost).toBe('function');
  });
});
