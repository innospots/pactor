import type { MenuItem, MenuRegistry } from 'pactor-router';

import { findMenuChain } from './menu-chain.js';

/**
 * 收集默认展开的 group id。
 *
 * 包含两类：
 * - 声明了 `defaultOpen: true` 的 group；
 * - 当前激活菜单（activeMenuId）父链上的 group——刷新 / 直达子页面时，
 *   选中项所在分组必须展开，否则高亮项不可见（菜单"没有展开"）。
 */
export function collectDefaultOpenKeys(
  registry: MenuRegistry,
  activeMenuId?: string,
): string[] {
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
  if (activeMenuId !== undefined) {
    for (const menu of findMenuChain(registry, activeMenuId)) {
      if (menu.type === 'group' && !keys.includes(menu.id)) {
        keys.push(menu.id);
      }
    }
  }
  return keys;
}
