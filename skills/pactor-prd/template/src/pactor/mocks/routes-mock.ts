/**
 * Route（模型路由）演示数据服务（MVP mock，静态页面）。
 * route.list / route.detail 注册为 Pactor service；接入真实后端后替换为
 * http / service 数据源，DSL 绑定路径保持不变。
 * 数据形态对齐 PRD《01-路由列表页》《02-路由详情页》《03-路由新增编辑页》（§8.1、§8.2）。
 * 模型引用与 models-mock 的 routeRefs 互相印证（reasoning-default / general-chat / coding-assistant）。
 */

export type RouteStatus = "enabled" | "disabled" | "draft";
export type RouteType = "single" | "pool" | "conditional";
export type RouteStrategy =
  | "WEIGHTED"
  | "HASH"
  | "PRIORITY"
  | "ROUND_ROBIN"
  | "RANDOM"
  | "FIXED";

/** 路由下的模型行（详情/编辑「模型与路由策略」表） */
export interface RouteModelEntry {
  modelCode: string;
  modelName: string;
  /** 主供应商摘要，如 `阿里云百炼 · qwen-vl-plus-latest` */
  providerSummary: string;
  weight: number;
  priority: "P0" | "P1" | "P2";
  /** 供应成本倍率 C；null = 留空继承 Model「提供商」配置 */
  costRate: number | null;
  /** 用户计费倍率 M；null = 留空继承 */
  billingRate: number | null;
  status: "enabled" | "disabled";
}

export interface RouteRecord {
  code: string;
  name: string;
  type: RouteType;
  typeLabel: string;
  /** 逻辑模型 Alias（对外暴露的模型名）；空串 = 未设置 */
  alias: string;
  tags: string[];
  description: string;
  status: RouteStatus;
  statusLabel: string;
  /** 请求路径，如 /v1/chat/completions */
  path: string;
  /** 协议格式（Ingress Protocol），如 OpenAI / Chat Completions */
  protocol: string;
  /** Ingress Operation，随协议格式带出，如 chat.completions */
  operation: string;
  strategy: RouteStrategy;
  strategyLabel: string;
  /** 粘性 Session：同会话固定到同一模型实例 */
  stickySession: boolean;
  /** 健康过滤：仅调度 HEALTHY 实例（默认开） */
  healthFilter: boolean;
  models: RouteModelEntry[];
  createdAt: string;
  updatedAt: string;
  operator: string;
  // ── 预计算摘要（表达式不适合拼接复合文案） ──
  /** 入口摘要：`/v1/chat/completions · OpenAI / Chat Completions` */
  entrySummary: string;
  /** 策略摘要：`3 模型 · 加权轮询` */
  policySummary: string;
  /** 策略完整文案：`加权轮询 (WEIGHTED)` */
  strategySummary: string;
  tagsText: string;
  /** 启用模型行数 */
  enabledModelCount: number;
  /** 启用项权重合计 */
  weightTotal: number;
  /** 最近更新短日期（MM-DD） */
  shortDate: string;
}

export interface RouteListParams {
  /** all | enabled | disabled | draft */
  status?: string;
  /** all | single | pool | conditional */
  type?: string;
  /** 标签多选 */
  tags?: string[];
}

/** 快筛 Chip 计数（数据构成口径，不随筛选变化） */
export interface RouteCounts {
  all: { enabled: number; total: number };
  status: Record<RouteStatus, number>;
  types: Record<RouteType, { enabled: number; total: number }>;
  /** 键为标签的表达式安全形式（连字符转下划线，如 low-cost → low_cost） */
  tags: Record<string, number>;
}

/** 快筛 Chip 选项（ChipFilter 组件入项；文案在接口侧预计算） */
export interface RouteChipOption {
  value: string;
  text: string;
  dot?: string;
}

export interface RouteListResult {
  items: RouteRecord[];
  total: number;
  counts: RouteCounts;
  /** 快筛 Chip 组：status / type 单选（含「全部」），tags 多选（含「全部」，点击清空） */
  filters: {
    status: RouteChipOption[];
    type: RouteChipOption[];
    tags: RouteChipOption[];
  };
}

