/**
 * AiThemeDrawer（spec: theme-studio-ai-generate）：右侧 50% 宽滑层，
 * 聊天区整体复用 @pactor-app/chat 的 ChatView（消息气泡 / 流式渲染 /
 * dsl 卡片 / Composer），本地只提供：
 * - transport：AiChatFlow 引导状态机 + SSE 流式生成（ai/chat-flow.ts）
 * - capabilities：ai-answer（选项回灌）/ ai-apply / ai-download / ai-regenerate
 *
 * 滑层始终挂载、以 transform 隐藏——关闭不打断生成、重开恢复对话。
 */
import { useRef, useSyncExternalStore, type CSSProperties } from "react";

import {
  ChatView,
  ConversationStore,
  createSafeRegistry,
  runChatTurn,
  type CapabilityHandler,
} from "@pactor-app/chat";
import { Registry } from "@pactor-app/core";
import { createComponentRegistry } from "@pactor-app/ui/components";

import { AiChatFlow, REGENERATE_INPUT } from "../ai/chat-flow";
import { downloadText } from "../download";
import { composeSkinCss } from "../skin";
import {
  applyAiTheme,
  getStudioState,
  setAiDrawerOpen,
  subscribeStudio,
} from "../store";

const GREETING = "你好！描述一下你想要的主题，我来帮你生成皮肤 CSS。";

/** 组装一次性的聊天装配（store + flow + capabilities），模块内单例化 */
interface AiChatAssembly {
  store: ConversationStore;
  flow: AiChatFlow;
  capabilities: Registry<CapabilityHandler>;
  safeRegistry: Registry<unknown>;
}

function createAssembly(): AiChatAssembly {
  const store = new ConversationStore();
  const flow = new AiChatFlow();
  const capabilities = new Registry<CapabilityHandler>("ai-theme");

  capabilities.register("ai-answer", {
    execute: (params) => {
      // 选项点击 = 用户作答，回灌一轮 user turn
      void runChatTurn(store, flow.transport, {
        text: String(params.value ?? ""),
      });
    },
  });
  capabilities.register("ai-apply", {
    execute: () => {
      if (flow.lastParsed) {
        applyAiTheme(flow.lastParsed.light, flow.lastParsed.dark);
      }
    },
  });
  capabilities.register("ai-download", {
    execute: () => {
      if (flow.lastParsed) {
        downloadText(
          "pactor-theme.css",
          composeSkinCss(null, flow.lastParsed.light, flow.lastParsed.dark),
        );
      }
    },
  });
  capabilities.register("ai-regenerate", {
    execute: () => {
      void runChatTurn(
        store,
        flow.transport,
        { text: REGENERATE_INPUT },
        { skipUserMessage: true },
      );
    },
  });

  return {
    store,
    flow,
    capabilities,
    safeRegistry: createSafeRegistry(createComponentRegistry(), [
      "Flex",
      "Button",
      "Text",
      "Badge",
    ]),
  };
}

export function AiThemeDrawer({ style }: { style?: CSSProperties }) {
  const { aiDrawerOpen } = useSyncExternalStore(
    subscribeStudio,
    getStudioState,
  );
  // 装配只建一次（含对话 store），抽屉显隐不丢对话
  const assemblyRef = useRef<AiChatAssembly | null>(null);
  if (!assemblyRef.current) {
    assemblyRef.current = createAssembly();
  }
  const { store, flow, capabilities, safeRegistry } = assemblyRef.current;

  return (
    <>
      {/* 遮罩 */}
      <div
        onClick={() => setAiDrawerOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "var(--overlay-background, rgb(0 0 0 / 50%))",
          opacity: aiDrawerOpen ? 1 : 0,
          pointerEvents: aiDrawerOpen ? "auto" : "none",
          transition: "opacity 0.2s",
          zIndex: 60,
        }}
      />
      {/* 滑层：始终挂载，transform 控制显隐（保留对话状态） */}
      <div
        role="dialog"
        aria-label="AI 生成主题"
        aria-hidden={!aiDrawerOpen}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "50%",
          minWidth: 360,
          background: "var(--background)",
          borderLeft: "1px solid var(--border)",
          boxShadow: aiDrawerOpen
            ? "-8px 0 24px var(--shadow-color, rgb(0 0 0 / 10%))"
            : "none",
          transform: aiDrawerOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.25s ease",
          zIndex: 61,
          display: "flex",
          flexDirection: "column",
          ...style,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 16px",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 14 }}>AI 生成主题</span>
          <button
            type="button"
            aria-label="关闭"
            onClick={() => setAiDrawerOpen(false)}
            style={{
              marginLeft: "auto",
              border: "none",
              background: "transparent",
              color: "var(--muted-foreground)",
              cursor: "pointer",
              fontSize: 16,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
        <div
          className="theme-studio-ai-chat"
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            padding: 24,
          }}
        >
          <ChatView
            store={store}
            transport={flow.transport}
            capabilities={capabilities}
            safeRegistry={safeRegistry}
            conversationId="ai-theme"
            greeting={GREETING}
            suggestions={[
              "科技感、深色背景的主题",
              "奶油风、浅色圆角的主题",
              "青碧色系的中国风主题",
            ]}
          />
        </div>
      </div>
    </>
  );
}
