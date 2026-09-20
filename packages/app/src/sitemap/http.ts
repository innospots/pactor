import type { PactorHttpHooks } from '../assembly.js';

/** createHttpHooks 配置 */
export interface CreateHttpHooksOptions {
  /** 项目内代理前缀：传入后跨域绝对地址改写到此前缀（由宿主服务端
   * 转发）；缺省不改写——服务端已开通 CORS，浏览器直连 */
  proxyPrefix?: string;
  /** 公共头注入（Authorization / 租户头等），对象或函数（每次请求求值） */
  headers?:
    | Record<string, string>
    | (() => Record<string, string>);
  /** 响应拆包：缺省按 { code, data, message } 包裹协议处理（拆出 data，
   * 非 0 抛错）；后端不包裹时传 false 关闭 */
  envelope?: boolean;
}

/**
 * 默认 HTTP 钩子（常用协议开箱即用）：
 * - request：缺省不改写地址（假定服务端已开通 CORS，浏览器直连）；
 *   传 proxyPrefix 时跨域绝对地址（origin ≠ 页面源）改写到项目内
 *   代理前缀（path + query 保留），由宿主服务端代理转发
 *   （Vite server.proxy / Next rewrites / nginx）；可注入公共头
 * - response：{ code, data, message } 包裹结构拆包为 data，非 0 抛错
 *   （DSL 动作按失败处理）；非包裹结构原样透传
 *
 * 后端协议不同（包裹结构 / 错误码约定）时自行实现 PactorHttpHooks。
 */
export function createHttpHooks(
  options: CreateHttpHooksOptions = {},
): PactorHttpHooks {
  const { proxyPrefix } = options;
  const envelope = options.envelope ?? true;
  return {
    request(config) {
      let url = config.url;
      if (
        proxyPrefix !== undefined &&
        /^https?:\/\//.test(url) &&
        typeof window !== 'undefined' &&
        !url.startsWith(window.location.origin)
      ) {
        // 外部绝对地址 → 项目内代理（同源），由宿主服务端转发
        const target = new URL(url);
        url = `${proxyPrefix}${target.pathname}${target.search}`;
      }
      const extra =
        typeof options.headers === 'function'
          ? options.headers()
          : options.headers;
      return {
        ...config,
        url,
        headers: { ...config.headers, ...extra },
      };
    },
    response(data) {
      if (!envelope) {
        return data;
      }
      if (
        typeof data === 'object' &&
        data !== null &&
        'code' in data &&
        'data' in data
      ) {
        const wrapped = data as { code: number; data: unknown; message?: string };
        if (wrapped.code !== 0) {
          throw new Error(wrapped.message ?? `业务错误码 ${wrapped.code}`);
        }
        return wrapped.data;
      }
      return data;
    },
  };
}

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
