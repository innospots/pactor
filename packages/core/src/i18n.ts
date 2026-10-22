/**
 * 国际化（i18n）基础类型定义与翻译工具。
 *
 * 翻译模型为扁平键值对：key 支持点路径嵌套（如 `menu.home`），
 * value 为对应语言的文案，可包含 `{{name}}` 占位符用于参数插值。
 */

/** 语言代码，如 'zh-CN'、'en-US' */
export type Locale = string;

/** 翻译消息表：key → 文案，或 locale → key → 文案 */
export type I18nMessages = Record<string, string | Record<string, string>>;

/** 参数插值值 */
export type I18nParams = Record<string, unknown>;

/** 引用独立词条的可翻译描述（方式二：属性引用语言包） */
export interface I18nKeyRef {
  key: string;
  params?: Record<string, unknown>;
  fallback?: string;
}

/** 内联多语言的可翻译描述（方式一：属性内联多语言） */
export interface I18nInlineMessages {
  messages: Record<string, string>;
  params?: Record<string, unknown>;
  fallback?: string;
}

/**
 * 作者态可翻译值。`$i18n` 包装对象不允许其他同级字段；
 * 同一描述内 key 与 messages 互斥，由 schema 校验保证。
 */
export interface I18nValueDescriptor {
  $i18n: I18nKeyRef | I18nInlineMessages;
}

/** 下发态动态文本：语言选择已完成，模板插值在客户端完成 */
export interface LocalizedText {
  $localizedText: {
    template: string;
    params?: Record<string, unknown>;
  };
}

/** 单个语言包文件的内容 */
export interface MessageBundle {
  version: string;
  messages: Record<string, string>;
}

/** 语言包集合：服务端语言包 API 与本地 YAML 转换入口的统一输出结构 */
export interface MessageBundleSet {
  appId: string;
  locale: string;
  release: string;
  format: 'simple-v1';
  bundles: Record<string, MessageBundle>;
}

/** 页面/片段下发时附带的本地化元信息 */
export interface LocalizationMeta {
  locale: string;
  defaultLocale: string;
  source?: string;
  explicit?: boolean;
  release?: string;
  bundleVersions?: Record<string, string>;
}

/**
 * i18n 上下文：暴露给 RuntimeContext 与表达式引擎。
 * `t` 为翻译函数，支持参数插值与回退。
 */
export interface I18nContext {
  /** 当前生效的语言代码 */
  locale: Locale;
  /** 回退语言代码（缺省 'zh-CN'） */
  defaultLocale: Locale;
  /** 翻译函数 */
  t(key: string, params?: I18nParams): string;
}

/** 创建 i18n 上下文时的配置 */
export interface CreateI18nOptions {
  locale?: Locale;
  defaultLocale?: Locale;
  messages?: I18nMessages;
}

/** 插值替换 `{{name}}` 占位符 */
function interpolate(template: string, params: I18nParams): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, name: string) => {
    const value = params[name];
    return value === undefined || value === null ? '' : String(value);
  });
}

function isStringMap(value: unknown): value is Record<string, string> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return Object.values(value).every((v) => typeof v === 'string');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** 判断是否为作者态 `$i18n` 翻译描述 */
export function isI18nDescriptor(value: unknown): value is I18nValueDescriptor {
  if (!isRecord(value) || !isRecord(value.$i18n)) {
    return false;
  }
  const inner = value.$i18n;
  if (typeof inner.key === 'string') {
    return true;
  }
  return isStringMap(inner.messages);
}

/** 判断是否为下发态 `$localizedText` 动态文本 */
export function isLocalizedText(value: unknown): value is LocalizedText {
  return (
    isRecord(value) &&
    isRecord(value.$localizedText) &&
    typeof value.$localizedText.template === 'string'
  );
}

/** 词条查找结果 */
export interface I18nLookupResult {
  /** 是否命中词条（空字符串译文视为命中） */
  found: boolean;
  /** 命中时为译文原文（未插值），未命中时为 key 本身 */
  value: string;
  /** 命中的 locale 分组；扁平 key 命中或未命中时为 undefined */
  resolvedLocale?: Locale;
}

/**
 * 显式命中的词条查找。
 *
 * 查找顺序：当前 locale 分组 → 扁平 key → defaultLocale 分组 → 未命中。
 * 空字符串视为命中（found=true），不能用 `value === key` 判断命中，
 * 因为合法译文可能恰好等于 key。
 */
export function lookupI18nMessage(
  messages: I18nMessages,
  locale: Locale,
  defaultLocale: Locale,
  key: string,
): I18nLookupResult {
  // 1. 当前 locale 分组
  const currentLocaleMessages = messages[locale];
  if (isStringMap(currentLocaleMessages)) {
    const value = currentLocaleMessages[key];
    if (typeof value === 'string') {
      return { found: true, value, resolvedLocale: locale };
    }
  }

  // 2. 扁平 key
  const flatValue = messages[key];
  if (typeof flatValue === 'string') {
    return { found: true, value: flatValue };
  }

  // 3. defaultLocale 分组
  if (locale !== defaultLocale) {
    const defaultLocaleMessages = messages[defaultLocale];
    if (isStringMap(defaultLocaleMessages)) {
      const value = defaultLocaleMessages[key];
      if (typeof value === 'string') {
        return { found: true, value, resolvedLocale: defaultLocale };
      }
    }
  }

  return { found: false, value: key };
}

/**
 * 创建翻译函数。
 *
 * messages 支持两种结构：
 * - 扁平：`{ 'menu.home': '首页' }`（当前 locale 直接使用）
 * - 按语言：`{ 'zh-CN': { 'menu.home': '首页' }, 'en-US': { 'menu.home': 'Home' } }`
 *
 * 回退顺序：当前 locale → defaultLocale → key 本身。
 * 支持 `{{name}}` 参数插值。
 */
export function createI18nContext(options: CreateI18nOptions = {}): I18nContext {
  const locale = options.locale ?? 'zh-CN';
  const defaultLocale = options.defaultLocale ?? 'zh-CN';
  const messages = options.messages ?? {};

  const t = (key: string, params?: I18nParams): string => {
    const { found, value } = lookupI18nMessage(messages, locale, defaultLocale, key);
    if (!found) {
      return key;
    }
    return params ? interpolate(value, params) : value;
  };

  return { locale, defaultLocale, t };
}
