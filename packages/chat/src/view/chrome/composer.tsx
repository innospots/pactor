import { Icon } from '@pactor-app/ui/components';
import { useI18n } from '@pactor-app/runtime';
import { createContext, useContext, type ReactNode } from 'react';

import type {
  ChatAttachment,
  ChatContextItem,
  ChatModelOption,
} from '../../model.js';
import type {
  ComposerMode,
  ComposerQueueItem,
} from '../../components/Composer/index.js';
import { ModelSelect } from '../ModelChip.js';
import type { ChromeFragment } from './ChromeSlot.js';

/**
 * Composer chrome 片段与内部组件（spec: chat-composer-on-chatinput /
 * chat-view Composer）：Composer 呈现层在 DSL 环境经 ChatInput 组合
 * 渲染；工具栏与附件 / chips 区由本模块的内部组件供给（经 ChromeSlot
 * 注册进 ambient registry，不覆盖宿主同名），组件经
 * ComposerBridgeContext 取 Composer 的状态与回调——File、回调等不可
 * 序列化依赖不进入 DSL params。
 */

export interface ComposerBridge {
  // 状态（Composer 每渲染同步）
  text: string;
  streaming: boolean;
  disabled: boolean;
  attachments?: ChatAttachment[];
  contextChips?: ChatContextItem[];
  toolbarStart?: ReactNode;
  toolbarEnd?: ReactNode;
  /** footer 槽内容（spec: chat-composer-slots）；未提供时片段不携带 footer 槽 */
  composerFooter?: ReactNode;
  models?: ChatModelOption[];
  model?: string;
  showPlus: boolean;
  showAttach: boolean;
  modelChipEnabled: boolean;
  /** 生成中排队（opt-in）：队列与移除入口 */
  queue?: ComposerQueueItem[];
  removeQueued?: (id: string) => void;
  /** Ask / Plan / Act（opt-in） */
  showModes?: boolean;
  mode?: ComposerMode;
  modeChange?: (mode: ComposerMode) => void;
  // 行为
  send: () => void;
  stop?: () => void;
  openFilePicker: () => void;
  plusClick: (anchorRect: DOMRect) => void;
  removeAttachment: (id: string) => void;
  attachmentClick?: (attachment: ChatAttachment) => void;
  removeChip: (chip: ChatContextItem) => void;
  modelChange?: (value: string) => void;
}

export const ComposerBridgeContext = createContext<ComposerBridge | null>(
  null,
);

function useComposerBridge(): ComposerBridge {
  const bridge = useContext(ComposerBridgeContext);
  if (!bridge) {
    throw new Error(
      '[@pactor-app/chat] ChatComposer* 内部组件仅可在 Composer chrome 片段内渲染',
    );
  }
  return bridge;
}

