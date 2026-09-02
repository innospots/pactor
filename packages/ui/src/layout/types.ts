import type { PermissionChecker } from '@pactor/permission';
import type {
  MenuRegistry,
  NavigationBridge,
  RouteContext,
} from '@pactor/router';
import type { ReactNode } from 'react';

/** 结构模式（管理后台外壳布局形态） */
export type AdminLayoutMode =
  /** 顶部 header + 下方 sidebar/content（缺省） */
  | 'top-side'
  /** 上-中-下：header + content + footer，无 sidebar */
  | 'top-bottom'
  /** 通栏侧边：sidebar 全高居左（含品牌区），header+content 居右 */
  | 'side-full'
  /** 侧边两列：一级菜单窄列 + 当前一级菜单的子菜单列 */
  | 'two-column';

/** 响应式断点（视口小于断点时 sidebar 自动收起） */
export type AdminLayoutBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/** 布局配置（bootstrap.layout 透传；缺省：header/sidebar 开，tabs/breadcrumb/footer 关，mode top-side） */
export interface AdminLayoutConfig {
  header?: boolean;
  sidebar?: boolean;
  tabs?: boolean;
  breadcrumb?: boolean;
  footer?: boolean;
  /** 结构模式，缺省 'top-side' */
  mode?: AdminLayoutMode;
  /** 固定顶部（内容区独立滚动），缺省 true；显式 false 关闭 */
  fixedHeader?: boolean;
  /** 固定侧边栏（sidebar 自身滚动，不随内容区），缺省 true；显式 false 关闭 */
  fixedSider?: boolean;
  /** sidebar 收起/展开 trigger */
  collapsible?: boolean;
  /** 初始收起（仅 collapsible 时有意义） */
  collapsed?: boolean;
  /** 视口小于断点时 sidebar 自动收起 */
  breakpoint?: AdminLayoutBreakpoint;
}

/** 品牌区 */
export interface AdminBrand {
  title: string;
  logo?: ReactNode;
}

/**
 * AdminLayout props（设计决策 D1）。
 *
 * `route` 优先用于选中态（测试友好）；未传时内部订阅 bridge
 * 自行 resolveRoute（生产用法）。
 */
export interface AdminLayoutProps {
  config?: AdminLayoutConfig;
  brand: AdminBrand;
  registry: MenuRegistry;
  bridge: NavigationBridge;
  route?: RouteContext;
  permissionChecker?: PermissionChecker;
  headerExtra?: ReactNode;
  children?: ReactNode;
}

export interface BlankLayoutProps {
  children?: ReactNode;
}

/** 登录页品牌区 */
export interface LoginBrand {
  title: string;
  logo?: ReactNode;
  description?: ReactNode;
}

export interface LoginLayoutProps {
  /** center：居中卡片；split：左品牌右表单（缺省 center） */
  variant?: 'center' | 'split';
  brand: LoginBrand;
  children?: ReactNode;
}

export interface LandingLayoutProps {
  /** 顶部导航插槽 */
  navbar?: ReactNode;
  /** 底部插槽 */
  footer?: ReactNode;
  children?: ReactNode;
}
