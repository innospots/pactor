import type { CSSProperties } from 'react';

import {
  NavigationMenu as ShadcnNavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '../../../ui/navigation-menu.js';

/** 子链接项 */
export interface NavigationMenuChildItem {
  label: string;
  href: string;
  description?: string;
}

/** 导航项：href 直链，或 children 下拉面板 */
export interface NavigationMenuItemData {
  label: string;
  href?: string;
  children?: NavigationMenuChildItem[];
}

export interface NavigationMenuProps {
  /** 导航项（可含表达式解析后的数组） */
  items?: NavigationMenuItemData[];
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * NavigationMenu 适配器（shadcn kit）：items 声明一级导航；
 * 含 children 的项渲染为触发器 + 下拉面板（链接含 description），
 * 仅含 href 的项渲染为直链。
 */
export function NavigationMenu({ items = [], className, style }: NavigationMenuProps) {
  return (
    <ShadcnNavigationMenu className={className} style={style}>
      <NavigationMenuList>
        {items.map((item, index) => (
          <NavigationMenuItem key={`${item.label}-${index}`} value={`item-${index}`}>
            {item.children && item.children.length > 0 ? (
              <>
                <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-64 gap-1">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <NavigationMenuLink href={child.href}>
                          <span className="font-medium">{child.label}</span>
                          {child.description ? (
                            <span className="text-muted-foreground">
                              {child.description}
                            </span>
                          ) : null}
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink
                href={item.href}
                className={navigationMenuTriggerStyle()}
              >
                {item.label}
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </ShadcnNavigationMenu>
  );
}
