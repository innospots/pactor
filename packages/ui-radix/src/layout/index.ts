// Radix 布局组件（Radix kit）
export { RadixAdminLayout } from './admin/RadixAdminLayout.js';
export { RadixBlankLayout } from './basic/RadixBlankLayout.js';
export { RadixLoginLayout } from './basic/RadixLoginLayout.js';
export { RadixLandingLayout } from './basic/RadixLandingLayout.js';

// 布局注册表
export { createRadixLayoutRegistry, registerRadixLayouts } from './registry.js';

// props 契约类型：直接复用 pactor-ui-antd layout 层（antd 版）的导出，保证双实现契约一致
export type {
  AdminBrand,
  AdminLayoutConfig,
  AdminLayoutProps,
  BlankLayoutProps,
  LandingLayoutProps,
  LoginBrand,
  LoginLayoutProps,
} from 'pactor-ui-antd/layout';
