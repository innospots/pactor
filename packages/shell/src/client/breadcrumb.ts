import type { NavigationMenuItem } from './NavigationShell.js';
import {
  createNavigationRegistry,
  findNavigationMenu,
  menuTitle,
  navId,
  navPath,
} from './navigation-menus.js';

export interface BreadcrumbEntry {
  id: string;
  title: string;
  /** 中间项链接；末项与无 path 项缺省 */
  path?: string;
}

/** 在完整树（含 hidden）中定位节点并返回从根到自身的链 */
function findChain(
  items: NavigationMenuItem[],
  targetId: string,
  trail: NavigationMenuItem[] = [],
): NavigationMenuItem[] | null {
  for (const item of items) {
    const nextTrail = [...trail, item];
    if (navId(item) === targetId || item.pageId === targetId) return nextTrail;
    if (item.children) {
      const hit = findChain(item.children, targetId, nextTrail);
      if (hit) return hit;
    }
  }
  return null;
}

/**
 * 面包屑推导：按 pathname 命中菜单（复用路由同款向上回溯与 activeMenu
 * 解析），再沿菜单树取父链。链中间 hidden 项跳过；命中项即使 hidden 也
 * 保留为末级纯文本；无命中返回空数组（调用方不渲染）。
 */
export function deriveNavigationBreadcrumb(
  menus: NavigationMenuItem[],
  pathname: string,
): BreadcrumbEntry[] {
  if (menus.length === 0) return [];
  const registry = createNavigationRegistry(menus);
  const matched = findNavigationMenu(registry, pathname);
  if (!matched) return [];
  const chain = findChain(menus, matched.id);
  if (!chain) return [];
  const entries: BreadcrumbEntry[] = [];
  chain.forEach((item, index) => {
    const isLast = index === chain.length - 1;
    // 中间 hidden 项不在导航语义内，跳过
    if (!isLast && item.hidden) return;
    const id = navId(item) ?? menuTitle(item);
    if (!id) return;
    entries.push({
      id,
      title: menuTitle(item),
      ...(isLast ? {} : navPath(item) ? { path: navPath(item) } : {}),
    });
  });
  return entries;
}
