import type { Registry } from '@pactor/core';

import { MarkdownDslComponent } from './dsl-component.js';

/** Markdown 组件的 DSL 类型名 */
export const MARKDOWN_DSL_TYPE = 'Markdown';

/**
 * 把 Markdown DSL 组件注册到给定的 Component Registry
 * （@pactor/runtime 的 `ComponentRegistry` 即 `Registry<unknown>`，
 * @pactor/chat 的 Safe Registry 场景亦可复用）。
 */
export function registerMarkdownComponents(registry: Registry<unknown>): void {
  registry.register(MARKDOWN_DSL_TYPE, MarkdownDslComponent);
}
