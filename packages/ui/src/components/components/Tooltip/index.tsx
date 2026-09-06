import type { CSSProperties, ReactNode } from 'react';

import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../ui/tooltip.js';
import { triggerWrapper } from '../trigger-render.js';

export interface TooltipProps {
  /** 提示文案 */
  content?: string;
  /** 触发元素（DSL 子树，经 Renderer children 机制渲染） */
  children?: ReactNode;
  /** 通用：根节点 class（挂在提示浮层根节点，与内置样式合并） */
  className?: string;
  /** 通用：内联样式（同 className 挂载规则） */
  style?: CSSProperties;
}

/**
 * Tooltip 适配器（shadcn kit）：children 为触发元素（span 包装接入
 * Base UI Trigger），悬浮显示 content 提示浮层。
 */
export function Tooltip({ content, children, className, style }: TooltipProps) {
  return (
    <ShadcnTooltip>
      <TooltipTrigger render={triggerWrapper('tooltip-trigger-wrap')}>
        {children}
      </TooltipTrigger>
      <TooltipContent className={className} style={style}>
        {content}
      </TooltipContent>
    </ShadcnTooltip>
  );
}
