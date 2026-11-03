import type { LayoutDsl, SitemapResource } from "pactor-app";

import { getMenusIndex, getPagesIndex, getSitemapMeta } from "@/modules/registry";
import type { ShellUser } from "@/server/auth/session";

import { readGeneratedDsl } from "./assembly-io";
import { canSeePage, filterVisibleMenus } from "./visibility";

export function buildRuntimeBootstrap(user: ShellUser | null): SitemapResource {
  const meta = getSitemapMeta();
  const { pages } = getPagesIndex();
  const { menus } = getMenusIndex();

  const visiblePages = pages.filter((p) => canSeePage(p, user));

  const sitemapPages: SitemapResource["pages"] = visiblePages.map((p) => {
    const base = {
      id: p.globalPageId,
      path: p.path,
      title: p.title,
      version: p.version,
    };
    if (p.lazy) return base;
    if (!p.dslRef) return base;
    return { ...base, pageDsl: readGeneratedDsl(p.dslRef) };
  });

  const layouts = meta.layouts as Record<string, LayoutDsl>;
  const filteredMenus = filterVisibleMenus(
    menus,
    user,
    pages,
  ) as SitemapResource["menus"];

  return {
    id: "innospots-web-shell",
    resourceType: "sitemap",
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
