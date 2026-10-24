export { I18nError, isI18nError } from './errors.js';
export type { I18nErrorCode } from './errors.js';

export {
  normalizeLocaleTag,
  parseAcceptLanguage,
  resolveRequestLocale,
} from './locale-resolver.js';
export type {
  AcceptLanguageEntry,
  LocaleResolverConfig,
  LocaleSource,
  ResolvedRequestLocale,
  ResolveLocaleInput,
} from './locale-resolver.js';

export type { LoadMessagesInput, MessageProvider } from './message-provider.js';

export { ApiMessageProvider } from './api-message-provider.js';
export type {
  ApiLoadInput,
  ApiLoadResult,
  ApiMessageProviderOptions,
  FetchLike,
  FetchLikeResponse,
} from './api-message-provider.js';

export {
  assertMessages,
  assertNoCrossNamespaceKeyConflicts,
  isValidMessageKey,
  validateBundleSetEnvelope,
} from './bundle-validation.js';
export type { EnvelopeExpectation } from './bundle-validation.js';

export {
  createDefaultTranslatableFieldRegistry,
  getDefaultTranslatableFieldRegistry,
  TranslatableFieldRegistry,
} from './translatable-field-registry.js';

export {
  escapeJsonPointerSegment,
  parseJsonPointer,
  resolveJsonPointer,
} from './json-pointer.js';
export type { ResolvedJsonPointer } from './json-pointer.js';

export { localizePageDsl, MISSING_TRANSLATION_TEXT } from './dsl-localizer.js';
export type {
  AuthorPageDsl,
  AuthorPageI18n,
  LanguageBundles,
  LocalizeDiagnostic,
  LocalizePageDslInput,
  MissingResolution,
  TranslationDescriptor,
} from './dsl-localizer.js';
