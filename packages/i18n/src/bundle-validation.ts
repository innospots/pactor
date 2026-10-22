import type { MessageBundle, MessageBundleSet } from '@pactor-app/core';

import { I18nError, type I18nErrorCode } from './errors.js';

/** 词条键名：非空、点分段、分段内不含空白与点 */
const MESSAGE_KEY_RE = /^[^\s.]+(?:\.[^\s.]+)*$/;

export function isValidMessageKey(key: string): boolean {
  return MESSAGE_KEY_RE.test(key);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * 校验扁平词条表：顶层必须为普通对象，键名合法，值全部为字符串。
 * 不合法时抛出指定 code 的 I18nError。
 */
export function assertMessages(
  value: unknown,
  context: string,
  code: I18nErrorCode,
): Record<string, string> {
  if (!isPlainObject(value)) {
    throw new I18nError(code, `${context}: 语言包必须是扁平键值对象`);
  }
  for (const [key, entry] of Object.entries(value)) {
    if (!isValidMessageKey(key)) {
      throw new I18nError(code, `${context}: 非法词条键名: ${key}`, { key });
    }
    if (typeof entry !== 'string') {
      throw new I18nError(code, `${context}: 词条值必须是字符串: ${key}`, {
        key,
        valueType: Array.isArray(entry) ? 'array' : typeof entry,
      });
    }
  }
  return value as Record<string, string>;
}

/** namespace 间完整 key 冲突检查（结果与 namespace 遍历顺序无关） */
export function assertNoCrossNamespaceKeyConflicts(
  bundles: Record<string, Record<string, string>>,
  code: I18nErrorCode,
): void {
  const owners = new Map<string, string[]>();
  for (const [namespace, messages] of Object.entries(bundles)) {
    for (const key of Object.keys(messages)) {
      const list = owners.get(key);
      if (list === undefined) {
        owners.set(key, [namespace]);
      } else {
        list.push(namespace);
      }
    }
  }
  const conflicts = [...owners.entries()].filter(([, list]) => list.length > 1);
  if (conflicts.length > 0) {
    const [key, namespaces] = conflicts[0]!;
    throw new I18nError(
      code,
      `不同 namespace 定义了相同完整 key: ${key}（${[...namespaces].sort().join(', ')}）`,
      { key, namespaces: [...namespaces].sort() },
    );
  }
}

export interface EnvelopeExpectation {
  appId: string;
  locale: string;
  release: string;
  namespaces: readonly string[];
}

/**
 * 校验语言包 API 的 JSON envelope（设计 6.1）。
 * 结构/协议字段问题抛 MESSAGE_PROTOCOL_ERROR；缺失请求的 namespace 抛 NAMESPACE_NOT_FOUND。
 */
export function validateBundleSetEnvelope(
  data: unknown,
  expected: EnvelopeExpectation,
): MessageBundleSet {
  if (!isPlainObject(data)) {
    throw new I18nError('MESSAGE_PROTOCOL_ERROR', '语言包响应必须是 JSON 对象 envelope');
  }
  for (const field of ['appId', 'locale', 'release'] as const) {
    if (typeof data[field] !== 'string' || data[field] === '') {
      throw new I18nError('MESSAGE_PROTOCOL_ERROR', `envelope 缺少字段 ${field}`);
    }
    if (data[field] !== expected[field]) {
      throw new I18nError(
        'MESSAGE_PROTOCOL_ERROR',
        `envelope.${field} 与请求不一致: ${String(data[field])} !== ${expected[field]}`,
        { field, actual: data[field], expected: expected[field] },
      );
    }
  }
  if (data['format'] !== 'simple-v1') {
    throw new I18nError('MESSAGE_PROTOCOL_ERROR', `不支持的语言包 format: ${String(data['format'])}`, {
      format: data['format'],
    });
  }
  const rawBundles = data['bundles'];
  if (!isPlainObject(rawBundles)) {
    throw new I18nError('MESSAGE_PROTOCOL_ERROR', 'envelope.bundles 必须是对象');
  }
  const bundles: Record<string, MessageBundle> = {};
  for (const [namespace, rawBundle] of Object.entries(rawBundles)) {
    if (!isPlainObject(rawBundle)) {
      throw new I18nError(
        'MESSAGE_PROTOCOL_ERROR',
        `envelope.bundles.${namespace} 必须是对象（语言包 API 不返回 YAML 字符串）`,
        { namespace },
      );
    }
    if (typeof rawBundle['version'] !== 'string' || rawBundle['version'] === '') {
      throw new I18nError('MESSAGE_PROTOCOL_ERROR', `envelope.bundles.${namespace} 缺少 version`, {
        namespace,
      });
    }
    bundles[namespace] = {
      version: rawBundle['version'],
      messages: assertMessages(
        rawBundle['messages'],
        `envelope.bundles.${namespace}`,
        'MESSAGE_PROTOCOL_ERROR',
      ),
    };
  }
  for (const namespace of expected.namespaces) {
    if (!(namespace in bundles)) {
      throw new I18nError('NAMESPACE_NOT_FOUND', `语言包响应缺失 namespace: ${namespace}`, {
        namespace,
      });
    }
  }
  assertNoCrossNamespaceKeyConflicts(
    Object.fromEntries(Object.entries(bundles).map(([ns, b]) => [ns, b.messages])),
    'MESSAGE_PROTOCOL_ERROR',
  );
  return {
    appId: expected.appId,
    locale: expected.locale,
    release: expected.release,
    format: 'simple-v1',
    bundles,
  };
}
