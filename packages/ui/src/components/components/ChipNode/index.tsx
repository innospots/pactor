import type { CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';

export interface ChipNodeProps {
  /** 展示文案（可含计数，数据侧预计算） */
  text?: string;
  /** 选中态（接收布尔表达式结果） */
  selected?: boolean;
  /** 可选状态色点（CSS 颜色值） */
  dot?: string;
  /** 点击事件 */
  onClick?: () => void;
  /** 通用：根节点 class */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

/**
 * 快筛 Chip：未选中 = outline 小按钮（hover 走 accent）；
 * 选中 = 主色实底 + 主色前景文字（一眼可辨的激活态）。
 * 单枚使用时可经 props.selected 绑布尔表达式、events.onClick 注入动作；
 * 成组快筛优先用 ChipFilter（选项整体下发，无需逐枚硬编码）。
 *
 * DSL 用法：
 *   { type: 'ChipNode', props: { text: '启用 4', selected: "${state.status == 'enabled'}" },
 *     events: { onClick: [setState, reload] } }
 */
export function ChipNode({ text, selected, dot, onClick, className, style }: ChipNodeProps) {
  return (
    <button
      type="button"
      data-slot="chip-node"
      aria-pressed={selected === true}
      onClick={onClick}
      className={cn(
        'inline-flex h-8 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 text-xs font-medium whitespace-nowrap outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50',
        selected
          ? 'border-primary bg-primary text-primary-foreground shadow-sm'
          : 'border-border bg-card hover:bg-accent hover:text-accent-foreground',
        className,
      )}
      style={style}
    >
      {dot ? (
        <span data-slot="chip-dot" style={{ color: dot, fontSize: 10 }}>
          ●
        </span>
      ) : null}
      {text}
    </button>
  );
}
