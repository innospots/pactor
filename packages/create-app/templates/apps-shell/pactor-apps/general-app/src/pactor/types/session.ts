/**
 * 组件展示用的会话用户。
 *
 * 与 `@pactor-app/shell/server` 的 `ShellUser` 结构兼容，但模块不反向依赖
 * 宿主包（模块可独立运行），因此在此声明本地类型。
 */
export interface SessionUser {
  id?: string;
  name?: string;
  username?: string;
  roles?: string[];
  permissions?: string[];
}
