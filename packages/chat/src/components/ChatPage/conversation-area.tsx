import { Button, Text, Tooltip } from "@pactor-app/ui/components";
import type { ReactNode } from "react";

import { Composer } from "../Composer/index.js";
import { MessageList } from "../MessageList/index.js";
import { Welcome } from "../Welcome/index.js";
import type { RenderSlot } from "./hooks.js";
import type { ChatPageProps } from "./types.js";

/**
 * 右端固定块背景：优先 chat 皮肤专用令牌（--pactor-chat-side-panel-bg），
 * 逐级回退到 chat 侧栏令牌 → 页面皮肤的 sidebar / muted 语义令牌，
 * 未接入 chat 皮肤时也能跟随宿主换肤。
 */
const SIDE_PANEL_BG =
  "var(--pactor-chat-side-panel-bg, var(--pactor-chat-sidebar-bg, var(--sidebar, var(--muted))))";

export type ConversationAreaProps = Pick<
  ChatPageProps,
  | "conversationTitle"
  | "conversationHeaderAction"
  | "onConversationHeaderAction"
  | "messages"
  | "welcome"
  | "sending"
  | "composerPlaceholder"
  | "onSend"
  | "onMessageAction"
  | "models"
  | "model"
  | "onModelChange"
  | "contexts"
  | "contextItems"
  | "onContextItemsChange"
  | "attachments"
  | "onAttachFiles"
  | "onRemoveAttachment"
  | "onRetryAttachment"
  | "composerFooter"
  | "composerBottom"
  | "sidePanel"
  | "sidePanelOpen"
  | "sidePanelWidth"
> & {
  /** 「已生成 n 个产物」段点击：打开产物区 */
  onOpenArtifacts: () => void;
  /** DslNode 槽渲染 */
  renderSlot: RenderSlot;
  /** 对话图标栏（由组合层传入，含 popover 弹层） */
  rail: ReactNode;
};

/**
 * 对话区：头部（标题 + 自定义操作）/ Welcome 空态 / MessageList /
 * Composer / composerBottom 槽；右缘为 aside 容器，内含 sidePanel 固定块
 * （受控展开 / 收起，带宽度与透明度过渡）与对话图标栏，便于整体控制。
 */
export function ConversationArea({
  conversationTitle,
  conversationHeaderAction,
  onConversationHeaderAction,
  messages = [],
  welcome,
  sending,
  composerPlaceholder,
  onSend,
  onMessageAction,
  models,
  model,
  onModelChange,
  contexts,
  contextItems,
  onContextItemsChange,
  attachments,
  onAttachFiles,
  onRemoveAttachment,
  onRetryAttachment,
  composerFooter,
  composerBottom,
  sidePanel,
  sidePanelOpen = false,
  sidePanelWidth = 280,
  onOpenArtifacts,
  renderSlot,
  rail,
}: ConversationAreaProps) {
  return (
    <div
      data-slot="chat-page-conversation"
      className="flex h-full min-w-0 flex-1 flex-col"
    >
      <div
        data-slot="chat-page-conversation-header"
        className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4"
      >
        <Text text={conversationTitle} strong />
        {conversationHeaderAction ? (
          <Tooltip
            content={
              conversationHeaderAction.tooltip ?? conversationHeaderAction.label
            }
            side="bottom"
          >
            <Button
              text={conversationHeaderAction.label}
              icon={conversationHeaderAction.icon}
              variant="text"
              onClick={() => onConversationHeaderAction?.()}
            />
          </Tooltip>
        ) : null}
      </div>
      <div className="flex min-h-0 flex-1">
        {/* 内容列宽相对主区域（cqw）：产物栏关闭时对话列占主区域 61.8%（居中），
            产物栏拖宽时分栏收窄、对话列逐渐撑满分栏（max-w-full 封顶） */}
        <div
          data-slot="chat-page-conversation-body"
          className="mx-auto flex min-h-0 w-[61.8cqw] max-w-full flex-col"
        >
          {messages.length === 0 ? (
            <Welcome
              title={welcome?.title}
              description={welcome?.description}
              prompts={welcome?.prompts}
              style={{ flex: 1 }}
              onSelect={(value) => onSend?.(value)}
            />
          ) : (
            <MessageList
              messages={messages}
              className="scrollbar-subtle"
              style={{ flex: 1, minHeight: 0, padding: 16 }}
              onAction={onMessageAction}
              onOpenArtifacts={onOpenArtifacts}
            />
          )}
          <Composer
            placeholder={composerPlaceholder}
            loading={sending}
            models={models}
            model={model}
            contexts={contexts}
            contextItems={contextItems}
            attachments={attachments}
            footer={composerFooter}
            style={{
              padding: 16,
              paddingBottom: composerBottom ? 8 : 16,
              flexShrink: 0,
            }}
            onModelChange={onModelChange}
            onContextItemsChange={onContextItemsChange}
            onAttachFiles={onAttachFiles}
            onRemoveAttachment={onRemoveAttachment}
            onRetryAttachment={onRetryAttachment}
            onSubmit={(text) => onSend?.(text)}
          />
          {composerBottom ? (
            <div
              data-slot="chat-page-composer-bottom"
              className="shrink-0 px-4 pb-2 text-center"
            >
              {renderSlot(composerBottom)}
            </div>
          ) : null}
        </div>
        {/* 右端区域容器：固定块与对话图标栏同容器，便于整体样式 / 状态控制 */}
        <div
          data-slot="chat-page-aside"
          data-state={
            sidePanel === undefined
              ? undefined
              : sidePanelOpen
                ? "open"
                : "closed"
          }
          className="flex h-full shrink-0 items-stretch"
        >
          {/* 右端固定块：展开时占固定宽度（ConversationRail 左侧），
              宽度 + 透明度过渡；内层保持目标宽度，避免动画期间内容重排；
              背景色经 chat 皮肤令牌关联当前页面皮肤 */}
          {sidePanel !== undefined ? (
            <div
              data-slot="chat-page-side-panel"
              data-state={sidePanelOpen ? "open" : "closed"}
              aria-hidden={!sidePanelOpen}
              inert={!sidePanelOpen}
              className="h-full shrink-0 overflow-hidden"
              style={{
                width: sidePanelOpen ? sidePanelWidth : 0,
                opacity: sidePanelOpen ? 1 : 0,
                backgroundColor: SIDE_PANEL_BG,
                transition:
                  "width 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease",
              }}
            >
              <div
                data-slot="chat-page-side-panel-body"
                className="h-full"
                style={{ width: sidePanelWidth }}
              >
                <div className="scrollbar-subtle h-full overflow-y-auto">
                  {renderSlot(sidePanel)}
                </div>
              </div>
            </div>
          ) : null}
          {rail}
        </div>
      </div>
    </div>
  );
}
