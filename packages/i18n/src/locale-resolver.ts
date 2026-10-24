import { I18nError } from './errors.js';

/** 语言来源 */
export type LocaleSource =
  | 'url-path'
  | 'url-query'
  | 'cookie'
  | 'accept-language'
  | 'application-default';

/** resolveRequestLocale 输入：宿主把请求信息适配为普通对象 */
export interface ResolveLocaleInput {
  /** 路径中的语言段，如 /en-US/users 提取出的 'en-US' */
  pathLocale?: string;
  /** 查询参数 locale；数组表示重复参数 */
  queryLocale?: string | string[];
  /** 已解析出的 locale Cookie 值 */
  cookieLocale?: string;
  /** Accept-Language 请求头原文 */
  acceptLanguage?: string;
}

/** 应用语言配置 */
export interface LocaleResolverConfig {
  supportedLocales: string[];
  defaultLocale: string;
  /** 无显式语言时的默认策略，缺省 'system' */
  defaultStrategy?: 'system' | 'application';
  /** 显式配置的别名映射，如 { en: 'en-US' } */
  aliases?: Record<string, string>;
  /** 语言级回退映射，如 { 'fr-CA': ['fr'] }，仅用于 Accept-Language 协商 */
  fallbackLocales?: Record<string, string[]>;
}

/** 解析结果：唯一有效 locale 及来源 */
export interface ResolvedRequestLocale {
  locale: string;
  source: LocaleSource;
  explicit: boolean;
}

/** Accept-Language 条目（已按 q 降序、同权重按出现顺序排序） */
export interface AcceptLanguageEntry {
  tag: string;
  q: number;
}

const LOCALE_TAG_RE = /^[a-zA-Z]{2,3}(?:-[a-zA-Z]{4})?(?:-(?:[a-zA-Z]{2}|\d{3}))?$/;

/**
 * 规范化语言标识：语言小写、地区大写、文字系统首字母大写，`_` 归一为 `-`。
 * 非法格式返回 undefined。
 */
export function normalizeLocaleTag(value: string): string | undefined {
  const trimmed = value.trim().replace(/_/g, '-');
  if (!LOCALE_TAG_RE.test(trimmed)) {
    return undefined;
  }
  const parts = trimmed.split('-');
  let result = parts[0]!.toLowerCase();
  for (let i = 1; i < parts.length; i += 1) {
    const part = parts[i]!;
    result +=
      '-' +
      (part.length === 4
        ? part[0]!.toUpperCase() + part.slice(1).toLowerCase()
        : part.toUpperCase());
  }
  return result;
}

/**
 * 解析 Accept-Language 请求头。
 * 忽略 q=0、非法语言项与无效权重；结果按 q 降序、同权重按出现顺序排列。
 */
export function parseAcceptLanguage(header: string | undefined): AcceptLanguageEntry[] {
  if (header === undefined) {
    return [];
  }
  const entries: Array<AcceptLanguageEntry & { order: number }> = [];
  const parts = header.split(',');
  for (let order = 0; order < parts.length; order += 1) {
    const segments = parts[order]!.split(';');
    const rawTag = segments[0]!.trim();
    if (rawTag === '') {
      continue;
    }
    let q = 1;
    let validQ = true;
    for (const segment of segments.slice(1)) {
      const [name, rawValue] = segment.split('=');
      if (name?.trim().toLowerCase() !== 'q') {
        continue;
      }
      const parsed = Number(rawValue?.trim());
      if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
        validQ = false;
      } else {
        q = parsed;
      }
    }
    if (!validQ || q === 0) {
      continue;
    }
    if (rawTag === '*') {
      entries.push({ tag: '*', q, order });
      continue;
    }
    const tag = normalizeLocaleTag(rawTag);
    if (tag === undefined) {
      continue;
    }
    entries.push({ tag, q, order });
  }
  entries.sort((a, b) => b.q - a.q || a.order - b.order);
  return entries.map(({ tag, q }) => ({ tag, q }));
}

interface NormalizedConfig {
  /** 规范化 tag → 配置中的规范形态 */
  supported: ReadonlyMap<string, string>;
  defaultLocale: string;
  strategy: 'system' | 'application';
  aliases: ReadonlyMap<string, string>;
  fallbackLocales: ReadonlyMap<string, readonly string[]>;
}

