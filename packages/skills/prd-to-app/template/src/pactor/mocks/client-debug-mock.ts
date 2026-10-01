/**
 * 客户端调试（调试台）演示数据与调用模拟（MVP mock，静态页面）。
 * 对齐 PRD《调试台/01-客户端调试》：以指定客户端走 AppKey → Route → Runtime
 * 完整业务链路，返回请求/返回报文与运行摘要（状态码、延迟、TTFT、命中路由组、
 * Token 用量、配额扣减预览、限流检查结果）。
 * 身份选项直接复用访问治理 mock（clients-mock / routes-mock）；接入真实
 * Gateway 后替换为 http 调用，组件 props 契约不变。
 * 安全约束（PRD 交互规则 4）：不展示、不持久化 AppKey Secret / Provider Credential 明文。
 */

import { getClient, queryClients } from "./clients-mock";
import { getRoute } from "./routes-mock";

export interface DebugIdentity {
  clientCode: string;
  appKeyId: string;
  routeCode: string;
  channel: string;
  routeTag: string;
  user: string;
}

/** 一轮调用的完整执行明细（右侧「执行明细」面板数据源） */
export interface ClientDebugRound {
  id: string;
  /** 第 N 轮（从 1 起） */
  seq: number;
  /** 实际发往 Gateway 的 HTTP Body（pretty JSON 文本） */
  requestJson: string;
  /** 请求报文压缩形态（「压缩」切换） */
  requestCompact: string;
  /** Gateway 返回的完整 Response Body（流式合并后的最终 JSON，pretty 文本） */
  responseJson: string;
  /** 返回报文压缩形态 */
  responseCompact: string;
  status: number;
  latencyMs: number;
  ttftMs: number;
  /** 命中路由组（RouteTag 命中；未指定时取路由首个标签） */
  routeGroup: string;
  /** 命中 Target（模型 · 供应商摘要） */
  target: string;
  tokensIn: number;
  tokensOut: number;
  /** 配额扣减预览文案 */
  quotaPreview: string;
  /** 限流检查结果文案 */
  rateLimitResult: string;
  requestId: string;
  /** assistant 回复全文（流式模拟的目标文本） */
  reply: string;
}

/** 客户端选项：仅启用中的客户端可调试 */
export const DEBUG_CLIENT_OPTIONS: { value: string; label: string }[] =
  queryClients({ status: "enabled" }).items.map((c) => ({
    value: c.code,
    label: `${c.name}（${c.code}）`,
  }));

/** 客户端下的 AppKey 选项（mock 每客户端一把；Secret 不持久化，仅会话内使用） */
export function appKeyOptionsOf(clientCode: string) {
  const c = getClient(clientCode);
  return c ? [{ value: c.appKeyId, label: c.appKeyId }] : [];
}

/** 客户端已授权路由选项 */
export function routeOptionsOf(clientCode: string) {
  const c = getClient(clientCode);
  return (c?.authRoutes ?? []).map((r) => ({
    value: r.code,
    label: `${r.name}（${r.alias}）`,
  }));
}

/** Channel 调用上下文选项 */
export const CHANNEL_OPTIONS = [
  { value: "WEB", label: "WEB" },
  { value: "APP", label: "APP" },
  { value: "SERVER", label: "SERVER" },
];

/** RouteTag 选项：所选路由的标签（参与路由策略匹配，可为空） */
export function routeTagOptionsOf(routeCode: string) {
  const r = getRoute(routeCode);
  return (r?.tags ?? []).map((t) => ({ value: t, label: t }));
}

function hexId(prefix: string) {
  return `${prefix}-${Math.random().toString(16).slice(2, 10).padEnd(8, "0")}`;
}

/** 估算 token（演示口径：按字符数近似） */
function roughTokens(text: string) {
  return Math.max(8, Math.round(text.length / 2));
}

/**
 * 模拟一次完整链路调用：鉴权 → 路由命中 → 配额/限流检查 → 上游生成。
 * 返回该轮的请求/返回报文与运行摘要；reply 供左侧流式展示。
 */
export function simulateClientCall(
  identity: DebugIdentity,
  userText: string,
  seq: number,
): ClientDebugRound {
  const client = getClient(identity.clientCode);
  const route = getRoute(identity.routeCode);
  const target = route?.models.find((m) => m.status === "enabled") ??
    route?.models[0];
  const routeGroup =
    identity.routeTag || route?.tags[0] || route?.name || "default";
  const tokensIn = roughTokens(userText) + 12;
  const reply = [
    `已收到你的请求（via ${client?.name ?? identity.clientCode} → ${route?.name ?? identity.routeCode}）。`,
    "",
    `要点如下：`,
    `1. 鉴权通过：AppKey ${identity.appKeyId} 有效；`,
    `2. 路由命中：路由组 ${routeGroup}，Target ${target?.modelName ?? "—"}；`,
    `3. 配额与限流检查通过，本次调用已计入用量。`,
    "",
    `你刚才说的是：「${userText.length > 40 ? `${userText.slice(0, 40)}…` : userText}」`,
  ].join("\n");
  const tokensOut = roughTokens(reply);
  const ttftMs = 120 + Math.floor(Math.random() * 120);
  const latencyMs = ttftMs + 100 + Math.floor(Math.random() * 200);
  const created = Math.floor(Date.now() / 1000);

  const requestObj = {
    model: route?.alias || route?.name || identity.routeCode,
    messages: [{ role: "user", content: userText }],
    stream: true,
    user: identity.user || undefined,
    metadata: {
      app_key_id: identity.appKeyId,
      channel: identity.channel || undefined,
      route_tag: identity.routeTag || undefined,
    },
  };

  const responseObj = {
    id: `chatcmpl-${hexId("").slice(1)}`,
    object: "chat.completion",
    created,
    model: route?.alias || route?.name || identity.routeCode,
    choices: [
      {
        index: 0,
        message: { role: "assistant", content: reply },
        finish_reason: "stop",
      },
    ],
    usage: {
      prompt_tokens: tokensIn,
      completion_tokens: tokensOut,
      total_tokens: tokensIn + tokensOut,
    },
  };

  const quota = client?.quotas.find((q) => q.status === "enabled");
  const rate = client?.rateLimits.find((r) => r.status === "enabled");

  return {
    id: hexId("round"),
    seq,
    requestJson: JSON.stringify(requestObj, null, 2),
    requestCompact: JSON.stringify(requestObj),
    responseJson: JSON.stringify(responseObj, null, 2),
    responseCompact: JSON.stringify(responseObj),
    status: 200,
    latencyMs,
    ttftMs,
    routeGroup,
    target: target
      ? `${target.modelName} · ${target.providerSummary}`
      : "—",
    tokensIn,
    tokensOut,
    quotaPreview: quota
      ? `${quota.quotaTypeLabel}「${quota.name}」扣减 ${tokensIn + tokensOut} ${quota.metricLabel}（${quota.modeLabel}）`
      : "未配置配额策略",
    rateLimitResult: rate
      ? `通过（${rate.limitTypeLabel} 上限 ${rate.limitText}${rate.burst ? `，Burst ${rate.burst}` : ""}）`
      : "未配置限流策略",
    requestId: hexId("req"),
    reply,
  };
}
