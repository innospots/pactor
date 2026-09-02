import { Registry } from '@pactor/core';
import type { ComponentType } from 'react';

import { ShadcnAdminLayout } from './admin/ShadcnAdminLayout.js';
import { ShadcnBlankLayout } from './basic/ShadcnBlankLayout.js';
import { ShadcnLandingLayout } from './basic/ShadcnLandingLayout.js';
import { ShadcnLoginLayout } from './basic/ShadcnLoginLayout.js';

/** 布局组件类型（各布局 props 不同，注册表按通用组件存储） */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LayoutComponent = ComponentType<any>;

/** LayoutRegistry：布局类型名 → 布局组件（复用 core Registry） */
export type LayoutRegistry = Registry<LayoutComponent>;

/**
 * registerShadcnLayouts：向 LayoutRegistry 注册 shadcn 实现的四种布局
 * （类型名：admin / blank / login / landing）。
 */
export function registerShadcnLayouts(registry: LayoutRegistry): void {
  registry.register('admin', ShadcnAdminLayout);
  registry.register('blank', ShadcnBlankLayout);
  registry.register('login', ShadcnLoginLayout);
  registry.register('landing', ShadcnLandingLayout);
}

/**
 * createShadcnLayoutRegistry（设计决策 D5）：预注册 shadcn 版
 * admin / blank / login / landing 四种布局组件。
 * 业务可继续 register 自定义布局类型。
 */
export function createShadcnLayoutRegistry(): LayoutRegistry {
  const registry = new Registry<LayoutComponent>('LayoutRegistry');
  registerShadcnLayouts(registry);
  return registry;
}

/**
 * resolveLayout（设计决策 D5）：按类型名解析布局组件；
 * 未命中返回 ShadcnBlankLayout 并 console.warn（不抛错，不崩页面）。
 */
export function resolveLayout(
  registry: LayoutRegistry,
  type: string,
): LayoutComponent {
  const component = registry.get(type);
  if (component === undefined) {
    console.warn(
      `[pactor-layout] unknown layout type "${type}", fallback to BlankLayout`,
    );
    return ShadcnBlankLayout;
  }
  return component;
}
