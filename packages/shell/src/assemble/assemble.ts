/**
 * 构建期装配：读取 module-list.json → 解析各 UI npm 包 Manifest →
 * 合并路由/菜单/页面索引 → 复制静态资源 → 生成 .generated/pactor/*
 * （移植自 web-shell scripts/assemble-modules.mjs，路径改为参数化。）
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, normalize, relative, resolve } from 'node:path';

import { parseDocument } from 'yaml';

import type {
  AssemblyModule,
  AssemblyRoute,
  ModuleListEntry,
  ModuleListFile,
  ModuleManifestV1,
  PageIndexEntry,
  SitemapMetaFile,
} from '../server/types.js';

const require = createRequire(import.meta.url);

export interface AssembleOptions {
  /** 宿主工程根，缺省 process.cwd() */
  rootDir?: string;
  /** 缺省 <rootDir>/src/modules/module-list.json */
  moduleListPath?: string;
  /** Shell 自带站点目录，缺省 <rootDir>/src/shell */
  shellSiteDir?: string;
  /** 装配产物目录，缺省 <rootDir>/.generated/pactor */
  generatedDir?: string;
  /** 模块静态资源输出，缺省 <rootDir>/public/modules */
  publicModulesDir?: string;
}

export interface AssembleSummary {
  modules: number;
  routes: number;
  serverApis: number;
  generatedDir: string;
}

interface AssembleConfig {
  rootDir: string;
  moduleListPath: string;
  shellSiteDir: string;
  generatedDir: string;
  publicModulesDir: string;
}

/** 单进程 CLI 语义：配置在 assembleModules() 入口解析，helper 经模块级 cfg 读取。 */
let cfg: AssembleConfig;

function resolveConfig(options: AssembleOptions): AssembleConfig {
  const rootDir = options.rootDir ?? process.cwd();
  return {
    rootDir,
    moduleListPath: options.moduleListPath ?? join(rootDir, 'src/modules/module-list.json'),
    shellSiteDir: options.shellSiteDir ?? join(rootDir, 'src/shell'),
    generatedDir: options.generatedDir ?? join(rootDir, '.generated/pactor'),
    publicModulesDir: options.publicModulesDir ?? join(rootDir, 'public/modules'),
  };
}

type SiteMenuItem = Record<string, any> & { children?: SiteMenuItem[] };
type SitePage = Record<string, any> & { id: string; path: string };
type SiteSitemap = {
  auth?: { loginPath?: string };
  layout?: string;
  dslVersion?: string;
  app?: { name: string };
  pages?: SitePage[];
  menus?: SiteMenuItem[];
  layouts?: Record<string, unknown>;
};
interface ModuleServerMeta {
  moduleId: string;
  package: string;
  prefixes: string[];
}
interface RegistryModule {
  module: AssemblyModule;
  clientSpecifier: string;
  clientEntry?: string;
  styles?: string[];
}
interface AssembledModule {
  module: AssemblyModule;
  routes: AssemblyRoute[];
  pages: PageIndexEntry[];
  menus: SiteMenuItem[];
  sitemapMeta: SitemapMetaFile;
  layouts: Record<string, unknown>;
  dslCopies: { from: string; to: string; rel: string }[];
  clientEntry?: string;
  styles?: string[];
  server: ModuleServerMeta | null;
}

