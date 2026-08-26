import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Button, Popover, PopoverContent, PopoverTrigger } from 'pactor-ui/ui';
import { useState } from 'react';

import { MOCK_CAPABILITIES } from '../mock-data';

/**
 * 能力 chip（对应参考页 composer 左侧能力胶囊）：当前能力 + 下拉弹层。
 * 选择结果仅是演示 UI 状态，不影响 mock transport 行为。
 * 弹层经 Popover（触发器即 chip 按钮，向上锚定），Escape / 外部点击关闭。
 */
export function CapabilityChip() {
  const [current, setCurrent] = useState(MOCK_CAPABILITIES[0]!);
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            title="选择能力"
          >
            <Sparkles size={12} />
            {current.label}
            {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </Button>
        }
      />
      <PopoverContent side="top" align="start" sideOffset={8} className="w-52 p-1">
        {MOCK_CAPABILITIES.map((capability) => (
          <button
            key={capability.value}
            type="button"
            role="menuitem"
            className="flex w-full cursor-pointer flex-col items-start gap-1 rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
            onClick={() => {
              setCurrent(capability);
              setOpen(false);
            }}
          >
            <span
              className={
                capability.value === current.value ? 'font-semibold' : undefined
              }
            >
              {capability.label}
            </span>
            <span className="text-xs text-muted-foreground">
              {capability.description}
            </span>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
