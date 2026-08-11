import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Breadcrumb, Layout, Menu, Tabs } from 'antd';
import type { PermissionChecker } from 'pactor-permission';
import {
  resolveRoute,
  type MenuItem,
  type MenuRegistry,
  type NavigationBridge,
  type RouteContext,
} from 'pactor-router';

import { findMenuChain } from './menu-chain.js';
import { buildMenuItems, collectDefaultOpenKeys } from './menu-items.js';

/** 区域开关（缺省：header/sidebar 开，tabs/breadcrumb/footer 关） */
export interface AdminLayoutConfig {
  header?: boolean;
  sidebar?: boolean;
  tabs?: boolean;
  breadcrumb?: boolean;
  footer?: boolean;
}

/** 品牌区 */
export interface AdminBrand {
  title: string;
  logo?: ReactNode;
}

/**
 * AdminLayout props（设计决策 D1）。
 *
 * `route` 优先用于选中态（测试友好）；未传时内部订阅 bridge
 * 自行 resolveRoute（生产用法）。
 */
export interface AdminLayoutProps {
  config?: AdminLayoutConfig;
  brand: AdminBrand;
  registry: MenuRegistry;
  bridge: NavigationBridge;
  route?: RouteContext;
  permissionChecker?: PermissionChecker;
  headerExtra?: ReactNode;
  children?: ReactNode;
}

/** 访问页签（设计决策 D3） */
interface VisitedTab {
  key: string;
  title: string;
}

/**
 * 点击菜单项的导航行为：page（非 external）→ bridge.push(path)；
 * external / link → window.open 新窗口（测试环境可 stub window.open）。
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

/**
 * AdminLayout：标准管理后台外壳（Header / Sidebar / Breadcrumb /
 * Tabs / Footer 开关 + 内容出口）。布局只管外壳与导航，
 * 不感知 PageRuntime；内容区是 children 出口。
 */
export function AdminLayout({
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

  const menuItems = useMemo(
    () => buildMenuItems(registry, permissionChecker),
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
    return findMenuChain(registry, activeMenuId).map((menu) => ({
      title: menu.title,
    }));
  }, [showBreadcrumb, registry, activeMenuId]);

  const currentPath = route?.path;

  return (
    <Layout className="pactor-admin-layout" style={{ minHeight: '100vh' }}>
      {showHeader && (
        <Layout.Header
          className="pactor-admin-header"
          style={{ display: 'flex', alignItems: 'center', gap: 16 }}
        >
          {brand.logo}
          <span className="pactor-admin-brand" style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>
            {brand.title}
          </span>
          <div style={{ flex: 1 }} />
          {headerExtra}
        </Layout.Header>
      )}
      <Layout>
        {showSidebar && (
          <Layout.Sider className="pactor-admin-sidebar" theme="light">
            <Menu
              mode="inline"
              items={menuItems}
              selectedKeys={activeMenuId !== undefined ? [activeMenuId] : []}
              defaultOpenKeys={defaultOpenKeys}
              onClick={({ key }) => {
                navigateMenuItem(registry.findById(key), bridge);
              }}
            />
          </Layout.Sider>
        )}
        <Layout>
          {showTabs && (
            <Tabs
              className="pactor-admin-tabs"
              type="editable-card"
              hideAdd
              activeKey={currentPath}
              items={tabs.map((tab, index) => ({
                key: tab.key,
                label: tab.title,
                // 首页（首个页签）不可关
                closable: index > 0,
              }))}
              onChange={(key) => {
                bridge.push(key);
              }}
              onEdit={(targetKey, action) => {
                if (action !== 'remove' || typeof targetKey !== 'string') {
                  return;
                }
                const remaining = tabsRef.current.filter(
                  (tab) => tab.key !== targetKey,
                );
                setTabs(remaining);
                // 关闭当前页签：导航到剩余最后一个页签
                if (targetKey === currentPath && remaining.length > 0) {
                  bridge.push(remaining[remaining.length - 1].key);
                }
              }}
            />
          )}
          <Layout.Content className="pactor-admin-content" style={{ padding: 24 }}>
            {showBreadcrumb && breadcrumbItems.length > 0 && (
              <Breadcrumb
                className="pactor-admin-breadcrumb"
                style={{ marginBottom: 16 }}
                items={breadcrumbItems}
              />
            )}
            {children}
          </Layout.Content>
        </Layout>
      </Layout>
      {showFooter && (
        <Layout.Footer className="pactor-admin-footer" style={{ textAlign: 'center' }}>
          {brand.title}
        </Layout.Footer>
      )}
    </Layout>
  );
}
