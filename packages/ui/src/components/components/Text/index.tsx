import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';

/** DSL Text 语义类型 */
export type TextType = 'default' | 'secondary' | 'success' | 'warning' | 'danger';

export interface TextProps {
  /** 文本内容（可含表达式）；也可用 children 渲染 */
  text?: string;
  /** 语义类型（颜色） */
  type?: TextType;
  /** 加粗 */
  strong?: boolean;
  /** 删除线 */
  delete?: boolean;
  /** 下划线 */
  underline?: boolean;
  /** 斜体 */
  italic?: boolean;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
  children?: ReactNode;
}

const typeClassMap: Record<TextType, string> = {
  default: '',
  secondary: 'text-muted-foreground',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-amber-600 dark:text-amber-400',
  danger: 'text-destructive',
};

/** Text 适配器（shadcn kit）：普通文本渲染，语义类型 + 修饰（粗体/删除线/下划线/斜体） */
export function Text({
  text,
  type = 'default',
  strong,
  delete: del,
  underline,
  italic,
  className,
  style,
  children,
}: TextProps) {
  return (
    <span
      data-slot="text"
      data-type={type}
      className={cn(
        typeClassMap[type],
        strong && 'font-semibold',
        del && 'line-through',
        underline && 'underline',
        italic && 'italic',
        className,
      )}
      style={style}
    >
      {text ?? children}
    </span>
  );
}
