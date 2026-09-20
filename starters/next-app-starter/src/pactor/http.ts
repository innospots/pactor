import type { PactorHttpHooks } from "pactor-app";

import { apiProxyPrefix } from "./config";

/**
 * HTTP 钩子（PactorHttpHooks）：对页面运行时所有 HTTP 出口
 * （DSL request 动作、http 类型 dataSource、动态 DSL 引用）做统一加工。
 *
 * - request：发出前改写——外部绝对地址（跨域）改写成项目内代理前缀，
 *   并可注入公共头（Authorization / 租户头等）
 * - response：收到后归一化——后端包裹结构 { code, data, message }
 *   拆包为 data；业务错误码抛错（DSL 动作按失败处理）
 *
 * 后端协议不同时，按实际包裹结构调整 response 即可。
 */
export const httpHooks: PactorHttpHooks = {
  request(config) {
    let url = config.url;
    if (
      /^https?:\/\//.test(url) &&
      typeof window !== "undefined" &&
      !url.startsWith(window.location.origin)
    ) {
      // 外部绝对地址 → 项目内代理（同源），由 Next rewrites 转发
      const target = new URL(url);
      url = `${apiProxyPrefix}${target.pathname}${target.search}`;
    }
    return {
      ...config,
      url,
      headers: {
        ...config.headers,
        // 公共头注入示例（按需启用）：
        // "x-tenant-id": "demo",
      },
    };
  },
  response(data) {
    // 包裹结构归一化：{ code: 0, data: T, message } → T；非 0 抛错
    if (
      typeof data === "object" &&
      data !== null &&
      "code" in data &&
      "data" in data
    ) {
      const envelope = data as { code: number; data: unknown; message?: string };
      if (envelope.code !== 0) {
        throw new Error(envelope.message ?? `业务错误码 ${envelope.code}`);
      }
      return envelope.data;
    }
    return data;
  },
};
