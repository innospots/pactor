import type { CSSProperties } from 'react';

import { Badge as ShadcnBadge } from '../../../ui/badge.js';

/** DSL Badge 变体 */
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export interface BadgeProps {
  /** 徽标文本 */
  text?: string;
  /** 变体，默认 default */
  variant?: BadgeVariant;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/** Badge 适配器（shadcn kit）：text / variant → vendored Badge */
export function Badge({ text, variant = 'default', className, style }: BadgeProps) {
  return (
    <ShadcnBadge variant={variant} className={className} style={style}>
      {text}
    </ShadcnBadge>
  );
}
