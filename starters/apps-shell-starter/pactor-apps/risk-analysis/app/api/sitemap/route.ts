import { buildSitemap } from "@/server/sitemap";

export const dynamic = "force-dynamic";

/** 单页 sitemap：布局 / 页面 DSL 随响应内联下发 */
export async function GET() {
  return Response.json(buildSitemap(), {
    headers: { "cache-control": "no-store" },
  });
}
