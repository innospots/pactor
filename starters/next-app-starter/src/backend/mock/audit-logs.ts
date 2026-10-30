import { requestCookies } from "../auth/cookies";
import { findUserBySession, SESSION_COOKIE } from "../mock/accounts";
import { corsHeaders } from "../cors";

import logs from "../fixtures/audit-logs.json";

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
