import { isMap, isPair, isScalar, isSeq, parseDocument } from 'yaml';

import type { MessageBundle, MessageBundleSet } from '@pactor-app/core';

import { assertMessages, assertNoCrossNamespaceKeyConflicts } from './bundle-validation.js';
import { I18nError } from './errors.js';
import type { LoadMessagesInput, MessageProvider } from './message-provider.js';

/** manifest 中单个 namespace 的条目：文件相对路径与内容版本 */
export interface MessageManifestEntry {
  path: string;
  version: string;
}

/**
 * 语言包发布清单（设计 6.0.2）：记录应用、release、语言、namespace、
 * 文件相对路径和内容版本。文件路径只从该受信任清单取得。
 */
export interface MessageManifest {
  appId: string;
  release: string;
  /** locale → namespace → 条目 */
  locales: Record<string, Record<string, MessageManifestEntry>>;
}

export interface YamlMessageProviderOptions {
  /** 清单普通对象（构造时校验结构） */
  manifest: unknown;
  /** 注入的文件读取函数（Node 适配由应用端提供），参数为清单中的相对路径 */
  readFile: (path: string) => Promise<string>;
  /** 单文件大小上限（字节），默认 1MB */
  maxFileBytes?: number;
  /** YAML 别名展开上限，默认 100 */
  maxAliasCount?: number;
}

const DEFAULT_MAX_FILE_BYTES = 1_000_000;
const DEFAULT_MAX_ALIAS_COUNT = 100;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** 清单路径必须是相对路径且不含 .. 段 */
function isSafeRelativePath(path: string): boolean {
  const normalized = path.replace(/\\/g, '/');
  return (
    normalized !== '' &&
    !normalized.startsWith('/') &&
    !/^[A-Za-z]:\//.test(normalized) &&
    !normalized.split('/').includes('..')
  );
}

/** 校验 manifest 结构；非法抛 MANIFEST_INVALID */
export function validateManifest(manifest: unknown): MessageManifest {
  if (!isPlainObject(manifest)) {
    throw new I18nError('MANIFEST_INVALID', '语言包清单必须是对象');
  }
  if (typeof manifest['appId'] !== 'string' || manifest['appId'] === '') {
    throw new I18nError('MANIFEST_INVALID', '清单缺少 appId');
  }
  if (typeof manifest['release'] !== 'string' || manifest['release'] === '') {
    throw new I18nError('MANIFEST_INVALID', '清单缺少 release');
  }
  const locales = manifest['locales'];
  if (!isPlainObject(locales)) {
    throw new I18nError('MANIFEST_INVALID', '清单缺少 locales');
  }
  for (const [locale, namespaces] of Object.entries(locales)) {
    if (!isPlainObject(namespaces)) {
      throw new I18nError('MANIFEST_INVALID', `清单 locales.${locale} 必须是对象`);
    }
    for (const [namespace, entry] of Object.entries(namespaces)) {
      if (
        !isPlainObject(entry) ||
        typeof entry['path'] !== 'string' ||
        typeof entry['version'] !== 'string'
      ) {
        throw new I18nError('MANIFEST_INVALID', `清单条目缺少 path/version: ${locale}/${namespace}`);
      }
      if (!isSafeRelativePath(entry['path'])) {
        throw new I18nError('MANIFEST_INVALID', `清单条目路径必须是安全相对路径: ${entry['path']}`, {
          locale,
          namespace,
        });
      }
    }
  }
  return manifest as unknown as MessageManifest;
}

/** UTF-8 字节长度（lib 为 ES2020 且无 DOM/@types/node，不依赖 TextEncoder/Buffer） */
function byteLength(text: string): number {
  let bytes = 0;
  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i);
    if (code < 0x80) {
      bytes += 1;
    } else if (code < 0x800) {
      bytes += 2;
    } else if (code >= 0xd800 && code <= 0xdbff && i + 1 < text.length) {
      bytes += 4;
      i += 1;
    } else {
      bytes += 3;
    }
  }
  return bytes;
}

/** 检测文档中显式标注的自定义标签（普通节点 tag 为 undefined）；供页面 YAML 严格解析复用 */
export function hasExplicitTag(node: unknown): boolean {
  if (isPair(node)) {
    return hasExplicitTag(node.key) || hasExplicitTag(node.value);
  }
  if (isMap(node) || isSeq(node)) {
    return node.tag !== undefined || node.items.some(hasExplicitTag);
  }
  if (isScalar(node)) {
    return node.tag !== undefined;
  }
  return false;
}

