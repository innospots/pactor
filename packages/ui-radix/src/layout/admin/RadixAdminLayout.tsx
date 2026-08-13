import * as Accordion from '@radix-ui/react-accordion';
import * as Popover from '@radix-ui/react-popover';
import {
  collectDefaultOpenKeys,
  findMenuChain,
  type AdminLayoutProps,
} from 'pactor-ui-antd/layout';
import type { PermissionChecker } from 'pactor-permission';
import { filterMenusByPermission } from 'pactor-permission';
import {
  resolveRoute,
  type MenuItem,
  type MenuRegistry,
  type NavigationBridge,
  type RouteContext,
} from 'pactor-router';
import { useI18n } from 'pactor-runtime';
import { useEffect, useMemo, useRef, useState } from 'react';

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
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="pcr-menu-item"
          disabled={menu.disabled}
          title={menu.title}
          onMouseEnter={openNow}
          onMouseLeave={closeLater}
        >
          {menu.title.slice(0, 1)}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="pcr-menu-flyout"
          side="right"
          align="start"
          sideOffset={8}
          onMouseEnter={openNow}
          onMouseLeave={closeLater}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onClick={(event) => {
            // 浮层内点中 page 项（导航）后关闭浮层
            if ((event.target as HTMLElement).closest('.pcr-menu-item')) {
              setOpen(false);
            }
          }}
        >
          <div className="pcr-menu-flyout-title">{menu.title}</div>
          <MenuTree
            menus={menu.children ?? []}
            registry={registry}
            bridge={bridge}
            activeMenuId={activeMenuId}
            defaultOpenKeys={defaultOpenKeys}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/**
 * 菜单树：group → Radix Accordion 折叠项（defaultOpen 组默认展开），
 * page / link → 按钮项；activeMenu 项加高亮 class；disabled 原样传递。
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
      <div className="pcr-menu pcr-menu--collapsed">
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
          const classes = ['pcr-menu-item'];
          if (menu.id === activeMenuId) {
            classes.push('pcr-menu-item-active');
          }
          return (
            <button
              key={menu.id}
              type="button"
              className={classes.join(' ')}
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
    <Accordion.Root
      type="multiple"
      defaultValue={defaultOpenKeys}
      className="pcr-menu"
    >
      {menus.map((menu) => {
        if (menu.type === 'group') {
          return (
            <Accordion.Item
              key={menu.id}
              value={menu.id}
              className="pcr-menu-group"
            >
              <Accordion.Header className="pcr-menu-group-header">
                <Accordion.Trigger
                  className="pcr-menu-group-trigger"
                  disabled={menu.disabled}
                  title={menu.title}
                >
                  {menu.title}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="pcr-menu-group-content">
                <MenuTree
                  menus={menu.children ?? []}
                  registry={registry}
                  bridge={bridge}
                  activeMenuId={activeMenuId}
                  defaultOpenKeys={defaultOpenKeys}
                />
              </Accordion.Content>
            </Accordion.Item>
          );
        }
        const classes = ['pcr-menu-item'];
        if (menu.id === activeMenuId) {
          classes.push('pcr-menu-item-active');
        }
        return (
          <button
            key={menu.id}
            type="button"
            className={classes.join(' ')}
            disabled={menu.disabled}
            title={menu.title}
            onClick={() => navigateMenuItem(registry.findById(menu.id), bridge)}
          >
            {menu.title}
          </button>
        );
      })}
    </Accordion.Root>
  );
}

/**
 * RadixAdminLayout：与 pactor-layout 的 AdminLayout（antd 版）契约一致——
 * 复用 `AdminLayoutProps`；Header（brand + headerExtra）/ Sidebar / 内容出口；
 * config 开关（header/sidebar 缺省开，tabs/breadcrumb/footer 缺省关）一致；
 * mode（top-side/top-bottom/side-full/two-column）、fixedHeader/fixedSider、
 * collapsible/collapsed、breakpoint 响应式收起与 antd 版语义一致。
 * 菜单由 MenuRegistry 可见树渲染（group 折叠经 Radix Accordion），
 * permissionChecker 过滤、activeMenu 高亮、page → bridge.push、
 * link/external → window.open；Breadcrumb 按菜单链；Tabs 访问页签
 * （去重、点击导航、关闭当前回退最后一个）。route props 优先、
 * bridge 订阅兜底的选中态来源与 antd 版一致。
 */
