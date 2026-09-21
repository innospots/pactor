import { useEffect, type CSSProperties } from 'react';

import { toast, type ToastVariant } from '../../../ui/toast.js';

export interface NotificationProps {
  /** 通知标题：变为非空字符串时（含首次挂载）发一条富通知 toast */
  title?: string;
  /** 通知正文（toast description） */
  description?: string;
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
 * Notification 适配器（shadcn kit）：声明式全局富通知触发器。
 * title 引用变化且非空时经 vendored toast 原语发一条 title+description
 * 的富通知 toast；自身只渲染 hidden 标记节点。
 */
export function Notification({
  title,
  description,
  variant,
  duration,
  className,
  style,
}: NotificationProps) {
  useEffect(() => {
    if (typeof title === 'string' && title !== '') {
      toast(title, { description, variant, duration });
    }
    // 触发语义仅依赖 title 引用：description/variant/duration 变化不重发
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  return <div data-slot="notification" hidden className={className} style={style} />;
}
