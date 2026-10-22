import { useI18n } from '@pactor-app/runtime';
import { useRef, useState } from 'react';

import { Bubble } from '../components/Bubble/index.js';
import { Sender } from '../components/Sender/index.js';

import type { ChatArtifact } from '../artifact.js';
import type {
  BuiltinMessageAction,
  ChatAgentIdentity,
  ChatMessage,
  ChatMessageAction,
  ChatPart,
} from '../model.js';
import type { ChatRuntime, ChatScope } from '../scope.js';
import { ActivityTrace } from './ActivityTrace.js';
import {
  ARTIFACT_CARD_INTERNAL_COMPONENTS,
  buildArtifactCardGroupFragment,
  ChatArtifactCardGroup,
} from './chrome/artifact-card.js';
import { ChromeSlot } from './chrome/ChromeSlot.js';
import type { CallChatService } from './context-sources.js';
import { collectMessageText, MessageActions } from './MessageActions.js';
import { PartRenderer } from './PartRenderer.js';

/** 消息正文渲染段：单个 part，或连续 artifact part 归并的产物卡片组 */
export type MessagePartSegment = ChatPart | ChatArtifact[];

/**
 * 连续 artifact part 归并（spec: chat-artifact-panel / 卡片区收起）：
 * 同一消息内相邻的 artifact part 合成一个卡片组（组内超 4 个由
 * ChatArtifactCardGroup 收起），非 artifact part 保持原位原序。
 */
export function groupArtifactParts(
  parts: readonly ChatPart[],
): MessagePartSegment[] {
  const segments: MessagePartSegment[] = [];
  for (const part of parts) {
    if (part.type === 'artifact' && part.artifact) {
      const last = segments[segments.length - 1];
      if (Array.isArray(last)) {
        last.push(part.artifact);
      } else {
        segments.push([part.artifact]);
      }
    } else {
      segments.push(part);
    }
  }
  return segments;
}

/**
 * MessageBubble：按 role 区分呈现（参考 DeepTutor web 消息区设计）——
 * user 右侧气泡（ui Bubble，tinted 变体）；assistant 左侧通栏排版：
 * 顶部 Agent 身份行（ui Sender）+ 活动轨迹区（ActivityTrace：状态头 +
 * thinking + 配对工具轨迹），正文 parts 按序渲染；hover 操作条
 * （MessageActions：复制 / 重新生成 / 编辑 / 重试）；system 居中弱提示。
 * 颜色经 `--pactor-chat-*` 变量与 ui 语义令牌表达。
 */
export interface MessageBubbleProps {
  message: ChatMessage;
  /**
   * 会话级 Agent 身份兜底：assistant 消息未自带 message.agent 时
   * 以其在消息顶部展示「图标 + 加粗名称」（单 Agent 会话的便捷配置）
   */
  agent?: ChatAgentIdentity;
  /** 透传给 dsl part 的渲染运行时与作用域 */
  runtime?: ChatRuntime;
  scope?: Omit<ChatScope, 'message'>;
  params?: Record<string, unknown>;
  /** 末条已完成 assistant 消息：提供 onRegenerate 时出示重新生成入口 */
  showRegenerate?: boolean;
  /** 重新生成回调（spec: chat-message-actions / 重新生成） */
  onRegenerate?: () => void;
  /** error 消息重试回调（spec: chat-message-actions / 错误重试） */
  onRetry?: () => void;
  /**
   * user 消息编辑重发回调（spec: chat-message-actions / 用户消息编辑重发）：
   * 提供时出示编辑入口；确认后以新文本回调（调用方负责截断 store 并重跑
   * turn）；取消编辑不触任何回调。
   */
  onEditResend?: (text: string) => void;
  /**
   * 消息操作条声明式配置（spec: chat-message-actions，透传 MessageActions）：
   * 缺省渲染内建 copy / regenerate / retry / edit（与历史行为一致）
   */
  messageActions?: Array<BuiltinMessageAction | ChatMessageAction>;
  /** 自定义动作服务派发出口（ChatServices.callService 透传） */
  callService?: CallChatService;
  /** 全部动作（含内建）点击的并行通知 */
  onMessageAction?: (actionId: string, message: ChatMessage) => void;
}

/**
 * 消息时间格式化（assistant 消息底部时间戳）：
 * 当天 HH:mm；非当天 M月d日 HH:mm（非当天文案可经 formatDate 覆盖）
 */
export function formatMessageTime(
  ts: number,
  now: number = Date.now(),
  formatDate: (date: Date, time: string) => string = (date, time) =>
    `${date.getMonth() + 1}月${date.getDate()}日 ${time}`,
): string {
  const date = new Date(ts);
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  if (new Date(now).toDateString() === date.toDateString()) {
    return `${hh}:${mm}`;
  }
  return formatDate(date, `${hh}:${mm}`);
}

/** user 消息的内联编辑框：预填原文本，确认回调新文本，取消静默关闭 */
function MessageEditForm({
  initialText,
  onConfirm,
  onCancel,
}: {
  initialText: string;
  onConfirm: (text: string) => void;
  onCancel: () => void;
}) {
  const { t } = useI18n();
  const [text, setText] = useState(initialText);

  const confirm = (): void => {
    const value = text.trim();
    if (!value) {
      return;
    }
    onConfirm(value);
  };

  return (
    <div className="pactor-chat-message__edit">
      <textarea
        className="pactor-chat-message__edit-input"
        aria-label={t('pactor.chat.message.editMessage')}
        rows={3}
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            confirm();
          } else if (event.key === 'Escape') {
            onCancel();
          }
        }}
      />
      <div className="pactor-chat-message__edit-actions">
        <button
          type="button"
          className="pactor-chat-message__edit-button pactor-chat-message__edit-button--confirm"
          aria-label={t('pactor.chat.message.confirmSend')}
          onClick={confirm}
        >
          {t('pactor.chatInput.send')}
        </button>
        <button
          type="button"
          className="pactor-chat-message__edit-button"
          aria-label={t('pactor.overlay.cancel')}
          onClick={onCancel}
        >
          {t('pactor.overlay.cancel')}
        </button>
      </div>
    </div>
  );
}

