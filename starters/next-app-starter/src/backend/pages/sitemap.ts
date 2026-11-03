import { readFileSync, readdirSync, watch } from "node:fs";
import { join, relative } from "node:path";

import type { PageDsl, PermissionConfig } from "@pactor-app/core";
import { parseDocument } from "yaml";

import type { LayoutDsl, SitemapResource } from "pactor-app";

import type { DemoUser } from "../mock/accounts";

/**
 * Mock sitemap 数据源（design/dynamic-page.md 方案 B 示例实现）。
 * 真实项目由后端接口返回同构对象——端点按会话裁剪：
 * 匿名 → public 页（登录/注册）；登录后 → 该角色可见的 menus / pages / permissions。
 *
 * 入口数据（元数据 / layouts / pages / menus 全量）在 yaml/sitemap.yaml，
 * 页面 DSL 支持两种命名约定（可混用，按 id 建索引）：
 * pages/<id>.page.yaml（平铺）与 yaml/<模块>/<id>.yaml（按 PRD 模块树
 * 分目录，如 provider / route / models 骨架）；本文件只负责：加载 YAML、
 * 按会话裁剪可见性（public / permission / 需登录）、注入会话动态字段
 * （updatedAt / user / permissions）。
 */

/* ---------------- YAML DSL 文件加载（src/backend/pages/yaml/，缓存 + dev 下 fs.watch 失效重读） ---------------- */

const YAML_DIR = join(process.cwd(), "src/backend/pages/yaml");

/** 解析 YAML 文件；语法错误时 fail-fast（parseDocument 默认静默容错，结构会悄悄残缺） */
function loadYaml<T>(file: string): T {
  const doc = parseDocument(readFileSync(join(YAML_DIR, file), "utf8"));
  if (doc.errors.length > 0) {
    throw new Error(
      `${file} 解析失败：${doc.errors.map((e) => e.message.split("\n")[0]).join("；")}`,
    );
  }
  return doc.toJS() as T;
}

/** 标题文案：字符串（语言无关）或按语言映射（{ zh-CN, en-US }，下发前按 locale 解析） */
export type LocalizedTitle = string | Record<string, string>;

/** 按语言解析标题；无标题（隐藏页菜单项）回退空串，当前语言缺失回退 zh-CN 再回退任一可用值 */
function resolveTitle(title: LocalizedTitle | undefined, locale: string): string {
  if (title === undefined) return "";
  if (typeof title === "string") return title;
  return title[locale] ?? title["zh-CN"] ?? Object.values(title)[0] ?? "";
}

/** sitemap.yaml 中的页面声明：可见性标记（public / permission）+ DSL 加载方式（lazy） */
export interface PageEntry {
  id: string;
  path: string;
  title: LocalizedTitle;
  version: number;
  public?: boolean;
  permission?: string;
  /** 不随 sitemap 内联 pageDsl，客户端经 /api/pages/{id} 懒加载 */
  lazy?: boolean;
}

/** sitemap.yaml 的菜单条目（title 允许按语言映射，buildSitemap 按 locale 解析为字符串后下发） */
export interface RawMenuItem {
  id?: string;
  type?: string;
  pageId?: string;
  path?: string;
  /** 隐藏页菜单项可省略标题 */
  title?: LocalizedTitle;
  public?: boolean;
  permission?: PermissionConfig;
  hidden?: boolean;
  activeMenu?: string;
  icon?: string;
  order?: number;
  external?: boolean;
  children?: RawMenuItem[];
}

interface SitemapFile {
  id: string;
  resourceType: "sitemap";
  version: number;
  dslVersion: string;
  app: { name: string };
  layout: string;
  auth: { loginPath: string };
  layouts: Record<string, LayoutDsl>;
  pages: PageEntry[];
  menus: RawMenuItem[];
}

/**
 * 递归收集 yaml 下所有页面 DSL（含 pages/ 平铺目录与 provider / route /
 * models 等模块子目录；跳过 sitemap.yaml），按 id → 相对路径建索引。
 * 兼容两种命名：<id>.page.yaml 与 <id>.yaml；同一 id 出现两次即报错
 * （静默覆盖会让线上页面来源不可追溯）。
 */
function collectPageFiles(dir: string): Map<string, string> {
  const out = new Map<string, string>();
  const walk = (current: string): void => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) {
        walk(path);
        continue;
      }
      if (entry.name === "sitemap.yaml") continue;
      const id = entry.name.endsWith(".page.yaml")
        ? entry.name.slice(0, -".page.yaml".length)
        : entry.name.endsWith(".yaml")
          ? entry.name.slice(0, -".yaml".length)
          : null;
      if (id === null) continue;
      const rel = relative(YAML_DIR, path);
      const existing = out.get(id);
      if (existing !== undefined) {
        throw new Error(`页面 id 冲突：${existing} 与 ${rel} 同为 ${id}`);
      }
      out.set(id, rel);
    }
  };
  walk(dir);
  return out;
}

