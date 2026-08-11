import * as Accordion from '@radix-ui/react-accordion';
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
import { useEffect, useMemo, useRef, useState } from 'react';

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
}

/**
 * 菜单树：group → Radix Accordion 折叠项（defaultOpen 组默认展开），
 * page / link → 按钮项；activeMenu 项加高亮 class；disabled 原样传递。
 */
function MenuTree({
  menus,
  registry,
  bridge,
  activeMenuId,
  defaultOpenKeys,
}: MenuTreeProps) {
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
  const showHeader = config.header ?? true;
  const showSidebar = config.sidebar ?? true;
  const showTabs = config.tabs ?? false;
  const showBreadcrumb = config.breadcrumb ?? false;
  const showFooter = config.footer ?? false;

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
    () => collectDefaultOpenKeys(registry),
    [registry],
  );

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

  return (
    <div className="pcr-admin-layout">
      {showHeader && (
        <header className="pcr-admin-header">
          {brand.logo}
          <span className="pcr-admin-brand">{brand.title}</span>
          <div className="pcr-admin-header-spacer" />
          {headerExtra}
        </header>
      )}
      <div className="pcr-admin-main">
        {showSidebar && (
          <aside className="pcr-admin-sidebar">
            <MenuTree
              menus={visibleMenus}
              registry={registry}
              bridge={bridge}
              activeMenuId={activeMenuId}
              defaultOpenKeys={defaultOpenKeys}
            />
          </aside>
        )}
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
                        aria-label={`关闭 ${tab.title}`}
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
              <nav className="pcr-admin-breadcrumb" aria-label="面包屑">
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
      </div>
      {showFooter && <footer className="pcr-admin-footer">{brand.title}</footer>}
    </div>
  );
}
