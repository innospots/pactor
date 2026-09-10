import { useI18n, useRenderer } from '@pactor-app/runtime';
import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';

import { cn } from '../../../lib/utils.js';
import { Icon } from '../Icon/index.js';
import {
  SidebarProvider,
  Sidebar as ShadcnSidebar,
  SidebarContent as ShadcnSidebarContent,
  SidebarFooter as ShadcnSidebarFooter,
  SidebarHeader as ShadcnSidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../../../ui/sidebar.js';
import { useIsMobile } from '../../../hooks/use-mobile.js';

/** 品牌区：标题 + 可选 logo（图片地址）；也可直接传 ReactNode 自定义 */
export interface SidebarBrand {
  title: string;
  logo?: string;
}

/** 导航项；`children` 为子菜单（缩进展示） */
export interface SidebarNavItem {
  label: string;
  href?: string;
  /** 图标名（Icon 白名单，kebab/Pascal 均可），渲染于文字前 */
  icon?: string;
  children?: SidebarNavItem[];
}

export interface SidebarProps {
  /** 品牌区（{ title, logo } 对象或任意 ReactNode）；移动端渲染在顶栏，桌面端渲染在侧栏顶部品牌行 */
  brand?: SidebarBrand | ReactNode;
  /** 导航项（可含嵌套 children，可含表达式）；content 槽提供时不渲染 */
  items?: SidebarNavItem[];
  /** 侧栏自由内容槽（提供时替代 items 导航；DSL 子树经 Renderer 渲染） */
  content?: ReactNode;
  /** 侧栏底部固定区（渲染在滚动区之后，不随内容滚动；未提供不渲染容器） */
  sidebarFooter?: ReactNode;
  /** 是否渲染折叠触发器：折叠后桌面侧栏收窄为 icon rail（导航仅图标） */
  collapsible?: boolean;
  /** 折叠状态变化事件，传出 boolean */
  onCollapse?: (collapsed: boolean) => void;
  /** 路由 / 会话切换标识：值变化时移动端抽屉在渲染期关闭 */
  locationKey?: string;
  /** 移动端（<768px）侧栏变为覆盖抽屉（缺省 true）；false 时各端均为 flex 行布局 */
  drawer?: boolean;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式（同 className 挂载规则） */
  style?: CSSProperties;
  /** 主内容区 */
  children?: ReactNode;
}

/**
 * 侧栏抽屉 context（向后兼容）：侧栏内容（如 Menu）经 `useSidebarDrawer()` 取
 * `close()`（导航后关闭移动端抽屉）与 `collapsed`（桌面 icon rail 状态）；
 * 不在 Sidebar 内时返回 null。
 *
 * 内部桥接 shadcn Sidebar 的 useSidebar context。
 */
export function useSidebarDrawer(): {
  close: () => void;
  collapsed: boolean;
} | null {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const ctx = useSidebar();
    return {
      close: () => ctx.setOpenMobile(false),
      collapsed: ctx.state === 'collapsed',
    };
  } catch {
    return null;
  }
}

/** 可选 renderer 探测（ChromeSlot 同款 try/catch，hooks 数量恒定） */
function useOptionalRenderer(): ReturnType<typeof useRenderer> | null {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useRenderer();
  } catch {
    return null;
  }
}

/** content 槽渲染：DslNode（无 $$typeof 的 plain object）经 renderer 渲染，其余直渲 */
function SidebarContentSlot({ content }: { content: ReactNode }) {
  const renderer = useOptionalRenderer();
  if (
    renderer !== null &&
    typeof content === 'object' &&
    content !== null &&
    !('$$typeof' in content) &&
    'type' in content
  ) {
    return <>{renderer.renderChildren([content as never])}</>;
  }
  return <>{content}</>;
}

function isBrandObject(brand: SidebarProps['brand']): brand is SidebarBrand {
  return (
    typeof brand === 'object' &&
    brand !== null &&
    !('$$typeof' in brand) &&
    'title' in brand
  );
}

/** 品牌区渲染：对象 → logo + title；ReactNode → 直渲 */
function BrandNode({ brand, collapsed }: { brand: SidebarProps['brand']; collapsed: boolean }) {
  if (brand === undefined || brand === null) {
    return null;
  }
  if (isBrandObject(brand)) {
    return (
      <>
        {brand.logo ? (
          <img
            data-slot="sidebar-brand-logo"
            src={brand.logo}
            alt={brand.title}
            className="size-6 shrink-0"
          />
        ) : null}
        {collapsed ? null : (
          <span className="truncate text-sm font-semibold">{brand.title}</span>
        )}
      </>
    );
  }
  return <>{brand}</>;
}

/** 导航项渲染：items → SidebarMenu 组合 */
function SidebarNavItems({ items }: { items: SidebarNavItem[] }) {
  return (
    <SidebarMenu>
      {items.map((item, index) => (
        <SidebarNavEntry key={item.href ?? item.label ?? index} item={item} depth={0} />
      ))}
    </SidebarMenu>
  );
}

