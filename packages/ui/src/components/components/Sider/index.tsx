import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';

export interface SiderProps {
  /** 展开宽度（px），默认 200 */
  width?: number;
  /** 是否渲染底部折叠触发器 */
  collapsible?: boolean;
  /** 受控折叠态（可绑 `${state.x}`，配合 onCollapse 回写） */
  collapsed?: boolean;
  /** 折叠后的宽度（px），默认 64 */
  collapsedWidth?: number;
  /** 折叠状态变化事件，传出 boolean */
  onCollapse?: (collapsed: boolean) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * Sider 侧边区域（shadcn kit，语义对齐 antd Layout.Sider）：
 * 纯容器（内容完全由 children DSL 声明）+ 可选折叠触发器；
 * 折叠为受控 prop（props 绑 state + onCollapse 回写的闭环）。
 */
export function Sider({
  width = 200,
  collapsible,
  collapsed,
  collapsedWidth = 64,
  onCollapse,
  className,
  style,
  children,
}: SiderProps) {
  const current = collapsed ? collapsedWidth : width;
  return (
    <aside
      data-slot="layout-sider"
      data-collapsed={collapsed || undefined}
      className={cn(
        'flex min-h-0 shrink-0 flex-col border-r bg-background transition-[width]',
        className,
      )}
      style={{ width: current, ...style }}
    >
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
      {collapsible ? (
        <button
          type="button"
          aria-label={collapsed ? 'expand sider' : 'collapse sider'}
          className="flex h-10 shrink-0 items-center justify-center border-t text-muted-foreground hover:text-foreground"
          onClick={() => onCollapse?.(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight aria-hidden className="size-4" />
          ) : (
            <ChevronLeft aria-hidden className="size-4" />
          )}
        </button>
      ) : null}
    </aside>
  );
}
