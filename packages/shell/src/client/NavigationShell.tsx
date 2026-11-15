import {
  ChartNoAxesCombined,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Palette,
  Settings,
  Shield,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';

import { MenuRegistry, type MenuItem } from '@pactor-app/router';
import { useRenderer } from '@pactor-app/runtime';
import { isValidElement } from 'react';

/** 判断 prop 值是否为 DSL 节点（{ type: string } 裸对象），否则按 ReactNode 处理 */
function isDslNode(value: unknown): value is { type: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    !isValidElement(value) &&
    typeof (value as { type?: unknown }).type === 'string'
  );
}

/** DSL 槽位渲染：布局 YAML 以 `railFooter: { type: UserMenu, ... }` 传节点对象 */
function RailSlot({ content }: { content: ReactNode }) {
  if (isDslNode(content)) {
    return <RailSlotInner node={content} />;
  }
  return <>{content}</>;
}

function RailSlotInner({ node }: { node: { type: string } }) {
  const { renderChildren } = useRenderer();
  return <>{renderChildren([node as never])}</>;
}

export interface NavigationMenuItem {
  id?: string;
  key?: string;
  label?: string;
  type?: string;
  pageId?: string;
  path?: string;
  title?: string;
  icon?: string;
  hidden?: boolean;
  activeMenu?: string;
  permission?: string | string[] | { code: string | string[] };
  children?: NavigationMenuItem[];
}

/** 文案标签：全部可经 props 覆盖（DSL props 同名），缺省中文 */
export interface NavigationShellLabels {
  navMain: string;
  /** 二级侧栏 aria-label，{name} 替换为分组标题 */
  navModule: string;
}

const DEFAULT_LABELS: NavigationShellLabels = {
  navMain: '主导航',
  navModule: '{name}',
};

export interface NavigationShellProps {
  menus?: NavigationMenuItem[];
  /** 品牌 mark 字符（图标轨顶部方块），缺省 P */
  brandMark?: string;
  /** 图标轨悬停展开（显示文案），缺省 false */
  expandRailOnHover?: boolean;
  /**
   * 图标轨底部插槽（贴底渲染）。默认 admin 布局挂 `type: UserMenu`
   * （内置账户菜单组件）；纯 React 使用时直接传 ReactNode。
   */
  railFooter?: ReactNode;
  labels?: Partial<NavigationShellLabels>;
  children?: ReactNode;
}

const ICONS: Record<string, LucideIcon> = {
  'message-square': MessageSquare,
  workspace: LayoutDashboard,
  workbench: LayoutDashboard,
  home: LayoutDashboard,
  'chart-no-axes-combined': ChartNoAxesCombined,
  chart: ChartNoAxesCombined,
  analytics: ChartNoAxesCombined,
  shield: Shield,
  'file-text': FileText,
  file: FileText,
  settings: Settings,
  palette: Palette,
  themes: Palette,
  user: UserRound,
};

function iconFor(name: string | undefined): LucideIcon {
  return ICONS[(name ?? '').toLowerCase()] ?? MessageSquare;
}

function isGroup(item: NavigationMenuItem): boolean {
  return item.type === 'group' || (item.children !== undefined && item.children.length > 0);
}

function visibleChildren(group: NavigationMenuItem): NavigationMenuItem[] {
  return (group.children ?? []).filter((item) => !item.hidden && navPath(item));
}

function navId(item: NavigationMenuItem): string | undefined {
  return item.id ?? item.key ?? item.path;
}

function navPath(item: NavigationMenuItem): string | undefined {
  return item.path ?? (item.key?.startsWith('/') ? item.key : undefined);
}

function menuTitle(item: NavigationMenuItem): string {
  return item.title ?? item.label ?? '';
}

/** Adapt the server's sitemap menu to Pactor's route registry. */
export function createNavigationRegistry(menus: NavigationMenuItem[]): MenuRegistry {
  function convert(items: NavigationMenuItem[]): MenuItem[] {
    return items.flatMap((item) => {
      const id = navId(item);
      if (!id) return [];
      const type = isGroup(item) ? 'group' : item.type === 'link' ? 'link' : 'page';
      return [{
        id, type, title: menuTitle(item), path: navPath(item), pageId: item.pageId,
        hidden: item.hidden, activeMenu: item.activeMenu,
        ...(item.children ? { children: convert(item.children) } : {}),
      }];
    });
  }
  return new MenuRegistry(convert(menus));
}

/** Session navigation excludes hidden pages; find their nearest visible parent route. */
export function findNavigationMenu(registry: MenuRegistry, pathname: string): MenuItem | undefined {
  const segments = pathname.split('/').filter(Boolean);
  while (segments.length > 0) {
    const hit = registry.findByPath(`/${segments.join('/')}`)?.menu;
    if (hit) return hit;
    segments.pop();
  }
  return registry.findByPath('/')?.menu;
}