function configError(message: string): never {
  throw new I18nError('INVALID_LOCALE_CONFIG', message);
}

/** 校验并规范化配置；非法配置抛 INVALID_LOCALE_CONFIG */
function prepareConfig(config: LocaleResolverConfig): NormalizedConfig {
  if (!Array.isArray(config.supportedLocales) || config.supportedLocales.length === 0) {
    configError('supportedLocales 必须为非空数组');
  }
  const supported = new Map<string, string>();
  for (const raw of config.supportedLocales) {
    const normalized = typeof raw === 'string' ? normalizeLocaleTag(raw) : undefined;
    if (normalized === undefined) {
      configError(`supportedLocales 含非法语言标识: ${String(raw)}`);
    }
    if (supported.has(normalized)) {
      configError(`supportedLocales 含重复语言（规范化后）: ${normalized}`);
    }
    supported.set(normalized, normalized);
  }

  const defaultNormalized =
    typeof config.defaultLocale === 'string'
      ? normalizeLocaleTag(config.defaultLocale)
      : undefined;
  if (defaultNormalized === undefined || !supported.has(defaultNormalized)) {
    configError(`defaultLocale 必须属于 supportedLocales: ${String(config.defaultLocale)}`);
  }
  const defaultLocale = supported.get(defaultNormalized)!;

  const strategy = config.defaultStrategy ?? 'system';
  if (strategy !== 'system' && strategy !== 'application') {
    configError(`非法 defaultStrategy: ${String(config.defaultStrategy)}`);
  }

  const aliases = new Map<string, string>();
  for (const [rawFrom, rawTo] of Object.entries(config.aliases ?? {})) {
    const from = normalizeLocaleTag(rawFrom);
    const to = normalizeLocaleTag(rawTo);
    if (from === undefined || to === undefined) {
      configError(`别名含非法语言标识: ${rawFrom} → ${rawTo}`);
    }
    if (supported.has(from)) {
      configError(`别名与已支持语言冲突: ${from}`);
    }
    if (aliases.has(from)) {
      configError(`别名重复定义（规范化后）: ${from}`);
    }
    if (from === to) {
      configError(`别名自映射: ${from}`);
    }
    aliases.set(from, to);
  }
  // 别名目标必须能沿别名链解析到支持语言；同时检测环
  for (const from of aliases.keys()) {
    if (applyAliases(from, aliases) === undefined) {
      configError(`别名目标无法解析到支持语言或存在环: ${from}`);
    }
  }
  const resolveAliasTarget = (value: string): string | undefined => {
    const terminal = applyAliases(value, aliases);
    return terminal !== undefined && supported.has(terminal) ? terminal : undefined;
  };
  for (const [from, to] of aliases) {
    if (resolveAliasTarget(to) === undefined) {
      configError(`别名目标不在支持列表: ${from} → ${to}`);
    }
  }

  const fallbackLocales = new Map<string, readonly string[]>();
  for (const [rawFrom, rawList] of Object.entries(config.fallbackLocales ?? {})) {
    const from = normalizeLocaleTag(rawFrom);
    if (from === undefined || !Array.isArray(rawList)) {
      configError(`fallbackLocales 含非法配置: ${rawFrom}`);
    }
    const list = rawList.map((item) => {
      const normalized = typeof item === 'string' ? normalizeLocaleTag(item) : undefined;
      if (normalized === undefined) {
        configError(`fallbackLocales 含非法语言标识: ${String(item)}`);
      }
      return normalized;
    });
    fallbackLocales.set(from, list);
  }

  return { supported, defaultLocale, strategy, aliases, fallbackLocales };
}

/** 沿别名链解析，返回终止 tag；检测到环返回 undefined */
function applyAliases(
  tag: string,
  aliases: ReadonlyMap<string, string>,
): string | undefined {
  const visited = new Set<string>([tag]);
  let current = tag;
  while (aliases.has(current)) {
    const next = aliases.get(current)!;
    if (visited.has(next)) {
      return undefined;
    }
    visited.add(next);
    current = next;
  }
  return current;
}

/** 精确 + 别名匹配支持列表，命中返回规范形态 */
function matchExactOrAlias(tag: string, config: NormalizedConfig): string | undefined {
  const terminal = applyAliases(tag, config.aliases);
  if (terminal === undefined) {
    return undefined;
  }
  return config.supported.get(terminal);
}

