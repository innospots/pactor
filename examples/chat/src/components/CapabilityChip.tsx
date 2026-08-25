import { ChevronDown, Sparkles } from 'lucide-react';
import { useRef, useState } from 'react';

import { MOCK_CAPABILITIES } from '../mock-data';
import { AnchoredPopup } from './AnchoredPopup';

/**
 * 能力 chip（对应参考页 composer 左侧能力胶囊）：当前能力 + 下拉弹层。
 * 选择结果仅是演示 UI 状态，不影响 mock transport 行为。
 */
export function CapabilityChip() {
  const [current, setCurrent] = useState(MOCK_CAPABILITIES[0]!);
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
        title="选择能力"
        onClick={toggle}
      >
        <Sparkles size={12} />
        {current.label}
        <ChevronDown size={12} className={anchorRect ? 'demo-chip__chevron--open' : undefined} />
      </button>
      {anchorRect && (
        <AnchoredPopup rect={anchorRect} onClose={() => setAnchorRect(null)}>
          {MOCK_CAPABILITIES.map((capability) => (
            <button
              key={capability.value}
              type="button"
              role="menuitem"
              className={`demo-popup__item${
                capability.value === current.value ? ' demo-popup__item--active' : ''
              }`}
              onClick={() => {
                setCurrent(capability);
                setAnchorRect(null);
              }}
            >
              <span className="demo-popup__item-label">{capability.label}</span>
              <span className="demo-popup__item-desc">{capability.description}</span>
            </button>
          ))}
        </AnchoredPopup>
      )}
    </>
  );
}
