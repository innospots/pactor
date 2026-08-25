import type { DslNode, Registry } from 'pactor-core';
import { useRenderer } from 'pactor-runtime';
import { useRef, useState, type ReactNode } from 'react';

import type {
  ChatCapabilityRegistry,
  ChatConfirm,
  ChatPermissionChecker,
} from './capability-action.js';
import type { ChatAttachment } from './model.js';
import { ConversationStore } from './store.js';
import type { ChatTransport } from './transport.js';
import { AppShell } from './view/AppShell.js';
import { ChatView } from './view/ChatView.js';
import type { ChatSuggestion } from './view/EmptyState.js';

/**
 * ChatWorkspace 宿主服务（spec: chat-dsl-page，设计决策 D1）：
 * 全部运行时依赖与交互回调由宿主以工厂闭包注入——表达式作用域只承载
 * 可序列化数据，函数 / 实例不进 DSL props。
 */
export interface ChatWorkspaceServices {
  /** 传输层（必填）：发送即经 runChatTurn 驱动一轮对话 */
  transport: ChatTransport;
  /** 外部自持 store；与 storeFactory 二选一，缺省包内默认构造 */
  store?: ConversationStore;
  /** 缺省 store 的创建工厂（仅首渲染调用一次） */
  storeFactory?: () => ConversationStore;
  /** Safe Registry（createSafeRegistry 包装后的白名单注册表） */
  safeRegistry?: Registry<unknown>;
  /** capability 白名单与确认链 */
  capabilities?: ChatCapabilityRegistry;
  permission?: ChatPermissionChecker;
  confirm?: ChatConfirm;
  /** 注入 dsl part 作用域 user */
  user?: Record<string, unknown>;
  /**
   * 附件伪上传 / 上传：粘贴、拖拽、文件选择产出的 File[] 交给宿主处理，
   * 回传的 ChatAttachment[] 追加进受控附件区（支持异步）；发送后清空
   */
  onAttachFiles?: (
    files: File[],
  ) => ChatAttachment[] | Promise<ChatAttachment[]>;
  /** 附件卡片点击通知（预览等由宿主实现） */
  onAttachmentClick?: (attachment: ChatAttachment) => void;
  /** 发送回调（在 transport 驱动 turn 之前触发） */
  onSend?: (text: string) => void;
  /** 词边界 `@` 输入触发：query 为 `@` 后文本，anchorRect 为弹层锚点 */
  onMentionTrigger?: (query: string, anchorRect: DOMRect) => void;
  /** "+" 按钮触发弹层入口 */
  onPlusMenu?: (anchorRect: DOMRect) => void;
  /** Composer 工具栏左 / 右槽（ReactNode 闭包槽，纯 React 与 DSL 场景均可用） */
  toolbarStart?: ReactNode;
  toolbarEnd?: ReactNode;
  /** 工作区头部右侧扩展区（提供 title 或 headerExtra 时渲染头部） */
  headerExtra?: ReactNode;
}

/**
 * ChatWorkspace 的 DSL 安全 props（spec: chat-dsl-page / DSL 安全 props）：
 * 全部为 DSL 可表达的标量 / 数组 / 普通对象；函数与类实例一律不出现。
 */
export interface ChatWorkspaceProps {
  /** 工作区头部标题（提供 title 或服务注入 headerExtra 时渲染头部） */
  title?: string;
  /** 空会话问候语 */
  greeting?: string;
  /** 空会话副标题 */
  subtitle?: string;
  /** 空会话起始建议；空数组 / 未传时不渲染建议区 */
  suggestions?: ChatSuggestion[];
  /** 会话 id（注入 dsl part 作用域 conversation.id） */
  conversationId?: string;
  /** 注入 dsl part 作用域 params */
  params?: Record<string, unknown>;
  /**
   * 侧栏 DslNode 槽（任务 1.1 结论：renderer 对内嵌 DslNode prop 跳过提前
   * 求值，组件经 useRenderer().renderChildren 渲染）。提供时以 AppShell
   * 包裹工作区（侧栏 + 移动端抽屉）。仅页面运行时上下文内有效。
   */
  sidebar?: DslNode;
  /** Composer 工具栏右端 DslNode 槽（与服务注入的 toolbarEnd 先后渲染） */
  toolbarEnd?: DslNode;
  className?: string;
}

