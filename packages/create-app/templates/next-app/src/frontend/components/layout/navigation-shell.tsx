"use client";

import {
  ChartNoAxesCombined,
  LayoutDashboard,
  MessageSquare,
  Settings,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { AccountMenu } from "./account-menu";
import type { SessionUser } from "../auth/profile-page";
import { useHostI18n } from "../../i18n/messages";

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

function normalizePath(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

function matchesPattern(pattern: string, path: string): boolean {
  const expected = normalizePath(pattern).split("/").filter(Boolean);
  const actual = normalizePath(path).split("/").filter(Boolean);
  return (
    expected.length === actual.length &&
    expected.every(
      (segment, index) => segment.startsWith(":") || segment === actual[index],
    )
  );
}

function matchesPrefix(pattern: string, path: string): boolean {
  const expected = normalizePath(pattern);
  const actual = normalizePath(path);
  return actual === expected || actual.startsWith(`${expected}/`);
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

function activeMenuId(path: string, menus: NavMenu[]): string | undefined {
  const candidates: { id?: string; path: string; staticCount: number }[] = [];
  const collect = (items: NavMenu[]): void => {
    for (const item of items) {
      const path = navPath(item);
      if (path) {
        candidates.push({
          id: navId(item),
          path,
          staticCount: path.split("/").filter((part) => part && !part.startsWith(":")).length,
        });
      }
      if (item.children) collect(item.children);
    }
  };
  collect(menus);
  return candidates
    .filter((item) => matchesPattern(item.path, path) || matchesPrefix(item.path, path))
    .sort((a, b) => b.staticCount - a.staticCount)[0]?.id;
}

function targetedMenuId(currentId: string | undefined, menus: NavMenu[]): string | undefined {
  if (!currentId) return undefined;
  const collect = (items: NavMenu[]): NavMenu | undefined => {
    for (const item of items) {
      if (navId(item) === currentId || item.pageId === currentId) return item;
      const nested = collect(item.children ?? []);
      if (nested) return nested;
    }
    return undefined;
  };
  return collect(menus)?.activeMenu ?? currentId;
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

function routeMatches(item: NavMenu, pathname: string): boolean {
  if (isGroup(item)) {
    return visibleChildren(item).some((child) => {
      const path = navPath(child);
      return (
        path !== undefined &&
        (matchesPattern(path, pathname) || matchesPrefix(path, pathname))
      );
    });
  }
  const path = navPath(item);
  return (
    path !== undefined &&
    (matchesPattern(path, pathname) || matchesPrefix(path, pathname))
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
  const currentMenuId = useMemo(
    () => targetedMenuId(activeMenuId(pathname, menus), menus),
    [menus, pathname],
  );
  const routedTopLevel = useMemo(
    () =>
      topLevelMenus.find(
        (item) => routeMatches(item, pathname) || groupContains(item, currentMenuId),
      ),
    [currentMenuId, pathname, topLevelMenus],
  );
  const [selection, setSelection] = useState<{ pathname: string; itemId?: string } | null>(
    null,
  );
  const selectedTopLevel =
    selection?.pathname === pathname
      ? topLevelMenus.find((item) => navId(item) === selection.itemId) ?? routedTopLevel
      : routedTopLevel;
  const activeGroup =
    selectedTopLevel && isGroup(selectedTopLevel) ? selectedTopLevel : undefined;

  useEffect(() => {
    const content = mainRef.current?.querySelector<HTMLElement>(".shell-content");
    content?.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  function selectGroup(group: NavMenu) {
    const itemId = navId(group);
    if (!itemId) return;
    setSelection({ pathname, itemId });
    if (!groupContains(group, currentMenuId)) {
      const first = visibleChildren(group)[0];
      const firstPath = first ? navPath(first) : undefined;
      if (firstPath) router.push(firstPath);
    }
  }

  return (
    <div className="kn-shell">
      <nav className="kn-rail" aria-label={t("nav.main")}>
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
              const active =
                navId(item) === currentMenuId ||
                matchesPattern(path, pathname) ||
                matchesPrefix(path, pathname);
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
