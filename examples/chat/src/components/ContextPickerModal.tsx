import { Modal } from 'antd';
import { useState } from 'react';

import {
  MOCK_PICKER_ENTRIES,
  PICKER_TITLES,
  type MockPickerEntry,
  type PickerKind,
} from '../mock-data';

/**
 * 上下文选择器（antd Modal + 复选列表）：演示"+"菜单的 picker
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
    <Modal
      open
      title={`选择${PICKER_TITLES[kind]}`}
      okText="添加为上下文"
      cancelText="取消"
      okButtonProps={{ disabled: checkedIds.length === 0 }}
      onOk={() => onConfirm(entries.filter((entry) => checkedIds.includes(entry.id)))}
      onCancel={onCancel}
      width={420}
    >
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
    </Modal>
  );
}