export const TYPE_LABELS: Record<RouteType, string> = {
  single: "单模型",
  pool: "多模型池",
  conditional: "条件路由",
};

export const STATUS_LABELS: Record<RouteStatus, string> = {
  enabled: "启用",
  disabled: "停用",
  draft: "草稿",
};

export const STRATEGY_LABELS: Record<RouteStrategy, string> = {
  WEIGHTED: "加权轮询",
  HASH: "哈希分配",
  PRIORITY: "优先级",
  ROUND_ROBIN: "轮询",
  RANDOM: "随机",
  FIXED: "固定",
};

/** 协议格式 → Ingress Operation */
const PROTOCOL_OPERATIONS: Record<string, string> = {
  "OpenAI / Chat Completions": "chat.completions",
  "OpenAI / Responses": "responses",
  "Anthropic / Messages": "messages",
  "OpenAI / Embeddings": "embeddings",
};

/** 支持的协议格式（编辑页下拉，对齐 PRD《02》MVP 清单） */
export const PROTOCOL_OPTIONS = Object.keys(PROTOCOL_OPERATIONS).map((p) => ({
  label: p,
  value: p,
}));

export function protocolOperation(protocol: string): string {
  return PROTOCOL_OPERATIONS[protocol] ?? "—";
}

/** 模型路由策略选项（编辑页下拉；单模型固定 FIXED） */
export const STRATEGY_OPTIONS = (
  Object.keys(STRATEGY_LABELS) as RouteStrategy[]
).map((s) => ({ label: `${STRATEGY_LABELS[s]} (${s})`, value: s }));

function joinList(items: string[]): string {
  return items.join(" · ");
}

/** 列表卡/详情页摘要字段派生 */
function derive(
  record: Omit<
    RouteRecord,
    | "typeLabel"
    | "statusLabel"
    | "entrySummary"
    | "policySummary"
    | "strategyLabel"
    | "strategySummary"
    | "tagsText"
    | "enabledModelCount"
    | "weightTotal"
    | "shortDate"
  >,
): RouteRecord {
  const enabledModels = record.models.filter((m) => m.status === "enabled");
  return {
    ...record,
    typeLabel: TYPE_LABELS[record.type],
    statusLabel: STATUS_LABELS[record.status],
    entrySummary: `${record.path} · ${record.protocol}`,
    policySummary: `${record.models.length} 模型 · ${STRATEGY_LABELS[record.strategy]}`,
    strategyLabel: STRATEGY_LABELS[record.strategy],
    strategySummary: `${STRATEGY_LABELS[record.strategy]} (${record.strategy})`,
    tagsText: joinList(record.tags),
    enabledModelCount: enabledModels.length,
    weightTotal: enabledModels.reduce((sum, m) => sum + m.weight, 0),
    shortDate: record.updatedAt.slice(5, 10),
  };
}

