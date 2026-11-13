/**
 * @pactor-app/module-pack：把 Pactor 应用工程打包为 Shell 可装配的
 * npm 模块（Manifest V1）。可编程 API；`pactor module *` CLI 为其薄封装。
 */
export { buildModule, ModuleBuildError } from './build.js';
export { validateModule } from './validate.js';
export { CLIENT_STYLES_ENTRY, deriveApiPrefix, deriveModuleId, discoverActions, discoverComponents, initModule, MODULE_ID_PREFIX, renderClientEntry, renderModuleStyles, renderServerEntry, SERVER_ENTRY, } from './init.js';
export { CONFIG_DEFAULTS, CONFIG_FILE, ConfigError, loadModuleConfig, } from './config.js';
export { DEFAULT_TARGET, getProfile, innospotsWebShellV1, innospotsWebShellV2, innospotsWebShellV3, listProfiles, ProfileError, } from './profiles/index.js';
export { collectModuleSource } from './collect.js';
export { expandIncludes, INCLUDE_KEY, IncludeError, loadYamlExpanded, parseYamlFile, } from './expand-include.js';
export { transformSitemap } from './transform-sitemap.js';
export { matchPathPattern, rewriteDslUrls, rewriteNavigationTo } from './rewrite-urls.js';
export { bundleClient, CLIENT_EXTERNALS, parseJsonc, tsconfigAliases } from './bundle-client.js';
export { bundleServer, SERVER_BUNDLE_FILE, SERVER_EXTERNALS, ServerBundleError, } from './bundle-server.js';
export { compileTailwind } from './compile-styles.js';
export { emitDsl, emitModule, readProjectVersion, resolvePactorVersionRange, writeManifest, } from './emit-manifest.js';
export { bumpPackageVersion, bumpVersion } from './version.js';
