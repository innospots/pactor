import { notFound } from "next/navigation";

import { resolvePublicPath } from "@/modules/route-resolver";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

/**
 * 必选 catch-all：不匹配根路径 `/`（由 app/page.tsx 承接），
 * 其余路径交给装配路由索引校验后由 layout 中的 PactorHost 渲染。
 */
export default async function WorkspaceCatchAllPage({ params }: PageProps) {
  const { slug } = await params;
  const publicPath = "/" + slug.join("/");
  const resolved = resolvePublicPath(publicPath);
  if (!resolved) {
    notFound();
  }
  return null;
}
