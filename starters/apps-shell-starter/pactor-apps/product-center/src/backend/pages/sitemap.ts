import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { LayoutDsl, SitemapPageEntry, SitemapResource } from "pactor-app";
import { parse } from "yaml";

/**
 * 模块独立运行的 sitemap 数据源：布局与页面 DSL 直接从 yaml/ 读取并内联
 * 返回。多页面、无会话裁剪（接入 Shell 后由 Shell 的 Runtime API 接管）。
 */

const YAML_DIR = join(process.cwd(), "src/backend/pages/yaml");

interface PageEntry {
  id: string;
  path: string;
  title: string;
  version: number;
  /** 页面 DSL 在 yaml/ 下的相对路径 */
  file: string;
}

interface SiteFile {
  id: string;
  resourceType: "sitemap";
  version: number;
  dslVersion: string;
  app: { name: string };
  layouts: Record<string, LayoutDsl | string>;
  pages: PageEntry[];
  menus: SitemapResource["menus"];
}

function loadYaml<T>(file: string): T {
  return parse(readFileSync(join(YAML_DIR, file), "utf8")) as T;
}

export function buildSitemap(): SitemapResource {
  const site = loadYaml<SiteFile>("sitemap.yaml");
  const layouts = Object.fromEntries(
    Object.entries(site.layouts).map(([name, def]) => [
      name,
      typeof def === "string" ? loadYaml<LayoutDsl>(def) : def,
    ]),
  );
  const pages: SitemapPageEntry[] = site.pages.map(({ file, ...entry }) => ({
    ...entry,
    pageDsl: loadYaml(file) as SitemapPageEntry["pageDsl"],
  }));

  return {
    id: site.id,
    resourceType: site.resourceType,
    version: site.version,
    dslVersion: site.dslVersion,
    app: site.app,
    layouts,
    pages,
    menus: site.menus,
  };
}
