import { getPagesIndex } from "@/modules/registry";
import type { ShellUser } from "@/server/auth/session";

import { readGeneratedDsl } from "./assembly-io";
import { canSeePage } from "./visibility";

export interface RuntimePageResource {
  id: string;
  resourceType: "page";
  version: number;
  dslVersion: string;
  schema: unknown;
}

/**
 * 页面获取结果（区分语义，供路由层映射 HTTP 状态码）：
 * not_found 页面不存在 → 404；unauthorized 匿名访问非 public → 401；
 * forbidden 已登录但无权限 → 403。
 */
export type RuntimePageResult =
  | { kind: "ok"; resource: RuntimePageResource }
  | { kind: "not_found" }
  | { kind: "unauthorized" }
  | { kind: "forbidden" };

export function getRuntimePage(
  globalPageId: string,
  user: ShellUser | null,
): RuntimePageResult {
  const entry = getPagesIndex().pages.find((p) => p.globalPageId === globalPageId);
  if (!entry || !entry.dslRef) return { kind: "not_found" };
  if (!canSeePage(entry, user)) {
    return { kind: user ? "forbidden" : "unauthorized" };
  }
  const pageDsl = readGeneratedDsl(entry.dslRef);
  return {
    kind: "ok",
    resource: {
      id: globalPageId,
      resourceType: "page",
      version: entry.version,
      dslVersion: typeof pageDsl.dsl === "string" ? pageDsl.dsl : "1.0",
      schema: pageDsl,
    },
  };
}
