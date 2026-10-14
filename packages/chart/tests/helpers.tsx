// @vitest-environment jsdom
import './setup.js';

import type { DslNode } from '@pactor-app/core';
import {
  createRuntimeContext,
  DslRenderer,
  registerBuiltinActions,
  type CreateRuntimeContextOptions,
  type RuntimeContext,
} from '@pactor-app/runtime';
import { createComponentRegistry } from '@pactor-app/ui/components';
import { cleanup, render, type RenderResult } from '@testing-library/react';
import { afterEach, expect, vi } from 'vitest';

import { registerChartComponents } from '../src/index.js';

afterEach(cleanup);

export interface RenderDslResult extends RenderResult {
  context: RuntimeContext;
}

/** ui 主注册表 + 图表组件集合并后的 RuntimeContext 渲染 DSL 子树 */
export function renderDsl(
  node: DslNode,
  options: CreateRuntimeContextOptions = {},
): RenderDslResult {
  const components = options.components ?? createComponentRegistry();
  registerChartComponents(components);
  const context = createRuntimeContext({ ...options, components });
  registerBuiltinActions(context.actions);
  const result = render(<DslRenderer context={context} node={node} />);
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
