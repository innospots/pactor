import { notFound } from "next/navigation";

import { resolvePublicPath } from "@pactor-app/shell/server";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

/**
 * 必选 catch-all：不匹配根路径 `/`（由 next.config.ts 重定向到 general-app），
 * 其余路径交给装配路由索引校验后由 layout 中的 PactorShellHost 渲染。
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
