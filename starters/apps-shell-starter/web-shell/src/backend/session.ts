/**
 * 演示会话占位。
 *
 * Shell 只负责「会话契约」：从 cookie 还原 ShellUser、清理会话。
 * 真实项目由统一登录 / 网关注入（createRuntimeHandlers 的 resolveUser）；
 * 业务用户、角色、权限明细在 general-app 模块内维护，这里只保留一个
 * 最简演示账号用于登录与菜单权限演示。
 */
export const SESSION_COOKIE = "pactor_demo_session";

export interface ShellSessionUser {
  id: string;
  username: string;
  name: string;
  roles: string[];
  permissions: string[];
}

/** 演示账号：admin / admin123（与 general-app 的 fixtures/accounts.json 对齐） */
const DEMO_USER: ShellSessionUser = {
  id: "u-1",
  username: "admin",
  name: "演示管理员",
  roles: ["admin"],
  permissions: ["report:view", "user:view"],
};

export function findAccount(
  username: string,
  password: string,
): ShellSessionUser | null {
  return username === DEMO_USER.username && password === "admin123"
    ? DEMO_USER
    : null;
}

/** 会话 cookie 值 = username（演示环境明文，生产换签名 token / session id） */
export function findUserBySession(
  cookieValue: string | undefined,
): ShellSessionUser | null {
  return cookieValue === DEMO_USER.username ? DEMO_USER : null;
}
