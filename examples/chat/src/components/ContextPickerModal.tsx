import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
} from 'pactor-ui/ui';
import { useState } from 'react';

import {
  MOCK_PICKER_ENTRIES,
  PICKER_TITLES,
  type MockPickerEntry,
  type PickerKind,
} from '../mock-data';

/**
 * 上下文选择器（Dialog + 复选列表）：演示"+"菜单的 picker
 * 扩展模式——确认后把选中条目交给调用方转为上下文 chip。
 * 遮罩点击 / Escape 关闭 = onCancel（Dialog 语义）。
 */
export function ContextPickerModal({
  kind,
  onCancel,
  onConfirm,
}: {
  kind: PickerKind;
  onCancel: () => void;
  onConfirm: (entries: MockPickerEntry[]) => void;
}) {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const entries = MOCK_PICKER_ENTRIES[kind];

  const toggle = (id: string): void => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          onCancel();
        }
      }}
    >
      <DialogContent showCloseButton={false} className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{`选择${PICKER_TITLES[kind]}`}</DialogTitle>
        </DialogHeader>
        <ul>
          {entries.map((entry) => (
            <li key={entry.id}>
              <Label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 hover:bg-accent">
                <input
                  type="checkbox"
                  checked={checkedIds.includes(entry.id)}
                  onChange={() => toggle(entry.id)}
                />
                <span className="text-sm font-medium">{entry.name}</span>
                <span className="text-xs text-muted-foreground">
                  {entry.description}
                </span>
              </Label>
            </li>
          ))}
        </ul>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button
            disabled={checkedIds.length === 0}
            onClick={() =>
              onConfirm(entries.filter((entry) => checkedIds.includes(entry.id)))
            }
          >
            添加为上下文
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
