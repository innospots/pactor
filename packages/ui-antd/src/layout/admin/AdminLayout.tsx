import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Breadcrumb, Layout, Menu, Tabs } from 'antd';
import type { PermissionChecker } from 'pactor-permission';
import { filterMenusByPermission } from 'pactor-permission';
import {
  resolveRoute,
  type MenuItem,
  type MenuRegistry,
  type NavigationBridge,
  type RouteContext,
} from 'pactor-router';

import { findMenuChain } from './menu-chain.js';
import {
  buildAntdMenuItems,
  buildMenuItems,
  collectDefaultOpenKeys,
} from './menu-items.js';

/** 结构模式（对齐 antd Layout 经典布局演示） */
export type AdminLayoutMode =
  /** 顶部 header + 下方 sidebar/content（缺省） */
  | 'top-side'
  /** 上-中-下：header + content + footer，无 sidebar */
  | 'top-bottom'
  /** 通栏侧边：sidebar 全高居左（含品牌区），header+content 居右 */
  | 'side-full'
  /** 侧边两列：一级菜单窄列 + 当前一级菜单的子菜单列 */
  | 'two-column';

/** 响应式断点（对齐 antd Grid 断点；视口小于断点时 sidebar 自动收起） */
export type AdminLayoutBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/** 布局配置（bootstrap.layout 透传；缺省：header/sidebar 开，tabs/breadcrumb/footer 关，mode top-side） */
export interface AdminLayoutConfig {
  header?: boolean;
  sidebar?: boolean;
  tabs?: boolean;
  breadcrumb?: boolean;
  footer?: boolean;
  /** 结构模式，缺省 'top-side' */
  mode?: AdminLayoutMode;
  /** 固定顶部（内容区独立滚动），缺省 true；显式 false 关闭 */
  fixedHeader?: boolean;
  /** 固定侧边栏（sidebar 自身滚动，不随内容区），缺省 true；显式 false 关闭 */
  fixedSider?: boolean;
  /** sidebar 收起/展开 trigger */
  collapsible?: boolean;
  /** 初始收起（仅 collapsible 时有意义） */
  collapsed?: boolean;
  /** 视口小于断点时 sidebar 自动收起 */
  breakpoint?: AdminLayoutBreakpoint;
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

/** antd Layout.Header 缺省高度（fixedSider 的 sticky top 补偿） */
const HEADER_HEIGHT = 64;

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
 *
 * 结构模式（config.mode）：top-side（缺省）/ top-bottom（上-中-下）/
 * side-full（侧边通栏）/ two-column（侧边两列）；fixedHeader /
 * fixedSider 固定区域；collapsible + collapsed 收起侧边栏；
 * breakpoint 响应式自动收起。
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
  const mode = config.mode ?? 'top-side';
  const showHeader = config.header ?? true;
  const showSidebar = (config.sidebar ?? true) && mode !== 'top-bottom';
  const showTabs = config.tabs ?? false;
  const showBreadcrumb = config.breadcrumb ?? false;
  const showFooter = config.footer ?? false;

  // 侧边栏收起：collapsed 初始值 + breakpoint 命中时强制收起
  const [collapsed, setCollapsed] = useState(config.collapsed ?? false);
  const [broken, setBroken] = useState(false);
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

  const menuItems = useMemo(
    () => buildMenuItems(registry, permissionChecker),
    [registry, permissionChecker],
  );
  const defaultOpenKeys = useMemo(
    () => collectDefaultOpenKeys(registry),
    [registry],
  );

  // two-column：可见一级菜单 + 当前选中一级项（激活链首项优先）
  const topMenus = useMemo(() => {
    const tree = registry.tree();
    return permissionChecker === undefined
      ? [...tree]
      : filterMenusByPermission(tree, permissionChecker);
  }, [registry, permissionChecker]);

  const activeTopId = useMemo(() => {
    if (activeMenuId !== undefined) {
      const chain = findMenuChain(registry, activeMenuId);
      if (chain.length > 0) {
        return chain[0]!.id;
      }
    }
    return undefined;
  }, [registry, activeMenuId]);

