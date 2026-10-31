// @vitest-environment jsdom
import './setup.js';

import type { DslNode } from '@pactor-app/core';
import {
  createRuntimeContext,
  DslRenderer,
  I18nContextProvider,
  registerBuiltinActions,
  type CreateRuntimeContextOptions,
  type RuntimeContext,
} from '@pactor-app/runtime';
import { createComponentRegistry } from '@pactor-app/ui/components';
import { cleanup, render, type RenderResult } from '@testing-library/react';
import { afterEach, expect, vi } from 'vitest';

import { registerBlockComponents } from '../src/index.js';

afterEach(cleanup);

export interface RenderDslResult extends RenderResult {
  context: RuntimeContext;
}

/** ui 主注册表 + 区块组件集合并后的 RuntimeContext 渲染 DSL 子树 */
export function renderDsl(
  node: DslNode,
  options: CreateRuntimeContextOptions = {},
): RenderDslResult {
  const components = options.components ?? createComponentRegistry();
  registerBlockComponents(components);
  const context = createRuntimeContext({ ...options, components });
  registerBuiltinActions(context.actions);
  // 与 app shell 一致：DslRenderer 外包裹 I18nContextProvider（locale 选项随
  // context.i18n 生效，内置 pactor.* 文案按 locale 回退）
  const result = render(
    <I18nContextProvider value={context.i18n}>
      <DslRenderer context={context} node={node} />
    </I18nContextProvider>,
  );
  return { context, ...result };
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
