import type { CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { Skeleton as ShadcnSkeleton } from '../../../ui/skeleton.js';

/** DSL Skeleton 形状 */
export type SkeletonShape = 'line' | 'circle' | 'rect';

export interface SkeletonProps {
  /** 形状：line（文本行）/ circle（圆形）/ rect（矩形），默认 line */
  shape?: SkeletonShape;
  /** 宽度（px 或 CSS 长度） */
  width?: number | string;
  /** 高度（px 或 CSS 长度） */
  height?: number | string;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

const shapeDefaults: Record<SkeletonShape, { className: string; style: CSSProperties }> = {
  line: { className: 'h-4 w-full', style: {} },
  circle: { className: 'rounded-full', style: { width: 40, height: 40 } },
  rect: { className: 'h-24 w-full', style: {} },
};

function toSize(value: number | string | undefined): number | string | undefined {
  return typeof value === 'number' ? `${value}px` : value;
}

/** Skeleton 适配器（shadcn kit）：shape + width / height → vendored Skeleton */
export function Skeleton({ shape = 'line', width, height, className, style }: SkeletonProps) {
  const defaults = shapeDefaults[shape];
  return (
    <ShadcnSkeleton
      className={cn(defaults.className, className)}
      style={{
        ...defaults.style,
        width: toSize(width) ?? defaults.style.width,
        height: toSize(height) ?? defaults.style.height,
        ...style,
      }}
    />
  );
}