/** agent.icon 按图片 URL 渲染的判定（否则按 ui Icon 白名单名渲染） */
function isAgentIconUrl(icon: string): boolean {
  return /^(https?:|data:|\/)/.test(icon);
}

/** assistant 消息顶部的 Agent 身份行：ui Sender（头像位 + 加粗名称） */
function AgentHeader({ agent }: { agent: ChatAgentIdentity }) {
  return (
    <Sender
      name={agent.name}
      avatar={
        agent.icon !== undefined && isAgentIconUrl(agent.icon)
          ? agent.icon
          : undefined
      }
      icon={
        agent.icon !== undefined && !isAgentIconUrl(agent.icon)
          ? agent.icon
          : undefined
      }
      hideAvatar={agent.icon === undefined}
    />
  );
}

export function MessageBubble({
  message,
  agent,
  runtime,
  scope,
  showRegenerate = false,
  onRegenerate,
  onRetry,
  onEditResend,
  messageActions,
  callService,
  onMessageAction,
}: MessageBubbleProps) {
  const { t } = useI18n();
  const [editing, setEditing] = useState(false);
  const bubbleScope: ChatScope = {
    conversation: scope?.conversation ?? {},
    message: { id: message.id },
    params: scope?.params,
  };
  const streaming = message.status === 'streaming';
  // assistant 消息顶部渲染活动轨迹：流式 / 待响应期间的状态头
  // （结束后定格保留，wasLive 记忆），或含 thinking / tool part 时的
  // 配对轨迹与思考卡
  const live =
    message.status === 'pending' || message.status === 'streaming';
  const wasLiveRef = useRef(live);
  if (live) {
    wasLiveRef.current = true;
  }
  const showTrace =
    message.role === 'assistant' &&
    (wasLiveRef.current ||
      message.parts.some(
        (part) =>
          part.type === 'thinking' ||
          part.type === 'tool-call' ||
          part.type === 'tool-result',
      ));
  // assistant 终态消息底部展示时间戳（流式 / 待响应期间与无 createdAt
  // 的历史消息不展示）；user / system 消息不展示
  const showTime =
    message.role === 'assistant' && !live && message.createdAt !== undefined;
  // assistant 消息顶部的 Agent 身份行：消息自带身份优先，会话级兜底在后
  const agentIdentity =
    message.role === 'assistant' ? (message.agent ?? agent) : undefined;
  // 正文内容块（身份行 / 活动轨迹 / parts 序列）；user 消息整体包进
  // ui Bubble 右侧气泡，assistant / system 通栏排版
  const bodyContent = (
    <div className="pactor-chat-message__body">
      {agentIdentity && <AgentHeader agent={agentIdentity} />}
      {showTrace && <ActivityTrace message={message} />}
      {message.parts.length === 0 &&
      message.status === 'pending' &&
      message.role !== 'assistant' ? (
        <span className="pactor-chat-message__pending">…</span>
      ) : (
        groupArtifactParts(message.parts).map((segment, index) =>
          Array.isArray(segment) ? (
            <ChromeSlot
              key={`artifacts:${segment[0]!.id}`}
              fragment={buildArtifactCardGroupFragment(segment)}
              components={ARTIFACT_CARD_INTERNAL_COMPONENTS}
              fallback={<ChatArtifactCardGroup artifacts={segment} />}
            />
          ) : (
            <PartRenderer
              key={segment.id ?? index}
              part={segment}
              runtime={runtime}
              scope={bubbleScope}
              streaming={streaming}
            />
          ),
        )
      )}
    </div>
  );
  return (
    <div
      className={`pactor-chat-message pactor-chat-message--${message.role}`}
      data-message-id={message.id}
      data-message-status={message.status}
    >
      {editing ? (
        <MessageEditForm
          initialText={collectMessageText(message)}
          onConfirm={(text) => {
            setEditing(false);
            onEditResend?.(text);
          }}
          onCancel={() => setEditing(false)}
        />
      ) : message.role === 'user' ? (
        <Bubble align="end" variant="tinted">
          {bodyContent}
        </Bubble>
      ) : (
        bodyContent
      )}      {!editing &&
        (showTime ? (
          <div className="pactor-chat-message__footer">
            <MessageActions
              message={message}
              actions={messageActions}
              showRegenerate={showRegenerate}
              onRegenerate={onRegenerate}
              onRetry={onRetry}
              onEdit={onEditResend ? () => setEditing(true) : undefined}
              forceVisible={message.status === 'error'}
              callService={callService}
              onMessageAction={onMessageAction}
            />
            <span
              className="pactor-chat-message__time"
              title={new Date(message.createdAt!).toLocaleString()}
            >
              {formatMessageTime(message.createdAt!, Date.now(), (date, time) =>
                t('pactor.chat.message.date', {
                  month: date.getMonth() + 1,
                  day: date.getDate(),
                  time,
                }),
              )}
            </span>
          </div>
        ) : (
          <MessageActions
            message={message}
            actions={messageActions}
            showRegenerate={showRegenerate}
            onRegenerate={onRegenerate}
            onRetry={onRetry}
            onEdit={onEditResend ? () => setEditing(true) : undefined}
            forceVisible={message.status === 'error'}
            callService={callService}
            onMessageAction={onMessageAction}
          />
        ))}
    </div>
  );
}
