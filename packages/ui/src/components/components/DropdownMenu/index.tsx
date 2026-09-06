import type { CSSProperties, ReactNode } from 'react';

import {
  DropdownMenu as ShadcnDropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../ui/dropdown-menu.js';
import { Icon } from '../Icon/index.js';
import { triggerWrapper } from '../trigger-render.js';

/** 菜单项；danger 项以 destructive 语义呈现 */
export interface DropdownMenuItemData {
  label: string;
  value: string;
  disabled?: boolean;
  danger?: boolean;
  /** 图标名（Icon 白名单，kebab/Pascal 均可），渲染于文字前 */
  icon?: string;
}

export interface DropdownMenuProps {
  /** 菜单项（可含表达式解析后的数组） */
  items?: DropdownMenuItemData[];
  /** 选中事件，传出选中项 value */
  onSelect?: (value: string) => void;
  /** 触发元素（DSL 子树，经 Renderer children 机制渲染） */
  children?: ReactNode;
  /** 通用：根节点 class（挂在弹出内容根节点，与内置样式合并） */
  className?: string;
  /** 通用：内联样式（同 className 挂载规则） */
  style?: CSSProperties;
}

/**
 * DropdownMenu 适配器（shadcn kit）：children 为触发元素（以 span
 * 包装接入 Base UI Trigger，避免按钮嵌套按钮）；菜单项点击触发
 * onSelect 并传出该项 value。
 */
export function DropdownMenu({
  items = [],
  onSelect,
  children,
  className,
  style,
}: DropdownMenuProps) {
  return (
    <ShadcnDropdownMenu>
      <DropdownMenuTrigger
        nativeButton={false}
        render={triggerWrapper('dropdown-menu-trigger-wrap')}
      >
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className={className} style={style}>
        {items.map((item) => (
          <DropdownMenuItem
            key={item.value}
            variant={item.danger ? 'destructive' : 'default'}
            disabled={item.disabled}
            onClick={() => onSelect?.(item.value)}
          >
            {item.icon ? <Icon name={item.icon} size="sm" /> : null}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </ShadcnDropdownMenu>
  );
}
