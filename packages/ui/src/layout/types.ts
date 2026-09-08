import type { PermissionChecker } from '@pactor-app/permission';
import type {
  MenuRegistry,
  NavigationBridge,
  RouteContext,
} from '@pactor-app/router';
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

/** ChatLayout 菜单项（显式 menu 数据驱动；registry 推导时由 router MenuItem 映射） */
export interface ChatLayoutMenuItem {
  key: string;
  label: string;
  /** 图标名（Icon 白名单，kebab/Pascal 均可） */
  icon?: string;
  /** label 后的角标 */
  badge?: string | number;
  /** label 右侧的状态圆点 */
  dot?: boolean;
  /** 分组标题（相邻同组只渲染一次） */
  group?: string;
  /** 置灰不可选 */
  disabled?: boolean;
  /** 路由路径（registry 推导时来自 MenuItem.path；bridge 导航与 active 推导用） */
  path?: string;
}

/** ChatLayout 品牌区（与 Sidebar 品牌区同构：{ title, logo? } 对象或任意 ReactNode） */
export type ChatLayoutBrand = { title: string; logo?: string } | ReactNode;

/**
 * ChatLayout props（设计决策 D7）：聊天场景外壳布局——
 * 品牌区 + 菜单侧栏 + 主内容区。
 *
 * 菜单来源优先级：`sidebar` 槽 > `menu` 显式数据 > `registry` 推导 > 空侧栏。
 * 导航行为：`onMenuSelect` 提供时调用之；否则有 `bridge` 且项有 `path` 时
 * `bridge.push(path)`。高亮推导：`activeMenuKey` > `route` > `bridge` 订阅。
 */
export interface ChatLayoutProps {
  /** 品牌区（{ title, logo } 对象或任意 ReactNode） */
  brand?: ChatLayoutBrand;
  /** 显式菜单数据；提供时优先于 registry 推导 */
  menu?: ChatLayoutMenuItem[];
  /** 菜单注册表（app-shell 注入）；无 menu 时据此推导菜单 */
  registry?: MenuRegistry;
  /** 导航桥（app-shell 注入）；默认导航与 active 推导用 */
  bridge?: NavigationBridge;
  /** 路由上下文（测试友好，优先于 bridge 订阅） */
  route?: RouteContext;
  /** 权限检查器（registry 推导时过滤菜单） */
  permissionChecker?: PermissionChecker;
  /** 受控高亮项 key（优先于 route/bridge 推导） */
  activeMenuKey?: string;
  /** 菜单项点击回调（disabled 项不触发）；提供时替代默认导航 */
  onMenuSelect?: (key: string, item: ChatLayoutMenuItem) => void;
  /** 桌面端可折叠为 icon rail（透传 Sidebar；缺省 false） */
  collapsible?: boolean;
  /** 自由侧栏槽（提供时替代内建菜单） */
  sidebar?: ReactNode;
  /** 侧栏底部固定槽（渲染在滚动区之后，不随内容滚动） */
  sidebarFooter?: ReactNode;
  /** 主内容区 */
  children?: ReactNode;
}
