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
export declare function transformSitemap(site: AnyRecord, options: TransformSitemapOptions): TransformSitemapResult;
export {};
