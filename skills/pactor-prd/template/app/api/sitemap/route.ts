import { cookies } from "next/headers";

import { findUserBySession, SESSION_COOKIE } from "@/server/accounts";
import { corsPreflight, corsHeaders } from "@/server/cors";
import { buildSitemap } from "@/server/sitemap";

/**
 * Sitemap 端点（design/dynamic-page.md）：
 * 会话感知——同一 URL，匿名与不同角色拿到不同 sitemap。
 * 入口可配置多个此类 URL（src/pactor/config.ts 的 sources）。
 */
export async function GET(request: Request) {
  const store = await cookies();
  const user = findUserBySession(store.get(SESSION_COOKIE)?.value);
  return Response.json(buildSitemap(user), {
    headers: { "cache-control": "no-store", ...corsHeaders(request) },
  });
}

/** 预检（跨源带凭据 / 自定义头时） */
export const OPTIONS = corsPreflight;
