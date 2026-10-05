import { NextResponse } from "next/server";

import { SESSION_COOKIE } from "@/server/accounts";
import { corsHeaders, corsPreflight } from "@/server/cors";

/** 演示登出：清会话 cookie */
export async function POST(request: Request) {
  const response = NextResponse.json(
    { ok: true },
    { headers: corsHeaders(request) },
  );
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

/** 预检（跨源 POST JSON） */
export const OPTIONS = corsPreflight;
