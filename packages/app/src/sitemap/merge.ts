import type { MenuItem } from '@pactor-app/router';

import type { SitemapMenuItem, SitemapResource } from './types.js';

/**
 * menus × pages 合并：type: 'page' 且带 pageId 的条目缺省从引用页面
 * 继承 path / title（仅分叉时覆写）；group / link 原样透传。
 * 产物可直接 new MenuRegistry(...) 做路由匹配。
 */
export function mergeSitemapMenus(sitemap: SitemapResource): SitemapMenuItem[] {
  const pageById = new Map(sitemap.pages.map((p) => [p.id, p]));
  const walk = (items: SitemapMenuItem[]): SitemapMenuItem[] =>
    items.map((item) => {
      const page = item.pageId !== undefined ? pageById.get(item.pageId) : undefined;
      const merged: SitemapMenuItem = {
        ...item,
        path: item.path ?? page?.path,
        title: item.title ?? page?.title ?? item.id,
      };
      if (item.children !== undefined) {
        merged.children = walk(item.children);
      }
      return merged;
    });
  return walk(sitemap.menus ?? []);
}

/** ui Menu 组件 items 形态（可见菜单树 → 导航数据；key = 路径） */
export interface SitemapNavItem {
  key: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  children?: SitemapNavItem[];
}

export function toSitemapNavItems(menuTree: MenuItem[]): SitemapNavItem[] {
  return menuTree.map((item) => ({
    key: item.path ?? item.id,
    label: item.title,
    icon: item.icon,
    disabled: item.disabled,
    children: item.children !== undefined ? toSitemapNavItems(item.children) : undefined,
  }));
}
