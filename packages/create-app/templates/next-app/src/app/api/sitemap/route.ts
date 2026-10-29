import { cookies } from "next/headers";

import { findUserBySession, SESSION_COOKIE } from "@/backend/auth/accounts";
import { corsPreflight, corsHeaders } from "@/backend/cors";
import { buildSitemap } from "@/backend/resources/sitemap";
import { localeError, localizeSitemap, requestLocale } from "@/backend/resources/i18n";

/**
 * Sitemap 端点（design/dynamic-page.md）：
 * 会话感知——同一 URL，匿名与不同角色拿到不同 sitemap。
 * 入口可配置多个此类 URL（src/frontend/config.ts 的 sources）。
 * ?locale= 决定 menus / pages 标题语言（缺省 zh-CN），
 * 客户端切换语言时随 sitemap 重取携带。
 */
export async function GET(request: Request) {
  const store = await cookies();
  const user = findUserBySession(store.get(SESSION_COOKIE)?.value);
  const headers = { "cache-control": "no-store", ...corsHeaders(request) };
  try {
    const { locale } = requestLocale(request, store.get("locale")?.value);
    return Response.json(await localizeSitemap(buildSitemap(user), locale), {
      headers: { ...headers, "content-language": locale },
    });
  } catch (error) {
    return localeError(error, headers);
  }
}

/** 预检（跨源带凭据 / 自定义头时） */
export const OPTIONS = corsPreflight;
