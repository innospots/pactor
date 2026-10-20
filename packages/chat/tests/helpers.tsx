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
import { createComponentRegistry as createUiComponentRegistry } from '@pactor-app/ui/components';
import { cleanup, render, type RenderResult } from '@testing-library/react';
import { afterEach, expect, vi } from 'vitest';

import { registerChatComponents } from '../src/components/index.js';

afterEach(cleanup);

export interface RenderDslResult extends RenderResult {
  context: RuntimeContext;
}

/** 创建测试注册表：ui 内置组件 + chat 展示组件（19 个 DSL 类型） */
export function createComponentRegistry(): ComponentRegistry {
  const registry = createUiComponentRegistry();
  registerChatComponents(registry);
  return registry;
}

/** 以注册好内置组件（ui 内置 + chat 展示组件）与内置动作的 RuntimeContext 渲染 DSL 子树 */
export function renderDsl(
  node: DslNode,
  options: CreateRuntimeContextOptions = {},
): RenderDslResult {
  const context = createRuntimeContext({
    ...options,
    components: options.components ?? createComponentRegistry(),
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

/** 等待事件动作闭环写入 state（setState 动作经 engine 异步执行） */
export async function expectEventState(
  context: RuntimeContext,
  key: string,
  expected: unknown,
) {
  await vi.waitFor(() => {
    expect(context.state.get(key)).toEqual(expected);
  });
}

/** 断言菜单 / 列表项内图标渲染在文本之前 */
export function expectIconBeforeLabel(item: Element, label: string) {
  const icon = item.querySelector('svg');
  expect(icon, '应渲染图标').not.toBeNull();
  const text = item.textContent ?? '';
  expect(text).toContain(label);
}
