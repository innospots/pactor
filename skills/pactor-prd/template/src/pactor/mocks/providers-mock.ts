/**
 * Provider 演示数据服务（MVP mock，静态页面）。
 * provider.list / provider.detail / provider.pullModels 注册为 Pactor
 * service；接入真实后端后替换为 http / service 数据源，DSL 绑定路径保持不变。
 * 数据形态对齐 PRD《01-Provider列表页》《02-Provider详情页》（§7.1）。
 */

export type ProviderStatus = "enabled" | "disabled";
/** configured=已配置；pending=已创建但密钥未保存（模板导入待补齐）；none=未配置密钥 */
export type KeyStatus = "configured" | "pending" | "none";

export interface ProviderModel {
  code: string;
  name: string;
  type: string;
  providerModelId: string;
  pricing: string;
  status: "ONLINE" | "OFFLINE";
  routes: number;
}

export interface ProviderRecord {
  code: string;
  name: string;
  /** 同名多实例区分展示名，如 DeepSeek (2) */
  displayName: string;
  /** Icon 白名单图标名 */
  icon: string;
  providerType: string;
  protocol: string;
  /** 类型/协议快筛聚合键（内置模板族） */
  family: "openai" | "anthropic" | "gemini" | "dashscope";
  status: ProviderStatus;
  keyStatus: KeyStatus;
  baseUrl: string;
  region: string;
  timeout: number;
  proxy: string;
  maskedKey: string;
  lastTest: { time: string; ok: boolean; detail: string } | null;
  capabilities: string[];
  routes: { total: number; enabled: number };
  /** 路由摘要（预计算：表达式不适合拼接复合文案） */
  routeSummary: string;
  models: ProviderModel[];
  modelCount: number;
  /** 启用状态模型数（getProvider 派生；停用确认弹层「影响范围」用） */
  enabledModelCount?: number;
  description: string;
  capabilityExtension: string;
  createdAt: string;
  updatedAt: string;
  operator: string;
}

export interface ProviderListParams {
  keyword?: string;
  /** all | enabled | disabled | pending | none */
  status?: string;
  types?: string[];
}

/** 快筛 Chip 计数（数据构成口径，不随搜索/筛选变化）：全部/类型 Chip 为「已启用/总数」，状态 Chip 仅对应数量 */
export interface ProviderCounts {
  all: { enabled: number; total: number };
  status: Record<"enabled" | "disabled" | "pending" | "none", number>;
  types: Record<string, { enabled: number; total: number }>;
}

/** 快筛 Chip 选项（ChipFilter 组件入项；文案在接口侧预计算） */
export interface ProviderChipOption {
  value: string;
  text: string;
  dot?: string;
}

export interface ProviderListResult {
  items: ProviderRecord[];
  total: number;
  counts: ProviderCounts;
  /** 快筛 Chip 组：status 单选（含「全部」）/ types 多选（无「全部」，不选即全部） */
  filters: { status: ProviderChipOption[]; types: ProviderChipOption[] };
}

/** 类型快筛的展示元数据（label / 色点），聚合键与 ProviderRecord.family 一致 */
const TYPE_CHIP_META: { value: string; label: string; dot: string }[] = [
  { value: "openai", label: "OpenAI", dot: "#3b82f6" },
  { value: "anthropic", label: "Anthropic", dot: "#b45309" },
  { value: "gemini", label: "Gemini", dot: "#1d4ed8" },
  { value: "dashscope", label: "DashScope", dot: "#8b5cf6" },
];

