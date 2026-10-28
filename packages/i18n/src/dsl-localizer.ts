import type {
  I18nInlineMessages,
  I18nKeyRef,
  LocalizedText,
  MessageBundleSet,
  PageDsl,
} from '@pactor-app/core';
import { isDslSourceRef } from '@pactor-app/core';
import { isValidMessageKey } from './bundle-validation.js';

import { I18nError } from './errors.js';
import { escapeJsonPointerSegment } from './json-pointer.js';
import {
  getDefaultTranslatableFieldRegistry,
  type TranslatableFieldRegistry,
} from './translatable-field-registry.js';

/**
 * DslLocalizer（设计第 4、6、7、8 节，缺口 G03/G04/G17）。
 *
 * 纯转换入口：语言包作为参数显式传入，不在遍历组件时自行请求。
 * 统一处理三种声明方式（`$i18n.messages`、`$i18n.key`、字段内简写），
 * 返回已本地化的新对象（不修改输入）；编译后移除作者态 `i18n` 字段。
 */

/** 翻译描述（`$i18n` 内层形态） */
export type TranslationDescriptor = I18nKeyRef | I18nInlineMessages;

/** 页面作者态 i18n 字段（设计 4.2） */
export interface AuthorPageI18n {
  namespaces?: string[];
}

/** 作者态 Page DSL（PageDsl + 顶层 i18n 字段） */
export type AuthorPageDsl = PageDsl & { i18n?: AuthorPageI18n };

/** 显式传入的语言包链：current 为当前 locale，fallbacks 有序（显式语言级回退 → defaultLocale） */
export interface LanguageBundles {
  current: MessageBundleSet;
  fallbacks?: MessageBundleSet[];
}

/** 词条未在当前 locale 命中时的实际命中方式 */
export type MissingResolution =
  | 'fallback-locale'
  | 'default-locale'
  | 'fallback'
  | 'implicit-fallback'
  | 'key'
  | 'missing-text';

export interface LocalizeDiagnostic {
  type: 'missing-translation' | 'missing-param';
  /** 展示用文档路径（JSON Pointer 形态，数组为真实下标） */
  path: string;
  locale: string;
  key?: string;
  param?: string;
  resolution?: MissingResolution | 'placeholder';
}

export interface LocalizePageDslInput {
  page: AuthorPageDsl;
  locale: string;
  defaultLocale: string;
  languageBundles: LanguageBundles;
  registry?: TranslatableFieldRegistry;
  onDiagnostic?: (diagnostic: LocalizeDiagnostic) => void;
}

/** 内联描述无 key 且所有回退失败时的统一缺失文案 */
export const MISSING_TRANSLATION_TEXT = '[missing translation]';

/** bindings 禁止定位的顶层字段（设计 4.2：禁止绑定状态、请求参数、权限、标识与路由） */

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** 深拷贝（DSL 为纯 JSON 结构）；保证不修改输入 */
function deepClone<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item)) as unknown as T;
  }
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value)) {
      out[key] = deepClone(child);
    }
    return out as T;
  }
  return value;
}

/** 词条查找命中 */
interface TemplateHit {
  found: boolean;
  value?: string;
  resolution?: 'current' | 'fallback-locale' | 'default-locale';
}

interface LocalizeContext {
  locale: string;
  defaultLocale: string;
  /** 查找链 locale：当前 → 显式语言级回退 → defaultLocale（去重保序） */
  localeChain: string[];
  /** 与 localeChain 对应的语言包链（current 在前） */
  bundleChain: MessageBundleSet[];
  registry: TranslatableFieldRegistry;
  /** 页面级命名组件定义（用于解析引用节点的实际 type） */
  namedComponents: Record<string, unknown> | undefined;
  onDiagnostic?: (diagnostic: LocalizeDiagnostic) => void;
}

