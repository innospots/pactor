import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';

export interface ContentProps {
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * Content 主内容区（shadcn kit，语义对齐 antd Layout.Content）：
 * 纯语义容器，`flex: 1` 占据 Layout 中的剩余空间。
 */
export function Content({ className, style, children }: ContentProps) {
  return (
    <main
      data-slot="layout-content"
      className={cn('min-h-0 min-w-0 flex-1', className)}
      style={style}
    >
      {children}
    </main>
  );
}
