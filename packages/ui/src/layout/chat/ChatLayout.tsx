import { filterMenusByPermission } from "@pactor-app/permission";
import type { MenuItem as RouterMenuItem } from "@pactor-app/router";
import { useEffect, useMemo, useState } from "react";

import { Menu, type MenuItem } from "../../components/components/Menu/index.js";
import { Sidebar } from "../../components/components/Sidebar/index.js";
import type { ChatLayoutMenuItem, ChatLayoutProps } from "../types.js";

/**
 * ChatLayout（设计决策 D7）：聊天场景外壳布局——
 * 品牌区 + 菜单侧栏 + 主内容区，基于 ui `Sidebar` + `Menu` 组件组合。
 *
 * 菜单来源优先级（高 → 低）：
 * 1. `sidebar` 槽：自由侧栏内容，整体替代内建菜单；
 * 2. `menu` 显式数据：调用方直接提供菜单项（含 icon/badge/dot/group/disabled）；
 * 3. `registry` 推导：app-shell 注入的 MenuRegistry 可见树
 *    （group 类型项 → 分组标签，page/link → 菜单项，permissionChecker 过滤）；
 * 4. 空侧栏：以上均无时不渲染侧栏，主区通栏。
 *
 * 导航行为：`onMenuSelect` 提供时调用之（disabled 项不触发）；
 * 否则有 `bridge` 且项有 `path` 时 `bridge.push(path)`。
 *
 * 高亮推导优先级：`activeMenuKey` > `route`（测试友好）>
 * `bridge` 订阅 location 按 `path === pathname` 命中。
 *
 * 与 chat 包的 `ChatLayout`（header + ChatView 极简布局）不同，
 * 本组件是带侧栏菜单的完整外壳，两者不冲突（不同包导出）。
 */
export function ChatLayout({
  brand,
  menu,
  registry,
  bridge,
  route: routeProp,
  permissionChecker,
  activeMenuKey,
  onMenuSelect,
  collapsible,
  sidebar,
  sidebarFooter,
  children,
}: ChatLayoutProps) {
  // registry 推导的菜单（仅当无显式 menu 时计算）
  const registryMenus = useMemo(() => {
    if (menu !== undefined || registry === undefined) {
      return [];
    }
    const tree = registry.tree();
    const visible =
      permissionChecker !== undefined
        ? filterMenusByPermission(tree, permissionChecker)
        : tree;
    return visible.flatMap((item) => menuItemToMenuData(item));
  }, [menu, registry, permissionChecker]);

  const menuItems = menu ?? registryMenus;

  // bridge 订阅 location 推导 active（route props 优先，测试友好）
  const [bridgePath, setBridgePath] = useState<string>(
    () => bridge?.getLocation().pathname ?? "/",
  );
  useEffect(() => {
    if (bridge === undefined) {
      return;
    }
    return bridge.subscribe((location) => {
      setBridgePath(location.pathname);
    });
  }, [bridge]);

  const activeKey = useMemo(() => {
    if (activeMenuKey !== undefined) {
      return activeMenuKey;
    }
    // route 优先（测试友好）
    const path = routeProp?.path ?? bridgePath;
    return menuItems.find((item) => item.path === path)?.key;
  }, [activeMenuKey, routeProp, bridgePath, menuItems]);

  // 导航：onMenuSelect 优先，否则 bridge.push
  const handleSelect = (key: string) => {
    const item = menuItems.find((m) => m.key === key);
    if (item === undefined || item.disabled === true) {
      return;
    }
    if (onMenuSelect !== undefined) {
      onMenuSelect(key, item);
      return;
    }
    if (bridge !== undefined && item.path !== undefined) {
      bridge.push(item.path);
    }
  };

  // 侧栏内容：sidebar 槽 > 内建菜单 > 空
  const sidebarContent =
    sidebar !== undefined && sidebar !== null ? (
      sidebar
    ) : menuItems.length > 0 ? (
      <Menu
        items={menuItems.map((item) => chatMenuItemToUiMenuItem(item))}
        selectedKey={activeKey}
        onSelect={handleSelect}
      />
    ) : undefined;

  return (
    <Sidebar
      brand={brand}
      content={sidebarContent}
      sidebarFooter={sidebarFooter}
      collapsible={collapsible}
      locationKey={routeProp?.path ?? bridgePath}
    >
      {/* 内容区背景撑满：chat 工作区（max-width 限宽居中）两侧留白区域
          也覆盖 chat 背景色（--pactor-chat-bg），避免视觉断裂 */}
      <div
        data-slot="chat-layout-content"
        className="flex min-h-0 flex-1 flex-col"
      >
        {children}
      </div>
    </Sidebar>
  );
}

/** ChatLayoutMenuItem → ui Menu 组件的 MenuItem（去掉 path 字段，Menu 不感知路由） */
function chatMenuItemToUiMenuItem(item: ChatLayoutMenuItem): MenuItem {
  return {
    key: item.key,
    label: item.label,
    icon: item.icon,
    badge: item.badge,
    dot: item.dot,
    group: item.group,
    disabled: item.disabled,
  };
}

/** router MenuItem → ChatLayoutMenuItem（group 类型项展开为分组标签） */
function menuItemToMenuData(item: RouterMenuItem): ChatLayoutMenuItem[] {
  if (item.type === "group") {
    // group 类型项：作为分组标签，children 递归展开
    const children = (item.children ?? []).flatMap((child) =>
      menuItemToMenuData(child),
    );
    if (children.length === 0) {
      return [];
    }
    // 首个子项带 group 标签，后续子项同组（Menu 组件相邻同组只渲染一次）
    return children.map((child, index) => ({
      ...child,
      group: index === 0 ? item.title : undefined,
    }));
  }
  if (item.hidden === true) {
    return [];
  }
  // 扩展字段（bootstrap 声明的 group/dot 等）由 sanitizeMenus 保留，
  // 类型上不在 router MenuItem 接口中，运行时读取
  const ext = item as RouterMenuItem & { group?: string; dot?: boolean };
  return [
    {
      key: item.id,
      label: item.title,
      icon: item.icon,
      path: item.path,
      badge: item.badge,
      dot: ext.dot,
      group: ext.group,
      disabled: item.disabled,
    },
  ];
}
