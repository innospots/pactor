import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button, Popover, PopoverContent, PopoverTrigger } from 'pactor-ui/ui';
import { useState } from 'react';

import { MOCK_MODELS } from '../mock-data';

/**
 * 模型选择 chip（对应参考页 composer 右侧模型选择器）：
 * 当前模型 + 下拉弹层，选择结果仅是演示 UI 状态。
 * 弹层经 Popover（触发器即 chip 按钮，向上锚定），Escape / 外部点击关闭。
 */
export function ModelSelector() {
  const [current, setCurrent] = useState(MOCK_MODELS[0]!);
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            title="选择模型"
          >
            模型: {current.label}
            {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </Button>
        }
      />
      <PopoverContent side="top" align="start" sideOffset={8} className="w-52 p-1">
        {MOCK_MODELS.map((model) => (
          <button
            key={model.value}
            type="button"
            role="menuitem"
            className="flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
            onClick={() => {
              setCurrent(model);
              setOpen(false);
            }}
          >
            <span
              className={
                model.value === current.value ? 'font-semibold' : undefined
              }
            >
              {model.label}
            </span>
            {model.value === current.value && <Check size={13} />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
