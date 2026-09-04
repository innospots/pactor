import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';

export interface FooterProps {
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * Footer 底部区域（shadcn kit，语义对齐 antd Layout.Footer）：
 * 纯语义容器，默认居中、弱化的辅助文本样式。
 */
export function Footer({ className, style, children }: FooterProps) {
  return (
    <footer
      data-slot="layout-footer"
      className={cn(
        'shrink-0 border-t px-4 py-3 text-center text-sm text-muted-foreground',
        className,
      )}
      style={style}
    >
      {children}
    </footer>
  );
}
