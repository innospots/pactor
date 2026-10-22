export type {
  ActionConfig,
  ConditionConfig,
  DslChildren,
  DslChildrenItem,
  DslComponentNode,
  DslNode,
  DslNodeBase,
  DslReferenceNode,
  DslSourceRef,
  EventMap,
  ExpressionString,
  PermissionConfig,
  PermissionDeniedStrategy,
} from './node.js';
export { isDslSourceRef } from './node.js';

export type {
  ApplicationDsl,
  DataSourceConfig,
  DataSourceType,
  DslFragmentPayload,
  DslVersion,
  FragmentDsl,
  LifecycleConfig,
  LifecycleEventName,
  PageDsl,
  PageMeta,
  RequiresConfig,
} from './document.js';
export { isDslFragmentPayload, resolveRootNodes } from './document.js';

export { RUNTIME_SCOPES } from './scope.js';
export type { RuntimeScope } from './scope.js';

export { Registry } from './registry.js';

export {
  createI18nContext,
  isI18nDescriptor,
  isLocalizedText,
  lookupI18nMessage,
} from './i18n.js';
export type {
  CreateI18nOptions,
  I18nContext,
  I18nInlineMessages,
  I18nKeyRef,
  I18nLookupResult,
  I18nMessages,
  I18nParams,
  I18nValueDescriptor,
  Locale,
  LocalizationMeta,
  LocalizedText,
  MessageBundle,
  MessageBundleSet,
} from './i18n.js';
