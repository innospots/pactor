export type {
  ActionConfig,
  ConditionConfig,
  DslComponentNode,
  DslNode,
  DslNodeBase,
  DslReferenceNode,
  EventMap,
  ExpressionString,
  PermissionConfig,
  PermissionDeniedStrategy,
} from './node.js';

export type {
  ApplicationDsl,
  DataSourceConfig,
  DataSourceType,
  DslVersion,
  FragmentDsl,
  LifecycleConfig,
  LifecycleEventName,
  PageDsl,
  PageMeta,
  RequiresConfig,
} from './document.js';

export { RUNTIME_SCOPES } from './scope.js';
export type { RuntimeScope } from './scope.js';

export { Registry } from './registry.js';

export { createI18nContext } from './i18n.js';
export type {
  CreateI18nOptions,
  I18nContext,
  I18nMessages,
  I18nParams,
  Locale,
} from './i18n.js';
