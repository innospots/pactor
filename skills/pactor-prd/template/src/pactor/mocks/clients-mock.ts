/**
 * 客户端（访问治理）演示数据服务（MVP mock，静态页面）。
 * client.list / client.detail 注册为 Pactor service；接入真实后端后替换为
 * http / service 数据源，DSL 绑定路径保持不变。
 * 数据形态对齐 PRD《访问治理/Client/01-列表页》《02-详情页》（③路由授权 / ④配额策略 /
 * ⑤限流策略 线框图与客户端额外的 ② AppKey、用量行）。
 * 共享子类型（AuthRoute / QuotaRule / RateLimitRule）从 client-templates-mock 导入，
 * 客户端配额规则在其上扩展用量字段（ClientQuotaRule）。
 */

import {
  authRouteSnapshot,
  quotaSummaryOf,
  rateLimitSummaryOf,
  type AuthRoute,
  type QuotaRule,
  type RateLimitRule,
} from "./client-templates-mock";

export type ClientStatus = "enabled" | "disabled" | "expired";

/** 客户端配额规则：在模板规则之上带运行用量（Runtime 维护，控制台近实时展示） */
export interface ClientQuotaRule extends QuotaRule {
  /** 已用量 */
  usageUsed?: number;
  /** 千分位已用量文案 */
  usageUsedText?: string;
  /** 用量百分比（Progress 组件 value 直接绑定） */
  usagePercent?: number;
  /** 下次重置时间（仅周期循环），如「今日 24:00」 */
  nextResetAt?: string;
}

export interface ClientRecord {
  code: string;
  name: string;
  tags: string[];
  description: string;
  status: ClientStatus;
  /** 启用 / 停用 / 已过期 */
  statusLabel: string;
  /** 到期时间（绝对时间），如 2027-01-01 23:59:59 */
  expiresAt: string;
  /** AppKey ID，如 gw-ak-7f3a2b1c */
  appKeyId: string;
  /** Secret 上次轮换时间 */
  secretLastRotatedAt: string;
  /** 来源模板（空白创建时为空） */
  templateCode?: string;
  templateName?: string;
  authRoutes: AuthRoute[];
  quotas: ClientQuotaRule[];
  rateLimits: RateLimitRule[];
  createdAt: string;
  updatedAt: string;
  operator: string;
  // ── 预计算摘要（表达式不适合拼接复合文案） ──
  routeCount: number;
  quotaSummary: string;
  rateLimitSummary: string;
  tagsText: string;
  /** Header 摘要：`gw-ak-7f3a2b1c · 到期 2027-01-01 · 3 路由 · 1000 RPM` */
  appKeySummary: string;
}

export interface ClientListParams {
  /** all | enabled | disabled | expired */
  status?: string;
  /** 名称模糊匹配 */
  name?: string;
  /** 标识模糊匹配 */
  code?: string;
  /** 标签多选（取交集） */
  tags?: string[];
}

/** 快筛 Chip 计数（数据构成口径，不随筛选变化） */
export interface ClientCounts {
  all: { enabled: number; total: number };
  status: Record<ClientStatus, number>;
  /** 键为标签的表达式安全形式（连字符转下划线） */
  tags: Record<string, number>;
}

/** 快筛 Chip 选项（ChipFilter 组件入项；文案在接口侧预计算） */
export interface ClientChipOption {
  value: string;
  text: string;
  dot?: string;
}

export interface ClientListResult {
  items: ClientRecord[];
  total: number;
  counts: ClientCounts;
  /** 快筛 Chip 组：tags 多选（含「全部」，点击清空） */
  filters: { tags: ClientChipOption[] };
}

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  enabled: "启用",
  disabled: "停用",
  expired: "已过期",
};

/** 用量行文案：`已用 3,240,000 / 10,000,000（32.4%）` */
export function usageSummaryOf(rule: ClientQuotaRule): string {
  if (rule.usageUsed == null || rule.usagePercent == null) return "";
  return `已用 ${rule.usageUsedText} / ${rule.limitText}（${rule.usagePercent}%）`;
}

