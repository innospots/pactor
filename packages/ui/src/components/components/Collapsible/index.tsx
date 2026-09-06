import { useState, type CSSProperties, type ReactNode } from 'react';

import {
  Collapsible as ShadcnCollapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../../ui/collapsible.js';

export interface CollapsibleProps {
  /** 触发区标题 */
  title?: string;
  /** 受控开关（可绑 `${state.x}` 表达式）；缺省内部自管理 */
  open?: boolean;
  /** 折叠内容（DSL 子树，经 Renderer children 机制渲染） */
  children?: ReactNode;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * Collapsible 适配器（shadcn kit）：title 触发区 + children 折叠内容；
 * open 受控（缺省内部自管理）。
 */
export function Collapsible({
  title,
  open,
  children,
  className,
  style,
}: CollapsibleProps) {
  const [innerOpen, setInnerOpen] = useState(false);
  const controlled = open !== undefined;
  return (
    <ShadcnCollapsible
      open={controlled ? open : innerOpen}
      onOpenChange={(next) => {
        if (!controlled) {
          setInnerOpen(next);
        }
      }}
      className={className}
      style={style}
    >
      {title ? <CollapsibleTrigger>{title}</CollapsibleTrigger> : null}
      <CollapsibleContent>{children}</CollapsibleContent>
    </ShadcnCollapsible>
  );
}
