import type { PermissionConfig } from '@pactor-app/core';

import { match } from './path-matcher.js';

/**
 * 菜单项模型（设计文档第 30 节，决策 D1）。
 *
 * 菜单声明 `path` + `pageId`，不绑定 React 组件；Dynamic Router 把
 * URL 解析为 pageId 与路由上下文。`keepAlive` / `tab` / `breadcrumb`
 * 等 UI 语义字段由 @pactor-app/ui 的 layout 层消费，本包只保留字段与 activeMenu 解析。
 */
export interface MenuItem {
  id: string;
  type: 'group' | 'page' | 'link';
  title: string;
  icon?: string;
  order?: number;
  path?: string;
  pageId?: string;
  /** 访问权限（@pactor-app/core PermissionConfig，守卫由 @pactor-app/permission 提供） */
  permission?: PermissionConfig;
  /** 隐藏页：不出现在可见菜单树，但参与路径匹配（详情页场景） */
  hidden?: boolean;
  disabled?: boolean;
  external?: boolean;
  target?: string;
  keepAlive?: boolean;
  badge?: string | number;
  /** 高亮菜单 id：命中该项时高亮另一个菜单项（缺省为自身 id） */
  activeMenu?: string;
  defaultOpen?: boolean;
  breadcrumb?: boolean;
  tab?: boolean;
  children?: MenuItem[];
}

/** findByPath 命中结果（`menu` 字段预留供 layout 推导面包屑等） */
export interface MenuPathMatch {
  menu: MenuItem;
  params: Record<string, string>;
}

/** 递归过滤 hidden 项（连同其子树），产出供 layout 渲染的可见菜单树 */
function filterHidden(items: readonly MenuItem[]): MenuItem[] {
  const result: MenuItem[] = [];
  for (const item of items) {
    if (item.hidden) {
      continue;
    }
    if (item.children !== undefined) {
      result.push({ ...item, children: filterHidden(item.children) });
    } else {
      result.push(item);
    }
  }
  return result;
}

/**
 * order 排序：有 order 的按升序在前，未指定 order 的保持声明顺序置于其后
 * （sort 稳定性保证同 order / 无 order 项的声明顺序）。
 */
function sortByOrder(items: readonly MenuItem[]): MenuItem[] {
  return [...items].sort(
    (a, b) =>
      (a.order ?? Number.POSITIVE_INFINITY) -
      (b.order ?? Number.POSITIVE_INFINITY),
  );
}

/**
 * MenuRegistry（决策 D2）：由菜单树构建，产出可见菜单树（过滤 hidden）
 * + 扁平可路由条目列表（type 非 group 且有 path），并维护 id 索引。
 *
 * - `findByPath` 按 list() 顺序逐个做路径模式匹配，隐藏页参与匹配；
 * - `findById` 覆盖全树（含 group 与隐藏项）。
 */
export class MenuRegistry {
  private readonly visibleTree: MenuItem[];
  private readonly entries: MenuItem[];
  private readonly byId = new Map<string, MenuItem>();

  constructor(menus: readonly MenuItem[]) {
    this.visibleTree = filterHidden(menus);

    const flat: MenuItem[] = [];
    const walk = (items: readonly MenuItem[]): void => {
      for (const item of items) {
        this.byId.set(item.id, item);
        if (item.type !== 'group' && item.path !== undefined) {
          flat.push(item);
        }
        if (item.children !== undefined) {
          walk(item.children);
        }
      }
    };
    walk(menus);
    this.entries = sortByOrder(flat);
  }

  /** 可见菜单树（过滤 hidden，供 layout 渲染） */
  tree(): MenuItem[] {
    return this.visibleTree;
  }

  /** 扁平可路由条目列表，按 order 排序（未指定者保持声明顺序在后） */
  list(): MenuItem[] {
    return this.entries;
  }

  /** 按 id 查找（含 group 与隐藏项），未找到返回 undefined */
  findById(id: string): MenuItem | undefined {
    return this.byId.get(id);
  }

  /** 按 list() 顺序逐个模式匹配；隐藏页参与匹配；未命中返回 null */
  findByPath(pathname: string): MenuPathMatch | null {
    for (const menu of this.entries) {
      // path 一定存在（entries 仅收有 path 的条目）
      const result = match(menu.path as string, pathname);
      if (result !== null) {
        return { menu, params: result.params };
      }
    }
    return null;
  }
}
