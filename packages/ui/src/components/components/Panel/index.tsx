import type { DslNode } from '@pactor-app/core';
import { useRenderer } from '@pactor-app/runtime';
import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';

export interface PanelProps {
  /** 面板标题（header 左端）；与 extra 都缺省时不渲染 header */
  title?: string;
  /** header 右端内容（DSL 子树，如按钮/链接/标签组；与 title 两端排布） */
  extra?: DslNode[];
  /** 是否有边框，默认 true（false 去边框与阴影） */
  bordered?: boolean;
  /** 根节点 DOM id（配合 Anchor 锚点定位等场景） */
  id?: string;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：header 区 class */
  headerClassName?: string;
  /** 通用：内容区 class */
  contentClassName?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
  children?: ReactNode;
}

/** header 右端槽位：独立子组件内调用 useRenderer，Panel 作纯 React 组件使用时不受影响 */
function ExtraSlot({ extra }: { extra: DslNode[] }) {
  const { renderChildren } = useRenderer();
  return (
    <div data-slot="panel-extra" className="flex shrink-0 items-center justify-end gap-2">
      {renderChildren(extra)}
    </div>
  );
}

/**
 * Panel 适配器（shadcn kit）：header（左 title + 右 extra，底部分隔线）+ 内容区的面板容器。
 * 与 Card 的区别：header 是独立分栏（带 border-b），内容区默认无内边距约束之外的装饰，
 * 适合作为区块容器承载表单/表格/自定义内容；bordered=false 去边框与阴影。
 */
export function Panel({
  title,
  extra,
  bordered = true,
  id,
  className,
  headerClassName,
  contentClassName,
  style,
  children,
}: PanelProps) {
  return (
    <div
      data-slot="panel"
      id={id}
      className={cn(
        'flex w-full flex-col rounded-lg bg-card text-card-foreground',
        bordered ? 'border shadow-xs' : 'border-transparent',
        className,
      )}
      style={style}
    >
      {title || extra ? (
        <div
          data-slot="panel-header"
          className={cn('flex items-center justify-between gap-2 border-b px-4 py-3', headerClassName)}
        >
          {title ? (
            <div data-slot="panel-title" className="min-w-0 truncate text-sm font-medium">
              {title}
            </div>
          ) : (
            <div />
          )}
          {extra ? <ExtraSlot extra={extra} /> : null}
        </div>
      ) : null}
      <div data-slot="panel-content" className={cn('p-4', contentClassName)}>
        {children}
      </div>
    </div>
  );
}