const ROUTES: RouteRecord[] = [
  derive({
    code: "reasoning-default",
    name: "推理模型默认路由",
    type: "pool",
    alias: "reasoning",
    tags: ["reasoning", "premium"],
    description: "默认推理链路：旗舰视觉模型为主，GPT-5 兜底。",
    status: "enabled",
    path: "/v1/chat/completions",
    protocol: "OpenAI / Chat Completions",
    operation: "chat.completions",
    strategy: "WEIGHTED",
    stickySession: false,
    healthFilter: true,
    models: [
      {
        modelCode: "qwen3-vl-plus",
        modelName: "Qwen3-VL Plus",
        providerSummary: "阿里云百炼 · qwen-vl-plus-latest",
        weight: 60,
        priority: "P0",
        costRate: 1.0,
        billingRate: 1.2,
        status: "enabled",
      },
      {
        modelCode: "gpt-5",
        modelName: "GPT-5",
        providerSummary: "OpenAI · gpt-5",
        weight: 40,
        priority: "P0",
        costRate: null,
        billingRate: null,
        status: "enabled",
      },
    ],
    createdAt: "2026-06-01 10:00",
    updatedAt: "2026-09-10 09:30",
    operator: "张三",
  }),
  derive({
    code: "general-chat",
    name: "通用对话路由",
    type: "single",
    alias: "general",
    tags: ["general"],
    description: "高频通用对话入口，固定指向轻量模型。",
    status: "enabled",
    path: "/v1/chat/completions",
    protocol: "OpenAI / Chat Completions",
    operation: "chat.completions",
    strategy: "FIXED",
    stickySession: false,
    healthFilter: true,
    models: [
      {
        modelCode: "qwen3.5-flash",
        modelName: "Qwen3.5 Flash",
        providerSummary: "阿里云百炼 · qwen3.5-flash",
        weight: 100,
        priority: "P0",
        costRate: null,
        billingRate: null,
        status: "enabled",
      },
    ],
    createdAt: "2026-06-10 15:00",
    updatedAt: "2026-09-08 11:05",
    operator: "李四",
  }),
  derive({
    code: "coding-assistant",
    name: "代码助手路由",
    type: "single",
    alias: "coding",
    tags: ["coding"],
    description: "编程助手专用入口，固定指向 GPT-5。",
    status: "enabled",
    path: "/v1/chat/completions",
    protocol: "OpenAI / Chat Completions",
    operation: "chat.completions",
    strategy: "FIXED",
    stickySession: true,
    healthFilter: true,
    models: [
      {
        modelCode: "gpt-5",
        modelName: "GPT-5",
        providerSummary: "OpenAI · gpt-5",
        weight: 100,
        priority: "P0",
        costRate: 1.0,
        billingRate: 1.0,
        status: "enabled",
      },
    ],
    createdAt: "2026-07-01 09:00",
    updatedAt: "2026-09-05 17:42",
    operator: "王五",
  }),
  derive({
    code: "mobile-lite",
    name: "移动端轻量路由",
    type: "pool",
    alias: "chat-lite",
    tags: ["low-cost", "mobile"],
    description: "移动端低延迟场景：轻量模型轮询调度。",
    status: "enabled",
    path: "/v1/chat/completions",
    protocol: "OpenAI / Chat Completions",
    operation: "chat.completions",
    strategy: "ROUND_ROBIN",
    stickySession: false,
    healthFilter: true,
    models: [
      {
        modelCode: "qwen3.5-flash",
        modelName: "Qwen3.5 Flash",
        providerSummary: "阿里云百炼 · qwen3.5-flash",
        weight: 50,
        priority: "P0",
        costRate: null,
        billingRate: null,
        status: "enabled",
      },
      {
        modelCode: "gemini-3-flash",
        modelName: "Gemini 3 Flash",
        providerSummary: "Google Gemini · gemini-3-flash",
        weight: 50,
        priority: "P1",
        costRate: null,
        billingRate: null,
        status: "enabled",
      },
    ],
    createdAt: "2026-07-15 14:00",
    updatedAt: "2026-09-02 08:20",
    operator: "李四",
  }),
  derive({
    code: "vision-router",
    name: "视觉模型条件路由",
    type: "conditional",
    alias: "vision",
    tags: ["vision"],
    description: "按输入模态与规则表达式命中不同视觉模型（草稿，规则待完善）。",
    status: "draft",
    path: "/v1/chat/completions",
    protocol: "Anthropic / Messages",
    operation: "messages",
    strategy: "HASH",
    stickySession: true,
    healthFilter: true,
    models: [
      {
        modelCode: "qwen3-vl-plus",
        modelName: "Qwen3-VL Plus",
        providerSummary: "阿里云百炼 · qwen-vl-plus-latest",
        weight: 50,
        priority: "P0",
        costRate: null,
        billingRate: null,
        status: "enabled",
      },
      {
        modelCode: "gemini-3-flash",
        modelName: "Gemini 3 Flash",
        providerSummary: "Google Gemini · gemini-3-flash",
        weight: 50,
        priority: "P1",
        costRate: null,
        billingRate: null,
        status: "disabled",
      },
    ],
    createdAt: "2026-08-20 11:30",
    updatedAt: "2026-09-11 16:00",
    operator: "张三",
  }),
  derive({
    code: "embeddings-std",
    name: "标准向量路由",
    type: "single",
    alias: "embedding",
    tags: ["embedding"],
    description: "检索与聚类场景的统一 Embedding 入口。",
    status: "enabled",
    path: "/v1/embeddings",
    protocol: "OpenAI / Embeddings",
    operation: "embeddings",
    strategy: "FIXED",
    stickySession: false,
    healthFilter: true,
    models: [
      {
        modelCode: "text-embedding-3-large",
        modelName: "Text Embedding 3 Large",
        providerSummary: "OpenAI · text-embedding-3-large",
        weight: 100,
        priority: "P0",
        costRate: null,
        billingRate: null,
        status: "enabled",
      },
    ],
    createdAt: "2026-06-20 10:30",
    updatedAt: "2026-09-01 10:00",
    operator: "王五",
  }),
  derive({
    code: "long-context",
    name: "长上下文路由",
    type: "pool",
    alias: "",
    tags: ["reasoning"],
    description: "百万级长文档处理：按优先级带调度（当前停用整改中）。",
    status: "disabled",
    path: "/v1/chat/completions",
    protocol: "OpenAI / Responses",
    operation: "responses",
    strategy: "PRIORITY",
    stickySession: true,
    healthFilter: true,
    models: [
      {
        modelCode: "qwen3.5-flash",
        modelName: "Qwen3.5 Flash",
        providerSummary: "阿里云百炼 · qwen3.5-flash",
        weight: 60,
        priority: "P0",
        costRate: null,
        billingRate: null,
        status: "enabled",
      },
      {
        modelCode: "qwen3-vl-plus",
        modelName: "Qwen3-VL Plus",
        providerSummary: "阿里云百炼 · qwen-vl-plus-latest",
        weight: 30,
        priority: "P1",
        costRate: null,
        billingRate: null,
        status: "enabled",
      },
      {
        modelCode: "gemini-3-flash",
        modelName: "Gemini 3 Flash",
        providerSummary: "Google Gemini · gemini-3-flash",
        weight: 10,
        priority: "P2",
        costRate: null,
        billingRate: null,
        status: "disabled",
      },
    ],
    createdAt: "2026-07-28 09:00",
    updatedAt: "2026-08-30 22:15",
    operator: "张三",
  }),
  derive({
    code: "failover-chat",
    name: "通用兜底路由",
    type: "pool",
    alias: "",
    tags: ["general", "low-cost"],
    description: "主路异常时的兜底链路：加权调度两个轻量模型（当前停用）。",
    status: "disabled",
    path: "/v1/chat/completions",
    protocol: "OpenAI / Chat Completions",
    operation: "chat.completions",
    strategy: "WEIGHTED",
    stickySession: false,
    healthFilter: true,
    models: [
      {
        modelCode: "qwen3.5-flash",
        modelName: "Qwen3.5 Flash",
        providerSummary: "阿里云百炼 · qwen3.5-flash",
        weight: 70,
        priority: "P0",
        costRate: null,
        billingRate: null,
        status: "enabled",
      },
      {
        modelCode: "gemini-3-flash",
        modelName: "Gemini 3 Flash",
        providerSummary: "Google Gemini · gemini-3-flash",
        weight: 30,
        priority: "P1",
        costRate: null,
        billingRate: null,
        status: "enabled",
      },
    ],
    createdAt: "2026-08-01 16:00",
    updatedAt: "2026-08-25 19:30",
    operator: "李四",
  }),
];

