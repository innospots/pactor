import { cookies } from "next/headers";

import { findUserBySession, SESSION_COOKIE } from "@/server/accounts";
import { getLazyPage } from "@/server/sitemap";

/**
 * 懒加载页面端点：sitemap 中未内联 pageDsl 的页面按需获取。
 * 返回 PageResource envelope（id / version / dslVersion / schema），
 * 接口侧鉴权——前端隐藏菜单不等于安全。
 */
export async function GET(
  _request: Request,
  context: RouteContext<"/api/pages/[id]">,
) {
  const { id } = await context.params;
  const store = await cookies();
  const user = findUserBySession(store.get(SESSION_COOKIE)?.value);
  const entry = getLazyPage(id, user);
  if (!entry) {
    return Response.json({ error: "页面不存在或无权限" }, { status: 404 });
  }
  return Response.json(
    {
      id,
      resourceType: "page",
      version: entry.version,
      dslVersion: "1.0",
      schema: entry.pageDsl,
      updatedAt: new Date().toISOString(),
    },
    { headers: { "cache-control": "no-store" } },
  );
}
