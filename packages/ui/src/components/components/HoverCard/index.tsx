import type { DslNode } from '@pactor-app/core';
import { useRenderer } from '@pactor-app/runtime';
import type { CSSProperties, ReactNode } from 'react';

import {
  HoverCard as ShadcnHoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../../../ui/hover-card.js';
import { triggerWrapper } from '../trigger-render.js';

export interface HoverCardProps {
  /** 悬浮卡片内容：DSL 子树（对象，原样保留至渲染层求值）或纯文本 */
  content?: DslNode | string;
  /** 触发元素（DSL 子树，经 Renderer children 机制渲染） */
  children?: ReactNode;
  /** 通用：根节点 class（挂在卡片浮层根节点，与内置样式合并） */
  className?: string;
  /** 通用：内联样式（同 className 挂载规则） */
  style?: CSSProperties;
}

function isDslNode(value: unknown): value is DslNode {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as DslNode).type === 'string'
  );
}

/**
 * HoverCard 适配器（shadcn kit）：children 为触发元素（span 包装接入
 * Base UI Trigger），悬浮显示 content 富内容卡片（支持 DSL 子树）。
 */
export function HoverCard({ content, children, className, style }: HoverCardProps) {
  const { renderChildren } = useRenderer();
  return (
    <ShadcnHoverCard>
      <HoverCardTrigger render={triggerWrapper('hover-card-trigger-wrap')}>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className={className} style={style}>
        {isDslNode(content) ? renderChildren([content]) : content}
      </HoverCardContent>
    </ShadcnHoverCard>
  );
}
