/**
 * Model 演示数据服务（MVP mock，静态页面）。
 * model.list / model.detail 注册为 Pactor service；接入真实后端后替换为
 * http / service 数据源，DSL 绑定路径保持不变。
 * 数据形态对齐 PRD《01-Model列表页》《02-Model详情页》《03-Model新增编辑页》（§7.2、§7.3）。
 */

export type ModelStatus = "enabled" | "disabled";
export type ModelType = "LLM" | "Embedding" | "Image" | "Audio";

/** 标准价格分档：upto=null 表示无上限档（∞） */
export interface ModelTier {
  upto: number | null;
  input: number;
  output: number;
  cacheRead: number | null;
  cacheWrite: number | null;
}

/** 定价时段倍率 */
export interface TimeMultiplier {
  days: string;
  start: string;
  end: string;
  rate: number;
}

/** 供应商模型绑定（提供商 Tab）：时段成本/计费倍率 */
export interface SupplierTimeRate {
  days: string;
  start: string;
  end: string;
  cost: number;
  billing: number;
}

export interface SupplierModel {
  providerCode: string;
  providerName: string;
  /** 继承 Provider 品牌图标（Icon 白名单图标名） */
  providerIcon: string;
  providerModelId: string;
  weight: number;
  /** 供应商成本倍率 C（相对定价 Tab 标准价） */
  costRate: number;
  /** 模型计费倍率 M（相对定价 Tab 标准价） */
  billingRate: number;
  status: ModelStatus;
  /** 时段倍率；null = 未配置，使用默认 C / M */
  timeRates: SupplierTimeRate[] | null;
  /** 继承 Provider 密钥状态 */
  keyConfigured: boolean;
  lastProbe: { time: string; ok: boolean } | null;
}

/** 路由引用（路由引用 Tab） */
export interface RouteRef {
  name: string;
  alias: string;
  type: string;
  weight: number;
  status: "启用" | "停用";
  health: "HEALTHY" | "UNHEALTHY";
}

/** 定价版本历史 */
export interface PriceVersion {
  version: string;
  current: boolean;
  effective: string;
  summary: string;
}

/** 默认参数（默认参数 Tab + 编辑页「默认参数」区） */
export interface ModelParams {
  temperature: string;
  topP: string;
  topK: string;
  maxTokens: string;
  frequencyPenalty: string;
  presencePenalty: string;
  reasoningEffort: string;
  seed: string;
  stopSequences: string;
  responseFormat: string;
  capabilities: string[];
}

export interface ModelRecord {
  code: string;
  name: string;
  providerCode: string;
  providerName: string;
  providerIcon: string;
  type: ModelType;
  typeLabel: string;
  releaseDate: string;
  contextWindow: number;
  /** 0 表示未设置（展示 —） */
  maxTokens: number;
  inputModalities: string[];
  outputModalities: string[];
  tags: string[];
  description: string;
  /** 元数据（JSON 文本） */
  metadata: string;
  status: ModelStatus;
  tiers: ModelTier[];
  timeMultipliers: TimeMultiplier[];
  currency: string;
  priceVersion: string;
  priceEffective: string;
  priceVersions: PriceVersion[];
  suppliers: SupplierModel[];
  routes: { total: number; active: number };
  routeRefs: RouteRef[];
  params: ModelParams;
  createdAt: string;
  updatedAt: string;
  operator: string;
  // ── 预计算摘要（表达式不适合拼接复合文案） ──
  /** 规格摘要：如 `256K · 32K`（上下文 · 最大输出） */
  specSummary: string;
  /** 定价摘要：默认档 如 `$0.2 / $1.6 /M`（输出为 0 时展示 —） */
  pricingSummary: string;
  /** 多档标识：如 `4档`；单档为空串 */
  tierLabel: string;
  /** 路由摘要：`N 条路由 · M 条活跃` 或 `未关联路由` */
  routeSummary: string;
  /** 模态预览：如 `T+I+V → T` */
  modalityPreview: string;
  inputModalitiesText: string;
  outputModalitiesText: string;
  tagsText: string;
  /** Provider 摘要：`阿里云百炼（主） · 共 N 个供应商模型` */
  providerSummary: string;
  /** 主供应商上游 Model ID（权重最高的启用实例） */
  primaryUpstreamId: string;
  /** 启用实例权重合计（展示文案） */
  supplierWeightTotal: string;
  /** 最近更新短日期（MM-DD） */
  shortDate: string;
}

