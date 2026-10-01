import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

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
 * 页面 DSL 在 yaml/<域>/<id>.yaml（route / provider / audit / model /
 * 等，按 PRD 模块树划分）；本文件只负责：
 * 加载 YAML、按会话裁剪可见性（public / permission / 需登录）、注入会话
 * 动态字段（updatedAt / user / permissions）。
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
interface PageEntry {
  id: string;
  path: string;
  title: string;
  version: number;
  public?: boolean;
  permission?: string;
  /** 不随 sitemap 内联 pageDsl，客户端经 /api/public/pages/{id} 懒加载 */
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

/** 递归收集 yaml 下所有页面 DSL（含 route / provider / ops 等域子目录；跳过 sitemap.yaml），按 id → 相对路径建索引 */
function collectPageFiles(dir: string): Map<string, string> {
  return new Map(
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return [...collectPageFiles(path)];
      if (!entry.name.endsWith(".yaml") || entry.name === "sitemap.yaml") return [];
      const id = entry.name.slice(0, -".yaml".length);
      return [[id, relative(YAML_DIR, path)]];
    }),
  );
}

const pageFiles = collectPageFiles(YAML_DIR);

function loadPageDsl(id: string): PageDsl {
  const file = pageFiles.get(id);
  if (!file) throw new Error(`页面 DSL 缺失：${id}.yaml`);
  return loadYaml<PageDsl>(file);
}

/** 页面 DSL：按 id 约定从 yaml/<域>/<id>.yaml 加载；lazy 页不在此内联 */
const pageDsls = new Map(
  site.pages.filter((p) => !p.lazy).map((p) => [p.id, loadPageDsl(p.id)]),
);
const lazyPageDsls = new Map(
  site.pages.filter((p) => p.lazy).map((p) => [p.id, loadPageDsl(p.id)]),
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
      // 懒加载页不下发 pageDsl，仅 id / path / version，经 /api/public/pages/{id} 按需获取
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
