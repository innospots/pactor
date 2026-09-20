import type { MenuRegistry } from '@pactor-app/router';

import type {
  SitemapMenuItem,
  SitemapResource,
  SitemapRouteMatch,
} from './types.js';

/** 路由解析结果：菜单命中情况 + 可渲染路由（404 判定） */
export interface SitemapRouteResolution {
  /** 命中的菜单项（未命中为 null） */
  menu: SitemapMenuItem | null;
  /** 可渲染路由；菜单未命中或无 pageId（group / link）时为 null → 404 */
  route: SitemapRouteMatch | null;
}

/**
 * 路由解析（纯函数）：菜单命中、布局名、activeMenu 高亮 key 一次算清。
 * 布局名解析链：menu.layout → 顶层 layout → layouts 首键。
 * 高亮 key：activeMenu 指向其他菜单 id 时高亮该项（隐藏页场景），
 * key 与 toSitemapNavItems 一致（path ?? id）。
 */
export function resolveSitemapRoute(
  sitemap: SitemapResource,
  registry: MenuRegistry,
  pathname: string,
): SitemapRouteResolution {
  const match = registry.findByPath(pathname);
  const menu = (match?.menu as SitemapMenuItem | undefined) ?? null;
  if (match === null || menu === null || menu.pageId === undefined) {
    return { menu, route: null };
  }
  const layoutName =
    menu.layout ?? sitemap.layout ?? Object.keys(sitemap.layouts)[0] ?? '';
  const highlightId = menu.activeMenu ?? menu.id;
  const highlightItem = registry.findById(highlightId);
  return {
    menu,
    route: {
      pageId: menu.pageId,
      layoutName,
      highlightKey: highlightItem?.path ?? highlightId,
      params: match.params,
    },
  };
}

/** 守卫判定：放行或重定向 */
export type SitemapGuardDecision =
  | { allow: true }
  | { allow: false; redirectTo: string };

export interface SitemapGuardContext {
  sitemap: SitemapResource;
  pathname: string;
  /** 命中的菜单项（未命中为 null） */
  menu: SitemapMenuItem | null;
}

/** 访问守卫：每次路由变化时求值；返回重定向时组件执行 navigate */
export type SitemapGuard = (
  context: SitemapGuardContext,
) => SitemapGuardDecision;

/**
 * 缺省守卫（匿名访问控制）：未登录访问非 public 页（含未命中路径）→
 * 重定向 auth.loginPath（缺省 /login）。
 */
export const defaultSitemapGuard: SitemapGuard = ({
  sitemap,
  pathname,
  menu,
}) => {
  const loginPath = sitemap.auth?.loginPath ?? '/login';
  if (
    sitemap.user === undefined &&
    pathname !== loginPath &&
    (menu === null || menu.public !== true)
  ) {
    return { allow: false, redirectTo: loginPath };
  }
  return { allow: true };
};
