import type {
  InteractionProviderProps,
  UiMessage,
  UiModal,
} from 'pactor-ui-antd/interaction';
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

// props 契约类型直接复用 pactor-ui-antd interaction 层（antd 版）的导出
export type { InteractionProviderProps } from 'pactor-ui-antd/interaction';

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

/**
 * RadixInteractionProvider：与 pactor-interaction 的 InteractionProvider
 * （antd 版）契约一致——mount 时向 UiBridge 注入自绘实现：
 *
 * - `modal.confirm({ title, content, onOk, onCancel })`：门户渲染单个
 *   确认对话框，确定/取消回调后关闭；
 * - `message.{success,error,info,warning}`：toast 栈（容器固定右上角，
 *   自动约 3s 消失）。
 *
 * unmount 时清空 bridge，动作退化为受控失败（与 antd 版相同）。
 */
export function RadixInteractionProvider({
  bridge,
  children,
}: InteractionProviderProps) {
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

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
            {confirmState !== null && (
              <div className="pcr-confirm-root" role="presentation">
                <div className="pcr-confirm-mask" onClick={handleCancel} />
                <div
                  className="pcr-confirm-dialog"
                  role="alertdialog"
                  aria-modal="true"
                >
                  {confirmState.title !== undefined && (
                    <div className="pcr-confirm-title">
                      {confirmState.title as ReactNode}
                    </div>
                  )}
                  {confirmState.content !== undefined && (
                    <div className="pcr-confirm-content">
                      {confirmState.content as ReactNode}
                    </div>
                  )}
                  <div className="pcr-confirm-actions">
                    <button
                      type="button"
                      className="pcr-confirm-cancel"
                      onClick={handleCancel}
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      className="pcr-confirm-ok"
                      onClick={handleOk}
                    >
                      确定
                    </button>
                  </div>
                </div>
              </div>
            )}
            {toasts.length > 0 && (
              <div className="pcr-toast-container">
                {toasts.map((toast) => (
                  <div
                    key={toast.id}
                    className={`pcr-toast pcr-toast-${toast.type}`}
                    role="status"
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
