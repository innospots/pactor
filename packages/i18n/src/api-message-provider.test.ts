import { describe, expect, it, vi } from 'vitest';

import {
  ApiMessageProvider,
  type ApiMessageProviderOptions,
  type FetchLike,
  type FetchLikeResponse,
} from './api-message-provider.js';
import { I18nError } from './errors.js';
import type { MessageProvider } from './message-provider.js';

const loadInput = {
  appId: 'console',
  locale: 'en-US',
  namespaces: ['common', 'user'],
  release: 'rel-20261022-01',
};

const validEnvelope = {
  appId: 'console',
  locale: 'en-US',
  release: 'rel-20261022-01',
  format: 'simple-v1',
  bundles: {
    common: { version: '12', messages: { 'common.save': 'Save' } },
    user: { version: '7', messages: { 'user.selectedCount': 'Selected: {{count}}' } },
  },
};

function makeResponse(
  status: number,
  body: string,
  headers: Record<string, string> = { 'content-type': 'application/json' },
): FetchLikeResponse {
  return {
    status,
    headers: { get: (name: string) => headers[name.toLowerCase()] ?? null },
    text: async () => body,
  };
}

function createProvider(
  handler: (url: string, init?: { headers?: Record<string, string> }) => Promise<FetchLikeResponse>,
  options?: Partial<ApiMessageProviderOptions>,
) {
  const fetchFn = vi.fn(handler) as unknown as FetchLike;
  const provider = new ApiMessageProvider({
    endpoint: 'https://language-service.example/v1/i18n/bundles',
    fetch: fetchFn,
    ...options,
  });
  return { provider, fetchFn: fetchFn as unknown as ReturnType<typeof vi.fn> };
}

describe('ApiMessageProvider 200', () => {
  it('校验并返回规范化 MessageBundleSet，记录 ETag', async () => {
    const { provider, fetchFn } = createProvider(async () =>
      makeResponse(200, JSON.stringify(validEnvelope), {
        'content-type': 'application/json; charset=utf-8',
        etag: '"v12"',
      }),
    );
    const providerAsContract: MessageProvider = provider;
    const result = await providerAsContract.load(loadInput);
    expect(result).toEqual(validEnvelope);

    const [url, init] = fetchFn.mock.calls[0] as [string, { headers?: Record<string, string> }];
    expect(url).toContain('appId=console');
    expect(url).toContain('locale=en-US');
    expect(url).toContain('namespaces=common%2Cuser');
    expect(url).toContain('release=rel-20261022-01');
    expect(init?.headers?.['If-None-Match']).toBeUndefined();

    const info = await provider.loadWithCacheInfo(loadInput);
    expect(info.notModified).toBe(false);
    expect(info.etag).toBe('"v12"');
  });

  it('带租户与自定义请求头时透传', async () => {
    const { provider, fetchFn } = createProvider(
      async () => makeResponse(200, JSON.stringify(validEnvelope)),
      { headers: { Authorization: 'Bearer token' } },
    );
    await provider.load({ ...loadInput, tenantId: 't-1' });
    const [url, init] = fetchFn.mock.calls[0] as [string, { headers?: Record<string, string> }];
    expect(url).toContain('tenantId=t-1');
    expect(init?.headers?.Authorization).toBe('Bearer token');
  });
});

describe('ApiMessageProvider ETag / 304', () => {
  it('304 时复用同一缓存键的已校验包并携带 notModified', async () => {
    let call = 0;
    const { provider, fetchFn } = createProvider(async () => {
      call += 1;
      return call === 1
        ? makeResponse(200, JSON.stringify(validEnvelope), {
            'content-type': 'application/json',
            etag: '"v12"',
          })
        : makeResponse(304, '');
    });
    const first = await provider.loadWithCacheInfo(loadInput);
    expect(first).toMatchObject({ notModified: false, etag: '"v12"' });

    const second = await provider.loadWithCacheInfo(loadInput);
    expect(second.notModified).toBe(true);
    expect(second.bundleSet).toEqual(validEnvelope);

    const [, init] = fetchFn.mock.calls[1] as [string, { headers?: Record<string, string> }];
    expect(init?.headers?.['If-None-Match']).toBe('"v12"');
  });

  it('调用方显式传入 etag 时用于 If-None-Match', async () => {
    const { provider, fetchFn } = createProvider(async () =>
      makeResponse(200, JSON.stringify(validEnvelope)),
    );
    await provider.load({ ...loadInput, etag: '"from-caller"' });
    const [, init] = fetchFn.mock.calls[0] as [string, { headers?: Record<string, string> }];
    expect(init?.headers?.['If-None-Match']).toBe('"from-caller"');
  });

  it('304 但无可复用缓存 → MESSAGE_PROTOCOL_ERROR', async () => {
    const { provider } = createProvider(async () => makeResponse(304, ''));
    await expect(provider.load(loadInput)).rejects.toMatchObject({
      code: 'MESSAGE_PROTOCOL_ERROR',
    });
  });

  it('不同缓存键（locale/namespace/release）不复用缓存', async () => {
    const { provider } = createProvider(async () => makeResponse(304, ''));
    await expect(
      provider.load({ ...loadInput, locale: 'zh-CN' }),
    ).rejects.toMatchObject({ code: 'MESSAGE_PROTOCOL_ERROR' });
  });
});

