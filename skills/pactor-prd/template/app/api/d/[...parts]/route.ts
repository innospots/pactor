import { cookies } from "next/headers";

import { serverBaseUrl } from "@/pactor/config";
import { findUserBySession, SESSION_COOKIE } from "@/server/accounts";
import { corsHeaders, corsPreflight } from "@/server/cors";

/**
 * 页面数据接口统一入口（纯转发）：页面 DSL 的 http 数据源（如
 * /api/d/providers）即服务端接口路径，本路由按相同路径、方法、查询与
 * 请求体原样转发到 $serverBaseUrl/api/d/<parts>（src/pactor/config.ts），
 * 并携带会话 cookie；匿名一律 401，不转发。
 *
 * 没有服务层接口时返回空数据（不报错）：上游不可达（连接失败）、接口
 * 不存在（404）或返回非 JSON（如命中前端兜底的 HTML）时，GET 返回 {}、
 * POST 返回 { ok: true }，页面按空态渲染；接真实后端只需把
 * next.config.js 的 API_BASE_URLS 换成真实地址，页面 yaml 与本路由零改动。
 */

/** 无服务层接口时的空数据（GET → 空对象，POST → 成功占位） */
function emptyData(request: Request): Response {
  const isGet = request.method === "GET" || request.method === "HEAD";
  return Response.json(isGet ? {} : { ok: true }, {
    headers: { "cache-control": "no-store", ...corsHeaders(request) },
  });
}

/** 原样转发：同路径、同方法、同查询、同请求体，携带会话 cookie */
async function forward(request: Request, parts: string[]): Promise<Response> {
  const url = new URL(request.url);
  const target = `${serverBaseUrl}/api/d/${parts.join("/")}${url.search}`;
  const headers = new Headers();
  const cookie = request.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const init: RequestInit = { method: request.method, headers };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }
  let upstream: globalThis.Response;
  try {
    upstream = await fetch(target, init);
  } catch {
    return emptyData(request); // 上游不可达 → 空数据
  }
  const upstreamType = upstream.headers.get("content-type") ?? "";
  if (upstream.status === 404 || !upstreamType.includes("json")) {
    return emptyData(request); // 接口不存在 / 命中前端兜底 HTML → 空数据
  }
  const body = await upstream.arrayBuffer();
  const resHeaders: Record<string, string> = {
    "cache-control": "no-store",
    "content-type": upstreamType,
    ...corsHeaders(request),
  };
  return new Response(body, { status: upstream.status, headers: resHeaders });
}

async function handle(
  request: Request,
  context: RouteContext<"/api/d/[...parts]">,
) {
  const store = await cookies();
  const user = findUserBySession(store.get(SESSION_COOKIE)?.value);
  if (!user) {
    return Response.json(
      { error: "未登录" },
      { status: 401, headers: corsHeaders(request) },
    );
  }

  const { parts } = await context.params;
  return forward(request, parts);
}

export const GET = handle;
export const POST = handle;

/** 预检（跨源带凭据 / 自定义头时） */
export const OPTIONS = corsPreflight;
