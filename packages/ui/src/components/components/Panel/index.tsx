import type { DslNode } from '@pactor-app/core';
import { useRenderer } from '@pactor-app/runtime';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useId, useState, type CSSProperties, type ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';
import { Icon } from '../Icon/index.js';

export interface PanelProps {
  /** 面板标题（header 左端）；与 extra / icon / collapsible 都缺省时不渲染 header */
  title?: string;
  /** 标题前的图标（Icon 白名单，kebab-case / PascalCase 均可） */
  icon?: string;
  /** header 右端内容（DSL 子树，如按钮/链接/标签组；与 title 两端排布） */
  extra?: DslNode[];
  /**
   * 是否可折叠：header 最右端渲染折叠按钮，点击切换内容区显隐；
   * 折叠时内容区卸载（内部表单状态不保留，受控数据请由宿主持有）。
   */
  collapsible?: boolean;
  /** 可折叠时的初始展开状态，默认 true */
  defaultOpen?: boolean;
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
 * Panel 适配器（shadcn kit）：header（左 icon + title + 右 extra / 折叠按钮，底部分隔线）
 * + 内容区的面板容器。与 Card 的区别：header 是独立分栏（带 border-b），内容区默认无
 * 内边距约束之外的装饰，适合作为区块容器承载表单/表格/自定义内容；bordered=false
 * 去边框与阴影；collapsible 时 header 右端出现折叠按钮。
 */
export function Panel({
  title,
  icon,
  extra,
  collapsible,
  defaultOpen = true,
  bordered = true,
  id,
  className,
  headerClassName,
  contentClassName,
  style,
  children,
}: PanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();
  const showHeader = Boolean(title || icon || extra || collapsible);

  return (
    <div
      data-slot="panel"
      data-state={collapsible ? (open ? 'open' : 'closed') : undefined}
      id={id}
      className={cn(
        'flex w-full flex-col rounded-lg bg-card text-card-foreground',
        bordered ? 'border shadow-xs' : 'border-transparent',
        className,
      )}
      style={style}
    >
      {showHeader ? (
        <div
          data-slot="panel-header"
          className={cn('flex items-center justify-between gap-2 border-b px-4 py-3', headerClassName)}
        >
          <div
            data-slot="panel-title"
            className="flex min-w-0 items-center gap-2 truncate text-sm font-medium"
          >
            {icon ? <Icon name={icon} size={18} className="text-muted-foreground" /> : null}
            {title}
          </div>
          <div className="flex shrink-0 items-center justify-end gap-2">
            {extra ? <ExtraSlot extra={extra} /> : null}
            {collapsible ? (
              <button
                type="button"
                data-slot="panel-toggle"
                aria-expanded={open}
                aria-controls={contentId}
                aria-label={title}
                onClick={() => setOpen((value) => !value)}
                className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
      {!collapsible || open ? (
        <div id={contentId} data-slot="panel-content" className={cn('p-4', contentClassName)}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
