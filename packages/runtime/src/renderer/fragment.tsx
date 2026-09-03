import type { DslNode } from '@pactor-app/core';

import { renderChildrenOf } from './renderer.js';
import {
  RendererContextProvider,
  useRenderer,
  type RendererContextValue,
} from './renderer-context.js';
import { UnsupportedComponent } from './unsupported.js';

/** Fragment 引用节点的组件类型名（设计文档第 50 节） */
export const FRAGMENT_COMPONENT_TYPE = 'Fragment';

export interface FragmentProps {
  /** 页面级命名组件（PageDsl.components）中的名字 */
  name?: string;
  /** 其余 props 透传到引用子树的根节点（引用处覆盖定义处同名字段） */
  [key: string]: unknown;
}

/**
 * Fragment：页面级命名组件引用（页面局部可复用子树，防止 DSL 嵌套过深）。
 *
 * 从 RuntimeContext.pageComponents 按 `name` 取 DslNode 子树，以引用处
 * 作用域渲染（`${row}` / `${event}` 等局部作用域原样可用，语义与
 * `call` 动作一致）；`name` 之外的 props 透传到子树根节点（覆盖同名
 * 字段），如 `{ name: 'detailPanel', style: { flex: 1 } }`。
 * `name` 缺失或不存在时渲染 UnsupportedComponent 占位；直接/间接循环
 * 引用经 RendererContextValue.fragmentStack 守卫，命中即不渲染并
 * console.warn（不击穿渲染层）。
 */
export function FragmentComponent(props: FragmentProps) {
  const value = useRenderer();
  const { name, ...overrides } = props;
  if (!name) {
    return <UnsupportedComponent type="Fragment(missing name)" />;
  }
  const stack = value.fragmentStack ?? [];
  if (stack.includes(name)) {
    console.warn(
      `[@pactor-app/runtime] Fragment 循环引用：${[...stack, name].join(' → ')}`,
    );
    return null;
  }
  const subtree = value.context.pageComponents[name];
  if (!subtree) {
    return <UnsupportedComponent type={`Fragment(${name})`} />;
  }
  // 引用处 props 覆盖子树根节点同名字段（overrides 已经表达式求值）
  const resolved: DslNode =
    Object.keys(overrides).length > 0
      ? { ...subtree, props: { ...subtree.props, ...overrides } }
      : subtree;
  // 引用链入栈，仅作用于该子树
  const scoped: RendererContextValue = { ...value, fragmentStack: [...stack, name] };
  scoped.renderChildren = (children, extraScope) =>
    renderChildrenOf(scoped, children, extraScope);
  return (
    <RendererContextProvider value={scoped}>
      {renderChildrenOf(scoped, [resolved])}
    </RendererContextProvider>
  );
}
