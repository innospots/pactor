// @vitest-environment jsdom
import './setup.js';

import type { DslNode } from '@pactor-app/core';
import {
  createRuntimeContext,
  DslRenderer,
  registerBuiltinActions,
  type ComponentRegistry,
  type CreateRuntimeContextOptions,
  type RuntimeContext,
} from '@pactor-app/runtime';
import { cleanup, render, type RenderResult } from '@testing-library/react';
import { afterEach, expect, vi } from 'vitest';

import { createShadcnComponentRegistry } from '../../src/components/index.js';

afterEach(cleanup);

export interface RenderDslResult extends RenderResult {
  context: RuntimeContext;
}

/** 以注册好内置组件（默认 shadcn kit）与内置动作的 RuntimeContext 渲染 DSL 子树 */
export function renderDsl(
  node: DslNode,
  options: CreateRuntimeContextOptions = {},
): RenderDslResult {
  const context = createRuntimeContext({
    ...options,
    components: options.components ?? createShadcnComponentRegistry(),
  });
  registerBuiltinActions(context.actions);
  const result = render(<DslRenderer context={context} node={node} />);
  return { context, ...result };
}

/** 以指定注册表渲染 DSL（契约一致性测试：同一份 DSL 多实现运行） */
export function renderDslWith(
  registry: ComponentRegistry,
  node: DslNode,
  options: CreateRuntimeContextOptions = {},
): RenderDslResult {
  return renderDsl(node, { ...options, components: registry });
}

/** 通用 props 契约探针值（className / style） */
export const COMMON_PROPS_PROBE = {
  className: 'biz-probe',
  style: { flex: 1, opacity: 0.5 },
} as const;

/** 断言根节点带通用 props 探针（class 合并 + 内联样式） */
export function expectCommonProps(root: Element | null) {
  expect(root, '组件应渲染出根节点').not.toBeNull();
  expect(root!.classList.contains(COMMON_PROPS_PROBE.className)).toBe(true);
  expect((root as HTMLElement).style.flexGrow).toBe('1');
  expect((root as HTMLElement).style.opacity).toBe('0.5');
}

/** 等待 setState 动作把 ${event} 写入指定 key 后断言其值（事件值规范化契约） */
export async function expectEventState(
  context: RuntimeContext,
  key: string,
  expected: unknown,
) {
  await vi.waitFor(() => {
    expect(context.state.get(key)).toEqual(expected);
  });
}

/** 断言选项元素内渲染图标（[data-slot=icon]）且位于 label 文本节点之前（DOM 顺序） */
export function expectIconBeforeLabel(item: Element, label: string) {
  const icon = item.querySelector('[data-slot=icon]');
  expect(icon, '选项内应渲染图标（[data-slot=icon]）').not.toBeNull();

  const walker = document.createTreeWalker(item, NodeFilter.SHOW_TEXT);
  let labelNode: Node | null = null;
  while (walker.nextNode()) {
    if (walker.currentNode.textContent === label) {
      labelNode = walker.currentNode;
      break;
    }
  }
  expect(labelNode, `选项内应存在 label 文本节点 "${label}"`).not.toBeNull();
  expect(
    icon!.compareDocumentPosition(labelNode!) & Node.DOCUMENT_POSITION_FOLLOWING,
    '图标应位于 label 文本之前',
  ).toBeTruthy();
}
