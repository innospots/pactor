/**
 * 运行管理 mock：模型/供应商/客户端用量 + 供应商可用性（可靠性）。
 * 行数据以原始数值存储（基准口径 = 7d），查询时按时间范围因子缩放
 * （请求数 / Token / 费用随范围线性缩放，比率与延迟不变），并在 mock 层
 * 预计算全部展示文案（Token 紧凑 K/M/B 与数字两种格式、$ 金额、百分比、
 * ms、配额用量）——DSL 表达式引擎不支持函数调用与数组方法，单元格只做
 * 字段拼接与 compact/raw 三元切换。
 * 模型 / 供应商 / 客户端名称均取自 models-mock / providers-mock /
 * clients-mock 中真实存在的记录，路由组取自 routes-mock 的路由标识。
 */

export interface OpsUsageQuery {
  /** ISO 日期对（DatePicker range 值，同仪表盘） */
  start?: string;
  end?: string;
}

/** 一天毫秒数与 ISO 日期解析（yyyy-MM-dd；非法返回 undefined） */
const DAY_MS = 86400000;

function parseDay(s?: string): number | undefined {
  if (!s) return undefined;
  const t = Date.parse(`${s}T00:00:00`);
  return Number.isFinite(t) ? t : undefined;
}

/** 用量缩放因子：区间天数 / 7（基准 7d = 1；缺省或非法按 7d 计） */
function rangeFactor(q: OpsUsageQuery): number {
  const start = parseDay(q.start);
  const end = parseDay(q.end);
  if (start === undefined || end === undefined || end < start) return 1;
  const days = Math.round((end - start) / DAY_MS) + 1;
  return days / 7;
}

// ── 格式化（mock 层预计算，DSL 侧不调用函数） ─────────────────────

const fmtInt = (n: number) => Math.round(n).toLocaleString("en-US");

function fmtCompact(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(Math.round(n));
}

const fmtMoney = (n: number) => `$${n.toFixed(2)}`;
const fmtMoney4 = (n: number) => `$${n.toFixed(4)}`;
const fmtPct = (x: number) => `${(x * 100).toFixed(1)}%`;
const fmtMs = (n: number) => `${Math.round(n)}ms`;
const fmtAttempts = (n: number) => n.toFixed(2);

// ── 原始指标行（7d 基准） ────────────────────────────────────────

interface RawMetrics {
  requests: number;
  inputTokens: number;
  outputTokens: number;
  cacheHitRate: number;
  /** 标准价合计（USD） */
  standard: number;
  /** 对用户计费合计（USD） */
  billed: number;
  /** 供应侧成本合计（USD） */
  cost: number;
  successRate: number;
  latencyMs: number;
  ttftMs: number;
  upstreamMs: number;
  /** Token/秒 吞吐 */
  tps: number;
  failoverRate: number;
  /** 含重试的平均尝试次数 */
  attempts: number;
}

/** 用量宽表展示行（全部为预计算文案） */
export interface UsageDisplay {
  requests: string;
  inputCompact: string;
  inputRaw: string;
  outputCompact: string;
  outputRaw: string;
  cacheHit: string;
  standard: string;
  billed: string;
  cost: string;
  avgBilled: string;
  successRate: string;
  avgLatency: string;
  ttft: string;
  avgUpstream: string;
  tps: string;
  failoverRate: string;
  avgAttempts: string;
}

