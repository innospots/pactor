import type { CSSProperties } from 'react';

import { Kbd as ShadcnKbd } from '../../../ui/kbd.js';

export interface KbdProps {
  /** 按键文本（如 ⌘K） */
  text?: string;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/** Kbd 适配器（shadcn kit）：text → vendored Kbd */
export function Kbd({ text, className, style }: KbdProps) {
  return (
    <ShadcnKbd className={className} style={style}>
      {text}
    </ShadcnKbd>
  );
}
