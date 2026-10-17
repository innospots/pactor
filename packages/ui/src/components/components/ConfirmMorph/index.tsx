import type { CSSProperties } from 'react';

import {
  ConfirmMorph as ShadcnConfirmMorph,
  type ConfirmMorphState,
} from '../../../ui/confirm-morph.js';
import { buttonVariants } from '../../../ui/button.js';
import type { VariantProps } from 'class-variance-authority';

/** DSL 扩展按钮变体（与 buttonVariants 对齐） */
export type ConfirmMorphVariant = NonNullable<
  VariantProps<typeof buttonVariants>['variant']
>;

/** DSL 扩展按钮尺寸（与 buttonVariants 对齐） */
export type ConfirmMorphSize = NonNullable<
  VariantProps<typeof buttonVariants>['size']
>;

export interface ConfirmMorphProps {
  /** idle 段文字 */
  label: string;
  /** confirming 段文字，缺省「确认」 */
  confirmLabel?: string;
  /** pending 段可选文字（spinner 恒显） */
  pendingLabel?: string;
  /** success 段文字，缺省「已完成」 */
  successLabel?: string;
  /** error 段撤销操作文字，缺省「撤销」 */
  undoLabel?: string;
  /** confirming 段按钮变体，默认 destructive */
  confirmVariant?: ConfirmMorphVariant;
  /** confirming 超时未确认自动回 idle 的时长（ms），默认 3000 */
  confirmTimeout?: number;
  /** success 段停留时长（ms），随后回 idle，默认 1500 */
  resetDelay?: number;
  /** 变体 */
  variant?: ConfirmMorphVariant;
  /** 尺寸 */
  size?: ConfirmMorphSize;
  disabled?: boolean;
  /** 确认回调：返回 Promise 时自动 pending，resolve→success、reject→error（Renderer 绑定 events.onConfirm） */
  onConfirm?: () => void | Promise<unknown>;
  /** error 段撤销回调（Renderer 绑定 events.onUndo） */
  onUndo?: () => void;
  /** 状态流转回调（Renderer 绑定 events.onStateChange） */
  onStateChange?: (state: ConfirmMorphState) => void;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * ConfirmMorph 适配器（扩展按钮族）：内联确认按钮。idle →
 * confirming → pending → success / error 状态机由 ui 层组件承载，
 * 适配器仅做 DSL 类型收窄与事件透传；onConfirm 返回 Promise 时
 * 自动 pending（Renderer 动作引擎的事件处理可返回 Promise）。
 */
export function ConfirmMorph({
  label,
  confirmLabel,
  pendingLabel,
  successLabel,
  undoLabel,
  confirmVariant,
  confirmTimeout,
  resetDelay,
  variant,
  size,
  disabled,
  onConfirm,
  onUndo,
  onStateChange,
  className,
  style,
}: ConfirmMorphProps) {
  return (
    <ShadcnConfirmMorph
      label={label}
      confirmLabel={confirmLabel}
      pendingLabel={pendingLabel}
      successLabel={successLabel}
      undoLabel={undoLabel}
      confirmVariant={confirmVariant}
      confirmTimeout={confirmTimeout}
      resetDelay={resetDelay}
      variant={variant}
      size={size}
      disabled={disabled}
      onConfirm={onConfirm}
      onUndo={() => onUndo?.()}
      onStateChange={(state) => onStateChange?.(state)}
      className={className}
      style={style}
    />
  );
}
