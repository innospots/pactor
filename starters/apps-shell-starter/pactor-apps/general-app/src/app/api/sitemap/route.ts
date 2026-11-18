import { buildSitemap } from "@/backend/pages/sitemap";

export const dynamic = "force-dynamic";

/** 独立运行：布局 / 页面 DSL 随响应内联下发（按请求 locale 本地化）。 */
export async function GET(request: Request) {
  return Response.json(await buildSitemap(request), {
    headers: { "cache-control": "no-store" },
  });
}
