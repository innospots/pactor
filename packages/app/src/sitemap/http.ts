import type { PactorHttpHooks } from '../assembly.js';

/**
 * 把 PactorHttpHooks 包装到 fetcher 上：sitemap 源 / 页面端点等框架自发
 * 请求与页面运行时走同一套 HTTP 加工（跨域改写 / 鉴权头 / 响应拆包）。
 * response 钩子仅作用于 2xx（错误响应原样返回，由调用方判定 HTTP 错误）。
 */
export function withHttpHooks(
  fetcher: typeof fetch,
  hooks?: PactorHttpHooks,
): typeof fetch {
  if (hooks === undefined) {
    return fetcher;
  }
  return (async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    let url =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.href
          : input.url;
    let requestInit = init;
    if (hooks.request !== undefined) {
      const config = await hooks.request({
        method: init?.method ?? 'GET',
        url,
        headers: headersToRecord(init?.headers),
        body: init?.body ?? undefined,
      });
      url = config.url;
      requestInit = {
        ...init,
        method: config.method ?? init?.method ?? 'GET',
        headers: config.headers,
        body:
          config.body === undefined
            ? (init?.body ?? null)
            : (config.body as BodyInit),
      };
    }
    const res = await fetcher(url, requestInit);
    if (hooks.response === undefined || !res.ok) {
      return res;
    }
    const data = await hooks.response(await res.json());
    return new Response(JSON.stringify(data), {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    });
  }) as typeof fetch;
}

function headersToRecord(
  headers?: HeadersInit,
): Record<string, string> | undefined {
  if (headers === undefined) {
    return undefined;
  }
  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }
  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }
  return { ...headers };
}
