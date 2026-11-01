import type { DslNode } from '@pactor-app/core';
import { useI18n } from '@pactor-app/runtime';
import { Fragment, type CSSProperties, type ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';
import {
  Empty as ShadcnEmpty,
  EmptyHeader,
  EmptyTitle,
} from '../../../ui/empty.js';
import { DslSlot } from '../../dsl-slot.js';

/** 卡片列表项：左 avatar（图片 src 或占位文本）、中 title+description+content、右 extra */
export interface CardListItemData {
  key?: string;
  title: string;
  /** 标题右侧附加内容（ReactNode 或 DSL 节点，如类型标签） */
  titleExtra?: DslNode | ReactNode;
  description?: string;
  /** description 下方的自定义内容（ReactNode 或 DSL 节点，如标签组 / 补充信息区） */
  content?: DslNode | ReactNode;
  /** 头像：图片地址（http(s):/data:/路径）或占位文本 */
  avatar?: string;
  /** 行尾附加内容（ReactNode 或 DSL 节点，如文字 / 图标 / 操作区） */
  extra?: DslNode | ReactNode;
  /** 列表项之后的附加内容（ReactNode 或 DSL 节点，占满一行，如分支提示条） */
  after?: DslNode | ReactNode;
  /** 列表项根节点附加 class（用于特殊样式，与内置样式合并） */
  className?: string;
  /** 列表项根节点内联样式 */
  style?: CSSProperties;
  /** 禁用点击 / 选中；selectable 时可单独锁定某项 */
  disabled?: boolean;
}

export interface CardListProps {
  /** 列表数据（可含表达式解析后的数组）；为空时渲染空态 */
  items?: CardListItemData[];
  /** 卡片间距（px），默认 12 */
  gap?: number;
  /** 可配置点击选中：整卡可点，点击切换选中态（选中行高亮） */
  selectable?: boolean;
  /** 多选（默认 false 单选，再点已选中项取消）；selectable 时生效 */
  multiple?: boolean;
  /** 受控选中项 key 数组（selectable 时生效；项缺省 key 时按下标） */
  value?: string[];
  /** 选中变化事件，传出全部选中 key 数组 */
  onChange?: (keys: string[]) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

function isImageSrc(avatar: string): boolean {
  return /^(https?:|data:|\/|\.)/.test(avatar);
}

/**
 * CardList 适配器（shadcn kit，语义对齐 antd 版）：List 的卡片形态——
 * 每个列表项一张 Card（边框 + 圆角 + 投影），项间以 gap 分隔（默认 12px）；
 * 标题右侧可渲染 titleExtra，description 下方可渲染 content，行尾可渲染
 * extra，项后另起一行可渲染 after（均支持 ReactNode / DSL 节点）；项可通过
 * className / style 叠加特殊样式，disabled 可单独锁定该项点击（selectable 时
 * 同时禁止选中）；selectable 开启点击选中（默认单选、multiple 多选，受控
 * value + onChange）。items 为空时复用 Empty 原语渲染空态。
 */
export function CardList({
  items = [],
  gap = 12,
  selectable,
  multiple,
  value,
  onChange,
  className,
  style,
}: CardListProps) {
  const { t } = useI18n();
  if (items.length === 0) {
    return (
      <ShadcnEmpty data-slot="card-list" className={className} style={style}>
        <EmptyHeader>
          <EmptyTitle>{t('pactor.table.empty')}</EmptyTitle>
        </EmptyHeader>
      </ShadcnEmpty>
    );
  }

  const keyOf = (item: CardListItemData, index: number) => String(item.key ?? index);
  const selected = value ?? [];

  const toggle = (key: string) => {
    if (selected.includes(key)) {
      onChange?.(selected.filter((k) => k !== key));
    } else {
      onChange?.(multiple ? [...selected, key] : [key]);
    }
  };

  return (
    <div
      data-slot="card-list"
      className={cn('flex w-full flex-col', className)}
      style={{ gap, ...style }}
    >
      {items.map((item, index) => {
        const itemKey = keyOf(item, index);
        const isSelected = selectable === true && selected.includes(itemKey);
        const isDisabled = item.disabled === true;
        const isClickable = selectable === true && !isDisabled;
        return (
          <Fragment key={itemKey}>
            <div
              data-slot="card-list-item"
              data-selected={isSelected || undefined}
              data-disabled={isDisabled || undefined}
              role={selectable ? 'button' : undefined}
              aria-disabled={selectable && isDisabled ? true : undefined}
              tabIndex={isClickable ? 0 : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg border bg-card p-4 shadow-xs transition-colors',
                isSelected ? 'border-primary bg-accent' : 'border-border',
                isClickable && 'cursor-pointer hover:border-primary/50',
                isDisabled && 'cursor-not-allowed opacity-50',
                item.className,
              )}
              style={item.style}
              onClick={isClickable ? () => toggle(itemKey) : undefined}
              onKeyDown={
                isClickable
                  ? (event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        toggle(itemKey);
                      }
                    }
                  : undefined
              }
            >
              {item.avatar ? (
                isImageSrc(item.avatar) ? (
                  <img
                    data-slot="card-list-item-avatar"
                    src={item.avatar}
                    alt=""
                    className="size-9 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span
                    data-slot="card-list-item-avatar"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground"
                  >
                    {item.avatar}
                  </span>
                )
              ) : null}
              <div className="min-w-0 flex-1">
                <div
                  data-slot="card-list-item-heading"
                  className="flex min-w-0 items-center gap-2"
                >
                  <div
                    data-slot="card-list-item-title"
                    className="min-w-0 truncate text-sm font-medium"
                  >
                    {item.title}
                  </div>
                  {item.titleExtra != null ? (
                    <div
                      data-slot="card-list-item-title-extra"
                      className="shrink-0"
                    >
                      <DslSlot content={item.titleExtra} />
                    </div>
                  ) : null}
                </div>
                {item.description ? (
                  <div
                    data-slot="card-list-item-description"
                    className="truncate text-sm text-muted-foreground"
                  >
                    {item.description}
                  </div>
                ) : null}
                {item.content != null ? (
                  <div data-slot="card-list-item-content" className="mt-2">
                    <DslSlot content={item.content} />
                  </div>
                ) : null}
              </div>
              {item.extra != null ? (
                <div
                  data-slot="card-list-item-extra"
                  className="shrink-0 text-sm text-muted-foreground"
                >
                  <DslSlot content={item.extra} />
                </div>
              ) : null}
            </div>
            {item.after != null ? (
              <div data-slot="card-list-item-after" className="w-full">
                <DslSlot content={item.after} />
              </div>
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
}
