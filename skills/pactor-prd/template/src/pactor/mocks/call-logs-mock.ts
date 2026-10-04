/**
 * 调用日志（运行管理）演示数据服务（MVP mock，静态页面）。
 * callLog.list / callLog.detail 注册为 Pactor service；接入真实后端后替换为
 * http / service 数据源，DSL 绑定路径保持不变。
 * 数据形态对齐 PRD《运行管理/01-调用日志列表与详情》：列表（状态·时间 / 用户·系统 /
 * 路由 / 标签 / 用量 / 成本 / 毛利）+ 详情 11 个 Tab（基本信息 / 调用主体 / Ingress /
 * 路由结果 / Upstream / 性能 / 用量 / 成本 / 错误 / 路由追踪 / Prompt/Response）。
 * 模型 / 供应商 / 客户端 / 路由命名与 models-mock / providers-mock / clients-mock /
 * routes-mock 保持一致。复合文案与紧凑格式（K/M、千分位）全部在 mock 层预计算
 * （表达式引擎不支持数组方法与函数调用）。
 */

export type CallLogStatus =
  | "success"
  | "error"
  | "unfinished"
  | "cancelled"
  | "other";

/** 路由追踪决策链单步：输入 / 判断 / 输出 / 耗时 / 原因 */
export interface TraceStep {
  name: string;
  input: string;
  decision: string;
  output: string;
  duration: string;
  reason: string;
}

/** 错误详情（仅错误状态记录有值） */
export interface CallLogError {
  code: string;
  type: string;
  /** 上游 message */
  message: string;
}

/** Prompt/Response 留存（按平台策略：不保存 / 脱敏 / 抽样 / 完整） */
export interface PromptResponse {
  policy: string;
  policyNote: string;
  /** null = 按策略未留存 */
  prompt: string | null;
  response: string | null;
}

export interface CallLogRecord {
  id: string;
  status: CallLogStatus;
  statusLabel: string;
  /** 2026-09-18 14:32:18 UTC */
  timeUtc: string;
  /** 09-18 14:32:18 UTC */
  timeShort: string;
  latencyMs: number;
  /** 320ms */
  latencyText: string;
  userEmail: string;
  clientCode: string;
  clientName: string;
  appKeyId: string;
  channel: string;
  routeTag: string;
  application: string;
  /** 上下文标签摘要（紧凑展示），如 web · agent */
  tagsText: string;
  routeCode: string;
  routeName: string;
  routeGroup: string;
  protocol: string;
  modelCode: string;
  modelName: string;
  providerCode: string;
  providerName: string;
  inputTokens: number | null;
  outputTokens: number | null;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  /** 用量紧凑格式，如 2.1K/1.8K；无输出为 520/— */
  usageText: string;
  inputTokensText: string;
  outputTokensText: string;
  cacheReadText: string;
  cacheWriteText: string;
  totalTokensText: string;
  costUsd: number | null;
  billingUsd: number | null;
  marginUsd: number | null;
  costText: string;
  billingText: string;
  /** 失败或未计费显示 — */
  marginText: string;
  standardPriceText: string;
  pricingSnapshot: string;
  httpStatusText: string;
  // ── Ingress ──
  ingressMethod: string;
  ingressPath: string;
  authResult: string;
  clientIp: string;
  // ── 路由结果 ──
  alias: string;
  strategyText: string;
  // ── Upstream / 性能 ──
  upstreamEndpoint: string;
  upstreamModel: string;
  upstreamStatusText: string;
  upstreamLatencyText: string;
  ttftText: string;
  retries: number;
  retriesText: string;
  traceId: string;
  // ── 错误 / 路由追踪 / Prompt ──
  error: CallLogError | null;
  trace: TraceStep[];
  pr: PromptResponse;
}

export interface CallLogListParams {
  /** 时间范围（ISO 日期对，含端点；缺省不过滤） */
  start?: string;
  end?: string;
  /** all | success | error | unfinished | cancelled | other */
  status?: string;
  model?: string;
  provider?: string;
  protocol?: string;
  routeGroup?: string;
  /** 用户 Email 模糊 */
  email?: string;
  /** AppKey ID 模糊 */
  appKey?: string;
}

