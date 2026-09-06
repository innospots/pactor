import type { CSSProperties, ReactNode } from 'react';

import { ButtonGroup as ShadcnButtonGroup } from '../../../ui/button-group.js';

export interface ButtonGroupProps {
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
  /** 若干 Button（渲染好的 ReactNode） */
  children?: ReactNode;
}

/** ButtonGroup 适配器（shadcn kit）：children 为若干 Button，渲染为相连按钮组 */
export function ButtonGroup({ className, style, children }: ButtonGroupProps) {
  return (
    <ShadcnButtonGroup className={className} style={style}>
      {children}
    </ShadcnButtonGroup>
  );
}