describe('ApiMessageProvider 错误响应', () => {
  it('HTTP 500 → MESSAGE_FETCH_FAILED 且携带状态码', async () => {
    const { provider } = createProvider(async () => makeResponse(500, 'oops'));
    await expect(provider.load(loadInput)).rejects.toMatchObject({
      code: 'MESSAGE_FETCH_FAILED',
      details: { status: 500 },
    });
  });

  it('fetch 抛错（网络失败）→ MESSAGE_FETCH_FAILED', async () => {
    const { provider } = createProvider(async () => {
      throw new Error('network down');
    });
    await expect(provider.load(loadInput)).rejects.toMatchObject({
      code: 'MESSAGE_FETCH_FAILED',
    });
  });

  it('Content-Type 非 application/json → MESSAGE_PROTOCOL_ERROR', async () => {
    const { provider } = createProvider(async () =>
      makeResponse(200, JSON.stringify(validEnvelope), { 'content-type': 'text/yaml' }),
    );
    await expect(provider.load(loadInput)).rejects.toMatchObject({
      code: 'MESSAGE_PROTOCOL_ERROR',
    });
  });

  it('缺失 Content-Type → MESSAGE_PROTOCOL_ERROR', async () => {
    const { provider } = createProvider(async () =>
      makeResponse(200, JSON.stringify(validEnvelope), {}),
    );
    await expect(provider.load(loadInput)).rejects.toMatchObject({
      code: 'MESSAGE_PROTOCOL_ERROR',
    });
  });

  it('返回 YAML 原文（伪 JSON）→ MESSAGE_PROTOCOL_ERROR', async () => {
    const { provider } = createProvider(async () =>
      makeResponse(200, 'common.save: Save\nuser.selectedCount: "Selected"\n'),
    );
    await expect(provider.load(loadInput)).rejects.toMatchObject({
      code: 'MESSAGE_PROTOCOL_ERROR',
    });
  });

  it('JSON 数组 / 标量 → MESSAGE_PROTOCOL_ERROR', async () => {
    const { provider } = createProvider(async () => makeResponse(200, '[1,2,3]'));
    await expect(provider.load(loadInput)).rejects.toMatchObject({
      code: 'MESSAGE_PROTOCOL_ERROR',
    });
  });
});

describe('ApiMessageProvider envelope 协议校验', () => {
  const loadWith = (envelope: unknown) => {
    const { provider } = createProvider(async () =>
      makeResponse(200, typeof envelope === 'string' ? envelope : JSON.stringify(envelope)),
    );
    return provider.load(loadInput);
  };

  it('format 非 simple-v1 → MESSAGE_PROTOCOL_ERROR', async () => {
    await expect(loadWith({ ...validEnvelope, format: 'icu-v1' })).rejects.toMatchObject({
      code: 'MESSAGE_PROTOCOL_ERROR',
    });
  });

  it('envelope 字段与请求不一致 → MESSAGE_PROTOCOL_ERROR', async () => {
    await expect(loadWith({ ...validEnvelope, locale: 'zh-CN' })).rejects.toMatchObject({
      code: 'MESSAGE_PROTOCOL_ERROR',
    });
    await expect(loadWith({ ...validEnvelope, appId: 'other' })).rejects.toMatchObject({
      code: 'MESSAGE_PROTOCOL_ERROR',
    });
    await expect(loadWith({ ...validEnvelope, release: 'rel-x' })).rejects.toMatchObject({
      code: 'MESSAGE_PROTOCOL_ERROR',
    });
  });

  it('缺失请求的 namespace → NAMESPACE_NOT_FOUND', async () => {
    await expect(
      loadWith({
        ...validEnvelope,
        bundles: { common: validEnvelope.bundles.common },
      }),
    ).rejects.toMatchObject({ code: 'NAMESPACE_NOT_FOUND' });
  });

  it('messages 含非字符串词条 → MESSAGE_PROTOCOL_ERROR', async () => {
    await expect(
      loadWith({
        ...validEnvelope,
        bundles: {
          ...validEnvelope.bundles,
          common: { version: '12', messages: { 'common.save': 42 } },
        },
      }),
    ).rejects.toMatchObject({ code: 'MESSAGE_PROTOCOL_ERROR' });
  });

  it('内嵌 YAML 字符串的伪 envelope（bundles 为字符串）→ MESSAGE_PROTOCOL_ERROR', async () => {
    await expect(
      loadWith({ ...validEnvelope, bundles: { common: 'common.save: Save' } }),
    ).rejects.toMatchObject({ code: 'MESSAGE_PROTOCOL_ERROR' });
  });

  it('namespace 间完整 key 冲突 → MESSAGE_PROTOCOL_ERROR', async () => {
    await expect(
      loadWith({
        ...validEnvelope,
        bundles: {
          common: { version: '1', messages: { 'shared.key': 'a' } },
          user: { version: '1', messages: { 'shared.key': 'b' } },
        },
      }),
    ).rejects.toMatchObject({ code: 'MESSAGE_PROTOCOL_ERROR' });
  });

  it('错误均为 I18nError', async () => {
    const { provider } = createProvider(async () => makeResponse(502, 'bad gateway'));
    try {
      await provider.load(loadInput);
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(I18nError);
    }
  });
});
