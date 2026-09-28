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
  /** 浮层朝向（缺省 top；空间不足时自动翻转） */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** 触发元素（DSL 子树，经 Renderer children 机制渲染） */
  children?: ReactNode;
  /** 通用：根节点 class（挂在提示浮层根节点，与内置样式合并） */
  className?: string;
  /** 通用：内联样式（同 className 挂载规则） */
  style?: CSSProperties;
}

/**
 * Tooltip 适配器（shadcn kit）：children 为触发元素（span 包装接入
 * Base UI Trigger），悬浮显示 content 提示浮层；side 控制浮层朝向
 * （如图标栏 hover 时 right）。
 */
export function Tooltip({ content, side, children, className, style }: TooltipProps) {
  return (
    <ShadcnTooltip>
      <TooltipTrigger render={triggerWrapper('tooltip-trigger-wrap')}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} className={className} style={style}>
        {content}
      </TooltipContent>
    </ShadcnTooltip>
  );
}
