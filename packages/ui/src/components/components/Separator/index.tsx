import type { CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { Separator as ShadcnSeparator } from '../../../ui/separator.js';

export interface SeparatorProps {
  /** 方向，默认 horizontal */
  orientation?: 'horizontal' | 'vertical';
  /** 通用：根节点 class（与内置样式合并，可经 tailwind-merge 覆盖缺省外边距） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * Separator 适配器（shadcn kit）：orientation → vendored Separator。
 * 缺省外边距随方向：horizontal 上下（my-4）、vertical 左右（mx-4），
 * className 传入同类工具类（如 my-0）时按 tailwind-merge 覆盖。
 */
export function Separator({ orientation = 'horizontal', className, style }: SeparatorProps) {
  return (
    <ShadcnSeparator
      orientation={orientation}
      className={cn(
        orientation === 'horizontal' ? 'my-4' : 'mx-4',
        className,
      )}
      style={style}
    />
  );
}
