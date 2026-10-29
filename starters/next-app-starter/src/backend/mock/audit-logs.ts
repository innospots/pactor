import { requestCookies } from "../auth/cookies";
import { findUserBySession, SESSION_COOKIE } from "../auth/accounts";
import { corsHeaders } from "../cors";

const actions = ["登录系统", "更新角色", "创建用户", "修改系统设置", "查看报表", "导出数据"];
const users = ["演示管理员", "张晓", "李明", "王芳"];
const logs = Array.from({ length: 36 }, (_, index) => ({
  id: `audit-${index + 1}`,
  time: new Date(Date.UTC(2026, 9, 28, 9, 30 - index * 14)).toISOString(),
  user: users[index % users.length],
  action: actions[index % actions.length],
  result: index % 9 === 0 ? "失败" : "成功",
  ip: `192.168.1.${10 + (index % 20)}`,
}));

export async function GET(request: Request) {
  const cookies = requestCookies(request);
  if (!findUserBySession(cookies.get(SESSION_COOKIE))) {
    return Response.json({ error: "未登录" }, { status: 401, headers: corsHeaders(request) });
  }
  const url = new URL(request.url);
  const keyword = (url.searchParams.get("keyword") ?? "").trim().toLowerCase();
  const result = url.searchParams.get("result") ?? "";
  const filtered = logs.filter(
    (log) =>
      (!result || log.result === result) &&
      `${log.user} ${log.action} ${log.ip}`.toLowerCase().includes(keyword),
  );
  const page = Math.max(1, Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
  const pageSize = 10;
  return Response.json(
    {
      records: filtered.slice((page - 1) * pageSize, page * pageSize),
      total: filtered.length,
      page,
      pageSize,
    },
    { headers: { "cache-control": "no-store", ...corsHeaders(request) } },
  );
}
