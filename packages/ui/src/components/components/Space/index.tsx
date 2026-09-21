import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';

export interface SpaceProps {
  /** 排列方向，默认 horizontal */
  direction?: 'horizontal' | 'vertical';
  /** 间距档位（antd small=8 / middle=16 / large=24）或具体像素值，默认 small */
  size?: 'small' | 'middle' | 'large' | number;
  /** 交叉轴对齐 */
  align?: 'start' | 'center' | 'end' | 'baseline';
  /** 超出时是否换行，默认 false */
  wrap?: boolean;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式（与数字 size 合并） */
  style?: CSSProperties;
  children?: ReactNode;
}

const sizeClass: Record<string, string> = {
  small: 'gap-2',
  middle: 'gap-4',
  large: 'gap-6',
};

const alignClass: Record<string, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
};

/**
 * Space 布局（shadcn kit）：为一组相邻子节点提供一致间距；
 * 与 Flex 的差异是语义更窄——只做等间距排列（含换行），不做主轴分布。
 */
export function Space({
  direction = 'horizontal',
  size = 'small',
  align,
  wrap,
  className,
  style,
  children,
}: SpaceProps) {
  return (
    <div
      data-slot="space"
      className={cn(
        'flex',
        direction === 'vertical' ? 'flex-col' : 'flex-row',
        typeof size === 'string' && sizeClass[size],
        align && alignClass[align],
        wrap && 'flex-wrap',
        className,
      )}
      style={
        typeof size === 'number' || style
          ? { ...(typeof size === 'number' ? { gap: size } : {}), ...style }
          : undefined
      }
    >
      {children}
    </div>
  );
}
