import { ResourceError } from './errors.js';

/**
 * 可替换的 HTTP 抽象：结构化请求 / 响应，便于统一认证、网关适配与测试 mock。
 */

/** HTTP 请求描述 */
export interface HttpAdapterRequest {
  url: string;
  method?: string;
  headers?: Record<string, string>;
}

/** HTTP 响应描述：data 为已解析的 JSON；etag 取自 ETag 响应头 */
export interface HttpAdapterResponse {
  status: number;
  data?: unknown;
  etag?: string;
}

/** HTTP 适配器：非 2xx/304 响应 MUST 抛含 status 的 ResourceError */
export type HttpAdapter = (
  request: HttpAdapterRequest,
) => Promise<HttpAdapterResponse>;

/** fetch 函数的最小结构类型（浏览器 / Node 18+ 全局 fetch 均满足） */
export type FetchLike = (
  input: string,
  init?: {
    method?: string;
    headers?: Record<string, string>;
  },
) => Promise<{
  status: number;
  headers: { get(name: string): string | null };
  json(): Promise<unknown>;
}>;

/**
 * 默认 fetch 实现：解析 JSON body 与 ETag 响应头；
 * 非 2xx/304 抛 ResourceError（含 status），网络异常包装为 ResourceError（无 status）。
 */
export function createFetchAdapter(fetchImpl?: FetchLike): HttpAdapter {
  const doFetch =
    fetchImpl ??
    ((globalThis as { fetch?: unknown }).fetch as FetchLike | undefined);
  if (!doFetch) {
    throw new ResourceError('当前环境无全局 fetch，请显式传入 fetch 实现或自定义 HttpAdapter');
  }

  return async (request) => {
    let response: Awaited<ReturnType<FetchLike>>;
    try {
      response = await doFetch(request.url, {
        method: request.method ?? 'GET',
        headers: request.headers,
      });
    } catch (error) {
      throw new ResourceError(
        `请求失败: ${request.method ?? 'GET'} ${request.url}`,
        { cause: error },
      );
    }

    const { status } = response;
    if (!((status >= 200 && status < 300) || status === 304)) {
      throw new ResourceError(
        `请求返回 ${status}: ${request.method ?? 'GET'} ${request.url}`,
        { status },
      );
    }

    const etag = response.headers.get('etag') ?? undefined;
    // 304 无 body；2xx 尝试解析 JSON（空 body 容忍为 undefined）
    let data: unknown;
    if (status !== 304) {
      data = await response.json().catch(() => undefined);
    }
    return { status, data, etag };
  };
}
