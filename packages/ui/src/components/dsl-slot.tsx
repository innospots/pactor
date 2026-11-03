import type { DslNode } from '@pactor-app/core';
import { useRenderer } from '@pactor-app/runtime';
import { isValidElement, type ReactNode } from 'react';

/**
 * 判断数据项内容是否为 DSL 节点（{ type: string } 的裸对象），
 * 否则按 ReactNode 处理（React 元素带 $$typeof，可区分）。
 */
export function isDslNode(value: unknown): value is DslNode {
  return (
    typeof value === 'object' &&
    value !== null &&
    !isValidElement(value) &&
    typeof (value as { type?: unknown }).type === 'string'
  );
}

/**
 * 数据驱动组件的自定义内容槽位（如 RadioGroup / Checkbox cards 选项行右端）：
 * ReactNode 直接渲染；DslNode 经 Renderer 渲染（独立子组件内调用
 * useRenderer，纯 React 使用且不传 DslNode 时不依赖 Renderer 上下文）。
 */
export function DslSlot({ content }: { content: DslNode | ReactNode }) {
  if (isDslNode(content)) {
    return <DslSlotInner node={content} />;
  }
  return <>{content}</>;
}

function DslSlotInner({ node }: { node: DslNode }) {
  const { renderChildren } = useRenderer();
  return <>{renderChildren([node])}</>;
}
