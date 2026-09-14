import type { CSSProperties } from 'react';

import {
  Alert as ShadcnAlert,
  AlertDescription,
  AlertTitle,
} from '../../../ui/alert.js';
import { Icon } from '../Icon/index.js';

/** DSL Alert 变体 */
export type AlertVariant = 'success' | 'info' | 'warning' | 'error';

export interface AlertProps {
  /** 提示主文案 */
  message?: string;
  /** 辅助说明文案 */
  description?: string;
  /** 变体，默认 info */
  variant?: AlertVariant;
  /** 是否显示图标；true 时按 variant 显示对应默认图标 */
  showIcon?: boolean;
  /** 自定义图标名（Icon 白名单，kebab-case / PascalCase 均可）；提供时隐含 showIcon */
  icon?: string;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/** DSL variant → vendored Alert 变体（error 映射 destructive） */
const variantMap = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'destructive',
} as const satisfies Record<AlertVariant, string>;

/** variant → 默认图标（Icon 白名单键；对齐 antd 语义四态） */
const defaultIconMap: Record<AlertVariant, string> = {
  success: 'check-circle',
  info: 'info',
  warning: 'warning',
  error: 'x-circle',
};

/**
 * Alert 适配器（shadcn kit）：message → AlertTitle，description → AlertDescription；
 * `showIcon` / `icon` 渲染前缀图标（vendored Alert 的 has-[>svg] 栅格自动让出图标列）
 */
export function Alert({
  message,
  description,
  variant = 'info',
  showIcon,
  icon,
  className,
  style,
}: AlertProps) {
  const iconName = icon ?? (showIcon === true ? defaultIconMap[variant] : undefined);
  return (
    <ShadcnAlert variant={variantMap[variant]} className={className} style={style}>
      {iconName ? <Icon name={iconName} size="sm" /> : null}
      {message ? <AlertTitle>{message}</AlertTitle> : null}
      {description ? <AlertDescription>{description}</AlertDescription> : null}
    </ShadcnAlert>
  );
}
