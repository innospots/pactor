import { usePathname, useRouter } from 'next/navigation';
import {
  Fragment,
  useContext,
  useMemo,
  useState,
  type CSSProperties,
  type ComponentType,
  type ReactNode,
} from 'react';

import type { ThemeName } from '@pactor-app/theme';

import { formatBadge } from './badge.js';

import {
  ShellUserMenuConfigContext,
  type ShellUserMenuConfig,
} from './ShellUserMenu.js';
import { SkinSwitcher } from './SkinSwitcher.js';

export interface ShellMenuItem {
  id: string;
  title: string;
  /** 图标（ReactNode，由宿主渲染；sitemap 模式的菜单图标走 Pactor 管线） */
  icon?: ReactNode;
  path: string;
  order?: number;
  hidden?: boolean;
  /** 菜单徽标（0 / 空串 / 缺省不渲染，>99 显示 99+） */
  badge?: string | number;
  /** 分组标题：相邻同组项渲染在同一标题下 */
  group?: string;
}

export interface SubAppContext {
  pathname: string;
}

export interface AppShellProps {
  /** 品牌区；href / onClick 均缺省时不可点 */
  brand?: { title: string; logo?: ReactNode; href?: string; onClick?: () => void };
  /** 一级菜单：items 直传；sitemap 交给 Pactor sitemap 合并（菜单/布局由 DSL 承担） */
  menu?:
    | {
        mode: 'items';
        items: ShellMenuItem[];
        /** 受控高亮；缺省按 pathname 派生（精确 → 最长前缀） */
        activeKey?: string;
        onSelect?: (item: ShellMenuItem) => void;
      }
    | { mode: 'sitemap' };
  /** 皮肤设置 */
  skin?: {
    /** 可选皮肤名单，缺省主题包全部预置 */
    presets?: ThemeName[];
    /** 无持久化值时的缺省皮肤（应与 SkinHeadScript 的 defaultSkin 一致） */
    default?: ThemeName;
    storageKey?: string;
    modeStorageKey?: string;
    /** items 模式：侧栏底部渲染切换器，缺省 true */
    renderSwitcher?: boolean;
    /** 画廊首卡提供「默认皮肤」（回宿主基础皮肤），缺省 false */
    allowDefault?: boolean;
    onChange?: (skin: ThemeName | null) => void;
  };
  /** 布局样式 */
  layout?: {
    /** side-fixed（缺省，固定侧栏）/ side（可折叠）/ top（未实现，显式抛错） */
    variant?: 'side-fixed' | 'side' | 'top';
    sidebarWidth?: number;
    contentClassName?: string;
    contentStyle?: CSSProperties;
  };
  /** 子应用接入（参数传入，可混用）：path → 纯 React 子应用 */
  pages?: Record<string, ComponentType<SubAppContext>>;
  /** 子应用接入：自定义渲染（如 <PactorShellHost />） */
  renderSubApp?: (ctx: SubAppContext) => ReactNode;
  /** sitemap 模式：外壳内 DSL UserMenu 的默认配置（在线状态 / 主题 /
   *  密度 / 语言缺省全开）；PactorShellHost 的 userMenu prop 可再覆盖合并 */
  userMenu?: ShellUserMenuConfig;
  /** 面包屑（items 模式：内容区顶部，显示当前命中菜单），缺省 true */
  breadcrumb?: boolean;
  /** 兜底渲染定制；notFound 缺省为内置 404 风格提示 */
  fallbacks?: { notFound?: ReactNode; error?: ReactNode; loading?: ReactNode };
  /** 插槽 */
  headerExtra?: ReactNode;
  sidebarFooter?: ReactNode;
  footer?: ReactNode;
  /** 路由对接：缺省自动使用 next/navigation，一般不用传 */
  pathname?: string;
  navigate?: (to: string) => void;
}

function ShellNotFound({ pathname, onHome }: { pathname: string; onHome: () => void }) {
  return (
    <div className="pactor-shell-notfound">
      <div className="pactor-shell-notfound-code">404</div>
      <p className="pactor-shell-notfound-desc">未找到页面：{pathname}</p>
      <button type="button" className="pactor-shell-notfound-action" onClick={onHome}>
        返回首页
      </button>
    </div>
  );
}

/** 高亮派生：精确匹配优先，否则取最长前缀匹配的菜单项 */
function deriveActiveKey(items: ShellMenuItem[], pathname: string): string | undefined {
  const exact = items.find((item) => item.path === pathname);
  if (exact) return exact.id;
  let best: ShellMenuItem | undefined;
  for (const item of items) {
    if (item.path !== '/' && pathname.startsWith(`${item.path}/`)) {
      if (best === undefined || item.path.length > best.path.length) best = item;
    }
  }
  return best?.id;
}

