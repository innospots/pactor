import type { PageIndexEntry } from "@/modules/types";
import type { ShellUser } from "@/server/auth/session";

export function canSeePage(entry: PageIndexEntry, user: ShellUser | null): boolean {
  if (entry.public) return true;
  if (!user) return false;
  if (entry.permission) {
    return user.permissions.includes(entry.permission);
  }
  return true;
}

/**
 * 菜单按页面可见性过滤（与 canSeePage 同语义）：
 * - 菜单自身 public → 可见；
 * - 菜单声明 permission → 需登录且具备权限；
 * - 菜单挂 pageId → 跟随目标页面的可见性；
 * - 分组 → 至少一个可见子项才保留（children 递归过滤）；
 * - 其余（外链等）→ 仅登录后可见。
 */
export function filterVisibleMenus(
  menus: unknown[],
  user: ShellUser | null,
  pages: PageIndexEntry[],
): unknown[] {
  const pagesById = new Map(pages.map((p) => [p.globalPageId, p]));

  const visit = (menu: unknown): unknown | null => {
    if (menu === null || typeof menu !== "object" || Array.isArray(menu)) return menu;
    const item = menu as Record<string, unknown>;
    const children = Array.isArray(item.children)
      ? item.children.map(visit).filter((child) => child !== null)
      : undefined;

    let visible: boolean;
    if (item.public === true) {
      visible = true;
    } else if (typeof item.permission === "string") {
      visible = user !== null && user.permissions.includes(item.permission);
    } else if (typeof item.pageId === "string") {
      const page = pagesById.get(item.pageId);
      visible = page !== undefined && canSeePage(page, user);
    } else if (children !== undefined) {
      visible = children.length > 0;
    } else {
      visible = user !== null;
    }

    if (!visible) return null;
    return children !== undefined ? { ...item, children } : item;
  };

  return menus.map(visit).filter((menu) => menu !== null);
}
