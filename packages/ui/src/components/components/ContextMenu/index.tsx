import type { CSSProperties, ReactNode } from 'react';

import {
  ContextMenu as ShadcnContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '../../../ui/context-menu.js';
import { Icon } from '../Icon/index.js';

/** 菜单项；danger 项以 destructive 语义呈现 */
export interface ContextMenuItemData {
  label: string;
  value: string;
  disabled?: boolean;
  danger?: boolean;
  /** 图标名（Icon 白名单，kebab/Pascal 均可），渲染于文字前 */
  icon?: string;
}

export interface ContextMenuProps {
  /** 菜单项（可含表达式解析后的数组） */
  items?: ContextMenuItemData[];
  /** 选中事件，传出选中项 value */
  onSelect?: (value: string) => void;
  /** 右键作用区域（DSL 子树，经 Renderer children 机制渲染） */
  children?: ReactNode;
  /** 通用：根节点 class（挂在弹出内容根节点，与内置样式合并） */
  className?: string;
  /** 通用：内联样式（同 className 挂载规则） */
  style?: CSSProperties;
}

/**
 * ContextMenu 适配器（shadcn kit）：children 为右键作用区域；
 * 菜单项点击触发 onSelect 并传出该项 value。
 */
export function ContextMenu({
  items = [],
  onSelect,
  children,
  className,
  style,
}: ContextMenuProps) {
  return (
    <ShadcnContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className={className} style={style}>
        {items.map((item) => (
          <ContextMenuItem
            key={item.value}
            variant={item.danger ? 'destructive' : 'default'}
            disabled={item.disabled}
            onClick={() => onSelect?.(item.value)}
          >
            {item.icon ? <Icon name={item.icon} size="sm" /> : null}
            {item.label}
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ShadcnContextMenu>
  );
}