/** 客户端配额规则用量字段派生 */
function deriveClientQuota(
  rule: ClientQuotaRule,
): ClientQuotaRule {
  const usageUsedText =
    rule.usageUsed != null ? rule.usageUsed.toLocaleString("en-US") : undefined;
  return { ...rule, usageUsedText };
}

/** 列表/详情页摘要字段派生 */
function derive(
  record: Omit<
    ClientRecord,
    | "statusLabel"
    | "routeCount"
    | "quotaSummary"
    | "rateLimitSummary"
    | "tagsText"
    | "appKeySummary"
  >,
): ClientRecord {
  const rateLimitSummary = rateLimitSummaryOf(record.rateLimits);
  return {
    ...record,
    quotas: record.quotas.map(deriveClientQuota),
    statusLabel: CLIENT_STATUS_LABELS[record.status],
    routeCount: record.authRoutes.length,
    quotaSummary: quotaSummaryOf(record.quotas),
    rateLimitSummary,
    tagsText: record.tags.join(" · "),
    appKeySummary: `${record.appKeyId} · 到期 ${record.expiresAt.slice(0, 10)} · ${record.authRoutes.length} 路由 · ${rateLimitSummary}`,
  };
}

const CLIENTS: ClientRecord[] = [
  derive({
    code: "agent-app",
    name: "agent-app",
    tags: ["agent", "prod"],
    description: "Agent 平台默认调用客户端",
    status: "enabled",
    expiresAt: "2027-01-01 23:59:59",
    appKeyId: "gw-ak-7f3a2b1c",
    secretLastRotatedAt: "2026-07-15",
    templateCode: "agent-default",
    templateName: "agent-default",
    authRoutes: [
      authRouteSnapshot("reasoning-default"),
      authRouteSnapshot("general-chat"),
      authRouteSnapshot("mobile-lite"),
    ],
    quotas: [
      {
        name: "lifetime-total",
        quotaType: "lifetime",
        quotaTypeLabel: "总配额",
        metric: "TOTAL_TOKEN",
        metricLabel: "Total Token",
        limit: 10000000,
        limitText: "10,000,000",
        mode: "hard",
        modeLabel: "Hard Limit",
        status: "enabled",
        usageUsed: 3240000,
        usagePercent: 32.4,
      },
      {
        name: "daily-token-cap",
        quotaType: "cyclic",
        quotaTypeLabel: "周期循环配额",
        metric: "TOTAL_TOKEN",
        metricLabel: "Total Token",
        limit: 500000,
        limitText: "500,000",
        mode: "soft",
        modeLabel: "Soft Limit",
        cycleUnit: "hour",
        cycleValue: 24,
        cycleLabel: "每 24 小时",
        status: "enabled",
        usageUsed: 120000,
        usagePercent: 24,
        nextResetAt: "今日 24:00",
      },
    ],
    rateLimits: [
      {
        name: "app-rpm",
        limitType: "RPM",
        limitTypeLabel: "RPM（每分钟请求数）",
        limit: 1000,
        limitText: "1,000",
        burst: 100,
        scopeAll: true,
        scopeLabel: "全部授权路由",
        status: "enabled",
      },
      {
        name: "concurrent-cap",
        limitType: "CONCURRENT",
        limitTypeLabel: "Concurrent（并发连接数）",
        limit: 50,
        limitText: "50",
        scopeAll: true,
        scopeLabel: "全部授权路由",
        status: "enabled",
      },
    ],
    createdAt: "2026-06-06 11:00",
    updatedAt: "2026-09-15 09:20",
    operator: "张三",
  }),
  derive({
    code: "web-portal",
    name: "web-portal",
    tags: ["web", "prod"],
    description: "Web 门户前端调用客户端",
    status: "enabled",
    expiresAt: "2027-12-31 23:59:59",
    appKeyId: "gw-ak-9c1d4e5f",
    secretLastRotatedAt: "2026-08-01",
    templateCode: "web-portal-base",
    templateName: "web-portal-base",
    authRoutes: [authRouteSnapshot("general-chat")],
    quotas: [
      {
        name: "weekly-request-cap",
        quotaType: "cyclic",
        quotaTypeLabel: "周期循环配额",
        metric: "REQUEST",
        metricLabel: "Request",
        limit: 100000,
        limitText: "100,000",
        mode: "soft",
        modeLabel: "Soft Limit",
        cycleUnit: "day",
        cycleValue: 7,
        cycleLabel: "每 7 天",
        status: "enabled",
        usageUsed: 12300,
        usagePercent: 12.3,
        nextResetAt: "2026-09-22 00:00",
      },
    ],
    rateLimits: [
      {
        name: "web-rpm",
        limitType: "RPM",
        limitTypeLabel: "RPM（每分钟请求数）",
        limit: 500,
        limitText: "500",
        scopeAll: true,
        scopeLabel: "全部授权路由",
        status: "enabled",
      },
    ],
    createdAt: "2026-07-02 10:00",
    updatedAt: "2026-09-10 16:40",
    operator: "李四",
  }),
  derive({
    code: "internal-batch",
    name: "internal-batch",
    tags: ["batch", "internal"],
    description: "内部离线批处理任务客户端（空白创建）",
    status: "enabled",
    expiresAt: "2027-06-30 23:59:59",
    appKeyId: "gw-ak-2b8e6a0d",
    secretLastRotatedAt: "2026-09-01",
    authRoutes: [
      authRouteSnapshot("reasoning-default"),
      authRouteSnapshot("embeddings-std"),
    ],
    quotas: [
      {
        name: "lifetime-total",
        quotaType: "lifetime",
        quotaTypeLabel: "总配额",
        metric: "TOTAL_TOKEN",
        metricLabel: "Total Token",
        limit: 50000000,
        limitText: "50,000,000",
        mode: "hard",
        modeLabel: "Hard Limit",
        status: "enabled",
        usageUsed: 8500000,
        usagePercent: 17,
      },
    ],
    rateLimits: [
      {
        name: "batch-tpm",
        limitType: "TPM",
        limitTypeLabel: "TPM（每分钟 Token 数）",
        limit: 2000000,
        limitText: "2,000,000",
        burst: 200000,
        scopeAll: true,
        scopeLabel: "全部授权路由",
        status: "enabled",
      },
    ],
    createdAt: "2026-08-10 14:30",
    updatedAt: "2026-09-08 20:15",
    operator: "王五",
  }),
  derive({
    code: "legacy-mobile",
    name: "legacy-mobile",
    tags: ["mobile", "legacy"],
    description: "旧版移动端 App 调用客户端（已停用，待下线）",
    status: "disabled",
    expiresAt: "2026-12-31 23:59:59",
    appKeyId: "gw-ak-5d7c9b2e",
    secretLastRotatedAt: "2026-03-12",
    authRoutes: [authRouteSnapshot("mobile-lite")],
    quotas: [
      {
        name: "weekly-request-cap",
        quotaType: "cyclic",
        quotaTypeLabel: "周期循环配额",
        metric: "REQUEST",
        metricLabel: "Request",
        limit: 50000,
        limitText: "50,000",
        mode: "soft",
        modeLabel: "Soft Limit",
        cycleUnit: "day",
        cycleValue: 7,
        cycleLabel: "每 7 天",
        status: "disabled",
        usageUsed: 0,
        usagePercent: 0,
      },
    ],
    rateLimits: [
      {
        name: "mobile-rpm",
        limitType: "RPM",
        limitTypeLabel: "RPM（每分钟请求数）",
        limit: 200,
        limitText: "200",
        scopeAll: true,
        scopeLabel: "全部授权路由",
        status: "disabled",
      },
    ],
    createdAt: "2026-05-15 09:00",
    updatedAt: "2026-08-20 18:00",
    operator: "李四",
  }),
  derive({
    code: "expired-trial",
    name: "expired-trial",
    tags: ["trial"],
    description: "试用体验客户端（到期自动失效）",
    status: "expired",
    expiresAt: "2026-08-31 23:59:59",
    appKeyId: "gw-ak-0a4f8c6b",
    secretLastRotatedAt: "2026-07-01",
    authRoutes: [authRouteSnapshot("general-chat")],
    quotas: [
      {
        name: "lifetime-request",
        quotaType: "lifetime",
        quotaTypeLabel: "总配额",
        metric: "REQUEST",
        metricLabel: "Request",
        limit: 10000,
        limitText: "10,000",
        mode: "hard",
        modeLabel: "Hard Limit",
        status: "enabled",
        usageUsed: 10000,
        usagePercent: 100,
      },
    ],
    rateLimits: [
      {
        name: "trial-rpm",
        limitType: "RPM",
        limitTypeLabel: "RPM（每分钟请求数）",
        limit: 60,
        limitText: "60",
        scopeAll: true,
        scopeLabel: "全部授权路由",
        status: "enabled",
      },
    ],
    createdAt: "2026-07-01 09:00",
    updatedAt: "2026-09-01 00:05",
    operator: "张三",
  }),
];

