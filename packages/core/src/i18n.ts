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
    let template: string | undefined;

    // 1. 尝试当前 locale 的命名空间
    const currentLocaleMessages = messages[locale];
    if (isStringMap(currentLocaleMessages)) {
      const value = currentLocaleMessages[key];
      if (typeof value === 'string') {
        template = value;
      }
    }

    // 2. 尝试扁平 key
    if (template === undefined) {
      const flatValue = messages[key];
      if (typeof flatValue === 'string') {
        template = flatValue;
      }
    }

    // 3. 尝试 defaultLocale 命名空间
    if (template === undefined && locale !== defaultLocale) {
      const defaultLocaleMessages = messages[defaultLocale];
      if (isStringMap(defaultLocaleMessages)) {
        const value = defaultLocaleMessages[key];
        if (typeof value === 'string') {
          template = value;
        }
      }
    }

    if (template === undefined) {
      return key;
    }

    return params ? interpolate(template, params) : template;
  };

  return { locale, defaultLocale, t };
}
