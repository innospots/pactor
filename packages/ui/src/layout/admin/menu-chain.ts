import type { MenuItem, MenuRegistry } from '@pactor-app/router';

/**
 * 菜单链（设计决策 D2）：沿可见树查找 menuId 的父链，
 * 返回从顶层到目标项的 MenuItem 数组（含目标项自身），供 Breadcrumb 渲染。
 * 未命中返回空数组。
 */
export function findMenuChain(
  registry: MenuRegistry,
  menuId: string,
): MenuItem[] {
  const walk = (
    menus: readonly MenuItem[],
    ancestors: MenuItem[],
  ): MenuItem[] | null => {
    for (const menu of menus) {
      const chain = [...ancestors, menu];
      if (menu.id === menuId) {
        return chain;
      }
      if (menu.children !== undefined) {
        const hit = walk(menu.children, chain);
        if (hit !== null) {
          return hit;
        }
      }
    }
    return null;
  };
  return walk(registry.tree(), []) ?? [];
}