/** 原始指标 → 展示行：量纲字段按范围因子缩放，比率 / 延迟不变 */
function toUsageDisplay(r: RawMetrics, f: number): UsageDisplay {
  const requests = r.requests * f;
  const input = r.inputTokens * f;
  const output = r.outputTokens * f;
  const billed = r.billed * f;
  return {
    requests: fmtCompact(requests),
    inputCompact: fmtCompact(input),
    inputRaw: fmtInt(input),
    outputCompact: fmtCompact(output),
    outputRaw: fmtInt(output),
    cacheHit: fmtPct(r.cacheHitRate),
    standard: fmtMoney(r.standard * f),
    billed: fmtMoney(billed),
    cost: fmtMoney(r.cost * f),
    avgBilled: fmtMoney4(r.billed / r.requests),
    successRate: fmtPct(r.successRate),
    avgLatency: fmtMs(r.latencyMs),
    ttft: fmtMs(r.ttftMs),
    avgUpstream: fmtMs(r.upstreamMs),
    tps: fmtCompact(r.tps),
    failoverRate: fmtPct(r.failoverRate),
    avgAttempts: fmtAttempts(r.attempts),
  };
}

/** 可靠性展示行（无 Token / 缓存列，错误数随范围缩放） */
interface QualityDisplay {
  requests: string;
  successRate: string;
  avgLatency: string;
  avgUpstream: string;
  failoverRate: string;
  avgAttempts: string;
  standard: string;
  billed: string;
  cost: string;
}

function toQualityDisplay(r: RawMetrics, f: number): QualityDisplay {
  return {
    requests: fmtCompact(r.requests * f),
    successRate: fmtPct(r.successRate),
    avgLatency: fmtMs(r.latencyMs),
    avgUpstream: fmtMs(r.upstreamMs),
    failoverRate: fmtPct(r.failoverRate),
    avgAttempts: fmtAttempts(r.attempts),
    standard: fmtMoney(r.standard * f),
    billed: fmtMoney(r.billed * f),
    cost: fmtMoney(r.cost * f),
  };
}

export interface UsageSummary {
  standard: string;
  billed: string;
  cost: string;
}

function summarize(rows: RawMetrics[], f: number): UsageSummary {
  const sum = (pick: (r: RawMetrics) => number) =>
    rows.reduce((acc, r) => acc + pick(r), 0) * f;
  return {
    standard: fmtMoney(sum((r) => r.standard)),
    billed: fmtMoney(sum((r) => r.billed)),
    cost: fmtMoney(sum((r) => r.cost)),
  };
}

// ── 模型用量（模型 × 路由组） ────────────────────────────────────

interface RawModelUsage extends RawMetrics {
  key: string;
  model: string;
  route: string;
}

const MODEL_USAGE_RAW: RawModelUsage[] = [
  {
    key: "gpt-5/reasoning-default",
    model: "GPT-5",
    route: "reasoning-default",
    requests: 12400,
    inputTokens: 2_100_000,
    outputTokens: 1_800_000,
    cacheHitRate: 0.325,
    standard: 186.0,
    billed: 223.2,
    cost: 148.8,
    successRate: 0.992,
    latencyMs: 1820,
    ttftMs: 340,
    upstreamMs: 1650,
    tps: 1280,
    failoverRate: 0.008,
    attempts: 1.02,
  },
  {
    key: "qwen3.5-flash/general-chat",
    model: "Qwen3.5 Flash",
    route: "general-chat",
    requests: 45200,
    inputTokens: 8_600_000,
    outputTokens: 5_200_000,
    cacheHitRate: 0.412,
    standard: 52.4,
    billed: 68.1,
    cost: 41.3,
    successRate: 0.997,
    latencyMs: 640,
    ttftMs: 180,
    upstreamMs: 560,
    tps: 3420,
    failoverRate: 0.004,
    attempts: 1.01,
  },
  {
    key: "gpt-5/coding-assistant",
    model: "GPT-5",
    route: "coding-assistant",
    requests: 8400,
    inputTokens: 5_800_000,
    outputTokens: 3_900_000,
    cacheHitRate: 0.354,
    standard: 210.5,
    billed: 252.6,
    cost: 168.4,
    successRate: 0.988,
    latencyMs: 2460,
    ttftMs: 480,
    upstreamMs: 2280,
    tps: 1120,
    failoverRate: 0.015,
    attempts: 1.05,
  },
  {
    key: "gemini-3-flash/mobile-lite",
    model: "Gemini 3 Flash",
    route: "mobile-lite",
    requests: 23800,
    inputTokens: 4_100_000,
    outputTokens: 2_600_000,
    cacheHitRate: 0.286,
    standard: 38.2,
    billed: 45.9,
    cost: 30.6,
    successRate: 0.991,
    latencyMs: 720,
    ttftMs: 210,
    upstreamMs: 640,
    tps: 2650,
    failoverRate: 0.012,
    attempts: 1.04,
  },
  {
    key: "qwen3-vl-plus/vision-router",
    model: "Qwen3-VL Plus",
    route: "vision-router",
    requests: 6800,
    inputTokens: 3_400_000,
    outputTokens: 890_000,
    cacheHitRate: 0.128,
    standard: 96.8,
    billed: 116.2,
    cost: 77.4,
    successRate: 0.985,
    latencyMs: 2350,
    ttftMs: 520,
    upstreamMs: 2140,
    tps: 860,
    failoverRate: 0.021,
    attempts: 1.08,
  },
  {
    key: "text-embedding-3-large/embeddings-std",
    model: "Text Embedding 3 Large",
    route: "embeddings-std",
    requests: 96400,
    inputTokens: 12_400_000,
    outputTokens: 0,
    cacheHitRate: 0.052,
    standard: 12.8,
    billed: 15.4,
    cost: 10.2,
    successRate: 0.999,
    latencyMs: 180,
    ttftMs: 90,
    upstreamMs: 150,
    tps: 18500,
    failoverRate: 0.001,
    attempts: 1.0,
  },
];

