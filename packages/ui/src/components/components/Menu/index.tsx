import type { CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { Icon } from '../Icon/index.js';

/** 菜单项；`children` 为子菜单（inline 模式下缩进展示） */
export interface MenuItem {
  key: string;
  label: string;
  /** 图标名（Icon 白名单，kebab/Pascal 均可），渲染于文字前 */
  icon?: string;
  /** label 后的角标（inline 模式右对齐展示） */
  badge?: string | number;
  /** label 右侧的 danger 系状态圆点（与 badge 可共存） */
  dot?: boolean;
  /** 分组标题（inline 模式顶层；相邻同组项只渲染一次） */
  group?: string;
  /** 置灰不可选，点击不触发 onSelect */
  disabled?: boolean;
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
  /** 通用：根节点内联样式（同 className 挂载规则） */
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
  let previousGroup: string | undefined;
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
      {items.map((item) => {
        // 分组标题（inline 顶层）：相邻同组只渲染一次
        let groupLabel: string | undefined;
        if (mode === 'inline' && item.group !== undefined && item.group !== previousGroup) {
          groupLabel = item.group;
        }
        previousGroup = item.group;
        return (
          <div key={item.key} data-slot="menu-group-entry">
            {groupLabel !== undefined && (
              <div
                data-slot="menu-group"
                className="px-3 pb-1 pt-3 text-xs font-medium text-muted-foreground first:pt-1"
              >
                {groupLabel}
              </div>
            )}
            <MenuEntry
              item={item}
              mode={mode}
              depth={0}
              selectedKey={selectedKey}
              onSelect={onSelect}
            />
          </div>
        );
      })}
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
        disabled={item.disabled}
        className={cn(
          'flex w-full items-center gap-2 rounded-md text-sm transition-colors',
          mode === 'horizontal' ? 'px-3 py-2' : 'px-3 py-2 text-left',
          selected
            ? 'bg-accent font-medium text-accent-foreground'
            : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
          item.disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent hover:text-muted-foreground',
        )}
        style={mode === 'inline' && depth > 0 ? { paddingLeft: 12 + depth * 16 } : undefined}
        onClick={() => {
          if (!item.disabled) {
            onSelect?.(item.key);
          }
        }}
      >
        {item.icon ? <Icon name={item.icon} size="sm" /> : null}
        <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
        {item.dot ? (
          <span data-slot="menu-item-dot" className="size-1.5 shrink-0 rounded-full bg-destructive" />
        ) : null}
        {item.badge !== undefined ? (
          <span
            data-slot="menu-item-badge"
            className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
          >
            {item.badge}
          </span>
        ) : null}
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
