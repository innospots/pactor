import { BookOpen, History, UserRound } from 'lucide-react';
import { Popover, PopoverContent } from 'pactor-ui/ui';

import type { PickerKind } from '../mock-data';

/**
 * "+" 菜单（对应参考页 ChatSpaceMenu）：锚定在 "+" 按钮处的弹层，
 * 列出三类上下文选择器入口，点击由调用方打开对应 picker。
 * 锚点由调用方以 DOMRect 传入（Composer "+" 按钮），经 Popover
 * Positioner 的虚拟元素 anchor 向上锚定；Escape / 外部点击关闭。
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
    <Popover
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <PopoverContent
        anchor={{ getBoundingClientRect: () => rect }}
        side="top"
        align="start"
        sideOffset={8}
        className="w-52 p-1"
        role="menu"
      >
        {PLUS_MENU_ITEMS.map(({ kind, label, icon: Icon }) => (
          <button
            key={kind}
            type="button"
            role="menuitem"
            className="flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
            onClick={() => {
              onClose();
              onOpenPicker(kind);
            }}
          >
            <Icon size={14} />
            <span>{label}</span>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
