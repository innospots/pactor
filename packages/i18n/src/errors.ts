/** i18n 包统一错误码 */
export type I18nErrorCode =
  // LocaleResolver
  | 'INVALID_LOCALE_CONFIG'
  | 'INVALID_LOCALE'
  | 'UNSUPPORTED_LOCALE'
  | 'LOCALE_CONFLICT'
  | 'DUPLICATE_LOCALE_PARAM'
  // YamlMessageProvider
  | 'MANIFEST_INVALID'
  | 'MANIFEST_MISMATCH'
  | 'NAMESPACE_NOT_FOUND'
  | 'MESSAGE_BUNDLE_INVALID'
  // ApiMessageProvider
  | 'MESSAGE_PROTOCOL_ERROR'
  | 'MESSAGE_FETCH_FAILED';

/** 携带可识别 code 的 i18n 错误 */
export class I18nError extends Error {
  constructor(
    public readonly code: I18nErrorCode,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'I18nError';
  }
}

/** 判断错误是否为 I18nError（可选按 code 过滤） */
export function isI18nError(error: unknown, code?: I18nErrorCode): error is I18nError {
  return error instanceof I18nError && (code === undefined || error.code === code);
}
