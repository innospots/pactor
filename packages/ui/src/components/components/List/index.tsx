import type { CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import {
  Empty as ShadcnEmpty,
  EmptyHeader,
  EmptyTitle,
} from '../../../ui/empty.js';

/** 列表项：左 avatar（图片 src 或占位文本）、中 title+description、右 extra */
export interface ListItemData {
  key?: string;
  title: string;
  description?: string;
  /** 头像：图片地址（http(s):/data:/路径）或占位文本 */
  avatar?: string;
  /** 行尾附加内容（字符串） */
  extra?: string;
}

export interface ListProps {
  /** 列表数据（可含表达式解析后的数组）；为空时渲染空态 */
  items?: ListItemData[];
  /** 行间分隔线，缺省 true */
  split?: boolean;
  /** 外边框 */
  bordered?: boolean;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

function isImageSrc(avatar: string): boolean {
  return /^(https?:|data:|\/|\.)/.test(avatar);
}

/** List 适配器（shadcn kit）：纵向行式列表；items 为空时复用 Empty 原语渲染空态 */
export function List({
  items = [],
  split = true,
  bordered,
  className,
  style,
}: ListProps) {
  if (items.length === 0) {
    return (
      <ShadcnEmpty
        data-slot="list"
        className={cn(bordered && 'border border-border', className)}
        style={style}
      >
        <EmptyHeader>
          <EmptyTitle>暂无数据</EmptyTitle>
        </EmptyHeader>
      </ShadcnEmpty>
    );
  }

  return (
    <ul
      data-slot="list"
      className={cn(
        'w-full rounded-lg',
        split && 'divide-y divide-border',
        bordered && 'border border-border',
        className,
      )}
      style={style}
    >
      {items.map((item, index) => (
        <li
          key={item.key ?? index}
          data-slot="list-item"
          className="flex items-center gap-3 px-4 py-3"
        >
          {item.avatar ? (
            isImageSrc(item.avatar) ? (
              <img
                data-slot="list-item-avatar"
                src={item.avatar}
                alt=""
                className="size-9 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span
                data-slot="list-item-avatar"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground"
              >
                {item.avatar}
              </span>
            )
          ) : null}
          <div className="min-w-0 flex-1">
            <div data-slot="list-item-title" className="truncate text-sm font-medium">
              {item.title}
            </div>
            {item.description ? (
              <div
                data-slot="list-item-description"
                className="truncate text-sm text-muted-foreground"
              >
                {item.description}
              </div>
            ) : null}
          </div>
          {item.extra ? (
            <div
              data-slot="list-item-extra"
              className="shrink-0 text-sm text-muted-foreground"
            >
              {item.extra}
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
