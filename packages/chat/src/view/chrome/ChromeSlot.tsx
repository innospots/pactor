import type { DslNode } from '@pactor-app/core';
import { useRenderer } from '@pactor-app/runtime';
import { Component, type ComponentType, type ReactNode } from 'react';

import { ensureChatChromeActions } from './actions.js';

/**
 * ChromeSlot（spec: chat-chrome-dsl / chrome DSL 渲染层）：chat 通用
 * chrome 区域的 DSL 优先渲染入口。渲染决策按序：
 *
 * 1. 无 DslRenderer 上下文（纯 React 直连 / 测试）→ fallback
 *    （useRenderer 抛错，由 ChromeSlotGuard 捕获降级，DslSlotGuard 同款）；
 * 2. ambient registry 缺片段 requires 的任一组件类型 → console.warn +
 *    fallback（renderChildren 对未知类型静默渲染 UnsupportedComponent
 *    占位，MUST NOT 混入 chrome）；
 * 3. 类型齐备 → renderChildren 渲染片段，子树包 pactor-chat-chrome
 *    容器（令牌映射见 styles.css）。
 *
 * 渲染前经 ensureChatChromeActions 幂等注册 chat.* 内建动作
 * （不覆盖宿主同名动作）。
 */
export interface ChromeFragment {
  /** chrome DSL 片段（包内常量 / 由 props 构建的 DslNode 普通对象） */
  node: DslNode;
  /** 片段所需组件类型清单（渲染前的齐备性校验依据） */
  requires: string[];
}

export interface ChromeSlotProps {
  fragment: ChromeFragment;
  /** 回退渲染（chat 手写实现；无 renderer / 类型缺失时使用） */
  fallback: ReactNode;
  /**
   * 片段依赖的 chat 内部组件：渲染前注册进 ambient registry
   * （has 检查不覆盖宿主；宿主占用同名时视同类型缺失回退——
   * 不允许宿主实现混入 chrome 内部结构）。
   * props 形态各组件不同（无参 / artifact 等），此处收窄为 any
   */
  components?: Record<string, ComponentType<any>>;
  /** 仅 DSL 路径的外层包装（如 Composer 的拖放 / 冒泡承接容器） */
  wrap?: (children: ReactNode) => ReactNode;
}

/** 缺失告警去重（同一片段同一缺失集只告警一次） */
const warnedMissing = new Set<string>();

function warnMissingOnce(key: string, detail: string): void {
  if (!warnedMissing.has(key)) {
    warnedMissing.add(key);
    console.warn(`[@pactor-app/chat] ${detail}`);
  }
}

function ChromeSlotInner({
  fragment,
  fallback,
  components,
  wrap,
}: ChromeSlotProps): ReactNode {
  // try/catch 探测 renderer 上下文：useRenderer 的 throw 发生在
  // useContext 注册之后，hooks 数量恒定、不破坏 hooks 顺序。
  // 不用 error boundary 探测——边界捕获会触发 React 丢弃并从头
  // 重建子树，导致上游 render 期逻辑（如 storeFactory）双倍执行
  let renderer: ReturnType<typeof useRenderer>;
  try {
    renderer = useRenderer();
  } catch {
    // 无 DslRenderer 上下文（纯 React 直连 / 测试）→ 回退
    return <>{fallback}</>;
  }
  ensureChatChromeActions(renderer.context.actions);
  // chat 内部组件注册（不覆盖宿主；宿主已占用同名 → 冲突回退）
  if (components) {
    for (const [name, component] of Object.entries(components)) {
      const existing = renderer.context.components.get(name);
      if (existing !== undefined && existing !== component) {
        warnMissingOnce(
          `conflict:${name}`,
          `[@pactor-app/chat] chrome 内部组件名「${name}」被宿主占用，已回退内建实现`,
        );
        return <>{fallback}</>;
      }
      if (existing === undefined) {
        renderer.context.components.register(
          name,
          component as unknown as Parameters<
            typeof renderer.context.components.register
          >[1],
        );
      }
    }
  }
  const missing = fragment.requires.filter(
    (type) => !renderer.context.components.has(type),
  );
  if (missing.length > 0) {
    warnMissingOnce(
      `${fragment.node.type}:${missing.join(',')}`,
      `[@pactor-app/chat] chrome DSL 片段所需组件类型缺失（${missing.join(' / ')}），已回退内建实现`,
    );
    return <>{fallback}</>;
  }
  const rendered = (
    <div className="pactor-chat-chrome">
      {renderer.renderChildren([fragment.node])}
    </div>
  );
  return wrap ? <>{wrap(rendered)}</> : rendered;
}

interface ChromeSlotGuardProps {
  fallback: ReactNode;
  children?: ReactNode;
}

/** 渲染期异常的兜底守卫（renderChildren 内部组件抛错时降级，不影响整页） */
class ChromeSlotGuard extends Component<
  ChromeSlotGuardProps,
  { failed: boolean }
> {
  override state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  override render(): ReactNode {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function ChromeSlot(props: ChromeSlotProps): ReactNode {
  return (
    <ChromeSlotGuard fallback={props.fallback}>
      <ChromeSlotInner {...props} />
    </ChromeSlotGuard>
  );
}
