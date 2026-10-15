import { type VariantProps } from 'class-variance-authority';
import { CheckIcon, RotateCcwIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '../lib/utils.js';
import { Button, buttonVariants } from './button.js';
import { Spinner } from './spinner.js';

export type ConfirmMorphState =
  | 'idle'
  | 'confirming'
  | 'pending'
  | 'success'
  | 'error';

export interface ConfirmMorphProps
  extends
    Omit<React.ComponentProps<'button'>, 'children' | 'onClick'>,
    VariantProps<typeof buttonVariants> {
  /** idle 段文字 */
  label: React.ReactNode;
  /** confirming 段文字，缺省“确认” */
  confirmLabel?: React.ReactNode;
  /** pending 段可选文字（spinner 恒显） */
  pendingLabel?: React.ReactNode;
  /** success 段文字，缺省“已完成” */
  successLabel?: React.ReactNode;
  /** error 段撤销操作文字，缺省“撤销” */
  undoLabel?: React.ReactNode;
  /** confirming 段按钮变体，默认 destructive */
  confirmVariant?: VariantProps<typeof buttonVariants>['variant'];
  /** confirming 超时未确认自动回 idle 的时长（ms），默认 3000 */
  confirmTimeout?: number;
  /** success 段停留时长（ms），随后回 idle，默认 1500 */
  resetDelay?: number;
  /** 确认回调：返回 Promise 时自动 pending，resolve→success、reject→error */
  onConfirm?: () => void | Promise<unknown>;
  /** error 段撤销回调（点击 error 段按钮触发，随后回 idle） */
  onUndo?: () => void;
  /** 状态流转回调 */
  onStateChange?: (state: ConfirmMorphState) => void;
}

/**
 * ConfirmMorph 内联确认按钮：扩展按钮组件，交互设计参考 arc-library
 * （https://github.com/kuratlielia/arc-library），Tailwind 实现。
 * 按钮内状态机 idle → confirming → pending → success / error：
 * confirming 段（默认 destructive）confirmTimeout 超时回 idle；
 * onConfirm 返回 Promise 时自动 pending，resolve→success、reject→error；
 * error 段点击即撤销（undo）回 idle 并触发 onUndo。各段内容在同一
 * grid 单元内堆叠（最宽段定宽、非激活段 opacity-0），状态切换无布局跳动。
 */
function ConfirmMorph({
  className,
  variant,
  size,
  label,
  confirmLabel = '确认',
  pendingLabel,
  successLabel = '已完成',
  undoLabel = '撤销',
  confirmVariant = 'destructive',
  confirmTimeout = 3000,
  resetDelay = 1500,
  onConfirm,
  onUndo,
  onStateChange,
  disabled,
  type = 'button',
  ...props
}: ConfirmMorphProps) {
  const [state, setState] = React.useState<ConfirmMorphState>('idle');
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  // 代际标记：忽略过期 Promise 回写（如超时回退后迟到的 resolve）
  const generationRef = React.useRef(0);

  const transition = React.useCallback(
    (next: ConfirmMorphState) => {
      setState(next);
      onStateChange?.(next);
    },
    [onStateChange],
  );

  const clearTimer = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  React.useEffect(() => clearTimer, [clearTimer]);

  const handleClick = () => {
    if (disabled) return;
    if (state === 'idle') {
      transition('confirming');
      clearTimer();
      timerRef.current = setTimeout(() => {
        generationRef.current += 1;
        transition('idle');
      }, confirmTimeout);
      return;
    }
    if (state === 'confirming') {
      clearTimer();
      const generation = ++generationRef.current;
      let result: void | Promise<unknown>;
      try {
        result = onConfirm?.();
      } catch {
        transition('error');
        return;
      }
      if (result && typeof result.then === 'function') {
        transition('pending');
        result.then(
          () => {
            if (generationRef.current !== generation) return;
            transition('success');
            timerRef.current = setTimeout(
              () => transition('idle'),
              resetDelay,
            );
          },
          () => {
            if (generationRef.current !== generation) return;
            transition('error');
          },
        );
      } else {
        transition('success');
        timerRef.current = setTimeout(() => transition('idle'), resetDelay);
      }
      return;
    }
    if (state === 'error') {
      generationRef.current += 1;
      onUndo?.();
      transition('idle');
    }
    // pending / success 段不可交互
  };

  const interactive = state === 'idle' || state === 'confirming' || state === 'error';
  const currentVariant = state === 'confirming' ? confirmVariant : variant;

  const segments: { key: ConfirmMorphState; content: React.ReactNode }[] = [
    { key: 'idle', content: label },
    { key: 'confirming', content: confirmLabel },
    {
      key: 'pending',
      content: (
        <>
          <Spinner className="motion-reduce:animate-none" />
          {pendingLabel ? <span>{pendingLabel}</span> : null}
        </>
      ),
    },
    {
      key: 'success',
      content: (
        <>
          <CheckIcon />
          <span>{successLabel}</span>
        </>
      ),
    },
    {
      key: 'error',
      content: (
        <>
          <RotateCcwIcon />
          <span>{undoLabel}</span>
        </>
      ),
    },
  ];

  return (
    <Button
      data-slot="confirm-morph"
      data-state={state}
      variant={currentVariant}
      size={size}
      type={type}
      disabled={disabled}
      aria-busy={state === 'pending' || undefined}
      className={cn(
        'transition-colors motion-reduce:transition-none',
        !interactive && 'pointer-events-none',
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      <span className="grid">
        {segments.map((segment) => {
          const active = state === segment.key;
          return (
            <span
              key={segment.key}
              data-segment={segment.key}
              aria-hidden={active ? undefined : true}
              className={cn(
                'col-start-1 row-start-1 inline-flex items-center justify-center gap-2 whitespace-nowrap transition-opacity duration-150 motion-reduce:transition-none',
                active ? 'opacity-100' : 'pointer-events-none opacity-0',
              )}
            >
              {segment.content}
            </span>
          );
        })}
      </span>
    </Button>
  );
}

export { ConfirmMorph };
