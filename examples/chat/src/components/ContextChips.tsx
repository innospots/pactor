import { X } from 'lucide-react';

/**
 * 已选上下文 chip（toolbarStart 区）：由 "+" 菜单选择器确认或
 * `@` 提及选中产生，如「历史：上次的对话」「@小助手」，可移除。
 */
export interface ContextChipData {
  id: string;
  label: string;
}

export function ContextChips({
  chips,
  onRemove,
}: {
  chips: ContextChipData[];
  onRemove: (id: string) => void;
}) {
  if (chips.length === 0) {
    return null;
  }
  return (
    <>
      {chips.map((chip) => (
        <span key={chip.id} className="demo-chip demo-chip--context">
          {chip.label}
          <button
            type="button"
            className="demo-chip__remove"
            title="移除"
            aria-label={`移除${chip.label}`}
            onClick={() => onRemove(chip.id)}
          >
            <X size={11} />
          </button>
        </span>
      ))}
    </>
  );
}
