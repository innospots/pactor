import type { MessageBundleSet } from '@pactor-app/core';

import { validateBundleSetEnvelope } from './bundle-validation.js';
import { I18nError } from './errors.js';
import type { LoadMessagesInput, MessageProvider } from './message-provider.js';

/** 浏览器/Node 中立的 fetch 响应形态 */
export interface FetchLikeResponse {
  status: number;
  headers: { get(name: string): string | null };
  text(): Promise<string>;
}

/** 注入的 fetch 风格函数 */
export type FetchLike = (
  url: string,
  init?: { headers?: Record<string, string> },
) => Promise<FetchLikeResponse>;

export interface ApiMessageProviderOptions {
  /** 语言包 API 地址，来自服务端应用配置，不接受浏览器任意指定 */
  endpoint: string;
  fetch: FetchLike;
  /** 服务端凭据等附加请求头（如 Authorization） */
  headers?: Record<string, string>;
}

/** load 扩展输入：可显式传入缓存的 ETag */
export interface ApiLoadInput extends LoadMessagesInput {
  etag?: string;
}

/** 携带缓存信息的加载结果 */
export interface ApiLoadResult {
  bundleSet: MessageBundleSet;
  etag?: string;
  /** 304 复用已校验缓存包时为 true */
  notModified: boolean;
}

interface CacheEntry {
  etag?: string;
  bundleSet: MessageBundleSet;
}

function cacheKeyOf(input: LoadMessagesInput): string {
  return [
    input.appId,
    input.tenantId ?? '',
    input.locale,
    [...input.namespaces].sort().join(','),
    input.release,
  ].join('\n');
}

function buildUrl(endpoint: string, input: LoadMessagesInput): string {
  const params: Array<[string, string]> = [
    ['appId', input.appId],
    ['locale', input.locale],
    ['namespaces', input.namespaces.join(',')],
    ['release', input.release],
  ];
  if (input.tenantId !== undefined) {
    params.push(['tenantId', input.tenantId]);
  }
  const query = params.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
  return `${endpoint}${endpoint.includes('?') ? '&' : '?'}${query}`;
}

const JSON_CONTENT_TYPE_RE = /^\s*application\/json\s*(?:;|$)/i;

/**
 * 语言包 API Provider（设计 6.0.3 / 6.1）。
 *
 * 校验 HTTP 状态与 Content-Type（必须 application/json）、解析 JSON、
 * 校验 envelope 协议字段与 format；返回 YAML 或内嵌 YAML 字符串按
 * MESSAGE_PROTOCOL_ERROR 处理，不切换解析方式。
 *
 * ETag / If-None-Match：provider 内部按缓存键（appId/tenant/locale/
 * namespaces/release）记录最近校验通过的包及其 ETag；304 时复用该缓存，
 * 结果携带 notModified 标记。也可通过 load 输入的 etag 显式指定。
 */
export class ApiMessageProvider implements MessageProvider {
  private readonly options: ApiMessageProviderOptions;
  private readonly cache = new Map<string, CacheEntry>();

  constructor(options: ApiMessageProviderOptions) {
    this.options = options;
  }

  /** MessageProvider 契约实现 */
  async load(input: ApiLoadInput): Promise<MessageBundleSet> {
    const result = await this.loadWithCacheInfo(input);
    return result.bundleSet;
  }

  /** 加载并返回缓存信息（ETag / notModified） */
  async loadWithCacheInfo(input: ApiLoadInput): Promise<ApiLoadResult> {
    const key = cacheKeyOf(input);
    const cached = this.cache.get(key);
    const etag = input.etag ?? cached?.etag;

    const headers: Record<string, string> = { ...this.options.headers };
    if (etag !== undefined) {
      headers['If-None-Match'] = etag;
    }

    let response: FetchLikeResponse;
    try {
      response = await this.options.fetch(buildUrl(this.options.endpoint, input), { headers });
    } catch (error) {
      throw new I18nError('MESSAGE_FETCH_FAILED', '语言包请求失败', {
        cause: error instanceof Error ? error.message : String(error),
      });
    }

    if (response.status === 304) {
      if (cached !== undefined) {
        return { bundleSet: cached.bundleSet, etag: cached.etag, notModified: true };
      }
      throw new I18nError('MESSAGE_PROTOCOL_ERROR', '收到 304 但没有可复用的已校验缓存包');
    }
    if (response.status !== 200) {
      throw new I18nError('MESSAGE_FETCH_FAILED', `语言包接口返回 HTTP ${response.status}`, {
        status: response.status,
      });
    }

    const contentType = response.headers.get('content-type');
    if (contentType === null || !JSON_CONTENT_TYPE_RE.test(contentType)) {
      throw new I18nError(
        'MESSAGE_PROTOCOL_ERROR',
        `语言包接口 Content-Type 必须是 application/json，实际: ${contentType ?? '(缺失)'}`,
        { contentType },
      );
    }

    const text = await response.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      throw new I18nError(
        'MESSAGE_PROTOCOL_ERROR',
        '语言包响应不是合法 JSON（协议不返回 YAML 原文或内嵌 YAML 字符串）',
      );
    }

    const bundleSet = validateBundleSetEnvelope(data, input);
    const newEtag = response.headers.get('etag') ?? undefined;
    this.cache.set(key, { etag: newEtag, bundleSet });
    return { bundleSet, etag: newEtag, notModified: false };
  }
}
