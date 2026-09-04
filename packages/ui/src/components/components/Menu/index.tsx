import type { CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';

/** 菜单项；`children` 为子菜单（inline 模式下缩进展示） */
export interface MenuItem {
  key: string;
  label: string;
  /** 图标名（预留，当前版本不渲染） */
  icon?: string;
  children?: MenuItem[];
}

export interface MenuProps {
  /** 菜单项（可含表达式，如 `${data.menus}`） */
  items?: MenuItem[];
  /** 展示模式：inline（Sider 内纵向，缺省）| horizontal（Header 内横向） */
  mode?: 'inline' | 'horizontal';
  /** 受控选中项 key（可绑 `${state.x}`） */
  selectedKey?: string;
  /** 选中变化事件，传出选中项 key */
  onSelect?: (key: string) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * Menu 导航菜单（shadcn kit）：哑渲染组件——items 经表达式注入，
 * 不直接读取外壳层 MenuRegistry；选中态受控（selectedKey + onSelect
 * 闭环，典型接 navigate 动作）。
 */
export function Menu({
  items = [],
  mode = 'inline',
  selectedKey,
  onSelect,
  className,
  style,
}: MenuProps) {
  return (
    <nav
      data-slot="menu"
      data-mode={mode}
      className={cn(
        mode === 'horizontal' ? 'flex items-center gap-1' : 'flex flex-col gap-0.5 p-2',
        className,
      )}
      style={style}
    >
      {items.map((item) => (
        <MenuEntry
          key={item.key}
          item={item}
          mode={mode}
          depth={0}
          selectedKey={selectedKey}
          onSelect={onSelect}
        />
      ))}
    </nav>
  );
}

function MenuEntry({
  item,
  mode,
  depth,
  selectedKey,
  onSelect,
}: {
  item: MenuItem;
  mode: 'inline' | 'horizontal';
  depth: number;
  selectedKey?: string;
  onSelect?: (key: string) => void;
}) {
  const selected = item.key === selectedKey;
  return (
    <div data-slot="menu-entry" data-key={item.key}>
      <button
        type="button"
        data-slot="menu-item"
        aria-current={selected ? 'page' : undefined}
        className={cn(
          'flex w-full items-center rounded-md text-sm transition-colors',
          mode === 'horizontal' ? 'px-3 py-2' : 'px-3 py-2 text-left',
          selected
            ? 'bg-accent font-medium text-accent-foreground'
            : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
        )}
        style={mode === 'inline' && depth > 0 ? { paddingLeft: 12 + depth * 16 } : undefined}
        onClick={() => onSelect?.(item.key)}
      >
        {item.label}
      </button>
      {item.children?.map((child) => (
        <MenuEntry
          key={child.key}
          item={child}
          mode={mode}
          depth={depth + 1}
          selectedKey={selectedKey}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
