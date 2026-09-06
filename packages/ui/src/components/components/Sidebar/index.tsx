import { useI18n } from '@pactor-app/runtime';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, type CSSProperties, type ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';

/** 品牌区：标题 + 可选 logo（图片地址） */
export interface SidebarBrand {
  title: string;
  logo?: string;
}

/** 导航项；`children` 为子菜单（缩进展示）；`icon` 预留（当前版本不渲染） */
export interface SidebarNavItem {
  label: string;
  href?: string;
  icon?: string;
  children?: SidebarNavItem[];
}

export interface SidebarProps {
  /** 品牌区（标题 + 可选 logo） */
  brand?: SidebarBrand;
  /** 导航项（可含嵌套 children，可含表达式） */
  items?: SidebarNavItem[];
  /** 是否渲染折叠触发器（折叠态内部维护，经 onCollapse 传出） */
  collapsible?: boolean;
  /** 折叠状态变化事件，传出 boolean */
  onCollapse?: (collapsed: boolean) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
  /** 主内容区 */
  children?: ReactNode;
}

/**
 * Sidebar 页面级组合（shadcn kit）：品牌区 + 嵌套导航（href 渲染为锚点、
 * 子菜单缩进展示）的侧栏与 children 主内容区组成的整页布局；样式取
 * sidebar 系列语义令牌；collapsible 时提供折叠触发器。
 */
export function Sidebar({
  brand,
  items = [],
  collapsible,
  onCollapse,
  className,
  style,
  children,
}: SidebarProps) {
  const { t } = useI18n();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    onCollapse?.(next);
  };

  return (
    <div
      data-slot="sidebar-layout"
      className={cn('flex min-h-screen w-full', className)}
      style={style}
    >
      <aside
        data-slot="sidebar"
        data-collapsed={collapsed || undefined}
        className={cn(
          'flex shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width]',
          collapsed ? 'w-14' : 'w-60',
        )}
      >
        {brand ? (
          <div
            data-slot="sidebar-brand"
            className="flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-4"
          >
            {brand.logo ? (
              <img
                data-slot="sidebar-brand-logo"
                src={brand.logo}
                alt={brand.title}
                className="size-6 shrink-0"
              />
            ) : null}
            {collapsed ? null : (
              <span className="truncate text-sm font-semibold">
                {brand.title}
              </span>
            )}
          </div>
        ) : null}
        {collapsed ? null : (
          <nav data-slot="sidebar-nav" className="min-h-0 flex-1 overflow-auto p-2">
            {items.map((item, index) => (
              <SidebarEntry key={item.href ?? item.label ?? index} item={item} depth={0} />
            ))}
          </nav>
        )}
        {collapsible ? (
          <button
            type="button"
            data-slot="sidebar-collapse-trigger"
            aria-label={
              collapsed
                ? t('pactor.layout.expandSidebar')
                : t('pactor.layout.collapseSidebar')
            }
            className="flex h-10 shrink-0 items-center justify-center border-t border-sidebar-border text-sidebar-foreground/60 hover:text-sidebar-foreground"
            onClick={toggleCollapsed}
          >
            {collapsed ? (
              <ChevronRight aria-hidden className="size-4" />
            ) : (
              <ChevronLeft aria-hidden className="size-4" />
            )}
          </button>
        ) : null}
      </aside>
      <main data-slot="sidebar-content" className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  );
}

function SidebarEntry({ item, depth }: { item: SidebarNavItem; depth: number }) {
  const entryClass = cn(
    'flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition-colors',
    'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
  );
  const indentStyle =
    depth > 0 ? { paddingLeft: 12 + depth * 16 } : undefined;
  return (
    <div data-slot="sidebar-entry">
      {item.href ? (
        <a
          data-slot="sidebar-item"
          href={item.href}
          className={entryClass}
          style={indentStyle}
        >
          {item.label}
        </a>
      ) : (
        <span data-slot="sidebar-item" className={entryClass} style={indentStyle}>
          {item.label}
        </span>
      )}
      {item.children?.map((child, index) => (
        <SidebarEntry
          key={child.href ?? child.label ?? index}
          item={child}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}
