import type { CSSProperties } from 'react';

import {
  UserMenu as ShadcnUserMenu,
  type ThemePreference,
  type UserMenuUser,
  type UserStatus,
} from '../../../ui/user-menu/index.js';
import { Icon } from '../Icon/index.js';

/** 账户菜单用户 */
export interface UserMenuUserData {
  name: string;
  email: string;
  /** 身份徽标（如套餐 / 角色） */
  plan?: string;
  avatarSrc?: string;
  avatarSrcSet?: string;
}

/** 账户入口项 */
export interface UserMenuItemData {
  label: string;
  /** 选中事件值，缺省回退 label */
  value?: string;
  /** 图标名（Icon 白名单，kebab/Pascal 均可） */
  icon?: string;
  /** 右侧快捷键提示，如 ['⌘', ','] */
  keys?: string[];
}

export interface UserMenuProps {
  user: UserMenuUserData;
  /** 账户入口（建议 3–4 项） */
  items?: UserMenuItemData[];
  /** 受控在线状态；与 onStatusChange 任一提供即显示状态点与内联状态切换 */
  status?: UserStatus;
  defaultStatus?: UserStatus;
  /** 受控主题偏好 */
  theme?: ThemePreference;
  /** 非受控初始主题；缺省读取 documentElement 当前 data-pactor-theme（未设置视为 system） */
  defaultTheme?: ThemePreference;
  /** 显示内联浅色 / 深色 / 跟随系统切换（缺省 true），选择即应用到页面 */
  showTheme?: boolean;
  /** 640px 以上在头像右侧展示姓名与箭头（sidebar 形态缺省开启） */
  showName?: boolean;
  /** 面板相对触发器的对齐方式（缺省 end） */
  align?: 'start' | 'center' | 'end';
  /** 面板相对触发器的方向（缺省：sidebar 形态为 right，其余为 bottom） */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** 展示形态：default 为独立头像胶囊；sidebar 为侧栏账户行——
   *  展开时整行展示头像 + 姓名 + 箭头，Sidebar 折叠为 icon 时
   *  自动收成头像圆钮（放在 Sidebar 的 sidebarFooter 槽中使用） */
  variant?: 'default' | 'sidebar';
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** 账户入口点击事件，传出该项 value（缺省 label） */
  onSelect?: (value: string) => void;
  /** 主题选择回调；选择同时应用到 documentElement（light / dark 写 data-pactor-theme，system 移除） */
  onThemeChange?: (theme: ThemePreference) => void;
  /** 在线状态选择回调 */
  onStatusChange?: (status: UserStatus) => void;
  /** 退出登录；返回 Promise 时菜单保持展开并显示进度，结束后关闭 */
  onSignOut?: () => void | Promise<unknown>;
  /** 退出项快捷键提示 */
  signOutKeys?: string[];
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
  /** 额外挂在触发器上的 class */
  triggerClassName?: string;
}

/**
 * UserMenu 适配器（shadcn kit）：头像账户菜单——账号信息头 /
 * 账户入口 / 内联主题与在线状态切换 / 退出登录；640px 以下自动切换
 * 为底部抽屉。视觉与交互设计参考 Arc UI
 * （https://uiarc.dev/components/user-menu）。
 *
 * 主题与状态选择保持菜单展开并分别经 onThemeChange / onStatusChange
 * 上报；主题选择同时写入 documentElement 的 data-pactor-theme（system
 * 移除属性）；账户入口经 onSelect 传出 value；onSignOut 返回 Promise 时
 * 退出项显示进度，Promise 落定后关闭。
 *
 * `variant="sidebar"` 用于 Sidebar 的 sidebarFooter 槽：展开时整行
 * 展示头像 / 姓名 / 箭头，Sidebar 折叠为 icon rail 时自动收成头像圆钮。
 */
export function UserMenu({
  user,
  items = [],
  status,
  defaultStatus,
  theme,
  defaultTheme,
  showTheme,
  showName,
  align,
  side,
  variant,
  open,
  defaultOpen,
  onOpenChange,
  onSelect,
  onThemeChange,
  onStatusChange,
  onSignOut,
  signOutKeys,
  className,
  style,
  triggerClassName,
}: UserMenuProps) {
  const mappedItems = items.map((item) => ({
    label: item.label,
    icon: item.icon ? <Icon name={item.icon} size="sm" /> : undefined,
    keys: item.keys,
    onSelect: () => onSelect?.(item.value ?? item.label),
  }));

  return (
    <ShadcnUserMenu
      user={user as UserMenuUser}
      items={mappedItems}
      status={status}
      defaultStatus={defaultStatus}
      theme={theme}
      defaultTheme={defaultTheme}
      showTheme={showTheme}
      showName={showName}
      align={align}
      side={side}
      variant={variant}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      onThemeChange={onThemeChange}
      onStatusChange={onStatusChange}
      onSignOut={onSignOut}
      signOutKeys={signOutKeys}
      className={className}
      style={style}
      triggerClassName={triggerClassName}
    />
  );
}
