import type { CSSProperties, ReactNode } from 'react';

import { InputGroup as ShadcnInputGroup } from '../../../ui/input-group.js';

export interface InputGroupProps {
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
  /** Input 与前后缀元素（Text/Button，渲染好的 ReactNode） */
  children?: ReactNode;
}

/**
 * InputGroup 适配器（shadcn kit）：children 为 Input 与前后缀元素
 * （Text/Button），渲染为组合输入框；内部 Input 的边框/焦点环由
 * 容器样式消化。
 */
export function InputGroup({ className, style, children }: InputGroupProps) {
  return (
    <ShadcnInputGroup className={className} style={style}>
      {children}
    </ShadcnInputGroup>
  );
}
