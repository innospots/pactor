"use client";

/**
 * 快筛 Chip（Provider / Model / Route 列表页共享的自定义组件）。
 * 未选中 = outline 小按钮（border-border，hover 走 accent）；
 * 选中 = 主色实底 + 主色前景文字（一眼可辨的激活态）。
 * text / selected 由运行时对 props 模板求值后传入（selected 接收布尔表达式结果）；
 * dot 为可选状态色点（Provider 状态快筛使用）；
 * 点击动作由 DSL 节点 events.onClick 注入（运行时执行为回调，语义同 Button onClick）。
 *
 * DSL 用法：
 *   {
 *     type: "ChipNode",
 *     props: {
 *       text: "全部 ${counts.all.enabled}/${counts.all.total}",
 *       selected: "${state.statusChip == 'all'}",
 *     },
 *     events: { onClick: [setState / reload ...] },
 *   }
 */
export function ChipNode({
  text,
  selected,
  dot,
  onClick,
}: {
  text?: string;
  selected?: boolean;
  dot?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-8 shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border px-3 text-xs font-medium outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 ${
        selected
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-card hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      {dot ? <span style={{ color: dot, fontSize: 10 }}>●</span> : null}
      {text}
    </button>
  );
}
