import {
  Bookmark,
  Check,
  Copy,
  HelpCircle,
  Pencil,
  Quote,
  RotateCcw,
  Share2,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';
import { useState, type ComponentType } from 'react';

import type {
  BuiltinMessageAction,
  ChatMessage,
  ChatMessageAction,
} from '../model.js';
import type { CallChatService } from './context-sources.js';

/**
 * MessageActions（spec: chat-message-actions / 消息操作条）：
 * 消息 hover 显现的操作条，数据驱动渲染——`actions` 缺省为
 * `['copy', 'regenerate', 'retry', 'edit']`（与历史硬编码渲染一致）；
 * 传入数组时严格按数组顺序与内容渲染（数组即真相，未列出的内建动作
 * 不出现）。内建动作保留包内默认行为（复制写剪贴板 / 重新生成 / 重试 /
 * 编辑进内联编辑框），配置的 label / icon / roles / visibleWhen 按字段
 * 覆盖内建默认描述；「regenerate 仅末条 assistant」与 transport 依赖为
 * 不可覆盖的附加约束。自定义动作（无 builtin）点击经 callService 派发
 * （未注入时 console.warn 跳过，不抛错）；全部动作点击并行触发
 * onMessageAction 通知。
 *
 * 接口边界（D0）：组件只做展示与回调触发，turn 驱动由调用方
 * （ChatView）注入；无回调时对应内建入口不渲染。
 */
export interface MessageActionsProps {
  message: ChatMessage;
  /**
   * 操作条声明式配置（spec: chat-message-actions，决策 D1）：
   * 缺省等价于 `['copy', 'regenerate', 'retry', 'edit']`；
   * 字符串项等价于 `{ id: <name>, builtin: <name> }`
   */
  actions?: Array<BuiltinMessageAction | ChatMessageAction>;
  /** 末条已完成 assistant：regenerate 附加约束（不可被配置覆盖） */
  showRegenerate?: boolean;
  /** 重新生成回调（未提供时 regenerate 不渲染） */
  onRegenerate?: () => void;
  /** user 消息编辑入口回调（未提供时 edit 不渲染） */
  onEdit?: () => void;
  /** error 消息重试回调（未提供时 retry 不渲染） */
  onRetry?: () => void;
  /** error 消息：重试入口常显（不依赖 hover） */
  forceVisible?: boolean;
  /** 自定义动作服务派发出口（ChatServices.callService 透传） */
  callService?: CallChatService;
  /** 全部动作（含内建）点击的并行通知 */
  onMessageAction?: (actionId: string, message: ChatMessage) => void;
}

/** 动作图标名 → lucide 子集（白名单式，同菜单 MENU_ICONS 口径；未知名渲染占位图标，不抛错） */
export const MESSAGE_ACTION_ICONS: Record<
  string,
  ComponentType<{ size?: number }>
> = {
  copy: Copy,
  check: Check,
  'rotate-ccw': RotateCcw,
  pencil: Pencil,
  quote: Quote,
  'thumbs-up': ThumbsUp,
  'thumbs-down': ThumbsDown,
  share: Share2,
  bookmark: Bookmark,
};

/** 内建动作默认描述（spec: chat-message-actions，决策 D2）：配置按字段覆盖，未给字段沿用 */
const BUILTIN_ACTION_DEFAULTS: Record<
  BuiltinMessageAction,
  {
    label: string;
    icon: string;
    roles: Array<'user' | 'assistant'>;
    visibleWhen: 'completed' | 'error' | 'always';
  }
> = {
  copy: {
    label: '复制',
    icon: 'copy',
    roles: ['assistant'],
    visibleWhen: 'completed',
  },
  regenerate: {
    label: '重新生成',
    icon: 'rotate-ccw',
    roles: ['assistant'],
    visibleWhen: 'completed',
  },
  retry: {
    label: '重试',
    icon: 'rotate-ccw',
    roles: ['assistant'],
    visibleWhen: 'error',
  },
  edit: {
    label: '编辑',
    icon: 'pencil',
    roles: ['user'],
    visibleWhen: 'completed',
  },
};

/** 解析后的动作描述：defaults 合并完成，可直接渲染 */
interface ResolvedMessageAction {
  id: string;
  builtin?: BuiltinMessageAction;
  label: string;
  icon?: string;
  roles: Array<'user' | 'assistant'>;
  visibleWhen: 'completed' | 'error' | 'always';
  service?: string;
}

/** 缺省（未配置 actions）等价数组：渲染与历史硬编码一致 */
const DEFAULT_ACTIONS: BuiltinMessageAction[] = [
  'copy',
  'regenerate',
  'retry',
  'edit',
];

/** 配置项归一化：字符串项 → { id, builtin }；内建字段并入默认描述（决策 D1/D2） */
export function resolveMessageActions(
  actions: Array<BuiltinMessageAction | ChatMessageAction> | undefined,
): ResolvedMessageAction[] {
  return (actions ?? DEFAULT_ACTIONS).map((item) => {
    const config: ChatMessageAction =
      typeof item === 'string' ? { id: item, builtin: item } : item;
    const defaults = config.builtin
      ? BUILTIN_ACTION_DEFAULTS[config.builtin]
      : undefined;
    return {
      id: config.id,
      builtin: config.builtin,
      label: config.label ?? defaults?.label ?? config.id,
      icon: config.icon ?? defaults?.icon,
      roles: config.roles ?? defaults?.roles ?? ['assistant'],
      visibleWhen: config.visibleWhen ?? defaults?.visibleWhen ?? 'completed',
      service: config.service,
    };
  });
}

/**
 * visibleWhen 状态匹配：'completed' 匹配非流式非错误终态（completed /
 * cancelled）；'error' 匹配 error；'always' 含 streaming
 */
function matchesStatus(
  visibleWhen: ResolvedMessageAction['visibleWhen'],
  status: ChatMessage['status'],
): boolean {
  if (visibleWhen === 'always') {
    return true;
  }
  if (visibleWhen === 'error') {
    return status === 'error';
  }
  return status === 'completed' || status === 'cancelled';
}

/** 收集消息的可复制文本（text / markdown part 按序拼接） */
export function collectMessageText(message: ChatMessage): string {
  return message.parts
    .filter(
      (part): part is Extract<ChatMessage['parts'][number], { content: string }> =>
        part.type === 'text' || part.type === 'markdown',
    )
    .map((part) => part.content)
    .join('\n');
}

export function MessageActions({
  message,
  actions,
  showRegenerate = false,
  onRegenerate,
  onEdit,
  onRetry,
  forceVisible = false,
  callService,
  onMessageAction,
}: MessageActionsProps) {
  const [copied, setCopied] = useState(false);

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(collectMessageText(message));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 剪贴板不可用（非安全上下文等）：静默忽略
    }
  };

  // 可见性集中求值（决策 D2）：roles 过滤角色 → visibleWhen 匹配状态 →
  // 内建附加约束（执行前提不满足不渲染，不可被配置覆盖）
  const visibleActions = resolveMessageActions(actions).filter((action) => {
    if (!action.roles.includes(message.role as 'user' | 'assistant')) {
      return false;
    }
    if (!matchesStatus(action.visibleWhen, message.status)) {
      return false;
    }
    switch (action.builtin) {
      case 'regenerate':
        return showRegenerate && onRegenerate !== undefined;
      case 'retry':
        return onRetry !== undefined;
      case 'edit':
        return onEdit !== undefined;
      default:
        return true;
    }
  });

  if (visibleActions.length === 0) {
    return null;
  }

  const dispatch = (action: ResolvedMessageAction): void => {
    switch (action.builtin) {
      case 'copy':
        void copy();
        break;
      case 'regenerate':
        onRegenerate?.();
        break;
      case 'retry':
        onRetry?.();
        break;
      case 'edit':
        onEdit?.();
        break;
      default:
        if (action.service) {
          if (callService) {
            void callService(action.service, {
              actionId: action.id,
              message,
            });
          } else {
            console.warn(
              `[@pactor/chat] 消息动作「${action.id}」配置了 service「${action.service}」但未注入 callService，已跳过派发`,
            );
          }
        }
    }
    // 全量动作（含内建）点击的并行通知；不影响内建默认行为
    onMessageAction?.(action.id, message);
  };

  return (
    <div
      className={`pactor-chat-message__actions${
        forceVisible ? ' pactor-chat-message__actions--visible' : ''
      }`}
    >
      {visibleActions.map((action) => {
        const copiedFeedback = action.builtin === 'copy' && copied;
        const label = copiedFeedback ? '已复制' : action.label;
        const iconName = copiedFeedback ? 'check' : action.icon;
        const Icon =
          iconName !== undefined ? MESSAGE_ACTION_ICONS[iconName] : undefined;
        return (
          <button
            key={action.id}
            type="button"
            className="pactor-chat-icon-button"
            title={label}
            aria-label={label}
            data-message-action={action.id}
            onClick={() => dispatch(action)}
          >
            {Icon ? (
              <Icon size={14} />
            ) : (
              <HelpCircle size={14} data-icon-placeholder="true" />
            )}
          </button>
        );
      })}
    </div>
  );
}
