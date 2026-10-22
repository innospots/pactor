/**
 * Node 入口：额外导出依赖 `yaml`（peerDependency）的 YamlMessageProvider。
 * 浏览器入口 `@pactor-app/i18n` 不含任何 yaml 依赖。
 */
export * from './index.js';

export { validateManifest, YamlMessageProvider } from './yaml-message-provider.js';
export type {
  MessageManifest,
  MessageManifestEntry,
  YamlMessageProviderOptions,
} from './yaml-message-provider.js';
