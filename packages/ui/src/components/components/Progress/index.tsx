import type { CSSProperties } from 'react';

import {
  Progress as ShadcnProgress,
  ProgressIndicator,
  ProgressTrack,
} from '../../../ui/progress.js';

export interface ProgressProps {
  /** 百分比（0-100，可为表达式解析后的数字）；undefined / null 为不确定态 */
  value?: number | null;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/** Progress 适配器（shadcn kit）：value（0-100）→ vendored Progress（Base UI） */
export function Progress({ value, className, style }: ProgressProps) {
  const resolved =
    typeof value === 'number' && Number.isFinite(value)
      ? Math.min(100, Math.max(0, value))
      : null;
  return (
    <ShadcnProgress value={resolved} className={className} style={style}>
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ShadcnProgress>
  );
}
