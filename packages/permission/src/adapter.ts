import type { PermissionConfig } from '@pactor-app/core';

import { resolvePermissionCheck } from './resolve.js';
import type { PermissionStore } from './store.js';

/**
 * 创建适配 @pactor-app/runtime `PermissionAdapter` 的权限适配器（决策 D4）。
 *
 * 返回对象结构化兼容 runtime 的 `PermissionAdapter` 接口
 * （`check(permission: PermissionConfig): boolean`），但不 import
 * @pactor-app/runtime 的任何运行时值，本包保持零 React / 零 runtime 依赖。
 * 类型兼容性由测试中的编译期断言锁定（devDependency 仅用于类型）。
 *
 * 三种配置形态均只判定"有没有权限"：对象形式只检查 `code`，
 * denied 策略由 Renderer / Guard 解释。
 */
export function createPermissionAdapter(store: PermissionStore): {
  check(permission: PermissionConfig): boolean;
} {
  return {
    check(permission: PermissionConfig): boolean {
      return resolvePermissionCheck(permission, store).allowed;
    },
  };
}
