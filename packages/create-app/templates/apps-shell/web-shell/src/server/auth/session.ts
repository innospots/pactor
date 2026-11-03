import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export type ShellUser = {
  id: string;
  username: string;
  name?: string;
  permissions: string[];
};

/**
 * 占位会话解析。P3 阶段接入统一登录 cookie / BFF。
 */
export function resolveSessionUser(
  _store: ReadonlyRequestCookies,
): ShellUser | null {
  return null;
}
