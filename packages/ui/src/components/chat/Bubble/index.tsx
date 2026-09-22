import type { CSSProperties, ReactNode } from 'react';

import { Bubble as ShadcnBubble, BubbleContent } from '../../../ui/bubble.js';

/** DSL Bubble 变体（对齐 vendored bubble 七态） */
export type BubbleVariant =
  | 'default'
  | 'secondary'
  | 'muted'
  | 'tinted'
  | 'outline'
  | 'ghost'
  | 'destructive';

export interface BubbleProps {
  /** 对齐：start 居左（助手）、end 居右（用户），默认 start */
  align?: 'start' | 'end';
  /** 变体，默认 muted */
  variant?: BubbleVariant;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * Bubble 适配器（shadcn kit）：基础对话气泡容器——变体决定气泡底色，
 * align 决定左右停靠；内容经 Renderer children 机制渲染 DSL 子树。
 */
export function Bubble({ align = 'start', variant = 'muted', className, style, children }: BubbleProps) {
  return (
    <ShadcnBubble variant={variant} align={align} className={className} style={style}>
      <BubbleContent>{children}</BubbleContent>
    </ShadcnBubble>
  );
}
