import type { CSSProperties, ReactNode } from 'react';

import {
  Empty as ShadcnEmpty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '../../../ui/empty.js';
import { Icon } from '../Icon/index.js';

export interface EmptyProps {
  /** 空状态标题 */
  title?: string;
  /** 辅助说明文案 */
  description?: string;
  /** 标题上方图标（Icon 白名单，kebab-case / PascalCase 均可），作空态视觉锚点 */
  icon?: string;
  /** 操作区（DSL 子树，经 Renderer children 机制渲染） */
  children?: ReactNode;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/** Empty 适配器（shadcn kit）：title / description + 可选 icon 视觉锚点 + 可选 children 操作区 */
export function Empty({ title, description, icon, children, className, style }: EmptyProps) {
  return (
    <ShadcnEmpty className={className} style={style}>
      <EmptyHeader>
        {icon ? (
          <div
            data-slot="empty-icon"
            className="mb-1 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground"
          >
            <Icon name={icon} size="lg" />
          </div>
        ) : null}
        {title ? <EmptyTitle>{title}</EmptyTitle> : null}
        {description ? <EmptyDescription>{description}</EmptyDescription> : null}
      </EmptyHeader>
      {children ? <EmptyContent>{children}</EmptyContent> : null}
    </ShadcnEmpty>
  );
}
