import { BookOpen, History, UserRound } from 'lucide-react';

import type { PickerKind } from '../mock-data';
import { AnchoredPopup } from './AnchoredPopup';

/**
 * "+" 菜单（对应参考页 ChatSpaceMenu）：锚定在 "+" 按钮处的弹层，
 * 列出三类上下文选择器入口，点击由调用方打开对应 picker。
 */
const PLUS_MENU_ITEMS: { kind: PickerKind; label: string; icon: typeof History }[] = [
  { kind: 'history', label: '历史会话', icon: History },
  { kind: 'memory', label: '记忆', icon: BookOpen },
  { kind: 'persona', label: '人设', icon: UserRound },
];

export function PlusMenu({
  rect,
  onClose,
  onOpenPicker,
}: {
  rect: DOMRect;
  onClose: () => void;
  onOpenPicker: (kind: PickerKind) => void;
}) {
  return (
    <AnchoredPopup rect={rect} onClose={onClose}>
      {PLUS_MENU_ITEMS.map(({ kind, label, icon: Icon }) => (
        <button
          key={kind}
          type="button"
          role="menuitem"
          className="demo-popup__item demo-popup__item--row"
          onClick={() => {
            onClose();
            onOpenPicker(kind);
          }}
        >
          <Icon size={14} />
          <span className="demo-popup__item-label">{label}</span>
        </button>
      ))}
    </AnchoredPopup>
  );
}
