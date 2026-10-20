import type { CSSProperties, ReactNode, Ref } from 'react';

export type UserStatus = 'available' | 'busy' | 'away';
export type ThemePreference = 'light' | 'dark' | 'system';

export interface UserMenuUser {
  name: string;
  email: string;
  /** 身份徽标（如套餐 / 角色），展示在名字右侧 */
  plan?: string;
  avatarSrc?: string;
  avatarSrcSet?: string;
}

export interface UserMenuItem {
  label: string;
  icon?: ReactNode;
  /** 右侧快捷键提示，如 ['⌘', ','] */
  keys?: string[];
  onSelect?: () => void;
}

export interface UserMenuProps {
  user: UserMenuUser;
  /** 受控在线状态；与 onStatusChange 任一提供即显示状态点与内联状态切换 */
  status?: UserStatus;
  defaultStatus?: UserStatus;
  onStatusChange?: (status: UserStatus) => void;
  /** 受控主题偏好 */
  theme?: ThemePreference;
  defaultTheme?: ThemePreference;
  /** 仅上报选择；把主题应用到页面由调用方负责 */
  onThemeChange?: (theme: ThemePreference) => void;
  /** 显示内联浅色 / 深色 / 跟随系统切换（缺省 true） */
  showTheme?: boolean;
  /** 账户入口（建议 3–4 项） */
  items?: UserMenuItem[];
  /** 退出登录；返回 Promise 时菜单保持展开并显示进度，结束后关闭 */
  onSignOut?: () => void | Promise<unknown>;
  /** 退出项的快捷键提示 */
  signOutKeys?: string[];
  /** 面板相对触发器的对齐方式（缺省 end） */
  align?: 'start' | 'center' | 'end';
  /** 面板相对触发器的方向（缺省：sidebar 形态为 right，其余为 bottom） */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** 展示形态：default 为独立头像胶囊；sidebar 为侧边栏账户行——
   *  展开时整行展示头像 + 姓名 + 箭头，Sidebar 折叠为 icon 时
   *  由 group-data-[collapsible=icon] 自动收成头像方块 */
  variant?: 'default' | 'sidebar';
  /** 640px 以上在头像右侧展示姓名与箭头（sidebar 形态缺省开启） */
  showName?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** 触发器按钮 ref */
  ref?: Ref<HTMLButtonElement>;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
  /** 额外挂在触发器上的 class */
  triggerClassName?: string;
}
