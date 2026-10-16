import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import {
  DropdownMenu as ShadcnDropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../../../ui/dropdown-menu.js';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../ui/popover.js';
import {
  renderDropdownItems,
  type DropdownMenuItemData,
} from '../DropdownMenu/index.js';
import { Icon } from '../Icon/index.js';
import { RailTooltip } from '../Sidebar/rail-tooltip.js';
import { useSidebarDrawer } from '../Sidebar/index.js';
import { Tooltip } from '../Tooltip/index.js';
import { triggerWrapper } from '../trigger-render.js';

/** 菜单项右端操作按钮；`menu` 提供时点击展开下拉框 */
export interface MenuItemAction {
  key: string;
  /** 图标名（Icon 白名单，kebab/Pascal 均可） */
  icon: string;
  /** hover 提示文案 */
  tooltip?: string;
  /** 下拉菜单项；选择后 onItemAction 的 action 传 `${actionKey}:${itemValue}` */
  menu?: DropdownMenuItemData[];
}

/** onItemAction 事件载荷 */
export interface MenuItemActionEvent {
  /** 所属菜单项 key */
  key: string;
  /** 操作标识：纯图标按钮为 action.key；下拉选择为 `${action.key}:${value}` */
  action: string;
}

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
  /** 右端弱提示文本（如创建时间），位于操作按钮前；点击不触发 onSelect */
  trailing?: string;
  /** 右端操作按钮组（图标按钮 / 下拉触发器）；点击不触发 onSelect / 目录 toggle */
  actions?: MenuItemAction[];
  children?: MenuItem[];
}

export interface MenuProps {
  /** 菜单项（可含表达式，如 `${data.menus}`） */
  items?: MenuItem[];
  /** 展示模式：inline（Sider 内纵向，缺省）| horizontal（Header 内横向） */
  mode?: 'inline' | 'horizontal';
  /** 受控选中项 key（可绑 `${state.x}`） */
  selectedKey?: string;
  /**
   * 可折叠子菜单（仅 inline 模式生效，缺省 false）：含 children 的目录项
   * 点击展开/收起（不触发 onSelect），右端 chevron 指示
   */
  collapsible?: boolean;
  /** 强制图标轨形态（仅图标，label/badge 隐藏，hover 经 RailTooltip 展示）；
   *  缺省跟随所在 Sidebar 的折叠态；右轨等脱离 Sidebar 的场景用它 */
  collapsed?: boolean;
  /** 初始展开的目录 key（与 selectedKey 祖先链合并；展开状态非受控） */
  defaultExpandedKeys?: string[];
  /** 初始展开全部目录（仅配合 collapsible；优于 defaultExpandedKeys，
   *  运行时动态新增的目录同样默认展开，适合数据驱动的树） */
  defaultExpandAll?: boolean;
  /** 目录项 chevron 展开指示的位置（仅配合 collapsible，缺省 right）：
   *  left = 图标/文字前（树形风格）；right = 行内右端 */
  chevronPlacement?: 'left' | 'right';
  /** 选中变化事件，传出选中项 key */
  onSelect?: (key: string) => void;
  /** 项操作事件（trailing 旁的操作按钮 / 下拉选择），传出 { key, action } */
  onItemAction?: (event: MenuItemActionEvent) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式（同 className 挂载规则） */
  style?: CSSProperties;
}