/** key 描述：沿语言包链查找（包内 namespace 顺序无关，跨包冲突已被 Provider 拒绝） */
function lookupKey(ctx: LocalizeContext, key: string): TemplateHit {
  for (let i = 0; i < ctx.bundleChain.length; i += 1) {
    const set = ctx.bundleChain[i]!;
    for (const bundle of Object.values(set.bundles)) {
      const value = bundle.messages[key];
      if (typeof value === 'string') {
        const resolution =
          i === 0
            ? 'current'
            : set.locale === ctx.defaultLocale
              ? 'default-locale'
              : 'fallback-locale';
        return { found: true, value, resolution };
      }
    }
  }
  return { found: false };
}

/** 内联 messages 描述：沿 locale 链查找（空字符串视为有效翻译） */
function lookupInline(ctx: LocalizeContext, messages: Record<string, string>): TemplateHit {
  for (const loc of ctx.localeChain) {
    const value = messages[loc];
    if (typeof value === 'string') {
      const resolution =
        loc === ctx.locale ? 'current' : loc === ctx.defaultLocale ? 'default-locale' : 'fallback-locale';
      return { found: true, value, resolution };
    }
  }
  return { found: false };
}

/** 校验翻译描述结构（直接调用 localizePageDsl 时兜底；作者态校验已通过时不会触发） */
function assertDescriptor(value: unknown, path: string): TranslationDescriptor {
  if (!isPlainObject(value)) {
    throw new I18nError('I18N_DESCRIPTOR_INVALID', `翻译描述必须是对象: ${path}`, { path });
  }
  const hasKey = typeof value['key'] === 'string';
  const messages = value['messages'];
  const hasMessages =
    isPlainObject(messages) && Object.values(messages).every((v) => typeof v === 'string');
  if (hasKey === hasMessages) {
    throw new I18nError(
      'I18N_DESCRIPTOR_INVALID',
      `翻译描述必须且只能包含 key 或 messages 之一: ${path}`,
      { path },
    );
  }
  if (value['params'] !== undefined && !isPlainObject(value['params'])) {
    throw new I18nError('I18N_DESCRIPTOR_INVALID', `翻译描述 params 必须是对象: ${path}`, { path });
  }
  if (value['fallback'] !== undefined && typeof value['fallback'] !== 'string') {
    throw new I18nError('I18N_DESCRIPTOR_INVALID', `翻译描述 fallback 必须是字符串: ${path}`, {
      path,
    });
  }
  return value as unknown as TranslationDescriptor;
}

/** 安全边界（设计第 7 节）：词条/fallback/插值结果不得含字面量 ${ */
function assertSafeTemplate(template: string, path: string): void {
  if (template.includes('${')) {
    throw new I18nError('UNSAFE_MESSAGE', `词条或 fallback 含字面量 \${，拒绝转换: ${path}`, {
      path,
    });
  }
}

const PARAM_PLACEHOLDER_RE = /\{\{(\w+)\}\}/g;

/** 字面量参数服务端插值；未知参数保留占位符并记录诊断（设计第 7 节） */
function interpolateTemplate(
  ctx: LocalizeContext,
  template: string,
  params: Record<string, unknown>,
  path: string,
): string {
  return template.replace(PARAM_PLACEHOLDER_RE, (raw, name: string) => {
    if (Object.prototype.hasOwnProperty.call(params, name)) {
      const value = params[name];
      return value === undefined || value === null ? '' : String(value);
    }
    ctx.onDiagnostic?.({
      type: 'missing-param',
      path,
      locale: ctx.locale,
      param: name,
      resolution: 'placeholder',
    });
    return raw;
  });
}

/**
 * 转换单个翻译描述：
 * 查找顺序（设计第 8 节）= 当前 locale → 显式语言级回退 → defaultLocale →
 * 描述 fallback→ key / 统一缺失文案。
 * 静态结果直接输出字符串；含 `${...}` 运行时参数时编译为 `$localizedText`。
 */
