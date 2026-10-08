import type { CSSProperties, ReactNode } from 'react';

import {
  DropdownMenu as ShadcnDropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../../../ui/dropdown-menu.js';
import { Icon } from '../Icon/index.js';
import { triggerWrapper } from '../trigger-render.js';

/** 菜单项；danger 项以 destructive 语义呈现 */
export interface DropdownMenuItemData {
  /** 分隔线项（true 时忽略其它字段） */
  separator?: boolean;
  label?: string;
  value?: string;
  disabled?: boolean;
  danger?: boolean;
  /** 图标名（Icon 白名单，kebab/Pascal 均可），渲染于文字前 */
  icon?: string;
  /** 右侧弱提示文本（二级菜单触发项上展示当前值，位于箭头前） */
  trailing?: string;
  /** 选中态（文字前展示对勾；同组存在选中项时其余项自动留白对齐） */
  selected?: boolean;
  /** 二级菜单项（悬停/聚焦时在右侧展开） */
  children?: DropdownMenuItemData[];
}

export interface DropdownMenuProps {
  /** 菜单项（可含表达式解析后的数组；支持分隔线、二级菜单、选中态） */
  items?: DropdownMenuItemData[];
  /** 选中事件，传出选中项 value */
  onSelect?: (value: string) => void;
  /** 触发元素（DSL 子树，经 Renderer children 机制渲染） */
  children?: ReactNode;
  /** 弹出方位（缺省 bottom；底部触发器用 top） */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** 弹出对齐（缺省 center） */
  align?: 'start' | 'center' | 'end';
  /** 通用：根节点 class（挂在弹出内容根节点，与内置样式合并） */
  className?: string;
  /** 通用：内联样式（同 className 挂载规则） */
  style?: CSSProperties;
}

export function renderDropdownItems(
  items: DropdownMenuItemData[],
  onSelect: ((value: string) => void) | undefined,
): ReactNode {
  // 同组存在选中项时，未选中项补等宽留白，保持文字对齐
  const checkable = items.some((i) => i.selected);
  return items.map((item, index) => {
    const key = item.value ?? `item-${index}`;
    if (item.separator) {
      return <DropdownMenuSeparator key={`separator-${index}`} />;
    }
    const leading = item.selected ? (
      <Icon name="check" size="sm" />
    ) : item.icon ? (
      <Icon name={item.icon} size="sm" />
    ) : checkable ? (
      <span className="size-4 shrink-0" />
    ) : null;
    if (item.children && item.children.length > 0) {
      return (
        <DropdownMenuSub key={key}>
          <DropdownMenuSubTrigger disabled={item.disabled}>
            {leading}
            {item.label}
            {item.trailing ? (
              <span className="ml-auto pl-4 text-xs text-muted-foreground">
                {item.trailing}
              </span>
            ) : null}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {renderDropdownItems(item.children, onSelect)}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      );
    }
    return (
      <DropdownMenuItem
        key={key}
        variant={item.danger ? 'destructive' : 'default'}
        disabled={item.disabled}
        onClick={() => item.value !== undefined && onSelect?.(item.value)}
      >
        {leading}
        {item.label}
        {item.trailing ? (
          <span className="ml-auto pl-4 text-xs text-muted-foreground">{item.trailing}</span>
        ) : null}
      </DropdownMenuItem>
    );
  });
}

/**
 * DropdownMenu 适配器（shadcn kit）：children 为触发元素（以 span
 * 包装接入 Base UI Trigger，避免按钮嵌套按钮）；菜单项点击触发
 * onSelect 并传出该项 value。项支持 icon / trailing / selected /
 * separator / children（二级菜单）。
 */
export function DropdownMenu({
  items = [],
  onSelect,
  children,
  side,
  align,
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
      <DropdownMenuContent className={className} style={style} side={side} align={align}>
        {renderDropdownItems(items, onSelect)}
      </DropdownMenuContent>
    </ShadcnDropdownMenu>
  );
}