/** 附件大小的人性化展示 */
function formatSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** 附件卡片行（ChatComposerHeader 用；fallback 路径由 ui Composer 内建附件区承担） */
export function ComposerAttachments({
  attachments,
  onRemove,
  onClick,
}: {
  attachments: ChatAttachment[];
  onRemove: (id: string) => void;
  onClick?: (attachment: ChatAttachment) => void;
}): ReactNode {
  const { t } = useI18n();
  const removeLabel = t('pactor.chat.composer.removeAttachment');
  if (attachments.length === 0) {
    return null;
  }
  return (
    <div className="pactor-chat-composer__attachments">
      {attachments.map((attachment) => {
        const isImage = attachment.mimeType.startsWith('image/');
        return (
          <div
            key={attachment.id}
            className="pactor-chat-composer__attachment"
            data-attachment-id={attachment.id}
            onClick={() => onClick?.(attachment)}
          >
            {isImage && attachment.url ? (
              <span className="pactor-chat-composer__attachment-thumb">
                <img src={attachment.url} alt={attachment.name} />
              </span>
            ) : (
              <span className="pactor-chat-composer__attachment-info">
                <Icon name="file-text" size={14} />
                <span className="pactor-chat-composer__attachment-name">
                  {attachment.name}
                </span>
                {attachment.size !== undefined && (
                  <span className="pactor-chat-composer__attachment-size">
                    {formatSize(attachment.size)}
                  </span>
                )}
              </span>
            )}
            <button
              type="button"
              className="pactor-chat-icon-button pactor-chat-composer__attachment-remove"
              title={removeLabel}
              aria-label={removeLabel}
              onClick={(event) => {
                event.stopPropagation();
                onRemove(attachment.id);
              }}
            >
              <Icon name="x" size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

/** 上下文 chips 行（fallback 与 ChatComposerHeader 共用） */
export function ComposerContextChips({
  chips,
  onRemove,
}: {
  chips: ChatContextItem[];
  onRemove: (chip: ChatContextItem) => void;
}): ReactNode {
  const { t } = useI18n();
  if (chips.length === 0) {
    return null;
  }
  const tokenChips = chips.filter((chip) => typeof chip.tokens === 'number');
  const totalTokens = tokenChips.reduce(
    (total, chip) => total + (chip.tokens ?? 0),
    0,
  );
  const removeContextLabel = (label: string): string =>
    t('pactor.chat.composer.removeContext', { label });
  return (
    <div className="pactor-chat-composer__contexts">
      {chips.map((chip) => (
        <span
          key={`${chip.trigger ?? ''}:${chip.id}`}
          className="pactor-chat-context-chip"
          data-context-id={chip.id}
        >
          <span className="pactor-chat-context-chip__label">{chip.label}</span>
          {typeof chip.tokens === 'number' ? (
            <span
              data-slot="composer-context-token"
              className="pactor-chat-context-chip__tokens"
            >
              {t('pactor.chat.composer.contextTokens', {
                tokens: chip.tokens,
              })}
            </span>
          ) : null}
          <button
            type="button"
            className="pactor-chat-icon-button pactor-chat-context-chip__remove"
            title={removeContextLabel(chip.label)}
            aria-label={removeContextLabel(chip.label)}
            onClick={() => onRemove(chip)}
          >
            <Icon name="x" size={12} />
          </button>
        </span>
      ))}
      {tokenChips.length > 0 ? (
        <span
          data-slot="composer-context-total"
          className="pactor-chat-context-chip__total"
        >
          {t('pactor.chat.composer.totalTokens', { tokens: totalTokens })}
        </span>
      ) : null}
    </div>
  );
}

/** 生成中排队行（DSL header 与 fallback 共用） */
export function ComposerQueue({
  queue,
  onRemove,
}: {
  queue: ComposerQueueItem[];
  onRemove: (id: string) => void;
}): ReactNode {
  const { t } = useI18n();
  if (queue.length === 0) {
    return null;
  }
  return (
    <div
      data-slot="composer-queue"
      className="pactor-chat-composer__queue"
    >
      <div className="pactor-chat-composer__queue-title">
        <Icon name="list" size={12} />
        {t('pactor.chat.composer.queue')}
        <span>{queue.length}</span>
      </div>
      <ul className="pactor-chat-composer__queue-items">
        {queue.map((item) => (
          <li
            key={item.id}
            data-slot="composer-queue-item"
            className="pactor-chat-composer__queue-item"
          >
            <span className="pactor-chat-composer__queue-text">{item.text}</span>
            <button
              type="button"
              data-slot="composer-queue-remove"
              className="pactor-chat-icon-button"
              aria-label={t('pactor.chat.composer.queueRemove', {
                text: item.text,
              })}
              onClick={() => onRemove(item.id)}
            >
              <Icon name="x" size={12} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Ask / Plan / Act 切换（DSL toolbarStart 与 fallback 共用） */
export function ComposerModeSelector({
  mode,
  onChange,
}: {
  mode: ComposerMode;
  onChange: (mode: ComposerMode) => void;
}): ReactNode {
  const { t } = useI18n();
  const modes: ComposerMode[] = ['ask', 'plan', 'act'];
  return (
    <div
      data-slot="composer-modes"
      role="radiogroup"
      aria-label={t('pactor.chat.composer.mode')}
      className="pactor-chat-composer__modes"
    >
      {modes.map((item) => (
        <button
          key={item}
          type="button"
          role="radio"
          data-slot="composer-mode"
          data-mode={item}
          aria-checked={mode === item}
          tabIndex={mode === item ? 0 : -1}
          onClick={() => onChange(item)}
        >
          {t(`pactor.chat.composer.mode.${item}`)}
        </button>
      ))}
    </div>
  );
}

/** ChatInput header 槽：附件卡片行 + 上下文 chips 行 */
function ChatComposerHeader(): ReactNode {
  const bridge = useComposerBridge();
  return (
    <>
      {bridge.attachments !== undefined && (
        <ComposerAttachments
          attachments={bridge.attachments}
          onRemove={bridge.removeAttachment}
          onClick={bridge.attachmentClick}
        />
      )}
      {bridge.contextChips !== undefined && (
        <ComposerContextChips
          chips={bridge.contextChips}
          onRemove={bridge.removeChip}
        />
      )}
      {bridge.queue !== undefined && bridge.removeQueued ? (
        <ComposerQueue queue={bridge.queue} onRemove={bridge.removeQueued} />
      ) : null}
    </>
  );
}

/** ChatInput toolbarStart 槽：chat toolbarStart 槽 + 内建 + 钮 / 附件钮 */
function ChatComposerToolbarStart(): ReactNode {
  const bridge = useComposerBridge();
  const { t } = useI18n();
  return (
    <>
      {bridge.toolbarStart}
      {bridge.showModes && bridge.mode && bridge.modeChange ? (
        <ComposerModeSelector
          mode={bridge.mode}
          onChange={bridge.modeChange}
        />
      ) : null}
      {bridge.showPlus && (
        <button
          type="button"
          className="pactor-chat-icon-button"
          title={t('pactor.chat.composer.more')}
          aria-label={t('pactor.chat.composer.more')}
          onClick={(event) =>
            bridge.plusClick(event.currentTarget.getBoundingClientRect())
          }
        >
          <Icon name="plus" size={14} />
        </button>
      )}
      {bridge.showAttach && (
        <button
          type="button"
          className="pactor-chat-icon-button"
          title={t('pactor.chat.composer.addAttachment')}
          aria-label={t('pactor.chat.composer.addAttachment')}
          onClick={bridge.openFilePicker}
        >
          <Icon name="paperclip" size={14} />
        </button>
      )}
    </>
  );
}

/** ChatInput toolbarEnd 槽：模型 chip + chat toolbarEnd 槽 + 发送/停止状态机钮 */
function ChatComposerToolbarEnd(): ReactNode {
  const bridge = useComposerBridge();
  const { t } = useI18n();
  return (
    <>
      {bridge.modelChipEnabled && (
        <ModelSelect
          models={bridge.models!}
          model={bridge.model}
          onModelChange={bridge.modelChange}
        />
      )}
      {bridge.toolbarEnd}
      {/* 发送 / 停止：同一按钮元素的状态切换（与 fallback 同语义） */}
      <button
        type="button"
        className={`pactor-chat-composer__button${bridge.streaming ? ' pactor-chat-composer__button--stop' : ''}`}
        title={
          bridge.streaming
            ? t('pactor.chatInput.stop')
            : t('pactor.chatInput.send')
        }
        aria-label={
          bridge.streaming
            ? t('pactor.chatInput.stop')
            : t('pactor.chatInput.send')
        }
        disabled={
          bridge.streaming ? false : bridge.disabled || !bridge.text.trim()
        }
        onClick={bridge.streaming ? bridge.stop : bridge.send}
      >
        {bridge.streaming ? (
          <Icon name="square" size={14} className="pactor-chat-icon-fill" />
        ) : (
          <Icon name="arrow-up" size={16} />
        )}
      </button>
    </>
  );
}

/** ChatInput footer 槽（spec: chat-composer-slots）：composerFooter 内容 */
function ChatComposerFooter(): ReactNode {
  const bridge = useComposerBridge();
  return <>{bridge.composerFooter}</>;
}

/** 经 ChromeSlot 注册进 ambient registry 的 chat 内部组件（不覆盖宿主同名） */
export const COMPOSER_INTERNAL_COMPONENTS = {
  ChatComposerHeader,
  ChatComposerToolbarStart,
  ChatComposerToolbarEnd,
  ChatComposerFooter,
};

/**
 * Composer chrome 片段：ChatInput（非受控——用户文本不进入 DSL
 * params，避免 ${} 被表达式求值；草稿自持、发送后自清空）+
 * hideSend（发送/停止钮由 toolbarEnd 内部组件承担，状态机语义保留）。
 * footer 槽仅在 composerFooter 提供时携带（零渲染承诺，
 * spec: chat-composer-slots）；hideToolbar 时不携带工具栏槽，
 * ChatInput 工具栏行整体零渲染（发送钮随之隐藏，Enter 发送保留）。
 */
export function buildComposerFragment(props: {
  placeholder: string;
  disabled: boolean;
  hasFooter?: boolean;
  hideToolbar?: boolean;
}): ChromeFragment {
  const hideToolbar = props.hideToolbar === true;
  return {
    requires: [
      'ChatInput',
      'ChatComposerHeader',
      ...(hideToolbar
        ? []
        : ['ChatComposerToolbarStart', 'ChatComposerToolbarEnd']),
      'ChatComposerFooter',
    ],
    node: {
      type: 'ChatInput',
      props: {
        placeholder: props.placeholder,
        disabled: props.disabled,
        rows: 1,
        hideSend: true,
        header: { type: 'ChatComposerHeader' },
        ...(hideToolbar
          ? {}
          : {
              toolbarStart: { type: 'ChatComposerToolbarStart' },
              toolbarEnd: { type: 'ChatComposerToolbarEnd' },
            }),
        ...(props.hasFooter === true
          ? { footer: { type: 'ChatComposerFooter' } }
          : {}),
      },
      events: {
        onSubmit: [
          { action: 'chat.composerSubmit', params: { value: '${event}' } },
        ],
      },
    },
  };
}
