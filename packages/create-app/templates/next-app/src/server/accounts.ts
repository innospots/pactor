/**
 * 演示账号（mock）：真实项目由后端用户体系替换。
 * 会话经 httpOnly cookie 传递（pactor_demo_session），sitemap 端点据此裁剪内容。
 */
export interface DemoUser {
  id: string;
  username: string;
  name: string;
  roles: string[];
  permissions: string[];
}

export const DEMO_ACCOUNTS: (DemoUser & { password: string })[] = [
  {
    id: "u-1",
    username: "admin",
    password: "pactor123",
    name: "演示管理员",
    roles: ["admin"],
    permissions: ["report:view"],
  },
  {
    id: "u-2",
    username: "guest",
    password: "guest123",
    name: "访客",
    roles: ["guest"],
    permissions: [],
  },
];

export const SESSION_COOKIE = "pactor_demo_session";

function toDemoUser(account: (typeof DEMO_ACCOUNTS)[number]): DemoUser {
  return {
    id: account.id,
    username: account.username,
    name: account.name,
    roles: account.roles,
    permissions: account.permissions,
  };
}

export function findAccount(
  username: string,
  password: string,
): DemoUser | null {
  const hit = DEMO_ACCOUNTS.find(
    (a) => a.username === username && a.password === password,
  );
  return hit ? toDemoUser(hit) : null;
}

/** 会话 cookie 值 = username（演示环境明文，生产换成签名 token / session id） */
export function findUserBySession(
  cookieValue: string | undefined,
): DemoUser | null {
  if (!cookieValue) {
    return null;
  }
  const hit = DEMO_ACCOUNTS.find((a) => a.username === cookieValue);
  return hit ? toDemoUser(hit) : null;
}
