import type { CSSProperties, ReactNode, Ref } from 'react';

export type UserStatus = 'available' | 'busy' | 'away';
export type ThemePreference = 'light' | 'dark' | 'system';
/** 语言偏好（BCP 47 标签，如 zh-CN / en-US / ja-JP） */
export type LanguagePreference = string;

/** 语言选项：语言名使用其本语言书写，不随界面语言翻译 */
export interface LanguageOption {
  /** BCP 47 语言标签，如 zh-CN / en-US / ja-JP */
  value: LanguagePreference;
  /** 该语言的本语言显示名，如 中文 / English / 日本語 */
  label: string;
}

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
  /** 非受控初始主题；缺省读取 documentElement 当前 data-pactor-theme（未设置视为 system） */
  defaultTheme?: ThemePreference;
  /** 主题选择回调；选择同时应用到 documentElement（light / dark 写 data-pactor-theme，system 移除） */
  onThemeChange?: (theme: ThemePreference) => void;
  /** 显示内联浅色 / 深色 / 跟随系统切换（缺省 true） */
  showTheme?: boolean;
  /** 受控语言偏好 */
  language?: LanguagePreference;
  /** 非受控初始语言；缺省读取 localStorage 的 pactor.locale，
   *  未设置时取 languages 首项（缺省列表即 zh-CN） */
  defaultLanguage?: LanguagePreference;
  /** 语言选择回调；非受控时选择同时写入 localStorage 的 pactor.locale */
  onLanguageChange?: (language: LanguagePreference) => void;
  /** 显示“切换语言”子菜单（缺省 false） */
  showLanguage?: boolean;
  /** 可选语言列表（缺省 中文 / English）；追加选项即可扩展更多语言，
   *  value 为语言标签，label 为用该语言自身书写的显示名 */
  languages?: LanguageOption[];
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