/** 沿菜单树找到 target 并把其祖先目录 key 写入 into（找到返回 true） */
function collectAncestors(
  items: MenuItem[],
  target: string,
  into: Set<string>,
  trail: string[] = [],
): boolean {
  for (const item of items) {
    if (item.key === target) {
      for (const key of trail) into.add(key);
      return true;
    }
    if (
      item.children?.length &&
      collectAncestors(item.children, target, into, [...trail, item.key])
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Menu 导航菜单（shadcn kit）：哑渲染组件——items 经表达式注入，
 * 不直接读取外壳层 MenuRegistry；选中态受控（selectedKey + onSelect
 * 闭环，典型接 navigate 动作）。在 Sidebar 内且侧栏折叠（icon rail）
 * 时自动降级为仅图标（label / badge / dot / 分组隐藏，hover 经 RailTooltip 展示）。
 * `collapsible`（仅 inline 模式）使含 children 的目录项可展开/收起：
 * 点击目录项只 toggle 不触发 onSelect，右端 chevron 展开时旋转 180°；
 * 展开状态内部维护，初始为 defaultExpandedKeys ∪ selectedKey 祖先链，
 * 或 defaultExpandAll 时全部展开（含运行时新增的目录）。inline 模式下
 * 目录项不可选中（无选中态、不触发 onSelect）；trailing / actions 与
 * 文字共用同一行容器，悬浮 / 选中底色覆盖整行。
 */
export function Menu({
  items = [],
  mode = 'inline',
  selectedKey,
  collapsible = false,
  collapsed: collapsedProp,
  defaultExpandedKeys,
  defaultExpandAll = false,
  chevronPlacement = 'right',
  onSelect,
  onItemAction,
  className,
  style,
}: MenuProps) {
  const drawer = useSidebarDrawer();
  const collapsed =
    collapsedProp ?? (mode === 'inline' && drawer?.collapsed === true);
  // icon rail 与 horizontal 不受 collapsible 影响（子菜单静态展开平铺）
  const collapsibleOn = collapsible && mode === 'inline' && !collapsed;

  // 非受控展开态：base 挂载时算一次（selectedKey 后续变化不重置用户手动
  // 状态）；toggled 记录用户手动翻转。基准 = defaultExpandAll ∨ base，
  // 翻转语义使运行时新增的目录在 defaultExpandAll 下同样默认展开
  const [baseExpandedKeys] = useState<Set<string>>(() => {
    const initial = new Set(defaultExpandedKeys ?? []);
    if (selectedKey !== undefined) {
      collectAncestors(items, selectedKey, initial);
    }
    return initial;
  });
  const [toggledKeys, setToggledKeys] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const isExpanded = (key: string) => {
    const base = defaultExpandAll || baseExpandedKeys.has(key);
    return toggledKeys.has(key) ? !base : base;
  };

  const toggleExpanded = (key: string) => {
    setToggledKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };
  let previousGroup: string | undefined;
  return (
    <nav
      data-slot="menu"
      data-mode={mode}
      data-collapsed={collapsed || undefined}
      className={cn(
        mode === 'horizontal' ? 'flex items-center gap-1' : 'flex flex-col gap-0.5 p-2',
        className,
      )}
      style={style}
    >
      {items.map((item) => {
        // 分组标题（inline 顶层）：相邻同组只渲染一次；icon rail 不渲染
        let groupLabel: string | undefined;
        if (
          !collapsed &&
          mode === 'inline' &&
          item.group !== undefined &&
          item.group !== previousGroup
        ) {
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
              onItemAction={onItemAction}
              collapsed={collapsed}
              collapsible={collapsibleOn}
              chevronPlacement={chevronPlacement}
              isExpanded={isExpanded}
              onToggle={toggleExpanded}
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
  onItemAction,
  collapsed = false,
  collapsible = false,
  chevronPlacement = 'right',
  isExpanded,
  onToggle,
}: {
  item: MenuItem;
  mode: 'inline' | 'horizontal';
  depth: number;
  selectedKey?: string;
  onSelect?: (key: string) => void;
  onItemAction?: (event: MenuItemActionEvent) => void;
  collapsed?: boolean;
  collapsible?: boolean;
  chevronPlacement?: 'left' | 'right';
  isExpanded?: (key: string) => boolean;
  onToggle?: (key: string) => void;
}) {
  const hasChildren = (item.children?.length ?? 0) > 0;
  // inline 非折叠下含 children 的项为目录：不可选中（无选中态、不触发
  // onSelect）；collapsible 提供折叠能力，未开启时静态展开、点击为空操作
  const isDirectory = hasChildren && mode === 'inline' && !collapsed;
  const canToggle = collapsible && isDirectory;
  const expanded = canToggle && isExpanded?.(item.key) === true;
  const selected = !isDirectory && item.key === selectedKey;
  // icon rail 下的目录项：子菜单经右侧滑出浮层展示（不平铺仅图标按钮）
  const railDirectory = collapsed && hasChildren;
  // 行容器形态：右端 trailing / actions 与按钮同级，悬浮/选中底色上提到行
  const hasRowExtras =
    !collapsed &&
    (item.trailing !== undefined || (item.actions?.length ?? 0) > 0);

  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const flyoutTimer = useRef<number | undefined>(undefined);
  // hover 进入立即开、移出延迟 200ms 关（浮层本身同挂保持），对齐 AdminLayout CollapsedGroupFlyout
  const flyoutOpenNow = () => {
    window.clearTimeout(flyoutTimer.current);
    setFlyoutOpen(true);
  };
  const flyoutCloseLater = () => {
    window.clearTimeout(flyoutTimer.current);
    flyoutTimer.current = window.setTimeout(() => setFlyoutOpen(false), 200);
  };
  useEffect(() => () => window.clearTimeout(flyoutTimer.current), []);

  // 目录展开指示：chevronPlacement 决定渲染在图标/文字前（left）或行内右端（right）
  const chevron = canToggle ? (
    <span
      data-slot="menu-item-chevron"
      className={cn(
        'shrink-0 transition-transform',
        expanded && 'rotate-180',
      )}
    >
      <Icon name="chevron-down" size="sm" />
    </span>
  ) : null;

  const button = (
    <button
      type="button"
      data-slot="menu-item"
      aria-current={selected ? 'page' : undefined}
      aria-expanded={canToggle ? expanded : railDirectory ? flyoutOpen : undefined}
      disabled={item.disabled}
      className={cn(
        // w-full 兜底非 flex 父容器（rail / flyout）；flex-1 min-w-0 供
        // 行容器（trailing / actions 与按钮同级）内收缩
        'flex w-full min-w-0 flex-1 items-center gap-2 text-sm transition-colors',
        mode === 'horizontal' ? 'px-3 py-2' : 'px-3 py-2 text-left',
        collapsed && 'justify-center px-0',
        // 行容器形态下圆角与悬浮/选中底色由 menu-item-row 承担，按钮本体透明
        hasRowExtras
          ? item.disabled
            ? 'cursor-not-allowed'
            : 'cursor-pointer'
          : cn(
              'rounded-md',
              selected
                ? 'bg-(--menu-active-background) font-medium text-(--menu-active-foreground)'
                : 'cursor-pointer text-foreground hover:bg-(--menu-hover-background)/50',
              item.disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent hover:text-muted-foreground',
            ),
      )}
      style={mode === 'inline' && depth > 0 && !collapsed ? { paddingLeft: 12 + depth * 16 } : undefined}
      onMouseEnter={railDirectory ? flyoutOpenNow : undefined}
      onMouseLeave={railDirectory ? flyoutCloseLater : undefined}
      onClick={() => {
        if (item.disabled) return;
        // railDirectory 的开合由 PopoverTrigger 自身处理（点击切换）
        if (railDirectory) return;
        // 目录项不可选中：只在 collapsible 下 toggle 展开/收起
        if (isDirectory) {
          if (canToggle) onToggle?.(item.key);
          return;
        }
        onSelect?.(item.key);
      }}
    >
      {chevronPlacement === 'left' ? chevron : null}
      {item.icon ? <Icon name={item.icon} size="sm" /> : null}
      {collapsed ? null : (
        <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
      )}
      {item.dot && !collapsed ? (
        <span data-slot="menu-item-dot" className="size-1.5 shrink-0 rounded-full bg-destructive" />
      ) : null}
      {item.badge !== undefined && !collapsed ? (
        <span
          data-slot="menu-item-badge"
          className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
        >
          {item.badge}
        </span>
      ) : null}
      {chevronPlacement === 'left' ? null : chevron}
    </button>
  );
  return (
    <div data-slot="menu-entry" data-key={item.key}>
      {railDirectory ? (
        <Popover open={flyoutOpen} onOpenChange={setFlyoutOpen}>
          <PopoverTrigger render={button} />
          <PopoverContent
            data-slot="menu-flyout"
            side="right"
            align="start"
            sideOffset={8}
            className="max-h-[70vh] w-48 overflow-auto p-1"
            // hover 浮层：不抢占焦点
            initialFocus={false}
            onMouseEnter={flyoutOpenNow}
            onMouseLeave={flyoutCloseLater}
            onClick={(event) => {
              // 浮层内点中菜单项后关闭浮层
              if ((event.target as HTMLElement).closest('[data-slot=menu-item]')) {
                setFlyoutOpen(false);
              }
            }}
          >
            <div className="px-3 pt-2 pb-1 text-xs font-semibold text-muted-foreground">
              {item.label}
            </div>
            {/* 子菜单以非 collapsed 完整形态渲染（label/icon/badge/dot/选中态） */}
            {item.children?.map((child) => (
              <MenuEntry
                key={child.key}
                item={child}
                mode="inline"
                depth={0}
                selectedKey={selectedKey}
                onSelect={onSelect}
                onItemAction={onItemAction}
              />
            ))}
          </PopoverContent>
        </Popover>
      ) : collapsed ? (
        <RailTooltip label={item.label}>{button}</RailTooltip>
      ) : hasRowExtras ? (
        // 行容器：按钮主体 + 右端弱提示文本 / 操作按钮（同级节点，避免按钮
        // 嵌套按钮；操作点击不冒泡到 onSelect / 目录 toggle）。悬浮/选中
        // 底色覆盖整行，文字与右端操作不产生割裂感
        <div
          data-slot="menu-item-row"
          className={cn(
            'flex w-full items-center gap-1 rounded-md pr-1.5 transition-colors',
            selected
              ? 'bg-(--menu-active-background) font-medium text-(--menu-active-foreground)'
              : 'text-foreground hover:bg-(--menu-hover-background)/50',
            item.disabled && 'opacity-50',
          )}
        >
          {button}
          {item.trailing !== undefined ? (
            <span
              data-slot="menu-item-trailing"
              className="shrink-0 text-xs text-muted-foreground"
            >
              {item.trailing}
            </span>
          ) : null}
          {(item.actions?.length ?? 0) > 0 ? (
            <span
              data-slot="menu-item-actions"
              className="flex shrink-0 items-center gap-0.5"
            >
              {item.actions!.map((action) => (
                <MenuItemActionButton
                  key={action.key}
                  itemKey={item.key}
                  action={action}
                  disabled={item.disabled}
                  onItemAction={onItemAction}
                />
              ))}
            </span>
          ) : null}
        </div>
      ) : (
        button
      )}
      {/* collapsible 目录：收起时不渲染子菜单；rail 目录走 flyout；其余静态展开 */}
      {railDirectory || (canToggle && !expanded)
        ? null
        : item.children?.map((child) => (
            <MenuEntry
              key={child.key}
              item={child}
              mode={mode}
              depth={depth + 1}
              selectedKey={selectedKey}
              onSelect={onSelect}
              onItemAction={onItemAction}
              collapsed={collapsed}
              collapsible={collapsible}
              chevronPlacement={chevronPlacement}
              isExpanded={isExpanded}
              onToggle={onToggle}
            />
          ))}
    </div>
  );
}

/** 菜单项右端操作按钮：纯图标按钮直接上报；带 menu 的为下拉触发器 */
function MenuItemActionButton({
  itemKey,
  action,
  disabled,
  onItemAction,
}: {
  itemKey: string;
  action: MenuItemAction;
  disabled?: boolean;
  onItemAction?: (event: MenuItemActionEvent) => void;
}) {
  const button = (
    <button
      type="button"
      data-slot="menu-item-action"
      data-action={action.key}
      disabled={disabled}
      className="shrink-0 cursor-pointer rounded p-0.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
      onClick={(event) => {
        // 下拉触发器：放行冒泡给 Base UI Trigger span 接管开合；
        // 纯图标按钮：截停冒泡并上报（行容器无点击行为，双保险）
        if (action.menu) return;
        event.stopPropagation();
        if (disabled) return;
        onItemAction?.({ key: itemKey, action: action.key });
      }}
    >
      <Icon name={action.icon} size="sm" />
    </button>
  );
  if (!action.menu) {
    return action.tooltip ? (
      <Tooltip content={action.tooltip}>{button}</Tooltip>
    ) : (
      button
    );
  }
  if (disabled) return button;
  return (
    <ShadcnDropdownMenu>
      <DropdownMenuTrigger
        nativeButton={false}
        render={triggerWrapper('menu-item-action-trigger')}
      >
        {button}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="min-w-32">
        {renderDropdownItems(action.menu, (value) =>
          onItemAction?.({ key: itemKey, action: `${action.key}:${value}` }),
        )}
      </DropdownMenuContent>
    </ShadcnDropdownMenu>
  );
}
