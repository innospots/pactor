import type { CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';

/** 描述项：标签—值对 */
export interface DescriptionsItemData {
  label: string;
  value: string | number;
}

export interface DescriptionsProps {
  /** 标题 */
  title?: string;
  /** 描述项列表（可含表达式解析后的数组） */
  items?: DescriptionsItemData[];
  /** 每行列数，缺省 3 */
  column?: number;
  /** 带边框样式 */
  bordered?: boolean;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/** Descriptions 适配器（shadcn kit）：标签—值栅格；bordered 时以边框栅格呈现 */
export function Descriptions({
  title,
  items = [],
  column = 3,
  bordered,
  className,
  style,
}: DescriptionsProps) {
  return (
    <div data-slot="descriptions" className={cn('w-full', className)} style={style}>
      {title ? (
        <div data-slot="descriptions-title" className="mb-3 text-base font-medium">
          {title}
        </div>
      ) : null}
      <div
        data-slot="descriptions-grid"
        className={cn(
          'grid overflow-hidden',
          bordered
            ? 'gap-px rounded-lg border border-border bg-border'
            : 'gap-x-6 gap-y-3',
        )}
        style={{ gridTemplateColumns: `repeat(${column}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) =>
          bordered ? (
            <div
              key={index}
              data-slot="descriptions-item"
              className="flex bg-background"
            >
              <div
                data-slot="descriptions-item-label"
                className="w-32 shrink-0 bg-muted px-3 py-2 text-sm text-muted-foreground"
              >
                {item.label}
              </div>
              <div data-slot="descriptions-item-value" className="min-w-0 flex-1 px-3 py-2 text-sm">
                {item.value}
              </div>
            </div>
          ) : (
            <div key={index} data-slot="descriptions-item" className="flex gap-2 text-sm">
              <span
                data-slot="descriptions-item-label"
                className="shrink-0 text-muted-foreground"
              >
                {item.label}
              </span>
              <span data-slot="descriptions-item-value" className="min-w-0 flex-1">
                {item.value}
              </span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
