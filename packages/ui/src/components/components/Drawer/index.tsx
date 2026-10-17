import type { DslNode } from '@pactor-app/core';
import { useI18n, useRenderer } from '@pactor-app/runtime';
import { XIcon } from 'lucide-react';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';

import { Button } from '../../../ui/button.js';
import {
  Drawer as ShadcnDrawer,
  DrawerContent,
  DrawerFooter,
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
  /** 是否允许按住面板拖拽关闭；缺省 false（完全禁止拖拽关闭，
   *  含底部把手），true 才开启面板拖拽；遮罩点击 / Escape 关闭不受影响 */
  draggable?: boolean;
  /** 右上角关闭图标；缺省 true */
  closable?: boolean;
  /** 底部操作栏：false 不展示；DslNode 自定义内容（容器右对齐，
   *  内容声明 w-full 可自行控制对齐）；缺省展示 [取消, 确定]，
   *  固定在抽屉底部（内容区独立滚动，不随内容滚走） */
  footer?: DslNode | false;
  /** 默认 footer「取消」按钮文案（缺省取 i18n `pactor.alertDialog.cancel`） */
  cancelText?: string;
  /** 默认 footer「确定」按钮文案（缺省取 i18n `pactor.alertDialog.confirm`） */
  okText?: string;
  /** 关闭事件（关闭图标 / 遮罩 / Escape / 拖拽关闭 / 默认 footer「取消」时触发） */
  onClose?: () => void;
  /** 确定事件（默认 footer「确定」按钮触发，Renderer 绑定 events.onOk） */
  onOk?: () => void;
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
 * drawer 原语（design D4）。`footer` 底部操作栏：缺省为
 * [取消（onClose）, 确定（onOk）] 右对齐、固定于抽屉底部；
 * 传 DslNode 自定义内容；传 false 不展示。
 *
 * 关闭链路（关闭图标 / 遮罩 / Escape / 拖拽 / 默认「取消」）统一走
 * handleClose：先回退式自闭合（内部 dismissed 标记，`open` 再次
 * 置 true 时复位），再触发 onClose 事件——DSL 未 wiring onClose
 * 时「取消」/ 关闭图标也能默认关闭。
 */
export function Drawer({
  title,
  open,
  placement = 'right',
  draggable,
  closable,
  footer,
  cancelText,
  okText,
  onClose,
  onOk,
  children,
  className,
  style,
}: DrawerProps) {
  const { renderChildren } = useRenderer();
  const { t } = useI18n();
  // 回退式自闭合：UI 途径关闭时置位；open 重新置 true 时复位
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    if (open) {
      setDismissed(false);
    }
  }, [open]);

  const handleClose = () => {
    setDismissed(true);
    onClose?.();
  };

  return (
    <ShadcnDrawer
      direction={placement}
      // modal={false}：vaul modal 会给 body 挂 pointer-events:none，
      // 抽屉内 Select/DatePicker 等 portal 弹层随之不可点击；
      // 遮罩仍覆盖全屏，点击关闭由遮罩 onClick 承担
      modal={false}
      // 缺省禁止拖拽关闭：handleOnly 下仅 vaul Handle 可拖，
      // 本内容不含 Handle，即全面板（含底部把手）均不可拖；
      // draggable=true 恢复自由拖拽
      handleOnly={draggable !== true}
      open={(open ?? false) && !dismissed}
      onOpenChange={(next: boolean) => {
        if (!next) {
          handleClose();
        }
      }}
    >
      <DrawerContent
        className={className}
        style={style}
        // onPointerDown 而非 onClick：Select 等弹层选项点击若在弹层关闭
        // 动画后才完成 pointerup，click 会穿透到遮罩造成误关；
        // pointerdown 只在按压起点落在遮罩时触发，无穿透窗口
        overlayProps={{ onPointerDown: handleClose }}
      >
        {closable !== false ? (
          <button
            type="button"
            data-slot="drawer-close-icon"
            aria-label={t('pactor.overlay.close')}
            className="absolute top-4 right-4 z-10 cursor-pointer rounded-xs opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            onClick={handleClose}
          >
            <XIcon className="size-4" />
          </button>
        ) : null}
        {title ? (
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
        ) : null}
        <div className="flex-1 overflow-auto p-4">{children}</div>
        {footer !== false ? (
          <DrawerFooter className="shrink-0 flex-row justify-end gap-2 border-t border-border px-4 py-3">
            {footer !== undefined ? (
              renderChildren([footer])
            ) : (
              <>
                <Button type="button" variant="outline" onClick={handleClose}>
                  {cancelText ?? t('pactor.alertDialog.cancel')}
                </Button>
                <Button type="button" onClick={() => onOk?.()}>
                  {okText ?? t('pactor.alertDialog.confirm')}
                </Button>
              </>
            )}
          </DrawerFooter>
        ) : null}
      </DrawerContent>
    </ShadcnDrawer>
  );
}