function SidebarNavEntry({ item, depth }: { item: SidebarNavItem; depth: number }) {
  const iconNode = item.icon ? <Icon name={item.icon} size="sm" /> : null;
  const labelNode = item.label;

  const button = item.href ? (
    <SidebarMenuButton asChild tooltip={item.label}>
      <a href={item.href}>
        {iconNode}
        <span>{labelNode}</span>
      </a>
    </SidebarMenuButton>
  ) : (
    <SidebarMenuButton tooltip={item.label}>
      {iconNode}
      <span>{labelNode}</span>
    </SidebarMenuButton>
  );

  return (
    <SidebarMenuItem>
      {button}
      {item.children && item.children.length > 0 && (
        <div className={cn('ml-4')}>
          {item.children.map((child, index) => (
            <SidebarNavEntry
              key={child.href ?? child.label ?? index}
              item={child}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </SidebarMenuItem>
  );
}

/**
 * Sidebar 页面级组合（shadcn kit）：品牌区 + 侧栏（items 嵌套导航或
 * content 自由内容槽）+ children 主内容区组成的页面外壳。
 *
 * 内部组合 shadcn Sidebar 原语（SidebarProvider / Sidebar / SidebarInset）：
 * - 桌面（≥768px）：侧栏与主区同行；collapsible 时折叠触发器把
 *   侧栏收窄为 icon rail（导航仅图标、hover 经 Tooltip 展示）；
 * - 移动端（<768px，drawer 缺省开启）：侧栏变为 Sheet 覆盖抽屉——
 *   顶栏菜单按钮开启，遮罩点击 / Escape / locationKey 变化关闭；
 * - 侧栏内容可经 useSidebarDrawer() 取 close / collapsed 自行适配。
 * - ⌘B / Ctrl+B 键盘快捷键切换侧栏（shadcn SidebarProvider 内建）。
 */
export function Sidebar({
  brand,
  items = [],
  content,
  sidebarFooter,
  collapsible,
  onCollapse,
  locationKey,
  drawer = true,
  className,
  style,
  children,
}: SidebarProps) {
  return (
    <SidebarProvider
      defaultOpen={true}
      className={className}
      style={style}
    >
      <SidebarInner
        brand={brand}
        items={items}
        content={content}
        sidebarFooter={sidebarFooter}
        collapsible={collapsible}
        onCollapse={onCollapse}
        locationKey={locationKey}
        drawer={drawer}
      >
        {children}
      </SidebarInner>
    </SidebarProvider>
  );
}

/** 内部组合（在 SidebarProvider 内，可使用 useSidebar） */
function SidebarInner({
  brand,
  items = [],
  content,
  sidebarFooter,
  collapsible,
  onCollapse,
  locationKey,
  drawer = true,
  children,
}: SidebarProps) {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const { state, setOpenMobile, toggleSidebar } = useSidebar();
  const collapsed = state === 'collapsed';

  // onCollapse 事件透传：仅在实际变化时触发（跳过挂载时的初始值）
  const prevCollapsed = useRef(collapsed);
  useEffect(() => {
    if (prevCollapsed.current !== collapsed) {
      prevCollapsed.current = collapsed;
      onCollapse?.(collapsed);
    }
  }, [collapsed, onCollapse]);

  // locationKey 变化（路由 / 会话切换）即关移动端抽屉
  useEffect(() => {
    if (locationKey !== undefined) {
      setOpenMobile(false);
    }
  }, [locationKey, setOpenMobile]);

  const collapsedEffective = collapsible === true && collapsed && !isMobile;

  const brandNode = <BrandNode brand={brand} collapsed={collapsedEffective} />;

  // 侧栏内容：content 槽 > items 导航 > 空
  const sidebarContent =
    content !== undefined && content !== null ? (
      <SidebarContentSlot content={content} />
    ) : items.length > 0 ? (
      <SidebarNavItems items={items} />
    ) : null;

  return (
    <>
      <ShadcnSidebar
        collapsible={collapsible ? 'icon' : 'offcanvas'}
      >
        {/* 品牌区 + 折叠触发器 */}
        {(brand !== undefined || collapsible) && (
          <ShadcnSidebarHeader>
            <div
              data-slot="sidebar-brand"
              className={cn(
                'flex h-14 shrink-0 items-center gap-2 px-2',
                collapsedEffective && 'justify-center px-0',
              )}
            >
              {collapsedEffective ? null : (
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  {brandNode}
                </div>
              )}
              {collapsible && !isMobile && (
                <button
                  type="button"
                  data-slot="sidebar-collapse-trigger"
                  aria-label={
                    collapsedEffective
                      ? t('pactor.layout.expandSidebar')
                      : t('pactor.layout.collapseSidebar')
                  }
                  aria-expanded={!collapsedEffective}
                  className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  onClick={toggleSidebar}
                >
                  <Icon name={collapsedEffective ? 'chevron-right' : 'chevron-left'} size={16} />
                </button>
              )}
            </div>
          </ShadcnSidebarHeader>
        )}

        {/* 导航 / 自由内容 */}
        <ShadcnSidebarContent>
          {sidebarContent}
        </ShadcnSidebarContent>

        {/* 底部固定区 */}
        {sidebarFooter !== undefined && sidebarFooter !== null && !collapsedEffective && (
          <ShadcnSidebarFooter>
            {sidebarFooter}
          </ShadcnSidebarFooter>
        )}
      </ShadcnSidebar>

      <SidebarInset>
        {/* 移动端顶栏：菜单按钮 + 品牌 */}
        {drawer && (
          <div
            data-slot="sidebar-topbar"
            className="flex h-14 items-center gap-2 border-b border-sidebar-border bg-sidebar px-3 md:hidden"
          >
            <button
              type="button"
              data-slot="sidebar-menu-trigger"
              aria-label={t('pactor.layout.openNavigation')}
              className="flex size-8 items-center justify-center rounded-md text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
              onClick={toggleSidebar}
            >
              <Icon name="menu" size={18} />
            </button>
            {brandNode}
          </div>
        )}
        {children}
      </SidebarInset>
    </>
  );
}
