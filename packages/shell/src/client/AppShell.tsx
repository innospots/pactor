import { usePathname, useRouter } from 'next/navigation';
import {
  useState,
  type CSSProperties,
  type ComponentType,
  type ReactNode,
} from 'react';

import type { ThemeName } from '@pactor-app/theme';

import { SkinSwitcher } from './SkinSwitcher.js';

export interface ShellMenuItem {
  id: string;
  title: string;
  /** 图标（ReactNode，由宿主渲染；sitemap 模式的菜单图标走 Pactor 管线） */
  icon?: ReactNode;
  path: string;
  order?: number;
  hidden?: boolean;
}

export interface SubAppContext {
  pathname: string;
}

export interface AppShellProps {
  /** 品牌区 */
  brand?: { title: string; logo?: ReactNode };
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
  /** 插槽 */
  headerExtra?: ReactNode;
  sidebarFooter?: ReactNode;
  footer?: ReactNode;
  /** 路由对接：缺省自动使用 next/navigation，一般不用传 */
  pathname?: string;
  navigate?: (to: string) => void;
}

function ShellNotFound({ pathname }: { pathname: string }) {
  return (
    <div className="pactor-shell-notfound">
      <strong>未找到页面</strong>
      <p>{pathname}</p>
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

  // sitemap 模式：菜单/布局由 Pactor DSL 布局链承担，外壳只提供子应用出口
  if (props.menu?.mode === 'sitemap') {
    return (
      <div className="pactor-shell-root">
        {props.renderSubApp?.({ pathname }) ?? <ShellNotFound pathname={pathname} />}
      </div>
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
    props.renderSubApp?.({ pathname }) ?? <ShellNotFound pathname={pathname} />
  );

  const skin = props.skin;

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
        {props.brand && (
          <div className="pactor-shell-brand">
            {props.brand.logo}
            <span className="pactor-shell-menu-label">{props.brand.title}</span>
          </div>
        )}
        <nav className="pactor-shell-menu" aria-label="一级菜单">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`pactor-shell-menu-item${item.id === activeKey ? ' is-active' : ''}`}
              onClick={() => handleSelect(item)}
            >
              {item.icon}
              <span className="pactor-shell-menu-label">{item.title}</span>
            </button>
          ))}
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
