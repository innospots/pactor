import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';

/** DSL Container 宽度档位（对齐 Tailwind 断点） */
export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ContainerProps {
  /** 最大宽度档位，默认 lg；full 不限制宽度 */
  size?: ContainerSize;
  /** 是否水平居中，默认 true */
  centered?: boolean;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
  children?: ReactNode;
}

const sizeClass: Record<ContainerSize, string> = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  full: 'max-w-none',
};

/**
 * Container 布局（shadcn kit）：限制内容最大宽度并建立页面两侧留白；
 * 默认水平居中，左右各留 px-4 内边距。
 */
export function Container({
  size = 'lg',
  centered = true,
  className,
  style,
  children,
}: ContainerProps) {
  return (
    <div
      data-slot="container"
      data-size={size}
      className={cn(
        'w-full px-4',
        sizeClass[size],
        centered && 'mx-auto',
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
