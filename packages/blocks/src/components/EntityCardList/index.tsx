import { useI18n } from '@pactor-app/runtime';
import { Copy, Ellipsis, Power, Trash2, type LucideIcon } from 'lucide-react';
import { Fragment, type CSSProperties } from 'react';

import { cn } from '../../lib/utils.js';
import { Card } from '@pactor-app/ui/components';
import { Empty } from '@pactor-app/ui/components';
import { Icon } from '@pactor-app/ui/components';
import { Text } from '@pactor-app/ui/components';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@pactor-app/ui/ui';
import {
  EntityCard,
  type EntityCardAction,
  type EntityCardExpandingAction,
  type EntityCardTag,
} from '../EntityCard/index.js';

/** 卡片数据项：字段与 EntityCard props 同形，可携带额外业务字段（事件参数原样回传） */
export interface EntityCardListItem {
  icon?: string;
  logo?: string;
  title?: string;
  subtitle?: string;
  tags?: EntityCardTag[];
  description?: string;
  meta?: string;
  actions?: EntityCardAction[];
  expandingActions?: EntityCardExpandingAction[];
  [key: string]: unknown;
}

/** 卡片右上角菜单项：value 随 onMenuSelect 事件回传；danger 项以红色呈现 */
export interface EntityCardMenuItem {
  value: string;
  label: string;
  /** 图标名（copy / power / trash）；缺省按 value 匹配，未知值不渲染图标 */
  icon?: string;
  /** 危险操作（如删除），菜单项以红色呈现 */
  danger?: boolean;
}

export interface EntityCardListProps {
  /** 卡片数据 */
  items?: EntityCardListItem[];
  /** 网格列数，默认 3 */
  columns?: number;
  /** 卡片间距（px），默认 16 */
  gap?: number;
  /** 配置后首格展示虚线新建占位卡（文案如「新建插件」） */
  createText?: string;
  /** 新建占位卡图标，默认 plus */
  createIcon?: string;
  /** 卡片是否整卡可点（透传 EntityCard hoverable），默认 false */
  hoverable?: boolean;
  /** 底部是否展示「共 N 个」计数，默认 false */
  showCount?: boolean;
  /** 空数据文案（默认 i18n pactor.table.empty） */
  emptyText?: string;
  /** 卡片右上角菜单项；配置后每张卡片常显省略号，点击展开菜单 */
  menuItems?: EntityCardMenuItem[];
  /** 菜单按钮的无障碍标签（不显示在界面上），默认 More */
  menuLabel?: string;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
  /** 整卡点击，参数 { item, index } */
  onItemClick?: (event: { item: EntityCardListItem; index: number }) => void;
  /** 卡内操作按钮点击，参数 { key, text, item, index } */
  onItemAction?: (event: { key: string; text: string; item: EntityCardListItem; index: number }) => void;
  /** 卡内展开式操作组选中（confirm 选项需二次点击），参数 { value, item, index } */
  onItemExpandingAction?: (event: { value: string; item: EntityCardListItem; index: number }) => void;
  /** 右上角菜单项选中，参数 { value, item, index } */
  onMenuSelect?: (event: { value: string; item: EntityCardListItem; index: number }) => void;
  /** 新建占位卡点击 */
  onCreateClick?: () => void;
}

const menuIcons: Record<string, LucideIcon> = {
  copy: Copy,
  power: Power,
  offline: Power,
  trash: Trash2,
  'trash-2': Trash2,
  delete: Trash2,
};

/**
 * EntityCardList 实体卡片列表（区块组件）：响应式网格渲染实体摘要卡，
 * 支持首格新建占位卡、空状态与结果计数；配置 menuItems 后每张卡片右上角
 * 常显省略号，点击展开卡片菜单（替代悬停展开的「更多」文字）。
 * 交互经 events 编排（onItemClick / onItemAction / onItemExpandingAction /
 * onMenuSelect / onCreateClick，参数经 ${event} 读取）。
 */
export function EntityCardList({
  items,
  columns = 3,
  gap = 16,
  createText,
  createIcon = 'plus',
  hoverable,
  showCount,
  emptyText,
  menuItems,
  menuLabel,
  className,
  style,
  onItemClick,
  onItemAction,
  onItemExpandingAction,
  onMenuSelect,
  onCreateClick,
}: EntityCardListProps) {
  const { t } = useI18n();
  const list = items ?? [];
  const menu = menuItems ?? [];

  return (
    <div data-slot="entity-card-list" className={cn('flex flex-col gap-3', className)} style={style}>
      {list.length === 0 && !createText ? (
        <Empty title={emptyText ?? t('pactor.table.empty')} />
      ) : (
        <div
          data-slot="entity-card-list-grid"
          className="grid"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap }}
        >
          {createText ? (
            <Card
              hoverable
              className="h-full border-dashed"
              contentClassName="flex flex-1 flex-col items-center justify-center gap-2"
              onClick={onCreateClick}
            >
              <Icon name={createIcon} size="lg" className="text-muted-foreground" />
              <Text text={createText} type="secondary" />
            </Card>
          ) : null}
          {list.map((item, index) => {
            const card = (
              <EntityCard
                icon={item.icon}
                logo={item.logo}
                title={item.title}
                subtitle={item.subtitle}
                tags={item.tags}
                description={item.description}
                meta={item.meta}
                actions={item.actions}
                expandingActions={item.expandingActions}
                hoverable={hoverable}
                className={menu.length ? 'h-full' : undefined}
                onClick={onItemClick ? () => onItemClick({ item, index }) : undefined}
                onAction={
                  onItemAction
                    ? ({ key, text }) => onItemAction({ key, text, item, index })
                    : undefined
                }
                onExpandingAction={
                  onItemExpandingAction
                    ? (value) => onItemExpandingAction({ value, item, index })
                    : undefined
                }
              />
            );

            // 未配置菜单时保持原有 DOM（卡片直接作为网格子项）
            if (!menu.length) {
              return <Fragment key={index}>{card}</Fragment>;
            }

            return (
              <div key={index} data-slot="entity-card-list-item" className="relative h-full">
                {card}
                <DropdownMenu>
                  <DropdownMenuTrigger
                    data-slot="entity-card-list-menu-trigger"
                    aria-label={menuLabel ?? 'More'}
                    className="absolute top-4 right-5 flex size-7 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground focus-visible:outline-none data-[popup-open]:bg-muted data-[popup-open]:text-foreground"
                  >
                    <Ellipsis size={16} strokeWidth={1.8} aria-hidden="true" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    side="bottom"
                    sideOffset={6}
                    className="min-w-[168px] p-1"
                  >
                    {menu.map((menuItem) => {
                      const MenuIcon = menuIcons[menuItem.icon ?? menuItem.value];
                      return (
                        <DropdownMenuItem
                          key={menuItem.value}
                          variant={menuItem.danger ? 'destructive' : 'default'}
                          className="h-9 gap-2.5 rounded-md px-2.5 text-sm"
                          onClick={() =>
                            onMenuSelect?.({ value: menuItem.value, item, index })
                          }
                        >
                          {MenuIcon ? (
                            <MenuIcon size={16} strokeWidth={1.8} aria-hidden="true" />
                          ) : null}
                          {menuItem.label}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
        </div>
      )}
      {showCount ? (
        <Text
          text={t('pactor.cardList.total', { count: list.length })}
          type="secondary"
          size="small"
        />
      ) : null}
    </div>
  );
}
