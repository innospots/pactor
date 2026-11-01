import { useI18n } from '@pactor-app/runtime';
import type { CSSProperties } from 'react';

import { cn } from '../../lib/utils.js';
import { Card } from '@pactor-app/ui/components';
import { Empty } from '@pactor-app/ui/components';
import { Icon } from '@pactor-app/ui/components';
import { Text } from '@pactor-app/ui/components';
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
  /** 新建占位卡点击 */
  onCreateClick?: () => void;
}

/**
 * EntityCardList 实体卡片列表（区块组件）：响应式网格渲染实体摘要卡，
 * 支持首格新建占位卡、空状态与结果计数；交互经 events 编排
 * （onItemClick / onItemAction / onCreateClick，参数经 ${event} 读取）。
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
  className,
  style,
  onItemClick,
  onItemAction,
  onItemExpandingAction,
  onCreateClick,
}: EntityCardListProps) {
  const { t } = useI18n();
  const list = items ?? [];

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
          {list.map((item, index) => (
            <EntityCard
              key={index}
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
          ))}
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
