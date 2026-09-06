import type { CSSProperties, ReactNode } from 'react';

import { AspectRatio as ShadcnAspectRatio } from '../../../ui/aspect-ratio.js';

export interface AspectRatioProps {
  /** 宽高比（如 16/9，数字或 `'16/9'` 字符串），默认 1 */
  ratio?: number | string;
  /** 内容（DSL 子树，经 Renderer children 机制渲染，按比例约束） */
  children?: ReactNode;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/** AspectRatio 适配器（shadcn kit）：ratio → CSS aspect-ratio 容器 */
export function AspectRatio({ ratio = 1, children, className, style }: AspectRatioProps) {
  return (
    <ShadcnAspectRatio ratio={ratio} className={className} style={style}>
      {children}
    </ShadcnAspectRatio>
  );
}
