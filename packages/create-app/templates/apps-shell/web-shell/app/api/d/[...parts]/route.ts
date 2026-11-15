import { cookies } from "next/headers";

import { findUserBySession, SESSION_COOKIE } from "@/backend/mock/accounts";
import { isPrototype, serverBaseUrl } from "@/backend/config";
import { corsHeaders, corsPreflight } from "@/backend/cors";
import { mockBusinessData } from "@/backend/mock";

async function forward(request: Request, parts: string[]): Promise<Response> {
  const url = new URL(request.url);
  const target = `${serverBaseUrl.replace(/\/+$/, "")}/api/d/${parts.join("/")}${url.search}`;
  const headers = new Headers();
  for (const name of ["cookie", "authorization", "content-type", "accept"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  const init: RequestInit = { method: request.method, headers, cache: "no-store" };
  if (!["GET", "HEAD"].includes(request.method)) {
    init.body = await request.arrayBuffer();
  }
  let upstream: Response;
  try {
    upstream = await fetch(target, init);
  } catch {
    return Response.json(
      { error: "后端服务不可用" },
      { status: 502, headers: corsHeaders(request) },
    );
  }
  const contentType = upstream.headers.get("content-type") ?? "";
  if (contentType.includes("text/event-stream")) {
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "content-type": contentType,
        "cache-control": "no-store",
        "x-accel-buffering": "no",
        ...corsHeaders(request),
      },
    });
  }
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "cache-control": "no-store",
      ...(contentType ? { "content-type": contentType } : {}),
      ...corsHeaders(request),
    },
  });
}

async function handle(
  request: Request,
  context: { params: Promise<{ parts: string[] }> },
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
  return isPrototype ? mockBusinessData(request, parts) : forward(request, parts);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
export const OPTIONS = corsPreflight;
