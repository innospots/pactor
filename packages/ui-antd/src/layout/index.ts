// AdminLayout 与菜单工具
export { AdminLayout } from './admin/AdminLayout.js';
export type {
  AdminBrand,
  AdminLayoutConfig,
  AdminLayoutProps,
} from './admin/AdminLayout.js';
export { buildMenuItems, collectDefaultOpenKeys } from './admin/menu-items.js';
export { findMenuChain } from './admin/menu-chain.js';

// 基础布局
export { BlankLayout } from './basic/BlankLayout.js';
export type { BlankLayoutProps } from './basic/BlankLayout.js';
export { LoginLayout } from './basic/LoginLayout.js';
export type { LoginBrand, LoginLayoutProps } from './basic/LoginLayout.js';
export { LandingLayout } from './basic/LandingLayout.js';
export type { LandingLayoutProps } from './basic/LandingLayout.js';

// LayoutRegistry
export { createLayoutRegistry, resolveLayout } from './layout-registry.js';
export type { LayoutComponent, LayoutRegistry } from './layout-registry.js';