/**
 * 渲染内嵌 DslNode 槽：经 useRenderer().renderChildren 以当前作用域渲染
 * （Table columns[].cell 同款机制）。仅在页面运行时（DslRenderer）上下文
 * 内挂载——纯 React 直连场景请用服务的 ReactNode 槽。
 */
function DslNodeSlot({ node }: { node: DslNode }): ReactNode {
  const { renderChildren } = useRenderer();
  return renderChildren([node]);
}

/**
 * createChatWorkspace（spec: chat-dsl-page）：宿主闭包注入全部运行时服务，
 * 返回可注册进 DSL 组件注册表（options.components）的 ChatWorkspace 组件。
 *
 * 组件自持 ConversationStore（外部 store > storeFactory > 默认构造，ref
 * 保持——props 变化的重渲染不重建，spec: 重渲染不丢会话）与附件受控状态
 * （onAttachFiles 回传追加、发送后清空）。
 */
export function createChatWorkspace(
  services: ChatWorkspaceServices,
): (props: ChatWorkspaceProps) => ReactNode {
  function ChatWorkspace({
    title,
    greeting,
    subtitle,
    suggestions,
    conversationId,
    params,
    sidebar,
    toolbarEnd,
    className,
  }: ChatWorkspaceProps): ReactNode {
    // store 首渲染确定、ref 保持：重渲染 / props 变化不重建（决策 D2）
    const storeRef = useRef<ConversationStore | null>(null);
    if (storeRef.current === null) {
      storeRef.current =
        services.store ?? services.storeFactory?.() ?? new ConversationStore();
    }
    const store = storeRef.current;

    // 附件受控状态：宿主 onAttachFiles 回传的附件追加；发送后清空
    const [attachments, setAttachments] = useState<ChatAttachment[]>([]);

    const handleAttachFiles = services.onAttachFiles
      ? (files: File[]): void => {
          void Promise.resolve(services.onAttachFiles!(files)).then(
            (created) => {
              if (created && created.length > 0) {
                setAttachments((prev) => [...prev, ...created]);
              }
            },
          );
        }
      : undefined;

    const handleSend = (text: string): void => {
      services.onSend?.(text);
      setAttachments([]);
    };

    // 工具栏右端：宿主闭包 ReactNode 槽 + DSL DslNode 槽先后渲染
    const mergedToolbarEnd =
      services.toolbarEnd !== undefined || toolbarEnd !== undefined ? (
        <>
          {services.toolbarEnd}
          {toolbarEnd ? <DslNodeSlot node={toolbarEnd} /> : null}
        </>
      ) : undefined;

    const showHeader =
      title !== undefined || services.headerExtra !== undefined;

    const workspace = (
      <div
        className={`pactor-chat-workspace${className ? ` ${className}` : ''}`}
      >
        {showHeader ? (
          <header className="pactor-chat-workspace__header">
            <div className="pactor-chat-workspace__title">{title}</div>
            {services.headerExtra !== undefined ? (
              <div className="pactor-chat-workspace__header-extra">
                {services.headerExtra}
              </div>
            ) : null}
          </header>
        ) : null}
        <ChatView
          store={store}
          transport={services.transport}
          onSend={handleSend}
          safeRegistry={services.safeRegistry}
          capabilities={services.capabilities}
          permission={services.permission}
          confirm={services.confirm}
          conversationId={conversationId}
          user={services.user}
          params={params}
          greeting={greeting}
          subtitle={subtitle}
          suggestions={suggestions}
          attachments={attachments}
          onAttachmentsChange={setAttachments}
          onAttachFiles={handleAttachFiles}
          onAttachmentClick={services.onAttachmentClick}
          toolbarStart={services.toolbarStart}
          toolbarEnd={mergedToolbarEnd}
          onMentionTrigger={services.onMentionTrigger}
          onPlusMenu={services.onPlusMenu}
        />
      </div>
    );

    // 侧栏 DslNode 槽：提供时以 AppShell 包裹（侧栏 + 移动端抽屉）
    if (sidebar) {
      return (
        <AppShell sidebar={<DslNodeSlot node={sidebar} />}>
          {workspace}
        </AppShell>
      );
    }
    return workspace;
  }

  return ChatWorkspace;
}
