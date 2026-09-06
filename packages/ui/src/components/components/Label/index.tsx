import type { CSSProperties } from 'react';

import { Label as ShadcnLabel } from '../../../ui/label.js';

export interface LabelProps {
  /** 标签文本 */
  text?: string;
  /** 关联控件 id（label htmlFor） */
  htmlFor?: string;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/** Label 适配器（shadcn kit）：独立使用的表单标签 */
export function Label({ text, htmlFor, className, style }: LabelProps) {
  return (
    <ShadcnLabel htmlFor={htmlFor} className={className} style={style}>
      {text}
    </ShadcnLabel>
  );
}
