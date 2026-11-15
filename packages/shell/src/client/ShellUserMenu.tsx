import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
} from 'react';

import {
  UserMenu as KitUserMenu,
  type UserMenuProps as KitUserMenuProps,
} from '@pactor-app/ui/components';

import {
  applyShellMode,
  readShellMode,
  selectShellMode,
  SHELL_PREFERENCES_EVENT,
} from './skin.js';

/**
 * 外壳级 UserMenu 默认配置：由 AppShell / PactorShellHost 的 `userMenu`
 * prop 传入，经 context 作用于外壳内全部 DSL UserMenu；DSL 节点上
 * 显式声明的同名 props 优先于本配置。
 */
export interface ShellUserMenuConfig {
  /** 在线状态（头像状态点 + 菜单内联切换），缺省 true */
  showStatus?: boolean;
  /** 浅色 / 深色 / 跟随系统内联切换，缺省 true；选择与外壳外观模式
   *  （pactor.mode 持久化 + SkinHeadScript 首屏契约）同步 */
  showTheme?: boolean;
  /** 「界面密度」内联切换，缺省 true */
  showSize?: boolean;
  /** 「切换语言」子菜单，缺省 true */
  showLanguage?: boolean;
  /** 可选语言列表（透传 UI kit UserMenu，缺省 中文 / English） */
  languages?: KitUserMenuProps['languages'];
  /** 密度选项（透传 UI kit UserMenu，缺省 紧凑 / 默认 / 宽松） */
  sizes?: KitUserMenuProps['sizes'];
}

export const ShellUserMenuConfigContext = createContext<ShellUserMenuConfig | null>(null);

function subscribePreferences(onChange: () => void): () => void {
  window.addEventListener('storage', onChange);
  window.addEventListener(SHELL_PREFERENCES_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(SHELL_PREFERENCES_EVENT, onChange);
  };
}

function subscribeSystemDark(onChange: () => void): () => void {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

/**
 * 外壳内 DSL `UserMenu` 的实际实现：在 UI kit UserMenu 之上叠加
 * 外壳默认配置（在线状态 / 主题 / 密度 / 语言缺省全开）与外观模式同步
 * （主题选择持久化到 pactor.mode，并按外壳契约规整 data-pactor-theme，
 * 与 SkinHeadScript / SkinGallery 保持一致）。由 PactorShellHost 内建
 * 注册为 `UserMenu`，宿主 components 同名覆盖优先。
 */
export function ShellUserMenu(props: KitUserMenuProps) {
  const config = useContext(ShellUserMenuConfigContext);

  const showStatus = config?.showStatus ?? true;
  const showTheme = props.showTheme ?? config?.showTheme ?? true;
  const showSize = props.showSize ?? config?.showSize ?? true;
  const showLanguage = props.showLanguage ?? config?.showLanguage ?? true;

  // 受控主题：跟随外壳外观模式（SkinGallery 等处的切换同步回显）；
  // DSL 显式传 theme 时尊重受控值，不接管
  const mode = useSyncExternalStore(
    subscribePreferences,
    () => readShellMode(),
    () => 'system' as const,
  );
  const systemDark = useSyncExternalStore(
    subscribeSystemDark,
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
    () => false,
  );

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    selectShellMode(theme);
    applyShellMode(theme, systemDark);
    props.onThemeChange?.(theme);
  };

  // 在线状态：kit 仅在 status / onStatusChange 任一提供时展示；
  // 缺省由包装层自持状态（初始 available），DSL 受控 status 时透传
  const [innerStatus, setInnerStatus] = useState(props.defaultStatus ?? 'available');
  const handleStatusChange = (status: 'available' | 'busy' | 'away') => {
    setInnerStatus(status);
    props.onStatusChange?.(status);
  };
  const statusProps =
    showStatus && props.status === undefined
      ? { status: innerStatus, onStatusChange: handleStatusChange }
      : { status: props.status, onStatusChange: props.onStatusChange };

  const themeProps =
    showTheme && props.theme === undefined
      ? { theme: mode, onThemeChange: handleThemeChange }
      : { theme: props.theme, defaultTheme: props.defaultTheme, onThemeChange: props.onThemeChange };

  return (
    <KitUserMenu
      {...props}
      {...statusProps}
      {...themeProps}
      showTheme={showTheme}
      showSize={showSize}
      showLanguage={showLanguage}
      languages={props.languages ?? config?.languages}
      sizes={props.sizes ?? config?.sizes}
    />
  );
}
