/**
 * 演示用本地会话（无后端）：
 * 登录成功把 { token, user } 写入 localStorage，bootstrap 据此决定
 * 返回 login 布局（未登录）还是 admin 布局（已登录），
 * main.tsx 的路由守卫也读取同一份会话。
 */

export interface DemoSession {
  token: string;
  user: { id: string; name: string; roles: string[] };
}

const STORAGE_KEY = 'example-admin.session';

/** 演示账号（写死，仅示例） */
export const DEMO_ACCOUNT = { username: 'admin', password: 'pactor123' };

export function readSession(): DemoSession | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DemoSession>;
    if (typeof parsed.token !== 'string' || parsed.token === '') return null;
    return parsed as DemoSession;
  } catch {
    return null;
  }
}

export function writeSession(session: DemoSession): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}
