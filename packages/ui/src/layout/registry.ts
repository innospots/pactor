import { Registry } from '@pactor-app/core';
import type { ComponentType } from 'react';

import { AdminLayout } from './admin/AdminLayout.js';
import { BlankLayout } from './basic/BlankLayout.js';
import { ChatLayout } from './chat/ChatLayout.js';
import { LandingLayout } from './basic/LandingLayout.js';
import { LoginLayout } from './basic/LoginLayout.js';

/** 布局组件类型（各布局 props 不同，注册表按通用组件存储） */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LayoutComponent = ComponentType<any>;

/** LayoutRegistry：布局类型名 → 布局组件（复用 core Registry） */
export type LayoutRegistry = Registry<LayoutComponent>;

/**
 * registerBuiltinLayouts：向 LayoutRegistry 注册内置实现的五种布局
 * （类型名：admin / blank / login / landing / chat）。
 */
export function registerBuiltinLayouts(registry: LayoutRegistry): void {
  registry.register('admin', AdminLayout);
  registry.register('blank', BlankLayout);
  registry.register('login', LoginLayout);
  registry.register('landing', LandingLayout);
  registry.register('chat', ChatLayout);
}

/**
 * createLayoutRegistry（设计决策 D5）：预注册内置版
 * admin / blank / login / landing / chat 五种布局组件。
 * 业务可继续 register 自定义布局类型。
 */
export function createLayoutRegistry(): LayoutRegistry {
  const registry = new Registry<LayoutComponent>('LayoutRegistry');
  registerBuiltinLayouts(registry);
  return registry;
}

/**
 * resolveLayout（设计决策 D5）：按类型名解析布局组件；
 * 未命中返回 BlankLayout 并 console.warn（不抛错，不崩页面）。
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
    return BlankLayout;
  }
  return component;
}
