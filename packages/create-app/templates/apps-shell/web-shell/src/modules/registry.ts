import assembly from "@generated/pactor/assembly.json";
import menus from "@generated/pactor/menus.json";
import pagesIndex from "@generated/pactor/pages.json";
import sitemapMeta from "@generated/pactor/sitemap-meta.json";

import type {
  AssemblyFile,
  AssemblyModule,
  MenusIndexFile,
  PagesIndexFile,
  SitemapMetaFile,
} from "./types";

const assemblyData = assembly as AssemblyFile;
const pagesData = pagesIndex as PagesIndexFile;
const menusData = menus as MenusIndexFile;

export function getAssembly(): AssemblyFile {
  return assemblyData;
}

export function getPagesIndex(): PagesIndexFile {
  return pagesData;
}

export function getMenusIndex(): MenusIndexFile {
  return menusData;
}

export function getSitemapMeta(): SitemapMetaFile {
  return sitemapMeta as SitemapMetaFile;
}

export function getAssemblySummary(): {
  modules: AssemblyModule[];
  routeCount: number;
} {
  return {
    modules: assemblyData.modules,
    routeCount: assemblyData.routes.length,
  };
}
