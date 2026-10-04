/**
 * 模型调试（调试台）演示数据与调用模拟（MVP mock，静态页面）。
 * 对齐 PRD《调试台/02-模型调试》：直连供应商模型（Provider → Model，
 * 不经过 AppKey / Route 业务链路），验证连通性与效果；
 * 参数按 Model Capability 动态显示（reasoning_effort 仅推理模型，
 * Streaming / Tools 按能力启用）。
 * 供应商与模型选项复用模型资产 mock（providers-mock / models-mock）；
 * 接入真实后端后替换为直连调用，组件 props 契约不变。
 * 安全约束：不展示 Provider Credential 明文（连接测试仅返回可达性结论）。
 */

import { PROVIDER_CODES, getProvider } from "./providers-mock";
import { getModel } from "./models-mock";

/** 供应商选项：启用中的 Provider（直连调试不校验密钥状态，连接测试再探） */
export const DEBUG_PROVIDER_OPTIONS: { value: string; label: string }[] =
  PROVIDER_CODES.map((code) => getProvider(code))
    .filter((p) => p && p.status === "enabled")
    .map((p) => ({ value: p!.code, label: p!.displayName || p!.name }));

/** 供应商下已接入（ONLINE）的模型选项；切换供应商时联动刷新 */
export function modelOptionsOf(providerCode: string) {
  const p = getProvider(providerCode);
  return (p?.models ?? [])
    .filter((m) => m.status === "ONLINE")
    .map((m) => ({ value: m.code, label: `${m.name}（${m.providerModelId}）` }));
}

/** 模型能力（来自 Model 默认参数 Tab 的 capabilities） */
export function capabilitiesOf(modelCode: string): string[] {
  return getModel(modelCode)?.params.capabilities ?? [];
}

/** 是否推理模型（reasoning_effort 参数按此显示；mock 以默认参数非「—」判定） */
export function supportsReasoning(modelCode: string): boolean {
  const effort = getModel(modelCode)?.params.reasoningEffort;
  return !!effort && effort !== "—";
}

function numOrUndef(text: string | undefined): number | undefined {
  const n = Number(text);
  return text && text !== "—" && Number.isFinite(n) ? n : undefined;
}

/** 模型默认参数（编辑页「默认参数」同源），切换模型后回填右侧参数区 */
export function paramDefaultsOf(modelCode: string): {
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  reasoningEffort?: string;
} {
  const params = getModel(modelCode)?.params;
  return {
    temperature: numOrUndef(params?.temperature),
    topP: numOrUndef(params?.topP),
    maxTokens: numOrUndef(params?.maxTokens),
    reasoningEffort:
      params?.reasoningEffort && params.reasoningEffort !== "—"
        ? params.reasoningEffort
        : "medium",
  };
}

export const REASONING_EFFORT_OPTIONS = [
  { value: "low", label: "low" },
  { value: "medium", label: "medium" },
  { value: "high", label: "high" },
];

export interface ConnectionTestResult {
  ok: boolean;
  latencyMs: number;
  detail: string;
}

/** 连接测试：不发对话，仅探测凭证与 Endpoint 可达性（mock 按密钥状态判定） */
export function testConnection(providerCode: string): ConnectionTestResult {
  const p = getProvider(providerCode);
  const latencyMs = 80 + Math.floor(Math.random() * 220);
  if (!p) return { ok: false, latencyMs, detail: "供应商不存在" };
  if (p.keyStatus !== "configured") {
    return {
      ok: false,
      latencyMs,
      detail: p.keyStatus === "pending" ? "API Key 待配置" : "未配置 API Key",
    };
  }
  return { ok: true, latencyMs, detail: `${p.baseUrl} 可达` };
}

export interface ModelDebugParams {
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  reasoningEffort?: string;
  streaming: boolean;
  tools: boolean;
}

/** 一次直连调用的结果（回复全文 + assistant 消息下方紧凑摘要字段） */
export interface ModelDebugResult {
  reply: string;
  tokensIn: number;
  tokensOut: number;
  ttftMs: number;
  latencyMs: number;
  status: number;
  requestId: string;
}

function roughTokens(text: string) {
  return Math.max(8, Math.round(text.length / 2));
}

/** 模拟直连上游生成（流式时由调用方按 reply 逐段渲染） */
export function simulateModelCall(
  providerCode: string,
  modelCode: string,
  systemPrompt: string,
  params: ModelDebugParams,
  userText: string,
): ModelDebugResult {
  const p = getProvider(providerCode);
  const m = getModel(modelCode);
  const reply = [
    `我是 ${m?.name ?? modelCode}（由 ${p?.displayName ?? providerCode} 提供）。`,
    "",
    `你刚才说的是：「${userText.length > 40 ? `${userText.slice(0, 40)}…` : userText}」`,
    "",
    `本次调用参数：temperature=${params.temperature ?? "默认"}，top_p=${params.topP ?? "默认"}，max_tokens=${params.maxTokens ?? "默认"}${params.reasoningEffort ? `，reasoning_effort=${params.reasoningEffort}` : ""}，stream=${params.streaming ? "true" : "false"}${params.tools ? "，已启用 Tools" : ""}${systemPrompt ? "，已应用 System Prompt" : ""}。`,
  ].join("\n");
  const tokensIn = roughTokens(systemPrompt + userText) + 9;
  const tokensOut = roughTokens(reply);
  const ttftMs = 100 + Math.floor(Math.random() * 150);
  return {
    reply,
    tokensIn,
    tokensOut,
    ttftMs,
    latencyMs: ttftMs + 120 + Math.floor(Math.random() * 260),
    status: 200,
    requestId: `req-${Math.random().toString(16).slice(2, 10).padEnd(8, "0")}`,
  };
}
