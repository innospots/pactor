// 布局契约类型（props 契约，本地定义）
export type {
  AdminBrand,
  AdminLayoutBreakpoint,
  AdminLayoutConfig,
  AdminLayoutMode,
  AdminLayoutProps,
  BlankLayoutProps,
  LandingLayoutProps,
  LoginBrand,
  LoginLayoutProps,
} from './types.js';

// 菜单工具
export { findMenuChain } from './admin/menu-chain.js';
export { collectDefaultOpenKeys } from './admin/menu-items.js';

// 布局组件
export { AdminLayout } from './admin/AdminLayout.js';
export { BlankLayout } from './basic/BlankLayout.js';
export { LoginLayout } from './basic/LoginLayout.js';
export { LandingLayout } from './basic/LandingLayout.js';

// 布局注册表与解析（未命中回退 BlankLayout 并告警）
export {
  createLayoutRegistry,
  registerBuiltinLayouts,
  resolveLayout,
} from './registry.js';
export type { LayoutComponent, LayoutRegistry } from './registry.js';