  // two-column 第二列展示的一级项：用户点选优先，否则激活链首项，再否则首个 group
  const [selectedTopId, setSelectedTopId] = useState<string | undefined>();
  const secondaryTopId = selectedTopId ?? activeTopId ?? topMenus.find((m) => m.type === 'group')?.id ?? topMenus[0]?.id;
  const secondaryTop = topMenus.find((m) => m.id === secondaryTopId);
  const hasSecondary = (secondaryTop?.children?.length ?? 0) > 0;
  const secondaryItems = useMemo(
    () =>
      secondaryTop?.children !== undefined
        ? buildAntdMenuItems(secondaryTop.children)
        : [],
    [secondaryTop],
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

  const header = showHeader ? (
    <Layout.Header
      className="pactor-admin-header"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        ...(config.fixedHeader ?? true
          ? { position: 'sticky', top: 0, zIndex: 101 }
          : undefined),
      }}
    >
      {/* side-full 模式品牌区在通栏 sidebar 顶部，header 不再重复 */}
      {mode !== 'side-full' && (
        <>
          {brand.logo}
          <span className="pactor-admin-brand" style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>
            {brand.title}
          </span>
        </>
      )}
      <div style={{ flex: 1 }} />
      {headerExtra}
    </Layout.Header>
  ) : null;

  const menu = (
    <Menu
      mode="inline"
      items={menuItems}
      selectedKeys={activeMenuId !== undefined ? [activeMenuId] : []}
      defaultOpenKeys={defaultOpenKeys}
      inlineCollapsed={mode === 'two-column' ? false : effectiveCollapsed}
      onClick={({ key }) => {
        navigateMenuItem(registry.findById(key), bridge);
      }}
    />
  );

  /** two-column 第一列：一级菜单窄列（标题首字符作图标位；antd 侧无样式表，用内联样式） */
  const primaryColumn = (
    <div
      className="pactor-admin-primary-col"
      style={{
        width: 48,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: '8px 4px',
        borderRight: '1px solid #f0f0f0',
      }}
    >
      {topMenus.map((menu) => {
        const active = menu.id === secondaryTopId || menu.id === activeTopId;
        return (
          <button
            key={menu.id}
            type="button"
            className={`pactor-admin-primary-item${active ? ' pactor-admin-primary-item-active' : ''}`}
            disabled={menu.disabled}
            title={menu.title}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              border: 'none',
              borderRadius: 6,
              background: active ? '#1677ff' : 'transparent',
              color: active ? '#fff' : 'rgba(0, 0, 0, 0.65)',
              fontWeight: 600,
              cursor: menu.disabled ? 'not-allowed' : 'pointer',
            }}
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

  const siderStyle: CSSProperties | undefined = (config.fixedSider ?? true)
    ? {
        position: 'sticky',
        top: mode === 'side-full' ? 0 : showHeader ? HEADER_HEIGHT : 0,
        height:
          mode === 'side-full'
            ? '100vh'
            : `calc(100vh - ${showHeader ? HEADER_HEIGHT : 0}px)`,
        overflow: 'auto',
      }
    : undefined;

  // two-column 已有窄列形态，不再叠加 antd 收起 trigger
  const siderCollapsible = config.collapsible && mode !== 'two-column';

  const sidebar = showSidebar ? (
    <Layout.Sider
      className="pactor-admin-sidebar"
      theme="light"
      style={siderStyle}
      width={mode === 'two-column' ? (hasSecondary ? 256 : 56) : 200}
      collapsible={siderCollapsible}
      collapsed={mode === 'two-column' ? false : effectiveCollapsed}
      onCollapse={(value) => setCollapsed(value)}
      breakpoint={config.breakpoint}
      onBreakpoint={(value) => setBroken(value)}
    >
      {mode === 'side-full' && (
        <div className="pactor-admin-sidebar-brand" style={{ padding: 16, fontWeight: 600 }}>
          {brand.logo}
          <span>{brand.title}</span>
        </div>
      )}
      {mode === 'two-column' ? (
        <div className="pactor-admin-two-col" style={{ display: 'flex', height: '100%' }}>
          {primaryColumn}
          {/* 选中项无子菜单时隐藏第二列（sidebar 收窄为窄列） */}
          {hasSecondary && (
            <div className="pactor-admin-secondary-col" style={{ flex: 1, minWidth: 0 }}>
              <Menu
                mode="inline"
                items={secondaryItems}
                selectedKeys={activeMenuId !== undefined ? [activeMenuId] : []}
                defaultOpenKeys={defaultOpenKeys}
                onClick={({ key }) => {
                  navigateMenuItem(registry.findById(key), bridge);
                }}
              />
            </div>
          )}
        </div>
      ) : (
        menu
      )}
    </Layout.Sider>
  ) : null;

  const body = (
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
  );

  const footer = showFooter ? (
    <Layout.Footer className="pactor-admin-footer" style={{ textAlign: 'center' }}>
      {brand.title}
    </Layout.Footer>
  ) : null;

  return (
    <Layout
      className="pactor-admin-layout"
      data-mode={mode}
      style={{ minHeight: '100vh' }}
      hasSider={mode === 'side-full'}
    >
      {mode === 'side-full' ? (
        <>
          {sidebar}
          <Layout>
            {header}
            {body}
            {footer}
          </Layout>
        </>
      ) : (
        <>
          {header}
          <Layout hasSider={showSidebar}>
            {sidebar}
            {body}
          </Layout>
          {footer}
        </>
      )}
    </Layout>
  );
}