interface YamlState {
  site: SitemapFile;
  pageDsls: Map<string, PageDsl>;
  lazyPageDsls: Map<string, PageDsl>;
}

function loadState(): YamlState {
  const site = loadYaml<SitemapFile>("sitemap.yaml");
  const pageFiles = collectPageFiles(YAML_DIR);

  /** 页面 DSL：按 id 从收集索引加载；lazy 页不在此内联 */
  function loadPageDsl(id: string): PageDsl {
    const file = pageFiles.get(id);
    if (!file) throw new Error(`页面 DSL 缺失：${id}.yaml`);
    return loadYaml<PageDsl>(file);
  }

  return {
    site,
    pageDsls: new Map(
      site.pages.filter((p) => !p.lazy).map((p) => [p.id, loadPageDsl(p.id)]),
    ),
    lazyPageDsls: new Map(
      site.pages.filter((p) => p.lazy).map((p) => [p.id, loadPageDsl(p.id)]),
    ),
  };
}

let stateCache: YamlState | null = null;

/** YAML 状态：首次请求时读入缓存；dev 下 yaml 目录任一文件变更由 fs.watch 失效缓存，下次请求重读，无需重启 */
function state(): YamlState {
  if (!stateCache) stateCache = loadState();
  return stateCache;
}

// watcher 挂 globalThis：Next dev 重编译会重新执行本模块，只更新失效回调、不重复建 watcher
const globalForYamlWatch = globalThis as unknown as {
  __pactorYamlInvalidate?: () => void;
  __pactorYamlWatcher?: ReturnType<typeof watch>;
};
globalForYamlWatch.__pactorYamlInvalidate = () => {
  stateCache = null;
};
if (process.env.NODE_ENV === "development" && !globalForYamlWatch.__pactorYamlWatcher) {
  globalForYamlWatch.__pactorYamlWatcher = watch(
    YAML_DIR,
    { recursive: true },
    () => {
      globalForYamlWatch.__pactorYamlInvalidate?.();
    },
  );
}

/* ---------------- 会话裁剪 ---------------- */

type Visibility = { public?: boolean; permission?: PermissionConfig };

/** PermissionConfig 归一化为权限码数组（string / string[] / { code } 三种形态） */
function permissionCodes(permission: PermissionConfig): string[] {
  const code =
    typeof permission === "object" && !Array.isArray(permission)
      ? permission.code
      : permission;
  return Array.isArray(code) ? code : [code];
}

/** 可见性：public 匿名可见；permission 命中任一权限码；无标记需登录 */
function canSee(entry: Visibility, user: DemoUser | null): boolean {
  if (entry.public) return true;
  if (!user) return false;
  if (entry.permission) {
    return permissionCodes(entry.permission).some((c) =>
      user.permissions.includes(c),
    );
  }
  return true;
}

/** 菜单按会话过滤；group 无可见子项时整组隐藏 */
function filterMenus(
  menus: RawMenuItem[],
  user: DemoUser | null,
): RawMenuItem[] {
  const out: RawMenuItem[] = [];
  for (const item of menus) {
    if (!canSee(item, user)) continue;
    if (item.type === "group") {
      const children = filterMenus(item.children ?? [], user);
      if (children.length === 0) continue;
      out.push({ ...item, children });
    } else {
      out.push(item);
    }
  }
  return out;
}

/** 菜单标题按 locale 解析为字符串（菜单标题不做表达式求值，由服务端按语言直出） */
function resolveMenuTitles(
  menus: RawMenuItem[],
  locale: string,
): SitemapResource["menus"] {
  return menus.map((item) => {
    const { children, ...rest } = item;
    return {
      ...rest,
      // 隐藏页菜单项可无标题，不下发空串
      ...(item.title !== undefined
        ? { title: resolveTitle(item.title, locale) }
        : {}),
      ...(children !== undefined
        ? { children: resolveMenuTitles(children, locale) }
        : {}),
    };
  }) as SitemapResource["menus"];
}

/**
 * 按会话构建 sitemap：同一 URL，不同用户拿到不同内容。
 * 匿名 → 仅 public 页；guest → + 首页；admin → + 用户列表 / 报表组。
 */
