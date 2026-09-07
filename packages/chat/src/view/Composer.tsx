import { Icon } from '@pactor-app/ui/components';
import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import type {
  ChatAttachment,
  ChatContextItem,
  ChatContextSource,
  ChatModelOption,
} from '../model.js';
import { AnchoredPopover } from './AnchoredPopover.js';
import { ModelSelect } from './ModelChip.js';
import { setChatChromeHandlers } from './chrome/actions.js';
import { ChromeSlot } from './chrome/ChromeSlot.js';
import {
  buildComposerFragment,
  COMPOSER_INTERNAL_COMPONENTS,
  ComposerAttachments,
  ComposerBridgeContext,
  ComposerContextChips,
  type ComposerBridge,
} from './chrome/composer.js';
import {
  ContextSourceList,
  type CallChatService,
  type ContextSourceCache,
} from './context-sources.js';

/**
 * Composer（spec: chat-view / Composer + chat-composer-extensions）：
 * 自适应高度 textarea + 状态机发送按钮（disabled / ready / streaming
 * 停止，同一按钮元素切换，streaming 态带纯 CSS 光环）。
 *
 * - IME 守卫（D6）：compositionstart/end + keydown.isComposing 兜底，
 *   合成中 Enter 不发送
 * - 附件（D3）：受控 `attachments` + `onAttachmentsChange`；拖拽悬停态、
 *   粘贴与文件选择产出 `File[]` 经 `onAttachFiles` 交给调用方（包内
 *   不上传）；卡片点击经 `onAttachmentClick` 通知
 * - 扩展槽：`toolbarStart` / `toolbarEnd` 渲染槽；词边界 `@` 触发
 *   `onMentionTrigger(query, anchorRect)`；"+" 按钮触发
 *   `onPlusMenu(anchorRect)`（无回调不渲染入口）
 * - 内建特性（chat-builtin-features）：models 非空时工具栏右端渲染
 *   模型 chip（AnchoredPopover 列表，toolbarEnd 之前）；contexts 配置
 *   且未注入调用方回调时启用内建 @ 提及 / + 菜单弹层，选中项追加为
 *   输入区上方的上下文 chips（受控：contextChips + onContextChipsChange）
 * - chrome DSL 渲染层（spec: chat-composer-on-chatinput）：呈现层在
 *   DSL 环境经宿主 ChatInput 组合渲染（非受控 + chat.composerSubmit
 *   桥接 + 冒泡同步 / 附件承接），无 renderer 或类型缺失时回退手写
 *   呈现（ComposerFallback），两条路径交互语义一致
 */
export interface ComposerProps {
  /** 发送回调；输入框在回调后清空 */
  onSend?: (text: string) => void;
  /** 流式中为 true：按钮变为停止，点击触发 onStop */
  streaming?: boolean;
  /** 停止当前 turn */
  onStop?: () => void;
  placeholder?: string;
  disabled?: boolean;
  /** 受控附件列表（提供即渲染附件区；上传与存储由调用方负责） */
  attachments?: ChatAttachment[];
  /** 附件列表变更（卡片移除后回调新数组） */
  onAttachmentsChange?: (attachments: ChatAttachment[]) => void;
  /** 粘贴 / 拖拽 / 文件选择产出的原始文件，交给调用方处理 */
  onAttachFiles?: (files: File[]) => void;
  /** 附件卡片点击通知（预览等由调用方实现） */
  onAttachmentClick?: (attachment: ChatAttachment) => void;
  /** 工具栏左 / 右渲染槽 */
  toolbarStart?: ReactNode;
  toolbarEnd?: ReactNode;
  /** footer 槽（spec: chat-composer-slots / Composer footer 槽）：渲染在工具栏下方、以分隔线相隔；未提供不渲染 */
  composerFooter?: ReactNode;
  /**
   * 隐藏工具栏行（缺省 false）：true 时工具栏行整体不渲染——
   * 内建 + 钮 / 附件钮 / 模型 chip / 发送钮与 toolbarStart / toolbarEnd
   * 槽一并抑制（footer 槽不受影响）；Enter 发送保留，DSL 路径由
   * ChatInput 工具栏行零渲染承担
   */
  hideToolbar?: boolean;
  /** 词边界 `@` 输入触发：query 为 `@` 后文本，anchorRect 为弹层锚点 */
  onMentionTrigger?: (query: string, anchorRect: DOMRect) => void;
  /** "+" 按钮触发弹层入口 */
  onPlusMenu?: (anchorRect: DOMRect) => void;
  /**
   * 内建模型选择（spec: chat-model-selector）：非空时工具栏右端渲染
   * 内建模型 chip（位于 toolbarEnd 槽内容之前）；缺省 / 空数组不渲染
   */
  models?: ChatModelOption[];
  /** 当前选中模型 value（由 ChatView 经受控规则 D5 解析后传入） */
  model?: string;
  /** 弹层中选中模型时触发 */
  onModelChange?: (value: string) => void;
  /**
   * 内建上下文数据源（spec: chat-context-sources）：存在 `trigger: '@'`
   * 的 source 且未注入 onMentionTrigger 时启用内建提及弹层；存在
   * `trigger: '+'` 的 source 且未注入 onPlusMenu 时渲染内建 "+" 入口
   */
  contextSources?: ChatContextSource[];
  /** 上下文 chips（受控：由 ChatView 持有，渲染在输入区上方） */
  contextChips?: ChatContextItem[];
  /** chips 变更回调（选中追加 / 单独移除） */
  onContextChipsChange?: (chips: ChatContextItem[]) => void;
  /** service 引用解析出口（ChatServices.callService 透传） */
  callService?: CallChatService;
}

