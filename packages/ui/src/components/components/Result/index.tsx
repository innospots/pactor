import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';

/** Result 状态：四态语义 + HTTP 错误页 */
export type ResultStatus =
  | 'success'
  | 'error'
  | 'info'
  | 'warning'
  | '404'
  | '403'
  | '500';

export interface ResultProps {
  /** 状态，缺省 info */
  status?: ResultStatus;
  /** 标题 */
  title?: string;
  /** 副标题 */
  subTitle?: string;
  /** 操作区（DSL 子树，经 Renderer children 机制渲染） */
  children?: ReactNode;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

const statusIcon: Record<
  string,
  { icon: typeof CircleCheck; className: string } | undefined
> = {
  success: { icon: CircleCheck, className: 'text-success' },
  error: { icon: CircleX, className: 'text-destructive' },
  info: { icon: Info, className: 'text-info' },
  warning: { icon: TriangleAlert, className: 'text-warning' },
};

/**
 * Result 适配器（shadcn kit）：结果页——居中大图标（404/403/500 渲染
 * 状态码大字）+ 标题 + 副标题 + 操作区。
 */
export function Result({
  status = 'info',
  title,
  subTitle,
  children,
  className,
  style,
}: ResultProps) {
  const entry = statusIcon[status];
  const StatusIcon = entry?.icon;

  return (
    <div
      data-slot="result"
      data-status={status}
      className={cn(
        'flex flex-col items-center justify-center gap-2 py-10 text-center',
        className,
      )}
      style={style}
    >
      <div data-slot="result-icon">
        {StatusIcon ? (
          <StatusIcon className={cn('size-12', entry.className)} />
        ) : (
          <span className="text-5xl font-semibold text-muted-foreground">
            {status}
          </span>
        )}
      </div>
      {title ? (
        <div data-slot="result-title" className="text-lg font-medium">
          {title}
        </div>
      ) : null}
      {subTitle ? (
        <div
          data-slot="result-subtitle"
          className="text-sm text-muted-foreground"
        >
          {subTitle}
        </div>
      ) : null}
      {children ? (
        <div data-slot="result-extra" className="mt-2">
          {children}
        </div>
      ) : null}
    </div>
  );
}
