import { useI18n } from '@pactor-app/runtime';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';

import { cn } from '../../../lib/utils.js';
import { Icon } from '../Icon/index.js';

export interface BackTopProps {
  /** 滚动超过该高度后显示按钮（像素），默认 400 */
  visibilityHeight?: number;
  /** 自定义按钮内容（DSL 子树）；缺省为向上箭头圆形按钮 */
  children?: ReactNode;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * BackTop 适配器（shadcn kit）：监听 window 滚动，超过 visibilityHeight
 * 后右下角浮出按钮，点击平滑回到页面顶部。
 */
export function BackTop({ visibilityHeight = 400, children, className, style }: BackTopProps) {
  const [visible, setVisible] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const update = () => setVisible(window.scrollY > visibilityHeight);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [visibilityHeight]);

  if (!visible) return null;

  return (
    <button
      type="button"
      data-slot="back-top"
      aria-label={t('pactor.backTop.top')}
      className={cn(
        'fixed right-10 bottom-10 z-50 flex size-10 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-md transition-colors hover:bg-accent',
        className,
      )}
      style={style}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      {children ?? <Icon name="arrow-up" size="sm" />}
    </button>
  );
}
