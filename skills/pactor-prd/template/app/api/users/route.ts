import { cookies } from "next/headers";

import { findUserBySession, SESSION_COOKIE } from "@/server/accounts";
import { corsHeaders, corsPreflight } from "@/server/cors";

/** 演示用户数据（mock）：真实项目由后端用户体系提供 */
const MOCK_USERS = [
  { id: "u-1", username: "admin", name: "演示管理员", role: "admin", email: "admin@example.com", createdAt: "2026-01-05" },
  { id: "u-2", username: "guest", name: "访客", role: "guest", email: "guest@example.com", createdAt: "2026-02-11" },
  { id: "u-3", username: "zhangwei", name: "张伟", role: "member", email: "zhangwei@example.com", createdAt: "2026-03-02" },
  { id: "u-4", username: "liuyang", name: "刘洋", role: "member", email: "liuyang@example.com", createdAt: "2026-03-18" },
  { id: "u-5", username: "chenjing", name: "陈静", role: "member", email: "chenjing@example.com", createdAt: "2026-04-07" },
  { id: "u-6", username: "wangfang", name: "王芳", role: "member", email: "wangfang@example.com", createdAt: "2026-05-21" },
  { id: "u-7", username: "zhaolei", name: "赵磊", role: "guest", email: "zhaolei@example.com", createdAt: "2026-06-13" },
  { id: "u-8", username: "sunna", name: "孙娜", role: "member", email: "sunna@example.com", createdAt: "2026-07-30" },
];

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
