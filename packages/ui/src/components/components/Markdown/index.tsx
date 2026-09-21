/**
 * Markdown 适配器：直接复用 @pactor-app/markdown 的 DSL 组件
 * （安全边界：react-markdown AST 渲染，不渲染原始 HTML）。
 */
export { MarkdownDslComponent as Markdown } from '@pactor-app/markdown';
export type { MarkdownDslComponentProps as MarkdownProps } from '@pactor-app/markdown';
