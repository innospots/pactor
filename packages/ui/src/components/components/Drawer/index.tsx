import type { CSSProperties, ReactNode } from 'react';

import {
  Drawer as ShadcnDrawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '../../../ui/drawer.js';

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerProps {
  /** 抽屉标题 */
  title?: string;
  /** 受控开关（可绑 `${state.x}` 表达式） */
  open?: boolean;
  /** 滑出方向，缺省 right */
  placement?: DrawerPlacement;
  /** 关闭事件（遮罩 / Escape / 拖拽关闭时触发） */
  onClose?: () => void;
  /** 内容（DSL 子树，经 Renderer children 机制渲染） */
  children?: ReactNode;
  /** 通用：根节点 class（挂在抽屉内容根节点，与内置样式合并） */
  className?: string;
  /** 通用：内联样式（同 className 挂载规则） */
  style?: CSSProperties;
}

/**
 * Drawer 适配器（shadcn kit，vaul 原语）：受控 `open` + `placement`
 * 四方向；与交互层 OverlayHost 的 drawer 共用同一套 vendored
 * drawer 原语（design D4）。
 */
export function Drawer({
  title,
  open,
  placement = 'right',
  onClose,
  children,
  className,
  style,
}: DrawerProps) {
  return (
    <ShadcnDrawer
      direction={placement}
      open={open ?? false}
      onOpenChange={(next) => {
        if (!next) {
          onClose?.();
        }
      }}
    >
      <DrawerContent className={className} style={style}>
        {title ? (
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
        ) : null}
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </DrawerContent>
    </ShadcnDrawer>
  );
}
