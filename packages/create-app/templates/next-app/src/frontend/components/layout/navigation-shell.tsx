"use client";

import {
  ChartNoAxesCombined,
  LayoutDashboard,
  MessageSquare,
  Settings,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { MenuRegistry, type MenuItem } from "@pactor-app/router";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef } from "react";

import { AccountMenu } from "./account-menu";
import type { SessionUser } from "../../types/session";
import { useHostI18n } from "../../i18n/messages";
import { navigationConfig } from "../../config";

export interface NavMenu {
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
  children?: NavMenu[];
}

interface NavigationShellProps {
  menus?: NavMenu[];
  user?: SessionUser;
  children?: ReactNode;
}

const ICONS: Record<string, LucideIcon> = {
  "message-square": MessageSquare,
  workspace: LayoutDashboard,
  workbench: LayoutDashboard,
  "chart-no-axes-combined": ChartNoAxesCombined,
  chart: ChartNoAxesCombined,
  analytics: ChartNoAxesCombined,
  settings: Settings,
};

function iconFor(name: string | undefined): LucideIcon {
  return ICONS[(name ?? "").toLowerCase()] ?? MessageSquare;
}

function isGroup(item: NavMenu): boolean {
  return item.type === "group" || (item.children !== undefined && item.children.length > 0);
}

function visibleChildren(group: NavMenu): NavMenu[] {
  return (group.children ?? []).filter((item) => !item.hidden && navPath(item));
}

function navId(item: NavMenu): string | undefined {
  return item.id ?? item.key ?? item.path;
}

function navPath(item: NavMenu): string | undefined {
  return item.path ?? (item.key?.startsWith("/") ? item.key : undefined);
}

function menuTitle(item: NavMenu): string {
  return item.title ?? item.label ?? "";
}

/** Adapt the server's sitemap menu to Pactor's route registry. */
export function createNavigationRegistry(menus: NavMenu[]): MenuRegistry {
  function convert(items: NavMenu[]): MenuItem[] {
    return items.flatMap((item) => {
      const id = navId(item);
      if (!id) return [];
      const type = isGroup(item) ? "group" : item.type === "link" ? "link" : "page";
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
  const segments = pathname.split("/").filter(Boolean);
  while (segments.length > 0) {
    const hit = registry.findByPath(`/${segments.join("/")}`)?.menu;
    if (hit) return hit;
    segments.pop();
  }
  return registry.findByPath("/")?.menu;
}

function groupContains(group: NavMenu, currentId: string | undefined): boolean {
  if (!currentId) return false;
  return visibleChildren(group).some(
    (item) =>
      navId(item) === currentId ||
      item.pageId === currentId ||
      item.activeMenu === currentId,
  );
}

export function NavigationShell({ menus = [], user, children }: NavigationShellProps) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const { t } = useHostI18n();
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
  const routedTopLevel = useMemo(
    () =>
      topLevelMenus.find(
        (item) => navId(item) === currentMenuId || groupContains(item, currentMenuId),
      ),
    [currentMenuId, topLevelMenus],
  );
  const selectedTopLevel = routedTopLevel;
  const activeGroup =
    selectedTopLevel && isGroup(selectedTopLevel) ? selectedTopLevel : undefined;

  useEffect(() => {
    const content = mainRef.current?.querySelector<HTMLElement>(".shell-content");
    content?.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  function selectGroup(group: NavMenu) {
    if (!groupContains(group, currentMenuId)) {
      const first = visibleChildren(group)[0];
      const firstPath = first ? navPath(first) : undefined;
      if (firstPath) router.push(firstPath);
    }
  }

  return (
    <div className="kn-shell">
      <nav className={navigationConfig.expandRailOnHover ? "kn-rail kn-rail-expandable" : "kn-rail"} aria-label={t("nav.main")}>
        <div className="kn-mark" aria-hidden="true">
          P
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
              className={active ? "kn-rail-button is-active" : "kn-rail-button"}
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
              href={navPath(item) ?? "/"}
              className={active ? "kn-rail-button is-active" : "kn-rail-button"}
              aria-label={title}
              aria-current={active ? "page" : undefined}
              title={title}
            >
              {content}
            </Link>
          );
        })}
        <AccountMenu user={user} />
      </nav>

      {activeGroup ? (
        <aside
          className="kn-sidebar"
          aria-label={t("nav.moduleMenu", { name: menuTitle(activeGroup) })}
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
                  aria-current={active ? "page" : undefined}
                  className={active ? "kn-menu-item is-active" : "kn-menu-item"}
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