export interface ModelUsageRow extends UsageDisplay {
  key: string;
  model: string;
  route: string;
}

export function queryModelUsage(q: OpsUsageQuery): {
  items: ModelUsageRow[];
  summary: UsageSummary;
  total: number;
} {
  const f = rangeFactor(q);
  const items = MODEL_USAGE_RAW.map((r) => ({
    key: r.key,
    model: r.model,
    route: r.route,
    ...toUsageDisplay(r, f),
  }));
  return { items, summary: summarize(MODEL_USAGE_RAW, f), total: items.length };
}

// ── 供应商用量 ───────────────────────────────────────────────────

interface RawProviderUsage extends RawMetrics {
  key: string;
  provider: string;
}

const PROVIDER_USAGE_RAW: RawProviderUsage[] = [
  {
    key: "openai",
    provider: "OpenAI",
    requests: 48200,
    inputTokens: 9_800_000,
    outputTokens: 6_400_000,
    cacheHitRate: 0.301,
    standard: 312.4,
    billed: 374.9,
    cost: 249.9,
    successRate: 0.993,
    latencyMs: 1240,
    ttftMs: 310,
    upstreamMs: 1120,
    tps: 1420,
    failoverRate: 0.006,
    attempts: 1.02,
  },
  {
    key: "dashscope",
    provider: "阿里云百炼",
    requests: 52400,
    inputTokens: 12_600_000,
    outputTokens: 7_800_000,
    cacheHitRate: 0.386,
    standard: 86.4,
    billed: 103.7,
    cost: 69.1,
    successRate: 0.988,
    latencyMs: 580,
    ttftMs: 190,
    upstreamMs: 520,
    tps: 3240,
    failoverRate: 0.018,
    attempts: 1.06,
  },
  {
    key: "deepseek",
    provider: "DeepSeek",
    requests: 31200,
    inputTokens: 7_400_000,
    outputTokens: 4_600_000,
    cacheHitRate: 0.294,
    standard: 42.8,
    billed: 51.4,
    cost: 34.2,
    successRate: 0.984,
    latencyMs: 890,
    ttftMs: 260,
    upstreamMs: 810,
    tps: 2180,
    failoverRate: 0.022,
    attempts: 1.09,
  },
  {
    key: "gemini",
    provider: "Google Gemini",
    requests: 24800,
    inputTokens: 4_400_000,
    outputTokens: 2_800_000,
    cacheHitRate: 0.272,
    standard: 44.6,
    billed: 53.5,
    cost: 35.7,
    successRate: 0.99,
    latencyMs: 740,
    ttftMs: 220,
    upstreamMs: 660,
    tps: 2560,
    failoverRate: 0.011,
    attempts: 1.03,
  },
  {
    key: "anthropic",
    provider: "Anthropic",
    requests: 18400,
    inputTokens: 6_800_000,
    outputTokens: 4_200_000,
    cacheHitRate: 0.338,
    standard: 186.2,
    billed: 223.4,
    cost: 148.9,
    successRate: 0.996,
    latencyMs: 1420,
    ttftMs: 380,
    upstreamMs: 1300,
    tps: 1180,
    failoverRate: 0.003,
    attempts: 1.01,
  },
  {
    key: "azure-openai",
    provider: "Azure OpenAI",
    requests: 12600,
    inputTokens: 3_200_000,
    outputTokens: 2_100_000,
    cacheHitRate: 0.264,
    standard: 98.6,
    billed: 118.3,
    cost: 78.9,
    successRate: 0.971,
    latencyMs: 1580,
    ttftMs: 420,
    upstreamMs: 1460,
    tps: 980,
    failoverRate: 0.034,
    attempts: 1.12,
  },
];

