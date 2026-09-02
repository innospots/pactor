import type { PermissionConfig } from '@pactor/core';

import {
  resolvePermissionCheck,
  type PermissionChecker,
} from './resolve.js';

/**
 * 菜单项结构约束：带可选 permission 与递归 children。
 * 泛型保持调用方的菜单项类型（额外字段原样保留）。
 */
export type MenuItemWithPermission<T> = T & {
  permission?: PermissionConfig;
  children?: MenuItemWithPermission<T>[];
};

/**
 * Menu Guard（决策 D5）：递归过滤无权限的菜单项。
 *
 * - 未配置 permission 的项保留；
 * - children 被全部移除的空目录一并移除；
 * - 返回新数组，原数组与原菜单项对象不被修改
 *   （children 被过滤的项返回浅拷贝）。
 *
 * checker 为结构化接口，直接传 PermissionStore 即可。
 */
export function filterMenusByPermission<
  T extends { permission?: PermissionConfig; children?: T[] },
>(menus: readonly T[], checker: PermissionChecker): T[] {
  const result: T[] = [];
  for (const menu of menus) {
    if (!resolvePermissionCheck(menu.permission, checker).allowed) {
      continue;
    }
    if (menu.children === undefined) {
      result.push(menu);
      continue;
    }
    const children = filterMenusByPermission(menu.children, checker);
    // 原本非空、过滤后变空的目录一并移除
    if (menu.children.length > 0 && children.length === 0) {
      continue;
    }
    result.push({ ...menu, children });
  }
  return result;
}

/**
 * Page Guard（决策 D5）：页面元信息含 permission 时判定是否放行；
 * 无 permission 字段一律放行。checker 为结构化接口，直接传
 * PermissionStore 即可。
 */
export function checkPagePermission<T extends { permission?: PermissionConfig }>(
  page: T,
  checker: PermissionChecker,
): boolean {
  return resolvePermissionCheck(page.permission, checker).allowed;
}
