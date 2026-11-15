import { MenuRegistry, type MenuItem } from '@pactor-app/router';

import type { NavigationMenuItem } from './NavigationShell.js';

export function navId(item: NavigationMenuItem): string | undefined {
  return item.id ?? item.key ?? item.path;
}

export function navPath(item: NavigationMenuItem): string | undefined {
  return item.path ?? (item.key?.startsWith('/') ? item.key : undefined);
}

export function menuTitle(item: NavigationMenuItem): string {
  return item.title ?? item.label ?? '';
}

export function isGroup(item: NavigationMenuItem): boolean {
  return item.type === 'group' || (item.children !== undefined && item.children.length > 0);
}

export function visibleChildren(group: NavigationMenuItem): NavigationMenuItem[] {
  return (group.children ?? []).filter((item) => !item.hidden && navPath(item));
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
