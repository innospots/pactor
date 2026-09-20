import { NextResponse } from "next/server";

import { SESSION_COOKIE } from "@/server/accounts";

/** 演示登出：清会话 cookie */
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
