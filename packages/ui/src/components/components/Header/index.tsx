import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';

export interface HeaderProps {
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * Header 顶部区域（shadcn kit，语义对齐 antd Layout.Header）：
 * 纯语义容器——横向 flex、垂直居中、默认下边框；不内置导航/品牌逻辑。
 */
export function Header({ className, style, children }: HeaderProps) {
  return (
    <header
      data-slot="layout-header"
      className={cn(
        'flex h-14 shrink-0 items-center gap-4 border-b bg-background px-4',
        className,
      )}
      style={style}
    >
      {children}
    </header>
  );
}