const PROVIDERS: ProviderRecord[] = [
  {
    code: "openai",
    name: "OpenAI",
    displayName: "OpenAI",
    icon: "zap",
    providerType: "商业",
    protocol: "OpenAI Compatible",
    family: "openai",
    status: "enabled",
    keyStatus: "configured",
    baseUrl: "https://api.openai.com/v1",
    region: "us-east",
    timeout: 60000,
    proxy: "",
    maskedKey: "sk-••••••••••••••••••••••••",
    lastTest: { time: "2026-09-05 14:18", ok: true, detail: "HTTP 200, 128ms" },
    capabilities: ["chat", "images", "audio", "responses", "embeddings"],
    routes: { total: 12, enabled: 8 },
    routeSummary: "12 条路由 · 8 条启用",
    models: [
      { code: "gpt-4o", name: "GPT-4o", type: "LLM", providerModelId: "gpt-4o-2024-08-06", pricing: "$2.5/M", status: "ONLINE", routes: 2 },
      { code: "gpt-4o-mini", name: "GPT-4o Mini", type: "LLM", providerModelId: "gpt-4o-mini", pricing: "$0.15/M", status: "ONLINE", routes: 1 },
      { code: "text-embedding-3", name: "Text Embedding 3", type: "Embedding", providerModelId: "text-embedding-3-large", pricing: "$0.1/M", status: "ONLINE", routes: 1 },
    ],
    modelCount: 18,
    description: "OpenAI 官方及兼容 API 供应商",
    capabilityExtension: '{\n  "supports_responses": true,\n  "supports_streaming": true,\n  "supports_tool_calls": true,\n \n  "supports_responses1": true,\n  "supports_streaming2": true,\n  "supports_tool_calls3": true\n}',
    createdAt: "2026-06-01 10:00",
    updatedAt: "2026-09-05 14:20",
    operator: "张三",
  },
  {
    code: "azure-openai",
    name: "Azure OpenAI",
    displayName: "Azure OpenAI",
    icon: "cloud",
    providerType: "云服务",
    protocol: "OpenAI Compatible",
    family: "openai",
    status: "enabled",
    keyStatus: "configured",
    baseUrl: "https://contoso.openai.azure.com/openai/v1",
    region: "eastus",
    timeout: 60000,
    proxy: "",
    maskedKey: "az-••••••••••••••••",
    lastTest: { time: "2026-09-04 09:32", ok: true, detail: "HTTP 200, 210ms" },
    capabilities: ["chat", "embeddings"],
    routes: { total: 3, enabled: 2 },
    routeSummary: "3 条路由 · 2 条启用",
    models: [
      { code: "azure-gpt-4o", name: "Azure GPT-4o", type: "LLM", providerModelId: "gpt-4o", pricing: "$2.5/M", status: "ONLINE", routes: 2 },
    ],
    modelCount: 5,
    description: "微软 Azure 托管的 OpenAI 服务",
    capabilityExtension: '{\n  "supports_streaming": true\n}',
    createdAt: "2026-06-12 11:30",
    updatedAt: "2026-09-04 09:32",
    operator: "李四",
  },
  {
    code: "anthropic",
    name: "Anthropic",
    displayName: "Anthropic",
    icon: "brain",
    providerType: "商业",
    protocol: "Anthropic Messages",
    family: "anthropic",
    status: "enabled",
    keyStatus: "configured",
    baseUrl: "https://api.anthropic.com/v1",
    region: "",
    timeout: 60000,
    proxy: "",
    maskedKey: "sk-ant-••••••••••••••••",
    lastTest: { time: "2026-09-03 16:45", ok: true, detail: "HTTP 200, 156ms" },
    capabilities: ["chat", "messages"],
    routes: { total: 5, enabled: 3 },
    routeSummary: "5 条路由 · 3 条启用",
    models: [
      { code: "claude-sonnet-4-5", name: "Claude Sonnet 4.5", type: "LLM", providerModelId: "claude-sonnet-4-5-20250929", pricing: "$3/M", status: "ONLINE", routes: 2 },
      { code: "claude-haiku-4-5", name: "Claude Haiku 4.5", type: "LLM", providerModelId: "claude-haiku-4-5-20251001", pricing: "$0.8/M", status: "ONLINE", routes: 1 },
    ],
    modelCount: 9,
    description: "Anthropic Claude 系列模型",
    capabilityExtension: '{\n  "supports_messages": true,\n  "supports_streaming": true\n}',
    createdAt: "2026-06-20 14:00",
    updatedAt: "2026-09-03 16:45",
    operator: "张三",
  },
  {
    code: "dashscope",
    name: "阿里云百炼",
    displayName: "阿里云百炼",
    icon: "cloud",
    providerType: "云服务",
    protocol: "DashScope",
    family: "dashscope",
    status: "enabled",
    keyStatus: "pending",
    baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    region: "cn-beijing",
    timeout: 60000,
    proxy: "",
    maskedKey: "",
    lastTest: null,
    capabilities: ["chat", "images", "audio"],
    routes: { total: 0, enabled: 0 },
    routeSummary: "未关联路由",
    models: [],
    modelCount: 0,
    description: "阿里云大模型服务平台（模板导入，待补齐 API Key）",
    capabilityExtension: "{}",
    createdAt: "2026-09-10 10:12",
    updatedAt: "2026-09-10 10:12",
    operator: "王五",
  },
  {
    code: "deepseek",
    name: "DeepSeek",
    displayName: "DeepSeek (2)",
    icon: "zap",
    providerType: "商业",
    protocol: "OpenAI Compatible",
    family: "openai",
    status: "enabled",
    keyStatus: "pending",
    baseUrl: "https://api.deepseek.com/v1",
    region: "",
    timeout: 60000,
    proxy: "",
    maskedKey: "",
    lastTest: null,
    capabilities: ["chat"],
    routes: { total: 5, enabled: 0 },
    routeSummary: "5 条路由 · 0 条启用",
    models: [
      { code: "deepseek-chat", name: "DeepSeek Chat", type: "LLM", providerModelId: "deepseek-chat", pricing: "$0.27/M", status: "ONLINE", routes: 0 },
      { code: "deepseek-reasoner", name: "DeepSeek Reasoner", type: "LLM", providerModelId: "deepseek-reasoner", pricing: "$0.55/M", status: "OFFLINE", routes: 0 },
    ],
    modelCount: 3,
    description: "DeepSeek 官方 API（第二实例）",
    capabilityExtension: '{\n  "supports_streaming": true\n}',
    createdAt: "2026-08-28 15:40",
    updatedAt: "2026-09-08 11:05",
    operator: "李四",
  },
  {
    code: "volcengine",
    name: "火山方舟",
    displayName: "火山方舟",
    icon: "zap",
    providerType: "云服务",
    protocol: "OpenAI Compatible",
    family: "openai",
    status: "disabled",
    keyStatus: "pending",
    baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
    region: "cn-beijing",
    timeout: 60000,
    proxy: "",
    maskedKey: "",
    lastTest: null,
    capabilities: ["chat", "images"],
    routes: { total: 0, enabled: 0 },
    routeSummary: "未关联路由",
    models: [],
    modelCount: 0,
    description: "字节跳动火山引擎方舟平台（模板导入，待补齐 API Key）",
    capabilityExtension: "{}",
    createdAt: "2026-09-09 09:20",
    updatedAt: "2026-09-09 09:20",
    operator: "王五",
  },
  {
    code: "gemini",
    name: "Google Gemini",
    displayName: "Google Gemini",
    icon: "star",
    providerType: "商业",
    protocol: "Gemini",
    family: "gemini",
    status: "disabled",
    keyStatus: "none",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    region: "",
    timeout: 60000,
    proxy: "",
    maskedKey: "",
    lastTest: { time: "2026-08-30 20:10", ok: false, detail: "HTTP 401, 98ms" },
    capabilities: ["chat", "generate"],
    routes: { total: 2, enabled: 0 },
    routeSummary: "2 条路由 · 0 条启用",
    models: [],
    modelCount: 0,
    description: "Google Gemini 系列模型（未配置 API Key）",
    capabilityExtension: "{}",
    createdAt: "2026-08-30 20:00",
    updatedAt: "2026-08-30 20:10",
    operator: "张三",
  },
];