/** 快筛选项常量：状态（单选）与标签（多选） */
export const CLIENT_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "enabled", label: "启用" },
  { value: "disabled", label: "停用" },
  { value: "expired", label: "已过期" },
];

/** 标签快筛（按数据中出现顺序展示；多选取交集） */
export const CLIENT_TAG_FILTERS: { value: string; label: string }[] = [
  ...new Set(CLIENTS.flatMap((c) => c.tags)),
].map((t) => ({ value: t, label: t }));

/** 快筛计数：基于全量数据（构成口径，与当前筛选无关） */
function computeCounts(): ClientCounts {
  return {
    all: {
      enabled: CLIENTS.filter((c) => c.status === "enabled").length,
      total: CLIENTS.length,
    },
    status: {
      enabled: CLIENTS.filter((c) => c.status === "enabled").length,
      disabled: CLIENTS.filter((c) => c.status === "disabled").length,
      expired: CLIENTS.filter((c) => c.status === "expired").length,
    },
    tags: CLIENT_TAG_FILTERS.reduce<Record<string, number>>((acc, t) => {
      const key = t.value.replace(/-/g, "_");
      acc[key] = CLIENTS.filter((c) => c.tags.includes(t.value)).length;
      return acc;
    }, {}),
  };
}

/** 快筛 Chip 选项：由计数派生，文案在此预计算（表达式不支持复合文案拼接） */
function computeFilters(counts: ClientCounts): ClientListResult["filters"] {
  return {
    tags: [
      { value: "all", text: `全部 ${counts.all.total}` },
      ...CLIENT_TAG_FILTERS.map((t) => ({
        value: t.value,
        text: `${t.label} ${counts.tags[t.value.replace(/-/g, "_")]}`,
      })),
    ],
  };
}

