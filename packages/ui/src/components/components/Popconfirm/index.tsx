import { useI18n } from '@pactor-app/runtime';
import { useState, type CSSProperties, type ReactNode } from 'react';

import { Button } from '../../../ui/button.js';
import {
  Popover as ShadcnPopover,
  PopoverContent,
  PopoverTrigger,
} from '../../../ui/popover.js';
import { triggerWrapper } from '../trigger-render.js';

export interface PopconfirmProps {
  /** 确认框标题 */
  title?: string;
  /** 辅助说明文案 */
  description?: string;
  /** 确认按钮文案（缺省取 i18n `pactor.alertDialog.confirm`，即「确定」） */
  confirmText?: string;
  /** 取消按钮文案（缺省取 i18n `pactor.alertDialog.cancel`，即「取消」） */
  cancelText?: string;
  /** 确认按钮使用危险色 */
  danger?: boolean;
  /** 确认事件：点击确认按钮触发，且浮层关闭 */
  onConfirm?: () => void;
  /** 取消事件：点击取消按钮触发，且浮层关闭 */
  onCancel?: () => void;
  /** 触发元素（DSL 子树，经 Renderer children 机制渲染） */
  children?: ReactNode;
  /** 通用：浮层内容根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：内联样式（同 className 挂载规则） */
  style?: CSSProperties;
}

/**
 * Popconfirm 适配器（shadcn kit）：基于 vendored Popover 的轻量确认框——
 * 点击触发元素弹出卡片（标题/说明 + 取消/确定按钮组），确认或取消后
 * 浮层关闭并触发对应事件。
 */
export function Popconfirm({
  title,
  description,
  confirmText,
  cancelText,
  danger = false,
  onConfirm,
  onCancel,
  children,
  className,
  style,
}: PopconfirmProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <ShadcnPopover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        nativeButton={false}
        render={triggerWrapper('popconfirm-trigger-wrap')}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent className={className} style={style}>
        <div className="grid gap-3">
          <div className="grid gap-1">
            {title ? (
              <div data-slot="popconfirm-title" className="font-medium">
                {title}
              </div>
            ) : null}
            {description ? (
              <div
                data-slot="popconfirm-description"
                className="text-sm text-muted-foreground"
              >
                {description}
              </div>
            ) : null}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setOpen(false);
                onCancel?.();
              }}
            >
              {cancelText ?? t('pactor.alertDialog.cancel')}
            </Button>
            <Button
              variant={danger ? 'destructive' : 'default'}
              size="sm"
              onClick={() => {
                setOpen(false);
                onConfirm?.();
              }}
            >
              {confirmText ?? t('pactor.alertDialog.confirm')}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </ShadcnPopover>
  );
}
