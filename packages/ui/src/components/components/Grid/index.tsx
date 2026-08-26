import { Children, type ReactNode } from 'react';

export interface GridProps {
  /** 列数，默认 1；每列等宽（columns 取整下限 1） */
  columns?: number;
  /** 栏间距 */
  gap?: number;
  children?: ReactNode;
}

/**
 * Grid 均分栏布局（shadcn kit）：CSS grid。
 * 列数为运行时动态值，无法用 Tailwind 静态类表达，经 inline style 设置。
 */
export function Grid({ columns = 1, gap, children }: GridProps) {
  const cols = Math.max(1, columns);
  return (
    <div
      data-slot="grid"
      data-columns={cols}
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        ...(gap !== undefined ? { gap } : {}),
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
