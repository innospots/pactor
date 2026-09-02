import type { DslNode } from '@pactor/core';
import type { Registry } from '@pactor/core';

/**
 * DSL part 的白名单守卫（设计决策 D3/D5）：渲染前把白名单之外的
 * 节点替换为受控"不允许"占位节点（`ChatDenied`），占位组件由
 * PartRenderer 注册进 Safe Registry。
 *
 * 纯函数、零 React，可纯 Node 测试。
 *
 * 注意：只处理 DSL 树的 type / children 主干；props 内嵌的 DSL 子树
 * （Table columns[].cell 等）由 runtime Renderer 的 UnsupportedComponent
 * 兜底（Safe Registry get 未命中即受控占位，不会渲染真实组件）。
 */

/** 受控占位节点的 DSL 类型名（占用不可能与业务组件冲突的名称） */
export const CHAT_DENIED_TYPE = 'ChatDenied';

/**
 * 递归守卫 DSL 树：白名单内的节点原样保留（children 递归处理）；
 * 白名单外的节点替换为 `{ type: 'ChatDenied', props: { deniedType } }`，
 * 其 children 一并丢弃（不渲染其中任何内容）。
 */
export function guardChatDsl(
  node: DslNode,
  registry: Registry<unknown>,
): DslNode {
  if (node.type !== CHAT_DENIED_TYPE && !registry.has(node.type)) {
    return {
      type: CHAT_DENIED_TYPE,
      props: { deniedType: node.type },
    };
  }
  if (!node.children || node.children.length === 0) {
    return node;
  }
  return {
    ...node,
    children: node.children.map((child) => guardChatDsl(child, registry)),
  };
}
