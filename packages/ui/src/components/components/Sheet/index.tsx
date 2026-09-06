import type { CSSProperties, ReactNode } from 'react';

import {
  Sheet as ShadcnSheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../../../ui/sheet.js';

export type SheetSide = 'left' | 'right' | 'top' | 'bottom';

export interface SheetProps {
  /** 面板标题 */
  title?: string;
  /** 受控开关（可绑 `${state.x}` 表达式） */
  open?: boolean;
  /** 滑出方向，缺省 right */
  side?: SheetSide;
  /** 关闭事件（X / 遮罩 / Escape 任一途径关闭时触发） */
  onClose?: () => void;
  /** 内容（DSL 子树，经 Renderer children 机制渲染） */
  children?: ReactNode;
  /** 通用：根节点 class（挂在面板内容根节点，与内置样式合并） */
  className?: string;
  /** 通用：内联样式（同 className 挂载规则） */
  style?: CSSProperties;
}

/**
 * Sheet 适配器（shadcn kit）：受控 `open` + `side` 四边滑入；
 * 基于 vendored sheet 原语（dialog 同源），与 OverlayHost 视觉
 * 一致（design D4）。
 */
export function Sheet({
  title,
  open,
  side = 'right',
  onClose,
  children,
  className,
  style,
}: SheetProps) {
  return (
    <ShadcnSheet
      open={open ?? false}
      onOpenChange={(next) => {
        if (!next) {
          onClose?.();
        }
      }}
    >
      <SheetContent side={side} className={className} style={style}>
        {title ? (
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
        ) : null}
        <div className="flex-1 overflow-auto px-4">{children}</div>
      </SheetContent>
    </ShadcnSheet>
  );
}