/** 快筛选项常量：状态/类型（单选）与标签（多选） */
export const ROUTE_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "enabled", label: "已启用" },
  { value: "disabled", label: "已停用" },
  { value: "draft", label: "草稿" },
];

export const ROUTE_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "single", label: "单模型" },
  { value: "pool", label: "多模型池" },
  { value: "conditional", label: "条件路由" },
];

/** 标签快筛（按数据中出现顺序展示；多选取交集） */
export const ROUTE_TAG_FILTERS: { value: string; label: string }[] = [
  ...new Set(ROUTES.flatMap((r) => r.tags)),
].map((t) => ({ value: t, label: t }));

/** 快筛计数：基于全量数据（构成口径，与当前筛选无关） */
function computeCounts(): RouteCounts {
  return {
    all: {
      enabled: ROUTES.filter((r) => r.status === "enabled").length,
      total: ROUTES.length,
    },
    status: {
      enabled: ROUTES.filter((r) => r.status === "enabled").length,
      disabled: ROUTES.filter((r) => r.status === "disabled").length,
      draft: ROUTES.filter((r) => r.status === "draft").length,
    },
    types: {
      single: {
        enabled: ROUTES.filter(
          (r) => r.type === "single" && r.status === "enabled",
        ).length,
        total: ROUTES.filter((r) => r.type === "single").length,
      },
      pool: {
        enabled: ROUTES.filter(
          (r) => r.type === "pool" && r.status === "enabled",
        ).length,
        total: ROUTES.filter((r) => r.type === "pool").length,
      },
      conditional: {
        enabled: ROUTES.filter(
          (r) => r.type === "conditional" && r.status === "enabled",
        ).length,
        total: ROUTES.filter((r) => r.type === "conditional").length,
      },
    },
    tags: ROUTE_TAG_FILTERS.reduce<Record<string, number>>((acc, t) => {
      const key = t.value.replace(/-/g, "_");
      acc[key] = ROUTES.filter((r) => r.tags.includes(t.value)).length;
      return acc;
    }, {}),
  };
}