export interface ProviderUsageRow extends UsageDisplay {
  key: string;
  provider: string;
}

export function queryProviderUsage(q: OpsUsageQuery): {
  items: ProviderUsageRow[];
  summary: UsageSummary;
  total: number;
} {
  const f = rangeFactor(q);
  const items = PROVIDER_USAGE_RAW.map((r) => ({
    key: r.key,
    provider: r.provider,
    ...toUsageDisplay(r, f),
  }));
  return {
    items,
    summary: summarize(PROVIDER_USAGE_RAW, f),
    total: items.length,
  };
}

// ── 客户端用量（客户端 × AppKey，含配额用量） ────────────────────

interface RawClientUsage extends RawMetrics {
  key: string;
  name: string;
  code: string;
  appKeyId: string;
  /** 配额用量（当前周期 用量/上限；周期口径，不随时间范围缩放） */
  quotaUsage: string;
}

const CLIENT_USAGE_RAW: RawClientUsage[] = [
  {
    key: "agent-app",
    name: "agent-app",
    code: "agent-app",
    appKeyId: "gw-ak-7f3a2b1c",
    quotaUsage: "520K/1M",
    requests: 32400,
    inputTokens: 5_200_000,
    outputTokens: 3_100_000,
    cacheHitRate: 0.22,
    standard: 52.6,
    billed: 68.4,
    cost: 41.2,
    successRate: 0.991,
    latencyMs: 960,
    ttftMs: 280,
    upstreamMs: 860,
    tps: 1640,
    failoverRate: 0.009,
    attempts: 1.03,
  },
  {
    key: "web-portal",
    name: "web-portal",
    code: "web-portal",
    appKeyId: "gw-ak-9c1d4e5f",
    quotaUsage: "1.2M/2M",
    requests: 58200,
    inputTokens: 9_600_000,
    outputTokens: 6_200_000,
    cacheHitRate: 0.348,
    standard: 96.2,
    billed: 115.4,
    cost: 76.9,
    successRate: 0.994,
    latencyMs: 820,
    ttftMs: 240,
    upstreamMs: 740,
    tps: 2260,
    failoverRate: 0.007,
    attempts: 1.02,
  },
  {
    key: "internal-batch",
    name: "internal-batch",
    code: "internal-batch",
    appKeyId: "gw-ak-2b8e6a0d",
    quotaUsage: "860K/5M",
    requests: 12800,
    inputTokens: 18_400_000,
    outputTokens: 2_200_000,
    cacheHitRate: 0.086,
    standard: 64.8,
    billed: 77.8,
    cost: 51.8,
    successRate: 0.982,
    latencyMs: 2340,
    ttftMs: 460,
    upstreamMs: 2180,
    tps: 1480,
    failoverRate: 0.026,
    attempts: 1.11,
  },
  {
    key: "legacy-mobile",
    name: "legacy-mobile",
    code: "legacy-mobile",
    appKeyId: "gw-ak-5d7c9b2e",
    quotaUsage: "96K/500K",
    requests: 8600,
    inputTokens: 1_200_000,
    outputTokens: 680_000,
    cacheHitRate: 0.194,
    standard: 12.4,
    billed: 14.9,
    cost: 9.9,
    successRate: 0.968,
    latencyMs: 1120,
    ttftMs: 340,
    upstreamMs: 1020,
    tps: 620,
    failoverRate: 0.041,
    attempts: 1.16,
  },
  {
    key: "expired-trial",
    name: "expired-trial",
    code: "expired-trial",
    appKeyId: "gw-ak-0a4f8c6b",
    quotaUsage: "100K/100K",
    requests: 2400,
    inputTokens: 380_000,
    outputTokens: 210_000,
    cacheHitRate: 0.122,
    standard: 4.2,
    billed: 5.0,
    cost: 3.4,
    successRate: 0.955,
    latencyMs: 1380,
    ttftMs: 390,
    upstreamMs: 1260,
    tps: 340,
    failoverRate: 0.058,
    attempts: 1.21,
  },
];

