/** 会话用户（bootstrap / 页面可见性判定使用）。 */
export type ShellUser = {
  id: string;
  username: string;
  name?: string;
  permissions: string[];
};

/** Next cookies() 的最小结构契约（避免深引用 next 内部类型）。 */
export interface ShellCookieStore {
  get(name: string): { value: string } | undefined;
}

/**
 * 缺省会话解析：恒匿名。接入统一登录后由宿主经
 * createRuntimeHandlers({ resolveUser }) 注入真实实现。
 */
export function defaultResolveSessionUser(
  _store: ShellCookieStore,
): ShellUser | null {
  return null;
}
