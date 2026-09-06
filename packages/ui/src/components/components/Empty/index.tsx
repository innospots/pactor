import type { CSSProperties, ReactNode } from 'react';

import {
  Empty as ShadcnEmpty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '../../../ui/empty.js';

export interface EmptyProps {
  /** 空状态标题 */
  title?: string;
  /** 辅助说明文案 */
  description?: string;
  /** 操作区（DSL 子树，经 Renderer children 机制渲染） */
  children?: ReactNode;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/** Empty 适配器（shadcn kit）：title / description + 可选 children 操作区 */
export function Empty({ title, description, children, className, style }: EmptyProps) {
  return (
    <ShadcnEmpty className={className} style={style}>
      <EmptyHeader>
        {title ? <EmptyTitle>{title}</EmptyTitle> : null}
        {description ? <EmptyDescription>{description}</EmptyDescription> : null}
      </EmptyHeader>
      {children ? <EmptyContent>{children}</EmptyContent> : null}
    </ShadcnEmpty>
  );
}
