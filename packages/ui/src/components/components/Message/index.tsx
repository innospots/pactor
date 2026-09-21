import { useEffect, type CSSProperties } from 'react';

import { toast, type ToastVariant } from '../../../ui/toast.js';

export interface MessageProps {
  /** 反馈文案：变为非空字符串时（含首次挂载）发一条全局短 toast */
  content?: string;
  /** 语义类型，缺省 info */
  variant?: ToastVariant;
  /** 自动关闭时长（ms） */
  duration?: number;
  /** 通用：标记节点 class */
  className?: string;
  /** 通用：标记节点内联样式 */
  style?: CSSProperties;
}

/**
 * Message 适配器（shadcn kit）：声明式全局短反馈触发器。
 * content 引用变化且非空时经 vendored toast 原语发一条全局短 toast；
 * 自身只渲染 hidden 标记节点（不强制 display:none，通用 props 正常挂载）。
 */
export function Message({ content, variant, duration, className, style }: MessageProps) {
  useEffect(() => {
    if (typeof content === 'string' && content !== '') {
      toast(content, { variant, duration });
    }
    // 触发语义仅依赖 content 引用：variant/duration 变化不重发
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  return <div data-slot="message" hidden className={className} style={style} />;
}
