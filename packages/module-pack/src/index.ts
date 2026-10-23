/**
 * @pactor-app/module-pack：把 Pactor 应用工程打包为 Shell 可装配的
 * npm 模块（Manifest V1）。可编程 API；`pactor module *` CLI 为其薄封装。
 */

export { buildModule, ModuleBuildError } from './build.js';
export type { BuildModuleOptions, BuildModuleResult } from './build.js';
export { validateModule } from './validate.js';
export type { ValidateModuleOptions, ValidateModuleResult } from './validate.js';
export {
  deriveModuleId,
  discoverActions,
  discoverComponents,
  initModule,
  renderClientEntry,
} from './init.js';
export type { InitModuleOptions, InitModuleResult } from './init.js';

export {
  CONFIG_DEFAULTS,
  CONFIG_FILE,
  ConfigError,
  loadModuleConfig,
} from './config.js';
export type { ModulePackConfig, TailwindConfig } from './config.js';

export {
  DEFAULT_TARGET,
  getProfile,
  innospotsWebShellV1,
  innospotsWebShellV2,
  listProfiles,
  ProfileError,
} from './profiles/index.js';
export type { RewriteNavigationProfile, TargetProfile } from './profiles/index.js';

export { collectModuleSource } from './collect.js';
export type { CollectedSource } from './collect.js';
export {
  expandIncludes,
  INCLUDE_KEY,
  IncludeError,
  loadYamlExpanded,
  parseYamlFile,
} from './expand-include.js';
export { transformSitemap } from './transform-sitemap.js';
export type {
  TransformSitemapOptions,
  TransformSitemapResult,
} from './transform-sitemap.js';
export { matchPathPattern, rewriteDslUrls, rewriteNavigationTo } from './rewrite-urls.js';
export type { RewriteContext, RewriteResult } from './rewrite-urls.js';
export { bundleClient, CLIENT_EXTERNALS, parseJsonc, tsconfigAliases } from './bundle-client.js';
export type { BundleClientOptions, BundleClientResult } from './bundle-client.js';
export { compileTailwind } from './compile-styles.js';
export type {
  CompileTailwindOptions,
  CompileTailwindResult,
} from './compile-styles.js';
export {
  emitDsl,
  emitModule,
  readProjectVersion,
  resolvePactorVersionRange,
  writeManifest,
} from './emit-manifest.js';
export type { ModuleManifest } from './emit-manifest.js';