function readJson(path: string): any {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJson(path: string, data: unknown): void {
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function loadYamlFile(path: string): any {
  const doc = parseDocument(readFileSync(path, 'utf8'));
  if (doc.errors.length > 0) {
    throw new Error(
      `${path} YAML 解析失败：${doc.errors.map((e) => e.message).join('; ')}`,
    );
  }
  return doc.toJS();
}

function normalizeBasePath(basePath: string): string {
  const p = basePath.startsWith('/') ? basePath : `/${basePath}`;
  return p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p;
}

function joinPublicPath(basePath: string, modulePath: string): string {
  const base = normalizeBasePath(basePath);
  const segment = modulePath.startsWith('/') ? modulePath : `/${modulePath}`;
  // 根路径（basePath = "/"）直接返回模块路径，避免拼出 "//risk-analysis"
  if (base === '/') return normalizeBasePath(segment);
  const combined = `${base}${segment === '/' ? '' : segment}`;
  return normalizeBasePath(combined);
}

function pathPattern(modulePath: string): { pattern: string; paramNames: string[] } {
  const parts = modulePath.split('/').filter(Boolean);
  const paramNames: string[] = [];
  const patternParts = parts.map((part) => {
    if (part.startsWith(':')) {
      paramNames.push(part.slice(1));
      return part;
    }
    return part;
  });
  return {
    pattern: `/${patternParts.join('/')}`,
    paramNames,
  };
}

function resolveManifestPath(packageName: string): string | null {
  try {
    return require.resolve(`${packageName}/manifest`, { paths: [cfg.rootDir] });
  } catch {
    return null;
  }
}

function resolveServerPath(packageName: string): string | null {
  try {
    // 只定位文件，不会触发 ESM 加载
    return require.resolve(`${packageName}/server`, { paths: [cfg.rootDir] });
  } catch {
    return null;
  }
}

const API_PREFIX_RE = /^\/api\/[A-Za-z0-9._~-]+(?:\/[A-Za-z0-9._~-]+)*$/;
const RESERVED_API_PREFIXES = ['/api/modules', '/api/runtime'];

function validateApiPrefixes(
  prefixes: unknown,
  moduleId: string,
): asserts prefixes is string[] {
  if (!Array.isArray(prefixes) || prefixes.length === 0) {
    throw new Error(`${moduleId} 的 manifest.apiPrefixes 必须是非空字符串数组`);
  }
  const seen = new Set<string>();
  for (const prefix of prefixes) {
    if (typeof prefix !== 'string' || !API_PREFIX_RE.test(prefix)) {
      throw new Error(`${moduleId} 的 apiPrefixes 非法：${String(prefix)}`);
    }
    if (seen.has(prefix)) {
      throw new Error(`${moduleId} 的 apiPrefixes 重复：${prefix}`);
    }
    for (const reserved of RESERVED_API_PREFIXES) {
      if (prefix === reserved || prefix.startsWith(`${reserved}/`)) {
        throw new Error(`${moduleId} 的 apiPrefixes 使用了保留前缀：${prefix}`);
      }
    }
    seen.add(prefix);
  }
  for (const a of prefixes) {
    for (const b of prefixes) {
      if (a !== b && b.startsWith(`${a}/`)) {
        throw new Error(`${moduleId} 的 apiPrefixes 互相包含：${a} 与 ${b}`);
      }
    }
  }
}

/**
 * 解析模块 server 元数据；未声明时返回 null。
 * serverEntry 与 apiPrefixes 必须成对出现，且 server 导出必须落在包内。
 */
function resolveModuleServer(
  packageName: string,
  manifest: ModuleManifestV1,
  manifestDir: string,
  moduleId: string,
): ModuleServerMeta | null {
  const serverEntry =
    typeof manifest.serverEntry === 'string' && manifest.serverEntry !== ''
      ? manifest.serverEntry
      : undefined;
  const apiPrefixes =
    Array.isArray(manifest.apiPrefixes) && manifest.apiPrefixes.length > 0
      ? manifest.apiPrefixes
      : undefined;

  if (Boolean(serverEntry) !== Boolean(apiPrefixes)) {
    throw new Error(
      `${moduleId} 的 manifest.serverEntry 与 apiPrefixes 必须成对出现`,
    );
  }
  if (!serverEntry) return null;

  validateApiPrefixes(apiPrefixes, moduleId);

  const declaredPath = resolve(manifestDir, serverEntry);
  assertInsideRoot(manifestDir, declaredPath);
  if (!existsSync(declaredPath)) {
    throw new Error(`${moduleId} 的 serverEntry 文件不存在：${declaredPath}`);
  }

  const serverPath = resolveServerPath(packageName);
  if (!serverPath) {
    throw new Error(
      `${packageName} 声明了 serverEntry，但无法解析 "${packageName}/server"（检查 package.json exports）`,
    );
  }
  assertInsideRoot(manifestDir, serverPath);

  return { moduleId, package: packageName, prefixes: apiPrefixes };
}

function packageRootFromManifest(manifestPath: string): string {
  return dirname(manifestPath);
}

function assertInsideRoot(root: string, target: string): void {
  const rel = relative(root, target);
  if (rel.startsWith('..') || normalize(rel).includes('..')) {
    throw new Error(`非法路径逃逸：${target}`);
  }
}

function namespaceMenus(
  menus: SiteMenuItem[] | undefined,
  moduleId: string,
): SiteMenuItem[] {
  return (menus ?? []).map((item) => {
    const next = { ...item };
    // Shell 自带站点可以直接引用已限定命名空间的页面（moduleId:pageId），
    // 只给模块内的相对 pageId 加前缀，避免拼成 moduleId:moduleId:pageId。
    if (next.pageId && !next.pageId.includes(':')) {
      next.pageId = `${moduleId}:${next.pageId}`;
    }
    if (next.type === 'group' && next.children) {
      next.children = namespaceMenus(next.children, moduleId);
    }
    return next;
  });
}

function applyPublicAccess(
  items: SiteMenuItem[],
  entry: ModuleListEntry,
): SiteMenuItem[] {
  if (entry.access !== 'public') return items;
  return items.map((item) => {
    const next = { ...item, public: item.public ?? true };
    if (next.children) {
      next.children = applyPublicAccess(next.children, entry);
    }
    return next;
  });
}

/**
 * 模块菜单接入模式（module-list 可选配置）：
 * - merge（默认）：模块菜单原样并入 Shell 导航；
 * - hidden：模块菜单注册为隐藏路由（不出现在导航），并移除菜单级 layout，
 *   让页面落到 Shell 默认布局（固定侧栏 + 右侧 PageOutlet）。适合 Shell
 *   已提供一级菜单、模块只补充二级页面（如详情 / 日志）的场景。
 */
function transformModuleMenus(
  menus: SiteMenuItem[] | undefined,
  moduleId: string,
  entry: ModuleListEntry,
): SiteMenuItem[] {
  const namespaced = namespaceMenus(menus, moduleId);

  if (entry.menuMode !== 'hidden') {
    return applyPublicAccess(namespaced, entry);
  }

  const hide = (item: SiteMenuItem): SiteMenuItem => {
    const next: SiteMenuItem = { ...item, hidden: true };
    // 菜单级 layout 会覆盖 Shell 默认布局（模块通常是无侧栏的空壳布局）；
    // 接入 Shell 导航时移除，让页面由 Shell 布局承载。
    delete next.layout;
    if (next.children) {
      next.children = next.children.map(hide);
    }
    return next;
  };

  return applyPublicAccess(namespaced.map(hide), entry);
}

function buildSitemapMeta(
  site: SiteSitemap,
  basePath: string,
  layouts: Record<string, unknown>,
): SitemapMetaFile {
  const loginPath = site.auth?.loginPath
    ? joinPublicPath(basePath, site.auth.loginPath)
    : joinPublicPath(basePath, '/login');
  return {
    layout: site.layout ?? 'admin',
    dslVersion: site.dslVersion ?? '1',
    app: site.app ?? { name: 'InnoSpots' },
    auth: { loginPath },
    layouts,
  };
}

/**
 * 布局 DSL 解析：layouts 的 value 可以是内联对象，也可以是相对 sitemap
 * 的 YAML 路径（与 nextjs-version 的 *.layout.yaml 约定一致）。
 */
function resolveSiteLayouts(
  site: SiteSitemap,
  manifestDir: string,
): Record<string, unknown> {
  const resolved: Record<string, unknown> = {};
  for (const [name, value] of Object.entries(site.layouts ?? {})) {
    if (typeof value !== 'string') {
      resolved[name] = value;
      continue;
    }
    const layoutPath = resolve(manifestDir, value);
    assertInsideRoot(manifestDir, layoutPath);
    if (!existsSync(layoutPath)) {
      throw new Error(`布局 ${name} 的 DSL 文件不存在：${layoutPath}`);
    }
    resolved[name] = loadYamlFile(layoutPath);
  }
  return resolved;
}

function findPageDslFile(dslRoot: string, pageId: string): string | null {
  const queue = [dslRoot];
  while (queue.length > 0) {
    const dir = queue.pop()!;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        queue.push(full);
        continue;
      }
      if (entry.name === `${pageId}.yaml`) return full;
    }
  }
  return null;
}