export function buildSitemap(
  user: DemoUser | null,
): SitemapResource {
  const { site, pageDsls } = state();
  const pages: SitemapResource["pages"] = site.pages
    .filter((p) => canSee(p, user))
    .map((p) => ({
      id: p.id,
      path: p.path,
      // Keep the source title until localizeSitemap applies menu/page catalog keys.
      title: resolveTitle(p.title, "zh-CN"),
      version: p.version,
      // 懒加载页不下发 pageDsl，仅 id / path / version，经 /api/pages/{id} 按需获取
      ...(p.lazy ? {} : { pageDsl: pageDsls.get(p.id) }),
    }));

  // sitemap.yaml 原样透传，仅覆盖会话相关部分：pages / menus 按可见性过滤，
  // 标题由 localizeSitemap 统一下发，updatedAt / user / permissions 按会话注入。
  return {
    ...site,
    updatedAt: new Date().toISOString(),
    ...(user ? { user: { ...user }, permissions: user.permissions } : {}),
    pages,
    menus: resolveMenuTitles(filterMenus(site.menus, user), "zh-CN"),
  };
}

/** 懒加载页：校验会话与可见性（前端权限只控制 UI，接口必须鉴权） */
export function getLazyPage(
  pageId: string,
  user: DemoUser | null,
): { version: number; pageDsl: PageDsl } | null {
  const { site, lazyPageDsls } = state();
  const entry = site.pages.find((p) => p.id === pageId);
  const pageDsl = lazyPageDsls.get(pageId);
  if (!entry?.lazy || !pageDsl || !canSee(entry, user)) {
    return null;
  }
  return { version: entry.version, pageDsl };
}

/* ---------------- 页面访问校验辅助（src/backend/pages/page-access.ts 消费） ---------------- */

/** 全部页面声明（会话无关超集；访问校验按全量页面解析，不受菜单裁剪影响） */
export function listPageEntries(): PageEntry[] {
  return state().site.pages;
}

/** 按 id 取页面 DSL（内联或懒加载文件）；未声明返回 undefined */
export function findPageDsl(pageId: string): PageDsl | undefined {
  const { pageDsls, lazyPageDsls } = state();
  return pageDsls.get(pageId) ?? lazyPageDsls.get(pageId);
}

/** 未登录访问受保护页面的重定向目标（sitemap.yaml 的 auth.loginPath） */
export function getLoginPath(): string {
  return state().site.auth.loginPath ?? "/login";
}

/** 路由候选：菜单可显式覆写页面 path（如一级菜单落到静态地址），优先于页面声明 */
interface RouteRef {
  pattern: string;
  pageId: string;
}

/**
 * 按路径查找页面声明（页面访问校验用）：
 * 菜单声明的 path 优先（与 SitemapApp 路由解析一致），页面声明兜底；
 * 静态段更多的模式优先，保证 /reports/monthly 先于 /reports/:id。
 */
export function findPageEntryByPath(pathname: string): PageEntry | null {
  const { site } = state();
  const refs: RouteRef[] = [];
  const walk = (items: RawMenuItem[]): void => {
    for (const item of items) {
      if (item.pageId !== undefined && item.path !== undefined) {
        refs.push({ pattern: item.path, pageId: item.pageId });
      }
      if (item.children !== undefined) {
        walk(item.children);
      }
    }
  };
  walk(site.menus);
  for (const page of site.pages) {
    refs.push({ pattern: page.path, pageId: page.id });
  }

  const path = normalizePath(pathname);
  const matched = refs
    .map((ref, index) => ({ ref, index }))
    .filter(({ ref }) => matchRoutePath(ref.pattern, path))
    .sort(
      (a, b) =>
        staticSegmentCount(b.ref.pattern) - staticSegmentCount(a.ref.pattern) ||
        a.index - b.index,
    )[0];
  if (matched === undefined) {
    return null;
  }
  return site.pages.find((page) => page.id === matched.ref.pageId) ?? null;
}

/** 路径段拆分（忽略首尾 / 重复斜杠，逐段解码失败时保留原文） */
function splitPath(value: string): string[] {
  return normalizePath(value)
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    });
}

/** 模式匹配：:param 段匹配任意非空段，其余段精确相等 */
function matchRoutePath(pattern: string, pathname: string): boolean {
  const patternSegments = splitPath(pattern);
  const pathSegments = splitPath(pathname);
  return (
    patternSegments.length === pathSegments.length &&
    patternSegments.every(
      (segment, index) =>
        segment.startsWith(":") || segment === pathSegments[index],
    )
  );
}

/** 静态段数量（模式优先级：静态段多者更具体） */
function staticSegmentCount(pattern: string): number {
  return splitPath(pattern).filter((segment) => !segment.startsWith(":")).length;
}

/** 去掉末尾斜杠（根路径保留） */
function normalizePath(pathname: string): string {
  const path = pathname.split("?")[0] ?? pathname;
  return path === "/" ? "/" : path.replace(/\/+$/, "");
}
