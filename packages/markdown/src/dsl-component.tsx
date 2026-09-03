import type { CSSProperties } from 'react';

import { MarkdownRenderer } from './renderer.js';

export interface MarkdownDslComponentProps {
  /**
   * Markdown 内容（DSL props.content）。
   * `${data.xxx}` 等表达式已由 Renderer 在 props 下发前解析（设计决策 D3）。
   */
  content?: string;
  /** 通用：根节点 class（与基础 class 并存） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * DSL 组件适配：`{ type: 'Markdown', props: { content } }`。
 * 仅做 props 透传，渲染与安全边界全部委托给 MarkdownRenderer。
 */
export function MarkdownDslComponent({
  content,
  className,
  style,
}: MarkdownDslComponentProps) {
  return (
    <MarkdownRenderer content={content ?? ''} className={className} style={style} />
  );
}