function assembleModule(
  entry: ModuleListEntry,
  manifest: ModuleManifestV1,
  manifestDir: string,
): AssembledModule {
  const basePath = normalizeBasePath(entry.basePath ?? manifest.basePath);
  const moduleId = manifest.id;
  const server = resolveModuleServer(
    entry.package,
    manifest,
    manifestDir,
    moduleId,
  );
  const sitemapPath = resolve(manifestDir, manifest.sitemap);
  assertInsideRoot(manifestDir, sitemapPath);
  const site = loadYamlFile(sitemapPath) as SiteSitemap;
  const layouts = resolveSiteLayouts(site, manifestDir);

  const routes: AssemblyRoute[] = [];
  const pages: PageIndexEntry[] = [];
  const dslCopies: { from: string; to: string; rel: string }[] = [];

  for (const page of site.pages ?? []) {
    const globalPageId = `${moduleId}:${page.id}`;
    const publicPath = joinPublicPath(basePath, page.path);
    const { pattern, paramNames } = pathPattern(page.path);
    const publicPattern = joinPublicPath(basePath, pattern);

    routes.push({
      publicPath,
      moduleId,
      pageId: page.id,
      globalPageId,
      pattern: publicPattern,
      paramNames,
    });

    const dslRoot = resolve(manifestDir, manifest.dslRoot);
    const dslSource = findPageDslFile(dslRoot, page.id);
    if (!dslSource) {
      throw new Error(
        `${moduleId} 页面 ${page.id} 缺少 DSL 文件（在 ${manifest.dslRoot} 下未找到 ${page.id}.yaml）`,
      );
    }
    assertInsideRoot(manifestDir, dslSource);
    const dslTargetRel = `dsl/${moduleId}/${page.id}.yaml`;
    dslCopies.push({
      from: dslSource,
      to: join(cfg.generatedDir, dslTargetRel),
      rel: dslTargetRel,
    });

    pages.push({
      globalPageId,
      moduleId,
      pageId: page.id,
      path: publicPath,
      title: page.title,
      version: page.version ?? 1,
      // Shell 会话当前恒为匿名；access: "public" 让未在模块 sitemap 中
      // 声明 public 的页面仍可进入 bootstrap 与页面 API。
      public: page.public ?? (entry.access === 'public' ? true : undefined),
      permission: page.permission,
      lazy: page.lazy,
      dslRef: dslTargetRel,
    });
  }

  if (manifest.assetsRoot) {
    const assetsSource = resolve(manifestDir, manifest.assetsRoot);
    const assetsTarget = join(cfg.publicModulesDir, moduleId, manifest.version);
    try {
      if (existsSync(assetsSource)) {
        cpSync(assetsSource, assetsTarget, { recursive: true });
      } else {
        mkdirSync(assetsTarget, { recursive: true });
      }
    } catch {
      mkdirSync(assetsTarget, { recursive: true });
    }
  }

  return {
    module: {
      id: moduleId,
      name: manifest.name,
      package: entry.package,
      version: manifest.version,
      basePath,
    },
    routes,
    pages,
    menus: transformModuleMenus(site.menus, moduleId, entry),
    sitemapMeta: buildSitemapMeta(site, basePath, layouts),
    layouts,
    dslCopies,
    clientEntry: manifest.clientEntry,
    styles: manifest.styles,
    server,
  };
}

