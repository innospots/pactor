import type { LayoutDsl, SitemapResource } from 'pactor-app';

import { readGeneratedDsl } from './assembly-io.js';
import {
  getMenusIndex,
  getPagesIndex,
  getSitemapMeta,
  type ShellGeneratedOptions,
} from './registry.js';
import type { ShellUser } from './session.js';
import { canSeePage, filterVisibleMenus } from './visibility.js';

export function buildRuntimeBootstrap(
  user: ShellUser | null,
  options?: ShellGeneratedOptions,
): SitemapResource {
  const meta = getSitemapMeta(options);
  const { pages } = getPagesIndex(options);
  const { menus } = getMenusIndex(options);

  const visiblePages = pages.filter((p) => canSeePage(p, user));

  const sitemapPages: SitemapResource['pages'] = visiblePages.map((p) => {
    const base = {
      id: p.globalPageId,
      path: p.path,
      title: p.title,
      version: p.version,
    };
    if (p.lazy) return base;
    if (!p.dslRef) return base;
    return { ...base, pageDsl: readGeneratedDsl(p.dslRef, options) };
  });

  const layouts = meta.layouts as Record<string, LayoutDsl>;
  const filteredMenus = filterVisibleMenus(
    menus,
    user,
    pages,
  ) as SitemapResource['menus'];

  return {
    id: 'pactor-app-shell',
    resourceType: 'sitemap',
    version: 1,
    dslVersion: meta.dslVersion,
    app: meta.app,
    layout: meta.layout,
    auth: meta.auth,
    layouts,
    updatedAt: new Date().toISOString(),
    ...(user
      ? {
          user: {
            id: user.id,
            username: user.username,
            name: user.name ?? user.username,
          },
          permissions: user.permissions,
        }
      : {}),
    pages: sitemapPages,
    menus: filteredMenus,
  };
}
