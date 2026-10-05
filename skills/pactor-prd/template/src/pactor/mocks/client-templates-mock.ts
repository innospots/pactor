/**
 * 客户端模板（访问治理）演示数据服务（MVP mock，静态页面）。
 * clientTemplate.list / clientTemplate.detail 注册为 Pactor service；接入真实后端后
 * 替换为 http / service 数据源，DSL 绑定路径保持不变。
 * 数据形态对齐 PRD《访问治理/Client-Template/01-列表页》《02-详情页》与
 * 《Client/02-客户端详情页》③路由授权 / ④配额策略 / ⑤限流策略 线框图。
 * 共享子类型（AuthRoute / QuotaRule / RateLimitRule）在本文件定义并导出，
 * clients-mock 从这里 import（避免与 routes-mock 形成循环依赖）。
 */

import { getRoute } from "./routes-mock";

export type ClientTemplateStatus = "enabled" | "disabled";
export type ValidityType = "days" | "fixed" | "never";
export type QuotaType = "lifetime" | "cyclic";
export type QuotaMetric =
  | "REQUEST"
  | "INPUT_TOKEN"
  | "OUTPUT_TOKEN"
  | "TOTAL_TOKEN"
  | "COST"
  | "CONCURRENT";
export type QuotaMode = "soft" | "hard";
export type CycleUnit = "hour" | "day" | "month";
export type RateLimitType = "RPM" | "TPM" | "CONCURRENT";
export type RuleStatus = "enabled" | "disabled";

/** 授权路由快照：引用 routes-mock 中已启用路由的展示字段（code/name/alias/typeLabel/path） */
export interface AuthRoute {
  code: string;
  name: string;
  alias: string;
  typeLabel: string;
  path: string;
}

/** 配额规则（模板仅配置规则；客户端另带用量，见 clients-mock ClientQuotaRule） */
export interface QuotaRule {
  /** 规则名称，策略内唯一 */
  name: string;
  quotaType: QuotaType;
  /** 总配额 / 周期循环配额 */
  quotaTypeLabel: string;
  metric: QuotaMetric;
  metricLabel: string;
  limit: number;
  /** 千分位上限文案（表达式不适合做数字格式化，derive 预计算） */
  limitText: string;
  mode: QuotaMode;
  /** Soft Limit / Hard Limit */
  modeLabel: string;
  /** 循环周期（仅 quotaType=cyclic）：每 X 小时 / 每 X 天 / 每月（自然月） */
  cycleUnit?: CycleUnit;
  cycleValue?: number;
  /** 如「每 24 小时」「每 7 天」「每月（自然月）」 */
  cycleLabel?: string;
  status: RuleStatus;
}

/** 限流规则 */
export interface RateLimitRule {
  name: string;
  limitType: RateLimitType;
  /** 如「RPM（每分钟请求数）」 */
  limitTypeLabel: string;
  limit: number;
  /** 千分位上限文案 */
  limitText: string;
  /** 突发容量（RPM/TPM 可选；Concurrent 无） */
  burst?: number;
  /** true = 全部授权路由；false 时 scopeRoutes 为指定路由 code 列表 */
  scopeAll: boolean;
  scopeRoutes?: string[];
  /** 「全部授权路由」或路由名列表 */
  scopeLabel: string;
  status: RuleStatus;
}

export interface ClientTemplateRecord {
  code: string;
  name: string;
  tags: string[];
  description: string;
  status: ClientTemplateStatus;
  statusLabel: string;
  /** 有效期规则：创建后 N 天 / 固定日期 / 永不过期 */
  validityType: ValidityType;
  validityDays?: number;
  validityFixedDate?: string;
  /** 如「创建后 365 天」「固定至 2027-12-31」「永不过期」 */
  validityLabel: string;
  authRoutes: AuthRoute[];
  quotas: QuotaRule[];
  rateLimits: RateLimitRule[];
  /** 基于本模板创建的客户端数 */
  createdClientCount: number;
  createdAt: string;
  updatedAt: string;
  operator: string;
  // ── 预计算摘要（表达式不适合拼接复合文案） ──
  /** 授权路由数 */
  routeCount: number;
  /** 配额摘要，如「总+日循环」 */
  quotaSummary: string;
  /** 限流摘要，如「1000 RPM」 */
  rateLimitSummary: string;
  tagsText: string;
  /** 策略摘要，如「3 路由 · 总+日循环 · 1000 RPM」 */
  policySummary: string;
}