export interface CallLogListResult {
  items: CallLogRecord[];
  /** 全量条数（不随筛选变化） */
  total: number;
  /** 当前筛选命中数（千分位预计算，供「总计: N 个请求」展示） */
  filteredText: string;
}

export const CALL_LOG_STATUS_LABELS: Record<CallLogStatus, string> = {
  success: "成功",
  error: "错误",
  unfinished: "未完成",
  cancelled: "已取消",
  other: "其他",
};

// ── 一致性维度元数据（名称取自 models / providers / clients / routes mock）──

const CLIENT_META: Record<
  string,
  { appKey: string; channel: string; application: string; routeTag: string }
> = {
  "agent-app": {
    appKey: "gw-ak-7f3a2b1c",
    channel: "web",
    application: "agent-app",
    routeTag: "prod",
  },
  "web-portal": {
    appKey: "gw-ak-9c1d4e5f",
    channel: "web",
    application: "web-portal",
    routeTag: "prod",
  },
  "internal-batch": {
    appKey: "gw-ak-2b8e6a0d",
    channel: "batch",
    application: "internal-batch",
    routeTag: "internal",
  },
  "legacy-mobile": {
    appKey: "gw-ak-5d7c9b2e",
    channel: "mobile",
    application: "legacy-mobile",
    routeTag: "legacy",
  },
  "expired-trial": {
    appKey: "gw-ak-0a4f8c6b",
    channel: "trial",
    application: "expired-trial",
    routeTag: "trial",
  },
};

const MODEL_META: Record<
  string,
  { name: string; provider: string; upstreamId: string }
> = {
  "qwen3-vl-plus": {
    name: "Qwen3-VL Plus",
    provider: "dashscope",
    upstreamId: "qwen-vl-plus-latest",
  },
  "qwen3.5-flash": {
    name: "Qwen3.5 Flash",
    provider: "dashscope",
    upstreamId: "qwen3.5-flash",
  },
  "gemini-3-flash": {
    name: "Gemini 3 Flash",
    provider: "gemini",
    upstreamId: "gemini-3-flash",
  },
  "gpt-5": { name: "GPT-5", provider: "openai", upstreamId: "gpt-5" },
  "text-embedding-3-large": {
    name: "Text Embedding 3 Large",
    provider: "openai",
    upstreamId: "text-embedding-3-large",
  },
};

const PROVIDER_META: Record<string, { name: string; endpoint: string }> = {
  dashscope: {
    name: "阿里云百炼",
    endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
  },
  openai: {
    name: "OpenAI",
    endpoint: "https://api.openai.com/v1/chat/completions",
  },
  gemini: {
    name: "Google Gemini",
    endpoint: "https://generativelanguage.googleapis.com/v1beta/models",
  },
};

const ROUTE_META: Record<
  string,
  {
    name: string;
    alias: string;
    strategyLabel: string;
    group: string;
    path: string;
    protocol: string;
  }
> = {
  "reasoning-default": {
    name: "推理模型默认路由",
    alias: "reasoning",
    strategyLabel: "WEIGHTED 权重",
    group: "premium",
    path: "/v1/chat/completions",
    protocol: "OpenAI / Chat Completions",
  },
  "general-chat": {
    name: "通用对话路由",
    alias: "general",
    strategyLabel: "FIXED 固定",
    group: "default",
    path: "/v1/chat/completions",
    protocol: "OpenAI / Chat Completions",
  },
  "coding-assistant": {
    name: "代码助手路由",
    alias: "coding",
    strategyLabel: "FIXED 固定",
    group: "default",
    path: "/v1/chat/completions",
    protocol: "OpenAI / Chat Completions",
  },
  "mobile-lite": {
    name: "移动端轻量路由",
    alias: "chat-lite",
    strategyLabel: "ROUND_ROBIN 轮询",
    group: "edge",
    path: "/v1/chat/completions",
    protocol: "OpenAI / Chat Completions",
  },
  "embeddings-std": {
    name: "标准向量路由",
    alias: "embedding",
    strategyLabel: "FIXED 固定",
    group: "batch",
    path: "/v1/embeddings",
    protocol: "OpenAI / Embeddings",
  },
  "long-context": {
    name: "长上下文路由",
    alias: "—",
    strategyLabel: "PRIORITY 优先级",
    group: "premium",
    path: "/v1/chat/completions",
    protocol: "OpenAI / Responses",
  },
  "failover-chat": {
    name: "通用兜底路由",
    alias: "—",
    strategyLabel: "WEIGHTED 权重",
    group: "default",
    path: "/v1/chat/completions",
    protocol: "OpenAI / Chat Completions",
  },
};

