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
import { afterEach } from 'vitest';

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
