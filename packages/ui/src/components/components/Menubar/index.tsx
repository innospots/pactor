import type { CSSProperties } from 'react';

import {
  Menubar as ShadcnMenubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '../../../ui/menubar.js';
import { Icon } from '../Icon/index.js';

/** 菜单项（叶子）；value 为 onSelect 传出值 */
export interface MenubarLeafItem {
  label: string;
  value: string;
  disabled?: boolean;
  /** 图标名（Icon 白名单，kebab/Pascal 均可），渲染于文字前 */
  icon?: string;
}

/** 一级菜单（嵌套叶子项） */
export interface MenubarMenuData {
  label: string;
  items: MenubarLeafItem[];
}

export interface MenubarProps {
  /** 菜单组（可含表达式解析后的数组） */
  menus?: MenubarMenuData[];
  /** 选中事件，传出选中项 value */
  onSelect?: (value: string) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * Menubar 适配器（shadcn kit）：menus 声明嵌套菜单，叶子项点击
 * 触发 onSelect 并传出该项 value（DSL 语义值，非 DOM 事件）。
 */
export function Menubar({ menus = [], onSelect, className, style }: MenubarProps) {
  return (
    <ShadcnMenubar className={className} style={style}>
      {menus.map((menu) => (
        <MenubarMenu key={menu.label}>
          <MenubarTrigger>{menu.label}</MenubarTrigger>
          <MenubarContent>
            {menu.items.map((item) => (
              <MenubarItem
                key={item.value}
                disabled={item.disabled}
                onClick={() => onSelect?.(item.value)}
              >
                {item.icon ? <Icon name={item.icon} size="sm" /> : null}
                {item.label}
              </MenubarItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
      ))}
    </ShadcnMenubar>
  );
}
