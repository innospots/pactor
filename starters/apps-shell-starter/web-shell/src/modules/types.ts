export type ModuleListEntry = {
  package: string;
  enabled: boolean;
  basePath: string;
};

export type ModuleListFile = {
  modules: ModuleListEntry[];
};

export type ModuleManifestV1 = {
  schemaVersion: "1";
  id: string;
  name: string;
  version: string;
  pactorVersionRange: string;
  basePath: string;
  sitemap: string;
  dslRoot: string;
  assetsRoot: string;
  styles?: string[];
  clientEntry?: string;
  /** 模块服务端 bundle（相对 dist-module），存在时需同时声明 apiPrefixes */
  serverEntry?: string;
  /** 模块 API 逻辑前缀（原始 /api/...），打包期已把 DSL URL 改写为 /api/modules/<id>/... */
  apiPrefixes?: string[];
  dependencies?: string[];
};

export type AssemblyRoute = {
  publicPath: string;
  moduleId: string;
  pageId: string;
  globalPageId: string;
  pattern: string;
  paramNames: string[];
};

export type AssemblyModule = {
  id: string;
  name: string;
  package: string;
  version: string;
  basePath: string;
};

export type AssemblyFile = {
  generatedAt: string;
  modules: AssemblyModule[];
  routes: AssemblyRoute[];
};

export type PageIndexEntry = {
  globalPageId: string;
  moduleId: string;
  pageId: string;
  path: string;
  title: string;
  version: number;
  public?: boolean;
  permission?: string;
  lazy?: boolean;
  dslRef?: string;
};

export type PagesIndexFile = {
  pages: PageIndexEntry[];
};

export type MenusIndexFile = {
  menus: unknown[];
};

export type FragmentsIndexFile = {
  fragments: Record<string, unknown>;
};

export type SitemapMetaFile = {
  layout: string;
  dslVersion: string;
  app: { name: string };
  auth: { loginPath: string };
  layouts: Record<string, unknown>;
};