export interface ClientUsageRow extends UsageDisplay {
  key: string;
  name: string;
  code: string;
  appKeyId: string;
  quotaUsage: string;
}

export function queryClientUsage(q: OpsUsageQuery): {
  items: ClientUsageRow[];
  summary: UsageSummary;
  total: number;
} {
  const f = rangeFactor(q);
  const items = CLIENT_USAGE_RAW.map((r) => ({
    key: r.key,
    name: r.name,
    code: r.code,
    appKeyId: r.appKeyId,
    quotaUsage: r.quotaUsage,
    ...toUsageDisplay(r, f),
  }));
  return { items, summary: summarize(CLIENT_USAGE_RAW, f), total: items.length };
}

// ── 供应商可用性（可靠性） ───────────────────────────────────────

export interface ProviderQualityRow extends QualityDisplay {
  key: string;
  provider: string;
  /** 失败请求数（随范围缩放） */
  errors: string;
}

export interface ModelProviderCompareRow extends QualityDisplay {
  key: string;
  model: string;
  provider: string;
}

export interface RecentErrorRow {
  id: string;
  /** UTC 时间（MM-DD HH:mm:ss） */
  time: string;
  /** 模型 / 供应商 */
  target: string;
  error: string;
}

interface RawCompare extends RawMetrics {
  key: string;
  model: string;
  provider: string;
}