// ── 预计算辅助 ──

const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * 相对当前时间的 "YYYY-MM-DD HH:mm:ss" 时间戳：mock 时间随运行日漂移，
 * 保证时间范围默认区间（近 7 天）始终命中数据
 */
function timeAgo(minutes: number): string {
  const d = new Date(Date.now() - minutes * 60000);
  return (
    `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ` +
    `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
  );
}

/** Token 紧凑格式：2100 → 2.1K；1,200,000 → 1.2M */
function compactTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

/** 千分位，如 2,100 */
function thousands(n: number): string {
  return n.toLocaleString("en-US");
}

/** 决策链短路步（前序失败，后续未执行） */
function skippedStep(name: string): TraceStep {
  return {
    name,
    input: "—",
    decision: "—",
    output: "未执行",
    duration: "—",
    reason: "前序步骤失败，决策链短路",
  };
}

interface LogSeed {
  id: string;
  status: CallLogStatus;
  /** 距当前时间的分钟数（deriveLog 生成时间戳，随运行日漂移） */
  minutesAgo: number;
  latencyMs: number;
  userEmail: string;
  client: keyof typeof CLIENT_META;
  route: keyof typeof ROUTE_META;
  model: keyof typeof MODEL_META;
  input: number | null;
  output: number | null;
  cacheRead?: number;
  cacheWrite?: number;
  /** 供应侧成本（含 C 倍率）；未计费为 null */
  cost: number | null;
  /** 计费金额；未计费为 null */
  billing: number | null;
  httpStatus: string;
  upstreamStatus: string;
  ttftMs: number | null;
  retries?: number;
  clientIp: string;
  error?: CallLogError;
  /** 鉴权失败（决策链在 Request Context 短路） */
  authFailed?: boolean;
  pr?: PromptResponse;
}

const PR_MASKED: PromptResponse = {
  policy: "脱敏 + 抽样（10%）",
  policyNote:
    "平台策略：命中抽样的请求留存脱敏后的 Prompt/Response；Secret 与凭证绝不入库。",
  prompt:
    "System: 你是企业财报分析助手。\nUser: 帮我总结一下 <DOC_2026Q2.pdf> 的核心数据，联系人邮箱 <EMAIL>，电话 <PHONE>。",
  response:
    "好的。该财报核心数据摘要如下：营收 12.4 亿元（同比 +8.3%），净利润 1.9 亿元，毛利率 42.1%。\n[内容已按平台策略脱敏]",
};

const PR_NONE: PromptResponse = {
  policy: "不保存",
  policyNote: "平台策略：该路由不保存 Prompt/Response 内容。",
  prompt: null,
  response: null,
};

/** 路由追踪决策链：Request Context → Alias → Route → 路由组 → 策略 → Target → Actual Model */
function buildTrace(seed: LogSeed): TraceStep[] {
  const route = ROUTE_META[seed.route];
  const model = MODEL_META[seed.model];
  const provider = PROVIDER_META[model.provider];
  const client = CLIENT_META[seed.client];
  if (seed.authFailed) {
    return [
      {
        name: "Request Context",
        input: `POST ${route.path} · model=${seed.model}`,
        decision: "提取请求上下文并鉴权",
        output: `AppKey ${client.appKey} 校验失败`,
        duration: "0.4ms",
        reason: seed.error?.message ?? "鉴权失败，终止路由",
      },
      ...["Alias", "Route", "路由组", "策略", "Target", "Actual Model"].map(
        skippedStep,
      ),
    ];
  }
  const done = seed.status === "success";
  return [
    {
      name: "Request Context",
      input: `POST ${route.path} · model=${seed.model}`,
      decision: "提取请求上下文（model / channel / tags）",
      output: `alias=${route.alias} · channel=${client.channel} · app=${client.application}`,
      duration: "0.2ms",
      reason: "—",
    },
    {
      name: "Alias",
      input: route.alias,
      decision: "Alias 表匹配",
      output:
        route.alias === "—"
          ? `未声明别名，按路径直配 ${seed.route}`
          : `${route.alias} → ${seed.route}`,
      duration: "0.1ms",
      reason: route.alias === "—" ? "无别名声明，走路径直配" : "命中静态别名",
    },
    {
      name: "Route",
      input: seed.route,
      decision: "Route 状态检查",
      output: `${route.name}（启用）`,
      duration: "0.1ms",
      reason: "—",
    },
    {
      name: "路由组",
      input: seed.route,
      decision: "路由组归属解析",
      output: route.group,
      duration: "0.1ms",
      reason: "—",
    },
    {
      name: "策略",
      input: "启用模型池",
      decision: `${route.strategyLabel}调度`,
      output: `${seed.model}（${model.name}）`,
      duration: "0.3ms",
      reason: "健康检查通过，按策略命中",
    },
    {
      name: "Target",
      input: seed.model,
      decision: "供应商模型解析",
      output: `${provider.name} · ${model.upstreamId}`,
      duration: "0.2ms",
      reason: "应用路由行 C / M 倍率",
    },
    {
      name: "Actual Model",
      input: model.upstreamId,
      decision: "上游调用",
      output: done
        ? `${seed.upstreamStatus} · ${seed.latencyMs}ms`
        : `${seed.upstreamStatus}`,
      duration: done ? `${seed.latencyMs}ms` : `${seed.latencyMs}ms`,
      reason: done ? "—" : (seed.error?.message ?? "请求未完成"),
    },
  ];
}

function deriveLog(seed: LogSeed): CallLogRecord {
  const route = ROUTE_META[seed.route];
  const model = MODEL_META[seed.model];
  const provider = PROVIDER_META[model.provider];
  const client = CLIENT_META[seed.client];
  const input = seed.input;
  const output = seed.output;
  const total = (input ?? 0) + (output ?? 0);
  const margin =
    seed.billing != null && seed.cost != null ? seed.billing - seed.cost : null;
  const success = seed.status === "success";
  const time = timeAgo(seed.minutesAgo);
  return {
    id: seed.id,
    status: seed.status,
    statusLabel: CALL_LOG_STATUS_LABELS[seed.status],
    timeUtc: `${time} UTC`,
    timeShort: `${time.slice(5)} UTC`,
    latencyMs: seed.latencyMs,
    latencyText: `${seed.latencyMs}ms`,
    userEmail: seed.userEmail,
    clientCode: seed.client,
    clientName: seed.client,
    appKeyId: client.appKey,
    channel: client.channel,
    routeTag: client.routeTag,
    application: client.application,
    tagsText: `${client.channel} · ${client.routeTag}`,
    routeCode: seed.route,
    routeName: route.name,
    routeGroup: route.group,
    protocol: route.protocol,
    modelCode: seed.model,
    modelName: model.name,
    providerCode: model.provider,
    providerName: provider.name,
    inputTokens: input,
    outputTokens: output,
    cacheReadTokens: seed.cacheRead ?? 0,
    cacheWriteTokens: seed.cacheWrite ?? 0,
    usageText:
      input != null
        ? `${compactTokens(input)}/${output != null ? compactTokens(output) : "—"}`
        : "—",
    inputTokensText: input != null ? thousands(input) : "—",
    outputTokensText: output != null ? thousands(output) : "—",
    cacheReadText: thousands(seed.cacheRead ?? 0),
    cacheWriteText: thousands(seed.cacheWrite ?? 0),
    totalTokensText: input != null ? thousands(total) : "—",
    costUsd: seed.cost,
    billingUsd: seed.billing,
    marginUsd: margin,
    costText: seed.cost != null ? seed.cost.toFixed(4) : "—",
    billingText: seed.billing != null ? seed.billing.toFixed(4) : "—",
    marginText: margin != null && margin > 0 ? margin.toFixed(4) : "—",
    standardPriceText:
      seed.billing != null ? `${(seed.billing / 1.2).toFixed(4)}` : "—",
    pricingSnapshot:
      "pricing@v7（2026-09-01 生效）· C=1.0 · M=1.2 · 无时段倍率",
    httpStatusText: seed.httpStatus,
    ingressMethod: "POST",
    ingressPath: route.path,
    authResult: seed.authFailed
      ? `失败：AppKey ${client.appKey} 已过期`
      : "通过（AppKey 有效）",
    clientIp: seed.clientIp,
    alias: route.alias,
    strategyText: route.strategyLabel,
    upstreamEndpoint: provider.endpoint,
    upstreamModel: model.upstreamId,
    upstreamStatusText: seed.upstreamStatus,
    upstreamLatencyText: success ? `${Math.max(seed.latencyMs - 25, 10)}ms` : "—",
    ttftText: seed.ttftMs != null ? `${seed.ttftMs}ms` : "—",
    retries: seed.retries ?? 0,
    retriesText: String(seed.retries ?? 0),
    traceId: `trace-${seed.id.slice(4)}${seed.id.slice(0, 4)}`,
    error: seed.error ?? null,
    trace: buildTrace(seed),
    pr: seed.pr ?? PR_MASKED,
  };
}

const CALL_LOGS: CallLogRecord[] = [
  deriveLog({
    id: "req-9f2a1c4d",
    status: "success",
    minutesAgo: 20,
    latencyMs: 320,
    userEmail: "user@corp.com",
    client: "agent-app",
    route: "reasoning-default",
    model: "qwen3-vl-plus",
    input: 2100,
    output: 1800,
    cacheRead: 400,
    cost: 0.0126,
    billing: 0.0151,
    httpStatus: "200 OK",
    upstreamStatus: "200 OK",
    ttftMs: 96,
    clientIp: "10.20.3.14",
  }),
  deriveLog({
    id: "req-7b3e5f08",
    status: "success",
    minutesAgo: 105,
    latencyMs: 182,
    userEmail: "ops@corp.com",
    client: "internal-batch",
    route: "embeddings-std",
    model: "text-embedding-3-large",
    input: 520,
    output: 0,
    cost: 0.0001,
    billing: 0.0001,
    httpStatus: "200 OK",
    upstreamStatus: "200 OK",
    ttftMs: 60,
    clientIp: "10.20.8.22",
  }),
  deriveLog({
    id: "req-4c8d2a91",
    status: "error",
    minutesAgo: 125,
    latencyMs: 96,
    userEmail: "ops@corp.com",
    client: "internal-batch",
    route: "reasoning-default",
    model: "gpt-5",
    input: 520,
    output: null,
    cost: 0,
    billing: 0,
    httpStatus: "429 Too Many Requests",
    upstreamStatus: "429 Too Many Requests",
    ttftMs: null,
    retries: 2,
    clientIp: "10.20.8.22",
    error: {
      code: "UPSTREAM_429",
      type: "RateLimit",
      message: "上游限流：OpenAI RPM 超限，重试 2 次后仍返回 429",
    },
  }),
  deriveLog({
    id: "req-1e6f0b35",
    status: "success",
    minutesAgo: 720,
    latencyMs: 1240,
    userEmail: "dev@corp.com",
    client: "web-portal",
    route: "long-context",
    model: "qwen3.5-flash",
    input: 45200,
    output: 3100,
    cacheRead: 12800,
    cacheWrite: 3200,
    cost: 0.0904,
    billing: 0.1085,
    httpStatus: "200 OK",
    upstreamStatus: "200 OK",
    ttftMs: 410,
    clientIp: "10.20.1.7",
  }),
  deriveLog({
    id: "req-8a5c7d62",
    status: "unfinished",
    minutesAgo: 960,
    latencyMs: 30000,
    userEmail: "user@corp.com",
    client: "agent-app",
    route: "coding-assistant",
    model: "gpt-5",
    input: 3400,
    output: 512,
    cost: null,
    billing: null,
    httpStatus: "504 Gateway Timeout",
    upstreamStatus: "—（超时无响应）",
    ttftMs: null,
    clientIp: "10.20.3.14",
  }),
  deriveLog({
    id: "req-2d9b4e77",
    status: "success",
    minutesAgo: 1100,
    latencyMs: 256,
    userEmail: "mobile@corp.com",
    client: "legacy-mobile",
    route: "mobile-lite",
    model: "gemini-3-flash",
    input: 890,
    output: 640,
    cost: 0.0004,
    billing: 0.0005,
    httpStatus: "200 OK",
    upstreamStatus: "200 OK",
    ttftMs: 88,
    clientIp: "10.20.5.31",
  }),
  deriveLog({
    id: "req-6f1a8c20",
    status: "cancelled",
    minutesAgo: 1350,
    latencyMs: 840,
    userEmail: "user@corp.com",
    client: "agent-app",
    route: "general-chat",
    model: "qwen3.5-flash",
    input: 1200,
    output: null,
    cost: null,
    billing: null,
    httpStatus: "499 Client Closed Request",
    upstreamStatus: "—（已取消）",
    ttftMs: 120,
    clientIp: "10.20.3.14",
  }),
  deriveLog({
    id: "req-3e7c9a54",
    status: "success",
    minutesAgo: 2300,
    latencyMs: 410,
    userEmail: "coder@corp.com",
    client: "web-portal",
    route: "coding-assistant",
    model: "gpt-5",
    input: 5600,
    output: 2200,
    cacheRead: 800,
    cost: 0.0195,
    billing: 0.0234,
    httpStatus: "200 OK",
    upstreamStatus: "200 OK",
    ttftMs: 150,
    clientIp: "10.20.1.9",
  }),
  deriveLog({
    id: "req-5b0d6f18",
    status: "error",
    minutesAgo: 3000,
    latencyMs: 45,
    userEmail: "trial@corp.com",
    client: "expired-trial",
    route: "general-chat",
    model: "qwen3.5-flash",
    input: 300,
    output: null,
    cost: 0,
    billing: 0,
    httpStatus: "401 Unauthorized",
    upstreamStatus: "—（未发起上游调用）",
    ttftMs: null,
    clientIp: "10.20.9.40",
    authFailed: true,
    error: {
      code: "AUTH_EXPIRED",
      type: "Auth",
      message: "鉴权失败：AppKey gw-ak-0a4f8c6b 已于 2026-08-31 到期",
    },
  }),
  deriveLog({
    id: "req-0c4e2b89",
    status: "success",
    minutesAgo: 3900,
    latencyMs: 198,
    userEmail: "batch@corp.com",
    client: "internal-batch",
    route: "general-chat",
    model: "qwen3.5-flash",
    input: 1800,
    output: 950,
    cost: 0.0007,
    billing: 0.0008,
    httpStatus: "200 OK",
    upstreamStatus: "200 OK",
    ttftMs: 72,
    clientIp: "10.20.8.25",
    pr: PR_NONE,
  }),
  deriveLog({
    id: "req-a3f5d906",
    status: "other",
    minutesAgo: 5300,
    latencyMs: 12,
    userEmail: "ops@corp.com",
    client: "web-portal",
    route: "failover-chat",
    model: "qwen3.5-flash",
    input: 240,
    output: null,
    cost: null,
    billing: null,
    httpStatus: "520 Unknown",
    upstreamStatus: "—",
    ttftMs: null,
    clientIp: "10.20.1.12",
  }),
  deriveLog({
    id: "req-d8b1e473",
    status: "success",
    minutesAgo: 7200,
    latencyMs: 365,
    userEmail: "dev@corp.com",
    client: "agent-app",
    route: "reasoning-default",
    model: "gpt-5",
    input: 2900,
    output: 1600,
    cost: 0.0113,
    billing: 0.0136,
    httpStatus: "200 OK",
    upstreamStatus: "200 OK",
    ttftMs: 132,
    clientIp: "10.20.3.18",
  }),
];

// ── 筛选项（从 mock 记录归集）──

export const LOG_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "success", label: "成功" },
  { value: "error", label: "错误" },
  { value: "unfinished", label: "未完成" },
  { value: "cancelled", label: "已取消" },
  { value: "other", label: "其他" },
];

function uniqueOptions(
  records: CallLogRecord[],
  pick: (r: CallLogRecord) => { value: string; label: string },
): { value: string; label: string }[] {
  const seen = new Map<string, string>();
  for (const r of records) {
    const { value, label } = pick(r);
    if (!seen.has(value)) seen.set(value, label);
  }
  return [
    { value: "all", label: "全部" },
    ...[...seen.entries()].map(([value, label]) => ({ value, label })),
  ];
}

export const LOG_MODEL_OPTIONS = uniqueOptions(CALL_LOGS, (r) => ({
  value: r.modelCode,
  label: r.modelName,
}));

export const LOG_PROVIDER_OPTIONS = uniqueOptions(CALL_LOGS, (r) => ({
  value: r.providerCode,
  label: r.providerName,
}));

export const LOG_PROTOCOL_OPTIONS = uniqueOptions(CALL_LOGS, (r) => ({
  value: r.protocol,
  label: r.protocol,
}));

export const LOG_ROUTE_GROUP_OPTIONS = uniqueOptions(CALL_LOGS, (r) => ({
  value: r.routeGroup,
  label: r.routeGroup,
}));

/** callLog.list：时间区间（按 UTC 日期含端点）+ 状态/模型/供应商/协议/路由组
 *  精确 + Email/AppKey 模糊，按时间降序 */
export function queryCallLogs(
  params: CallLogListParams = {},
): CallLogListResult {
  const email = (params.email ?? "").trim().toLowerCase();
  const appKey = (params.appKey ?? "").trim().toLowerCase();
  const items = CALL_LOGS.filter(
    (r) =>
      (!params.start || r.timeUtc.slice(0, 10) >= params.start) &&
      (!params.end || r.timeUtc.slice(0, 10) <= params.end) &&
      (!params.status || params.status === "all" || r.status === params.status) &&
      (!params.model || params.model === "all" || r.modelCode === params.model) &&
      (!params.provider ||
        params.provider === "all" ||
        r.providerCode === params.provider) &&
      (!params.protocol ||
        params.protocol === "all" ||
        r.protocol === params.protocol) &&
      (!params.routeGroup ||
        params.routeGroup === "all" ||
        r.routeGroup === params.routeGroup) &&
      (email === "" || r.userEmail.toLowerCase().includes(email)) &&
      (appKey === "" || r.appKeyId.toLowerCase().includes(appKey)),
  ).sort((a, b) => b.timeUtc.localeCompare(a.timeUtc));
  return {
    items,
    total: CALL_LOGS.length,
    filteredText: items.length.toLocaleString("en-US"),
  };
}

/** callLog.detail：按请求 ID 取详情；未命中返回 undefined（页面做空态） */
export function getCallLog(id: string): CallLogRecord | undefined {
  return CALL_LOGS.find((r) => r.id === id);
}

/** 全量请求 ID（静态导出 generateStaticParams 用） */
export const CALL_LOG_IDS: string[] = CALL_LOGS.map((r) => r.id);
