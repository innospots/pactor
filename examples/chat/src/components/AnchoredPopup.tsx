import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * 锚定弹层（示例级小组件）：fixed 定位在 anchorRect 上方，
 * Escape / 外部 mousedown 关闭。能力 chip、"+" 菜单、模型选择器与
 * `@` 提及列表共用这一个实现。
 */
export interface AnchoredPopupProps {
  /** 锚点（触发元素的 getBoundingClientRect()） */
  rect: DOMRect;
  onClose: () => void;
  className?: string;
  role?: string;
  children?: ReactNode;
}

export function AnchoredPopup({ rect, onClose, className, role = 'menu', children }: AnchoredPopupProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  // onClose 存入 ref，避免因回调身份变化反复注册监听
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onCloseRef.current();
      }
    };
    const handleMouseDown = (event: MouseEvent): void => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        onCloseRef.current();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const left = Math.min(rect.left, window.innerWidth - 240);
  return createPortal(
    <div
      ref={rootRef}
      className={`demo-popup${className ? ` ${className}` : ''}`}
      role={role}
      style={{ left, bottom: window.innerHeight - rect.top + 8 }}
    >
      {children}
    </div>,
    document.body,
  );
}
