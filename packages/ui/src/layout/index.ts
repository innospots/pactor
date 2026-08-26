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

// shadcn 布局组件
export { ShadcnAdminLayout } from './admin/ShadcnAdminLayout.js';
export { ShadcnBlankLayout } from './basic/ShadcnBlankLayout.js';
export { ShadcnLoginLayout } from './basic/ShadcnLoginLayout.js';
export { ShadcnLandingLayout } from './basic/ShadcnLandingLayout.js';

// 布局注册表与解析（未命中回退 ShadcnBlankLayout 并告警）
export {
  createShadcnLayoutRegistry,
  registerShadcnLayouts,
  resolveLayout,
} from './registry.js';
export type { LayoutComponent, LayoutRegistry } from './registry.js';
