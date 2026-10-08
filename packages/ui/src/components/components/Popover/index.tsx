import type { DslNode } from '@pactor-app/core';
import { useRenderer } from '@pactor-app/runtime';
import type { CSSProperties, ReactNode } from 'react';

import {
  Popover as ShadcnPopover,
  PopoverContent,
  PopoverTrigger,
} from '../../../ui/popover.js';
import { triggerWrapper } from '../trigger-render.js';

export interface PopoverProps {
  /** 浮层内容：DSL 子树（对象，原样保留至渲染层求值）或纯文本 */
  content?: DslNode | string;
  /** 触发元素（DSL 子树，经 Renderer children 机制渲染） */
  children?: ReactNode;
  /** 浮层方位（缺省 bottom；底部触发器用 top） */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** 浮层对齐（缺省 center） */
  align?: 'start' | 'center' | 'end';
  /** 通用：根节点 class（挂在浮层内容根节点，与内置样式合并） */
  className?: string;
  /** 通用：内联样式（同 className 挂载规则） */
  style?: CSSProperties;
}

/** content 为 DSL 子树时经 renderChildren 渲染，纯文本直接渲染 */
function isDslNode(value: unknown): value is DslNode {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as DslNode).type === 'string'
  );
}

/**
 * Popover 适配器（shadcn kit）：children 为触发元素（span 包装接入
 * Base UI Trigger）；content 支持 DSL 子树或纯文本。
 */
export function Popover({ content, children, side, align, className, style }: PopoverProps) {
  const { renderChildren } = useRenderer();
  return (
    <ShadcnPopover>
      <PopoverTrigger
        nativeButton={false}
        render={triggerWrapper('popover-trigger-wrap')}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent className={className} style={style} side={side} align={align}>
        {isDslNode(content) ? renderChildren([content]) : content}
      </PopoverContent>
    </ShadcnPopover>
  );
}
