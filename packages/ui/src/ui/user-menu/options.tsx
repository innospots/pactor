import { Monitor, Moon, Sun } from 'lucide-react';
import type { ReactNode } from 'react';

import type {
  LanguageOption,
  LanguagePreference,
  ThemePreference,
  UserStatus,
} from './types.js';

/** 在线状态（菜单顺序）；除颜色外每种状态还有独立图形：实心 / 横杠 / 圆环 */
export const userStatuses: {
  value: UserStatus;
  /** 默认中文文案（保留导出兼容；组件内按 labelKey 渲染） */
  label: string;
  labelKey: string;
}[] = [
  { value: 'available', label: '在线', labelKey: 'pactor.userMenu.statusAvailable' },
  { value: 'busy', label: '忙碌', labelKey: 'pactor.userMenu.statusBusy' },
  { value: 'away', label: '离开', labelKey: 'pactor.userMenu.statusAway' },
];

export const themes: {
  value: ThemePreference;
  label: string;
  labelKey: string;
  icon: ReactNode;
}[] = [
  {
    value: 'light',
    label: '浅色',
    labelKey: 'pactor.userMenu.themeLight',
    icon: <Sun size={14} strokeWidth={1.75} aria-hidden="true" />,
  },
  {
    value: 'dark',
    label: '深色',
    labelKey: 'pactor.userMenu.themeDark',
    icon: <Moon size={14} strokeWidth={1.75} aria-hidden="true" />,
  },
  {
    value: 'system',
    label: '跟随系统',
    labelKey: 'pactor.userMenu.themeSystem',
    icon: <Monitor size={14} strokeWidth={1.75} aria-hidden="true" />,
  },
];

/** 状态的默认中文文案（保留原 API） */
export const statusLabel = (status: UserStatus): string =>
  userStatuses.find((option) => option.value === status)?.label ?? status;

/** 状态的 i18n key；未知状态回退状态值本身 */
export const statusLabelKey = (status: UserStatus): string =>
  userStatuses.find((option) => option.value === status)?.labelKey ?? status;

/** 缺省语言选项：语言名使用其本语言书写，不随界面语言翻译；
 *  宿主经 UserMenu 的 languages prop 传入自己的列表即可扩展更多语言 */
export const defaultLanguages: LanguageOption[] = [
  { value: 'zh-CN', label: '中文' },
  { value: 'en-US', label: 'English' },
];

/** 缺省语言列表的兼容导出（等同 defaultLanguages） */
export const languages = defaultLanguages;

/** 当前语言的显示名：从语言列表中查找；未知值回退语言标签本身 */
export const languageLabel = (
  language: LanguagePreference,
  options: LanguageOption[] = defaultLanguages,
): string =>
  options.find((option) => option.value === language)?.label ?? language;
