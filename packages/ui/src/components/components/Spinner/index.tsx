import type { CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { Spinner as ShadcnSpinner } from '../../../ui/spinner.js';

/** DSL Spinner 尺寸 */
export type SpinnerSize = 'sm' | 'default' | 'lg';

export interface SpinnerProps {
  /** 尺寸，默认 default */
  size?: SpinnerSize;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

const sizeClass: Record<SpinnerSize, string> = {
  sm: 'size-3',
  default: 'size-4',
  lg: 'size-6',
};

/** Spinner 适配器（shadcn kit）：size → vendored Spinner（纯 CSS 旋转） */
export function Spinner({ size = 'default', className, style }: SpinnerProps) {
  return (
    <ShadcnSpinner className={cn(sizeClass[size], className)} style={style} />
  );
}
