import { Registry } from 'pactor-core';
import type { LayoutComponent, LayoutRegistry } from 'pactor-ui-antd/layout';

import { RadixAdminLayout } from './admin/RadixAdminLayout.js';
import { RadixBlankLayout } from './basic/RadixBlankLayout.js';
import { RadixLandingLayout } from './basic/RadixLandingLayout.js';
import { RadixLoginLayout } from './basic/RadixLoginLayout.js';

/**
 * registerRadixLayouts：向 LayoutRegistry 注册 Radix 实现的四种布局
 * （类型名与 antd 版一致：admin / blank / login / landing）。
 */
export function registerRadixLayouts(registry: LayoutRegistry): void {
  registry.register('admin', RadixAdminLayout);
  registry.register('blank', RadixBlankLayout);
  registry.register('login', RadixLoginLayout);
  registry.register('landing', RadixLandingLayout);
}

/**
 * createRadixLayoutRegistry：预注册 Radix 版 admin / blank / login / landing
 * 的布局注册表；与 pactor-layout 的 createLayoutRegistry 类型名集合一致，
 * resolveLayout 的回退语义对其同样适用。业务可继续 register 自定义布局。
 */
export function createRadixLayoutRegistry(): LayoutRegistry {
  const registry = new Registry<LayoutComponent>('LayoutRegistry');
  registerRadixLayouts(registry);
  return registry;
}
