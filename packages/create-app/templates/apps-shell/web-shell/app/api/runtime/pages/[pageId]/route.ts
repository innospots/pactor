import { cookies } from "next/headers";

import { resolveSessionUser } from "@/server/auth/session";
import { getRuntimePage } from "@/server/runtime/pages";

type RouteContext = { params: Promise<{ pageId: string }> };

const STATUS_BY_KIND = {
  not_found: 404,
  unauthorized: 401,
  forbidden: 403,
} as const;

export async function GET(_request: Request, context: RouteContext) {
  const { pageId } = await context.params;
  const store = await cookies();
  const user = resolveSessionUser(store);
  const result = getRuntimePage(pageId, user);
  if (result.kind !== "ok") {
    return Response.json({ error: result.kind }, { status: STATUS_BY_KIND[result.kind] });
  }
  return Response.json(result.resource, { headers: { "cache-control": "no-store" } });
}
