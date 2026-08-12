import type { MenuProps } from 'antd';
import type { PermissionChecker } from 'pactor-permission';
import { filterMenusByPermission } from 'pactor-permission';
import type { MenuItem, MenuRegistry } from 'pactor-router';

type AntdMenuItem = NonNullable<MenuProps['items']>[number];

/**
 * 可见菜单树 → antd Menu items（设计决策 D1）。
 *
 * - `group` → 子菜单（SubMenu），children 递归转换；
 * - `page` / `link` → 菜单项，key 为菜单 id；
 * - `disabled` 原样传递；
 * - `icon` 字符串 V1 不映射 antd 图标（见 design.md Open Questions）。
 */
function toAntdItems(menus: readonly MenuItem[]): AntdMenuItem[] {
  const items: AntdMenuItem[] = [];
  for (const menu of menus) {
    if (menu.type === 'group') {
      items.push({
        key: menu.id,
        label: menu.title,
        disabled: menu.disabled,
        children: toAntdItems(menu.children ?? []),
      });
    } else {
      items.push({
        key: menu.id,
        label: menu.title,
        disabled: menu.disabled,
      });
    }
  }
  return items;
}

/** 任意菜单子树 → antd Menu items（two-column 模式的子菜单列复用） */
export function buildAntdMenuItems(menus: readonly MenuItem[]): AntdMenuItem[] {
  return toAntdItems(menus);
}

/**
 * 由 MenuRegistry 构建 antd Menu items：取可见树（hidden 已过滤），
 * 提供 permissionChecker 时先经 filterMenusByPermission 权限过滤。
 */
export function buildMenuItems(
  registry: MenuRegistry,
  permissionChecker?: PermissionChecker,
): AntdMenuItem[] {
  const tree = registry.tree();
  const visible =
    permissionChecker === undefined
      ? tree
      : filterMenusByPermission(tree, permissionChecker);
  return toAntdItems(visible);
}

/**
 * 收集声明了 `defaultOpen: true` 的 group id（antd Menu defaultOpenKeys）。
 */
export function collectDefaultOpenKeys(registry: MenuRegistry): string[] {
  const keys: string[] = [];
  const walk = (menus: readonly MenuItem[]): void => {
    for (const menu of menus) {
      if (menu.type === 'group' && menu.defaultOpen === true) {
        keys.push(menu.id);
      }
      if (menu.children !== undefined) {
        walk(menu.children);
      }
    }
  };
  walk(registry.tree());
  return keys;
}