export function RadixAdminLayout({
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
  const defaultOpenKeys = useMemo(
    () => collectDefaultOpenKeys(registry, activeMenuId),
    [registry, activeMenuId],
  );

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

  const rootClasses = ['pcr-admin-layout'];
  if (config.fixedHeader ?? true) rootClasses.push('pcr-admin-layout--fixed-header');
  if (config.fixedSider ?? true) rootClasses.push('pcr-admin-layout--fixed-sider');
  if (effectiveCollapsed) rootClasses.push('pcr-admin-layout--collapsed');

  const header = showHeader ? (
    <header className="pcr-admin-header">
      {/* side-full 模式品牌区在通栏 sidebar 顶部，header 不再重复 */}
      {mode !== 'side-full' && (
        <>
          {brand.logo}
          <span className="pcr-admin-brand">{brand.title}</span>
        </>
      )}
      <div className="pcr-admin-header-spacer" />
      {headerExtra}
    </header>
  ) : null;

  /** two-column 第一列：一级菜单窄列（标题首字符作图标位） */
  const primaryColumn = (
    <div className="pcr-admin-primary-col">
      {visibleMenus.map((menu) => {
        const classes = ['pcr-admin-primary-item'];
        if (menu.id === secondaryTopId || menu.id === activeTopId) {
          classes.push('pcr-admin-primary-item-active');
        }
        return (
          <button
            key={menu.id}
            type="button"
            className={classes.join(' ')}
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
        );
      })}
    </div>
  );

  // two-column 已有窄列形态，不再叠加收起 trigger
  const showTrigger = config.collapsible && mode !== 'two-column';

  const sidebar = showSidebar ? (
    <aside
      className="pcr-admin-sidebar"
      data-collapsed={effectiveCollapsed || undefined}
      style={
        mode === 'two-column' && !hasSecondary ? { width: 56 } : undefined
      }
    >
      {mode === 'side-full' && (
        <div className="pcr-admin-sidebar-brand">
          {brand.logo}
          <span>{brand.title}</span>
        </div>
      )}
      {mode === 'two-column' ? (
        <div className="pcr-admin-two-col">
          {primaryColumn}
          {/* 选中项无子菜单时隐藏第二列（sidebar 收窄为窄列） */}
          {hasSecondary && (
            <div className="pcr-admin-secondary-col">
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
          className="pcr-admin-collapse-trigger"
          aria-label={
            effectiveCollapsed
              ? t('pactor.layout.expandSidebar')
              : t('pactor.layout.collapseSidebar')
          }
          aria-expanded={!effectiveCollapsed}
          onClick={() => setCollapsed((value) => !value)}
        >
          {effectiveCollapsed ? '»' : '«'}
        </button>
      )}
    </aside>
  ) : null;

  const body = (
    <div className="pcr-admin-body">
      {showTabs && (
        <div className="pcr-admin-tabs" role="tablist">
          {tabs.map((tab, index) => {
            const tabClasses = ['pcr-tab'];
            if (tab.key === currentPath) {
              tabClasses.push('pcr-tab-active');
            }
            return (
              <div key={tab.key} className={tabClasses.join(' ')} role="presentation">
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab.key === currentPath}
                  className="pcr-tab-label"
                  onClick={() => bridge.push(tab.key)}
                >
                  {tab.title}
                </button>
                {/* 首页（首个页签）不可关，与 antd 版一致 */}
                {index > 0 && (
                  <button
                    type="button"
                    className="pcr-tab-close"
                    aria-label={t('pactor.layout.closeTab', { title: tab.title })}
                    onClick={() => closeTab(tab.key)}
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
      <main className="pcr-admin-content">
        {showBreadcrumb && breadcrumbItems.length > 0 && (
          <nav
            className="pcr-admin-breadcrumb"
            aria-label={t('pactor.layout.breadcrumb')}
          >
            <ol className="pcr-breadcrumb-list">
              {breadcrumbItems.map((title, index) => (
                <li key={index} className="pcr-breadcrumb-item">
                  {index > 0 && (
                    <span className="pcr-breadcrumb-separator">/</span>
                  )}
                  <span className="pcr-breadcrumb-link">{title}</span>
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
    <footer className="pcr-admin-footer">{brand.title}</footer>
  ) : null;

  return (
    <div className={rootClasses.join(' ')} data-mode={mode}>
      {mode === 'side-full' ? (
        <div className="pcr-admin-side-full">
          {sidebar}
          <div className="pcr-admin-side-full-main">
            {header}
            {body}
            {footer}
          </div>
        </div>
      ) : (
        <>
          {header}
          <div className="pcr-admin-main">
            {sidebar}
            {body}
          </div>
          {footer}
        </>
      )}
    </div>
  );
}
