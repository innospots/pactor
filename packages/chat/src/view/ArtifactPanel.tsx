import { X } from 'lucide-react';
import { Registry } from 'pactor-core';
import type { DslNode } from 'pactor-core';
import { MarkdownRenderer } from 'pactor-markdown';
import { DslRenderer, useRenderer } from 'pactor-runtime';
import { Component, useMemo, type ReactNode } from 'react';

import type { ChatArtifact } from '../artifact.js';
import { CHAT_DENIED_TYPE, guardChatDsl } from '../dsl-guard.js';
import { createChatRuntime, type ChatRuntime } from '../scope.js';
import { ChatDenied } from './PartRenderer.js';

/**
 * ArtifactPanel（spec: chat-artifact-panel，设计决策 D2/D3）：
 * 产出物预览面板 = 标题栏（标题 + kind 角标 + 关闭按钮）+ 内容区。
 *
 * 内容按 artifact.kind 分发内建渲染器：markdown 经 pactor-markdown
 * 安全渲染；code 只读代码块（language 仅作角标，不引高亮依赖）；
 * text 预格式文本；dsl 经 guardChatDsl 白名单守卫 + renderChildren
 * 活预览（与消息流 dsl part 同安全级），被拦截 / 渲染失败一律降级为
 * 受控占位块（ChatDenied 同款），MUST NOT 抛错。
 *
 * 纯展示组件：关闭只触发 onClose，不单方面修改外部状态。
 */
export interface ArtifactPanelProps {
  /** 当前产出物；null 时内容区为空态（inspector 槽场景常见） */
  artifact?: ChatArtifact | null;
  /** 面板内容槽：提供时整体替代内建渲染器（标题栏保留） */
  inspector?: ReactNode;
  /** 关闭按钮 / 遮罩点击回调 */
  onClose?: () => void;
  /** dsl 产出物活预览的 Safe Registry；缺省时 dsl 内容渲染降级块 */
  safeRegistry?: Registry<unknown>;
  /** 注入 dsl 预览作用域 user */
  user?: Record<string, unknown>;
  className?: string;
}

/** dsl 预览的运行时（与 ChatView 同款组装：Safe Registry + ChatDenied 占位） */
function useArtifactRuntime(
  safeRegistry: Registry<unknown> | undefined,
  user: Record<string, unknown> | undefined,
): ChatRuntime | undefined {
  return useMemo(() => {
    if (!safeRegistry) {
      return undefined;
    }
    const components = new Registry<unknown>('ChatArtifactRegistry');
    components.register(CHAT_DENIED_TYPE, ChatDenied);
    for (const name of safeRegistry.list()) {
      components.register(name, safeRegistry.get(name));
    }
    return createChatRuntime({ safeRegistry: components, user });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeRegistry, user]);
}

/**
 * dsl 活预览的受控降级守卫（chat-composition DslSlotGuard 同款模式）：
 * renderChildren 求值 / 组件渲染抛错时降级为占位块，不击穿面板。
 */
class ArtifactDslGuard extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  override state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  override componentDidCatch(error: unknown): void {
    console.warn('[pactor-chat] DSL 产出物渲染失败，已降级展示', error);
  }

  override render(): ReactNode {
    return this.state.failed ? (
      <div className="pactor-chat-denied">DSL 产出物渲染失败，已降级展示</div>
    ) : (
      this.props.children
    );
  }
}

/** 在 DslRenderer 上下文内经 renderChildren 渲染守卫后的 dsl 产出物 */
function ArtifactDslNode({ node }: { node: DslNode }): ReactNode {
  const { renderChildren } = useRenderer();
  return <>{renderChildren([node])}</>;
}

/** dsl 产出物内容：守卫 + 活预览；不可用 / 失败均受控降级 */
function ArtifactDslContent({
  content,
  runtime,
}: {
  content: unknown;
  runtime: ChatRuntime | undefined;
}): ReactNode {
  const node =
    typeof content === 'object' &&
    content !== null &&
    !Array.isArray(content) &&
    typeof (content as { type?: unknown }).type === 'string'
      ? (content as DslNode)
      : undefined;
  if (!node || !runtime) {
    return (
      <div className="pactor-chat-denied">
        {node
          ? 'DSL 预览不可用（未注入 Safe Registry）'
          : 'DSL 产出物内容无效'}
      </div>
    );
  }
  const guarded = guardChatDsl(node, runtime.context.components);
  return (
    <DslRenderer context={runtime.context} engine={runtime.engine}>
      <ArtifactDslGuard>
        <ArtifactDslNode node={guarded} />
      </ArtifactDslGuard>
    </DslRenderer>
  );
}

/** 内建渲染器：按 kind 分发 */
function ArtifactContent({
  artifact,
  runtime,
}: {
  artifact: ChatArtifact;
  runtime: ChatRuntime | undefined;
}): ReactNode {
  switch (artifact.kind) {
    case 'markdown':
      return <MarkdownRenderer content={String(artifact.content)} />;

    case 'code':
      return (
        <div className="pactor-chat-inspector__code">
          {artifact.language ? (
            <span className="pactor-chat-inspector__code-lang">
              {artifact.language}
            </span>
          ) : null}
          <pre>
            <code>{String(artifact.content)}</code>
          </pre>
        </div>
      );

    case 'text':
      return (
        <pre className="pactor-chat-inspector__text">
          {String(artifact.content)}
        </pre>
      );

    case 'dsl':
      return <ArtifactDslContent content={artifact.content} runtime={runtime} />;

    default:
      return null;
  }
}

export function ArtifactPanel({
  artifact,
  inspector,
  onClose,
  safeRegistry,
  user,
  className,
}: ArtifactPanelProps): ReactNode {
  const runtime = useArtifactRuntime(safeRegistry, user);
  return (
    <aside
      className={`pactor-chat-inspector${className ? ` ${className}` : ''}`}
      data-kind={artifact?.kind}
    >
      <div className="pactor-chat-inspector__header">
        <span className="pactor-chat-inspector__title">
          {artifact?.title ?? '产出物'}
        </span>
        {artifact ? (
          <span className="pactor-chat-inspector__kind">{artifact.kind}</span>
        ) : null}
        <button
          type="button"
          className="pactor-chat-icon-button pactor-chat-inspector__close"
          aria-label="关闭面板"
          onClick={onClose}
        >
          <X size={16} strokeWidth={1.7} />
        </button>
      </div>
      <div className="pactor-chat-inspector__body">
        {inspector !== undefined && inspector !== null ? (
          inspector
        ) : artifact ? (
          <ArtifactContent artifact={artifact} runtime={runtime} />
        ) : null}
      </div>
    </aside>
  );
}
