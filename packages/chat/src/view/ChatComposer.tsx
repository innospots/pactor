import {
  Composer as UiComposer,
} from '../components/Composer/index.js';
import { type AttachmentItemData } from '../components/Attachment/index.js';
import { useI18n } from '@pactor-app/runtime';
import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import type {
  ChatAttachment,
  ChatContextItem,
  ChatContextSource,
  ChatModelOption,
} from '../model.js';
import { AnchoredPopover } from './AnchoredPopover.js';
import { setChatChromeHandlers } from './chrome/actions.js';
import { ChromeSlot } from './chrome/ChromeSlot.js';
import {
  buildComposerFragment,
  COMPOSER_INTERNAL_COMPONENTS,
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
 * chat 组合层——展示由包内展示组件（src/components/Composer，自
 * @pactor-app/ui 迁入）承载（fallback 路径），本层只保留运行时接线：
 * 发送状态机回调映射、附件模型适配、词边界 '@'
 * 提及检测（内建弹层 / 调用方回调）、'+' 入口与 chrome DSL 桥接。
 *
 * - IME 守卫由 ui ChatInput 承担（合成中 Enter 不发送），本层不再实现
 * - 附件（D3）：受控 `attachments` + `onAttachmentsChange`；粘贴 / 拖拽 /
 *   文件选择产出 `File[]` 经 `onAttachFiles` 交给调用方（包内不上传）；
 *   卡片点击经 `onAttachmentClick` 通知
 * - 扩展槽：`toolbarStart` / `toolbarEnd` 渲染槽；词边界 `@` 触发
 *   `onMentionTrigger(query, anchorRect)`；"+" 按钮触发
 *   `onPlusMenu(anchorRect)`（无回调不渲染入口）
 * - 内建特性（chat-builtin-features）：models 非空时工具栏右端渲染
 *   模型 chip（toolbarEnd 之前）；contexts 配置且未注入调用方回调时
 *   启用内建 @ 提及 / + 菜单弹层，选中项追加为输入区上方的上下文
 *   chips（受控：contextChips + onContextChipsChange）
 * - chrome DSL 渲染层（spec: chat-composer-on-chatinput）：呈现层在
 *   DSL 环境经宿主 ChatInput 组合渲染（非受控 + chat.composerSubmit
 *   桥接 + 冒泡同步 / 附件承接），无 renderer 或类型缺失时回退
 *   ui Composer 组合路径，两条路径交互语义一致
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

/** 词边界 `@` 提及检测：返回 `@` 后 query，未命中返回 null */
function detectMention(text: string, caret: number): string | null {
  const beforeCaret = text.slice(0, caret);
  const match = /(?:^|\s)@([^\s@]*)$/.exec(beforeCaret);
  return match ? match[1]! : null;
}

function collectDropFiles(event: { dataTransfer: DataTransfer | null }): File[] {
  return event.dataTransfer ? Array.from(event.dataTransfer.files) : [];
}

/** ChatAttachment → ui AttachmentItemData（id 回查原对象用） */
function toAttachmentItem(attachment: ChatAttachment): AttachmentItemData {
  return {
    id: attachment.id,
    name: attachment.name,
    fileType: attachment.mimeType,
    fileSize: attachment.size,
  };
}

export function Composer({
  onSend,
  streaming = false,
  onStop,
  placeholder,
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
  const { t } = useI18n();
  const resolvedPlaceholder =
    placeholder ?? t('pactor.chat.composer.placeholder');
  const [text, setText] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 内建模型 chip（spec: chat-model-selector）：models 非空才渲染
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

  /** 文本同步与 mention 检测（DSL 冒泡与 fallback 冒泡共用） */
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

  // 冒泡承接：textarea 的 change 沿 React 树冒泡到容器（fallback 路径的
  // 文本同步由 ui Composer 受控 onChange 完成，此处重复同步同值无副作用）
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

  // "+" 入口：调用方回调优先，缺省内建弹层（锚点为按钮 rect）
  const showPlus = onPlusMenu !== undefined || builtinPlusEnabled;
  const handlePlusClick = (anchorRect: DOMRect): void => {
    if (onPlusMenu) {
      onPlusMenu(anchorRect);
    } else {
      setPlusAnchor(anchorRect);
    }
  };

  const removeChip = (chip: ChatContextItem): void =>
    onContextChipsChange?.(
      (contextChips ?? []).filter(
        (existing) =>
          !(existing.id === chip.id && existing.trigger === chip.trigger),
      ),
    );

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

  // ---- fallback：ui Composer 组合呈现（无 renderer / 类型缺失环境） ----
  // 展示全部归 ui Composer；本层补 chips 行（chat 独有形态）与弹层，
  // 附件 / 上下文模型经映射适配（ChatAttachment ↔ AttachmentItemData）。
  // --dsl 修饰类：盒模型让位 ChatInput 容器（与 chrome DSL 路径同款）
  const fallback = (
    <div
      className="pactor-chat-composer pactor-chat-composer--dsl"
      onChange={handleBubbleChange}
    >
      {contextChips !== undefined && (
        <ComposerContextChips chips={contextChips} onRemove={removeChip} />
      )}
      <UiComposer
        value={text}
        placeholder={resolvedPlaceholder}
        disabled={disabled}
        streaming={streaming}
        onStop={onStop}
        attachments={attachments?.map(toAttachmentItem)}
        onRemoveAttachment={
          attachments !== undefined
            ? (id) =>
                onAttachmentsChange?.(
                  (attachments ?? []).filter((a) => a.id !== id),
                )
            : undefined
        }
        onAttachmentClick={
          onAttachmentClick
            ? (item) => {
                const target = attachments?.find((a) => a.id === item.id);
                if (target) {
                  onAttachmentClick(target);
                }
              }
            : undefined
        }
        onAttachFiles={onAttachFiles}
        onChange={setText}
        onSubmit={() => send()}
        toolbarStart={toolbarStart}
        toolbarEnd={toolbarEnd}
        footer={composerFooter}
        hideToolbar={hideToolbar}
        onPlusMenu={showPlus ? handlePlusClick : undefined}
        models={models}
        model={model}
        onModelChange={onModelChange}
      />
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
    showPlus,
    showAttach: onAttachFiles !== undefined,
    modelChipEnabled,
    send,
    stop: onStop,
    openFilePicker: () => fileInputRef.current?.click(),
    plusClick: handlePlusClick,
    removeAttachment: (id) =>
      onAttachmentsChange?.((attachments ?? []).filter((a) => a.id !== id)),
    attachmentClick: onAttachmentClick,
    removeChip,
    modelChange: onModelChange,
  };

  return (
    <ChromeSlot
      fragment={buildComposerFragment({
        placeholder: resolvedPlaceholder,
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
