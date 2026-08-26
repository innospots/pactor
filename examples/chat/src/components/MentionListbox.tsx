import { Popover, PopoverContent } from 'pactor-ui/ui';
import { useEffect, useState } from 'react';

import { MOCK_AGENTS } from '../mock-data';

/**
 * `@` 提及列表（对应参考页 @space 弹层）：锚定在输入框上方，
 * 按 query 实时过滤 mock 代理，点击选中（转为上下文 chip）。
 * 锚点由调用方以 DOMRect 传入（Composer 输入框），经 Popover
 * Positioner 的虚拟元素 anchor 向上锚定；Escape / 外部点击关闭。
 * 键盘交互：↑/↓ 移动高亮、Enter 选中高亮项（捕获阶段拦截，
 * 避免落入 Composer 的发送/光标行为）。
 */
export function MentionListbox({
  query,
  rect,
  onClose,
  onSelect,
}: {
  query: string;
  rect: DOMRect;
  onClose: () => void;
  onSelect: (name: string) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = MOCK_AGENTS.filter(
    (agent) => !query || agent.name.includes(query) || agent.id.includes(query.toLowerCase()),
  );

  // query 变化（继续输入过滤词）后高亮回到第一项
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const select = (name: string): void => {
    onSelect(name);
    onClose();
  };

  // 捕获阶段拦截键盘导航：弹层打开期间 ↑/↓/Enter 不再传给输入框
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Enter') {
        return;
      }
      if (filtered.length === 0) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      if (event.key === 'Enter') {
        select(filtered[activeIndex]!.name);
      } else {
        const delta = event.key === 'ArrowDown' ? 1 : -1;
        setActiveIndex(
          (prev) => (prev + delta + filtered.length) % filtered.length,
        );
      }
    };
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length, activeIndex]);

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
        className="w-72 p-1"
        role="listbox"
      >
        {filtered.length === 0 ? (
          <div className="px-3 py-2 text-xs text-muted-foreground">
            没有匹配的代理
          </div>
        ) : (
          filtered.map((agent, index) => (
            <button
              key={agent.id}
              type="button"
              role="option"
              aria-selected={index === activeIndex}
              className={`flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-accent${
                index === activeIndex ? ' bg-accent' : ''
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => select(agent.name)}
            >
              <span>@{agent.name}</span>
              <span className="text-xs text-muted-foreground">
                {agent.description}
              </span>
            </button>
          ))
        )}
      </PopoverContent>
    </Popover>
  );
}
