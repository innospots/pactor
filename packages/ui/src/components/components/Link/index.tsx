import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';

export interface LinkProps {
  /** 链接地址（可含表达式） */
  href?: string;
  /** 链接文本；也可用 children */
  text?: string;
  /** 打开方式（`_blank` 新窗口等） */
  target?: '_blank' | '_self' | '_parent' | '_top';
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * Link 链接（shadcn kit）：渲染原生 `<a href>`——自然跳转，
 * 目标可以是宿主任意路由（嵌入模式的主要跳转方式，见
 * spec: embedded-page-view 的「自然跳转」）。
 */
export function Link({ href, text, target, className, style, children }: LinkProps) {
  return (
    <a
      data-slot="link"
      href={href}
      target={target}
      rel={target === '_blank' ? 'noreferrer' : undefined}
      className={cn('text-primary underline-offset-4 hover:underline', className)}
      style={style}
    >
      {text ?? children}
    </a>
  );
}
