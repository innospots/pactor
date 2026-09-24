import { NextResponse } from "next/server";

/**
 * CORS（演示环境放开跨源）：真实项目由后端框架 / 网关统一配置。
 * 会话经 cookie 传递——Allow-Origin 必须回显请求源（带凭据时不能用 *）
 * 且带 Allow-Credentials；POST JSON 会触发预检（OPTIONS）。
 */
export function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin");
  return {
    "access-control-allow-origin": origin ?? "*",
    "access-control-allow-credentials": "true",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type, authorization",
    vary: "origin",
  };
}

export function corsJson(
  request: Request,
  data: unknown,
  init?: ResponseInit,
): NextResponse {
  const response = NextResponse.json(data, init);
  for (const [key, value] of Object.entries(corsHeaders(request))) {
    response.headers.set(key, value);
  }
  return response;
}

/** 预检响应（路由中 `export const OPTIONS = corsPreflight`） */
export function corsPreflight(request: Request): Response {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}