export interface ClientTemplateListParams {
  /** all | enabled | disabled */
  status?: string;
  /** 名称 / 标识模糊匹配 */
  keyword?: string;
  /** 标签多选（取交集） */
  tags?: string[];
}

/** 快筛 Chip 计数（数据构成口径，不随筛选变化） */
export interface ClientTemplateCounts {
  all: { enabled: number; total: number };
  status: Record<ClientTemplateStatus, number>;
  /** 键为标签的表达式安全形式（连字符转下划线，如 team-default → team_default） */
  tags: Record<string, number>;
}

/** 快筛 Chip 选项（ChipFilter 组件入项；文案在接口侧预计算） */
export interface ClientTemplateChipOption {
  value: string;
  text: string;
  dot?: string;
}

export interface ClientTemplateListResult {
  items: ClientTemplateRecord[];
  total: number;
  counts: ClientTemplateCounts;
  /** 快筛 Chip 组：status 单选（含「全部」），tags 多选（含「全部」，点击清空） */
  filters: {
    status: ClientTemplateChipOption[];
    tags: ClientTemplateChipOption[];
  };
}

export const TEMPLATE_STATUS_LABELS: Record<ClientTemplateStatus, string> = {
  enabled: "启用",
  disabled: "停用",
};

export const QUOTA_TYPE_LABELS: Record<QuotaType, string> = {
  lifetime: "总配额",
  cyclic: "周期循环配额",
};

export const QUOTA_METRIC_LABELS: Record<QuotaMetric, string> = {
  REQUEST: "Request",
  INPUT_TOKEN: "Input Token",
  OUTPUT_TOKEN: "Output Token",
  TOTAL_TOKEN: "Total Token",
  COST: "Cost",
  CONCURRENT: "Concurrent",
};

export const QUOTA_MODE_LABELS: Record<QuotaMode, string> = {
  soft: "Soft Limit",
  hard: "Hard Limit",
};

export const RATE_LIMIT_TYPE_LABELS: Record<RateLimitType, string> = {
  RPM: "RPM（每分钟请求数）",
  TPM: "TPM（每分钟 Token 数）",
  CONCURRENT: "Concurrent（并发连接数）",
};

/** 千分位数字文案（10,000,000） */
export function thousands(n: number): string {
  return n.toLocaleString("en-US");
}

/** 授权路由快照：按 code 引用 routes-mock 的已启用路由（clients-mock 复用） */
export function authRouteSnapshot(code: string): AuthRoute {
  const r = getRoute(code);
  if (!r) throw new Error(`client-templates-mock: 未知路由 ${code}`);
  return {
    code: r.code,
    name: r.name,
    alias: r.alias,
    typeLabel: r.typeLabel,
    path: r.path,
  };
}

/** 循环周期文案（仅周期循环配额） */
function cycleLabel(unit: CycleUnit, value?: number): string {
  if (unit === "month") return "每月（自然月）";
  if (unit === "day") return `每 ${value ?? 1} 天`;
  return `每 ${value ?? 24} 小时`;
}

/** 配额规则展示字段派生 */
function deriveQuota(
  rule: Omit<
    QuotaRule,
    "quotaTypeLabel" | "metricLabel" | "limitText" | "modeLabel" | "cycleLabel"
  >,
): QuotaRule {
  return {
    ...rule,
    quotaTypeLabel: QUOTA_TYPE_LABELS[rule.quotaType],
    metricLabel: QUOTA_METRIC_LABELS[rule.metric],
    limitText: thousands(rule.limit),
    modeLabel: QUOTA_MODE_LABELS[rule.mode],
    cycleLabel:
      rule.quotaType === "cyclic" && rule.cycleUnit
        ? cycleLabel(rule.cycleUnit, rule.cycleValue)
        : undefined,
  };
}

/** 限流规则展示字段派生 */
function deriveRateLimit(
  rule: Omit<RateLimitRule, "limitTypeLabel" | "limitText" | "scopeLabel"> & {
    scopeRouteNames?: string[];
  },
): RateLimitRule {
  return {
    ...rule,
    limitTypeLabel: RATE_LIMIT_TYPE_LABELS[rule.limitType],
    limitText: thousands(rule.limit),
    scopeLabel: rule.scopeAll
      ? "全部授权路由"
      : (rule.scopeRouteNames ?? []).join("、") || "—",
  };
}

