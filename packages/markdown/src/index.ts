// Markdown 渲染器（设计决策 D1/D2：AST 渲染，不启用 raw HTML）
export { isSafeUrl, MarkdownRenderer } from './renderer.js';
export type { MarkdownRendererProps } from './renderer.js';

// DSL 组件适配（设计决策 D3）
export { MarkdownDslComponent } from './dsl-component.js';
export type { MarkdownDslComponentProps } from './dsl-component.js';

// 注册入口
export { MARKDOWN_DSL_TYPE, registerMarkdownComponents } from './register.js';
