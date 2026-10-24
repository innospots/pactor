/**
 * Target profile：底座（Shell）装配契约的显式化描述。
 *
 * 若干打包转换本质上是当前 Shell 实现的缺陷规避（菜单去 path、布局内联、
 * 去 lazy、basePath 禁止 "/")，而非永恒契约；Shell 修复后应发布新版本
 * profile，模块侧改一行 `target` 即可重新打包，不改动适配器代码。
 */

/** 导航重写行为 */
export interface RewriteNavigationProfile {
  /** 模块内绝对导航路径加 basePath 前缀 */
  basePath: boolean;
  /** 绝不重写 request 的 API url 与 http(s) 外链 */
  excludeApiUrls: boolean;
}

export interface TargetProfile {
  /** profile 名（如 innospots-web-shell） */
  name: string;
  /** profile 版本（与 target 配置 `@<version>` 对应） */
  version: number;
  /** sitemap 中字符串形式的布局引用内联为布局对象 */
  inlineStringLayouts: boolean;
  /** 删除菜单显式 path（交给运行时按 pageId 从 pages 解析） */
  stripMenuPaths: boolean;
  /** 删除页面 lazy（页面随 bootstrap 内联下发；Shell lazy 端点修好前为 true） */
  forceInlinePages: boolean;
  rewriteNavigation: RewriteNavigationProfile;
  /** 静态资源 URL 重写前缀（如 `/modules/<id>/<version>/`） */
  rewriteAssetUrls: (id: string, version: string) => string;
  /** 禁止 basePath: "/"（Shell joinPublicPath 会产生 "//login" 这类坏路径） */
  forbidRootBasePath: boolean;
  /** Shell 支持 `/api/modules/<moduleId>/*` 通用模块 API 分发 */
  moduleServerApi: boolean;
}
