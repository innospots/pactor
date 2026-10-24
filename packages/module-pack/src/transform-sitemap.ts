import type { TargetProfile } from './profiles/index.js';

/**
 * 按 target profile 转换 sitemap（语义以 PoC 为蓝本，全部由 profile 显式开关）：
 * - inlineStringLayouts：字符串形式的布局引用解析为内联布局对象；
 * - stripMenuPaths：删除菜单显式 path（运行时按 pageId 从 pages 回填）；
 * - forceInlinePages：删除页面 lazy（随 bootstrap 内联下发）；
 * - accessDefault='public'：给未声明 public/permission 的 pages / menus 补 public: true。
 */

export interface TransformSitemapOptions {
  profile: TargetProfile;
  /**
   * 模块级访问默认值：'public' 时给未声明 public/permission 的 pages / menus
   * 补 public: true（缺省填充，不覆盖显式声明）；'authenticated' 不改动。
   */
  accessDefault?: 'public' | 'authenticated';
  /** 解析字符串布局引用（yamlRoot 相对路径 -> 布局对象，应走 $include 展开） */
  loadLayout: (relPath: string) => unknown;
}

export interface TransformSitemapResult {
  site: Record<string, unknown>;
  layoutCount: number;
  pageCount: number;
  menuCount: number;
}

type AnyRecord = Record<string, unknown>;

/** 转换 sitemap（不修改入参，返回新对象） */
export function transformSitemap(
  site: AnyRecord,
  options: TransformSitemapOptions,
): TransformSitemapResult {
  const { profile, accessDefault, loadLayout } = options;
  const fillPublic = accessDefault === 'public';
  const next: AnyRecord = { ...site };

  const rawLayouts = isRecord(site.layouts) ? site.layouts : {};
  const layouts: AnyRecord = {};
  for (const [name, def] of Object.entries(rawLayouts)) {
    layouts[name] =
      typeof def === 'string' && profile.inlineStringLayouts ? loadLayout(def) : def;
  }
  next.layouts = layouts;

  const rawPages = Array.isArray(site.pages) ? (site.pages as AnyRecord[]) : [];
  next.pages = rawPages.map((page) => {
    const nextPage = { ...page };
    if (profile.forceInlinePages) {
      delete nextPage.lazy;
    }
    if (fillPublic && isAccessUndeclared(nextPage)) {
      nextPage.public = true;
    }
    return nextPage;
  });

  const rawMenus = Array.isArray(site.menus) ? (site.menus as AnyRecord[]) : [];
  const transformMenu = (menu: AnyRecord): AnyRecord => {
    const nextMenu = { ...menu };
    if (profile.stripMenuPaths) {
      delete nextMenu.path;
    }
    if (fillPublic && isAccessUndeclared(nextMenu)) {
      nextMenu.public = true;
    }
    if (Array.isArray(nextMenu.children)) {
      nextMenu.children = (nextMenu.children as AnyRecord[]).map((child) =>
        isRecord(child) ? transformMenu(child) : child,
      );
    }
    return nextMenu;
  };
  next.menus = rawMenus.map((menu) => (isRecord(menu) ? transformMenu(menu) : menu));

  return {
    site: next,
    layoutCount: Object.keys(layouts).length,
    pageCount: rawPages.length,
    menuCount: rawMenus.length,
  };
}

function isRecord(value: unknown): value is AnyRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** 条目未显式声明访问属性（既无 public 也无 permission）时才允许填充缺省值 */
function isAccessUndeclared(entry: AnyRecord): boolean {
  return entry.public === undefined && entry.permission === undefined;
}