/**
 * Shell 自带站点（默认布局 + 两个业务域入口页）：不走 npm 模块契约，
 * 但复用同一套 sitemap → routes/pages/menus/layouts 装配流程。它永远
 * 排在模块之前，作为缺省布局；模块页面未声明 layout 时即落入该布局。
 */
function assembleBaseSite(): AssembledModule | null {
  if (!existsSync(join(cfg.shellSiteDir, 'sitemap.yaml'))) return null;
  const manifest = {
    schemaVersion: '1',
    id: 'shell',
    name: 'InnoSpots Shell',
    version: '0.1.0',
    pactorVersionRange: '^1.55.0',
    basePath: '/',
    sitemap: 'sitemap.yaml',
    dslRoot: 'pages',
  } as ModuleManifestV1;
  return assembleModule(
    { package: '@innospots/shell-site', enabled: true, basePath: '/' },
    manifest,
    cfg.shellSiteDir,
  );
}

function generateClientRegistry(registryModules: RegistryModule[]): void {
  const imports: string[] = [];
  const entries: string[] = [];
  for (const mod of registryModules) {
    if (!mod.clientEntry || !mod.clientSpecifier) continue;
    // 模块 id 可含连字符（如 pactor-app-ai-risk-mesh），变量名需转为合法标识符
    const varName = `${mod.module.id.replace(/[^A-Za-z0-9_$]/g, '_')}Extensions`;
    imports.push(
      `import { extensions as ${varName} } from "${mod.clientSpecifier}";`,
    );
    entries.push(`  ${JSON.stringify(mod.module.id)}: ${varName},`);
  }

  const body = `${imports.join('\n')}

import type { ModuleExtensionBundle } from "@pactor-app/shell/client";

export const moduleExtensions: Record<string, ModuleExtensionBundle> = {
${entries.join('\n')}
};
`;
  writeFileSync(join(cfg.generatedDir, 'client-registry.ts'), body, 'utf8');
}

