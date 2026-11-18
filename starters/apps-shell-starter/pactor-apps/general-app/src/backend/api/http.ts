/**
 * 模块 API 的 HTTP 辅助：CORS 与 cookie 解析。
 *
 * 模块 server entry 拿到的就是原始 Request（Shell 分发器原样透传），
 * 因此这里直接读 header，不依赖 Next 的请求作用域。
 */

/** 演示环境放开跨源；生产由网关 / 后端框架统一配置。 */
export function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin");
  return {
    "access-control-allow-origin": origin ?? "*",
    "access-control-allow-credentials": "true",
    "access-control-allow-methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, authorization",
    vary: "origin",
  };
}

/** 预检响应（独立 Next 路由里 `export const OPTIONS = corsPreflight`）。 */
export function corsPreflight(request: Request): Response {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

/** 解析 Cookie 头为 Map；重复名取第一个。 */
export function requestCookies(request: Request): Map<string, string> {
  const jar = new Map<string, string>();
  const header = request.headers.get("cookie");
  if (!header) return jar;
  for (const part of header.split(/;\s*/)) {
    const index = part.indexOf("=");
    if (index <= 0) continue;
    const name = part.slice(0, index).trim();
    const value = decodeURIComponent(part.slice(index + 1).trim());
    if (!jar.has(name)) jar.set(name, value);
  }
  return jar;
}