function convertDescriptor(
  ctx: LocalizeContext,
  desc: TranslationDescriptor,
  implicitFallback: string | undefined,
  path: string,
): string | LocalizedText {
  const key = 'key' in desc ? desc.key : undefined;
  const hit =
    key !== undefined
      ? lookupKey(ctx, key)
      : lookupInline(ctx, (desc as I18nInlineMessages).messages);

  let template: string;
  if (hit.found) {
    template = hit.value!;
    if (hit.resolution !== 'current') {
      ctx.onDiagnostic?.({
        type: 'missing-translation',
        path,
        locale: ctx.locale,
        key,
        resolution: hit.resolution,
      });
    }
  } else if (typeof desc.fallback === 'string') {
    template = desc.fallback;
    ctx.onDiagnostic?.({
      type: 'missing-translation',
      path,
      locale: ctx.locale,
      key,
      resolution: 'fallback',
    });
  } else if (implicitFallback !== undefined) {
    template = implicitFallback;
    ctx.onDiagnostic?.({
      type: 'missing-translation',
      path,
      locale: ctx.locale,
      key,
      resolution: 'implicit-fallback',
    });
  } else if (key !== undefined) {
    template = key;
    ctx.onDiagnostic?.({
      type: 'missing-translation',
      path,
      locale: ctx.locale,
      key,
      resolution: 'key',
    });
  } else {
    template = MISSING_TRANSLATION_TEXT;
    ctx.onDiagnostic?.({
      type: 'missing-translation',
      path,
      locale: ctx.locale,
      resolution: 'missing-text',
    });
  }

  assertSafeTemplate(template, path);

  const params = desc.params;
  if (params !== undefined) {
    const hasRuntimeParam = Object.values(params).some(
      (value) => typeof value === 'string' && value.includes('${'),
    );
    if (hasRuntimeParam) {
      // 动态参数：编译为下发态 $localizedText，template 为已选语言词条，params 保留表达式原样
      return { $localizedText: { template, params: { ...params } } };
    }
    // 参数全为字面量：服务端直接插值输出最终字符串；对插值结果再次检查（设计第 7 节）
    const result = interpolateTemplate(ctx, template, params, path);
    assertSafeTemplate(result, path);
    return result;
  }
  return template;
}

type TranslatableMatcher = (canonicalPath: string) => boolean;

/**
 * 递归遍历自由对象（props / action params）。canonical 路径数组段写作 `[*]`
 * （与注册表模式一致）；display 路径为 JSON Pointer 形态、数组为真实下标。
 */
/** Parse a whole-field translation reference after YAML decoding. */
function parseShorthand(value: string, path: string): TranslationDescriptor {
  const invalid = () => new I18nError('I18N_DESCRIPTOR_INVALID', `无效的国际化简写: ${path}`, { path });
  const colon = value.indexOf(':', 6);
  if (!value.startsWith('$i18n{') || colon < 7) throw invalid();
  const key = value.slice(6, colon);
  if (!isValidMessageKey(key) || /[{}\\]/.test(key)) throw invalid();
  let fallback = '';
  for (let i = colon + 1; i < value.length; i++) {
    const char = value[i]!;
    if (char === '}') {
      if (i !== value.length - 1 || fallback.includes('${')) throw invalid();
      return { key, fallback };
    }
    if (char === '\\') {
      const next = value[++i];
      if (next !== '}' && next !== '\\') throw invalid();
      fallback += next;
    } else fallback += char;
  }
  throw invalid();
}

