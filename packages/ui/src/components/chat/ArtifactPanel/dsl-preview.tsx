import { isDslSourceRef, Registry } from '@pactor-app/core';
import type { DslNode } from '@pactor-app/core';
import {
  ActionEngine,
  createRuntimeContext,
  DslRenderer,
  registerBuiltinActions,
  useRenderer,
  type RuntimeContext,
} from '@pactor-app/runtime';
import {
  Component,
  useMemo,
  type CSSProperties,
  type ReactNode,
} from 'react';

/**
 * dsl 产物活预览（自 @pactor-app/chat 的 dsl-guard / scope / ArtifactPanel
 * dsl 链移植）：白名单守卫 + Safe Registry 运行时 + 受控降级。
 * 被拦截 / 渲染失败一律降级为受控占位块，MUST NOT 抛错击穿面板。
 */

/** 受控占位节点的 DSL 类型名（占用不可能与业务组件冲突的名称） */
export const ARTIFACT_DENIED_TYPE = 'ChatDenied';

/** 白名单外组件的受控占位（注册名 ChatDenied，见 guardArtifactDsl） */
export function ArtifactDenied({ deniedType }: { deniedType?: string }) {
  return (
    <div
      data-slot="artifact-denied"
      data-denied-type={deniedType}
      className="rounded-md border border-dashed border-border p-3 text-sm text-muted-foreground"
    >
      该组件不允许在产物预览中使用{deniedType ? `：${deniedType}` : ''}
    </div>
  );
}

/**
 * 递归守卫 DSL 树：白名单内的节点原样保留（children 递归处理）；
 * 白名单外的节点替换为 `{ type: 'ChatDenied', props: { deniedType } }`，
 * 其 children 一并丢弃（不渲染其中任何内容）。
 * 纯函数、零 React，可纯 Node 测试。
 */
export function guardArtifactDsl(
  node: DslNode,
  registry: Registry<unknown>,
): DslNode {
  // 引用节点（component）依赖页面级命名组件，安全白名单场景一律拒绝
  const type = node.type ?? '(reference)';
  if (type !== ARTIFACT_DENIED_TYPE && !registry.has(type)) {
    return {
      type: ARTIFACT_DENIED_TYPE,
      props: { deniedType: type },
    };
  }
  if (node.children === undefined) {
    return node;
  }
  // 动态引用（DslSourceRef）children：远端内容无法静态过白名单，一律拒绝
  if (!Array.isArray(node.children)) {
    return {
      type: ARTIFACT_DENIED_TYPE,
      props: { deniedType: `${type}(remote)` },
    };
  }
  if (node.children.length === 0) {
    return node;
  }
  return {
    ...node,
    // 数组中混排的引用元素同样无法静态过白名单：替换为受控占位
    children: node.children.map((child) =>
      isDslSourceRef(child)
        ? { type: ARTIFACT_DENIED_TYPE, props: { deniedType: '(remote)' } }
        : guardArtifactDsl(child, registry),
    ),
  };
}

/** dsl 产物活预览的运行时（context + engine） */
export interface ArtifactPreviewRuntime {
  context: RuntimeContext;
  engine: ActionEngine;
}

/**
 * dsl 预览的运行时：Safe Registry 副本（叠加 ChatDenied 占位）+
 * 内建动作（permission 缺省放行，预览不接入权限 / capability）。
 */
export function useArtifactPreviewRuntime(
  safeRegistry: Registry<unknown> | undefined,
  user: Record<string, unknown> | undefined,
): ArtifactPreviewRuntime | undefined {
  return useMemo(() => {
    if (!safeRegistry) {
      return undefined;
    }
    const components = new Registry<unknown>('ArtifactPreviewRegistry');
    components.register(ARTIFACT_DENIED_TYPE, ArtifactDenied);
    for (const name of safeRegistry.list()) {
      components.register(name, safeRegistry.get(name));
    }
    const context = createRuntimeContext({ components, user });
    registerBuiltinActions(context.actions);
    return { context, engine: new ActionEngine(context) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeRegistry, user]);
}

/**
 * dsl 活预览的受控降级守卫：renderChildren 求值 / 组件渲染抛错时
 * 降级为占位块，不击穿面板。
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
    console.warn('[@pactor-app/ui] DSL 产物渲染失败，已降级展示', error);
  }

  override render(): ReactNode {
    return this.state.failed ? (
      <div
        data-slot="artifact-denied"
        className="rounded-md border border-dashed border-border p-3 text-sm text-muted-foreground"
      >
        DSL 产物渲染失败，已降级展示
      </div>
    ) : (
      this.props.children
    );
  }
}

/** 在 DslRenderer 上下文内经 renderChildren 渲染守卫后的 dsl 产物 */
function ArtifactDslNode({ node }: { node: DslNode }): ReactNode {
  const { renderChildren } = useRenderer();
  return <>{renderChildren([node])}</>;
}

/** dsl 产物内容：守卫 + 活预览；不可用 / 失败均受控降级 */
export function ArtifactDslContent({
  content,
  runtime,
  style,
}: {
  content: unknown;
  runtime: ArtifactPreviewRuntime | undefined;
  style?: CSSProperties;
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
      <div
        data-slot="artifact-denied"
        className="rounded-md border border-dashed border-border p-3 text-sm text-muted-foreground"
        style={style}
      >
        {node ? 'DSL 预览不可用（未注入 Safe Registry）' : 'DSL 产物内容无效'}
      </div>
    );
  }
  const guarded = guardArtifactDsl(node, runtime.context.components);
  return (
    <DslRenderer context={runtime.context} engine={runtime.engine}>
      <ArtifactDslGuard>
        <ArtifactDslNode node={guarded} />
      </ArtifactDslGuard>
    </DslRenderer>
  );
}
