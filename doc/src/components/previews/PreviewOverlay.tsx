/**
 * 预览全屏弹层：createPortal 挂载 body、覆盖整页（含顶栏，z-60），
 * 右上角固定关闭按钮；Esc 关闭，打开期间锁定 body 滚动。
 * 组件详情页「预览」页签右端展开按钮的目标容器。
 */
import { useEffect, type ReactElement, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@pactor-app/ui/ui';
import { Icon } from '@pactor-app/ui/components';

interface Props {
  onClose: () => void;
  children: ReactNode;
}

export default function PreviewOverlay({ onClose, children }: Props): ReactElement {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);
  return createPortal(
    <div className="preview-overlay">
      <Button
        variant="outline"
        size="icon-sm"
        onClick={onClose}
        aria-label="关闭预览"
        className="preview-overlay-close"
      >
        <Icon name="minimize-2" size={16} />
      </Button>
      <div className="preview-overlay-body">{children}</div>
    </div>,
    document.body,
  );
}
