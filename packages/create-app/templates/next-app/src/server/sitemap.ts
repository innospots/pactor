import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { PageDsl, PermissionConfig } from "@pactor-app/core";
import { parseDocument } from "yaml";

import type { LayoutDsl, SitemapResource } from "pactor-app";

import type { DemoUser } from "./accounts";

/**
 * Mock sitemap 数据源（design/dynamic-page.md 方案 B 示例实现）。
 * 真实项目由后端接口返回同构对象——端点按会话裁剪：
 * 匿名 → public 页（登录/注册）；登录后 → 该角色可见的 menus / pages / permissions。
 *
 * 入口数据（元数据 / layouts / pages / menus 全量）在 yaml/sitemap.yaml，
 * 页面 DSL 在 yaml/pages/<id>.page.yaml；本文件只负责：加载 YAML、
 * 按会话裁剪可见性（public / permission / 需登录）、注入会话动态字段
 * （updatedAt / user / permissions）。
 */

/* ---------------- YAML DSL 文件加载（src/server/yaml/，启动时读入内存） ---------------- */

const YAML_DIR = join(process.cwd(), "src/server/yaml");

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

/** sitemap.yaml 中的页面声明：可见性标记（public / permission）+ DSL 加载方式（lazy） */
export interface PageEntry {
  id: string;
  path: string;
  title: string;
  version: number;
  public?: boolean;
  permission?: string;
  /** 不随 sitemap 内联 pageDsl，客户端经 /api/pages/{id} 懒加载 */
  lazy?: boolean;
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
  menus: SitemapResource["menus"];
}

const site = loadYaml<SitemapFile>("sitemap.yaml");

/** 页面 DSL：按 id 约定从 pages/<id>.page.yaml 加载；lazy 页不在此内联 */
const pageDsls = new Map(
  site.pages.filter((p) => !p.lazy).map((p) => [p.id, loadYaml<PageDsl>(`pages/${p.id}.page.yaml`)]),
);
const lazyPageDsls = new Map(
  site.pages.filter((p) => p.lazy).map((p) => [p.id, loadYaml<PageDsl>(`pages/${p.id}.page.yaml`)]),
);

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
  menus: SitemapResource["menus"],
  user: DemoUser | null,
): SitemapResource["menus"] {
  const out: SitemapResource["menus"] = [];
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

/**
 * 按会话构建 sitemap：同一 URL，不同用户拿到不同内容。
 * 匿名 → 仅 public 页；guest → + 首页；admin → + 用户列表 / 报表组。
 */
export function buildSitemap(user: DemoUser | null): SitemapResource {
  const pages: SitemapResource["pages"] = site.pages
    .filter((p) => canSee(p, user))
    .map((p) => ({
      id: p.id,
      path: p.path,
      title: p.title,
      version: p.version,
      // 懒加载页不下发 pageDsl，仅 id / path / version，经 /api/pages/{id} 按需获取
      ...(p.lazy ? {} : { pageDsl: pageDsls.get(p.id) }),
    }));

  // sitemap.yaml 原样透传，仅覆盖会话相关部分：pages / menus 按可见性过滤，
  // updatedAt / user / permissions 按会话注入
  return {
    ...site,
    updatedAt: new Date().toISOString(),
    ...(user ? { user: { ...user }, permissions: user.permissions } : {}),
    pages,
    menus: filterMenus(site.menus, user),
  };
}

/** 懒加载页：校验会话与可见性（前端权限只控制 UI，接口必须鉴权） */
export function getLazyPage(
  pageId: string,
  user: DemoUser | null,
): { version: number; pageDsl: PageDsl } | null {
  const entry = site.pages.find((p) => p.id === pageId);
  const pageDsl = lazyPageDsls.get(pageId);
  if (!entry?.lazy || !pageDsl || !canSee(entry, user)) {
    return null;
  }
  return { version: entry.version, pageDsl };
}

/* ---------------- 页面访问校验辅助（src/server/page-access.ts 消费） ---------------- */

/** 全部页面声明（会话无关超集；访问校验按全量页面解析，不受菜单裁剪影响） */
export function listPageEntries(): PageEntry[] {
  return site.pages;
}

/** 按 id 取页面 DSL（内联或懒加载文件）；未声明返回 undefined */
export function findPageDsl(pageId: string): PageDsl | undefined {
  return pageDsls.get(pageId) ?? lazyPageDsls.get(pageId);
}

/** 未登录访问受保护页面的重定向目标（sitemap.yaml 的 auth.loginPath） */
export function getLoginPath(): string {
  return site.auth.loginPath ?? "/login";
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
  const refs: RouteRef[] = [];
  const walk = (items: SitemapResource["menus"]): void => {
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
