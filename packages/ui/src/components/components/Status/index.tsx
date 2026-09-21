import type { CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';

/** DSL Status 状态（对齐 antd Badge status 五态） */
export type StatusType = 'success' | 'processing' | 'error' | 'warning' | 'default';

export interface StatusProps {
  /** 状态，默认 default */
  status?: StatusType;
  /** 状态文本 */
  text?: string;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

const dotClass: Record<StatusType, string> = {
  success: 'bg-success',
  processing: 'bg-info',
  error: 'bg-destructive',
  warning: 'bg-warning',
  default: 'bg-muted-foreground',
};

/**
 * Status 适配器（shadcn kit）：状态点 + 文本；processing 态叠加
 * animate-ping 扩散动画表示进行中。
 */
export function Status({ status = 'default', text, className, style }: StatusProps) {
  return (
    <span
      data-slot="status"
      data-status={status}
      className={cn('inline-flex items-center gap-1.5 text-sm', className)}
      style={style}
    >
      <span data-slot="status-dot" className="relative flex size-2">
        {status === 'processing' ? (
          <span
            aria-hidden="true"
            className={cn(
              'absolute inline-flex size-full animate-ping rounded-full opacity-60 motion-reduce:animate-none',
              dotClass[status],
            )}
          />
        ) : null}
        <span className={cn('relative inline-flex size-2 rounded-full', dotClass[status])} />
      </span>
      {text ? <span data-slot="status-text">{text}</span> : null}
    </span>
  );
}
