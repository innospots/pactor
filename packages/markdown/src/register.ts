import type { Registry } from '@pactor-app/core';

import { MarkdownDslComponent } from './dsl-component.js';
import { MarkdownEditorDslComponent } from './dsl-editor-component.js';

/** Markdown 组件的 DSL 类型名 */
export const MARKDOWN_DSL_TYPE = 'Markdown';

/** MarkdownEditor 组件的 DSL 类型名 */
export const MARKDOWN_EDITOR_DSL_TYPE = 'MarkdownEditor';

/**
 * 把 Markdown / MarkdownEditor DSL 组件注册到给定的 Component Registry
 * （@pactor-app/runtime 的 `ComponentRegistry` 即 `Registry<unknown>`，
 * @pactor-app/chat 的 Safe Registry 场景亦可复用——注意 Safe Registry
 * 场景通常只需只读渲染，可不注册 MarkdownEditor）。
 */
export function registerMarkdownComponents(registry: Registry<unknown>): void {
  registry.register(MARKDOWN_DSL_TYPE, MarkdownDslComponent);
  registry.register(MARKDOWN_EDITOR_DSL_TYPE, MarkdownEditorDslComponent);
}