export interface PullModelRow {
  id: string;
  name: string;
  local: string;
}

/** 上游 List Models 演示返回（本地状态 = 新增 / 已存在（跳过）） */
const UPSTREAM_MODELS: Record<string, PullModelRow[]> = {
  openai: [
    { id: "gpt-4o-2024-08-06", name: "GPT-4o", local: "已存在（跳过）" },
    { id: "o1-preview", name: "o1 Preview", local: "新增" },
    { id: "dall-e-3", name: "DALL·E 3", local: "新增" },
    { id: "gpt-5", name: "GPT-5", local: "新增" },
  ],
  anthropic: [
    { id: "claude-sonnet-4-5-20250929", name: "Claude Sonnet 4.5", local: "已存在（跳过）" },
    { id: "claude-opus-4-1", name: "Claude Opus 4.1", local: "新增" },
  ],
};

function matchesKeyword(p: ProviderRecord, keyword: string): boolean {
  const k = keyword.trim().toLowerCase();
  if (!k) return true;
  return [p.name, p.code, p.baseUrl, ...p.capabilities]
    .join(" ")
    .toLowerCase()
    .includes(k);
}

function matchesStatus(p: ProviderRecord, status?: string): boolean {
  switch (status) {
    case "enabled":
    case "disabled":
      return p.status === status;
    case "pending":
      return p.keyStatus === "pending";
    case "none":
      return p.keyStatus === "none";
    default:
      return true;
  }
}