/** 输入框高度上限（px），超出后内部滚动 */
const MAX_INPUT_HEIGHT = 200;

/** 词边界 `@` 提及检测：返回 `@` 后 query，未命中返回 null */
function detectMention(text: string, caret: number): string | null {
  const beforeCaret = text.slice(0, caret);
  const match = /(?:^|\s)@([^\s@]*)$/.exec(beforeCaret);
  return match ? match[1]! : null;
}

function collectDropFiles(event: { dataTransfer: DataTransfer | null }): File[] {
  return event.dataTransfer ? Array.from(event.dataTransfer.files) : [];
}

export function Composer({
  onSend,
  streaming = false,
  onStop,
  placeholder = '输入消息，Enter 发送，Shift+Enter 换行',
  disabled = false,
  attachments,
  onAttachmentsChange,
  onAttachFiles,
  onAttachmentClick,
  toolbarStart,
  toolbarEnd,
  onMentionTrigger,
  onPlusMenu,
  models,
  model,
  onModelChange,
  contextSources,
  contextChips,
  onContextChipsChange,
  callService,
  composerFooter,
  hideToolbar = false,
}: ComposerProps) {
  const [text, setText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const plusButtonRef = useRef<HTMLButtonElement>(null);
  // IME 合成状态（compositionstart/end；keydown.isComposing 兜底）
  const composingRef = useRef(false);

  // 内建模型 chip（spec: chat-model-selector）：models 非空才渲染；
  // chip 与弹层实现抽为 ModelChip（header 位复用，决策 D2）
  const modelChipEnabled = models !== undefined && models.length > 0;

  // 内建上下文（spec: chat-context-sources，决策 D5）：调用方回调优先——
  // 注入 onMentionTrigger / onPlusMenu 时对应内建入口 / 弹层完全不启用
  const mentionSources = useMemo(
    () => contextSources?.filter((source) => source.trigger === '@') ?? [],
    [contextSources],
  );
  const plusSources = useMemo(
    () => contextSources?.filter((source) => source.trigger === '+') ?? [],
    [contextSources],
  );
  const builtinMentionEnabled =
    onMentionTrigger === undefined && mentionSources.length > 0;
  const builtinPlusEnabled =
    onPlusMenu === undefined && plusSources.length > 0;
  const [mentionState, setMentionState] = useState<{
    query: string;
    anchorRect: DOMRect;
  } | null>(null);
  const [plusAnchor, setPlusAnchor] = useState<DOMRect | null>(null);
  // service 引用的会话级解析缓存（Map 存 promise）
  const sourceCacheRef = useRef<ContextSourceCache | null>(null);
  if (sourceCacheRef.current === null) {
    sourceCacheRef.current = new Map();
  }

  // 选中候选追加 chip（决策 D5：同 trigger 同 id 去重，重复选中忽略）
  const handleSelectContext = (
    item: ChatContextItem,
    source: ChatContextSource,
  ): void => {
    const chip: ChatContextItem = {
      ...item,
      trigger: item.trigger ?? source.trigger,
    };
    const chips = contextChips ?? [];
    const duplicated = chips.some(
      (existing) => existing.id === chip.id && existing.trigger === chip.trigger,
    );
    if (!duplicated) {
      onContextChipsChange?.([...chips, chip]);
    }
    setMentionState(null);
    setPlusAnchor(null);
  };

  // 自适应高度：内容变化时按 scrollHeight 增长，封顶 MAX_INPUT_HEIGHT
  // （仅 fallback 路径；DSL 路径由 ChatInput field-sizing-content +
  // styles.css 的 max-height 覆盖承担）
  useLayoutEffect(() => {
    const input = inputRef.current;
    if (input) {
      input.style.height = 'auto';
      input.style.height = `${Math.min(input.scrollHeight, MAX_INPUT_HEIGHT)}px`;
    }
  }, [text]);

  const send = (): void => {
    const value = text.trim();
    if (!value || disabled) {
      return;
    }
    onSend?.(value);
    setText('');
  };

  // chrome DSL 路径的发送桥接（spec: chat-composer-on-chatinput）：
  // chat.composerSubmit 内建动作 → 包级 handlers → sendRef（值同步
  // 由容器冒泡 onChange 先行完成，发送语义与 fallback 同一份）
  const sendRef = useRef(send);
  sendRef.current = send;
  useLayoutEffect(() => {
    setChatChromeHandlers({ composerSubmit: () => sendRef.current() });
  }, []);

  /** 文本同步与 mention 检测（fallback onChange 与 DSL 冒泡共用） */
  const syncText = (value: string, caret: number, rect: DOMRect): void => {
    setText(value);
    if (onMentionTrigger || builtinMentionEnabled) {
      const query = detectMention(value, caret);
      if (onMentionTrigger) {
        // 调用方回调优先（spec: chat-composer-extensions / 提及触发）
        if (query !== null) {
          onMentionTrigger(query, rect);
        }
      } else {
        // 内建提及弹层：命中即开（按 query 实时过滤），@ 语境消失即关
        setMentionState(query !== null ? { query, anchorRect: rect } : null);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    syncText(
      event.target.value,
      event.target.selectionStart ?? event.target.value.length,
      event.target.getBoundingClientRect(),
    );
  };

  // DSL 路径的冒泡承接（spec: chat-composer-on-chatinput D5）：
  // ChatInput textarea 的 change/paste 沿 React 树冒泡到容器
  const handleBubbleChange = (event: React.ChangeEvent<HTMLDivElement>): void => {
    const target = event.target;
    if (!(target instanceof HTMLTextAreaElement)) {
      return;
    }
    syncText(
      target.value,
      target.selectionStart ?? target.value.length,
      target.getBoundingClientRect(),
    );
  };

  const handlePasteFiles = (clipboardData: DataTransfer): boolean => {
    const files = Array.from(clipboardData.files);
    if (files.length > 0 && onAttachFiles) {
      onAttachFiles(files);
      return true;
    }
    return false;
  };

  const dragHandlers = {
    onDragOver: (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragOver(true);
    },
    onDragLeave: () => setDragOver(false),
    onDrop: (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragOver(false);
      const files = collectDropFiles(event);
      if (files.length > 0 && onAttachFiles) {
        onAttachFiles(files);
      }
    },
  };

  const showToolbar =
    !hideToolbar &&
    (toolbarStart !== undefined ||
      toolbarEnd !== undefined ||
      onPlusMenu !== undefined ||
      builtinPlusEnabled ||
      onAttachFiles !== undefined ||
      modelChipEnabled);

  const fileInputNode = onAttachFiles ? (
    <input
      ref={fileInputRef}
      type="file"
      multiple
      hidden
      onChange={(event) => {
        const files = event.target.files ? Array.from(event.target.files) : [];
        if (files.length > 0) {
          onAttachFiles(files);
        }
        // 允许重复选择同一文件
        event.target.value = '';
      }}
    />
  ) : null;

  const popoverNodes = (
    <>
      {builtinMentionEnabled && mentionState && (
        <AnchoredPopover
          anchorRect={mentionState.anchorRect}
          onClose={() => setMentionState(null)}
          role="listbox"
        >
          <ContextSourceList
            sources={mentionSources}
            query={mentionState.query}
            callService={callService}
            cache={sourceCacheRef.current!}
            onSelect={handleSelectContext}
          />
        </AnchoredPopover>
      )}
      {builtinPlusEnabled && plusAnchor && (
        <AnchoredPopover
          anchorRect={plusAnchor}
          onClose={() => setPlusAnchor(null)}
          role="listbox"
        >
          <ContextSourceList
            sources={plusSources}
            query=""
            callService={callService}
            cache={sourceCacheRef.current!}
            onSelect={handleSelectContext}
          />
        </AnchoredPopover>
      )}
    </>
  );

  // ---- fallback：手写呈现（无 renderer / 类型缺失环境） ----
  const fallback = (
    <div
      className={`pactor-chat-composer${dragOver ? ' pactor-chat-composer--dragover' : ''}`}
      {...dragHandlers}
    >
      {attachments !== undefined && (
        <ComposerAttachments
          attachments={attachments}
          onRemove={(id) =>
            onAttachmentsChange?.(attachments.filter((a) => a.id !== id))
          }
          onClick={onAttachmentClick}
        />
      )}
      {contextChips !== undefined && (
        <ComposerContextChips
          chips={contextChips}
          onRemove={(chip) =>
            onContextChipsChange?.(
              contextChips.filter(
                (existing) =>
                  !(
                    existing.id === chip.id &&
                    existing.trigger === chip.trigger
                  ),
              ),
            )
          }
        />
      )}
      <div className="pactor-chat-composer__row">
        <textarea
          ref={inputRef}
          className="pactor-chat-composer__input"
          rows={1}
          value={text}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleChange}
          onCompositionStart={() => {
            composingRef.current = true;
          }}
          onCompositionEnd={() => {
            composingRef.current = false;
          }}
          onPaste={(event) => {
            if (handlePasteFiles(event.clipboardData)) {
              event.preventDefault();
            }
          }}
          onKeyDown={(event) => {
            // IME 合成中 Enter 仅结束合成，不发送
            if (event.nativeEvent.isComposing || composingRef.current) {
              return;
            }
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              send();
            }
          }}
        />
        {/* 发送 / 停止：同一按钮元素的状态切换；hideToolbar 时一并抑制
            （与 DSL 路径语义一致，Enter 发送保留） */}
        {hideToolbar ? null : (
          <button
            type="button"
            className={`pactor-chat-composer__button${streaming ? ' pactor-chat-composer__button--stop' : ''}`}
            title={streaming ? '停止生成' : '发送'}
            aria-label={streaming ? '停止生成' : '发送'}
            disabled={streaming ? false : disabled || !text.trim()}
            onClick={streaming ? onStop : send}
          >
            {streaming ? <Icon name="square" size={14} className="pactor-chat-icon-fill" /> : <Icon name="arrow-up" size={16} />}
          </button>
        )}
      </div>
      {showToolbar && (
        <div className="pactor-chat-composer__toolbar">
          {toolbarStart}
          <span className="pactor-chat-composer__toolbar-spacer" />
          {(onPlusMenu || builtinPlusEnabled) && (
            <button
              ref={plusButtonRef}
              type="button"
              className="pactor-chat-icon-button"
              title="更多功能"
              aria-label="更多功能"
              onClick={() => {
                const rect = plusButtonRef.current!.getBoundingClientRect();
                if (onPlusMenu) {
                  // 调用方回调优先（spec: chat-context-sources / 回调优先）
                  onPlusMenu(rect);
                } else {
                  setPlusAnchor(rect);
                }
              }}
            >
              <Icon name="plus" size={14} />
            </button>
          )}
          {onAttachFiles && (
            <button
              type="button"
              className="pactor-chat-icon-button"
              title="添加附件"
              aria-label="添加附件"
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon name="paperclip" size={14} />
            </button>
          )}
          {modelChipEnabled && (
            <ModelSelect
              models={models!}
              model={model}
              onModelChange={onModelChange}
            />
          )}
          {toolbarEnd}
        </div>
      )}
      {composerFooter !== undefined && composerFooter !== null ? (
        <div className="pactor-chat-composer__footer">{composerFooter}</div>
      ) : null}
      {fileInputNode}
      {popoverNodes}
    </div>
  );

  // ---- DSL 路径：ChatInput 组合呈现 ----
  const bridge: ComposerBridge = {
    text,
    streaming,
    disabled,
    attachments,
    contextChips,
    toolbarStart,
    toolbarEnd,
    composerFooter,
    models,
    model,
    showPlus: onPlusMenu !== undefined || builtinPlusEnabled,
    showAttach: onAttachFiles !== undefined,
    modelChipEnabled,
    send,
    stop: onStop,
    openFilePicker: () => fileInputRef.current?.click(),
    plusClick: (rect) => {
      if (onPlusMenu) {
        onPlusMenu(rect);
      } else {
        setPlusAnchor(rect);
      }
    },
    removeAttachment: (id) =>
      onAttachmentsChange?.((attachments ?? []).filter((a) => a.id !== id)),
    attachmentClick: onAttachmentClick,
    removeChip: (chip) =>
      onContextChipsChange?.(
        (contextChips ?? []).filter(
          (existing) =>
            !(
              existing.id === chip.id && existing.trigger === chip.trigger
            ),
        ),
      ),
    modelChange: onModelChange,
  };

  return (
    <ChromeSlot
      fragment={buildComposerFragment({
        placeholder,
        disabled,
        hasFooter: composerFooter !== undefined && composerFooter !== null,
        hideToolbar,
      })}
      components={COMPOSER_INTERNAL_COMPONENTS}
      fallback={fallback}
      wrap={(children) => (
        <ComposerBridgeContext.Provider value={bridge}>
          <div
            className={`pactor-chat-composer pactor-chat-composer--dsl${dragOver ? ' pactor-chat-composer--dragover' : ''}`}
            {...dragHandlers}
            onChange={handleBubbleChange}
            onPaste={(event) => {
              if (handlePasteFiles(event.clipboardData)) {
                event.preventDefault();
              }
            }}
          >
            {children}
            {fileInputNode}
            {popoverNodes}
          </div>
        </ComposerBridgeContext.Provider>
      )}
    />
  );
}
