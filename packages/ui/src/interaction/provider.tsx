import { useI18n } from '@pactor-app/runtime';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import type { UiBridge, UiMessage, UiModal } from './actions.js';
import { cn } from '../lib/utils.js';
import { Button } from '../ui/button.js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog.js';

// props 契约类型（本地定义）
export interface InteractionProviderProps {
  /** registerInteractionActions 使用的同一 UiBridge（可变引用） */
  bridge: UiBridge;
  children?: ReactNode;
}

/** toast 类型（与 UiMessage 四态一致） */
type ToastType = 'success' | 'error' | 'info' | 'warning';

/** 单条 toast */
interface ToastItem {
  id: number;
  type: ToastType;
  content: ReactNode;
}

/** confirm 对话框状态（pending 表示等待用户选择） */
interface ConfirmState {
  title?: unknown;
  content?: unknown;
  onOk?: () => void;
  onCancel?: () => void;
}

/** toast 自动消失时长（毫秒） */
const TOAST_DURATION = 3000;

/** toast 类型 → 语义色边框/文本 class（读 --success/--warning/--info/--destructive 令牌） */
const toastTypeClass: Record<ToastType, string> = {
  success: 'border-l-4 border-l-success',
  error: 'border-l-4 border-l-destructive',
  info: 'border-l-4 border-l-info',
  warning: 'border-l-4 border-l-warning',
};

/**
 * ShadcnInteractionProvider：与 pactor-interaction 的 InteractionProvider
 * （antd 版）契约一致——mount 时向 UiBridge 注入自绘实现：
 *
 * - `modal.confirm({ title, content, onOk, onCancel })`：vendored shadcn
 *   Dialog 渲染确认框，确定/取消回调后关闭（先关闭再回调，时序对齐 antd
 *   Modal.confirm）；
 * - `message.{success,error,info,warning}`：toast 栈（容器固定右上角，
 *   自动约 3s 消失，类型色条读语义令牌）。
 *
 * unmount 时清空 bridge，动作退化为受控失败（与 antd 版相同）。
 */
export function ShadcnInteractionProvider({
  bridge,
  children,
}: InteractionProviderProps) {
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const { t } = useI18n();

  // UiModal / UiMessage 自绘实现：引用稳定（setState 函数引用不变），
  // 仅在卸载时随 cleanup 从 bridge 清空
  const { modal, message } = useMemo(() => {
    const pushToast = (type: ToastType, content: unknown): void => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, type, content: content as ReactNode }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, TOAST_DURATION);
    };
    const modalImpl: UiModal = {
      confirm(config) {
        setConfirmState({ ...config });
      },
    };
    const messageImpl: UiMessage = {
      success: (content) => pushToast('success', content),
      error: (content) => pushToast('error', content),
      info: (content) => pushToast('info', content),
      warning: (content) => pushToast('warning', content),
    };
    return { modal: modalImpl, message: messageImpl };
  }, []);

  useEffect(() => {
    bridge.modal = modal;
    bridge.message = message;
    return () => {
      bridge.modal = undefined;
      bridge.message = undefined;
    };
  }, [bridge, modal, message]);

  // 确认对话框：先关闭再回调（与 antd Modal.confirm 时序一致）
  const handleOk = () => {
    const state = confirmState;
    setConfirmState(null);
    state?.onOk?.();
  };
  const handleCancel = () => {
    const state = confirmState;
    setConfirmState(null);
    state?.onCancel?.();
  };

  return (
    <>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <>
            <Dialog
              open={confirmState !== null}
              onOpenChange={(open) => {
                if (!open) {
                  handleCancel();
                }
              }}
            >
              <DialogContent data-slot="confirm-dialog" className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>
                    {(confirmState?.title as ReactNode) ?? ''}
                  </DialogTitle>
                  {confirmState?.content !== undefined && (
                    <DialogDescription
                      render={<div>{confirmState.content as ReactNode}</div>}
                    />
                  )}
                </DialogHeader>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    {t('pactor.alertDialog.cancel')}
                  </Button>
                  <Button type="button" onClick={handleOk}>
                    {t('pactor.alertDialog.confirm')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {toasts.length > 0 && (
              <div
                data-slot="toast-container"
                className="fixed top-4 right-4 z-[100] flex w-80 flex-col gap-2"
              >
                {toasts.map((toast) => (
                  <div
                    key={toast.id}
                    data-slot="toast"
                    data-type={toast.type}
                    role="status"
                    className={cn(
                      'rounded-md border border-border bg-popover px-4 py-3 text-sm text-popover-foreground shadow-md',
                      toastTypeClass[toast.type],
                    )}
                  >
                    {toast.content}
                  </div>
                ))}
              </div>
            )}
          </>,
          document.body,
        )}
    </>
  );
}
