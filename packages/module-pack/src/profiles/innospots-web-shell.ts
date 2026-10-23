import type { TargetProfile } from './types.js';

const base = {
  name: 'innospots-web-shell',
  inlineStringLayouts: true,
  stripMenuPaths: true,
  rewriteNavigation: { basePath: true, excludeApiUrls: true },
  rewriteAssetUrls: (id: string, version: string) => `/modules/${id}/${version}/`,
  forbidRootBasePath: true,
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
 * innospots-web-shell@2（当前默认）：Shell lazy 页面端点已修复，
 * 返回 PageResource 信封 { id, resourceType: "page", version, dslVersion, schema }，
 * 与 @pactor-app/app createSitemapLoader 契约对齐，lazy: true 原样保留。
 */
export const innospotsWebShellV2: TargetProfile = {
  ...base,
  version: 2,
  forceInlinePages: false,
};
