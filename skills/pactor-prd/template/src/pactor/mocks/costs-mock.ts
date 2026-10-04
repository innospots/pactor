/**
 * 成本明细（运行管理）演示数据服务（MVP mock，静态页面）。
 * cost.list / cost.detail 注册为 Pactor service；接入真实后端后替换为
 * http / service 数据源，DSL 绑定路径保持不变。
 * 数据形态对齐 PRD《运行管理/06-成本明细》：按单次请求展示实际成本与
 * pricing_snapshot（命中档位 + 时段倍率）；计费公式
 *   actual_price = tier_price × multiplier
 *   Cost = Σ(usage × actual_price / 1M)
 * 金额、档位文案、计算过程说明一律在此预计算为字符串（表达式引擎不支持
 * 数组方法 / 函数调用）。模型 / 供应商 / 客户端 / AppKey / Alias 名称与
 * models-mock / providers-mock / clients-mock / routes-mock 保持一致。
 */

export interface CostRecord {
  /** 与调用日志成功（已计费）记录的 request id 一致，如 req-9f2a1c4d */
  id: string;
  /** 距当前时间的分钟数（time/shortTime 由此派生，随运行日漂移，
   *  保证默认时间范围（近 7 天）始终命中数据） */
  minutesAgo: number;
  /** 完整时间，如 2026-09-19 08:05:12（由 minutesAgo 派生） */
  time: string;
  /** 列表短时间（MM-DD HH:mm，由 minutesAgo 派生） */
  shortTime: string;
  application: string;
  clientName: string;
  appKeyId: string;
  alias: string;
  modelCode: string;
  modelName: string;
  providerCode: string;
  providerName: string;
  currency: string;
  // ── 用量 ──
  inputTokens: number;
  outputTokens: number;
  /** 0 表示无缓存用量（列表 Cache 列展示 —） */
  cacheReadTokens: number;
  // ── 定价快照（pricing_snapshot，只读） ──
  priceVersion: string;
  priceEffective: string;
  /** 命中档位 UPTO 上限；null = 无上限档（∞） */
  tierUpto: number | null;
  /** 档位单价（$/1M tokens） */
  tierInputPrice: number;
  tierOutputPrice: number;
  tierCacheReadPrice: number | null;
  /** 命中的时段倍率（未命中为 1.0） */
  multiplier: number;
  /** 时段倍率规则文案，如「每天 00:00–08:00 ×0.8」；未命中为说明文字 */
  multiplierRule: string;
  // ── 预计算展示字段 ──
  /** 档位短标签，如 ≤32K / ≤128K / ∞ */
  tierLabel: string;
  /** 倍率短标签，如 0.8x */
  multiplierText: string;
  inputCost: string;
  outputCost: string;
  /** 无缓存用量时为 — */
  cacheCost: string;
  totalCost: string;
  /** Header 摘要：时间 · 客户端（AppKey）· 模型 · 供应商 */
  contextSummary: string;
  /** 档位完整文案，如 UPTO ≤ 32,000 / UPTO ∞（无上限档） */
  tierDetail: string;
  /** 档位单价摘要：输入 $0.2/M · 输出 $1.6/M · 缓存读 — */
  tierPriceText: string;
  inputTokensText: string;
  outputTokensText: string;
  cacheReadTokensText: string;
  /** 费用计算过程，如 2,400 × $0.2 × 0.8 ÷ 1M = $0.0004 */
  inputCalcText: string;
  outputCalcText: string;
  cacheCalcText: string;
}

export interface CostListParams {
  /** Application 模糊 */
  application?: string;
  /** AppKey ID 模糊 */
  appKey?: string;
  /** Alias 模糊 */
  alias?: string;
  /** all | Model Code */
  model?: string;
  /** all | Provider Code */
  provider?: string;
  /** 时间范围（ISO 日期对，含端点；缺省不过滤） */
  start?: string;
  end?: string;
}

