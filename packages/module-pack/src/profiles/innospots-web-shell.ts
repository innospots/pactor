import type { TargetProfile } from './types.js';

const base = {
  name: 'innospots-web-shell',
  inlineStringLayouts: true,
  stripMenuPaths: true,
  rewriteNavigation: { basePath: true, excludeApiUrls: true },
  rewriteAssetUrls: (id: string, version: string) => `/modules/${id}/${version}/`,
  forbidRootBasePath: true,
  moduleServerApi: false,
} as const;

/**
 * innospots-web-shell@1：兼容 lazy 页面端点未修复的旧 Shell
 * （端点返回 { version, pageDsl } 与 Pactor loader 期望的 resource.schema
 * 不一致），强制页面随 bootstrap 内联下发（去掉 lazy）。
 */
export const innospotsWebShellV1: TargetProfile = {
  ...base,
  version: 1,
  forceInlinePages: true,
};

/**
 * innospots-web-shell@2：Shell lazy 页面端点已修复，
 * 返回 PageResource 信封 { id, resourceType: "page", version, dslVersion, schema }，
 * 与 @pactor-app/app createSitemapLoader 契约对齐，lazy: true 原样保留。
 */
export const innospotsWebShellV2: TargetProfile = {
  ...base,
  version: 2,
  forceInlinePages: false,
};

/**
 * innospots-web-shell@3（当前默认）：在 @2 的页面/导航/资源契约之上，
 * Shell 新增 `/api/modules/<moduleId>/*` 通用分发入口，支持模块把
 * server entry（module/server.ts）打进 tgz 并由 Shell 统一承接。
 * 未使用 serverEntry 的模块产物与 @2 完全一致。
 */
export const innospotsWebShellV3: TargetProfile = {
  ...base,
  version: 3,
  forceInlinePages: false,
  moduleServerApi: true,
};
