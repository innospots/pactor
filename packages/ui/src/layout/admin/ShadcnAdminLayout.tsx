import type { AdminLayoutProps } from '../types.js';
import { findMenuChain } from './menu-chain.js';
import { collectDefaultOpenKeys } from './menu-items.js';
import type { PermissionChecker } from '@pactor-app/permission';
import { filterMenusByPermission } from '@pactor-app/permission';
import {
  resolveRoute,
  type MenuItem,
  type MenuRegistry,
  type NavigationBridge,
  type RouteContext,
} from '@pactor-app/router';
import { useI18n } from '@pactor-app/runtime';
import { useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '../../lib/utils.js';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../ui/accordion.js';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover.js';
import { useBreakpointBelow } from './use-media-query.js';

/** 访问页签（与 antd 版 AdminLayout 同语义） */
interface VisitedTab {
  key: string;
  title: string;
}

/**
 * 可见菜单树（等价于 pactor-layout buildMenuItems 的数据来源——其返回类型
 * 耦合 antd MenuProps，这里等价自实现）：取可见树（hidden 已过滤），
 * 提供 permissionChecker 时先经 filterMenusByPermission 权限过滤。
 */
function buildVisibleMenuTree(
  registry: MenuRegistry,
  permissionChecker?: PermissionChecker,
): MenuItem[] {
  const tree = registry.tree();
  return permissionChecker === undefined
    ? [...tree]
    : filterMenusByPermission(tree, permissionChecker);
}

/**
 * 点击菜单项的导航行为（与 antd 版一致）：page（非 external）→
 * bridge.push(path)；external / link → window.open 新窗口。
 */
function navigateMenuItem(
  menu: MenuItem | undefined,
  bridge: NavigationBridge,
): void {
  if (menu === undefined || menu.type === 'group' || menu.path === undefined) {
    return;
  }
  if (menu.external === true || menu.type === 'link') {
    window.open(menu.path, menu.target ?? '_blank');
    return;
  }
  bridge.push(menu.path);
}

/** 菜单项基础样式（shadcn 风格：hover/accent 高亮读语义令牌） */
const menuItemClass =
  'flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50';

interface MenuTreeProps {
  menus: readonly MenuItem[];
  registry: MenuRegistry;
  bridge: NavigationBridge;
  activeMenuId?: string;
  defaultOpenKeys: string[];
  /** 收起态：仅渲染顶层首字符（参考 antd Layout.Sider 收起形态） */
  collapsed?: boolean;
}

/**
 * 收起态 group 的悬停浮出子菜单（对齐 antd Sider 收起后的 flyout）：
 * hover 触发首字符按钮短暂延迟后浮出，移入浮层保持，移出延迟关闭；
 * 点击按钮切换浮层；浮层内 page 项导航后浮层关闭。
 */
function CollapsedGroupFlyout({
  menu,
  registry,
  bridge,
  activeMenuId,
  defaultOpenKeys,
}: {
  menu: MenuItem;
  registry: MenuRegistry;
  bridge: NavigationBridge;
  activeMenuId?: string;
  defaultOpenKeys: string[];
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  const openNow = (): void => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeLater = (): void => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 200);
  };
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            data-slot="menu-item"
            className={cn(
              menuItemClass,
              'mx-auto size-10 justify-center px-0 font-semibold',
            )}
            disabled={menu.disabled}
            title={menu.title}
            onMouseEnter={openNow}
            onMouseLeave={closeLater}
          >
            {menu.title.slice(0, 1)}
          </button>
        }
      />
      <PopoverContent
        data-slot="menu-flyout"
        side="right"
        align="start"
        sideOffset={8}
        className="max-h-[70vh] w-40 overflow-auto p-1"
        // hover 浮层：不抢占焦点（原 Radix onOpenAutoFocus preventDefault 的对应语义）
        initialFocus={false}
        onMouseEnter={openNow}
        onMouseLeave={closeLater}
        onClick={(event) => {
          // 浮层内点中 page 项（导航）后关闭浮层
          if ((event.target as HTMLElement).closest('[data-slot=menu-item]')) {
            setOpen(false);
          }
        }}
      >
        <div className="px-3 pt-2 pb-1 text-xs font-semibold text-muted-foreground">
          {menu.title}
        </div>
        <MenuTree
          menus={menu.children ?? []}
          registry={registry}
          bridge={bridge}
          activeMenuId={activeMenuId}
          defaultOpenKeys={defaultOpenKeys}
        />
      </PopoverContent>
    </Popover>
  );
}

