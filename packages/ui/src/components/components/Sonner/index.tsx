import { useRenderer } from '@pactor-app/runtime';
import { useEffect, type CSSProperties } from 'react';

import { toast, Toaster, type ToastVariant } from '../../../ui/toast.js';

export interface SonnerProps {
  /** 通用：挂载点容器 class */
  className?: string;
  /** 通用：挂载点容器内联样式 */
  style?: CSSProperties;
}

/**
 * Sonner 适配器（shadcn kit，Base UI Toast 薄封装）：
 * DSL 组件形态仅作全局 toast 挂载点（渲染 Toaster）；同时在 mount 时
 * 向运行时动作注册表注册 `toast` 动作——DSL events 可写
 * `{ action: 'toast', params: { message, description?, variant? } }`
 * （variant: success/error/info）。
 *
 * 接线方式说明：runtime 动作注册表（Registry）天然支持外部扩展
 * （同 registerInteractionActions 的先例），无需修改 runtime；
 * 动作经本挂载组件注册，复用 vendored toast 原语的模块级
 * ToastManager（命令式 API 与 Toaster 共用同一实例）。
 */
export function Sonner({ className, style }: SonnerProps) {
  const { context } = useRenderer();

  useEffect(() => {
    const { actions } = context;
    if (actions.has('toast')) {
      return;
    }
    actions.register('toast', (action) => {
      const params = action.params ?? {};
      toast(params['message'], {
        description: params['description'],
        variant: params['variant'] as ToastVariant | undefined,
      });
      return { ok: true };
    });
  }, [context]);

  return (
    <div data-slot="sonner" className={className} style={style}>
      <Toaster />
    </div>
  );
}