export function AppShell(props: AppShellProps) {
  const detectedPathname = usePathname();
  const router = useRouter();
  const pathname = props.pathname ?? detectedPathname;
  const navigate = props.navigate ?? ((to: string) => router.push(to));

  const variant = props.layout?.variant ?? 'side-fixed';
  if (variant === 'top') {
    throw new Error('[app-shell] layout.variant "top" 尚未实现');
  }

  const [collapsed, setCollapsed] = useState(false);
  const inheritedUserMenu = useContext(ShellUserMenuConfigContext);
  const userMenuConfig = useMemo(
    () => (props.userMenu ? { ...inheritedUserMenu, ...props.userMenu } : inheritedUserMenu),
    [inheritedUserMenu, props.userMenu],
  );

  const notFoundFallback = props.fallbacks?.notFound ?? (
    <ShellNotFound pathname={pathname} onHome={() => navigate('/')} />
  );

  // sitemap 模式：菜单/布局由 Pactor DSL 布局链承担，外壳只提供子应用出口
  if (props.menu?.mode === 'sitemap') {
    return (
      <ShellUserMenuConfigContext.Provider value={userMenuConfig}>
        <div className="pactor-shell-root">
          {props.renderSubApp?.({ pathname }) ?? notFoundFallback}
        </div>
      </ShellUserMenuConfigContext.Provider>
    );
  }

  const menu = props.menu;
  const items = (menu?.mode === 'items' ? menu.items : [])
    .filter((item) => !item.hidden)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const activeKey =
    menu?.mode === 'items' && menu.activeKey !== undefined
      ? menu.activeKey
      : deriveActiveKey(items, pathname);

  const handleSelect = (item: ShellMenuItem) => {
    if (menu?.mode !== 'items') return;
    menu.onSelect?.(item);
    navigate(item.path);
  };

  const Page = props.pages?.[pathname];
  const outlet = Page ? (
    <Page pathname={pathname} />
  ) : (
    props.renderSubApp?.({ pathname }) ?? notFoundFallback
  );

  const skin = props.skin;

  const brand = props.brand;
  const brandInner = brand ? (
    <>
      {brand.logo}
      <span className="pactor-shell-menu-label">{brand.title}</span>
    </>
  ) : null;

  // items 模式为扁平一级菜单，面包屑链即当前命中项
  const activeItem = items.find((item) => item.id === activeKey);
  const showBreadcrumb = props.breadcrumb !== false && activeItem !== undefined;

  let lastGroup: string | undefined;

  return (
    <div className="pactor-shell-root">
      <aside
        className="pactor-shell-sidebar"
        data-collapsed={collapsed || undefined}
        style={
          props.layout?.sidebarWidth !== undefined && !collapsed
            ? { width: props.layout.sidebarWidth, flexBasis: props.layout.sidebarWidth }
            : undefined
        }
      >
        {brand &&
          (brand.onClick !== undefined || brand.href !== undefined ? (
            <button
              type="button"
              className="pactor-shell-brand is-clickable"
              onClick={() => (brand.onClick ? brand.onClick() : navigate(brand.href!))}
            >
              {brandInner}
            </button>
          ) : (
            <div className="pactor-shell-brand">{brandInner}</div>
          ))}
        <nav className="pactor-shell-menu" aria-label="一级菜单">
          {items.map((item) => {
            const groupTitle =
              item.group !== undefined && item.group !== lastGroup ? item.group : undefined;
            lastGroup = item.group;
            const badge = formatBadge(item.badge);
            return (
              <Fragment key={item.id}>
                {groupTitle !== undefined && (
                  <div className="pactor-shell-menu-group">{groupTitle}</div>
                )}
                <button
                  type="button"
                  className={`pactor-shell-menu-item${item.id === activeKey ? ' is-active' : ''}`}
                  onClick={() => handleSelect(item)}
                >
                  {item.icon}
                  <span className="pactor-shell-menu-label">{item.title}</span>
                  {badge !== null && (
                    <span className="pactor-shell-menu-badge">{badge}</span>
                  )}
                </button>
              </Fragment>
            );
          })}
        </nav>
        <div className="pactor-shell-sidebar-footer">
          {skin !== undefined && skin.renderSwitcher !== false && (
            <SkinSwitcher
              skins={skin.presets}
              defaultSkin={skin.default}
              allowDefault={skin.allowDefault}
              storageKey={skin.storageKey}
              modeStorageKey={skin.modeStorageKey}
              onChange={skin.onChange}
            />
          )}
          {props.sidebarFooter}
        </div>
        {variant === 'side' && (
          <button
            type="button"
            className="pactor-shell-collapse"
            aria-label={collapsed ? '展开菜单' : '收起菜单'}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? '»' : '«'}
          </button>
        )}
      </aside>
      <div className="pactor-shell-main">
        {props.headerExtra !== undefined && props.headerExtra !== null && (
          <header className="pactor-shell-header">{props.headerExtra}</header>
        )}
        {showBreadcrumb && (
          <nav className="pactor-shell-breadcrumb" aria-label="面包屑">
            <span className="pactor-shell-breadcrumb-text" aria-current="page">
              {activeItem.title}
            </span>
          </nav>
        )}
        <div
          className={`pactor-shell-content${props.layout?.contentClassName ? ` ${props.layout.contentClassName}` : ''}`}
          style={props.layout?.contentStyle}
        >
          {outlet}
        </div>
        {props.footer !== undefined && props.footer !== null && (
          <footer className="pactor-shell-footer">{props.footer}</footer>
        )}
      </div>
    </div>
  );
}
