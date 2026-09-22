import { useEffect, useState, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';

export interface StreamingTextProps {
  /** 文本内容（流式场景由数据源持续追加） */
  content?: string;
  /** 生成中：尾部渲染闪烁光标，默认 false */
  streaming?: boolean;
  /** 打字机模式：自身按 speed 渐进揭示 content（内容一次性给全的演示 / 回放场景），默认 false */
  typing?: boolean;
  /** 打字机速度（每 24ms 揭示的字符数），默认 2 */
  speed?: number;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * StreamingText 适配器（shadcn kit）：渐进展示生成中的文本——
 * 两种模式：数据源推送（content 增长 + streaming 光标）与打字机
 * （typing 自揭示完整 content）。光标 motion-reduce 时静止。
 */
export function StreamingText({ content = '', streaming, typing, speed = 2, className, style }: StreamingTextProps) {
  const [revealed, setRevealed] = useState(typing ? 0 : content.length);

  useEffect(() => {
    if (!typing) {
      setRevealed(content.length);
      return;
    }
    setRevealed(0);
    const timer = window.setInterval(() => {
      setRevealed((value) => {
        if (value >= content.length) {
          window.clearInterval(timer);
          return value;
        }
        return Math.min(content.length, value + speed);
      });
    }, 24);
    return () => window.clearInterval(timer);
  }, [content, typing, speed]);

  const typingDone = !typing || revealed >= content.length;
  const showCursor = streaming || (typing && !typingDone);

  return (
    <span data-slot="streaming-text" className={cn('whitespace-pre-wrap', className)} style={style}>
      {typing ? content.slice(0, revealed) : content}
      {showCursor ? (
        <span
          data-slot="streaming-text-cursor"
          aria-hidden="true"
          className="ml-0.5 inline-block animate-pulse text-primary motion-reduce:animate-none"
        >
          ▍
        </span>
      ) : null}
    </span>
  );
}
