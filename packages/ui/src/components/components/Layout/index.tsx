import type { DslChildren, DslNode } from '@pactor-app/core';
import { isDslSourceRef } from '@pactor-app/core';
import { useRenderer, type RuntimeContext } from '@pactor-app/runtime';
import type { CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';

export interface LayoutProps {
  /**
   * 主轴方向；缺省按直接子节点推导：含 Sider 时为 horizontal，
   * 否则 vertical（对齐 antd Layout 语义）；显式提供时覆盖推导
   */
  direction?: 'horizontal' | 'vertical';
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
  /** 内部：withScope 注册时由 Renderer 传入的原始 DSL 子树（可为动态引用） */
  dslChildren?: DslChildren;
}

/**
 * Layout 布局容器（shadcn kit，语义对齐 antd Layout）：flex 容器。
 * 方向推导基于直接子节点的 DSL 类型；`component` 引用解析到子树根类型
 * （页面级命名组件里放 Sider 同样计入推导）。动态引用（DslSourceRef）
 * 形态无法静态推导方向，按 vertical 处理（可用 direction 显式指定）。
 */
export function Layout({ direction, className, style, dslChildren }: LayoutProps) {
  const { renderChildren, context } = useRenderer();
  // 引用元素（DslSourceRef）无法静态判定类型，跳过不参与方向推导
  const hasSider = Array.isArray(dslChildren)
    ? dslChildren.some(
        (child) => !isDslSourceRef(child) && resolveRootType(child, context) === 'Sider',
      )
    : false;
  const dir = direction ?? (hasSider ? 'horizontal' : 'vertical');
  return (
    <div
      data-slot="layout"
      data-direction={dir}
      className={cn(
        'flex min-h-0 w-full h-full flex-1',
        dir === 'vertical' ? 'flex-col' : 'flex-row',
        className,
      )}
      style={style}
    >
      {renderChildren(dslChildren)}
    </div>
  );
}

/** 解析子节点的根组件类型：引用节点（component）解析到命名子树的根（一层） */
function resolveRootType(
  node: DslNode,
  context: RuntimeContext,
): string | undefined {
  if (node.component !== undefined) {
    const def = context.pageComponents[node.component];
    return def !== undefined && 'type' in def ? def.type : undefined;
  }
  return node.type;
}
