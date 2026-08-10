import { describe, expect, it } from 'vitest';

import { ResourceError } from './errors.js';
import { createFetchAdapter, type FetchLike } from './http-adapter.js';

/** 构造 mock fetch：按队列返回响应 */
function mockFetch(
  responses: Array<{ status: number; body?: unknown; etag?: string }>,
): FetchLike {
  const calls: Array<{ input: string; init?: unknown }> = [];
  const fn = (async (input: string, init?: { method?: string }) => {
    calls.push({ input, init });
    const next = responses.shift();
    if (!next) {
      throw new Error('mock fetch 响应队列已空');
    }
    return {
      status: next.status,
      headers: { get: (name: string) => (name.toLowerCase() === 'etag' ? (next.etag ?? null) : null) },
      json: async () => next.body,
    };
  }) as FetchLike;
  (fn as unknown as { calls: typeof calls }).calls = calls;
  return fn;
}

describe('createFetchAdapter（默认 fetch 实现）', () => {
  it('2xx 解析 JSON body 与 ETag 响应头', async () => {
    const fetchImpl = mockFetch([
      { status: 200, body: { id: 'p1' }, etag: 'v1' },
    ]);
    const adapter = createFetchAdapter(fetchImpl);

    const response = await adapter({ url: '/api/runtime/pages/p1' });

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ id: 'p1' });
    expect(response.etag).toBe('v1');
  });

  it('非 2xx/304 抛含 status 的 ResourceError', async () => {
    const fetchImpl = mockFetch([{ status: 404, body: { message: 'not found' } }]);
    const adapter = createFetchAdapter(fetchImpl);

    const error = await adapter({ url: '/x' }).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ResourceError);
    expect((error as ResourceError).status).toBe(404);
  });

  it('304 不解析 body，原样返回 status', async () => {
    const fetchImpl = mockFetch([{ status: 304 }]);
    const adapter = createFetchAdapter(fetchImpl);

    const response = await adapter({
      url: '/x',
      headers: { 'If-None-Match': 'v1' },
    });

    expect(response.status).toBe(304);
    expect(response.data).toBeUndefined();
  });

  it('网络异常包装为 ResourceError（无 status）', async () => {
    const fetchImpl = (async () => {
      throw new TypeError('fetch failed');
    }) as FetchLike;
    const adapter = createFetchAdapter(fetchImpl);

    const error = await adapter({ url: '/x' }).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ResourceError);
    expect((error as ResourceError).status).toBeUndefined();
  });
});