/**
 * 按各模块 manifest.styles 生成样式入口（约定：模块包 exports 提供 "./styles.css"，"
 * 由 pactor module init 注入）。layout 只需 import 这个生成文件，增删模块零改动。
 */
function generateModuleStyles(registryModules: RegistryModule[]): void {
  const lines: string[] = [];
  for (const mod of registryModules) {
    if (!Array.isArray(mod.styles) || mod.styles.length === 0) continue;
    lines.push(`import ${JSON.stringify(`${mod.module.package}/styles.css`)};`);
  }
  writeFileSync(join(cfg.generatedDir, 'module-styles.ts'), `${lines.join('\n')}\n`, 'utf8');
}

/**
 * 生成模块 server 静态注册表；无 server 模块时也生成空表，保证
 * dispatch.ts 的 import 始终可解析。
 */
function generateServerRegistry(serverModules: ModuleServerMeta[]): void {
  const imports: string[] = [];
  const entries: string[] = [];
  for (const mod of serverModules) {
    const varName = `${mod.moduleId.replace(/[^A-Za-z0-9_$]/g, '_')}Handlers`;
    imports.push(
      `import { handlers as ${varName} } from ${JSON.stringify(`${mod.package}/server`)};`,
    );
    entries.push(`  ${JSON.stringify(mod.moduleId)}: {
    moduleId: ${JSON.stringify(mod.moduleId)},
    package: ${JSON.stringify(mod.package)},
    prefixes: ${JSON.stringify(mod.prefixes)},
    handlers: ${varName} as ModuleApiHandlers,
  },`);
  }

  const typeImport =
    entries.length > 0
      ? `import type {
  ModuleApiHandlers,
  ModuleServerRegistry,
} from "@pactor-app/shell/server";`
      : `import type { ModuleServerRegistry } from "@pactor-app/shell/server";`;

  const registry =
    entries.length > 0 ? `{\n${entries.join('\n')}\n}` : '{}';

  const body = `${imports.length > 0 ? `${imports.join('\n')}\n\n` : ''}${typeImport}

export const moduleServers: ModuleServerRegistry = ${registry};
`;
  writeFileSync(join(cfg.generatedDir, 'server-registry.ts'), body, 'utf8');
}