function groupContains(group: NavigationMenuItem, currentId: string | undefined): boolean {
  if (!currentId) return false;
  return visibleChildren(group).some(
    (item) =>
      navId(item) === currentId ||
      item.pageId === currentId ||
      item.activeMenu === currentId,
  );
}

/**
 * Rail 风格壳导航布局（移植自 starters/next-app-starter 的 NavigationShell）：
 * 一级菜单图标轨 + 命中分组的二级侧栏；底部账户区由 railFooter 插槽承担
 * （默认 admin 布局挂内置 UserMenu 组件）。同时作为 Pactor DSL 组件使用
 * （PactorShellHost 内建注册为 `NavigationShell`，DSL props 与本组件 props 同名）。
 */
export function NavigationShell({
  menus = [],
  brandMark = 'P',
  expandRailOnHover = false,
  railFooter,
  labels: labelsProp,
  children,
}: NavigationShellProps) {
  const labels: NavigationShellLabels = { ...DEFAULT_LABELS, ...labelsProp };
  const pathname = usePathname() ?? '/';
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);
  const topLevelMenus = useMemo(
    () =>
      menus.filter(
        (item) =>
          !item.hidden &&
          (isGroup(item) ? visibleChildren(item).length > 0 : Boolean(navPath(item))),
      ),
    [menus],
  );
  const registry = useMemo(() => createNavigationRegistry(menus), [menus]);
  const matchedMenu = findNavigationMenu(registry, pathname);
  const currentMenuId = matchedMenu?.activeMenu ?? matchedMenu?.id;
  const selectedTopLevel = useMemo(
    () =>
      topLevelMenus.find(
        (item) => navId(item) === currentMenuId || groupContains(item, currentMenuId),
      ),
    [currentMenuId, topLevelMenus],
  );
  const activeGroup =
    selectedTopLevel && isGroup(selectedTopLevel) ? selectedTopLevel : undefined;

  useEffect(() => {
    const content = mainRef.current?.querySelector<HTMLElement>('.shell-content');
    content?.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  function selectGroup(group: NavigationMenuItem) {
    if (!groupContains(group, currentMenuId)) {
      const first = visibleChildren(group)[0];
      const firstPath = first ? navPath(first) : undefined;
      if (firstPath) router.push(firstPath);
    }
  }

  return (
    <div className="kn-shell">
      <nav
        className={expandRailOnHover ? 'kn-rail kn-rail-expandable' : 'kn-rail'}
        aria-label={labels.navMain}
      >
        <div className="kn-mark" aria-hidden="true">
          {brandMark}
        </div>
        {topLevelMenus.map((item) => {
          const Icon = iconFor(item.icon);
          const itemId = navId(item);
          const title = menuTitle(item);
          const active = selectedTopLevel !== undefined && navId(selectedTopLevel) === itemId;
          const content = (
            <>
              <Icon size={18} strokeWidth={1.8} />
              <span className="kn-rail-label">{title}</span>
            </>
          );

          return isGroup(item) ? (
            <button
              key={itemId}
              type="button"
              className={active ? 'kn-rail-button is-active' : 'kn-rail-button'}
              aria-label={title}
              aria-pressed={active}
              title={title}
              onClick={() => selectGroup(item)}
            >
              {content}
            </button>
          ) : (
            <Link
              key={itemId}
              href={navPath(item) ?? '/'}
              className={active ? 'kn-rail-button is-active' : 'kn-rail-button'}
              aria-label={title}
              aria-current={active ? 'page' : undefined}
              title={title}
            >
              {content}
            </Link>
          );
        })}
        {railFooter !== undefined && railFooter !== null && (
          <div className="kn-rail-footer">
            <RailSlot content={railFooter} />
          </div>
        )}
      </nav>

      {activeGroup ? (
        <aside
          className="kn-sidebar"
          aria-label={labels.navModule.replace('{name}', menuTitle(activeGroup))}
        >
          <div className="kn-sidebar-title">{menuTitle(activeGroup)}</div>
          <nav className="kn-menu">
            {visibleChildren(activeGroup).map((item) => {
              const path = navPath(item)!;
              const active = navId(item) === currentMenuId || item.pageId === currentMenuId;
              return (
                <Link
                  key={navId(item)}
                  href={path}
                  aria-current={active ? 'page' : undefined}
                  className={active ? 'kn-menu-item is-active' : 'kn-menu-item'}
                >
                  {menuTitle(item)}
                </Link>
              );
            })}
          </nav>
        </aside>
      ) : null}

      <div className="kn-main" ref={mainRef}>
        {children}
      </div>
    </div>
  );
}
