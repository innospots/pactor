import { useI18n, useRenderer } from '@pactor-app/runtime';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

import { cn } from '../../../lib/utils.js';
import { Icon } from '../Icon/index.js';
import { RailTooltip } from './rail-tooltip.js';

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
  /** 是否渲染折叠触发器：折叠后桌面侧栏收窄为 icon rail（64px，导航仅图标） */
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
 * 侧栏抽屉 context：侧栏内容（如 Menu）经 `useSidebarDrawer()` 取
 * `close()`（导航后关闭移动端抽屉）与 `collapsed`（桌面 icon rail 状态，
 * 内容据此降级为纯图标展示）；不在 Sidebar 内时返回 null，调用方以
 * 可选链安全调用，不抛错。
 */
const SidebarDrawerContext = createContext<{
  close: () => void;
  collapsed: boolean;
} | null>(null);

export function useSidebarDrawer(): {
  close: () => void;
  collapsed: boolean;
} | null {
  return useContext(SidebarDrawerContext);
}

/** 767px 界与媒体查询断点（md）保持一致；仅用于 inert / 折叠生效判定 */
const MOBILE_MEDIA_QUERY = '(max-width: 767px)';

/**
 * 移动视口判定：布局切换本身由 CSS 媒体查询表达（首帧即正确），
 * 这里只为 `inert` 与 collapsed 生效范围服务——抽屉关闭后 translate-x
 * 移出屏幕但 Tab 仍可进入不可见侧栏，这一半 CSS 表达不了，必须 JS。
 */
