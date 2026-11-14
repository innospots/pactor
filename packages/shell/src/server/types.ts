/** module-list.json 条目（宿主业务配置，装配器输入）。 */
export type ModuleListEntry = {
  package: string;
  enabled: boolean;
  /** 可选；Shell 侧 URL 前缀，覆盖模块 manifest 中的默认 basePath */
  basePath?: string;
  /** 可选；merge（默认，原样并入导航）或 hidden（只注册隐藏路由并移除菜单级 layout） */
  menuMode?: 'merge' | 'hidden';
  /** 可选；设为 public 时，模块内未声明 public 的页面默认公开 */
  access?: 'public';
};

export type ModuleListFile = {
  modules: ModuleListEntry[];
};

export type ModuleManifestV1 = {
  schemaVersion: '1';
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

/* ---- 模块服务端 API 契约 ---- */

export type ModuleApiMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS';

export interface ModuleApiContext {
  moduleId: string;
  /** 逻辑 URL：原始 /api/... 路径 + query（不是 /api/modules/... 挂载 URL） */
  url: URL;
  /** :param 段解析结果 */
  params: Record<string, string>;
}

export type ModuleApiHandler = (
  request: Request,
  context: ModuleApiContext,
) => Response | Promise<Response>;

export type ModuleApiHandlers = Record<
  string,
  Partial<Record<ModuleApiMethod, ModuleApiHandler>>
>;

export type ModuleServerRegistryEntry = {
  moduleId: string;
  package: string;
  prefixes: string[];
  handlers: ModuleApiHandlers;
};

export type ModuleServerRegistry = Record<string, ModuleServerRegistryEntry>;

/** .generated/pactor/servers.json 的结构（供构建期校验读取） */
export type ServersIndexFile = {
  modules: {
    moduleId: string;
    package: string;
    prefixes: string[];
  }[];
};
