import type { DslNode } from '@pactor-app/core';
import {
  isValidElement,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type DragEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { useI18n } from '@pactor-app/runtime';

import { cn } from '../../lib/utils.js';
import type { ChatModelCapability, ChatModelOption } from '../../model.js';
import { ChatInput, useOptionalRenderer } from '@pactor-app/ui/components';
import { Icon } from '@pactor-app/ui/components';
import { Attachment, type AttachmentItemData } from '../Attachment/index.js';
import { MentionInput, type MentionInputHandle } from './mention-input.js';

/** 模型能力徽章（模型选择子集） */
export type ComposerModelCapability = ChatModelCapability;

/** 模型选项（模型选择 chip 的候选；扩展字段可选，缺省行为不变） */
export type ComposerModelOption = ChatModelOption;

/** 上下文条目（提及候选与行内提及块共用） */
export interface ComposerContextItem {
  id: string;
  label: string;
  /** 来源触发符，缺省继承 source */
  trigger?: string;
  /** 图标名（Icon 白名单；缺省按 source.icon 或触发符兜底） */
  icon?: string;
  /** 原始数据（随选中结果透传给调用方） */
  data?: unknown;
  /** 该上下文占用的 token 数（提供后展示 token 托盘与合计） */
  tokens?: number;
}

/**
 * 上下文数据源：trigger 为声明的触发字符（如 '@' / '+'）——
 * 输入该字符（词边界）时在光标位置弹出候选菜单（行内提及）；
 * trigger 为 '+' 时工具栏左端同时渲染 + 按钮弹层（选中在光标处插入行内块）
 */
export interface ComposerContextSource {
  trigger: string;
  label: string;
  items: ComposerContextItem[];
  /** 菜单项与提及块的缺省图标（Icon 白名单） */
  icon?: string;
}

/** 生成模式：ask 只询问 / plan 先规划 / act 直接执行 */
export type ComposerMode = 'ask' | 'plan' | 'act';

const MODES: readonly ComposerMode[] = ['ask', 'plan', 'act'];

/** 斜杠命令（选中只插入文本，不执行） */
export interface ComposerCommand {
  /** 命令名（插入为 `/name `） */
  name: string;
  /** 菜单描述 */
  description?: string;
  /** 图标名（Icon 白名单） */
  icon?: string;
}

/** 排队消息（streaming 时 Enter 入队，由宿主在运行结束后发送） */
export interface ComposerQueueItem {
  id: string;
  text: string;
}

export type ComposerRejectReason = 'type' | 'size' | 'count';

/** 被文件规则拒绝的文件及原因 */
export interface ComposerRejectedFile {
  file: File;
  reason: ComposerRejectReason;
}

export interface ComposerFileRules {
  /** 允许的类型：扩展名（'.png' / 'png'）、MIME（'image/png'）或通配（'image/*'） */
  accept?: string[];
  /** 单文件大小上限（字节） */
  maxSize?: number;
  /** 文件数量上限（含现有附件数） */
  maxFiles?: number;
}

export interface ComposerFileCheckResult {
  accepted: File[];
  rejected: ComposerRejectedFile[];
}

/** 单个文件是否命中 accept 规则 */
function matchesAccept(file: File, accept: string[]): boolean {
  return accept.some((rule) => {
    const normalized = rule.trim().toLowerCase();
    if (!normalized) return false;
    if (normalized.startsWith('.')) {
      return file.name.toLowerCase().endsWith(normalized);
    }
    if (normalized.endsWith('/*')) {
      return file.type.toLowerCase().startsWith(normalized.slice(0, -1));
    }
    if (normalized.includes('/')) {
      return file.type.toLowerCase() === normalized;
    }
    return file.name.toLowerCase().endsWith(`.${normalized}`);
  });
}

/**
 * 纯函数：按 accept / maxSize / maxFiles 过滤文件。
 * 拒绝原因按 type → size → count 顺序判定；`existingCount` 为已有附件数
 * （maxFiles 按总数约束）。未配置任何规则时原样接受。
 */
export function checkFiles(
  files: File[],
  rules: ComposerFileRules,
  existingCount = 0,
): ComposerFileCheckResult {
  const accepted: File[] = [];
  const rejected: ComposerRejectedFile[] = [];
  const capacity =
    rules.maxFiles === undefined
      ? Number.POSITIVE_INFINITY
      : Math.max(0, rules.maxFiles - existingCount);

  for (const file of files) {
    if (rules.accept !== undefined && !matchesAccept(file, rules.accept)) {
      rejected.push({ file, reason: 'type' });
      continue;
    }
    if (rules.maxSize !== undefined && file.size > rules.maxSize) {
      rejected.push({ file, reason: 'size' });
      continue;
    }
    if (accepted.length >= capacity) {
      rejected.push({ file, reason: 'count' });
      continue;
    }
    accepted.push(file);
  }

  return { accepted, rejected };
}

export interface ComposerProps {
  /** 受控值（提供即受控） */
  value?: string;
  /** 占位提示 */
  placeholder?: string;
  /** 禁用输入与发送 */
  disabled?: boolean;
  /** 发送中（禁用发送钮，由调用方在完成后复位） */
  loading?: boolean;
  /** 流式生成中：发送钮切换为停止钮（不禁用、不阻断输入），点击经 onStop 传出 */
  streaming?: boolean;
  /** 停止当前生成（streaming 时点击停止钮） */
  onStop?: () => void;
  /** 最小行数，缺省 3 */
  rows?: number;
  /** 附件列表（展示在输入区上方） */
  attachments?: AttachmentItemData[];
  /** 附件移除事件，传出 id / 下标 */
  onRemoveAttachment?: (id: string | number) => void;
  /** 附件重试事件，传出 id / 下标 */
  onRetryAttachment?: (id: string | number) => void;
  /** 附件卡片点击事件（预览等由调用方实现），传出该附件项 */
  onAttachmentClick?: (attachment: AttachmentItemData) => void;
  /**
   * 附件选择入口（提供时工具栏左端渲染附件钮，并启用粘贴 / 拖拽文件）；
   * 上传与存储由调用方负责
   */
  onAttachFiles?: (files: File[]) => void;
  /** 输入事件，传出 string 值（行内提及块序列化为 trigger+label） */
  onChange?: (value: string) => void;
  /** 发送事件（点击发送钮或 Enter），传出当前文本 */
  onSubmit?: (value: string) => void;
  /**
   * 排队消息（受控）：提供 `onQueueChange` 即启用排队——streaming 时
   * Enter 不再发送，而是追加到队列并清空输入；运行结束后由宿主取队首
   * 发送（组件不自动发送）。队列渲染在输入区上方，可逐条移除。
   */
  queue?: ComposerQueueItem[];
  /** 队列变更（入队 / 移除），传出新数组 */
  onQueueChange?: (queue: ComposerQueueItem[]) => void;
  /** 生成模式（受控；未提供时内部自持，缺省 act） */
  mode?: ComposerMode;
  /** 模式切换（点击 / 方向键） */
  onModeChange?: (mode: ComposerMode) => void;
  /**
   * 展示 Ask / Plan / Act 模式切换（缺省 false）。
   * 关闭时完全不渲染，不影响现有布局。
   */
  showModes?: boolean;
  /** 斜杠命令候选（输入 `/` 开头时按名称过滤，选中只插入 `/name `） */
  commands?: ComposerCommand[];
  /** 文件类型白名单（扩展名 / MIME / 通配） */
  accept?: string[];
  /** 单文件大小上限（字节） */
  maxSize?: number;
  /** 文件数量上限（含现有附件） */
  maxFiles?: number;
  /** 被规则拒绝的文件（类型 / 大小 / 数量） */
  onReject?: (rejected: ComposerRejectedFile[]) => void;
  /** 模型选项（非空时工具栏右端渲染模型选择 chip，位于发送钮之前） */
  models?: ComposerModelOption[];
  /** 当前选中模型 value（未命中时展示 models[0]） */
  model?: string;
  /** 弹层中选中模型时触发，传出 value */
  onModelChange?: (value: string) => void;
  /**
   * 上下文数据源（行内提及）：配置后输入区切换为 contenteditable——
   * 输入触发符在光标位置弹出候选菜单（输入过滤 / ↑↓ 选择 / 回车选中），
   * 选中把触发符与已输入文字替换为行内提及块（图标 + 文字、浅色背景、
   * 圆角，退格整体删除）
   */
  contexts?: ComposerContextSource[];
  /** 行内提及块列表（受控，与输入区保持同步） */
  contextItems?: ComposerContextItem[];
  /** 提及块变更事件（插入 / 退格删除），传出输入区当前块列表；发送后的清空由调用方在 onSubmit 闭环里处理 */
  onContextItemsChange?: (items: ComposerContextItem[]) => void;
  /**
   * 调用方接管 '@' 提及触发（优先于内建行内提及）：提供时 contexts 中
   * trigger 为 '@' 的源不再启用内建菜单；输入区回退纯 textarea（无其他
   * 源时），词边界 '@' 输入经本回调传出 query（'@' 后文本）与锚点 rect
   */
  onMentionTrigger?: (query: string, anchorRect: DOMRect) => void;
  /**
   * 调用方接管 '+' 按钮弹层（优先于内建弹层）：提供时工具栏左端始终
   * 渲染 '+' 钮，点击经本回调传出锚点 rect，不再打开内建候选弹层
   */
  onPlusMenu?: (anchorRect: DOMRect) => void;
  /** 工具栏左端槽（渲染在内建 '+' / 附件钮之前；DslNode 或 React 元素） */
  toolbarStart?: DslNode | ReactNode;
  /** 工具栏右端槽（渲染在模型选择 chip 之后、发送钮之前；DslNode 或 React 元素） */
  toolbarEnd?: DslNode | ReactNode;
  /**
   * 隐藏工具栏行（缺省 false）：true 时工具栏行整体不渲染——内建
   * '+' / 附件钮、模型 chip、发送 / 停止钮与 toolbarStart / toolbarEnd
   * 槽一并抑制（footer 槽不受影响）；Enter 发送保留
   */
  hideToolbar?: boolean;
  /** footer 槽（渲染在输入框内工具栏下方，以分隔线相隔；DslNode 或 React 元素） */
  footer?: DslNode | ReactNode;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

const toolButtonClass =
  'flex cursor-pointer items-center rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground';

const popoverPanelClass =
  'absolute bottom-full left-0 z-50 mb-2 max-h-72 w-64 overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md';

const popoverItemClass =
  'flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent';

/** 词边界 '@' 提及检测：返回 '@' 后 query，未命中返回 null */
function detectMention(text: string, caret: number): string | null {
  const beforeCaret = text.slice(0, caret);
  const match = /(?:^|\s)@([^\s@]*)$/.exec(beforeCaret);
  return match ? match[1]! : null;
}

/** 词尾 '/' 命令检测：返回 query 与 '/' 在文本中的下标 */
function detectCommand(
  text: string,
): { query: string; start: number } | null {
  const match = /(?:^|\s)\/([^\s/]*)$/.exec(text);
  if (!match) return null;
  return {
    query: match[1]!,
    start: match.index + match[0].lastIndexOf('/'),
  };
}

let queueSeq = 0;

function createQueueItem(text: string): ComposerQueueItem {
  queueSeq += 1;
  return { id: `queue-${Date.now()}-${queueSeq}`, text };
}

/**
 * Composer 适配器（shadcn kit）：会话输入组合件——
 * 附件区（Attachment）+ 输入区（ChatInput）。
 *
 * - 附件：受控 attachments 展示；提供 onAttachFiles 时工具栏左端渲染
 *   附件钮，并启用粘贴 / 拖拽文件入口（上传由调用方负责）
 * - 模型选择：models 非空时工具栏右端渲染模型 chip（发送钮之前），
 *   弹层选中经 onModelChange 传出
 * - 行内提及（MentionInput）：contexts 非空时输入区切换为
 *   contenteditable——输入触发符（'@' 等）在光标位置弹出候选菜单
 *   （输入过滤 / ↑↓ / 回车选中 / 点击选中），选中把触发符与已输入
 *   文字替换为行内提及块（图标 + 文字、浅色背景、圆角），退格整体
 *   删除；'+' 触发源额外在工具栏左端渲染 + 按钮弹层（选中在光标处
 *   插入行内块）；块列表受控（contextItems + onContextItemsChange）。
 *   注入 onMentionTrigger / onPlusMenu 时对应内建 '@' 提及 / '+' 弹层
 *   让位给调用方（回调优先，锚点 rect 随回调传出）
 * - 运行态：streaming 时发送钮切换为停止钮，点击经 onStop 传出
 * - 排队（opt-in）：提供 onQueueChange 时，streaming 中 Enter 入队而非
 *   发送；队列展示在输入区上方，可逐条移除
 * - 模式（opt-in）：showModes 时工具栏左端渲染 Ask / Plan / Act
 * - 命令（opt-in）：commands 非空时输入 `/` 触发过滤菜单，选中只插入
 * - 上下文 token：条目带 tokens 时输入区上方展示托盘与合计
 * - 文件规则（opt-in）：accept / maxSize / maxFiles，拒绝项经 onReject
 * - 扩展槽：toolbarStart / toolbarEnd（工具栏左 / 右端，DslNode 或
 *   React 元素）；hideToolbar 时工具栏行（含发送 / 停止钮）整体不渲染，
 *   Enter 发送保留
 * - footer 槽渲染在输入框内工具栏下方（分隔线相隔）
 *
 * 上传 / transport 由调用方负责，本组件只做呈现与事件上报。
 */
export function Composer({
  value,
  placeholder,
  disabled,
  loading,
  streaming = false,
  onStop,
  rows,
  attachments = [],
  onRemoveAttachment,
  onRetryAttachment,
  onAttachmentClick,
  onAttachFiles,
  onChange,
  onSubmit,
  queue,
  onQueueChange,
  mode,
  onModeChange,
  showModes = false,
  commands,
  accept,
  maxSize,
  maxFiles,
  onReject,
  models,
  model,
  onModelChange,
  contexts,
  contextItems,
  onContextItemsChange,
  onMentionTrigger,
  onPlusMenu,
  toolbarStart,
  toolbarEnd,
  hideToolbar = false,
  footer,
  className,
  style,
}: ComposerProps) {
  const { t } = useI18n();
  const renderer = useOptionalRenderer();
  const rootRef = useRef<HTMLDivElement>(null);
  // 受控 / 非受控文本
  const textControlled = value !== undefined;
  const [innerText, setInnerText] = useState('');
  const text = textControlled ? value : innerText;

  const [dragOver, setDragOver] = useState(false);
  // 弹层状态：'+' 菜单 / 模型选择，同时至多一个（@ 提及菜单由 MentionInput 自持）
  const [plusOpen, setPlusOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  // 模型搜索词：仅扩展元数据（分组 / 徽章等）启用时生效
  const [modelQuery, setModelQuery] = useState('');
  const [commandState, setCommandState] = useState<{
    query: string;
    start: number;
  } | null>(null);
  const [commandIndex, setCommandIndex] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mentionRef = useRef<MentionInputHandle>(null);

  // 模式：受控 / 非受控（缺省 act）
  const [innerMode, setInnerMode] = useState<ComposerMode>('act');
  const currentMode = mode ?? innerMode;

  // 队列：提供 onQueueChange 即启用；queue 受控时以 props 为准
  const queueEnabled = onQueueChange !== undefined;
  const [innerQueue, setInnerQueue] = useState<ComposerQueueItem[]>([]);
  const queueItems = queue ?? innerQueue;

  const sources = (contexts ?? []).filter(
    // 调用方接管 '@' 提及时对应源不启用内建行内提及（回调优先）
    (source) => !(onMentionTrigger !== undefined && source.trigger === '@'),
  );
  // contexts 非空即行内提及模式（contenteditable 输入区）
  const rich = sources.length > 0;
  const plusSources = sources.filter((s) => s.trigger === '+');
  const plusEnabled = plusSources.length > 0 || onPlusMenu !== undefined;
  const modelEnabled = models !== undefined && models.length > 0;
  const currentModel = models?.find((m) => m.value === model) ?? models?.[0];
  // 模型选择子集：任一选项带扩展元数据即启用搜索 / 分组 / 徽章；
  // 仅 value + label 的既有用法保持原样（不出现搜索框与分组）
  const modelExtended = (models ?? []).some(
    (option) =>
      option.description !== undefined ||
      option.provider !== undefined ||
      option.contextWindow !== undefined ||
      (option.capabilities?.length ?? 0) > 0 ||
      option.recommended === true,
  );
  const modelQueryNormalized = modelQuery.trim().toLowerCase();
  const visibleModels = (models ?? []).filter((option) => {
    if (!modelExtended || modelQueryNormalized === '') {
      return true;
    }
    return [option.label, option.value, option.provider, option.description].some(
      (field) => field?.toLowerCase().includes(modelQueryNormalized),
    );
  });
  // 有任一选项声明 provider 才分组（同服务商连续排列；未声明者归入无标题组）
  const modelGrouped =
    modelExtended && visibleModels.some((option) => option.provider !== undefined);
  const modelGroups: { provider?: string; options: ComposerModelOption[] }[] = [];
  if (modelGrouped) {
    for (const option of visibleModels) {
      let group = modelGroups.find((item) => item.provider === option.provider);
      if (!group) {
        group = { provider: option.provider, options: [] };
        modelGroups.push(group);
      }
      group.options.push(option);
    }
  }
  const commandEnabled =
    commands !== undefined && commands.length > 0 && !rich;
  const filteredCommands = commandEnabled
    ? commands.filter((command) =>
        command.name
          .toLowerCase()
          .includes((commandState?.query ?? '').toLowerCase()),
      )
    : [];

  const [innerChips, setInnerChips] = useState<ComposerContextItem[]>([]);
  // contextItems 未提供时块列表内部自持（非受控）：否则 MentionInput 的
  // 受控同步效应会以空列表把刚插入的行内块全部移除
  const chipsControlled = contextItems !== undefined;
  const chips = chipsControlled ? contextItems : innerChips;
  const chipsWithTokens = chips.filter(
    (chip) => typeof chip.tokens === 'number',
  );
  const totalTokens = chipsWithTokens.reduce(
    (total, chip) => total + (chip.tokens ?? 0),
    0,
  );

  const handleChipsChange = (next: ComposerContextItem[]): void => {
    if (!chipsControlled) {
      setInnerChips(next);
    }
    onContextItemsChange?.(next);
  };

  const closePopovers = (): void => {
    setPlusOpen(false);
    setModelOpen(false);
    setCommandState(null);
    setModelQuery('');
  };

  const handleChange = (next: string): void => {
    if (!textControlled) {
      setInnerText(next);
    }
    onChange?.(next);
    // '/' 命令菜单：仅纯 textarea 路径（行内提及模式由 MentionInput 自持）
    if (commandEnabled) {
      const detected = detectCommand(next);
      setCommandState(detected);
      setCommandIndex(0);
      if (detected) {
        setPlusOpen(false);
        setModelOpen(false);
      }
    }
  };

  const enqueue = (submitted: string): void => {
    const next = [...queueItems, createQueueItem(submitted.trim())];
    if (queue === undefined) {
      setInnerQueue(next);
    }
    onQueueChange?.(next);
    if (!textControlled) {
      setInnerText('');
    }
    // 受控文本同样清空：通知宿主更新 value
    onChange?.('');
    setAnnouncement(t('pactor.chat.composer.queued'));
  };

  const handleSubmit = (submitted: string): void => {
    // streaming 且启用排队：Enter 入队而非发送（宿主在运行结束后发下一条）
    if (streaming && queueEnabled && submitted.trim() !== '') {
      enqueue(submitted);
      return;
    }
    onSubmit?.(submitted);
    if (!textControlled) {
      setInnerText('');
    }
    closePopovers();
    // 提及块不在此清空：受控数据由调用方在 onSubmit 闭环里发送完成后清空
    // （此处同步清空会抢在 DSL 发送动作读取 state 之前执行）
  };

  const selectContext = (item: ComposerContextItem, source: ComposerContextSource): void => {
    if (rich) {
      // 行内提及模式：在光标处插入提及块（块列表经 onChipsChange 同步出去）
      mentionRef.current?.insertChip(item, source);
    } else {
      const chip: ComposerContextItem = { ...item, trigger: item.trigger ?? source.trigger };
      const duplicated = chips.some(
        (existing) => existing.id === chip.id && existing.trigger === chip.trigger,
      );
      if (!duplicated) {
        handleChipsChange([...chips, chip]);
      }
    }
    closePopovers();
  };

  const removeQueued = (id: string): void => {
    const next = queueItems.filter((item) => item.id !== id);
    if (queue === undefined) {
      setInnerQueue(next);
    }
    onQueueChange?.(next);
  };

  const selectCommand = (command: ComposerCommand): void => {
    if (!commandState) return;
    const nextText =
      text.slice(0, commandState.start) + `/${command.name} `;
    handleChange(nextText);
    setCommandState(null);
    // 选中后把焦点交还输入区
    rootRef.current
      ?.querySelector<HTMLTextAreaElement>('textarea')
      ?.focus();
  };

  const changeMode = (nextMode: ComposerMode): void => {
    if (mode === undefined) {
      setInnerMode(nextMode);
    }
    onModeChange?.(nextMode);
  };

  const handleModeKeyDown = (
    event: KeyboardEvent<HTMLElement>,
    index: number,
  ): void => {
    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (index + 1) % MODES.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (index - 1 + MODES.length) % MODES.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = MODES.length - 1;
    }
    if (nextIndex === null) return;
    event.preventDefault();
    const nextMode = MODES[nextIndex]!;
    changeMode(nextMode);
    const buttons = event.currentTarget.parentElement?.querySelectorAll<
      HTMLElement
    >('[data-slot=composer-mode]');
    buttons?.[nextIndex]?.focus();
  };

  const hasFileRules =
    accept !== undefined || maxSize !== undefined || maxFiles !== undefined;

  const emitFiles = (files: File[]): void => {
    if (files.length === 0 || !onAttachFiles) {
      return;
    }
    if (!hasFileRules) {
      onAttachFiles(files);
      return;
    }
    const { accepted, rejected } = checkFiles(
      files,
      { accept, maxSize, maxFiles },
      attachments.length,
    );
    if (rejected.length > 0) {
      onReject?.(rejected);
      setAnnouncement(
        t('pactor.chat.composer.attachmentsRejected', {
          count: rejected.length,
        }),
      );
    }
    if (accepted.length > 0) {
      onAttachFiles(accepted);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    if (!onAttachFiles) {
      return;
    }
    event.preventDefault();
    setDragOver(false);
    emitFiles(Array.from(event.dataTransfer?.files ?? []));
  };

  // 命令菜单键盘：捕获阶段拦截，避免 Enter 触发发送 / 方向键移动光标
  const handleRootKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (!commandState || !commandEnabled) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setCommandState(null);
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      event.stopPropagation();
      if (filteredCommands.length === 0) return;
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      setCommandIndex(
        (commandIndex + delta + filteredCommands.length) %
          filteredCommands.length,
      );
      return;
    }
    if (event.key === 'Enter') {
      const command = filteredCommands[commandIndex];
      // 菜单打开时 Enter 只用于选中命令，绝不下发给发送逻辑
      event.preventDefault();
      event.stopPropagation();
      if (command) {
        selectCommand(command);
      }
    }
  };

  // 槽位渲染：React 元素直接渲染，DslNode 经 Renderer（无 Renderer 上下文不渲染）
  const renderSlot = (slot: DslNode | ReactNode): ReactNode =>
    isValidElement(slot) || typeof slot !== 'object' || slot === null
      ? slot
      : (renderer?.renderChildren([slot as DslNode]) ?? null);

  const modeSelector = showModes ? (
    <div
      data-slot="composer-modes"
      role="radiogroup"
      aria-label={t('pactor.chat.composer.mode')}
      className="flex items-center gap-0.5 rounded-md border border-border p-0.5"
    >
      {MODES.map((item, index) => (
        <button
          key={item}
          type="button"
          role="radio"
          data-slot="composer-mode"
          data-mode={item}
          aria-checked={currentMode === item}
          tabIndex={currentMode === item ? 0 : -1}
          className={cn(
            'cursor-pointer rounded-sm px-2 py-1 text-xs transition-colors',
            currentMode === item
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
          onClick={() => changeMode(item)}
          onKeyDown={(event) => handleModeKeyDown(event, index)}
        >
          {t(`pactor.chat.composer.mode.${item}`)}
        </button>
      ))}
    </div>
  ) : undefined;

  const builtinToolbarStart =
    plusEnabled || onAttachFiles ? (
      <>
        {plusEnabled ? (
          <button
            type="button"
            aria-label={t('pactor.chat.composer.addContext')}
            title={t('pactor.chat.composer.addContext')}
            className={toolButtonClass}
            onClick={(event) => {
              if (onPlusMenu) {
                // 调用方接管弹层（回调优先）：传出按钮锚点 rect
                onPlusMenu(event.currentTarget.getBoundingClientRect());
                return;
              }
              setPlusOpen((prev) => !prev);
              setModelOpen(false);
            }}
          >
            <Icon name="plus" size="sm" />
          </button>
        ) : null}
        {onAttachFiles ? (
          <button
            type="button"
            aria-label={t('pactor.chat.composer.addAttachment')}
            title={t('pactor.chat.composer.addAttachment')}
            className={toolButtonClass}
            onClick={() => fileInputRef.current?.click()}
          >
            <Icon name="paperclip" size="sm" />
          </button>
        ) : null}
      </>
    ) : undefined;

  const builtinToolbarEnd = modelEnabled ? (
    <button
      type="button"
      aria-label={t('pactor.chat.composer.selectModel')}
      title={t('pactor.chat.composer.selectModel')}
      className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
      onClick={() => {
        if (!modelOpen) {
          setModelQuery('');
        }
        setModelOpen((prev) => !prev);
        setPlusOpen(false);
      }}
    >
      {currentModel?.label}
      <Icon name="chevrons-up-down" size={12} />
    </button>
  ) : undefined;

  const hasToolbarStart =
    (toolbarStart !== undefined && toolbarStart !== null) ||
    modeSelector !== undefined ||
    builtinToolbarStart !== undefined;
  const toolbarStartSlot = hasToolbarStart ? (
    <>
      {toolbarStart !== undefined && toolbarStart !== null
        ? renderSlot(toolbarStart)
        : null}
      {modeSelector}
      {builtinToolbarStart}
    </>
  ) : undefined;

  const toolbarEndSlot =
    toolbarEnd !== undefined && toolbarEnd !== null ? (
      <>
        {builtinToolbarEnd}
        {renderSlot(toolbarEnd)}
      </>
    ) : (
      builtinToolbarEnd
    );

  // 调用方接管 '@' 提及（纯 textarea 路径）：冒泡监听内建 textarea
  // 变更，词边界 '@' 命中即传出 query 与锚点 rect
  const handleBubbleChange = (event: ChangeEvent<HTMLDivElement>): void => {
    const target = event.target;
    if (!(target instanceof HTMLTextAreaElement)) {
      return;
    }
    const query = detectMention(
      target.value,
      target.selectionStart ?? target.value.length,
    );
    if (query !== null) {
      onMentionTrigger?.(query, target.getBoundingClientRect());
    }
  };

  // 模型选项：基础字段只渲染 label + 选中标记；扩展元数据按需追加
  const renderModelOption = (option: ComposerModelOption) => {
    const selected = option.value === currentModel?.value;
    return (
      <button
        key={option.value}
        type="button"
        role="option"
        data-slot="composer-model-option"
        data-value={option.value}
        aria-selected={selected}
        className={popoverItemClass}
        onClick={() => {
          onModelChange?.(option.value);
          closePopovers();
        }}
      >
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="truncate">{option.label}</span>
            {option.recommended ? (
              <span
                data-slot="composer-model-recommended"
                className="shrink-0 rounded-sm bg-primary/10 px-1 text-[10px] text-primary"
              >
                {t('pactor.chat.modelPicker.recommended')}
              </span>
            ) : null}
          </span>
          {option.description !== undefined || option.contextWindow !== undefined ? (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {option.description !== undefined ? (
                <span className="truncate">{option.description}</span>
              ) : null}
              {option.contextWindow !== undefined ? (
                <span data-slot="composer-model-context" className="shrink-0">
                  {t('pactor.chat.modelPicker.contextWindow', {
                    tokens: String(option.contextWindow),
                  })}
                </span>
              ) : null}
            </span>
          ) : null}
          {option.capabilities !== undefined && option.capabilities.length > 0 ? (
            <span className="mt-0.5 flex flex-wrap gap-1">
              {option.capabilities.map((capability) => (
                <span
                  key={capability}
                  data-slot="composer-model-capability"
                  data-capability={capability}
                  className="rounded-sm border border-border px-1 text-[10px] text-muted-foreground"
                >
                  {t(`pactor.chat.modelPicker.capability.${capability}`)}
                </span>
              ))}
            </span>
          ) : null}
        </span>
        {selected ? <Icon name="check" size={14} /> : null}
      </button>
    );
  };

  const activePopover = plusOpen ? 'plus' : modelOpen ? 'model' : null;
  const commandOpen =
    commandEnabled && commandState !== null;

  return (
    <div
      ref={rootRef}
      data-slot="composer"
      className={cn('relative flex w-full flex-col gap-2', className)}
      style={style}
      onDragOver={(event) => {
        if (onAttachFiles) {
          event.preventDefault();
          setDragOver(true);
        }
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onPaste={(event) => {
        const files = Array.from(event.clipboardData?.files ?? []);
        if (files.length > 0 && onAttachFiles) {
          event.preventDefault();
          emitFiles(files);
        }
      }}
      onChange={
        onMentionTrigger !== undefined && !rich ? handleBubbleChange : undefined
      }
      onKeyDownCapture={handleRootKeyDown}
    >
      {announcement ? (
        <p className="sr-only" role="status" aria-live="polite">
          {announcement}
        </p>
      ) : null}
      {attachments.length > 0 ? (
        <Attachment
          items={attachments}
          onRemove={onRemoveAttachment}
          onRetry={onRetryAttachment}
          onClick={onAttachmentClick}
        />
      ) : null}
      {queueItems.length > 0 ? (
        <div
          data-slot="composer-queue"
          className="flex flex-col gap-1 rounded-md border border-border bg-muted/40 p-2"
        >
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Icon name="list" size="sm" />
            {t('pactor.chat.composer.queue')}
            <span>{queueItems.length}</span>
          </div>
          <ul className="flex flex-col gap-1">
            {queueItems.map((item) => (
              <li
                key={item.id}
                data-slot="composer-queue-item"
                className="flex items-center gap-2 rounded-sm bg-background px-2 py-1 text-sm"
              >
                <span className="min-w-0 flex-1 truncate">{item.text}</span>
                <button
                  type="button"
                  data-slot="composer-queue-remove"
                  aria-label={t('pactor.chat.composer.queueRemove', {
                    text: item.text,
                  })}
                  className="shrink-0 cursor-pointer rounded-sm p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                  onClick={() => removeQueued(item.id)}
                >
                  <Icon name="x" size={12} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {chipsWithTokens.length > 0 ? (
        <div
          data-slot="composer-context-tokens"
          className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground"
        >
          {chipsWithTokens.map((chip) => (
            <span
              key={`${chip.trigger ?? ''}:${chip.id}`}
              data-slot="composer-context-token"
              className="inline-flex items-center gap-1"
            >
              <Icon name={chip.icon ?? 'file-text'} size={12} />
              <span className="max-w-40 truncate">{chip.label}</span>
              <span>
                {t('pactor.chat.composer.contextTokens', {
                  tokens: chip.tokens ?? 0,
                })}
              </span>
            </span>
          ))}
          <span
            data-slot="composer-context-total"
            className="font-medium text-foreground"
          >
            {t('pactor.chat.composer.totalTokens', { tokens: totalTokens })}
          </span>
        </div>
      ) : null}
      <div className={cn(dragOver && 'rounded-xl ring-2 ring-ring/50')}>
        <ChatInput
          value={text}
          placeholder={placeholder}
          disabled={disabled || loading}
          streaming={streaming}
          onStop={onStop}
          rows={rows}
          hideSend={hideToolbar}
          toolbarStart={hideToolbar ? undefined : toolbarStartSlot}
          toolbarEnd={hideToolbar ? undefined : toolbarEndSlot}
          footer={footer}
          field={
            rich ? (
              <MentionInput
                ref={mentionRef}
                value={text}
                placeholder={placeholder}
                disabled={disabled || loading}
                sources={sources}
                chips={chips}
                onChipsChange={handleChipsChange}
                onChange={handleChange}
                onSubmit={handleSubmit}
              />
            ) : undefined
          }
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
      {onAttachFiles ? (
        <input
          ref={fileInputRef}
          type="file"
          multiple
          hidden
          accept={accept !== undefined && accept.length > 0 ? accept.join(',') : undefined}
          onChange={(event) => {
            emitFiles(Array.from(event.target.files ?? []));
            // 允许重复选择同一文件
            event.target.value = '';
          }}
        />
      ) : null}
      {commandOpen ? (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setCommandState(null)}
          />
          <div
            data-slot="composer-command-popover"
            className={cn(popoverPanelClass, 'w-72')}
            role="listbox"
            aria-label={t('pactor.chat.composer.commands')}
          >
            {filteredCommands.length === 0 ? (
              <div
                data-slot="composer-command-empty"
                className="px-2 py-1.5 text-xs text-muted-foreground"
              >
                {t('pactor.chat.composer.commandEmpty')}
              </div>
            ) : (
              filteredCommands.map((command, index) => (
                <button
                  key={command.name}
                  type="button"
                  role="option"
                  data-slot="composer-command-item"
                  aria-selected={index === commandIndex}
                  className={cn(
                    popoverItemClass,
                    index === commandIndex && 'bg-accent',
                  )}
                  onMouseEnter={() => setCommandIndex(index)}
                  onClick={() => selectCommand(command)}
                >
                  <Icon name={command.icon ?? 'terminal'} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">
                      /{command.name}
                    </span>
                    {command.description ? (
                      <span className="block truncate text-xs text-muted-foreground">
                        {command.description}
                      </span>
                    ) : null}
                  </span>
                </button>
              ))
            )}
          </div>
        </>
      ) : null}
      {activePopover !== null ? (
        <>
          {/* 点击弹层外部关闭 */}
          <div className="fixed inset-0 z-40" onClick={closePopovers} />
          {activePopover === 'model' ? (
            <div
              data-slot="composer-model-popover"
              className={cn(
                popoverPanelClass,
                'right-0 left-auto',
                modelExtended ? 'w-64' : 'w-48',
              )}
            >
              {modelExtended ? (
                <input
                  type="search"
                  data-slot="composer-model-search"
                  aria-label={t('pactor.chat.modelPicker.search')}
                  placeholder={t('pactor.chat.modelPicker.search')}
                  value={modelQuery}
                  autoFocus
                  className="mb-1 w-full rounded-sm border border-border bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  onChange={(event) => setModelQuery(event.target.value)}
                />
              ) : null}
              <div role="listbox" aria-label={t('pactor.chat.composer.selectModel')}>
                {visibleModels.length === 0 ? (
                  <div
                    data-slot="composer-model-empty"
                    className="px-2 py-3 text-center text-xs text-muted-foreground"
                  >
                    {t('pactor.chat.modelPicker.empty')}
                  </div>
                ) : modelGrouped ? (
                  modelGroups.map((group) => (
                    <div
                      key={group.provider ?? '__default__'}
                      data-slot="composer-model-group"
                      data-provider={group.provider}
                    >
                      {group.provider !== undefined ? (
                        <div className="px-2 py-1 text-xs text-muted-foreground">
                          {group.provider}
                        </div>
                      ) : null}
                      {group.options.map(renderModelOption)}
                    </div>
                  ))
                ) : (
                  visibleModels.map(renderModelOption)
                )}
              </div>
            </div>
          ) : (
            <div data-slot="composer-context-popover" className={popoverPanelClass} role="listbox">
              {plusSources.map((source) =>
                source.items.length === 0 ? null : (
                  <div key={source.trigger}>
                    <div className="px-2 py-1 text-xs text-muted-foreground">{source.label}</div>
                    {source.items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={popoverItemClass}
                        onClick={() => selectContext(item, source)}
                      >
                        <Icon name={item.icon ?? source.icon ?? 'file-text'} size="sm" />
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      </button>
                    ))}
                  </div>
                ),
              )}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