function useIsMobileViewport(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia(MOBILE_MEDIA_QUERY).matches,
  );

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return;
    }
    const media = window.matchMedia(MOBILE_MEDIA_QUERY);
    const onChange = (event: MediaQueryListEvent): void => {
      setIsMobile(event.matches);
    };
    setIsMobile(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return isMobile;
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
function SidebarContent({ content }: { content: ReactNode }) {
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

/**
 * Sidebar 页面级组合（shadcn kit）：品牌区 + 侧栏（items 嵌套导航或
 * content 自由内容槽）+ children 主内容区组成的页面外壳；样式取
 * sidebar 系列语义令牌。
 *
 * - 桌面（≥768px）：侧栏与主区 flex 同行；collapsible 时折叠触发器把
 *   侧栏收窄为 icon rail（64px，导航仅图标、hover 经 RailTooltip 展示）；
 * - 移动端（<768px，drawer 缺省开启）：侧栏退出文档流变为左侧覆盖
 *   抽屉——顶栏菜单按钮开启，遮罩点击 / Escape / locationKey 变化
 *   关闭，关闭时容器 inert；移动端不渲染折叠触发器；
 * - 侧栏内容可经 useSidebarDrawer() 取 close / collapsed 自行适配。
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
  const { t } = useI18n();
  const isMobile = useIsMobileViewport();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  // icon rail 仅桌面生效：移动端抽屉语义不受影响
  const collapsedEffective = collapsible === true && collapsed && !isMobile;

  const close = useCallback(() => setDrawerOpen(false), []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    onCollapse?.(next);
  };

  // locationKey 变化（路由 / 会话切换）即关抽屉：渲染期比较，
  // 抽屉不会在新内容之上多画一帧
  const [trackedLocationKey, setTrackedLocationKey] = useState(locationKey);
  if (trackedLocationKey !== locationKey) {
    setTrackedLocationKey(locationKey);
    setDrawerOpen(false);
  }

  // Escape 关闭：仅抽屉打开期间挂 window 监听
  useEffect(() => {
    if (!drawerOpen) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen]);

  const brandNode = isBrandObject(brand) ? (
    <>
      {brand.logo ? (
        <img
          data-slot="sidebar-brand-logo"
          src={brand.logo}
          alt={brand.title}
          className="size-6 shrink-0"
        />
      ) : null}
      {collapsedEffective ? null : (
        <span className="truncate text-sm font-semibold">{brand.title}</span>
      )}
    </>
  ) : (
    brand
  );

  const collapseTrigger = collapsible && !isMobile ? (
    <button
      type="button"
      data-slot="sidebar-collapse-trigger"
      aria-label={
        collapsedEffective
          ? t('pactor.layout.expandSidebar')
          : t('pactor.layout.collapseSidebar')
      }
      aria-expanded={!collapsedEffective}
      title={
        collapsedEffective
          ? t('pactor.layout.expandSidebar')
          : t('pactor.layout.collapseSidebar')
      }
      className={cn(
        'cursor-pointer flex size-8 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground',
      )}
      onClick={toggleCollapsed}
    >
      {collapsedEffective ? (
        <ChevronRight aria-hidden className="size-4" />
      ) : (
        <ChevronLeft aria-hidden className="size-4" />
      )}
    </button>
  ) : null;

  return (
    <SidebarDrawerContext.Provider
      value={{ close, collapsed: collapsedEffective }}
    >
      <div
        data-slot="sidebar-layout"
        className={cn('flex min-h-screen w-full', className)}
        style={style}
      >
        {drawer && drawerOpen ? (
          <div
            data-slot="sidebar-scrim"
            aria-hidden
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={close}
          />
        ) : null}

        <aside
          data-slot="sidebar"
          data-collapsed={collapsedEffective || undefined}
          data-open={drawerOpen ? 'true' : 'false'}
          inert={drawer && isMobile && !drawerOpen ? true : undefined}
          className={cn(
            'flex shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width,transform]',
            collapsedEffective ? 'w-16' : 'w-60',
            // 移动端覆盖抽屉：退出文档流，关闭时移出屏幕
            drawer &&
              'max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:w-60 max-md:-translate-x-full max-md:data-[open=true]:translate-x-0',
          )}
        >
          {brand !== undefined || collapseTrigger !== null ? (
            <div
              data-slot="sidebar-brand"
              className={cn(
                'flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-4',
                // 移动端品牌维持顶栏现状：抽屉内不重复渲染品牌行
                'max-md:hidden',
                collapsedEffective && 'justify-center px-2',
              )}
            >
              {/* icon rail：品牌区整体隐藏（与 footer 同规则），仅留折叠钮 */}
              {collapsedEffective ? null : (
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  {brandNode}
                </div>
              )}
              {collapseTrigger}
            </div>
          ) : null}
          <nav
            data-slot="sidebar-nav"
            className="min-h-0 flex-1 overflow-auto p-2"
          >
            {content !== undefined && content !== null ? (
              <SidebarContent content={content} />
            ) : (
              items.map((item, index) => (
                <SidebarEntry
                  key={item.href ?? item.label ?? index}
                  item={item}
                  depth={0}
                  collapsed={collapsedEffective}
                />
              ))
            )}
          </nav>
          {sidebarFooter !== undefined &&
          sidebarFooter !== null &&
          !collapsedEffective ? (
            <div
              data-slot="sidebar-footer"
              className="shrink-0 border-t border-sidebar-border p-2"
            >
              {sidebarFooter}
            </div>
          ) : null}
        </aside>

        <main
          data-slot="sidebar-content"
          className="flex min-w-0 flex-1 flex-col"
        >
          {drawer ? (
            <div
              data-slot="sidebar-topbar"
              className="flex h-14 items-center gap-2 border-b border-sidebar-border bg-sidebar px-3 md:hidden"
            >
              <button
                type="button"
                data-slot="sidebar-menu-trigger"
                aria-label={t('pactor.layout.openNavigation')}
                aria-expanded={drawerOpen}
                className="flex size-8 items-center justify-center rounded-md text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
                onClick={() => setDrawerOpen(true)}
              >
                <Icon name="menu" size={18} />
              </button>
              {brandNode}
            </div>
          ) : null}
          {children}
        </main>
      </div>
    </SidebarDrawerContext.Provider>
  );
}

function SidebarEntry({
  item,
  depth,
  collapsed,
}: {
  item: SidebarNavItem;
  depth: number;
  collapsed: boolean;
}) {
  const entryClass = cn(
    'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors',
    'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
    collapsed && 'justify-center px-0',
  );
  const indentStyle =
    !collapsed && depth > 0 ? { paddingLeft: 12 + depth * 16 } : undefined;
  // icon rail：label 隐藏，hover 经 RailTooltip 展示（可访问名同源）
  const labelNode = collapsed ? null : item.label;
  const iconNode = item.icon ? <Icon name={item.icon} size="sm" /> : null;
  const entry = item.href ? (
    <a
      data-slot="sidebar-item"
      href={item.href}
      className={entryClass}
      style={indentStyle}
    >
      {iconNode}
      {labelNode}
    </a>
  ) : (
    <span data-slot="sidebar-item" className={entryClass} style={indentStyle}>
      {iconNode}
      {labelNode}
    </span>
  );
  return (
    <div data-slot="sidebar-entry">
      {collapsed ? <RailTooltip label={item.label}>{entry}</RailTooltip> : entry}
      {item.children?.map((child, index) => (
        <SidebarEntry
          key={child.href ?? child.label ?? index}
          item={child}
          depth={depth + 1}
          collapsed={collapsed}
        />
      ))}
    </div>
  );
}
