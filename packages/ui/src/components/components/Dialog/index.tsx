import type { DslNode } from '@pactor-app/core';
import { useRenderer } from '@pactor-app/runtime';
import { useState, type CSSProperties, type ReactNode } from 'react';

import {
  Dialog as ShadcnDialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../ui/dialog.js';
import { triggerWrapper } from '../trigger-render.js';

export interface DialogProps {
  /** 对话框标题 */
  title?: string;
  /** 辅助说明 */
  description?: string;
  /** 受控开关（可绑 `${state.x}` 表达式）；缺省时由 trigger 自管理 */
  open?: boolean;
  /** 关闭事件（X / 遮罩 / Escape 任一途径关闭时触发） */
  onClose?: () => void;
  /** 触发元素（DSL 子树，非受控用法下点击打开） */
  trigger?: DslNode;
  /** 内容（DSL 子树，经 Renderer children 机制渲染） */
  children?: ReactNode;
  /** 通用：根节点 class（挂在弹层内容根节点，与内置样式合并） */
  className?: string;
  /** 通用：内联样式（同 className 挂载规则） */
  style?: CSSProperties;
}

/**
 * Dialog 适配器（shadcn kit）：受控 `open`（表达式绑定）+ `onClose`；
 * 非受控时可用 `trigger` DSL 子树作触发元素。与交互层 OverlayHost
 * 的 modal 共用同一套 vendored dialog 原语（design D4）。
 */
export function Dialog({
  title,
  description,
  open,
  onClose,
  trigger,
  children,
  className,
  style,
}: DialogProps) {
  const { renderChildren } = useRenderer();
  const [innerOpen, setInnerOpen] = useState(false);
  const controlled = open !== undefined;
  const visible = controlled ? open : innerOpen;

  return (
    <ShadcnDialog
      open={visible}
      onOpenChange={(next) => {
        if (!controlled) {
          setInnerOpen(next);
        }
        if (!next) {
          onClose?.();
        }
      }}
    >
      {trigger ? (
        <DialogTrigger
          nativeButton={false}
          render={triggerWrapper('dialog-trigger-wrap')}
        >
          {renderChildren([trigger])}
        </DialogTrigger>
      ) : null}
      <DialogContent className={className} style={style}>
        {title || description ? (
          <DialogHeader>
            {title ? <DialogTitle>{title}</DialogTitle> : null}
            {description ? <DialogDescription>{description}</DialogDescription> : null}
          </DialogHeader>
        ) : null}
        {children}
      </DialogContent>
    </ShadcnDialog>
  );
}