function walkValue(
  ctx: LocalizeContext,
  value: unknown,
  canonical: string,
  display: string,
  isTranslatable: TranslatableMatcher,
): unknown {
  if (typeof value === 'string' && value.startsWith('$i18n{')) {
    if (!isTranslatable(canonical)) throw new I18nError('UNREGISTERED_I18N_FIELD', `未注册的可翻译字段: ${display}`, { path: display });
    return convertDescriptor(ctx, parseShorthand(value, display), undefined, display);
  }
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 1) {
      value[i] = walkValue(ctx, value[i], `${canonical}[*]`, `${display}/${i}`, isTranslatable);
    }
    return value;
  }
  if (isPlainObject(value)) {
    if (typeof value['type'] === 'string' && isPlainObject(value['props'])) {
      walkNode(ctx, value, display);
      return value;
    }
    if (typeof value['action'] === 'string') {
      walkAction(ctx, value, display);
      return value;
    }
    if ('$i18n' in value) {
      if (!isTranslatable(canonical)) {
        throw new I18nError(
          'UNREGISTERED_I18N_FIELD',
          `未注册的可翻译字段出现 $i18n（不静默忽略）: ${display}`,
          { path: display, field: canonical },
        );
      }
      return convertDescriptor(ctx, assertDescriptor(value['$i18n'], display), undefined, display);
    }
    for (const key of Object.keys(value)) {
      value[key] = walkValue(
        ctx,
        value[key],
        `${canonical}.${key}`,
        `${display}/${escapeJsonPointerSegment(key)}`,
        isTranslatable,
      );
    }
    return value;
  }
  return value;
}

function walkAction(ctx: LocalizeContext, action: unknown, display: string): void {
  if (!isPlainObject(action)) {
    return;
  }
  const name = typeof action['action'] === 'string' ? (action['action'] as string) : undefined;
  if (action['params'] !== undefined) {
    action['params'] = walkValue(ctx, action['params'], 'params', `${display}/params`, (p) =>
      name !== undefined ? ctx.registry.isTranslatableActionField(name, p) : false,
    );
  }
}

function walkActions(ctx: LocalizeContext, value: unknown, display: string): void {
  if (Array.isArray(value)) {
    value.forEach((action, index) => walkAction(ctx, action, `${display}/${index}`));
  } else {
    walkAction(ctx, value, display);
  }
}

/** 解析节点实际组件 type；引用节点经页面级命名组件定义解析 */
function resolveNodeType(ctx: LocalizeContext, node: Record<string, unknown>): string | undefined {
  if (typeof node['type'] === 'string') {
    return node['type'];
  }
  if (typeof node['component'] === 'string') {
    const def = ctx.namedComponents?.[node['component']];
    if (isPlainObject(def) && !isDslSourceRef(def) && typeof def['type'] === 'string') {
      return def['type'];
    }
  }
  return undefined;
}

function walkNode(ctx: LocalizeContext, node: unknown, display: string): void {
  if (!isPlainObject(node)) {
    return;
  }
  if (isDslSourceRef(node)) {
    if (node.placeholder !== undefined) {
      walkNode(ctx, node.placeholder, `${display}/placeholder`);
    }
    return;
  }
  const type = resolveNodeType(ctx, node);
  if (node['props'] !== undefined) {
    node['props'] = walkValue(ctx, node['props'], 'props', `${display}/props`, (p) =>
      ctx.registry.isTranslatable(type, p),
    );
  }
  if (isPlainObject(node['events'])) {
    for (const [event, actions] of Object.entries(node['events'])) {
      walkActions(ctx, actions, `${display}/events/${escapeJsonPointerSegment(event)}`);
    }
  }
  if (Array.isArray(node['children'])) {
    node['children'].forEach((child, index) => walkNode(ctx, child, `${display}/children/${index}`));
  } else if (node['children'] !== undefined) {
    walkNode(ctx, node['children'], `${display}/children`);
  }
}

function dedupeLocales(locales: readonly string[]): string[] {
  return [...new Set(locales)];
}

/**
 * 输出残留扫描（兜底）：walkNode 只下钻 props/events/children/placeholder，
 * 位于遍历范围之外（state、dataSources、meta、node.permission、node.when 等）的
 * `$i18n` 既不可转换也不应静默透传——任何残留 `$i18n` 键抛 UNREGISTERED_I18N_FIELD。
 * `$localizedText` 是合法下发态值，不受影响（其 params 内嵌 `$i18n` 属协议违规，同样拒绝）。
 */
