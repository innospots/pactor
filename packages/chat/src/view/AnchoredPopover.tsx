import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

/**
 * AnchoredPopover（spec: chat-context-sources，设计决策 D3）：
 * 包内迷你锚定弹层，内部组件（不从 index.ts 导出）——模型 chip /
 * +菜单 / @提及弹层共用。不依赖 @pactor-app/ui（守零运行时依赖契约），
 * 样式进 styles.css 用语义令牌。
 *
 * 定位：`position: fixed` 按 anchorRect 定位，上方优先、垂直空间
 * 不足翻转到下方；水平左对齐锚点且不溢出右缘。尺寸未知时首帧以
 * visibility:hidden 量取弹层尺寸后再显示，避免闪烁。
 *
 * 关闭：Escape / 弹层外 pointerdown；不做复杂焦点陷阱，Escape 关闭
 * 时若焦点在弹层内则 blur（焦点还给 body 的自然位置）。
 */

/** 弹层计算后的定位结果（top / bottom 二选一） */
interface PopoverPosition {
  left: number;
  top?: number;
  bottom?: number;
  /** 翻转到锚点下方（对应 --below 修饰符） */
  below: boolean;
}

export interface AnchoredPopoverProps {
  /** 锚点矩形（触发元素的 getBoundingClientRect 结果） */
  anchorRect: DOMRect;
  /** 关闭回调（Escape / 弹层外 pointerdown 触发） */
  onClose: () => void;
  children?: ReactNode;
  /** 追加到弹层容器上的 class */
  className?: string;
  /** 容器 role，缺省 'dialog' */
  role?: string;
  /** 弹层与锚点的间距（px），缺省 8 */
  sideOffset?: number;
}

export function AnchoredPopover({
  anchorRect,
  onClose,
  children,
  className,
  role = 'dialog',
  sideOffset = 8,
}: AnchoredPopoverProps): ReactNode {
  const ref = useRef<HTMLDivElement | null>(null);
  // null = 尚未量取（首帧 visibility:hidden，量完再显示）
  const [position, setPosition] = useState<PopoverPosition | null>(null);

  // 首帧（及锚点变化时）量取弹层尺寸后定位：上方优先，弹层高度超过
  // 锚点上方可用空间时翻转到下方；水平左对齐锚点并 clamp 不溢出右缘
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const height = element.offsetHeight;
    const width = element.offsetWidth;
    const below = height + sideOffset > anchorRect.top;
    const left = Math.max(
      0,
      Math.min(anchorRect.left, window.innerWidth - width - sideOffset),
    );
    setPosition(
      below
        ? { below, left, top: anchorRect.bottom + sideOffset }
        : {
            below,
            left,
            bottom: window.innerHeight - anchorRect.top + sideOffset,
          },
    );
  }, [anchorRect, sideOffset]);

  // Escape / 弹层外 pointerdown 关闭（document 级监听，卸载即清理）
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') return;
      // 焦点在弹层内时先 blur，还给文档活动元素的自然位置（body）
      const element = ref.current;
      const active = document.activeElement;
      if (
        element &&
        active instanceof HTMLElement &&
        element.contains(active)
      ) {
        active.blur();
      }
      onClose();
    };
    const onPointerDown = (event: Event): void => {
      const element = ref.current;
      if (
        element &&
        event.target instanceof Node &&
        !element.contains(event.target)
      ) {
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, [onClose]);

  const classNames = [
    'pactor-chat-popover',
    position?.below ? 'pactor-chat-popover--below' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={ref}
      className={classNames}
      role={role}
      tabIndex={-1}
      style={{
        left: position?.left ?? anchorRect.left,
        top: position?.top,
        bottom: position?.bottom,
        visibility: position ? 'visible' : 'hidden',
      }}
    >
      {children}
    </div>
  );
}
