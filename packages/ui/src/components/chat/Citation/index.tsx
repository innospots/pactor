import type { CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../../../ui/hover-card.js';

/** 引用来源项 */
export interface CitationItem {
  /** 来源标题 */
  title: string;
  /** 来源链接 */
  url?: string;
  /** 引用片段 */
  snippet?: string;
}

export interface CitationProps {
  /** 来源列表（可含表达式解析后的数组）；编号从 start 起 */
  items?: CitationItem[];
  /** 起始编号，默认 1 */
  start?: number;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * Citation 适配器（shadcn kit）：来源引用标记——行内 [n] 编号组，
 * 悬浮展开来源卡（标题 / 片段 / 链接，经 vendored HoverCard）。
 */
export function Citation({ items = [], start = 1, className, style }: CitationProps) {
  return (
    <span data-slot="citation" className={cn('inline-flex gap-1 align-super', className)} style={style}>
      {items.map((item, index) => (
        <HoverCard key={`${item.title}-${index}`}>
          <HoverCardTrigger
            data-slot="citation-marker"
            className="cursor-pointer rounded-sm border border-border px-1 text-xs leading-4 text-primary hover:bg-accent"
          >
            [{start + index}]
          </HoverCardTrigger>
          <HoverCardContent data-slot="citation-card" className="w-72">
            <div className="text-sm font-medium">{item.title}</div>
            {item.snippet ? (
              <div className="mt-1 line-clamp-3 text-xs text-muted-foreground">{item.snippet}</div>
            ) : null}
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block truncate text-xs text-primary hover:underline"
              >
                {item.url}
              </a>
            ) : null}
          </HoverCardContent>
        </HoverCard>
      ))}
    </span>
  );
}
