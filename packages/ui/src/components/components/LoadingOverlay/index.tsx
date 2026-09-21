import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';
import { Spinner as ShadcnSpinner } from '../../../ui/spinner.js';

export interface LoadingOverlayProps {
  /** 是否处于加载态（显示覆盖层） */
  loading?: boolean;
  /** 加载提示文案 */
  text?: string;
  /** 被覆盖区块（DSL 子树，经 Renderer children 机制渲染） */
  children?: ReactNode;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * LoadingOverlay 适配器（shadcn kit）：局部加载遮罩——容器相对定位包
 * children，loading 时覆盖半透明绝对定位层（居中 Spinner + 可选文案）；
 * loading=false 时只渲染 children。无 children 时退化为独立 Spinner。
 */
export function LoadingOverlay({
  loading = false,
  text,
  children,
  className,
  style,
}: LoadingOverlayProps) {
  if (children === undefined || children === null) {
    if (!loading) {
      return null;
    }
    return (
      <div
        data-slot="loading-overlay"
        className={cn('inline-flex items-center gap-2', className)}
        style={style}
      >
        <ShadcnSpinner className="size-4" />
        {text ? (
          <span className="text-sm text-muted-foreground">{text}</span>
        ) : null}
      </div>
    );
  }

  return (
    <div
      data-slot="loading-overlay"
      className={cn('relative', className)}
      style={style}
    >
      {children}
      {loading ? (
        <div
          data-slot="loading-overlay-mask"
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background/70"
        >
          <ShadcnSpinner className="size-6" />
          {text ? (
            <div className="text-sm text-muted-foreground">{text}</div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
