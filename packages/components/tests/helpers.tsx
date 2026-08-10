// @vitest-environment jsdom
import './setup.js';

import type { DslNode } from 'pactor-core';
import {
  createRuntimeContext,
  DslRenderer,
  registerBuiltinActions,
  type CreateRuntimeContextOptions,
  type RuntimeContext,
} from 'pactor-runtime';
import { cleanup, render, type RenderResult } from '@testing-library/react';
import { afterEach } from 'vitest';

import { createBuiltinComponentRegistry } from '../src/index.js';

afterEach(cleanup);

export interface RenderDslResult extends RenderResult {
  context: RuntimeContext;
}

/** 以注册好内置组件与内置动作的 RuntimeContext 渲染 DSL 子树 */
export function renderDsl(
  node: DslNode,
  options: CreateRuntimeContextOptions = {},
): RenderDslResult {
  const context = createRuntimeContext({
    ...options,
    components: options.components ?? createBuiltinComponentRegistry(),
  });
  registerBuiltinActions(context.actions);
  const result = render(<DslRenderer context={context} node={node} />);
  return { context, ...result };
}
