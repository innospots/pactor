import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import { XIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '../lib/utils.js';

/**
 * shadcn/ui Sonner 等价物（vendored 封装，Base UI Toast 原语）：
 * 模块级共享 ToastManager + Toaster 挂载点 + 命令式 `toast()` API。
 * variant（success/error/info）落在 ToastObject.type 上，经语义令牌
 * 色条区分（与 InteractionProvider 的 message 四态视觉同源）。
 */
export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastOptions {
  /** 辅助说明文案（Sonner 风格 description） */
  description?: unknown;
  /** 语义类型，缺省 info */
  variant?: ToastVariant;
}

/** 模块级共享 ToastManager：Toaster 挂载点与命令式 API 共用同一实例 */
export const toastManager = ToastPrimitive.createToastManager();

/** 命令式 toast 调用（DSL 动作层入口的最终落点） */
export function toast(message: unknown, options: ToastOptions = {}): string {
  return toastManager.add({
    title: message as ReactNode,
    description: options.description as ReactNode,
    type: options.variant ?? 'info',
  });
}

/** variant → 语义色条 class（读 --success/--destructive/--info 令牌） */
const toastVariantClass: Record<ToastVariant, string> = {
  success: 'border-l-4 border-l-success',
  error: 'border-l-4 border-l-destructive',
  info: 'border-l-4 border-l-info',
};

function ToasterViewport({ className }: { className?: string }) {
  const { toasts } = ToastPrimitive.useToastManager();
  return (
    <ToastPrimitive.Portal>
      <ToastPrimitive.Viewport
        data-slot="toast-viewport"
        className={cn(
          'fixed top-4 right-4 z-[100] flex w-80 flex-col gap-2 outline-none',
          className,
        )}
      >
        {toasts.map((item) => (
          <ToastPrimitive.Root
            key={item.id}
            toast={item}
            data-slot="toast"
            data-type={item.type ?? 'info'}
            className={cn(
              'rounded-md border border-border bg-popover px-4 py-3 text-sm text-popover-foreground shadow-md transition-[opacity,transform] duration-200 data-ending-style:animate-toast-out data-starting-style:animate-toast-in',
              toastVariantClass[(item.type as ToastVariant) ?? 'info'] ??
                toastVariantClass.info,
            )}
          >
            <ToastPrimitive.Content className="flex items-start justify-between gap-2">
              <div className="grid gap-0.5">
                <ToastPrimitive.Title
                  data-slot="toast-title"
                  className="font-medium"
                />
                <ToastPrimitive.Description
                  data-slot="toast-description"
                  className="text-muted-foreground"
                />
              </div>
              <ToastPrimitive.Close
                data-slot="toast-close"
                aria-label="Close"
                className="cursor-pointer rounded-xs opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none [&_svg]:size-3.5"
              >
                <XIcon />
              </ToastPrimitive.Close>
            </ToastPrimitive.Content>
          </ToastPrimitive.Root>
        ))}
      </ToastPrimitive.Viewport>
    </ToastPrimitive.Portal>
  );
}

/** Sonner 挂载点：渲染共享 manager 的 Toast Provider + Viewport */
function Toaster({ className }: { className?: string }) {
  return (
    <ToastPrimitive.Provider toastManager={toastManager}>
      <ToasterViewport className={className} />
    </ToastPrimitive.Provider>
  );
}

export { Toaster };