function assertNoResidualI18n(value: unknown, display: string): void {
  if (typeof value === 'string' && value.startsWith('$i18n{')) {
    throw new I18nError('UNREGISTERED_I18N_FIELD', `国际化简写出现在不可翻译的位置: ${display}`, { path: display });
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoResidualI18n(item, `${display}/${index}`));
    return;
  }
  if (isPlainObject(value)) {
    if ('$i18n' in value) {
      throw new I18nError(
        'UNREGISTERED_I18N_FIELD',
        `$i18n 出现在不可翻译的位置（不静默透传）: ${display}`,
        { path: display },
      );
    }
    for (const [key, child] of Object.entries(value)) {
      assertNoResidualI18n(child, `${display}/${escapeJsonPointerSegment(key)}`);
    }
  }
}

/**
 * 纯转换入口（设计第 6 节签名）。返回已本地化的新 Page DSL 对象，
 * 不修改输入（page / languageBundles 均不被改写）；作者态 `i18n` 字段被移除。
 */
export function localizePageDsl(input: LocalizePageDslInput): PageDsl {
  const { locale, defaultLocale } = input;
  if (typeof locale !== 'string' || locale === '') {
    throw new I18nError('INVALID_LOCALE', 'localizePageDsl 缺少有效 locale');
  }
  if (typeof defaultLocale !== 'string' || defaultLocale === '') {
    throw new I18nError('INVALID_LOCALE', 'localizePageDsl 缺少有效 defaultLocale');
  }

  const page = deepClone(input.page);
  const fallbacks = input.languageBundles.fallbacks ?? [];
  const bundleChain = [input.languageBundles.current, ...fallbacks];
  const localeChain = dedupeLocales([locale, ...fallbacks.map((set) => set.locale), defaultLocale]);

  const ctx: LocalizeContext = {
    locale,
    defaultLocale,
    localeChain,
    bundleChain,
    registry: input.registry ?? getDefaultTranslatableFieldRegistry(),
    namedComponents: isPlainObject(page.components) ? (page.components as Record<string, unknown>) : undefined,
    onDiagnostic: input.onDiagnostic,
  };

  if (isPlainObject(page.i18n) && 'bindings' in page.i18n) {
    throw new I18nError('I18N_DESCRIPTOR_INVALID', 'i18n.bindings 已移除，请使用字段内简写');
  }
  delete page.i18n;
  if (isPlainObject(page.page)) {
    for (const field of ['title', 'description']) {
      const value = page.page[field];
      if (typeof value === 'string' && value.startsWith('$i18n{')) {
        page.page[field] = convertDescriptor(ctx, parseShorthand(value, `/page/${field}`), undefined, `/page/${field}`);
      }
    }
  }

  // 2. 遍历 UI 树 / 命名组件 / 页面级动作与生命周期
  if (page.body !== undefined) {
    walkNode(ctx, page.body, '/body');
  }
  if (page.children !== undefined) {
    if (Array.isArray(page.children)) {
      page.children.forEach((child, index) => walkNode(ctx, child, `/children/${index}`));
    } else {
      walkNode(ctx, page.children, '/children');
    }
  }
  if (isPlainObject(page.components)) {
    for (const [name, def] of Object.entries(page.components)) {
      walkNode(ctx, def, `/components/${escapeJsonPointerSegment(name)}`);
    }
  }
  if (isPlainObject(page.actions)) {
    for (const [name, actions] of Object.entries(page.actions)) {
      walkActions(ctx, actions, `/actions/${escapeJsonPointerSegment(name)}`);
    }
  }
  if (isPlainObject(page.lifecycle)) {
    for (const [event, actions] of Object.entries(page.lifecycle)) {
      walkActions(ctx, actions, `/lifecycle/${escapeJsonPointerSegment(event)}`);
    }
  }

  // 3. 残留扫描：遍历范围之外的 $i18n 不静默透传
  assertNoResidualI18n(page, '');

  return page;
}
