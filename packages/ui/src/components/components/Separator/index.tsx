import type { CSSProperties } from 'react';

import { Separator as ShadcnSeparator } from '../../../ui/separator.js';

export interface SeparatorProps {
  /** 方向，默认 horizontal */
  orientation?: 'horizontal' | 'vertical';
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/** Separator 适配器（shadcn kit）：orientation → vendored Separator */
export function Separator({ orientation = 'horizontal', className, style }: SeparatorProps) {
  return (
    <ShadcnSeparator orientation={orientation} className={className} style={style} />
  );
}