/**
 * 本地 YAML 语言包 Provider（设计 6.0.2），仅用于 Node 入口
 * （`@pactor-app/i18n/node`，依赖 peerDependency `yaml`）。
 *
 * 按 manifest 定位 locale/namespace 文件并严格解析：语法错误、重复 key、
 * 自定义标签、非字符串词条、超出大小/别名展开限制均拒绝；加载后检查
 * namespace 间完整 key 冲突；输出与 API 来源相同的 MessageBundleSet。
 */
export class YamlMessageProvider implements MessageProvider {
  private readonly manifest: MessageManifest;
  private readonly readFile: (path: string) => Promise<string>;
  private readonly maxFileBytes: number;
  private readonly maxAliasCount: number;

  constructor(options: YamlMessageProviderOptions) {
    this.manifest = validateManifest(options.manifest);
    this.readFile = options.readFile;
    this.maxFileBytes = options.maxFileBytes ?? DEFAULT_MAX_FILE_BYTES;
    this.maxAliasCount = options.maxAliasCount ?? DEFAULT_MAX_ALIAS_COUNT;
  }

  async load(input: LoadMessagesInput): Promise<MessageBundleSet> {
    if (input.appId !== this.manifest.appId || input.release !== this.manifest.release) {
      throw new I18nError('MANIFEST_MISMATCH', '请求 appId/release 与语言包清单不一致', {
        appId: input.appId,
        release: input.release,
        manifestAppId: this.manifest.appId,
        manifestRelease: this.manifest.release,
      });
    }
    const localeEntries = this.manifest.locales[input.locale];
    if (localeEntries === undefined) {
      throw new I18nError('NAMESPACE_NOT_FOUND', `清单不含语言: ${input.locale}`, {
        locale: input.locale,
      });
    }

    const bundles: Record<string, MessageBundle> = {};
    for (const namespace of input.namespaces) {
      const entry = localeEntries[namespace];
      if (entry === undefined) {
        throw new I18nError(
          'NAMESPACE_NOT_FOUND',
          `清单不含 namespace: ${input.locale}/${namespace}`,
          { locale: input.locale, namespace },
        );
      }
      bundles[namespace] = {
        version: entry.version,
        messages: await this.loadBundle(entry.path, namespace),
      };
    }

    assertNoCrossNamespaceKeyConflicts(
      Object.fromEntries(Object.entries(bundles).map(([ns, b]) => [ns, b.messages])),
      'MESSAGE_BUNDLE_INVALID',
    );

    return {
      appId: this.manifest.appId,
      locale: input.locale,
      release: this.manifest.release,
      format: 'simple-v1',
      bundles,
    };
  }

  /** 读取并严格解析单个语言包 YAML 文件 */
  private async loadBundle(path: string, namespace: string): Promise<Record<string, string>> {
    let text: string;
    try {
      text = await this.readFile(path);
    } catch (error) {
      throw new I18nError('MESSAGE_FETCH_FAILED', `语言包文件读取失败: ${path}`, {
        path,
        cause: error instanceof Error ? error.message : String(error),
      });
    }
    const context = `语言包 ${namespace}（${path}）`;

    if (byteLength(text) > this.maxFileBytes) {
      throw new I18nError('MESSAGE_BUNDLE_INVALID', `${context}: 超出大小限制 ${this.maxFileBytes} 字节`, {
        path,
        maxFileBytes: this.maxFileBytes,
      });
    }

    const doc = parseDocument(text, {
      schema: 'core',
      uniqueKeys: true,
      strict: true,
    });
    if (doc.errors.length > 0) {
      throw new I18nError(
        'MESSAGE_BUNDLE_INVALID',
        `${context}: YAML 解析失败: ${doc.errors.map((e) => e.message).join('; ')}`,
        { path },
      );
    }
    if (hasExplicitTag(doc.contents)) {
      throw new I18nError('MESSAGE_BUNDLE_INVALID', `${context}: 不允许自定义标签`, { path });
    }

    let data: unknown;
    try {
      data = doc.toJS({ maxAliasCount: this.maxAliasCount });
    } catch (error) {
      throw new I18nError(
        'MESSAGE_BUNDLE_INVALID',
        `${context}: ${error instanceof Error ? error.message : String(error)}`,
        { path },
      );
    }

    return assertMessages(data, context, 'MESSAGE_BUNDLE_INVALID');
  }
}
