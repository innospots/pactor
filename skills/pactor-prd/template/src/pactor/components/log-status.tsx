"use client";

/**
 * 调用日志状态色点徽标（运行管理 / 调用日志 共享的自定义组件）。
 * 映射规则（PRD《运行管理/01-调用日志列表与详情》状态图例）：
 *   success / 成功     → 绿点 成功（HTTP 2xx 且上游调用完成）
 *   error / 错误       → 红点 错误（4xx/5xx 或上游失败）
 *   unfinished / 未完成 → 橙点 未完成（请求中断、超时未完成）
 *   cancelled / 已取消 → 紫点 已取消（客户端或网关主动取消）
 *   其他               → 灰点（未归类状态 / 未知值原样展示）
 * status 由 DSL props 表达式求值后传入，
 * 如 props: { status: "${row.status}" } / { status: "${data.detail.status}" }。
 */
const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  success: {
    label: "成功",
    className: "text-emerald-600 [data-pactor-theme=dark]:text-emerald-400",
  },
  error: {
    label: "错误",
    className: "text-red-600 [data-pactor-theme=dark]:text-red-400",
  },
  unfinished: {
    label: "未完成",
    className: "text-amber-600 [data-pactor-theme=dark]:text-amber-400",
  },
  cancelled: {
    label: "已取消",
    className: "text-violet-600 [data-pactor-theme=dark]:text-violet-400",
  },
  other: { label: "其他", className: "text-muted-foreground" },
  成功: {
    label: "成功",
    className: "text-emerald-600 [data-pactor-theme=dark]:text-emerald-400",
  },
  错误: {
    label: "错误",
    className: "text-red-600 [data-pactor-theme=dark]:text-red-400",
  },
  未完成: {
    label: "未完成",
    className: "text-amber-600 [data-pactor-theme=dark]:text-amber-400",
  },
  已取消: {
    label: "已取消",
    className: "text-violet-600 [data-pactor-theme=dark]:text-violet-400",
  },
  其他: { label: "其他", className: "text-muted-foreground" },
};

export function LogStatus({ status }: { status?: string }) {
  const cfg = STATUS_CONFIG[status ?? ""] ?? {
    label: status ?? "—",
    className: "text-muted-foreground",
  };
  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap text-xs font-medium ${cfg.className}`}
    >
      <span className="size-2 rounded-full bg-current" />
      {cfg.label}
    </span>
  );
}
