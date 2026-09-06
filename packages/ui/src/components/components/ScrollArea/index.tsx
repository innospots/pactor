import type { CSSProperties, ReactNode } from 'react';

import { ScrollArea as ShadcnScrollArea } from '../../../ui/scroll-area.js';

export interface ScrollAreaProps {
  /** 最大高度（px 或 CSS 长度），超出后出现自定义滚动条 */
  maxHeight?: number | string;
  /** 最大宽度（px 或 CSS 长度） */
  maxWidth?: number | string;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * ScrollArea 适配器（shadcn kit）：基于 vendored ScrollArea（Base UI）；
 * maxHeight/maxWidth 尺寸约束 + children 内容，自定义滚动条。
 */
export function ScrollArea({
  maxHeight,
  maxWidth,
  className,
  style,
  children,
}: ScrollAreaProps) {
  return (
    <ShadcnScrollArea
      className={className}
      style={{ maxHeight, maxWidth, ...style }}
    >
      {children}
    </ShadcnScrollArea>
  );
}
