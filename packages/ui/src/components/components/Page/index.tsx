import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';

export interface PageProps {
  /** 页面标题，可选 */
  title?: string;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式（布局逃逸口） */
  style?: CSSProperties;
  children?: ReactNode;
}

/** Page 容器（shadcn kit）：可选标题 + 内容区（纵向节奏 space-y-5） */
export function Page({ title, className, style, children }: PageProps) {
  return (
    <div data-slot="page" className={cn('p-6', className)} style={style}>
      {title ? (
        <h2 data-slot="page-title" className="mb-5 text-xl font-semibold">
          {title}
        </h2>
      ) : null}
      <div data-slot="page-content" className="space-y-5">
        {children}
      </div>
    </div>
  );
}
