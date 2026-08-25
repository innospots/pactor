import { Check, ChevronDown } from 'lucide-react';
import { useRef, useState } from 'react';

import { MOCK_MODELS } from '../mock-data';
import { AnchoredPopup } from './AnchoredPopup';

/**
 * 模型选择 chip（对应参考页 composer 右侧模型选择器）：
 * 当前模型 + 下拉弹层，选择结果仅是演示 UI 状态。
 */
export function ModelSelector() {
  const [current, setCurrent] = useState(MOCK_MODELS[0]!);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggle = (): void => {
    setAnchorRect((prev) =>
      prev ? null : buttonRef.current!.getBoundingClientRect(),
    );
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="demo-chip demo-chip--interactive"
        title="选择模型"
        onClick={toggle}
      >
        模型: {current.label}
        <ChevronDown size={12} className={anchorRect ? 'demo-chip__chevron--open' : undefined} />
      </button>
      {anchorRect && (
        <AnchoredPopup rect={anchorRect} onClose={() => setAnchorRect(null)}>
          {MOCK_MODELS.map((model) => (
            <button
              key={model.value}
              type="button"
              role="menuitem"
              className={`demo-popup__item demo-popup__item--row${
                model.value === current.value ? ' demo-popup__item--active' : ''
              }`}
              onClick={() => {
                setCurrent(model);
                setAnchorRect(null);
              }}
            >
              <span className="demo-popup__item-label">{model.label}</span>
              {model.value === current.value && <Check size={13} />}
            </button>
          ))}
        </AnchoredPopup>
      )}
    </>
  );
}
