"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface ModuleSidebarItem {
  path: string;
  title: string;
}

/**
 * 模块二级侧栏（不含一级图标轨）：模块独立运行时的菜单外壳。
 * 一级菜单由对接后的主应用（web-shell rail）提供，模块自身只保留
 * 分组子菜单；样式复用 @pactor-app/shell 的 kn-sidebar/kn-menu 系列。
 */
export function ModuleSidebar({
  title,
  items = [],
}: {
  title?: string;
  items?: ModuleSidebarItem[];
}) {
  const pathname = usePathname() ?? "/";
  return (
    <aside className="kn-sidebar" aria-label={title}>
      {title ? <div className="kn-sidebar-title">{title}</div> : null}
      <nav className="kn-menu">
        {items.map((item) => {
          const active =
            item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              aria-current={active ? "page" : undefined}
              className={active ? "kn-menu-item is-active" : "kn-menu-item"}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
