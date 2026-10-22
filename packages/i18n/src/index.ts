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