/** 配额摘要：总+日循环 / 总+周循环 / 每7天循环 …… */
export function quotaSummaryOf(quotas: QuotaRule[]): string {
  const parts = quotas.map((q) => {
    if (q.quotaType === "lifetime") return "总";
    if (q.cycleUnit === "month") return "月循环";
    if (q.cycleUnit === "day") return q.cycleValue === 7 ? "周循环" : "日循环";
    return "日循环";
  });
  return parts.length > 0 ? parts.join("+") : "—";
}

/** 限流摘要：取第一条启用规则，如「1000 RPM」「50 并发」 */
export function rateLimitSummaryOf(rateLimits: RateLimitRule[]): string {
  const r = rateLimits.find((x) => x.status === "enabled") ?? rateLimits[0];
  if (!r) return "—";
  if (r.limitType === "CONCURRENT") return `${r.limit} 并发`;
  return `${r.limit} ${r.limitType}`;
}

/** 列表卡/详情页摘要字段派生 */
function derive(
  record: Omit<
    ClientTemplateRecord,
    | "statusLabel"
    | "validityLabel"
    | "routeCount"
    | "quotaSummary"
    | "rateLimitSummary"
    | "tagsText"
    | "policySummary"
  >,
): ClientTemplateRecord {
  const validityLabel =
    record.validityType === "days"
      ? `创建后 ${record.validityDays} 天`
      : record.validityType === "fixed"
        ? `固定至 ${record.validityFixedDate}`
        : "永不过期";
  const quotaSummary = quotaSummaryOf(record.quotas);
  const rateLimitSummary = rateLimitSummaryOf(record.rateLimits);
  return {
    ...record,
    statusLabel: TEMPLATE_STATUS_LABELS[record.status],
    validityLabel,
    routeCount: record.authRoutes.length,
    quotaSummary,
    rateLimitSummary,
    tagsText: record.tags.join(" · "),
    policySummary: `${record.authRoutes.length} 路由 · ${quotaSummary} · ${rateLimitSummary}`,
  };
}

const TEMPLATES: ClientTemplateRecord[] = [
  derive({
    code: "agent-default",
    name: "agent-default",
    tags: ["agent", "team-default"],
    description: "Agent 团队标准访问模板",
    status: "enabled",
    validityType: "days",
    validityDays: 365,
    authRoutes: [
      authRouteSnapshot("reasoning-default"),
      authRouteSnapshot("general-chat"),
      authRouteSnapshot("mobile-lite"),
    ],
    quotas: [
      deriveQuota({
        name: "lifetime-total",
        quotaType: "lifetime",
        metric: "TOTAL_TOKEN",
        limit: 10000000,
        mode: "hard",
        status: "enabled",
      }),
      deriveQuota({
        name: "daily-token-cap",
        quotaType: "cyclic",
        metric: "TOTAL_TOKEN",
        limit: 500000,
        mode: "soft",
        cycleUnit: "hour",
        cycleValue: 24,
        status: "enabled",
      }),
    ],
    rateLimits: [
      deriveRateLimit({
        name: "app-rpm",
        limitType: "RPM",
        limit: 1000,
        burst: 100,
        scopeAll: true,
        status: "enabled",
      }),
      deriveRateLimit({
        name: "concurrent-cap",
        limitType: "CONCURRENT",
        limit: 50,
        scopeAll: true,
        status: "enabled",
      }),
    ],
    createdClientCount: 12,
    createdAt: "2026-06-05 10:00",
    updatedAt: "2026-09-12 14:20",
    operator: "张三",
  }),
  derive({
    code: "web-portal-base",
    name: "web-portal-base",
    tags: ["web"],
    description: "Web 门户前端调用基础模板",
    status: "enabled",
    validityType: "fixed",
    validityFixedDate: "2027-12-31",
    authRoutes: [authRouteSnapshot("general-chat")],
    quotas: [
      deriveQuota({
        name: "weekly-request-cap",
        quotaType: "cyclic",
        metric: "REQUEST",
        limit: 100000,
        mode: "soft",
        cycleUnit: "day",
        cycleValue: 7,
        status: "enabled",
      }),
    ],
    rateLimits: [
      deriveRateLimit({
        name: "web-rpm",
        limitType: "RPM",
        limit: 500,
        scopeAll: true,
        status: "enabled",
      }),
    ],
    createdClientCount: 5,
    createdAt: "2026-07-01 09:30",
    updatedAt: "2026-09-06 11:10",
    operator: "李四",
  }),
  derive({
    code: "partner-readonly",
    name: "partner-readonly",
    tags: ["partner"],
    description: "合作方只读接入模板（当前停用）",
    status: "disabled",
    validityType: "never",
    authRoutes: [authRouteSnapshot("embeddings-std")],
    quotas: [
      deriveQuota({
        name: "lifetime-request",
        quotaType: "lifetime",
        metric: "REQUEST",
        limit: 1000000,
        mode: "hard",
        status: "enabled",
      }),
    ],
    rateLimits: [
      deriveRateLimit({
        name: "partner-rpm",
        limitType: "RPM",
        limit: 60,
        scopeAll: true,
        status: "enabled",
      }),
    ],
    createdClientCount: 2,
    createdAt: "2026-06-20 16:00",
    updatedAt: "2026-08-28 10:45",
    operator: "王五",
  }),
];

