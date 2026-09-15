import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';
import { useSpaLinkClick } from '../../spa-link.js';

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
 * Link 链接（shadcn kit）：渲染原生 `<a href>` 保留原生语义；
 * 站内路径（`/` 开头）的普通左键点击拦截后走渲染上下文路由
 * （`route.navigate`，嵌入模式可注入宿主路由），外链 / 锚点 /
 * 修饰键点击 / 显式 target 保持浏览器自然跳转。
 */
export function Link({ href, text, target, className, style, children }: LinkProps) {
  const handleSpaClick = useSpaLinkClick();
  return (
    <a
      data-slot="link"
      href={href}
      target={target}
      rel={target === '_blank' ? 'noreferrer' : undefined}
      className={cn('text-primary underline-offset-4 hover:underline', className)}
      style={style}
      onClick={(event) => handleSpaClick(event, href, target)}
    >
      {text ?? children}
    </a>
  );
}
