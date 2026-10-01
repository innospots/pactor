"use client";

import { useEffect, useRef, useState } from "react";
import { Button, ChatInput } from "@pactor-app/ui";

/**
 * 调试台共享对话面板（客户端调试 / 模型调试 左侧对话区），DSL 自定义组件。
 * PRD《调试台/00-总览》：Chat 对话式左右分栏，左栏 = 对话记录 + 输入框 + 清空对话。
 * 纯展示组件：messages / sendDisabled / streaming 等经 DSL props 表达式下发，
 * 交互经 events 上行（onSend(text) / onStop / onClear / onSelectRound(round)），
 * 对话状态与流式模拟由页面注册的自定义 action 持有（见各页 *-actions.ts）。
 */

export interface DebugChatMessage {
  id: string;
  role: "user" | "assistant" | "error";
  content: string;
  /** 关联的调用轮次对象（客户端调试：点击消息经 onSelectRound 整体上行，DSL 写入 selectedRound） */
  round?: { id?: string };
  /** assistant 消息下方的紧凑摘要（Token 用量 / TTFT / 延迟 / 上游状态码） */
  meta?: string;
  /** 流式输出中（内容边收边长，尾部带光标） */
  streaming?: boolean;
}

/** 模拟流式输出：按固定节奏把 full 逐段吐出；onChunk 收到的是累计文本。
 *  返回取消函数（停止生成 / 清空对话时调用）。 */
export function streamText(
  full: string,
  onChunk: (text: string) => void,
  onDone: () => void,
  opts?: { interval?: number; chunkSize?: number },
): () => void {
  const interval = opts?.interval ?? 36;
  const chunkSize = opts?.chunkSize ?? 3;
  let pos = 0;
  const timer = setInterval(() => {
    pos = Math.min(full.length, pos + chunkSize);
    onChunk(full.slice(0, pos));
    if (pos >= full.length) {
      clearInterval(timer);
      onDone();
    }
  }, interval);
  return () => clearInterval(timer);
}

const ROLE_CONFIG: Record<
  DebugChatMessage["role"],
  { label: string; dot: string }
> = {
  user: { label: "你", dot: "bg-primary" },
  assistant: { label: "助手", dot: "bg-emerald-500" },
  error: { label: "错误", dot: "bg-red-500" },
};

export interface DebugChatProps {
  /** 消息列表（`${state.messages}` 整体表达式下发，数组类型保留） */
  messages?: DebugChatMessage[];
  /** 禁用发送（未选齐调用身份 / 供应商模型等） */
  sendDisabled?: boolean;
  /** 输入框占位文案（禁用时建议传入原因提示） */
  placeholder?: string;
  /** 流式生成中：输入区上方展示「停止生成」 */
  streaming?: boolean;
  /** 当前选中轮次 ID（高亮对应消息；与消息 round.id 比对） */
  selectedRoundId?: string;
  /** 空会话提示文案 */
  emptyHint?: string;
  // ── DSL events 注入（Renderer 包装为同名函数 prop，单参 event）──
  onSend?: (event?: unknown) => void;
  onStop?: (event?: unknown) => void;
  onClear?: (event?: unknown) => void;
  onSelectRound?: (event?: unknown) => void;
}

export function DebugChat({
  messages,
  sendDisabled,
  placeholder,
  streaming,
  selectedRoundId,
  emptyHint,
  onSend,
  onStop,
  onClear,
  onSelectRound,
}: DebugChatProps) {
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  // 新消息 / 流式追加时滚到底部
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleSubmit = (text: string) => {
    onSend?.(text);
    setDraft("");
  };

  return (
    <div className="debug-chat-root flex min-h-[420px] flex-col gap-3">
      {/* ── 对话记录 ── */}
      <div
        ref={listRef}
        className="debug-chat-list h-[52vh] min-h-[320px] overflow-y-auto rounded-lg border bg-background p-4"
      >
        {!messages || messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            {emptyHint ?? "暂无对话，输入消息开始调试"}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((msg) => {
              const cfg = ROLE_CONFIG[msg.role];
              const clickable = !!msg.round && !!onSelectRound;
              const selected =
                !!msg.round?.id && msg.round.id === selectedRoundId;
              return (
                <div
                  key={msg.id}
                  className={`rounded-lg p-1 ${clickable ? "cursor-pointer" : ""} ${
                    selected ? "ring-1 ring-primary" : ""
                  }`}
                  onClick={clickable ? () => onSelectRound(msg.round) : undefined}
                >
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <span className={`size-2 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                    {msg.streaming && (
                      <span className="text-muted-foreground/70">（生成中…）</span>
                    )}
                  </div>
                  <div
                    className={`whitespace-pre-wrap rounded-md px-3 py-2 text-sm leading-6 ${
                      msg.role === "user"
                        ? "bg-muted"
                        : msg.role === "error"
                          ? "text-red-600 [data-pactor-theme=dark]:text-red-400"
                          : ""
                    }`}
                  >
                    {msg.content}
                    {msg.streaming && (
                      <span className="ml-0.5 inline-block animate-pulse">▍</span>
                    )}
                  </div>
                  {msg.meta && (
                    <div className="mt-1 px-1 text-xs text-muted-foreground">
                      {msg.meta}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 停止生成（流式中） ── */}
      {streaming && onStop && (
        <div className="flex justify-center">
          <Button text="停止生成" size="small" onClick={() => onStop()} />
        </div>
      )}

      {/* ── 输入框（Enter 发送 / Shift+Enter 换行，ChatInput 内建） ── */}
      <ChatInput
        value={draft}
        placeholder={placeholder ?? "输入消息..."}
        disabled={sendDisabled || streaming}
        onChange={setDraft}
        onSubmit={handleSubmit}
      />

      {/* ── 清空对话 ── */}
      <div className="flex justify-end">
        <Button
          text="清空对话"
          size="small"
          disabled={!messages || messages.length === 0}
          onClick={() => onClear?.()}
        />
      </div>
    </div>
  );
}