/** 快筛选项常量：状态（单选）与标签（多选） */
export const CLIENT_TEMPLATE_STATUS_OPTIONS: { value: string; label: string }[] =
  [
    { value: "all", label: "全部" },
    { value: "enabled", label: "已启用" },
    { value: "disabled", label: "已停用" },
  ];

/** 标签快筛（按数据中出现顺序展示；多选取交集） */
export const CLIENT_TEMPLATE_TAG_FILTERS: { value: string; label: string }[] = [
  ...new Set(TEMPLATES.flatMap((t) => t.tags)),
].map((t) => ({ value: t, label: t }));

/** 快筛计数：基于全量数据（构成口径，与当前筛选无关） */
function computeCounts(): ClientTemplateCounts {
  return {
    all: {
      enabled: TEMPLATES.filter((t) => t.status === "enabled").length,
      total: TEMPLATES.length,
    },
    status: {
      enabled: TEMPLATES.filter((t) => t.status === "enabled").length,
      disabled: TEMPLATES.filter((t) => t.status === "disabled").length,
    },
    tags: CLIENT_TEMPLATE_TAG_FILTERS.reduce<Record<string, number>>(
      (acc, t) => {
        const key = t.value.replace(/-/g, "_");
        acc[key] = TEMPLATES.filter((r) => r.tags.includes(t.value)).length;
        return acc;
      },
      {},
    ),
  };
}

/** 快筛 Chip 选项：由计数派生，文案在此预计算（表达式不支持复合文案拼接） */
function computeFilters(
  counts: ClientTemplateCounts,
): ClientTemplateListResult["filters"] {
  return {
    status: [
      { value: "all", text: `全部 ${counts.all.enabled}/${counts.all.total}` },
      { value: "enabled", text: `已启用 ${counts.status.enabled}`, dot: "#22c55e" },
      { value: "disabled", text: `已停用 ${counts.status.disabled}`, dot: "#9ca3af" },
    ],
    tags: [
      { value: "all", text: `全部 ${counts.all.total}` },
      ...CLIENT_TEMPLATE_TAG_FILTERS.map((t) => ({
        value: t.value,
        text: `${t.label} ${counts.tags[t.value.replace(/-/g, "_")]}`,
      })),
    ],
  };
}

/** clientTemplate.list：状态单选 + 关键字模糊 + 标签多选取交集，按 Updated At 降序 */
export function queryClientTemplates(
  params: ClientTemplateListParams = {},
): ClientTemplateListResult {
  const status = params.status ?? "all";
  const keyword = (params.keyword ?? "").trim().toLowerCase();
  const tags = params.tags ?? [];
  const items = TEMPLATES.filter(
    (t) =>
      (status === "all" || t.status === status) &&
      (keyword === "" ||
        t.name.toLowerCase().includes(keyword) ||
        t.code.toLowerCase().includes(keyword)) &&
      (tags.length === 0 || tags.every((tag) => t.tags.includes(tag))),
  ).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const counts = computeCounts();
  return { items, total: TEMPLATES.length, counts, filters: computeFilters(counts) };
}

/** clientTemplate.detail：按模板标识取详情；未命中返回 undefined（页面做空态） */
export function getClientTemplate(
  code: string,
): ClientTemplateRecord | undefined {
  return TEMPLATES.find((t) => t.code === code);
}

/** 全量模板标识（静态导出 generateStaticParams 用） */
export const CLIENT_TEMPLATE_CODES: string[] = TEMPLATES.map((t) => t.code);