export function assembleModules(options: AssembleOptions = {}): AssembleSummary {
  cfg = resolveConfig(options);
  rmSync(cfg.generatedDir, { recursive: true, force: true });
  mkdirSync(cfg.generatedDir, { recursive: true });
  mkdirSync(cfg.publicModulesDir, { recursive: true });

  const list = readJson(cfg.moduleListPath) as ModuleListFile;
  const enabled = (list.modules ?? []).filter((m) => m.enabled);

  const assemblyModules: AssemblyModule[] = [];
  const allRoutes: AssemblyRoute[] = [];
  const allPages: PageIndexEntry[] = [];
  const allMenus: SiteMenuItem[] = [];
  const registryModules: RegistryModule[] = [];
  const serverModules: ModuleServerMeta[] = [];
  const moduleLayouts: Record<string, unknown> = {};
  let sitemapMeta: SitemapMetaFile | null = null;
  let baseLayouts: Record<string, unknown> = {};

  const baseSite = assembleBaseSite();
  if (baseSite) {
    allRoutes.push(...baseSite.routes);
    allPages.push(...baseSite.pages);
    allMenus.push(...baseSite.menus);
    sitemapMeta = baseSite.sitemapMeta;
    baseLayouts = baseSite.layouts;
    for (const copy of baseSite.dslCopies) {
      mkdirSync(dirname(copy.to), { recursive: true });
      cpSync(copy.from, copy.to);
    }
  }

  for (const entry of enabled) {
    const manifestPath = resolveManifestPath(entry.package);
    if (!manifestPath) {
      throw new Error(
        `未找到 ${entry.package} 的 manifest 导出，请先 npm install 并确认包 exports["./manifest"]`,
      );
    }
    const manifestDir = packageRootFromManifest(manifestPath);
    const manifest = readJson(manifestPath) as ModuleManifestV1;
    if (manifest.schemaVersion !== '1') {
      throw new Error(`${entry.package} manifest schemaVersion 必须为 "1"`);
    }

    const assembled = assembleModule(entry, manifest, manifestDir);
    assemblyModules.push(assembled.module);
    allRoutes.push(...assembled.routes);
    allPages.push(...assembled.pages);
    allMenus.push(...assembled.menus);
    Object.assign(moduleLayouts, assembled.layouts);
    if (!sitemapMeta) {
      sitemapMeta = assembled.sitemapMeta;
    }

    for (const copy of assembled.dslCopies) {
      mkdirSync(dirname(copy.to), { recursive: true });
      cpSync(copy.from, copy.to);
    }

    registryModules.push({
      module: assembled.module,
      clientSpecifier: entry.package + '/client',
      clientEntry: manifest.clientEntry,
      styles: assembled.styles,
    });

    if (assembled.server) {
      serverModules.push(assembled.server);
    }
  }

  if (sitemapMeta) {
    // 模块布局参与合并，但 Shell 自带布局优先：默认外壳不由模块覆盖。
    sitemapMeta = {
      ...sitemapMeta,
      layouts: { ...moduleLayouts, ...baseLayouts },
    };
  }

  const generatedAt = new Date().toISOString();
  writeJson(join(cfg.generatedDir, 'assembly.json'), {
    generatedAt,
    modules: assemblyModules,
    routes: allRoutes,
  });
  writeJson(join(cfg.generatedDir, 'routes.json'), { routes: allRoutes });
  writeJson(join(cfg.generatedDir, 'menus.json'), { menus: allMenus });
  writeJson(join(cfg.generatedDir, 'pages.json'), { pages: allPages });
  writeJson(join(cfg.generatedDir, 'fragments.json'), { fragments: {} });
  writeJson(join(cfg.generatedDir, 'sitemap-meta.json'), sitemapMeta ?? {
    layout: 'default',
    dslVersion: '1',
    app: { name: 'InnoSpots' },
    auth: { loginPath: '/login' },
    layouts: {},
  });
  writeJson(join(cfg.generatedDir, 'servers.json'), {
    modules: serverModules.map(({ moduleId, package: packageName, prefixes }) => ({
      moduleId,
      package: packageName,
      prefixes,
    })),
  });

  generateClientRegistry(registryModules);
  generateModuleStyles(registryModules);
  generateServerRegistry(serverModules);

  return {
    modules: assemblyModules.length,
    routes: allRoutes.length,
    serverApis: serverModules.length,
    generatedDir: relative(cfg.rootDir, cfg.generatedDir),
  };
}
