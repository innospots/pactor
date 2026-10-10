import { useI18n } from '@pactor-app/runtime';
import { XIcon } from 'lucide-react';
import {
  useEffect,
  useLayoutEffect,
  useState,
  type CSSProperties,
} from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../../../lib/utils.js';
import { Button } from '../../../ui/button.js';

/** Tour 步骤定义：target 为 CSS selector（无匹配时卡片居中兜底） */
export interface TourStep {
  target?: string;
  title?: string;
  content?: string;
}

export interface TourProps {
  /** 是否开启引导 */
  open?: boolean;
  /** 步骤列表 */
  steps?: TourStep[];
  /** 受控步骤序号（缺省内部从 0 开始） */
  current?: number;
  /** 步骤切换事件：下一步/上一步触发，参数为目标序号 */
  onChange?: (index: number) => void;
  /** 完成（末步）与关闭事件 */
  onClose?: () => void;
  /** 通用：步骤卡片 class（与内置样式合并） */
  className?: string;
  /** 通用：步骤卡片内联样式 */
  style?: CSSProperties;
}

/**
 * Tour 适配器（shadcn kit）：分步引导——open 时渲染半透明遮罩
 * （fixed inset-0）+ 当前步骤卡片（按 target 元素 getBoundingClientRect
 * 定位在元素附近；选择器无匹配时居中兜底不抛错）。下一步触发 onChange，
 * 完成与关闭触发 onClose。
 */
export function Tour({
  open = false,
  steps = [],
  current,
  onChange,
  onClose,
  className,
  style,
}: TourProps) {
  const controlled = current !== undefined;
  const [inner, setInner] = useState(0);
  const { t } = useI18n();
  const index = controlled ? current : inner;
  const safeIndex = Math.min(Math.max(index, 0), Math.max(steps.length - 1, 0));
  const [anchor, setAnchor] = useState<{ top: number; left: number } | null>(
    null,
  );

  useEffect(() => {
    if (open && !controlled) {
      setInner(0);
    }
    // 仅在 open 变化时重置内部步骤
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }
    const target = steps[safeIndex]?.target;
    const el = target ? document.querySelector(target) : null;
    if (el) {
      const rect = el.getBoundingClientRect();
      setAnchor({ top: rect.bottom + 8, left: rect.left });
    } else {
      setAnchor(null);
    }
  }, [open, safeIndex, steps]);

  if (!open || steps.length === 0) {
    return null;
  }

  const step = steps[safeIndex];
  const last = safeIndex >= steps.length - 1;

  const goTo = (next: number) => {
    if (!controlled) {
      setInner(next);
    }
    onChange?.(next);
  };

  const positionStyle: CSSProperties = anchor
    ? { top: anchor.top, left: anchor.left }
    : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

  return createPortal(
    <>
      <div data-slot="tour-mask" className="fixed inset-0 z-[90] bg-(--overlay-background)" />
      <div
        data-slot="tour-card"
        className={cn(
          'fixed z-[100] flex w-72 flex-col gap-2 rounded-md border border-border bg-popover p-4 text-sm text-popover-foreground shadow-md shadow-(color:--shadow-color)',
          className,
        )}
        style={{ ...positionStyle, ...style }}
      >
        <div className="flex items-start justify-between gap-2">
          {step.title ? (
            <div data-slot="tour-title" className="font-medium">
              {step.title}
            </div>
          ) : (
            <span />
          )}
          <button
            type="button"
            data-slot="tour-close"
            aria-label="Close"
            className="cursor-pointer rounded-xs opacity-70 transition-opacity hover:opacity-100 [&_svg]:size-3.5"
            onClick={() => onClose?.()}
          >
            <XIcon />
          </button>
        </div>
        {step.content ? (
          <div data-slot="tour-content" className="text-muted-foreground">
            {step.content}
          </div>
        ) : null}
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">
            {safeIndex + 1} / {steps.length}
          </span>
          <div className="flex gap-2">
            {safeIndex > 0 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => goTo(safeIndex - 1)}
              >
                {t('pactor.tour.prev')}
              </Button>
            ) : null}
            <Button
              size="sm"
              onClick={() => {
                if (last) {
                  onClose?.();
                } else {
                  goTo(safeIndex + 1);
                }
              }}
            >
              {last ? t('pactor.tour.done') : t('pactor.tour.next')}
            </Button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
