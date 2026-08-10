import type { PermissionStore } from './store.js';

/**
 * 表达式函数 `permission(code)` 工厂（决策 D6）：
 * 返回 `(code: string) => boolean`，可作为白名单函数注入
 * pactor-expression 求值（`options.functions`）或求值作用域，
 * 支持 `${!permission('customer:edit')}` 形式。
 *
 * PageRuntime 的自动注入由上层组合层（pactor-app）决定，本包不改变
 * PageRuntime 的既有行为。
 */
export function createPermissionFunction(
  store: PermissionStore,
): (code: string) => boolean {
  return (code: string) => store.has(code);
}
