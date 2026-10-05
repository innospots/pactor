"use client";

/**
 * 启停状态徽标（Provider / Model / Route 页面共享的自定义组件）。
 * 映射规则：
 *   enabled / 启用   → ● 启用（绿色底纹，globals.css .badge-enabled）
 *   disabled / 停用  → ● 停用（secondary 灰底）
 *   expired / 已过期 → ● 已过期（warning 琥珀底纹）
 *   draft / 草稿     → 草稿（secondary 灰底，无圆点）
 *   其他             → ● <原值>
 * status 由 DSL props 表达式求值后传入，
 * 如 props: { status: "${data.detail.status}" } / { status: "${row.status}" }。
 */
const STATUS_LABELS: Record<string, string> = {
  enabled: "● 启用",
  disabled: "● 停用",
  expired: "● 已过期",
  draft: "草稿",
  启用: "● 启用",
  停用: "● 停用",
  已过期: "● 已过期",
  草稿: "草稿",
};

const BASE =
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap";

export function StatusBadge({ status }: { status?: string }) {
  const enabled = status === "enabled" || status === "启用";
  const expired = status === "expired" || status === "已过期";
  const text = STATUS_LABELS[status ?? ""] ?? `● ${status ?? "—"}`;
  return (
    <span
      data-slot="badge"
      className={`${BASE} ${
        enabled
          ? "badge-enabled border-transparent bg-primary text-primary-foreground"
          : expired
            ? "border-amber-500/45 bg-amber-500/15 text-amber-600 [data-pactor-theme=dark]:text-amber-400"
            : "border-transparent bg-secondary text-secondary-foreground"
      }`}
    >
      {text}
    </span>
  );
}
