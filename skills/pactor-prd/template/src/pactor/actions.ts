/**
 * 页面级自定义动作（调试台等场景的示例实现
 * model-debug-actions.ts，合并为单文件），经 SitemapApp 的 `actions` prop
 * 全局注册。
 * DSL 表达式不支持数组操作 / 定时器 / 剪贴板，故对话状态变更、流式模拟、
 * 身份联动选项计算收敛在此处；handler 经 ctx.context.state 直接读写页面
 * StateStore，写入即触发 DSL 树重渲染（与内置 setState 动作同一通道）。
 *
 * ActionHandler 类型见 @pactor-app/runtime；此处按结构化子集声明参数类型
 * （handler 只需已求值的 action.params 与 state 读写），赋值给 SitemapApp
 * actions 选项时由 TS 结构化检查兼容性（1.22.0 签名：
 * (action: ActionConfig, ctx: ActionContext) => ActionResult | Promise<…>）。
 */

import type { ActionHandler } from "@pactor-app/runtime";

import {
  appKeyOptionsOf,
  routeOptionsOf,
  routeTagOptionsOf,
  simulateClientCall,
  type ClientDebugRound,
} from "./mocks/client-debug-mock";
import { getProvider } from "./mocks/providers-mock";
import {
  capabilitiesOf,
  modelOptionsOf,
  paramDefaultsOf,
  simulateModelCall,
  supportsReasoning,
  testConnection,
} from "./mocks/model-debug-mock";
import { streamText, type DebugChatMessage } from "./components/debug-chat";

/** SitemapApp actions 选项 handler 的结构化最小契约（ActionHandler 子集） */
export interface DebugActionContext {
  context: {
    state: {
      get: (path: string) => unknown;
      set: (patch: Record<string, unknown>) => void;
    };
  };
}

export type DebugAction = (
  action: { params?: Record<string, unknown> },
  ctx: DebugActionContext,
) => { ok: boolean };

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function num(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}

export function createClientDebugActions(): Record<string, DebugAction> {
  /** 流式定时器的停止闭包（停止生成 / 清空对话 / 下一次发送前取消） */
  let stopCurrent: (() => void) | null = null;

  /** 流式收尾：assistant 消息落定 + 轮次写入 selectedRound（右侧返回报文此时可见） */
  const finalize = (
    ctx: DebugActionContext,
    round: ClientDebugRound,
    assistantId: string,
    finalText: string,
    stopped: boolean,
  ) => {
    const messages = (
      (ctx.context.state.get("messages") as DebugChatMessage[]) ?? []
    ).map((m) =>
      m.id === assistantId
        ? {
            ...m,
            content: finalText,
            streaming: false,
            meta: `Token ${round.tokensIn}/${round.tokensOut} · TTFT ${round.ttftMs}ms · 延迟 ${round.latencyMs}ms${stopped ? " · 已停止" : ""}`,
          }
        : m,
    );
    ctx.context.state.set({
      messages,
      selectedRound: round,
      selectedRoundId: round.id,
      streaming: false,
    });
    stopCurrent = null;
  };

  return {
    /** 切换客户端：联动 AppKey（取该客户端唯一一把）、授权路由与上下文 */
    "clientDebug.selectClient": (action, ctx) => {
      const clientCode = str(action.params?.clientCode);
      const appKeys = appKeyOptionsOf(clientCode);
      ctx.context.state.set({
        clientCode,
        appKeyOptions: appKeys,
        appKeyId: appKeys[0]?.value ?? "",
        routeOptions: routeOptionsOf(clientCode),
        routeCode: "",
        tagOptions: [],
        routeTag: "",
      });
      return { ok: true };
    },

    /** 切换授权路由：联动 RouteTag 选项 */
    "clientDebug.selectRoute": (action, ctx) => {
      const routeCode = str(action.params?.routeCode);
      ctx.context.state.set({
        routeCode,
        tagOptions: routeTagOptionsOf(routeCode),
        routeTag: "",
      });
      return { ok: true };
    },

    /** 发送：模拟完整链路调用，流式渲染 assistant 回复 */
    "clientDebug.send": (action, ctx) => {
      const state = ctx.context.state;
      if (state.get("streaming")) return { ok: false };
      const clientCode = str(state.get("clientCode"));
      const appKeyId = str(state.get("appKeyId"));
      const routeCode = str(state.get("routeCode"));
      const text = str(action.params?.text);
      if (!clientCode || !appKeyId || !routeCode || !text.trim()) {
        return { ok: false };
      }

      const roundCount = Number(state.get("roundCount") ?? 0);
      const round = simulateClientCall(
        {
          clientCode,
          appKeyId,
          routeCode,
          channel: str(state.get("channel")),
          routeTag: str(state.get("routeTag")),
          user: str(state.get("user")),
        },
        text,
        roundCount + 1,
      );
      const assistantId = `${round.id}-a`;
      const messages: DebugChatMessage[] = [
        ...((state.get("messages") as DebugChatMessage[]) ?? []),
        { id: `${round.id}-u`, role: "user", content: text, round },
        {
          id: assistantId,
          role: "assistant",
          content: "",
          round,
          streaming: true,
        },
      ];
      state.set({
        messages,
        streaming: true,
        roundCount: roundCount + 1,
        // 流结束后再写入 selectedRound（PRD：返回报文在流结束后刷新）
        selectedRound: null,
        selectedRoundId: round.id,
        tab: "request",
      });

      let latest = "";
      const cancel = streamText(
        round.reply,
        (chunk) => {
          latest = chunk;
          const cur =
            (ctx.context.state.get("messages") as DebugChatMessage[]) ?? [];
          ctx.context.state.set({
            messages: cur.map((m) =>
              m.id === assistantId ? { ...m, content: chunk } : m,
            ),
          });
        },
        () => finalize(ctx, round, assistantId, round.reply, false),
      );
      stopCurrent = () => {
        cancel();
        finalize(ctx, round, assistantId, latest || round.reply.slice(0, 12), true);
      };
      return { ok: true };
    },

    /** 停止生成：取消定时器并按当前片段收尾 */
    "clientDebug.stop": (_action, ctx) => {
      stopCurrent?.();
      if (ctx.context.state.get("streaming")) {
        ctx.context.state.set({ streaming: false });
      }
      return { ok: true };
    },

    /** 清空对话：清空本地会话（不影响已落库调用日志） */
    "clientDebug.clear": (_action, ctx) => {
      stopCurrent?.();
      stopCurrent = null;
      ctx.context.state.set({
        messages: [],
        selectedRound: null,
        selectedRoundId: "",
        roundCount: 0,
        streaming: false,
      });
      return { ok: true };
    },

    /** 复制报文到剪贴板（DSL 无剪贴板能力，经动作桥接） */
    "clientDebug.copy": (action) => {
      const text = action.params?.text;
      if (typeof text === "string" && text) {
        void navigator.clipboard?.writeText(text);
      }
      return { ok: true };
    },
  };
}

