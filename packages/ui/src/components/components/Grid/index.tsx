import { Children, type CSSProperties, type ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';

export interface GridProps {
  /** 列数，默认 1；每列等宽（columns 取整下限 1） */
  columns?: number;
  /** 栏间距 */
  gap?: number;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式（布局逃逸口；与 columns / gap 生成的样式合并，同键后者优先） */
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * Grid 均分栏布局（shadcn kit）：CSS grid。
 * 列数为运行时动态值，无法用 Tailwind 静态类表达，经 inline style 设置。
 */
export function Grid({ columns = 1, gap, className, style, children }: GridProps) {
  const cols = Math.max(1, columns);
  return (
    <div
      data-slot="grid"
      data-columns={cols}
      className={cn('grid', className)}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        ...(gap !== undefined ? { gap } : {}),
        ...style,
      }}
    >
      {Children.map(children, (child, index) => (
        <div key={index} data-slot="grid-item">
          {child}
        </div>
      ))}
    </div>
  );
}
