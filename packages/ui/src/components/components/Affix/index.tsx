import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';

export interface AffixProps {
  /** 距离视口顶部偏移（像素），默认 0；与 offsetBottom 互斥 */
  offsetTop?: number;
  /** 距离视口底部偏移（像素）；提供时按底部吸附 */
  offsetBottom?: number;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式（与偏移合并） */
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * Affix 适配器（shadcn kit）：基于 position: sticky 的滚动吸附容器；
 * offsetBottom 优先于 offsetTop（二者同 antd 互斥语义）。
 */
export function Affix({ offsetTop = 0, offsetBottom, className, style, children }: AffixProps) {
  return (
    <div
      data-slot="affix"
      className={cn('sticky z-10', className)}
      style={
        offsetBottom !== undefined
          ? { bottom: offsetBottom, ...style }
          : { top: offsetTop, ...style }
      }
    >
      {children}
    </div>
  );
}
