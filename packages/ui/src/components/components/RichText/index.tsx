import DOMPurify from 'dompurify';
import { useMemo, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';

export interface RichTextProps {
  /** 富文本 HTML（渲染前经 DOMPurify 白名单消毒） */
  html?: string;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * RichText 适配器（shadcn kit）：渲染富文本 HTML。
 * 安全边界：所有内容先经 DOMPurify 消毒（剔除 script / 内联事件 /
 * javascript: URL 等），再以 dangerouslySetInnerHTML 挂载；
 * 与 Markdown 组件（AST 渲染、不碰原始 HTML）形成互补。
 */
export function RichText({ html, className, style }: RichTextProps) {
  const sanitized = useMemo(() => DOMPurify.sanitize(html ?? ''), [html]);

  return (
    <div
      data-slot="rich-text"
      className={cn('text-sm leading-relaxed break-words', className)}
      style={style}
      // eslint-disable-next-line react/no-danger -- 内容已经 DOMPurify 消毒
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
