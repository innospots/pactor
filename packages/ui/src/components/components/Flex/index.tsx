import type { ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';

export interface FlexProps {
  /** 主轴方向，默认 horizontal */
  direction?: 'horizontal' | 'vertical';
  /** 间距 */
  gap?: number | 'small' | 'middle' | 'large';
  /** 主轴对齐 */
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
  /** 交叉轴对齐 */
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  children?: ReactNode;
}

const gapClass: Record<string, string> = {
  small: 'gap-2',
  middle: 'gap-4',
  large: 'gap-6',
};

const justifyClass: Record<string, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  'space-between': 'justify-between',
  'space-around': 'justify-around',
  'space-evenly': 'justify-evenly',
};

const alignClass: Record<string, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
};

/** Flex 布局（shadcn kit）：方向 / 对齐映射 Tailwind 工具类，数字 gap 内联 */
export function Flex({
  direction = 'horizontal',
  gap,
  justify,
  align,
  children,
}: FlexProps) {
  return (
    <div
      data-slot="flex"
      className={cn(
        'flex',
        direction === 'vertical' && 'flex-col',
        typeof gap === 'string' && gapClass[gap],
        justify && justifyClass[justify],
        align && alignClass[align],
      )}
      style={typeof gap === 'number' ? { gap } : undefined}
    >
      {children}
    </div>
  );
}
