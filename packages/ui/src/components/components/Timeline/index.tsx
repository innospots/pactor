import { useI18n } from '@pactor-app/runtime';
import type { CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { Icon } from '../Icon/index.js';

/** 时间轴节点；`icon` 为 Icon 白名单图标名（kebab-case 或 PascalCase） */
export interface TimelineItemData {
  content: string;
  time?: string;
  /** 节点圆点颜色（CSS 颜色值） */
  color?: string;
  icon?: string;
}

export interface TimelineProps {
  /** 节点列表（可含表达式解析后的数组） */
  items?: TimelineItemData[];
  /** 末尾追加「进行中」节点：true 用默认文案，字符串为自定义文案 */
  pending?: boolean | string;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/** Timeline 适配器（shadcn kit）：竖向时间轴；节点圆点（color 覆盖）+ content + 可选 time */
export function Timeline({ items = [], pending, className, style }: TimelineProps) {
  const nodes: TimelineItemData[] = [...items];
  const { t } = useI18n();
  if (pending) {
    nodes.push({ content: typeof pending === 'string' ? pending : t('pactor.timeline.inProgress') });
  }

  return (
    <ul data-slot="timeline" className={cn('w-full', className)} style={style}>
      {nodes.map((item, index) => (
        <li key={index} data-slot="timeline-item" className="relative flex gap-3 pb-6 last:pb-0">
          {index < nodes.length - 1 ? (
            <span
              aria-hidden="true"
              className="absolute top-5 left-[7px] h-[calc(100%-20px)] w-px bg-border"
            />
          ) : null}
          <span
            data-slot="timeline-dot"
            className="relative mt-1 flex size-4 shrink-0 items-center justify-center"
          >
            {item.icon ? (
              <Icon name={item.icon} size="sm" />
            ) : (
              <span
                className="size-2 rounded-full bg-primary"
                style={item.color ? { backgroundColor: item.color } : undefined}
              />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <div data-slot="timeline-content" className="text-sm">
              {item.content}
            </div>
            {item.time ? (
              <div data-slot="timeline-time" className="mt-0.5 text-xs text-muted-foreground">
                {item.time}
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
