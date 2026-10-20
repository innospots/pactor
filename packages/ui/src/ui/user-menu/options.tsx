import { Monitor, Moon, Sun } from 'lucide-react';
import type { ReactNode } from 'react';

import type { ThemePreference, UserStatus } from './types.js';

/** 在线状态（菜单顺序）；除颜色外每种状态还有独立图形：实心 / 横杠 / 圆环 */
export const userStatuses: { value: UserStatus; label: string }[] = [
  { value: 'available', label: '在线' },
  { value: 'busy', label: '忙碌' },
  { value: 'away', label: '离开' },
];

export const themes: {
  value: ThemePreference;
  label: string;
  icon: ReactNode;
}[] = [
  {
    value: 'light',
    label: '浅色',
    icon: <Sun size={14} strokeWidth={1.75} aria-hidden="true" />,
  },
  {
    value: 'dark',
    label: '深色',
    icon: <Moon size={14} strokeWidth={1.75} aria-hidden="true" />,
  },
  {
    value: 'system',
    label: '跟随系统',
    icon: <Monitor size={14} strokeWidth={1.75} aria-hidden="true" />,
  },
];

export const statusLabel = (status: UserStatus): string =>
  userStatuses.find((option) => option.value === status)?.label ?? status;
