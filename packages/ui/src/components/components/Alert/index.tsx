import type { CSSProperties } from 'react';

import {
  Alert as ShadcnAlert,
  AlertDescription,
  AlertTitle,
} from '../../../ui/alert.js';

/** DSL Alert 变体 */
export type AlertVariant = 'success' | 'info' | 'warning' | 'error';

export interface AlertProps {
  /** 提示主文案 */
  message?: string;
  /** 辅助说明文案 */
  description?: string;
  /** 变体，默认 info */
  variant?: AlertVariant;
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

/** Alert 适配器（shadcn kit）：message → AlertTitle，description → AlertDescription */
export function Alert({ message, description, variant = 'info', className, style }: AlertProps) {
  return (
    <ShadcnAlert variant={variantMap[variant]} className={className} style={style}>
      {message ? <AlertTitle>{message}</AlertTitle> : null}
      {description ? <AlertDescription>{description}</AlertDescription> : null}
    </ShadcnAlert>
  );
}
