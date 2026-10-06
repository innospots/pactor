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
  /** 是否允许按住面板拖拽关闭；缺省 false（仅底部抽屉的把手可拖拽），
   *  遮罩点击 / Escape 关闭不受影响 */
  draggable?: boolean;
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
  draggable,
  onClose,
  children,
  className,
  style,
}: DrawerProps) {
  return (
    <ShadcnDrawer
      direction={placement}
      // modal={false}：vaul modal 会给 body 挂 pointer-events:none，
      // 抽屉内 Select/DatePicker 等 portal 弹层随之不可点击；
      // 遮罩仍覆盖全屏，点击关闭由遮罩 onClick 承担
      modal={false}
      // 缺省禁止按住面板拖拽关闭（handleOnly：仅把手可拖）；
      // draggable=true 恢复自由拖拽
      handleOnly={draggable !== true}
      open={open ?? false}
      onOpenChange={(next: boolean) => {
        if (!next) {
          onClose?.();
        }
      }}
    >
      <DrawerContent
        className={className}
        style={style}
        overlayProps={{ onClick: () => onClose?.() }}
      >
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