/** 快筛 Chip 选项：由计数派生，文案在此预计算（表达式不支持复合文案拼接） */
function computeFilters(counts: RouteCounts): RouteListResult["filters"] {
  return {
    status: [
      { value: "all", text: `全部 ${counts.all.enabled}/${counts.all.total}` },
      { value: "enabled", text: `已启用 ${counts.status.enabled}` },
      { value: "disabled", text: `已停用 ${counts.status.disabled}` },
      { value: "draft", text: `草稿 ${counts.status.draft}` },
    ],
    type: [
      { value: "all", text: `全部 ${counts.all.enabled}/${counts.all.total}` },
      ...ROUTE_TYPE_OPTIONS.filter((o) => o.value !== "all").map((o) => ({
        value: o.value,
        text: `${o.label} ${counts.types[o.value as RouteType].enabled}/${counts.types[o.value as RouteType].total}`,
      })),
    ],
    tags: [
      { value: "all", text: `全部 ${counts.all.total}` },
      ...ROUTE_TAG_FILTERS.map((t) => ({
        value: t.value,
        text: `${t.label} ${counts.tags[t.value.replace(/-/g, "_")]}`,
      })),
    ],
  };
}

/** route.list：状态/类型单选 + 标签多选取交集，按 Updated At 降序（「新建路由」卡置顶由页面保证） */
export function queryRoutes(params: RouteListParams = {}): RouteListResult {
  const status = params.status ?? "all";
  const type = params.type ?? "all";
  const tags = params.tags ?? [];
  const items = ROUTES.filter(
    (r) =>
      (status === "all" || r.status === status) &&
      (type === "all" || r.type === type) &&
      (tags.length === 0 || tags.every((t) => r.tags.includes(t))),
  ).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const counts = computeCounts();
  return { items, total: ROUTES.length, counts, filters: computeFilters(counts) };
}

/** route.detail：按路由标识取详情；未命中返回 undefined（页面做空态） */
export function getRoute(code: string): RouteRecord | undefined {
  return ROUTES.find((r) => r.code === code);
}

/** 全量路由标识（静态导出 generateStaticParams 用） */
export const ROUTE_CODES: string[] = ROUTES.map((r) => r.code);
