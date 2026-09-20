import { NextResponse } from "next/server";

import { findAccount, SESSION_COOKIE } from "@/server/accounts";

/** 演示登录：校验账号 → 写会话 cookie → 返回用户信息 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    username?: string;
    password?: string;
  };
  const user = findAccount(body.username ?? "", body.password ?? "");
  if (!user) {
    return Response.json({ error: "用户名或密码错误" }, { status: 401 });
  }
  const response = NextResponse.json({ token: `demo-${user.id}`, user });
  response.cookies.set(SESSION_COOKIE, user.username, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return response;
}