/**
 * 菜单树：group → Accordion 折叠项（defaultOpen 组默认展开），
 * page / link → 按钮项；activeMenu 项高亮（data-active）；disabled 原样传递。
 * 收起态（collapsed）：仅顶层首字符平铺，不渲染箭头与子级；
 * group 悬停浮出子菜单（见 CollapsedGroupFlyout）。
 */
function MenuTree({
  menus,
  registry,
  bridge,
  activeMenuId,
  defaultOpenKeys,
  collapsed = false,
}: MenuTreeProps) {
  if (collapsed) {
    return (
      <div data-slot="menu" data-collapsed="true" className="flex flex-col gap-1">
        {menus.map((menu) => {
          if (menu.type === 'group') {
            return (
              <CollapsedGroupFlyout
                key={menu.id}
                menu={menu}
                registry={registry}
                bridge={bridge}
                activeMenuId={activeMenuId}
                defaultOpenKeys={defaultOpenKeys}
              />
            );
          }
          return (
            <button
              key={menu.id}
              type="button"
              data-slot="menu-item"
              data-active={menu.id === activeMenuId || undefined}
              className={cn(
                menuItemClass,
                'mx-auto size-10 justify-center px-0 font-semibold',
                menu.id === activeMenuId &&
                  'bg-accent font-semibold text-accent-foreground',
              )}
              disabled={menu.disabled}
              title={menu.title}
              onClick={() => navigateMenuItem(registry.findById(menu.id), bridge)}
            >
              {menu.title.slice(0, 1)}
            </button>
          );
        })}
      </div>
    );
  }
  return (
    <Accordion
      type="multiple"
      defaultValue={defaultOpenKeys}
      data-slot="menu"
      className="flex flex-col gap-0.5 px-2"
    >
      {menus.map((menu) => {
        if (menu.type === 'group') {
          return (
            <AccordionItem
              key={menu.id}
              value={menu.id}
              data-slot="menu-group"
              className="border-b-0"
            >
              <AccordionTrigger
                data-slot="menu-group-trigger"
                className={cn(menuItemClass, 'py-2 font-medium')}
                disabled={menu.disabled}
                title={menu.title}
              >
                {menu.title}
              </AccordionTrigger>
              <AccordionContent data-slot="menu-group-content" className="pb-1">
                <div className="flex flex-col gap-0.5 pl-3">
                  <MenuTree
                    menus={menu.children ?? []}
                    registry={registry}
                    bridge={bridge}
                    activeMenuId={activeMenuId}
                    defaultOpenKeys={defaultOpenKeys}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        }
        return (
          <button
            key={menu.id}
            type="button"
            data-slot="menu-item"
            data-active={menu.id === activeMenuId || undefined}
            className={cn(
              menuItemClass,
              menu.id === activeMenuId &&
                'bg-accent font-semibold text-accent-foreground',
            )}
            disabled={menu.disabled}
            title={menu.title}
            onClick={() => navigateMenuItem(registry.findById(menu.id), bridge)}
          >
            {menu.title}
          </button>
        );
      })}
    </Accordion>
  );
}

/**
 * ShadcnAdminLayout：与 pactor-layout 的 AdminLayout（antd 版）契约一致——
 * 复用 `AdminLayoutProps`；Header（brand + headerExtra）/ Sidebar / 内容出口；
 * config 开关（header/sidebar 缺省开，tabs/breadcrumb/footer 缺省关）一致；
 * mode（top-side/top-bottom/side-full/two-column）、fixedHeader/fixedSider、
 * collapsible/collapsed、breakpoint 响应式收起与 antd 版语义一致。
 * 菜单由 MenuRegistry 可见树渲染（group 折叠经 vendored shadcn Accordion），
 * permissionChecker 过滤、activeMenu 高亮、page → bridge.push、
 * link/external → window.open；Breadcrumb 按菜单链；Tabs 访问页签
 * （去重、点击导航、关闭当前回退最后一个）。route props 优先、
 * bridge 订阅兜底的选中态来源与 antd 版一致。
 *
 * 样式：Tailwind 工具类读取 shadcn 语义令牌（bg-background / border-border /
 * text-muted-foreground …），结构钩子用 data-slot 属性。
 */
export function ShadcnAdminLayout({
  config = {},
  brand,
  registry,
  bridge,
  route: routeProp,
  permissionChecker,
  headerExtra,
  children,
}: AdminLayoutProps) {
  const { t } = useI18n();
  const mode = config.mode ?? 'top-side';
  const showHeader = config.header ?? true;
  const showSidebar = (config.sidebar ?? true) && mode !== 'top-bottom';
  const showTabs = config.tabs ?? false;
  const showBreadcrumb = config.breadcrumb ?? false;
  const showFooter = config.footer ?? false;

  // 侧边栏收起：collapsed 初始值 + breakpoint 命中时强制收起
  const [collapsed, setCollapsed] = useState(config.collapsed ?? false);
  const broken = useBreakpointBelow(config.breakpoint);
  const effectiveCollapsed = collapsed || broken;

  // bridge 驱动的路由上下文（props.route 优先，订阅仅作生产兜底）
  const [bridgeRoute, setBridgeRoute] = useState<RouteContext | null>(() =>
    resolveRoute(registry, bridge.getLocation()),
  );

  // Tabs：访问页签（去重），由 bridge 订阅维护；不做 keepAlive
  const [tabs, setTabs] = useState<VisitedTab[]>([]);
  const tabsRef = useRef<VisitedTab[]>(tabs);
  tabsRef.current = tabs;

  useEffect(() => {
    const handleLocation = (location: {
      pathname: string;
      search: string;
    }): void => {
      const next = resolveRoute(registry, location);
      setBridgeRoute(next);
      if (next?.menuId !== undefined) {
        const menu = registry.findById(next.menuId);
        if (menu !== undefined && menu.type === 'page' && menu.path !== undefined) {
          setTabs((prev) => {
            if (prev.some((tab) => tab.key === location.pathname)) {
              return prev;
            }
            return [...prev, { key: location.pathname, title: menu.title }];
          });
        }
      }
    };
    // 挂载时把当前位置记入访问页签
    handleLocation(bridge.getLocation());
    return bridge.subscribe(handleLocation);
  }, [registry, bridge]);

  const route = routeProp ?? bridgeRoute;
  const activeMenuId = route?.activeMenu;

  const visibleMenus = useMemo(
    () => buildVisibleMenuTree(registry, permissionChecker),
    [registry, permissionChecker],
  );
  // defaultOpenKeys 首渲染冻结：Base UI Accordion 对 uncontrolled defaultValue
  // 的后续变更会 console.error 告警（Radix 原为静默忽略）——冻结与 Radix 时代
  // 的实际行为一致（展开态由用户交互持有，路由切换不改写）
  const defaultOpenKeysRef = useRef<string[] | null>(null);
  if (defaultOpenKeysRef.current === null) {
    defaultOpenKeysRef.current = collectDefaultOpenKeys(registry, activeMenuId);
  }
  const defaultOpenKeys = defaultOpenKeysRef.current;

  // two-column：当前选中一级项（激活链首项优先）
  const activeTopId = useMemo(() => {
    if (activeMenuId !== undefined) {
      const chain = findMenuChain(registry, activeMenuId);
      if (chain.length > 0) {
        return chain[0]!.id;
      }
    }
    return undefined;
  }, [registry, activeMenuId]);

  const [selectedTopId, setSelectedTopId] = useState<string | undefined>();
  const secondaryTopId =
    selectedTopId ??
    activeTopId ??
    visibleMenus.find((m) => m.type === 'group')?.id ??
    visibleMenus[0]?.id;
  const secondaryTop = visibleMenus.find((m) => m.id === secondaryTopId);
  const hasSecondary = (secondaryTop?.children?.length ?? 0) > 0;

  const breadcrumbItems = useMemo(() => {
    if (!showBreadcrumb || activeMenuId === undefined) {
      return [];
    }
    return findMenuChain(registry, activeMenuId).map((menu) => menu.title);
  }, [showBreadcrumb, registry, activeMenuId]);

  const currentPath = route?.path;

  /** 关闭页签：关闭当前页签时导航到剩余最后一个页签（与 antd 版一致） */
  const closeTab = (targetKey: string): void => {
    const remaining = tabsRef.current.filter((tab) => tab.key !== targetKey);
    setTabs(remaining);
    if (targetKey === currentPath && remaining.length > 0) {
      bridge.push(remaining[remaining.length - 1]!.key);
    }
  };

  const fixedHeader = config.fixedHeader ?? true;
  const fixedSider = config.fixedSider ?? true;

  const header = showHeader ? (
    <header
      data-slot="admin-header"
      className={cn(
        'flex h-14 items-center gap-4 border-b border-border bg-background px-6',
        fixedHeader && 'sticky top-0 z-20',
      )}
    >
      {/* side-full 模式品牌区在通栏 sidebar 顶部，header 不再重复 */}
      {mode !== 'side-full' && (
        <>
          {brand.logo}
          <span data-slot="admin-brand" className="text-lg font-semibold">
            {brand.title}
          </span>
        </>
      )}
      <div className="flex-1" />
      {headerExtra}
    </header>
  ) : null;

  /** two-column 第一列：一级菜单窄列（标题首字符作图标位） */
  const primaryColumn = (
    <div
      data-slot="admin-primary-col"
      className="flex w-12 shrink-0 flex-col items-center gap-1 border-r border-border py-2"
    >
      {visibleMenus.map((menu) => (
        <button
          key={menu.id}
          type="button"
          data-slot="admin-primary-item"
          data-active={
            menu.id === secondaryTopId || menu.id === activeTopId || undefined
          }
          className={cn(
            menuItemClass,
            'size-10 justify-center px-0 font-semibold',
            (menu.id === secondaryTopId || menu.id === activeTopId) &&
              'bg-accent text-accent-foreground',
          )}
          disabled={menu.disabled}
          title={menu.title}
          onClick={() => {
            if (menu.type === 'group') {
              setSelectedTopId(menu.id);
            } else {
              navigateMenuItem(menu, bridge);
            }
          }}
        >
          {menu.title.slice(0, 1)}
        </button>
      ))}
    </div>
  );

  // two-column 已有窄列形态，不再叠加收起 trigger
  const showTrigger = config.collapsible && mode !== 'two-column';

  const sidebar = showSidebar ? (
    <aside
      data-slot="admin-sidebar"
      data-collapsed={effectiveCollapsed || undefined}
      className={cn(
        'shrink-0 overflow-auto border-r border-border bg-background py-2',
        effectiveCollapsed ? 'w-16 px-1.5' : 'w-52',
        fixedSider &&
          (mode === 'side-full'
            ? 'sticky top-0 h-screen'
            : 'sticky top-14 h-[calc(100vh-3.5rem)]'),
      )}
      style={
        mode === 'two-column' && !hasSecondary ? { width: 56 } : undefined
      }
    >
      {mode === 'side-full' && (
        <div
          data-slot="admin-sidebar-brand"
          className="flex items-center gap-2 border-b border-border px-4 py-4 font-semibold"
        >
          {brand.logo}
          <span>{brand.title}</span>
        </div>
      )}
      {mode === 'two-column' ? (
        <div data-slot="admin-two-col" className="flex h-full">
          {primaryColumn}
          {/* 选中项无子菜单时隐藏第二列（sidebar 收窄为窄列） */}
          {hasSecondary && (
            <div data-slot="admin-secondary-col" className="min-w-0 flex-1">
              <MenuTree
                menus={secondaryTop?.children ?? []}
                registry={registry}
                bridge={bridge}
                activeMenuId={activeMenuId}
                defaultOpenKeys={defaultOpenKeys}
              />
            </div>
          )}
        </div>
      ) : (
        <MenuTree
          menus={visibleMenus}
          registry={registry}
          bridge={bridge}
          activeMenuId={activeMenuId}
          defaultOpenKeys={defaultOpenKeys}
          collapsed={effectiveCollapsed}
        />
      )}
      {showTrigger && (
        <button
          type="button"
          data-slot="admin-collapse-trigger"
          aria-label={
            effectiveCollapsed
              ? t('pactor.layout.expandSidebar')
              : t('pactor.layout.collapseSidebar')
          }
          aria-expanded={!effectiveCollapsed}
          className="sticky bottom-0 flex w-full cursor-pointer items-center justify-center border-t border-border bg-background py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          onClick={() => setCollapsed((value) => !value)}
        >
          {effectiveCollapsed ? '»' : '«'}
        </button>
      )}
    </aside>
  ) : null;

  const body = (
    <div data-slot="admin-body" className="flex min-w-0 flex-1 flex-col">
      {showTabs && (
        <div
          data-slot="admin-tabs"
          role="tablist"
          className="flex items-center gap-1 border-b border-border bg-background px-4 pt-2"
        >
          {tabs.map((tab, index) => (
            <div
              key={tab.key}
              data-slot="admin-tab"
              data-active={tab.key === currentPath || undefined}
              role="presentation"
              className={cn(
                'inline-flex items-center gap-1 rounded-t-md border border-b-0 border-border px-3 py-1.5 text-sm',
                tab.key === currentPath
                  ? 'bg-background font-medium text-foreground'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              <button
                type="button"
                role="tab"
                aria-selected={tab.key === currentPath}
                className="cursor-pointer"
                onClick={() => bridge.push(tab.key)}
              >
                {tab.title}
              </button>
              {/* 首页（首个页签）不可关，与 antd 版一致 */}
              {index > 0 && (
                <button
                  type="button"
                  data-slot="admin-tab-close"
                  aria-label={t('pactor.layout.closeTab', { title: tab.title })}
                  className="cursor-pointer text-muted-foreground hover:text-foreground"
                  onClick={() => closeTab(tab.key)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <main
        data-slot="admin-content"
        className="flex-1 bg-muted/40 p-6"
      >
        {showBreadcrumb && breadcrumbItems.length > 0 && (
          <nav
            data-slot="admin-breadcrumb"
            aria-label={t('pactor.layout.breadcrumb')}
            className="mb-4"
          >
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              {breadcrumbItems.map((title, index) => (
                <li key={index} className="flex items-center gap-2">
                  {index > 0 && <span aria-hidden>/</span>}
                  <span data-slot="breadcrumb-link">{title}</span>
                </li>
              ))}
            </ol>
          </nav>
        )}
        {children}
      </main>
    </div>
  );

  const footer = showFooter ? (
    <footer
      data-slot="admin-footer"
      className="bg-muted p-4 text-center text-sm text-muted-foreground"
    >
      {brand.title}
    </footer>
  ) : null;

  return (
    <div
      data-slot="admin-layout"
      data-mode={mode}
      data-fixed-header={fixedHeader || undefined}
      data-fixed-sider={fixedSider || undefined}
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      {mode === 'side-full' ? (
        <div data-slot="admin-side-full" className="flex min-h-screen flex-1">
          {sidebar}
          <div
            data-slot="admin-side-full-main"
            className="flex min-w-0 flex-1 flex-col"
          >
            {header}
            {body}
            {footer}
          </div>
        </div>
      ) : (
        <>
          {header}
          <div data-slot="admin-main" className="flex min-h-0 flex-1">
            {sidebar}
            {body}
          </div>
          {footer}
        </>
      )}
    </div>
  );
}