export function createModelDebugActions(): Record<string, DebugAction> {
  let stopCurrent: (() => void) | null = null;
  let seq = 0;

  /** assistant 消息收尾（流式完成 / 停止生成共用） */
  const finalize = (
    ctx: DebugActionContext,
    id: string,
    patch: Partial<DebugChatMessage>,
  ) => {
    const messages = (
      (ctx.context.state.get("messages") as DebugChatMessage[]) ?? []
    ).map((m) => (m.id === id ? { ...m, ...patch } : m));
    ctx.context.state.set({ messages, streaming: false });
    stopCurrent = null;
  };

  return {
    /** 切换供应商：联动刷新模型列表并清空已选模型与连接状态 */
    "modelDebug.selectProvider": (action, ctx) => {
      const providerCode = str(action.params?.providerCode);
      ctx.context.state.set({
        providerCode,
        modelOptions: modelOptionsOf(providerCode),
        modelCode: "",
        conn: null,
        showReasoning: false,
        canStream: true,
        canTools: false,
        temperature: undefined,
        topP: undefined,
        maxTokens: undefined,
        streamingOn: true,
        toolsOn: false,
      });
      return { ok: true };
    },

    /** 切换模型：回填默认参数 + 按 Capability 计算参数显隐/开关可用性 */
    "modelDebug.selectModel": (action, ctx) => {
      const modelCode = str(action.params?.modelCode);
      const caps = capabilitiesOf(modelCode);
      const defaults = paramDefaultsOf(modelCode);
      ctx.context.state.set({
        modelCode,
        conn: null,
        temperature: defaults.temperature,
        topP: defaults.topP,
        maxTokens: defaults.maxTokens,
        reasoningEffort: defaults.reasoningEffort ?? "medium",
        showReasoning: supportsReasoning(modelCode),
        canStream: caps.length === 0 || caps.includes("Streaming"),
        canTools: caps.includes("Tool Calling"),
        streamingOn: caps.includes("Streaming"),
        toolsOn: false,
      });
      return { ok: true };
    },

    /** 连接测试：不发对话，仅探测凭证与 Endpoint 可达性（模拟 600ms 探测延迟） */
    "modelDebug.testConnection": (_action, ctx) => {
      const state = ctx.context.state;
      const providerCode = str(state.get("providerCode"));
      if (!providerCode || !str(state.get("modelCode")) || state.get("testing")) {
        return { ok: false };
      }
      state.set({ testing: true, conn: null });
      setTimeout(() => {
        ctx.context.state.set({
          conn: testConnection(providerCode),
          testing: false,
        });
      }, 600);
      return { ok: true };
    },

    /** 发送：直连供应商模型（不经过 AppKey / Route 业务链路） */
    "modelDebug.send": (action, ctx) => {
      const state = ctx.context.state;
      if (state.get("streaming")) return { ok: false };
      const providerCode = str(state.get("providerCode"));
      const modelCode = str(state.get("modelCode"));
      const text = str(action.params?.text);
      if (!providerCode || !modelCode || !text.trim()) return { ok: false };

      seq += 1;
      const msgId = `m-${seq}`;
      const messages = (state.get("messages") as DebugChatMessage[]) ?? [];
      const userMsg: DebugChatMessage = {
        id: `${msgId}-u`,
        role: "user",
        content: text,
      };

      // 上游/网关失败（凭证未配置）：对话区以错误消息展示摘要（PRD 交互规则 3）
      const provider = getProvider(providerCode);
      if (provider && provider.keyStatus !== "configured") {
        state.set({
          messages: [
            ...messages,
            userMsg,
            {
              id: `${msgId}-e`,
              role: "error",
              content: `请求失败：Provider「${provider.displayName}」${
                provider.keyStatus === "pending"
                  ? "API Key 待配置"
                  : "未配置 API Key"
              }，请先在 Provider 页完成凭证配置。`,
            },
          ],
        });
        return { ok: true };
      }

      const streamingOn =
        state.get("streamingOn") === true && state.get("canStream") !== false;
      const result = simulateModelCall(
        providerCode,
        modelCode,
        str(state.get("systemPrompt")),
        {
          temperature: num(state.get("temperature")),
          topP: num(state.get("topP")),
          maxTokens: num(state.get("maxTokens")),
          reasoningEffort:
            state.get("showReasoning") === true
              ? str(state.get("reasoningEffort"))
              : undefined,
          streaming: streamingOn,
          tools:
            state.get("toolsOn") === true && state.get("canTools") === true,
        },
        text,
      );
      const meta = `Token ${result.tokensIn}/${result.tokensOut} · TTFT ${result.ttftMs}ms · 延迟 ${result.latencyMs}ms · 上游 ${result.status}`;

      // 非流式：直接落定完整回复
      if (!streamingOn) {
        state.set({
          messages: [
            ...messages,
            userMsg,
            {
              id: msgId,
              role: "assistant",
              content: result.reply,
              meta,
            },
          ],
        });
        return { ok: true };
      }

      // 流式：边收边渲染；可停止生成
      state.set({
        messages: [
          ...messages,
          userMsg,
          { id: msgId, role: "assistant", content: "", streaming: true },
        ],
        streaming: true,
      });
      let latest = "";
      const cancel = streamText(
        result.reply,
        (chunk) => {
          latest = chunk;
          const cur =
            (ctx.context.state.get("messages") as DebugChatMessage[]) ?? [];
          ctx.context.state.set({
            messages: cur.map((m) =>
              m.id === msgId ? { ...m, content: chunk } : m,
            ),
          });
        },
        () => finalize(ctx, msgId, { streaming: false, meta }),
      );
      stopCurrent = () => {
        cancel();
        finalize(ctx, msgId, {
          content: latest || result.reply.slice(0, 12),
          streaming: false,
          meta: `${meta} · 已停止`,
        });
      };
      return { ok: true };
    },

    /** 停止生成 */
    "modelDebug.stop": (_action, ctx) => {
      stopCurrent?.();
      if (ctx.context.state.get("streaming")) {
        ctx.context.state.set({ streaming: false });
      }
      return { ok: true };
    },

    /** 清空对话（不影响服务端） */
    "modelDebug.clear": (_action, ctx) => {
      stopCurrent?.();
      stopCurrent = null;
      ctx.context.state.set({ messages: [], streaming: false });
      return { ok: true };
    },
  };
}

/**
 * SitemapApp 全局动作注册表（clientDebug.* / modelDebug.*）。
 * 单例：两组动作名不相交；同一时刻 PageOutlet 只挂载一个页面，
 * 各页面的流式停止闭包互不干扰。
 */
export const pactorActions: Record<string, ActionHandler> = {
  ...createClientDebugActions(),
  ...createModelDebugActions(),
};
