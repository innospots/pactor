import { cookies } from "next/headers";

import { DEMO_ACCOUNTS, findUserBySession, SESSION_COOKIE } from "@/server/accounts";
import { corsHeaders, corsPreflight } from "@/server/cors";

/** 演示用户数据（mock）：真实项目由后端用户体系提供 */
const MOCK_USERS = DEMO_ACCOUNTS.map((account, index) => ({
  id: account.id,
  username: account.username,
  name: account.name,
  role: account.roles[0],
  email: `${account.username}@example.com`,
  createdAt: index === 0 ? "2025-03-01" : "2025-04-01",
}));

/**
 * 用户列表：用户列表页的 http 数据源。
 * 支持 keyword（姓名 / 用户名模糊匹配）与 role（精确匹配）过滤。
 * 接口侧鉴权——前端隐藏菜单不等于安全。
 */
export async function GET(request: Request) {
  const store = await cookies();
  const user = findUserBySession(store.get(SESSION_COOKIE)?.value);
  if (!user || !user.permissions.includes("user:view")) {
    return Response.json(
      { error: "未登录或无权限" },
      { status: 401, headers: corsHeaders(request) },
    );
  }

  const { searchParams } = new URL(request.url);
  const keyword = (searchParams.get("keyword") ?? "").trim().toLowerCase();
  const role = searchParams.get("role") ?? "";

  const list = MOCK_USERS.filter((row) => {
    if (role && row.role !== role) {
      return false;
    }
    if (
      keyword &&
      !row.name.toLowerCase().includes(keyword) &&
      !row.username.toLowerCase().includes(keyword)
    ) {
      return false;
    }
    return true;
  });

  return Response.json(list, {
    headers: { "cache-control": "no-store", ...corsHeaders(request) },
  });
}

/** 预检（跨源带凭据 / 自定义头时） */
export const OPTIONS = corsPreflight;