/** 快筛计数：基于全量数据（构成口径，与当前筛选无关） */
function computeCounts(): ProviderCounts {
  const enabled = PROVIDERS.filter((p) => p.status === "enabled").length;
  return {
    all: { enabled, total: PROVIDERS.length },
    status: {
      enabled,
      disabled: PROVIDERS.filter((p) => p.status === "disabled").length,
      pending: PROVIDERS.filter((p) => p.keyStatus === "pending").length,
      none: PROVIDERS.filter((p) => p.keyStatus === "none").length,
    },
    types: TYPE_CHIP_META.map((m) => m.value).reduce<
      Record<string, { enabled: number; total: number }>
    >((acc, family) => {
      const inFamily = PROVIDERS.filter((p) => p.family === family);
      acc[family] = {
        enabled: inFamily.filter((p) => p.status === "enabled").length,
        total: inFamily.length,
      };
      return acc;
    }, {}),
  };
}

/** 快筛 Chip 选项：由计数派生，文案在此预计算（表达式不支持字符串拼接以外的复合逻辑） */
function computeFilters(
  counts: ProviderCounts,
): ProviderListResult["filters"] {
  return {
    status: [
      { value: "all", text: `全部 ${counts.all.enabled}/${counts.all.total}` },
      { value: "enabled", text: `已启用 ${counts.status.enabled}`, dot: "#22c55e" },
      { value: "disabled", text: `已停用 ${counts.status.disabled}`, dot: "#9ca3af" },
      { value: "pending", text: `待填密钥 ${counts.status.pending}`, dot: "#f59e0b" },
      { value: "none", text: `无密钥 ${counts.status.none}`, dot: "#ef4444" },
    ],
    types: TYPE_CHIP_META.map((m) => ({
      value: m.value,
      text: `${m.label} ${counts.types[m.value].enabled}/${counts.types[m.value].total}`,
      dot: m.dot,
    })),
  };
}

/** 启用状态模型数派生（列表 / 详情 / 停用确认弹层「影响范围」共用） */
function withEnabledModelCount(record: ProviderRecord): ProviderRecord {
  return {
    ...record,
    enabledModelCount: record.models.filter((m) => m.status === "ONLINE").length,
  };
}

/** provider.list：搜索 + 状态/类型快筛取交集，即时过滤（防抖由调用侧控制） */
export function queryProviders(params: ProviderListParams = {}): ProviderListResult {
  const keyword = params.keyword ?? "";
  const status = params.status ?? "all";
  const types = params.types ?? [];
  const items = PROVIDERS.filter(
    (p) =>
      matchesKeyword(p, keyword) &&
      matchesStatus(p, status) &&
      (types.length === 0 || types.includes(p.family)),
  ).map(withEnabledModelCount);
  const counts = computeCounts();
  return { items, total: PROVIDERS.length, counts, filters: computeFilters(counts) };
}

/** provider.detail：按 Provider Code 取详情；未命中返回 undefined（页面做空态） */
export function getProvider(code: string): ProviderRecord | undefined {
  const record = PROVIDERS.find((p) => p.code === code);
  return record ? withEnabledModelCount(record) : undefined;
}

/** 全量 Provider Code（静态导出 generateStaticParams 用） */
export const PROVIDER_CODES: string[] = PROVIDERS.map((p) => p.code);

/** provider.pullModels：模拟上游 List Models（对齐 PRD「拉取」弹层） */
export function pullProviderModels(code: string): PullModelRow[] {
  return (
    UPSTREAM_MODELS[code] ?? [
      { id: `${code}-chat`, name: `${code} Chat`, local: "新增" },
      { id: `${code}-pro`, name: `${code} Pro`, local: "新增" },
    ]
  );
}