/** client.list：状态单选 + 名称/标识模糊 + 标签多选取交集，按 Updated At 降序 */
export function queryClients(params: ClientListParams = {}): ClientListResult {
  const status = params.status ?? "all";
  const name = (params.name ?? "").trim().toLowerCase();
  const code = (params.code ?? "").trim().toLowerCase();
  const tags = params.tags ?? [];
  const items = CLIENTS.filter(
    (c) =>
      (status === "all" || c.status === status) &&
      (name === "" || c.name.toLowerCase().includes(name)) &&
      (code === "" || c.code.toLowerCase().includes(code)) &&
      (tags.length === 0 || tags.every((t) => c.tags.includes(t))),
  ).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const counts = computeCounts();
  return { items, total: CLIENTS.length, counts, filters: computeFilters(counts) };
}

/** client.detail：按客户端标识取详情；未命中返回 undefined（页面做空态） */
export function getClient(code: string): ClientRecord | undefined {
  return CLIENTS.find((c) => c.code === code);
}

/** 模板详情「已创建客户端」表：返回来源于该模板的客户端 */
export function clientsByTemplate(templateCode: string): ClientRecord[] {
  return CLIENTS.filter((c) => c.templateCode === templateCode).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
}

/** 全量客户端标识（静态导出 generateStaticParams 用） */
export const CLIENT_CODES: string[] = CLIENTS.map((c) => c.code);
