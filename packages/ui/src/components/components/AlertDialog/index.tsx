import type { DslNode } from '@pactor-app/core';
import { useI18n, useRenderer } from '@pactor-app/runtime';
import { useState, type CSSProperties } from 'react';

import {
  AlertDialog as ShadcnAlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../../ui/alert-dialog.js';
import { triggerWrapper } from '../trigger-render.js';

export interface AlertDialogProps {
  /** 标题 */
  title?: string;
  /** 说明内容 */
  description?: string;
  /** 确认按钮文案（缺省取 i18n `pactor.alertDialog.confirm`，与 InteractionProvider confirm 一致） */
  confirmText?: string;
  /** 取消按钮文案（缺省取 i18n `pactor.alertDialog.cancel`） */
  cancelText?: string;
  /** 受控开关（可绑表达式）；缺省时由 trigger 自管理 */
  open?: boolean;
  /** 确认事件：点击确认按钮触发，且弹层关闭 */
  onConfirm?: () => void;
  /** 取消事件：点击取消按钮触发，且弹层关闭 */
  onCancel?: () => void;
  /** 触发元素（DSL 子树，非受控用法下点击打开） */
  trigger?: DslNode;
  /** 通用：根节点 class（挂在弹层内容根节点，与内置样式合并） */
  className?: string;
  /** 通用：内联样式（同 className 挂载规则） */
  style?: CSSProperties;
}

/**
 * AlertDialog 适配器（shadcn kit）：确认/取消按钮语义化封装——
 * 点击确认先执行 onConfirm 再关闭（Action 为 Base UI Close，
 * 关闭由原语完成）；取消同理执行 onCancel。与 vendored dialog
 * 共享 Backdrop/Popup，视觉与 OverlayHost modal 一致（design D4）。
 */
export function AlertDialog({
  title,
  description,
  confirmText,
  cancelText,
  open,
  onConfirm,
  onCancel,
  trigger,
  className,
  style,
}: AlertDialogProps) {
  const { renderChildren } = useRenderer();
  const { t } = useI18n();
  const [innerOpen, setInnerOpen] = useState(false);
  const controlled = open !== undefined;
  const visible = controlled ? open : innerOpen;

  return (
    <ShadcnAlertDialog
      open={visible}
      onOpenChange={(next) => {
        if (!controlled) {
          setInnerOpen(next);
        }
      }}
    >
      {trigger ? (
        <AlertDialogTrigger
          nativeButton={false}
          render={triggerWrapper('alert-dialog-trigger-wrap')}
        >
          {renderChildren([trigger])}
        </AlertDialogTrigger>
      ) : null}
      <AlertDialogContent className={className} style={style}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title ?? ''}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onCancel?.()}>
            {cancelText ?? t('pactor.alertDialog.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => onConfirm?.()}>
            {confirmText ?? t('pactor.alertDialog.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </ShadcnAlertDialog>
  );
}
