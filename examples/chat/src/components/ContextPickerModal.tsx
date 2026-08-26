import { useState } from 'react';

import {
  MOCK_PICKER_ENTRIES,
  PICKER_TITLES,
  type MockPickerEntry,
  type PickerKind,
} from '../mock-data';

/**
 * 上下文选择器（本地 Modal + 复选列表）：演示"+"菜单的 picker
 * 扩展模式——确认后把选中条目交给调用方转为上下文 chip。
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
    <div className="demo-modal__mask" onClick={onCancel}>
      <div
        className="demo-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`选择${PICKER_TITLES[kind]}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="demo-modal__title">{`选择${PICKER_TITLES[kind]}`}</div>
        <ul className="demo-picker__list">
          {entries.map((entry) => (
            <li key={entry.id}>
              <label className="demo-picker__item">
                <input
                  type="checkbox"
                  checked={checkedIds.includes(entry.id)}
                  onChange={() => toggle(entry.id)}
                />
                <span className="demo-picker__name">{entry.name}</span>
                <span className="demo-picker__desc">{entry.description}</span>
              </label>
            </li>
          ))}
        </ul>
        <div className="demo-modal__footer">
          <button type="button" className="demo-modal__btn" onClick={onCancel}>
            取消
          </button>
          <button
            type="button"
            className="demo-modal__btn demo-modal__btn--primary"
            disabled={checkedIds.length === 0}
            onClick={() =>
              onConfirm(entries.filter((entry) => checkedIds.includes(entry.id)))
            }
          >
            添加为上下文
          </button>
        </div>
      </div>
    </div>
  );
}