export interface ModelListParams {
  /** all | LLM | Embedding | Image | Audio */
  type?: string;
  /** 厂商多选（Provider Code 列表） */
  providers?: string[];
}

/** 快筛 Chip 计数（数据构成口径，不随筛选变化） */
export interface ModelCounts {
  all: { enabled: number; total: number };
  types: Record<ModelType, number>;
  providers: Record<string, number>;
}

/** 快筛 Chip 选项（ChipFilter 组件入项；文案在接口侧预计算） */
export interface ModelChipOption {
  value: string;
  text: string;
  dot?: string;
}

export interface ModelListResult {
  items: ModelRecord[];
  total: number;
  counts: ModelCounts;
  /** 快筛 Chip 组：type 单选（含「全部」），providers 多选（含「全部」，点击清空） */
  filters: { type: ModelChipOption[]; providers: ModelChipOption[] };
}

const TYPE_LABELS: Record<ModelType, string> = {
  LLM: "大语言模型 (LLM)",
  Embedding: "Embedding",
  Image: "文生图 (Image)",
  Audio: "音频 (Audio)",
};

/** Token 数 → 短写法：256000 → 256K，1000000 → 1M，8192 → 8K */
function formatTokens(n: number): string {
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return `${v % 1 === 0 ? v : v.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    const v = n / 1_000;
    return `${v % 1 === 0 ? v : v.toFixed(1)}K`;
  }
  return String(n);
}

function modalityLetter(m: string): string {
  return (
    { text: "T", image: "I", audio: "A", video: "V", file: "F" }[m] ??
    m[0].toUpperCase()
  );
}

function joinList(items: string[]): string {
  return items.join(" · ");
}

/** 列表卡/详情页摘要字段派生 */
function derive(
  record: Omit<
    ModelRecord,
    | "typeLabel"
    | "specSummary"
    | "pricingSummary"
    | "tierLabel"
    | "routeSummary"
    | "modalityPreview"
    | "inputModalitiesText"
    | "outputModalitiesText"
    | "tagsText"
    | "providerSummary"
    | "primaryUpstreamId"
    | "supplierWeightTotal"
    | "shortDate"
  >,
): ModelRecord {
  const firstTier = record.tiers[0];
  const enabledSuppliers = record.suppliers.filter(
    (s) => s.status === "enabled",
  );
  const primary = enabledSuppliers[0] ?? record.suppliers[0];
  return {
    ...record,
    typeLabel: TYPE_LABELS[record.type],
    specSummary: `${formatTokens(record.contextWindow)} · ${record.maxTokens > 0 ? formatTokens(record.maxTokens) : "—"}`,
    pricingSummary: firstTier
      ? `$${firstTier.input} / $${firstTier.output > 0 ? firstTier.output : "—"} /M`
      : "未定价",
    tierLabel: record.tiers.length > 1 ? `${record.tiers.length}档` : "",
    routeSummary:
      record.routes.total === 0
        ? "未关联路由"
        : `${record.routes.total} 条路由 · ${record.routes.active} 条活跃`,
    modalityPreview: `${record.inputModalities.map(modalityLetter).join("+")} → ${record.outputModalities.map(modalityLetter).join("+")}`,
    inputModalitiesText: joinList(record.inputModalities),
    outputModalitiesText: joinList(record.outputModalities),
    tagsText: joinList(record.tags),
    providerSummary: primary
      ? `${primary.providerName}（主） · 共 ${record.suppliers.length} 个供应商模型`
      : "未绑定供应商模型",
    primaryUpstreamId: primary?.providerModelId ?? "—",
    supplierWeightTotal: String(
      enabledSuppliers.reduce((sum, s) => sum + s.weight, 0),
    ),
    shortDate: record.updatedAt.slice(5, 10),
  };
}

const MODELS: ModelRecord[] = [
  derive({
    code: "qwen3-vl-plus",
    name: "Qwen3-VL Plus",
    providerCode: "dashscope",
    providerName: "阿里云百炼",
    providerIcon: "cloud",
    type: "LLM",
    releaseDate: "2025-12-19",
    contextWindow: 256000,
    maxTokens: 32000,
    inputModalities: ["text", "image", "video"],
    outputModalities: ["text"],
    tags: ["free", "lite", "vision"],
    description:
      "A vision-language model for document, image, screen understanding and agentic visual tasks.",
    metadata: '{\n  "vendor_tier": "plus"\n}',
    status: "enabled",
    tiers: [
      {
        upto: 32000,
        input: 0.2,
        output: 1.6,
        cacheRead: null,
        cacheWrite: null,
      },
      {
        upto: 128000,
        input: 0.4,
        output: 3.2,
        cacheRead: null,
        cacheWrite: null,
      },
      {
        upto: 1000000,
        input: 0.8,
        output: 6.4,
        cacheRead: null,
        cacheWrite: null,
      },
      { upto: null, input: 1.2, output: 9.6, cacheRead: 0.1, cacheWrite: 0.2 },
    ],
    timeMultipliers: [
      { days: "每天", start: "00:00", end: "08:00", rate: 0.8 },
      { days: "工作日", start: "09:00", end: "18:00", rate: 1.2 },
    ],
    currency: "USD",
    priceVersion: "3",
    priceEffective: "2026-09-01",
    priceVersions: [
      {
        version: "v3",
        current: true,
        effective: "2026-09-01",
        summary: "4档 · 2条时段倍率",
      },
      {
        version: "v2",
        current: false,
        effective: "2026-08-01",
        summary: "3档 · 1条时段倍率",
      },
    ],
    suppliers: [
      {
        providerCode: "dashscope",
        providerName: "阿里云百炼",
        providerIcon: "cloud",
        providerModelId: "qwen-vl-plus-latest",
        weight: 60,
        costRate: 1.0,
        billingRate: 1.2,
        status: "enabled",
        timeRates: [
          {
            days: "每天",
            start: "00:00",
            end: "08:00",
            cost: 0.8,
            billing: 0.9,
          },
          {
            days: "工作日",
            start: "09:00",
            end: "18:00",
            cost: 1.0,
            billing: 1.2,
          },
        ],
        keyConfigured: false,
        lastProbe: null,
      },
      {
        providerCode: "openai",
        providerName: "OpenAI",
        providerIcon: "zap",
        providerModelId: "gpt-4o-2024-08-06",
        weight: 40,
        costRate: 1.1,
        billingRate: 1.0,
        status: "enabled",
        timeRates: null,
        keyConfigured: true,
        lastProbe: { time: "2026-09-08 14:20", ok: true },
      },
    ],
    routes: { total: 2, active: 0 },
    routeRefs: [
      {
        name: "reasoning-default",
        alias: "reasoning",
        type: "多模型池",
        weight: 60,
        status: "启用",
        health: "HEALTHY",
      },
      {
        name: "general-chat",
        alias: "general",
        type: "单模型",
        weight: 100,
        status: "启用",
        health: "HEALTHY",
      },
    ],
    params: {
      temperature: "0.7",
      topP: "0.9",
      topK: "40",
      maxTokens: "4096",
      frequencyPenalty: "0",
      presencePenalty: "0",
      reasoningEffort: "medium",
      seed: "—",
      stopSequences: "[]",
      responseFormat: "text",
      capabilities: ["Streaming", "Tool Calling", "Vision"],
    },
    createdAt: "2026-06-01 10:00",
    updatedAt: "2026-09-05 14:20",
    operator: "张三",
  }),
  derive({
    code: "qwen3.5-flash",
    name: "Qwen3.5 Flash",
    providerCode: "dashscope",
    providerName: "阿里云百炼",
    providerIcon: "cloud",
    type: "LLM",
    releaseDate: "2026-03-10",
    contextWindow: 1000000,
    maxTokens: 64000,
    inputModalities: ["text"],
    outputModalities: ["text"],
    tags: ["free", "lite"],
    description: "轻量大语言模型，长上下文，低延迟，适合高频对话场景。",
    metadata: '{\n  "vendor_tier": "flash"\n}',
    status: "enabled",
    tiers: [
      {
        upto: 128000,
        input: 0.1,
        output: 0.4,
        cacheRead: null,
        cacheWrite: null,
      },
      {
        upto: 512000,
        input: 0.2,
        output: 0.8,
        cacheRead: null,
        cacheWrite: null,
      },
      { upto: null, input: 0.3, output: 1.2, cacheRead: 0.05, cacheWrite: 0.1 },
    ],
    timeMultipliers: [
      { days: "每天", start: "00:00", end: "08:00", rate: 0.9 },
    ],
    currency: "USD",
    priceVersion: "2",
    priceEffective: "2026-08-15",
    priceVersions: [
      {
        version: "v2",
        current: true,
        effective: "2026-08-15",
        summary: "3档 · 1条时段倍率",
      },
      {
        version: "v1",
        current: false,
        effective: "2026-07-01",
        summary: "2档 · 无时段倍率",
      },
    ],
    suppliers: [
      {
        providerCode: "dashscope",
        providerName: "阿里云百炼",
        providerIcon: "cloud",
        providerModelId: "qwen3.5-flash",
        weight: 100,
        costRate: 1.0,
        billingRate: 1.0,
        status: "enabled",
        timeRates: null,
        keyConfigured: false,
        lastProbe: null,
      },
    ],
    routes: { total: 1, active: 1 },
    routeRefs: [
      {
        name: "general-chat",
        alias: "general",
        type: "单模型",
        weight: 100,
        status: "启用",
        health: "HEALTHY",
      },
    ],
    params: {
      temperature: "0.6",
      topP: "0.9",
      topK: "40",
      maxTokens: "8192",
      frequencyPenalty: "0",
      presencePenalty: "0",
      reasoningEffort: "low",
      seed: "—",
      stopSequences: "[]",
      responseFormat: "text",
      capabilities: ["Streaming", "Tool Calling"],
    },
    createdAt: "2026-06-15 09:30",
    updatedAt: "2026-09-08 11:05",
    operator: "李四",
  }),
  derive({
    code: "gemini-3-flash",
    name: "Gemini 3 Flash",
    providerCode: "gemini",
    providerName: "Google Gemini",
    providerIcon: "star",
    type: "LLM",
    releaseDate: "2026-01-22",
    contextWindow: 1000000,
    maxTokens: 64000,
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    tags: ["lite", "vision"],
    description: "Google Gemini 3 Flash：多模态输入，百万级上下文。",
    metadata: "{}",
    status: "enabled",
    tiers: [
      {
        upto: 200000,
        input: 0.15,
        output: 0.6,
        cacheRead: null,
        cacheWrite: null,
      },
      {
        upto: null,
        input: 0.3,
        output: 1.2,
        cacheRead: 0.03,
        cacheWrite: 0.05,
      },
    ],
    timeMultipliers: [],
    currency: "USD",
    priceVersion: "1",
    priceEffective: "2026-08-30",
    priceVersions: [
      {
        version: "v1",
        current: true,
        effective: "2026-08-30",
        summary: "2档 · 无时段倍率",
      },
    ],
    suppliers: [
      {
        providerCode: "gemini",
        providerName: "Google Gemini",
        providerIcon: "star",
        providerModelId: "gemini-3-flash",
        weight: 100,
        costRate: 1.0,
        billingRate: 1.0,
        status: "enabled",
        timeRates: null,
        keyConfigured: false,
        lastProbe: { time: "2026-08-30 20:10", ok: false },
      },
    ],
    routes: { total: 0, active: 0 },
    routeRefs: [],
    params: {
      temperature: "0.7",
      topP: "0.95",
      topK: "64",
      maxTokens: "8192",
      frequencyPenalty: "0",
      presencePenalty: "0",
      reasoningEffort: "medium",
      seed: "—",
      stopSequences: "[]",
      responseFormat: "text",
      capabilities: ["Streaming", "Tool Calling", "Vision"],
    },
    createdAt: "2026-07-02 16:00",
    updatedAt: "2026-08-30 20:10",
    operator: "张三",
  }),
  derive({
    code: "gpt-5",
    name: "GPT-5",
    providerCode: "openai",
    providerName: "OpenAI",
    providerIcon: "zap",
    type: "LLM",
    releaseDate: "2026-02-14",
    contextWindow: 512000,
    maxTokens: 64000,
    inputModalities: ["text", "image", "audio", "file"],
    outputModalities: ["text"],
    tags: ["pro"],
    description: "OpenAI GPT-5 旗舰模型，支持文本、图像、音频与文件输入。",
    metadata: '{\n  "vendor_tier": "pro"\n}',
    status: "enabled",
    tiers: [
      { upto: null, input: 0.4, output: 1.8, cacheRead: 0.1, cacheWrite: 0.2 },
    ],
    timeMultipliers: [],
    currency: "USD",
    priceVersion: "1",
    priceEffective: "2026-09-10",
    priceVersions: [
      {
        version: "v1",
        current: true,
        effective: "2026-09-10",
        summary: "1档 · 无时段倍率",
      },
    ],
    suppliers: [
      {
        providerCode: "openai",
        providerName: "OpenAI",
        providerIcon: "zap",
        providerModelId: "gpt-5",
        weight: 100,
        costRate: 1.0,
        billingRate: 1.0,
        status: "enabled",
        timeRates: null,
        keyConfigured: true,
        lastProbe: { time: "2026-09-10 09:12", ok: true },
      },
    ],
    routes: { total: 2, active: 1 },
    routeRefs: [
      {
        name: "reasoning-default",
        alias: "reasoning",
        type: "多模型池",
        weight: 40,
        status: "启用",
        health: "HEALTHY",
      },
      {
        name: "coding-assistant",
        alias: "coding",
        type: "单模型",
        weight: 100,
        status: "启用",
        health: "HEALTHY",
      },
    ],
    params: {
      temperature: "0.5",
      topP: "0.9",
      topK: "—",
      maxTokens: "16384",
      frequencyPenalty: "0",
      presencePenalty: "0",
      reasoningEffort: "high",
      seed: "—",
      stopSequences: "[]",
      responseFormat: "text",
      capabilities: ["Streaming", "Tool Calling", "Vision", "JSON Schema"],
    },
    createdAt: "2026-07-20 14:00",
    updatedAt: "2026-09-10 09:12",
    operator: "王五",
  }),
  derive({
    code: "text-embedding-3-large",
    name: "Text Embedding 3 Large",
    providerCode: "openai",
    providerName: "OpenAI",
    providerIcon: "zap",
    type: "Embedding",
    releaseDate: "2024-03-15",
    contextWindow: 8192,
    maxTokens: 0,
    inputModalities: ["text"],
    outputModalities: ["text"],
    tags: ["embedding"],
    description: "OpenAI 文本向量模型，用于检索、聚类与语义相似度计算。",
    metadata: "{}",
    status: "disabled",
    tiers: [
      { upto: null, input: 0.1, output: 0, cacheRead: null, cacheWrite: null },
    ],
    timeMultipliers: [],
    currency: "USD",
    priceVersion: "1",
    priceEffective: "2026-07-01",
    priceVersions: [
      {
        version: "v1",
        current: true,
        effective: "2026-07-01",
        summary: "1档 · 无时段倍率",
      },
    ],
    suppliers: [
      {
        providerCode: "openai",
        providerName: "OpenAI",
        providerIcon: "zap",
        providerModelId: "text-embedding-3-large",
        weight: 100,
        costRate: 1.0,
        billingRate: 1.0,
        status: "enabled",
        timeRates: null,
        keyConfigured: true,
        lastProbe: { time: "2026-09-01 10:00", ok: true },
      },
    ],
    routes: { total: 0, active: 0 },
    routeRefs: [],
    params: {
      temperature: "—",
      topP: "—",
      topK: "—",
      maxTokens: "—",
      frequencyPenalty: "—",
      presencePenalty: "—",
      reasoningEffort: "—",
      seed: "—",
      stopSequences: "—",
      responseFormat: "—",
      capabilities: [],
    },
    createdAt: "2026-06-25 11:00",
    updatedAt: "2026-07-22 18:40",
    operator: "李四",
  }),
];

/** 快筛选项常量：类型（单选）与厂商（多选，取有模型的 Provider） */
export const MODEL_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "LLM", label: "大语言模型" },
  { value: "Image", label: "文生图" },
  { value: "Audio", label: "音频" },
  { value: "Embedding", label: "Embedding" },
];

/** 厂商快筛：providers-with-models 的展示顺序（对齐 PRD 线框图） */
export const MODEL_PROVIDER_FILTERS: { value: string; label: string }[] = [
  { value: "dashscope", label: "阿里云百炼" },
  { value: "gemini", label: "Google Gemini" },
  { value: "openai", label: "OpenAI" },
];

/** 快筛计数：基于全量数据（构成口径，与当前筛选无关） */
function computeCounts(): ModelCounts {
  return {
    all: {
      enabled: MODELS.filter((m) => m.status === "enabled").length,
      total: MODELS.length,
    },
    types: {
      LLM: MODELS.filter((m) => m.type === "LLM").length,
      Embedding: MODELS.filter((m) => m.type === "Embedding").length,
      Image: MODELS.filter((m) => m.type === "Image").length,
      Audio: MODELS.filter((m) => m.type === "Audio").length,
    },
    providers: MODEL_PROVIDER_FILTERS.reduce<Record<string, number>>(
      (acc, p) => {
        acc[p.value] = MODELS.filter((m) => m.providerCode === p.value).length;
        return acc;
      },
      {},
    ),
  };
}

/** 快筛 Chip 选项：由计数派生，文案在此预计算（表达式不支持复合文案拼接） */
function computeFilters(counts: ModelCounts): ModelListResult["filters"] {
  return {
    type: [
      { value: "all", text: `全部 ${counts.all.total}` },
      ...MODEL_TYPE_OPTIONS.filter((o) => o.value !== "all").map((o) => ({
        value: o.value,
        text: `${o.label} ${counts.types[o.value as ModelType]}`,
      })),
    ],
    providers: [
      { value: "all", text: `全部 ${counts.all.total}` },
      ...MODEL_PROVIDER_FILTERS.map((p) => ({
        value: p.value,
        text: `${p.label} ${counts.providers[p.value]}`,
      })),
    ],
  };
}

/** model.list：类型单选 + 厂商多选取交集，按 Updated At 降序（「添加模型」卡置顶由页面保证） */
export function queryModels(params: ModelListParams = {}): ModelListResult {
  const type = params.type ?? "all";
  const providers = params.providers ?? [];
  const items = MODELS.filter(
    (m) =>
      (type === "all" || m.type === type) &&
      (providers.length === 0 || providers.includes(m.providerCode)),
  ).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const counts = computeCounts();
  return { items, total: MODELS.length, counts, filters: computeFilters(counts) };
}

/** model.detail：按 Model Code 取详情；未命中返回 undefined（页面做空态） */
export function getModel(code: string): ModelRecord | undefined {
  return MODELS.find((m) => m.code === code);
}

/** 全量 Model Code（静态导出 generateStaticParams 用） */
export const MODEL_CODES: string[] = MODELS.map((m) => m.code);
