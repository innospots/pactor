import type { DslNode } from 'pactor-core';
import { useRenderer } from 'pactor-runtime';
import {
  Component,
  isValidElement,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import type { ChatWorkspaceServices } from './chat-workspace.js';
import type { ChatAttachment } from './model.js';
import { ConversationStore } from './store.js';
import { AppShell } from './view/AppShell.js';
import { ChatView } from './view/ChatView.js';
import type { ChatSuggestion } from './view/EmptyState.js';

/**
 * 渲染内嵌 DslNode 槽：经 useRenderer().renderChildren 以当前作用域渲染
 * （Table columns[].cell 同款机制）。仅在页面运行时（DslRenderer）上下文
 * 内挂载——纯 React 直连场景请用服务的 ReactNode 槽。
 */
function DslNodeSlotInner({ node }: { node: DslNode }): ReactNode {
  const { renderChildren } = useRenderer();
  return renderChildren([node]);
}

/**
 * DslNode 槽的受控降级守卫（spec: chat-dsl-component）：useRenderer 在
 * DslRenderer 之外抛错，纯 React 场景传入 DslNode 槽时告警并跳过，
 * 不击穿整棵子树。
 */
class DslSlotGuard extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  override state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  override componentDidCatch(): void {
    console.warn(
      '[pactor-chat] DslNode 槽仅在页面运行时（DslRenderer）上下文内可渲染，已跳过',
    );
  }

  override render(): ReactNode {
    return this.state.failed ? null : this.props.children;
  }
}

/** 带降级守卫的 DslNode 槽渲染 */
export function DslNodeSlot({ node }: { node: DslNode }): ReactNode {
  return (
    <DslSlotGuard>
      <DslNodeSlotInner node={node} />
    </DslSlotGuard>
  );
}

/**
 * 判定值是否为 DslNode（带字符串 `type` 字段的普通对象）。
 * React 元素同样带 `type`（宿主元素为字符串），须先经 isValidElement 排除。
 */
export function isDslNodeValue(value: unknown): value is DslNode {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !isValidElement(value) &&
    typeof (value as { type?: unknown }).type === 'string'
  );
}

/**
 * 解析 DslNode / ReactNode 双型槽（spec: chat-dsl-component，设计决策 D3）：
 * DslNode 经 renderChildren 渲染（页面运行时内），ReactNode 原样渲染。
 */
export function resolveSlot(slot: DslNode | ReactNode | undefined): ReactNode {
  if (slot === undefined || slot === null) {
    return undefined;
  }
  if (isDslNodeValue(slot)) {
    return <DslNodeSlot node={slot} />;
  }
  return slot;
}

/**
 * ChatComposition 的入参：服务 + 已解析的槽位内容（ReactNode）。
 * DslNode / ReactNode 的判定与渲染由调用方（Chat / ChatWorkspace）完成。
 */
export interface ChatCompositionProps {
  services: ChatWorkspaceServices;
  title?: string;
  greeting?: string;
  subtitle?: string;
  suggestions?: ChatSuggestion[];
  conversationId?: string;
  params?: Record<string, unknown>;
  /** 是否渲染头部（由调用方按自身默认规则计算后传入） */
  showHeader: boolean;
  /** 整体替换内建 header（提供且 showHeader 时渲染） */
  header?: ReactNode;
  /** 内建 header 标题右侧扩展区 */
  headerExtra?: ReactNode;
  /** 侧栏内容（提供时以 AppShell 包裹工作区，含移动端抽屉） */
  sidebar?: ReactNode;
  /** Composer 工具栏右端附加槽（与服务注入的 toolbarEnd 先后渲染） */
  toolbarEnd?: ReactNode;
  className?: string;
  /** 发送回调：在 services.onSend 之后触发，均在 transport turn 之前 */
  onSend?: (text: string) => void;
}

/**
 * ChatComposition（spec: chat-dsl-component，设计决策 D5）：
 * ChatWorkspace 与 Chat 共用的组合逻辑——AppShell 包裹 / 工作区头部 /
 * ChatView 装配 / store 自持（ref 保持）/ 附件受控状态。槽位一律以
 * 已解析的 ReactNode 传入，组合层不关心 DSL。
 */
export function ChatComposition({
  services,
  title,
  greeting,
  subtitle,
  suggestions,
  conversationId,
  params,
  showHeader,
  header,
  headerExtra,
  sidebar,
  toolbarEnd,
  className,
  onSend,
}: ChatCompositionProps): ReactNode {
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
    onSend?.(text);
    setAttachments([]);
  };

  // 工具栏右端：宿主闭包 ReactNode 槽 + 附加槽（如 DSL toolbarEnd）先后渲染
  const mergedToolbarEnd =
    services.toolbarEnd !== undefined || toolbarEnd !== undefined ? (
      <>
        {services.toolbarEnd}
        {toolbarEnd}
      </>
    ) : undefined;

  const workspace = (
    <div
      className={`pactor-chat-workspace${className ? ` ${className}` : ''}`}
    >
      {showHeader ? (
        (header ?? (
          <header className="pactor-chat-workspace__header">
            <div className="pactor-chat-workspace__title">{title}</div>
            {headerExtra !== undefined ? (
              <div className="pactor-chat-workspace__header-extra">
                {headerExtra}
              </div>
            ) : null}
          </header>
        ))
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

  // 侧栏：提供时以 AppShell 包裹（侧栏 + 移动端抽屉）
  if (sidebar) {
    return <AppShell sidebar={sidebar}>{workspace}</AppShell>;
  }
  return workspace;
}
