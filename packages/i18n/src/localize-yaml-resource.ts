import { parseDocument } from 'yaml';

import type { LocalizationMeta, MessageBundleSet, PageDsl } from '@pactor-app/core';
import { validateAuthorPageDsl, validateLocalizedPageDsl } from '@pactor-app/schema';

import {
  localizePageDsl,
  type AuthorPageDsl,
  type LocalizeDiagnostic,
} from './dsl-localizer.js';
import { I18nError, isI18nError } from './errors.js';
import type { MessageProvider } from './message-provider.js';
import type { TranslatableFieldRegistry } from './translatable-field-registry.js';
import { hasExplicitTag } from './yaml-message-provider.js';

/**
 * YAML 资源转换编排入口（设计 6.0.2，缺口 G18），仅 Node 入口导出
 * （页面 YAML 严格解析依赖 peerDependency `yaml`）。
 *
 * 流程：加载文本 → 严格解析 → 作者态校验（@pactor-app/schema）→
 * 可选裁剪钩子 → 提取 namespaces → Provider 批量加载当前语言与回退语言包 →
 * localizePageDsl → 下发态校验 → 返回 `{ schema, localization }`。
 * 一次请求内语言包经一次 Promise.all 批量获取，不在遍历组件时逐个请求。
 */

export interface ParsePageYamlOptions {
  /** YAML 别名展开上限，默认 100 */
  maxAliasCount?: number;
}

/**
 * 页面 YAML 严格解析：语法错误、重复 key、自定义标签、超出别名展开限制
 * 均抛 PAGE_YAML_INVALID。可作为 localizeYamlResource 的 parseYaml 直接使用。
 */
export function parsePageYamlStrict(text: string, options?: ParsePageYamlOptions): unknown {
  const doc = parseDocument(text, {
    schema: 'core',
    uniqueKeys: true,
    strict: true,
  });
  if (doc.errors.length > 0) {
    throw new I18nError(
      'PAGE_YAML_INVALID',
      `页面 YAML 解析失败: ${doc.errors.map((e) => e.message).join('; ')}`,
    );
  }
  if (hasExplicitTag(doc.contents)) {
    throw new I18nError('PAGE_YAML_INVALID', '页面 YAML 不允许自定义标签');
  }
  try {
    return doc.toJS({ maxAliasCount: options?.maxAliasCount ?? 100 });
  } catch (error) {
    throw new I18nError(
      'PAGE_YAML_INVALID',
      `页面 YAML 无效: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export interface LocalizeYamlResourceInput {
  /** 加载页面 YAML 原文（本地文件或后端接口，由调用方注入） */
  loadText: () => Promise<string>;
  /** 注入的严格 YAML 解析；缺省为 parsePageYamlStrict */
  parseYaml?: (text: string) => unknown;
  /** 语言包 Provider（YamlMessageProvider / ApiMessageProvider 均可） */
  provider: MessageProvider;
  appId: string;
  /** 来自服务端可信上下文 */
  tenantId?: string;
  release: string;
  locale: string;
  defaultLocale: string;
  /** 显式语言级回退（有序，如 fr-CA → ['fr']），位于当前语言与 defaultLocale 之间 */
  fallbackLocales?: string[];
  registry?: TranslatableFieldRegistry;
  /** 可选会话裁剪钩子：在作者态校验后、提取 namespaces 前执行 */
  prune?: (page: AuthorPageDsl) => AuthorPageDsl;
  /** localization 元信息透传（来自 resolveRequestLocale 结果） */
  source?: string;
  explicit?: boolean;
  onDiagnostic?: (diagnostic: LocalizeDiagnostic) => void;
}

export interface LocalizeYamlResourceResult {
  /** 已本地化并通过下发态校验的 Page DSL */
  schema: PageDsl;
  localization: LocalizationMeta;
}

function emptyBundleSet(appId: string, locale: string, release: string): MessageBundleSet {
  return { appId, locale, release, format: 'simple-v1', bundles: {} };
}

export async function localizeYamlResource(
  input: LocalizeYamlResourceInput,
): Promise<LocalizeYamlResourceResult> {
  // 1. 加载文本
  let text: string;
  try {
    text = await input.loadText();
  } catch (error) {
    throw new I18nError('PAGE_LOAD_FAILED', '页面资源加载失败', {
      cause: error instanceof Error ? error.message : String(error),
    });
  }

  // 2. 严格解析
  const parse = input.parseYaml ?? ((value: string) => parsePageYamlStrict(value));
  let document: unknown;
  try {
    document = parse(text);
  } catch (error) {
    if (isI18nError(error)) {
      throw error;
    }
    throw new I18nError(
      'PAGE_YAML_INVALID',
      `页面 YAML 解析失败: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  // 3. 作者态校验
  const author = validateAuthorPageDsl(document);
  if (!author.valid) {
    throw new I18nError('PAGE_DSL_INVALID', '作者态页面校验失败', { errors: author.errors });
  }

  // 4. 可选会话裁剪
  const pruned = input.prune ? input.prune(document as AuthorPageDsl) : (document as AuthorPageDsl);

  // 5. 提取 namespaces
  const namespaces = pruned.i18n?.namespaces ?? [];

  // 6. 语言包链：当前 locale → 显式语言级回退 → defaultLocale（去重保序），一次性批量加载
  const chain = [...new Set([input.locale, ...(input.fallbackLocales ?? []), input.defaultLocale])];
  let current: MessageBundleSet;
  let fallbacks: MessageBundleSet[];
  if (namespaces.length === 0) {
    // 无语言包声明：不触发 Provider 请求，合成空包保证 locale 链完整（内联 messages 仍可回退）
    [current, ...fallbacks] = chain.map((loc) => emptyBundleSet(input.appId, loc, input.release));
  } else {
    const loaded = await Promise.all(
      chain.map((loc) =>
        input.provider.load({
          appId: input.appId,
          tenantId: input.tenantId,
          locale: loc,
          namespaces,
          release: input.release,
        }),
      ),
    );
    [current, ...fallbacks] = loaded as [MessageBundleSet, ...MessageBundleSet[]];
  }

  // 7. 纯转换
  const schema = localizePageDsl({
    page: pruned,
    locale: input.locale,
    defaultLocale: input.defaultLocale,
    languageBundles: { current: current!, fallbacks },
    registry: input.registry,
    onDiagnostic: input.onDiagnostic,
  });

  // 8. 下发态校验
  const localized = validateLocalizedPageDsl(schema);
  if (!localized.valid) {
    throw new I18nError('PAGE_DSL_INVALID', '下发态页面校验失败', { errors: localized.errors });
  }

  // 9. 组装返回
  const bundleVersions = Object.fromEntries(
    Object.entries(current!.bundles).map(([namespace, bundle]) => [namespace, bundle.version]),
  );
  const localization: LocalizationMeta = {
    locale: input.locale,
    defaultLocale: input.defaultLocale,
    release: input.release,
    bundleVersions,
    ...(input.source !== undefined ? { source: input.source } : {}),
    ...(input.explicit !== undefined ? { explicit: input.explicit } : {}),
  };
  return { schema, localization };
}