/** 协商匹配：精确 → 别名 → fallbackLocales 语言级回退 */
function matchForNegotiation(tag: string, config: NormalizedConfig): string | undefined {
  const direct = matchExactOrAlias(tag, config);
  if (direct !== undefined) {
    return direct;
  }
  for (const fallback of config.fallbackLocales.get(tag) ?? []) {
    const matched = matchExactOrAlias(fallback, config);
    if (matched !== undefined) {
      return matched;
    }
  }
  return undefined;
}

function invalidLocale(value: string, source: string): never {
  throw new I18nError('INVALID_LOCALE', `${source} 语言标识非法: ${value}`, {
    value,
    source,
  });
}

/**
 * 解析请求有效语言。优先级：URL path/query > locale Cookie >
 * Accept-Language（仅 system 策略）> 应用 defaultLocale。
 *
 * 显式值非法 / 不支持 / 冲突时抛 I18nError（INVALID_LOCALE /
 * UNSUPPORTED_LOCALE / LOCALE_CONFLICT / DUPLICATE_LOCALE_PARAM），
 * 不静默回退；Cookie 失效则忽略并继续解析链。
 */
export function resolveRequestLocale(
  input: ResolveLocaleInput,
  config: LocaleResolverConfig,
): ResolvedRequestLocale {
  const cfg = prepareConfig(config);

  // 1. 查询参数去重：重复 locale 参数直接报错
  let queryValue: string | undefined;
  if (Array.isArray(input.queryLocale)) {
    if (input.queryLocale.length > 1) {
      throw new I18nError('DUPLICATE_LOCALE_PARAM', 'locale 查询参数重复', {
        values: [...input.queryLocale],
      });
    }
    queryValue = input.queryLocale[0];
  } else {
    queryValue = input.queryLocale;
  }

  // 2. 提取并规范化 path / query
  const pathNorm =
    input.pathLocale !== undefined
      ? normalizeLocaleTag(input.pathLocale) ?? invalidLocale(input.pathLocale, 'url-path')
      : undefined;
  const queryNorm =
    queryValue !== undefined
      ? normalizeLocaleTag(queryValue) ?? invalidLocale(queryValue, 'url-query')
      : undefined;

  // 3. 冲突检测：别名解析后仍不同 → 冲突
  if (pathNorm !== undefined && queryNorm !== undefined) {
    const pathResolved = applyAliases(pathNorm, cfg.aliases);
    const queryResolved = applyAliases(queryNorm, cfg.aliases);
    if (pathResolved !== queryResolved) {
      throw new I18nError('LOCALE_CONFLICT', '路径与查询参数指定的语言冲突', {
        pathLocale: pathNorm,
        queryLocale: queryNorm,
      });
    }
  }

  // 4. 显式 URL 语言
  const explicit = pathNorm ?? queryNorm;
  if (explicit !== undefined) {
    const matched = matchExactOrAlias(explicit, cfg);
    if (matched === undefined) {
      throw new I18nError('UNSUPPORTED_LOCALE', `不支持的语言: ${explicit}`, {
        value: explicit,
        supportedLocales: [...cfg.supported.values()],
      });
    }
    return {
      locale: matched,
      source: pathNorm !== undefined ? 'url-path' : 'url-query',
      explicit: true,
    };
  }

  // 5. locale Cookie：失效偏好忽略并继续
  if (input.cookieLocale !== undefined) {
    const cookieNorm = normalizeLocaleTag(input.cookieLocale);
    if (cookieNorm !== undefined) {
      const matched = matchExactOrAlias(cookieNorm, cfg);
      if (matched !== undefined) {
        return { locale: matched, source: 'cookie', explicit: true };
      }
    }
  }

  // 6. Accept-Language 协商（仅 system 策略）
  if (cfg.strategy === 'system') {
    for (const entry of parseAcceptLanguage(input.acceptLanguage)) {
      if (entry.tag === '*') {
        return { locale: cfg.defaultLocale, source: 'accept-language', explicit: false };
      }
      const matched = matchForNegotiation(entry.tag, cfg);
      if (matched !== undefined) {
        return { locale: matched, source: 'accept-language', explicit: false };
      }
    }
  }

  // 7. 应用默认语言
  return { locale: cfg.defaultLocale, source: 'application-default', explicit: false };
}
