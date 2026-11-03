import { cookies } from "next/headers";

import { buildRuntimeBootstrap } from "@/server/runtime/bootstrap";
import { resolveSessionUser } from "@/server/auth/session";

export async function GET() {
  const store = await cookies();
  const user = resolveSessionUser(store);
  const body = buildRuntimeBootstrap(user);
  return Response.json(body, {
    headers: { "cache-control": "no-store" },
  });
}
