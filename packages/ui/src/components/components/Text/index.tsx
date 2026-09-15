import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';

/** DSL Text 语义类型 */
export type TextType = 'default' | 'secondary' | 'success' | 'warning' | 'danger';

/** DSL Text 字号（middle 缺省继承上下文字号） */
export type TextSize = 'small' | 'middle' | 'large';

export interface TextProps {
  /** 文本内容（可含表达式）；也可用 children 渲染 */
  text?: string;
  /** 语义类型（颜色） */
  type?: TextType;
  /** 字号：small 12 / middle 继承（缺省）/ large 18 */
  size?: TextSize;
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
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-destructive',
};

const sizeClassMap: Record<TextSize, string> = {
  small: 'text-xs',
  middle: '',
  large: 'text-lg',
};

/** Text 适配器（shadcn kit）：普通文本渲染，语义类型 + 字号 + 修饰（粗体/删除线/下划线/斜体） */
export function Text({
  text,
  type = 'default',
  size = 'middle',
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
        sizeClassMap[size],
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
