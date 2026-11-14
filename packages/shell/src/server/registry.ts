import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type {
  AssemblyFile,
  AssemblyModule,
  FragmentsIndexFile,
  MenusIndexFile,
  PagesIndexFile,
  SitemapMetaFile,
} from './types.js';

/** 装配产物目录定位；缺省 <process.cwd()>/.generated/pactor（在宿主工程根运行）。 */
export interface ShellGeneratedOptions {
  generatedDir?: string;
}

export function resolveGeneratedDir(options?: ShellGeneratedOptions): string {
  return options?.generatedDir ?? join(process.cwd(), '.generated/pactor');
}

function readGeneratedJson<T>(file: string, options?: ShellGeneratedOptions): T {
  return JSON.parse(
    readFileSync(join(resolveGeneratedDir(options), file), 'utf8'),
  ) as T;
}

export function getAssembly(options?: ShellGeneratedOptions): AssemblyFile {
  return readGeneratedJson<AssemblyFile>('assembly.json', options);
}

export function getPagesIndex(options?: ShellGeneratedOptions): PagesIndexFile {
  return readGeneratedJson<PagesIndexFile>('pages.json', options);
}

export function getMenusIndex(options?: ShellGeneratedOptions): MenusIndexFile {
  return readGeneratedJson<MenusIndexFile>('menus.json', options);
}

export function getSitemapMeta(
  options?: ShellGeneratedOptions,
): SitemapMetaFile {
  return readGeneratedJson<SitemapMetaFile>('sitemap-meta.json', options);
}

export function getFragmentsIndex(
  options?: ShellGeneratedOptions,
): FragmentsIndexFile {
  return readGeneratedJson<FragmentsIndexFile>('fragments.json', options);
}

export function getAssemblySummary(options?: ShellGeneratedOptions): {
  modules: AssemblyModule[];
  routeCount: number;
} {
  const assembly = getAssembly(options);
  return { modules: assembly.modules, routeCount: assembly.routes.length };
}
