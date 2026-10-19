import * as React from 'react';

import { cn } from '../lib/utils.js';

/** autoSize 对象形态：minRows 下限行数（内容不足时保底）、maxRows 上限行数（超限内部滚动） */
export interface TextareaAutoSize {
  minRows?: number;
  maxRows?: number;
}

/**
 * shadcn/ui Textarea（vendored 源码，Tailwind v4 版）。
 *  autoSize（缺省 false）开启时高度按内容自适应：JS 同步 scrollHeight，
 *  minRows / maxRows 按行高换算上下限，超上限内部滚动；关闭时为固定
 *  rows 行高（可拖拽调高）。不用 CSS field-sizing：它对两轴生效，
 *  长字符串不换行会把输入框与弹性父容器一起横向撑爆——宽度恒 w-full。
 */
function Textarea({
  className,
  onChange,
  rows = 3,
  autoSize = false,
  ...props
}: React.ComponentProps<'textarea'> & { autoSize?: boolean | TextareaAutoSize }) {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const enabled = autoSize !== false;
  // syncHeight 经 ResizeObserver 回调调用，用 ref 取最新值避免闭包过期
  const autoSizeRef = React.useRef(autoSize);
  autoSizeRef.current = autoSize;
  const rowsRef = React.useRef(rows);
  rowsRef.current = rows;

  const syncHeight = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    // 高度归零 + 清 min-height 读纯内容高度（scrollHeight 报告内容
    // 溢出高度，不受 rows / min-height 兜底干扰）
    el.style.height = '0px';
    el.style.minHeight = '0';
    const scroll = el.scrollHeight;
    el.style.minHeight = '';
    if (scroll === 0) return;
    const cs = getComputedStyle(el);
    const line =
      Number.parseFloat(cs.lineHeight) || Number.parseFloat(cs.fontSize) * 1.4;
    const pad =
      (Number.parseFloat(cs.paddingTop) || 0) +
      (Number.parseFloat(cs.paddingBottom) || 0);
    const as = autoSizeRef.current;
    let next = scroll;
    let overflow = 'hidden';
    if (typeof as === 'object') {
      const min = (as.minRows ?? rowsRef.current) * line + pad;
      next = Math.max(next, min);
      if (as.maxRows !== undefined && as.maxRows > 0) {
        const max = as.maxRows * line + pad;
        if (next > max) {
          next = max;
          overflow = 'auto';
        }
      }
    }
    el.style.height = `${next}px`;
    el.style.overflowY = overflow;
  }, []);

  // 每次渲染同步（覆盖受控 value 外部变化：表单重置 / setValue 回填）
  React.useLayoutEffect(() => {
    if (enabled) syncHeight();
  });

  // 容器尺寸变化（窗口缩放、侧栏开合）时同步；自身观察回调在
  // 高度收敛后不再触发（值不变不重入）
  React.useLayoutEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(() => syncHeight());
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, syncHeight]);

  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      rows={rows}
      className={cn(
        'flex w-full rounded-md border border-input bg-(--input-background) px-3 py-2 text-sm text-(--input-foreground) shadow-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
        !enabled && 'min-h-16',
        enabled && 'resize-none',
        className,
      )}
      onChange={(event) => {
        onChange?.(event);
        if (enabled) syncHeight();
      }}
      {...props}
    />
  );
}

export { Textarea };
