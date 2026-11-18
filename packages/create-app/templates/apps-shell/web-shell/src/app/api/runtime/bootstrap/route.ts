import { cookies } from "next/headers";

import { createRuntimeHandlers } from "@pactor-app/shell/server/routes";

import { findUserBySession, SESSION_COOKIE } from "@/backend/session";

/**
 * Runtime bootstrap：注入演示账号的会话解析（cookie = username），
 * 菜单 / 页面的登录态与 permission 可见性据此裁剪。cookies 由宿主侧
 * 注入（包与宿主分属不同 next 实例时 AsyncLocalStorage 不共享）。
 */
const handlers = createRuntimeHandlers({
  cookies,
  resolveUser: (store) => findUserBySession(store.get(SESSION_COOKIE)?.value),
});

export const GET = handlers.bootstrap;