const COMPARE_RAW: RawCompare[] = [
  {
    key: "gpt-5/openai",
    model: "GPT-5",
    provider: "OpenAI",
    requests: 9200,
    inputTokens: 0,
    outputTokens: 0,
    cacheHitRate: 0,
    standard: 142.6,
    billed: 171.1,
    cost: 114.1,
    successRate: 0.995,
    latencyMs: 1680,
    ttftMs: 0,
    upstreamMs: 1520,
    tps: 0,
    failoverRate: 0.005,
    attempts: 1.01,
  },
  {
    key: "gpt-5/azure-openai",
    model: "GPT-5",
    provider: "Azure OpenAI",
    requests: 3200,
    inputTokens: 0,
    outputTokens: 0,
    cacheHitRate: 0,
    standard: 68.4,
    billed: 82.1,
    cost: 54.7,
    successRate: 0.972,
    latencyMs: 2120,
    ttftMs: 0,
    upstreamMs: 1960,
    tps: 0,
    failoverRate: 0.032,
    attempts: 1.11,
  },
  {
    key: "qwen3.5-flash/dashscope",
    model: "Qwen3.5 Flash",
    provider: "阿里云百炼",
    requests: 38600,
    inputTokens: 0,
    outputTokens: 0,
    cacheHitRate: 0,
    standard: 44.2,
    billed: 53.0,
    cost: 35.4,
    successRate: 0.998,
    latencyMs: 560,
    ttftMs: 0,
    upstreamMs: 500,
    tps: 0,
    failoverRate: 0.002,
    attempts: 1.0,
  },
  {
    key: "qwen3-vl-plus/dashscope",
    model: "Qwen3-VL Plus",
    provider: "阿里云百炼",
    requests: 6800,
    inputTokens: 0,
    outputTokens: 0,
    cacheHitRate: 0,
    standard: 96.8,
    billed: 116.2,
    cost: 77.4,
    successRate: 0.986,
    latencyMs: 2280,
    ttftMs: 0,
    upstreamMs: 2080,
    tps: 0,
    failoverRate: 0.019,
    attempts: 1.07,
  },
  {
    key: "gemini-3-flash/gemini",
    model: "Gemini 3 Flash",
    provider: "Google Gemini",
    requests: 23800,
    inputTokens: 0,
    outputTokens: 0,
    cacheHitRate: 0,
    standard: 38.2,
    billed: 45.9,
    cost: 30.6,
    successRate: 0.991,
    latencyMs: 720,
    ttftMs: 0,
    upstreamMs: 640,
    tps: 0,
    failoverRate: 0.012,
    attempts: 1.04,
  },
  {
    key: "text-embedding-3-large/openai",
    model: "Text Embedding 3 Large",
    provider: "OpenAI",
    requests: 96400,
    inputTokens: 0,
    outputTokens: 0,
    cacheHitRate: 0,
    standard: 12.8,
    billed: 15.4,
    cost: 10.2,
    successRate: 0.999,
    latencyMs: 180,
    ttftMs: 0,
    upstreamMs: 150,
    tps: 0,
    failoverRate: 0.001,
    attempts: 1.0,
  },
];

const RECENT_ERRORS: RecentErrorRow[] = [
  {
    id: "e1",
    time: "09-19 08:42:18",
    target: "GPT-5 / Azure OpenAI",
    error: "upstream timeout (504)",
  },
  {
    id: "e2",
    time: "09-19 08:31:05",
    target: "Qwen3-VL Plus / 阿里云百炼",
    error: "rate limit exceeded (429)",
  },
  {
    id: "e3",
    time: "09-19 07:58:44",
    target: "GPT-5 / OpenAI",
    error: "connection reset by peer",
  },
  {
    id: "e4",
    time: "09-19 07:12:30",
    target: "Gemini 3 Flash / Google Gemini",
    error: "upstream timeout (504)",
  },
  {
    id: "e5",
    time: "09-19 06:45:02",
    target: "Qwen3.5 Flash / 阿里云百炼",
    error: "context length exceeded (400)",
  },
  {
    id: "e6",
    time: "09-19 05:20:37",
    target: "GPT-5 / Azure OpenAI",
    error: "service unavailable (503)",
  },
];

export function queryAvailability(q: OpsUsageQuery): {
  providers: ProviderQualityRow[];
  compare: ModelProviderCompareRow[];
  errors: RecentErrorRow[];
} {
  const f = rangeFactor(q);
  const providers = PROVIDER_USAGE_RAW.map((r) => ({
    key: r.key,
    provider: r.provider,
    errors: fmtInt(r.requests * f * (1 - r.successRate)),
    ...toQualityDisplay(r, f),
  }));
  const compare = COMPARE_RAW.map((r) => ({
    key: r.key,
    model: r.model,
    provider: r.provider,
    ...toQualityDisplay(r, f),
  }));
  // 极短范围仅保留最近几条错误（演示）
  const errors = f < 0.1 ? RECENT_ERRORS.slice(0, 2) : RECENT_ERRORS;
  return { providers, compare, errors };
}
