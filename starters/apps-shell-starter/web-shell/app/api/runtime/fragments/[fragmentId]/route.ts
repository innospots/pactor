import { cookies } from "next/headers";

import { resolveSessionUser } from "@/server/auth/session";
import { getRuntimeFragmentDsl } from "@/server/runtime/fragments";

type RouteContext = { params: Promise<{ fragmentId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { fragmentId } = await context.params;
  const store = await cookies();
  const user = resolveSessionUser(store);
  const fragment = getRuntimeFragmentDsl(fragmentId, user);
  if (!fragment) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }
  return Response.json(fragment, { headers: { "cache-control": "no-store" } });
}