export interface CostListResult {
  items: CostRecord[];
  total: number;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/** 相对当前时间的 "YYYY-MM-DD HH:mm:ss" 时间戳（mock 时间随运行日漂移） */
function timeAgo(minutes: number): string {
  const d = new Date(Date.now() - minutes * 60000);
  return (
    `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ` +
    `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
  );
}

/** Token 档位的短写法：32000 → ≤32K，128000 → ≤128K，null → ∞ */
function tierShortLabel(upto: number | null): string {
  if (upto == null) return "∞";
  if (upto >= 1000 && upto % 1000 === 0) return `≤${upto / 1000}K`;
  return `≤${upto.toLocaleString("en-US")}`;
}

function money(v: number): string {
  return `$${v.toFixed(4)}`;
}

function num(n: number): string {
  return n.toLocaleString("en-US");
}

/** 单价展示：$0.2（/M tokens 单价，保留原始精度） */
function price(p: number): string {
  return `$${p}`;
}

/** 列表/详情展示字段派生（费用按 PRD 公式计算并格式化为字符串） */
function derive(
  record: Omit<
    CostRecord,
    | "time"
    | "shortTime"
    | "tierLabel"
    | "multiplierText"
    | "inputCost"
    | "outputCost"
    | "cacheCost"
    | "totalCost"
    | "contextSummary"
    | "tierDetail"
    | "tierPriceText"
    | "inputTokensText"
    | "outputTokensText"
    | "cacheReadTokensText"
    | "inputCalcText"
    | "outputCalcText"
    | "cacheCalcText"
  >,
): CostRecord {
  // actual_price = tier_price × multiplier；Cost = usage × actual_price / 1M
  const inputCost =
    (record.inputTokens * record.tierInputPrice * record.multiplier) / 1e6;
  const outputCost =
    (record.outputTokens * record.tierOutputPrice * record.multiplier) / 1e6;
  const cacheCost =
    record.cacheReadTokens > 0 && record.tierCacheReadPrice != null
      ? (record.cacheReadTokens * record.tierCacheReadPrice * record.multiplier) /
        1e6
      : 0;
  const hasCache = record.cacheReadTokens > 0 && record.tierCacheReadPrice != null;
  const calc = (tokens: number, unitPrice: number, cost: number) =>
    `${num(tokens)} × ${price(unitPrice)} × ${record.multiplier} ÷ 1M = ${money(cost)}`;
  const time = timeAgo(record.minutesAgo);
  return {
    ...record,
    time,
    shortTime: time.slice(5, 16),
    tierLabel: tierShortLabel(record.tierUpto),
    multiplierText: `${record.multiplier}x`,
    inputCost: money(inputCost),
    outputCost: money(outputCost),
    cacheCost: hasCache ? money(cacheCost) : "—",
    totalCost: money(inputCost + outputCost + cacheCost),
    contextSummary: `${time} · ${record.clientName}（${record.appKeyId}）· ${record.modelName} · ${record.providerName}`,
    tierDetail:
      record.tierUpto == null
        ? "UPTO ∞（无上限档）"
        : `UPTO ≤ ${num(record.tierUpto)}`,
    tierPriceText: `输入 ${price(record.tierInputPrice)}/M · 输出 ${price(record.tierOutputPrice)}/M · 缓存读 ${record.tierCacheReadPrice != null ? `${price(record.tierCacheReadPrice)}/M` : "—"}`,
    inputTokensText: num(record.inputTokens),
    outputTokensText: num(record.outputTokens),
    cacheReadTokensText: hasCache ? num(record.cacheReadTokens) : "—",
    inputCalcText: calc(record.inputTokens, record.tierInputPrice, inputCost),
    outputCalcText: calc(record.outputTokens, record.tierOutputPrice, outputCost),
    cacheCalcText: hasCache
      ? calc(record.cacheReadTokens, record.tierCacheReadPrice!, cacheCost)
      : "—（无缓存用量）",
  };
}

const COSTS: CostRecord[] = [
  derive({
    id: "req-9f2a1c4d",
    minutesAgo: 25,
    application: "agent-platform",
    clientName: "agent-app",
    appKeyId: "gw-ak-7f3a2b1c",
    alias: "reasoning",
    modelCode: "qwen3-vl-plus",
    modelName: "Qwen3-VL Plus",
    providerCode: "dashscope",
    providerName: "阿里云百炼",
    currency: "USD",
    inputTokens: 2400,
    outputTokens: 1800,
    cacheReadTokens: 0,
    priceVersion: "v3",
    priceEffective: "2026-09-01",
    tierUpto: 32000,
    tierInputPrice: 0.2,
    tierOutputPrice: 1.6,
    tierCacheReadPrice: null,
    multiplier: 0.8,
    multiplierRule: "每天 00:00–08:00 ×0.8",
  }),
  derive({
    id: "req-7b3e5f08",
    minutesAgo: 180,
    application: "web-portal",
    clientName: "web-portal",
    appKeyId: "gw-ak-9c1d4e5f",
    alias: "general",
    modelCode: "qwen3.5-flash",
    modelName: "Qwen3.5 Flash",
    providerCode: "dashscope",
    providerName: "阿里云百炼",
    currency: "USD",
    inputTokens: 1200,
    outputTokens: 640,
    cacheReadTokens: 0,
    priceVersion: "v2",
    priceEffective: "2026-08-15",
    tierUpto: 128000,
    tierInputPrice: 0.1,
    tierOutputPrice: 0.4,
    tierCacheReadPrice: null,
    multiplier: 1.0,
    multiplierRule: "—（未命中时段倍率，按 1.0 计）",
  }),
  derive({
    id: "req-1e6f0b35",
    minutesAgo: 900,
    application: "batch-jobs",
    clientName: "internal-batch",
    appKeyId: "gw-ak-2b8e6a0d",
    alias: "embedding",
    modelCode: "text-embedding-3-large",
    modelName: "Text Embedding 3 Large",
    providerCode: "openai",
    providerName: "OpenAI",
    currency: "USD",
    inputTokens: 56000,
    outputTokens: 0,
    cacheReadTokens: 0,
    priceVersion: "v1",
    priceEffective: "2026-07-01",
    tierUpto: null,
    tierInputPrice: 0.1,
    tierOutputPrice: 0,
    tierCacheReadPrice: null,
    multiplier: 1.0,
    multiplierRule: "—（未命中时段倍率，按 1.0 计）",
  }),
  derive({
    id: "req-2d9b4e77",
    minutesAgo: 3000,
    application: "agent-platform",
    clientName: "agent-app",
    appKeyId: "gw-ak-7f3a2b1c",
    alias: "coding",
    modelCode: "gpt-5",
    modelName: "GPT-5",
    providerCode: "openai",
    providerName: "OpenAI",
    currency: "USD",
    inputTokens: 3200,
    outputTokens: 900,
    cacheReadTokens: 12000,
    priceVersion: "v1",
    priceEffective: "2026-09-10",
    tierUpto: null,
    tierInputPrice: 0.4,
    tierOutputPrice: 1.8,
    tierCacheReadPrice: 0.1,
    multiplier: 1.0,
    multiplierRule: "—（未命中时段倍率，按 1.0 计）",
  }),
  derive({
    id: "req-3e7c9a54",
    minutesAgo: 5000,
    application: "web-portal",
    clientName: "web-portal",
    appKeyId: "gw-ak-9c1d4e5f",
    alias: "general",
    modelCode: "gemini-3-flash",
    modelName: "Gemini 3 Flash",
    providerCode: "gemini",
    providerName: "Google Gemini",
    currency: "USD",
    inputTokens: 8000,
    outputTokens: 2200,
    cacheReadTokens: 0,
    priceVersion: "v1",
    priceEffective: "2026-08-30",
    tierUpto: 200000,
    tierInputPrice: 0.15,
    tierOutputPrice: 0.6,
    tierCacheReadPrice: null,
    multiplier: 1.0,
    multiplierRule: "—（未命中时段倍率，按 1.0 计）",
  }),
  derive({
    id: "req-0c4e2b89",
    minutesAgo: 8200,
    application: "mobile-app",
    clientName: "legacy-mobile",
    appKeyId: "gw-ak-5d7c9b2e",
    alias: "chat-lite",
    modelCode: "qwen3.5-flash",
    modelName: "Qwen3.5 Flash",
    providerCode: "dashscope",
    providerName: "阿里云百炼",
    currency: "USD",
    inputTokens: 40000,
    outputTokens: 3000,
    cacheReadTokens: 0,
    priceVersion: "v2",
    priceEffective: "2026-08-15",
    tierUpto: 128000,
    tierInputPrice: 0.1,
    tierOutputPrice: 0.4,
    tierCacheReadPrice: null,
    multiplier: 0.9,
    multiplierRule: "每天 00:00–08:00 ×0.9",
  }),
  derive({
    id: "req-d8b1e473",
    minutesAgo: 13000,
    application: "agent-platform",
    clientName: "agent-app",
    appKeyId: "gw-ak-7f3a2b1c",
    alias: "reasoning",
    modelCode: "qwen3-vl-plus",
    modelName: "Qwen3-VL Plus",
    providerCode: "dashscope",
    providerName: "阿里云百炼",
    currency: "USD",
    inputTokens: 45000,
    outputTokens: 6000,
    cacheReadTokens: 0,
    priceVersion: "v3",
    priceEffective: "2026-09-01",
    tierUpto: 128000,
    tierInputPrice: 0.4,
    tierOutputPrice: 3.2,
    tierCacheReadPrice: null,
    multiplier: 1.2,
    multiplierRule: "工作日 09:00–18:00 ×1.2",
  }),
];

/** Model 筛选选项：全部 + 数据中出现过的模型（按名称去重） */
export const COST_MODEL_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "全部模型" },
  ...[...new Map(COSTS.map((c) => [c.modelCode, c.modelName])).entries()].map(
    ([value, label]) => ({ value, label }),
  ),
];

/** Provider 筛选选项：全部 + 数据中出现过的供应商 */
export const COST_PROVIDER_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "全部供应商" },
  ...[
    ...new Map(COSTS.map((c) => [c.providerCode, c.providerName])).entries(),
  ].map(([value, label]) => ({ value, label })),
];

/** cost.list：时间区间（按日期含端点）+ Application/AppKey/Alias 模糊 +
 *  Model/Provider 单选，按时间倒序 */
export function queryCosts(params: CostListParams = {}): CostListResult {
  const application = (params.application ?? "").trim().toLowerCase();
  const appKey = (params.appKey ?? "").trim().toLowerCase();
  const alias = (params.alias ?? "").trim().toLowerCase();
  const model = params.model ?? "all";
  const provider = params.provider ?? "all";
  const items = COSTS.filter(
    (c) =>
      (!params.start || c.time.slice(0, 10) >= params.start) &&
      (!params.end || c.time.slice(0, 10) <= params.end) &&
      (application === "" || c.application.toLowerCase().includes(application)) &&
      (appKey === "" || c.appKeyId.toLowerCase().includes(appKey)) &&
      (alias === "" || c.alias.toLowerCase().includes(alias)) &&
      (model === "all" || c.modelCode === model) &&
      (provider === "all" || c.providerCode === provider),
  ).sort((a, b) => b.time.localeCompare(a.time));
  return { items, total: COSTS.length };
}

/** cost.detail：按请求 id 取详情；未命中返回 undefined（页面做空态） */
export function getCost(id: string): CostRecord | undefined {
  return COSTS.find((c) => c.id === id);
}

/** 全量请求 id（静态导出 generateStaticParams 用） */
export const COST_IDS: string[] = COSTS.map((c) => c.id);
